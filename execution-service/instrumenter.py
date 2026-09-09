"""
ICS C Programming Learning Lab — Python C AST Instrumenter
Injects non-intrusive tracer.h telemetry calls into student C source code.
"""

from typing import Dict, Any, List
from ast_parser import CASTParser

class CInstrumenterPy:
    def __init__(self):
        self.parser = CASTParser()

    def instrument(self, source_code: str) -> Dict[str, Any]:
        lines = source_code.splitlines()
        output_lines: List[str] = [
            '#include "tracer.h"',
            '#include <stdio.h>',
            ''
        ]
        
        variable_types: Dict[str, str] = {}
        in_main = False
        main_brace_depth = 0
        has_main = False

        for i, raw_line in enumerate(lines):
            line_num = i + 1
            trimmed = raw_line.strip()

            # Check main
            if "int main" in trimmed:
                in_main = True
                has_main = True
                output_lines.append(raw_line)
                if "{" in trimmed:
                    main_brace_depth += 1
                    output_lines.append("    __trace_init();")
                continue

            if in_main and trimmed == "{" and main_brace_depth == 0:
                main_brace_depth += 1
                output_lines.append(raw_line)
                output_lines.append("    __trace_init();")
                continue

            # Track braces
            main_brace_depth += raw_line.count("{") - raw_line.count("}")

            # Return in main
            if in_main and trimmed.startswith("return"):
                output_lines.append(f"    __trace_line({line_num});")
                output_lines.append("    __trace_finish();")
                output_lines.append(raw_line)
                if main_brace_depth <= 0:
                    in_main = False
                continue

            node = self.parser.analyze_line(raw_line, line_num)

            if node["kind"] == "variable_declaration":
                v_type = node["type"]
                v_name = node["name"]
                variable_types[v_name] = v_type
                output_lines.append(f"    __trace_line({line_num});")
                output_lines.append(f"    {trimmed}")
                output_lines.append(
                    f'    __trace_var_create("{v_name}", "{v_type}", &{v_name}, sizeof({v_name}), {line_num});'
                )
                continue

            elif node["kind"] == "assignment":
                v_name = node["name"]
                v_expr = node["expr"].replace('"', '\\"')
                v_type = variable_types.get(v_name, "int")
                output_lines.append(f"    __trace_line({line_num});")
                output_lines.append(f"    {trimmed}")
                output_lines.append(
                    f'    __trace_var_assign("{v_name}", "{v_type}", &{v_name}, sizeof({v_name}), {line_num}, "{v_expr}");'
                )
                continue

            elif node["kind"] == "if_condition":
                cond = node["condition"]
                escaped_cond = cond.replace('"', '\\"')
                brace = "{" if node["has_brace"] else ""
                output_lines.append(f"    __trace_line({line_num});")
                output_lines.append(
                    f'    if (__trace_cond({line_num}, "{escaped_cond}", ({cond}), "then")) {brace}'
                )
                continue

            elif node["kind"] == "for_loop":
                init = node["init"]
                cond = node["condition"]
                step = node["step"]
                escaped_cond = cond.replace('"', '\\"')
                brace = "{" if node["has_brace"] else ""
                output_lines.append(f"    __trace_line({line_num});")
                output_lines.append(
                    f'    for ({init}; __trace_cond({line_num}, "{escaped_cond}", ({cond}), "loop"); {step}) {brace}'
                )
                continue

            if len(trimmed) > 0 and not trimmed.startswith("//") and not trimmed.startswith("#") and trimmed not in ("{", "}"):
                output_lines.append(f"    __trace_line({line_num});")

            output_lines.append(raw_line)

        return {
            "instrumented_code": "\n".join(output_lines),
            "variable_types": variable_types,
            "has_main": has_main,
        }
