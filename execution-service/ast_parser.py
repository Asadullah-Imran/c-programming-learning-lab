"""
ICS C Programming Learning Lab — C AST Parser
Parses C source code statements and expressions into structured tokens and AST elements.
"""

import re
from typing import List, Dict, Any, Optional

class CASTParser:
    """
    Parser for introductory C code syntax:
    - Variable declarations and assignments
    - Control flow (if-else, for, while)
    - Function definitions and calls
    """
    
    TYPE_REGEX = re.compile(r'\b(int|char|float|double|long|short|unsigned|void)\b')
    VAR_DECL_REGEX = re.compile(r'^(int|char|float|double)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:=\s*([^;]+))?;')
    ASSIGN_REGEX = re.compile(r'^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^;]+);')
    IF_REGEX = re.compile(r'^if\s*\((.*)\)\s*(\{?)$')
    FOR_REGEX = re.compile(r'^for\s*\(([^;]*);([^;]*);([^)]*)\)\s*(\{?)$')
    WHILE_REGEX = re.compile(r'^while\s*\((.*)\)\s*(\{?)$')

    @classmethod
    def analyze_line(cls, line_text: str, line_number: int) -> Dict[str, Any]:
        trimmed = line_text.strip()
        
        # Variable Declaration
        match_decl = cls.VAR_DECL_REGEX.match(trimmed)
        if match_decl:
            return {
                "kind": "variable_declaration",
                "line": line_number,
                "type": match_decl.group(1),
                "name": match_decl.group(2),
                "init_expr": match_decl.group(3).strip() if match_decl.group(3) else None,
            }
            
        # Assignment
        match_assign = cls.ASSIGN_REGEX.match(trimmed)
        if match_assign and not trimmed.startswith("return"):
            return {
                "kind": "assignment",
                "line": line_number,
                "name": match_assign.group(1),
                "expr": match_assign.group(2).strip(),
            }
            
        # If Statement
        match_if = cls.IF_REGEX.match(trimmed)
        if match_if:
            return {
                "kind": "if_condition",
                "line": line_number,
                "condition": match_if.group(1).strip(),
                "has_brace": bool(match_if.group(2)),
            }
            
        # For Loop
        match_for = cls.FOR_REGEX.match(trimmed)
        if match_for:
            return {
                "kind": "for_loop",
                "line": line_number,
                "init": match_for.group(1).strip(),
                "condition": match_for.group(2).strip(),
                "step": match_for.group(3).strip(),
                "has_brace": bool(match_for.group(4)),
            }
            
        # While Loop
        match_while = cls.WHILE_REGEX.match(trimmed)
        if match_while:
            return {
                "kind": "while_loop",
                "line": line_number,
                "condition": match_while.group(1).strip(),
                "has_brace": bool(match_while.group(2)),
            }
            
        return {
            "kind": "statement",
            "line": line_number,
            "text": trimmed,
        }
