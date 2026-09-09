#include "tracer.h"
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

static FILE* __trace_file = NULL;
static int __trace_event_id = 0;
static int __trace_initialized = 0;
static int __trace_max_events = 1000; // Safety cap to prevent infinite loop event explosion

// Helper to escape string literals for JSON
static void json_escape(const char* src, char* dest, size_t dest_size) {
    size_t d = 0;
    for (size_t s = 0; src[s] != '\0' && d + 4 < dest_size; s++) {
        switch (src[s]) {
            case '\"': dest[d++] = '\\'; dest[d++] = '\"'; break;
            case '\\': dest[d++] = '\\'; dest[d++] = '\\'; break;
            case '\n': dest[d++] = '\\'; dest[d++] = 'n'; break;
            case '\r': dest[d++] = '\\'; dest[d++] = 'r'; break;
            case '\t': dest[d++] = '\\'; dest[d++] = 't'; break;
            default:   dest[d++] = src[s]; break;
        }
    }
    dest[d] = '\0';
}

static void ensure_trace_file(void) {
    if (__trace_file != NULL) return;

    const char* env_path = getenv("TRACE_OUTPUT_FILE");
    if (env_path && strlen(env_path) > 0) {
        __trace_file = fopen(env_path, "w");
    }

    if (__trace_file == NULL) {
        // Fallback to stderr with special machine-readable prefix
        __trace_file = stderr;
    }
}

static void emit_event(const char* type, int line, const char* payload_json) {
    if (++__trace_event_id > __trace_max_events) {
        if (__trace_event_id == __trace_max_events + 1) {
            fprintf(__trace_file,
                "__ICS_TRACE__:{\"id\":%d,\"type\":\"timeout\",\"line\":%d,\"payload\":{\"message\":\"Execution loop limit reached (max %d events). Possible infinite loop.\"}}\n",
                __trace_event_id, line, __trace_max_events
            );
            fflush(__trace_file);
            exit(0);
        }
        return;
    }

    ensure_trace_file();

    if (__trace_file == stderr) {
        fprintf(__trace_file, "__ICS_TRACE__:{\"id\":%d,\"type\":\"%s\",\"line\":%d,\"payload\":%s}\n",
                __trace_event_id, type, line, payload_json);
    } else {
        fprintf(__trace_file, "{\"id\":%d,\"type\":\"%s\",\"line\":%d,\"payload\":%s}\n",
                __trace_event_id, type, line, payload_json);
    }
    fflush(__trace_file);
}

void __trace_init(void) {
    if (__trace_initialized) return;
    __trace_initialized = 1;
    ensure_trace_file();
    emit_event("program_start", 1, "{}");
}

void __trace_finish(void) {
    emit_event("program_end", 1, "{}");
    if (__trace_file && __trace_file != stderr) {
        fclose(__trace_file);
        __trace_file = NULL;
    }
}

void __trace_line(int line) {
    char payload[64];
    snprintf(payload, sizeof(payload), "{\"line\":%d}", line);
    emit_event("statement_start", line, payload);
}

void __trace_stmt(int line, const char* stmt_text) {
    char escaped[256];
    char payload[512];
    json_escape(stmt_text ? stmt_text : "", escaped, sizeof(escaped));
    snprintf(payload, sizeof(payload), "{\"statement\":\"%s\"}", escaped);
    emit_event("statement_start", line, payload);
}

static void format_variable_value(const char* type_str, const void* addr, char* out_val, size_t out_size) {
    if (addr == NULL) {
        snprintf(out_val, out_size, "null");
        return;
    }

    if (strcmp(type_str, "int") == 0) {
        snprintf(out_val, out_size, "%d", *(const int*)addr);
    } else if (strcmp(type_str, "char") == 0) {
        char c = *(const char*)addr;
        if (c >= 32 && c <= 126 && c != '\"' && c != '\\') {
            snprintf(out_val, out_size, "\"%c\"", c);
        } else {
            snprintf(out_val, out_size, "%d", (int)c);
        }
    } else if (strcmp(type_str, "float") == 0) {
        snprintf(out_val, out_size, "%.2f", *(const float*)addr);
    } else if (strcmp(type_str, "double") == 0) {
        snprintf(out_val, out_size, "%.4f", *(const double*)addr);
    } else if (strcmp(type_str, "pointer") == 0) {
        snprintf(out_val, out_size, "\"%p\"", *(const void* const*)addr);
    } else {
        snprintf(out_val, out_size, "%d", *(const int*)addr);
    }
}

void __trace_var_create(const char* name, const char* type_str, const void* addr, size_t size, int line) {
    char val_str[128];
    char payload[512];
    char addr_str[32];

    format_variable_value(type_str, addr, val_str, sizeof(val_str));
    snprintf(addr_str, sizeof(addr_str), "0x%08llX", (unsigned long long)(uintptr_t)addr);

    snprintf(payload, sizeof(payload),
             "{\"name\":\"%s\",\"dataType\":\"%s\",\"value\":%s,\"sizeBytes\":%zu,\"address\":\"%s\"}",
             name, type_str, val_str, size, addr_str);

    emit_event("variable_create", line, payload);
}

void __trace_var_assign(const char* name, const char* type_str, const void* addr, size_t size, int line, const char* expr) {
    (void)size;
    char val_str[128];
    char escaped_expr[256];
    char payload[512];

    format_variable_value(type_str, addr, val_str, sizeof(val_str));
    json_escape(expr ? expr : "", escaped_expr, sizeof(escaped_expr));

    snprintf(payload, sizeof(payload),
             "{\"name\":\"%s\",\"newValue\":%s,\"expression\":\"%s\"}",
             name, val_str, escaped_expr);

    emit_event("assignment", line, payload);
}

int __trace_cond(int line, const char* expr_str, int result, const char* branch) {
    char escaped_expr[256];
    char payload[512];
    json_escape(expr_str ? expr_str : "", escaped_expr, sizeof(escaped_expr));

    snprintf(payload, sizeof(payload),
             "{\"expression\":\"%s\",\"result\":%s,\"branch\":\"%s\"}",
             escaped_expr, result ? "true" : "false", branch ? branch : (result ? "then" : "else"));

    emit_event("condition", line, payload);
    return result;
}

void __trace_loop_iter(int line, const char* loop_type, int iteration, const char* cond_expr, int is_met) {
    char escaped_expr[256];
    char payload[512];
    json_escape(cond_expr ? cond_expr : "", escaped_expr, sizeof(escaped_expr));

    snprintf(payload, sizeof(payload),
             "{\"loopType\":\"%s\",\"iteration\":%d,\"conditionExpression\":\"%s\",\"isConditionMet\":%s}",
             loop_type ? loop_type : "for", iteration, escaped_expr, is_met ? "true" : "false");

    emit_event("loop_iteration", line, payload);
}

void __trace_loop_end(int line, const char* loop_type) {
    (void)loop_type;
    emit_event("loop_end", line, "{}");
}

void __trace_fn_call(const char* fn_name, int call_line) {
    char payload[256];
    snprintf(payload, sizeof(payload), "{\"functionName\":\"%s\",\"callLine\":%d}", fn_name, call_line);
    emit_event("function_call", call_line, payload);
}

void __trace_fn_param(const char* fn_name, const char* param_name, const char* type_str, const void* addr, size_t size, const char* original_arg) {
    char val_str[128];
    char payload[512];
    format_variable_value(type_str, addr, val_str, sizeof(val_str));

    snprintf(payload, sizeof(payload),
             "{\"functionName\":\"%s\",\"name\":\"%s\",\"dataType\":\"%s\",\"value\":%s,\"sizeBytes\":%zu,\"originalArg\":\"%s\"}",
             fn_name, param_name, type_str, val_str, size, original_arg ? original_arg : "");

    emit_event("variable_create", 1, payload);
}

void __trace_fn_return(const char* fn_name, int return_line, long long ret_val) {
    char payload[256];
    snprintf(payload, sizeof(payload),
             "{\"functionName\":\"%s\",\"returnLine\":%d,\"returnValue\":%lld}",
             fn_name, return_line, ret_val);

    emit_event("function_return", return_line, payload);
}

void __trace_output(const char* text) {
    char escaped[512];
    char payload[1024];
    json_escape(text ? text : "", escaped, sizeof(escaped));
    snprintf(payload, sizeof(payload), "{\"text\":\"%s\"}", escaped);
    emit_event("output", 1, payload);
}
