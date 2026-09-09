#ifndef TRACER_H
#define TRACER_H

#include <stddef.h>
#include <stdio.h>

#ifdef __cplusplus
extern "C" {
#endif

/**
 * ICS C Programming Learning Lab — Tracing Runtime Library
 * Injects non-intrusive runtime telemetry hooks into student C code.
 */

// Lifecycle hooks
void __trace_init(void);
void __trace_finish(void);

// Statement & Line hooks
void __trace_line(int line);
void __trace_stmt(int line, const char* stmt_text);

// Variable declaration & mutation hooks
void __trace_var_create(const char* name, const char* type_str, const void* addr, size_t size, int line);
void __trace_var_assign(const char* name, const char* type_str, const void* addr, size_t size, int line, const char* expr);

// Control flow hooks
int __trace_cond(int line, const char* expr_str, int result, const char* branch);
void __trace_loop_iter(int line, const char* loop_type, int iteration, const char* cond_expr, int is_met);
void __trace_loop_end(int line, const char* loop_type);

// Function invocation & call stack hooks
void __trace_fn_call(const char* fn_name, int call_line);
void __trace_fn_param(const char* fn_name, const char* param_name, const char* type_str, const void* addr, size_t size, const char* original_arg);
void __trace_fn_return(const char* fn_name, int return_line, long long ret_val);

// Output capture hook
void __trace_output(const char* text);

#ifdef __cplusplus
}
#endif

#endif // TRACER_H
