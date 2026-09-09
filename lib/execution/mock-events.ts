import { ExecutionEvent } from "@/types/execution";

export interface MockScenario {
  id: string;
  title: string;
  description: string;
  code: string;
  events: ExecutionEvent[];
}

/**
 * Scenario 1: Classic Variable Swap
 */
export const SCENARIO_VARIABLE_SWAP: MockScenario = {
  id: "scenario-var-swap",
  title: "Variable Declaration & Memory Swap",
  description: "Declaring two variables and swapping their values using a temporary buffer variable.",
  code: `int a = 5;
int b = 10;
int temp = a;
a = b;
b = temp;`,
  events: [
    {
      id: 1,
      type: "program_start",
      line: 1,
      payload: {},
    },
    {
      id: 2,
      type: "variable_create",
      line: 1,
      payload: {
        name: "a",
        dataType: "int",
        value: 5,
        sizeBytes: 4,
        address: "0x7FFE0010",
      },
    },
    {
      id: 3,
      type: "variable_create",
      line: 2,
      payload: {
        name: "b",
        dataType: "int",
        value: 10,
        sizeBytes: 4,
        address: "0x7FFE0014",
      },
    },
    {
      id: 4,
      type: "variable_create",
      line: 3,
      payload: {
        name: "temp",
        dataType: "int",
        value: 5,
        sizeBytes: 4,
        address: "0x7FFE0018",
      },
    },
    {
      id: 5,
      type: "assignment",
      line: 4,
      payload: {
        name: "a",
        oldValue: 5,
        newValue: 10,
        expression: "b",
      },
    },
    {
      id: 6,
      type: "assignment",
      line: 5,
      payload: {
        name: "b",
        oldValue: 10,
        newValue: 5,
        expression: "temp",
      },
    },
    {
      id: 7,
      type: "program_end",
      line: 5,
      payload: {},
    },
  ],
};

/**
 * Scenario 2: Conditional Branching (If-Else)
 */
export const SCENARIO_IF_ELSE: MockScenario = {
  id: "scenario-if-else",
  title: "If-Else Decision Making",
  description: "Evaluating a relational expression to determine which code branch executes.",
  code: `int marks = 85;
char grade = 'F';

if (marks >= 80) {
    grade = 'A';
} else {
    grade = 'B';
}

printf("Grade: %c\\n", grade);`,
  events: [
    {
      id: 1,
      type: "program_start",
      line: 1,
      payload: {},
    },
    {
      id: 2,
      type: "variable_create",
      line: 1,
      payload: {
        name: "marks",
        dataType: "int",
        value: 85,
        sizeBytes: 4,
        address: "0x7FFE0010",
      },
    },
    {
      id: 3,
      type: "variable_create",
      line: 2,
      payload: {
        name: "grade",
        dataType: "char",
        value: "'F'",
        sizeBytes: 1,
        address: "0x7FFE0014",
      },
    },
    {
      id: 4,
      type: "condition",
      line: 4,
      payload: {
        expression: "marks >= 80",
        substitutedExpression: "85 >= 80",
        result: true,
        branch: "then",
      },
    },
    {
      id: 5,
      type: "assignment",
      line: 5,
      payload: {
        name: "grade",
        oldValue: "'F'",
        newValue: "'A'",
        expression: "'A'",
      },
    },
    {
      id: 6,
      type: "branch_exit",
      line: 8,
      payload: {},
    },
    {
      id: 7,
      type: "output",
      line: 10,
      payload: {
        text: "Grade: A\n",
      },
    },
    {
      id: 8,
      type: "program_end",
      line: 10,
      payload: {},
    },
  ],
};

/**
 * Scenario 3: For Loop Accumulator
 */
export const SCENARIO_FOR_LOOP: MockScenario = {
  id: "scenario-for-loop",
  title: "For Loop Iteration & Accumulation",
  description: "Iterating a loop 3 times to calculate the summation of integers 1 to 3.",
  code: `int sum = 0;
for (int i = 1; i <= 3; i++) {
    sum = sum + i;
}
printf("Total: %d\\n", sum);`,
  events: [
    {
      id: 1,
      type: "program_start",
      line: 1,
      payload: {},
    },
    {
      id: 2,
      type: "variable_create",
      line: 1,
      payload: {
        name: "sum",
        dataType: "int",
        value: 0,
        sizeBytes: 4,
        address: "0x7FFE0010",
      },
    },
    {
      id: 3,
      type: "variable_create",
      line: 2,
      payload: {
        name: "i",
        dataType: "int",
        value: 1,
        sizeBytes: 4,
        address: "0x7FFE0014",
      },
    },
    {
      id: 4,
      type: "loop_iteration",
      line: 2,
      payload: {
        loopType: "for",
        iteration: 1,
        conditionExpression: "1 <= 3",
        isConditionMet: true,
      },
    },
    {
      id: 5,
      type: "assignment",
      line: 3,
      payload: {
        name: "sum",
        oldValue: 0,
        newValue: 1,
        expression: "sum + i (0 + 1)",
      },
    },
    {
      id: 6,
      type: "assignment",
      line: 2,
      payload: {
        name: "i",
        oldValue: 1,
        newValue: 2,
        expression: "i++",
      },
    },
    {
      id: 7,
      type: "loop_iteration",
      line: 2,
      payload: {
        loopType: "for",
        iteration: 2,
        conditionExpression: "2 <= 3",
        isConditionMet: true,
      },
    },
    {
      id: 8,
      type: "assignment",
      line: 3,
      payload: {
        name: "sum",
        oldValue: 1,
        newValue: 3,
        expression: "sum + i (1 + 2)",
      },
    },
    {
      id: 9,
      type: "assignment",
      line: 2,
      payload: {
        name: "i",
        oldValue: 2,
        newValue: 3,
        expression: "i++",
      },
    },
    {
      id: 10,
      type: "loop_iteration",
      line: 2,
      payload: {
        loopType: "for",
        iteration: 3,
        conditionExpression: "3 <= 3",
        isConditionMet: true,
      },
    },
    {
      id: 11,
      type: "assignment",
      line: 3,
      payload: {
        name: "sum",
        oldValue: 3,
        newValue: 6,
        expression: "sum + i (3 + 3)",
      },
    },
    {
      id: 12,
      type: "loop_end",
      line: 4,
      payload: {},
    },
    {
      id: 13,
      type: "output",
      line: 5,
      payload: {
        text: "Total: 6\n",
      },
    },
    {
      id: 14,
      type: "program_end",
      line: 5,
      payload: {},
    },
  ],
};

/**
 * Scenario 4: Function Call Stack
 */
export const SCENARIO_FUNCTION_CALL: MockScenario = {
  id: "scenario-functions",
  title: "Function Call & Activation Records",
  description: "Calling a user-defined function, passing parameters by value, and receiving return value.",
  code: `int add(int a, int b) {
    return a + b;
}

int main() {
    int x = 4;
    int y = 5;
    int result = add(x, y);
    printf("Result: %d\\n", result);
    return 0;
}`,
  events: [
    {
      id: 1,
      type: "program_start",
      line: 5,
      payload: {},
    },
    {
      id: 2,
      type: "variable_create",
      line: 6,
      payload: {
        name: "x",
        dataType: "int",
        value: 4,
        sizeBytes: 4,
        address: "0x7FFE0010",
      },
    },
    {
      id: 3,
      type: "variable_create",
      line: 7,
      payload: {
        name: "y",
        dataType: "int",
        value: 5,
        sizeBytes: 4,
        address: "0x7FFE0014",
      },
    },
    {
      id: 4,
      type: "function_call",
      line: 8,
      payload: {
        functionName: "add",
        callLine: 8,
        arguments: [
          { name: "a", value: 4, type: "int" },
          { name: "b", value: 5, type: "int" },
        ],
      },
    },
    {
      id: 5,
      type: "function_return",
      line: 2,
      payload: {
        functionName: "add",
        returnLine: 8,
        returnValue: 9,
      },
    },
    {
      id: 6,
      type: "variable_create",
      line: 8,
      payload: {
        name: "result",
        dataType: "int",
        value: 9,
        sizeBytes: 4,
        address: "0x7FFE0018",
      },
    },
    {
      id: 7,
      type: "output",
      line: 9,
      payload: {
        text: "Result: 9\n",
      },
    },
    {
      id: 8,
      type: "program_end",
      line: 10,
      payload: {},
    },
  ],
};

export const ALL_MOCK_SCENARIOS = [
  SCENARIO_VARIABLE_SWAP,
  SCENARIO_IF_ELSE,
  SCENARIO_FOR_LOOP,
  SCENARIO_FUNCTION_CALL,
];
