import { PracticeExercise } from '@/types/practice';

export const PRACTICE_EXERCISES: PracticeExercise[] = [
  // 1. Trace Tables
  {
    id: 'trace-swap-arithmetic',
    title: 'Variable Swap & Running Sum',
    category: 'trace-table',
    difficulty: 'novice',
    concept: 'Variables & Assignment',
    description: 'Track the values of variables `a`, `b`, and `temp` as they are initialized, swapped, and used to calculate a running sum.',
    timeEstimateMinutes: 5,
    code: `int main() {
    int a = 4;
    int b = 9;
    int temp = a;
    a = b;
    b = temp;
    int sum = a + b;
    return 0;
}`,
    hints: [
      'In line 2, `a` is allocated and assigned 4.',
      'In line 4, `temp` copies the current value of `a` (which is 4).',
      'In line 5, `a` is overwritten with `b` (9), but `b` is not modified yet.',
      'In line 6, `b` takes the stored value from `temp` (4).'
    ],
    explanation: 'Variable swapping in C requires a third temporary variable to hold the first value before overwriting it. Otherwise, `a = b` would permanently destroy the original value of `a`.',
    trackedVariables: [
      { name: 'a', type: 'int', initialValue: '—' },
      { name: 'b', type: 'int', initialValue: '—' },
      { name: 'temp', type: 'int', initialValue: '—' },
      { name: 'sum', type: 'int', initialValue: '—' }
    ],
    rows: [
      {
        stepIndex: 0,
        line: 2,
        statement: 'int a = 4;',
        expectedValues: { a: '4', b: '—', temp: '—', sum: '—' },
        explanation: 'Variable `a` is initialized to 4.'
      },
      {
        stepIndex: 1,
        line: 3,
        statement: 'int b = 9;',
        expectedValues: { a: '4', b: '9', temp: '—', sum: '—' },
        explanation: 'Variable `b` is initialized to 9.'
      },
      {
        stepIndex: 2,
        line: 4,
        statement: 'int temp = a;',
        expectedValues: { a: '4', b: '9', temp: '4', sum: '—' },
        explanation: '`temp` receives the value of `a` (4).'
      },
      {
        stepIndex: 3,
        line: 5,
        statement: 'a = b;',
        expectedValues: { a: '9', b: '9', temp: '4', sum: '—' },
        explanation: '`a` is updated to the value of `b` (9).'
      },
      {
        stepIndex: 4,
        line: 6,
        statement: 'b = temp;',
        expectedValues: { a: '9', b: '4', temp: '4', sum: '—' },
        explanation: '`b` is updated to the saved value in `temp` (4). The swap is complete.'
      },
      {
        stepIndex: 5,
        line: 7,
        statement: 'int sum = a + b;',
        expectedValues: { a: '9', b: '4', temp: '4', sum: '13' },
        explanation: '`sum` is computed as 9 + 4 = 13.'
      }
    ]
  },

  {
    id: 'trace-loop-accumulator',
    title: 'Loop Counter & Sum Accumulator',
    category: 'trace-table',
    difficulty: 'beginner',
    concept: 'For Loops & Accumulation',
    description: 'Trace each iteration of a `for` loop, updating the counter variable `i` and accumulator `total`.',
    timeEstimateMinutes: 8,
    code: `int main() {
    int total = 0;
    for (int i = 1; i <= 3; i++) {
        total = total + (i * 2);
    }
    return 0;
}`,
    hints: [
      'The loop initializes `i = 1`.',
      'In iteration 1, `total = 0 + (1 * 2) = 2`.',
      'Then `i++` increments `i` to 2.',
      'In iteration 2, `total = 2 + (2 * 2) = 6`.'
    ],
    explanation: 'An accumulator pattern repeatedly reads the old value of a variable (`total`), performs an operation with the loop index, and writes the new sum back into `total`.',
    trackedVariables: [
      { name: 'total', type: 'int', initialValue: '—' },
      { name: 'i', type: 'int', initialValue: '—' }
    ],
    rows: [
      {
        stepIndex: 0,
        line: 2,
        statement: 'int total = 0;',
        expectedValues: { total: '0', i: '—' },
        explanation: 'Accumulator `total` initialized to 0.'
      },
      {
        stepIndex: 1,
        line: 3,
        statement: 'for (int i = 1; ...)',
        expectedValues: { total: '0', i: '1' },
        explanation: 'Loop index `i` is initialized to 1. Condition 1 <= 3 is TRUE.'
      },
      {
        stepIndex: 2,
        line: 4,
        statement: 'total = total + (i * 2); [iter 1]',
        expectedValues: { total: '2', i: '1' },
        explanation: 'total = 0 + (1 * 2) = 2.'
      },
      {
        stepIndex: 3,
        line: 3,
        statement: 'i++; [iter 2 check]',
        expectedValues: { total: '2', i: '2' },
        explanation: '`i` increments to 2. Condition 2 <= 3 is TRUE.'
      },
      {
        stepIndex: 4,
        line: 4,
        statement: 'total = total + (i * 2); [iter 2]',
        expectedValues: { total: '6', i: '2' },
        explanation: 'total = 2 + (2 * 2) = 6.'
      },
      {
        stepIndex: 5,
        line: 3,
        statement: 'i++; [iter 3 check]',
        expectedValues: { total: '6', i: '3' },
        explanation: '`i` increments to 3. Condition 3 <= 3 is TRUE.'
      },
      {
        stepIndex: 6,
        line: 4,
        statement: 'total = total + (i * 2); [iter 3]',
        expectedValues: { total: '12', i: '3' },
        explanation: 'total = 6 + (3 * 2) = 12.'
      },
      {
        stepIndex: 7,
        line: 3,
        statement: 'i++; [loop terminates]',
        expectedValues: { total: '12', i: '4' },
        explanation: '`i` increments to 4. Condition 4 <= 3 is FALSE. Loop exits.'
      }
    ]
  },

  {
    id: 'trace-if-condition',
    title: 'Branching Discount Calculator',
    category: 'trace-table',
    difficulty: 'beginner',
    concept: 'If-Else Conditionals',
    description: 'Evaluate the condition `price > 50` and trace how `discount` and `finalPrice` are computed.',
    timeEstimateMinutes: 6,
    code: `int main() {
    int price = 60;
    int discount = 0;
    if (price > 50) {
        discount = 15;
    } else {
        discount = 5;
    }
    int finalPrice = price - discount;
    return 0;
}`,
    hints: [
      '`price` is 60.',
      '`price > 50` evaluates to TRUE (60 > 50), so the `if` block executes and the `else` block is skipped.'
    ],
    explanation: 'When an `if` condition evaluates to true, the program immediately enters the `if` body and skips over the entire `else` branch.',
    trackedVariables: [
      { name: 'price', type: 'int', initialValue: '—' },
      { name: 'discount', type: 'int', initialValue: '—' },
      { name: 'finalPrice', type: 'int', initialValue: '—' }
    ],
    rows: [
      {
        stepIndex: 0,
        line: 2,
        statement: 'int price = 60;',
        expectedValues: { price: '60', discount: '—', finalPrice: '—' },
        explanation: '`price` set to 60.'
      },
      {
        stepIndex: 1,
        line: 3,
        statement: 'int discount = 0;',
        expectedValues: { price: '60', discount: '0', finalPrice: '—' },
        explanation: '`discount` initialized to 0.'
      },
      {
        stepIndex: 2,
        line: 4,
        statement: 'if (price > 50) [TRUE]',
        expectedValues: { price: '60', discount: '0', finalPrice: '—' },
        explanation: '60 > 50 evaluates to TRUE (1). Entering IF branch.'
      },
      {
        stepIndex: 3,
        line: 5,
        statement: 'discount = 15;',
        expectedValues: { price: '60', discount: '15', finalPrice: '—' },
        explanation: '`discount` updated to 15.'
      },
      {
        stepIndex: 4,
        line: 9,
        statement: 'int finalPrice = price - discount;',
        expectedValues: { price: '60', discount: '15', finalPrice: '45' },
        explanation: 'finalPrice = 60 - 15 = 45.'
      }
    ]
  },

  // 2. Predict Output Problems
  {
    id: 'predict-int-div-modulo',
    title: 'Integer Division & Modulo Truncation',
    category: 'predict-output',
    difficulty: 'novice',
    concept: 'Arithmetic Operators',
    description: 'In C, dividing two integers performs integer division (truncating decimals). Predict the exact printed output.',
    timeEstimateMinutes: 3,
    code: `#include <stdio.h>

int main() {
    int a = 17;
    int b = 5;
    int div = a / b;
    int rem = a % b;
    printf("%d rem %d", div, rem);
    return 0;
}`,
    hints: [
      '17 / 5 in integer arithmetic is 3 (not 3.4).',
      '17 % 5 is the remainder after dividing 17 by 5, which is 2.'
    ],
    explanation: 'In C, when both operands of `/` are integers, the fractional part is truncated toward zero. `17 / 5 = 3` and `17 % 5 = 2`. The format string produces "3 rem 2".',
    expectedStdout: '3 rem 2',
    options: [
      '3 rem 2',
      '3.4 rem 2',
      '3 rem 0',
      '17 rem 5'
    ]
  },

  {
    id: 'predict-pre-post-increment',
    title: 'Pre-Increment vs Post-Increment',
    category: 'predict-output',
    difficulty: 'intermediate',
    concept: 'Increment Operators (++x vs x++)',
    description: 'Determine the exact output when using postfix `x++` and prefix `++y` in expressions.',
    timeEstimateMinutes: 5,
    code: `#include <stdio.h>

int main() {
    int x = 5;
    int y = 5;
    int a = x++;
    int b = ++y;
    printf("x=%d a=%d y=%d b=%d", x, a, y, b);
    return 0;
}`,
    hints: [
      '`x++` (post-increment) returns the original value of `x` before incrementing it.',
      '`++y` (pre-increment) increments `y` first and returns the new value.'
    ],
    explanation: '`x++` assigns 5 to `a` and then increments `x` to 6. `++y` increments `y` to 6 first and then assigns 6 to `b`. Thus `x=6 a=5 y=6 b=6`.',
    expectedStdout: 'x=6 a=5 y=6 b=6',
    options: [
      'x=6 a=5 y=6 b=6',
      'x=6 a=6 y=6 b=6',
      'x=5 a=5 y=6 b=6',
      'x=6 a=5 y=5 b=6'
    ]
  },

  // 3. Spot the Bug Problems
  {
    id: 'bug-assignment-in-if',
    title: 'The Accidental Assignment in If-Condition',
    category: 'spot-the-bug',
    difficulty: 'novice',
    concept: 'Conditionals & Equality',
    description: 'This program is meant to check if the student score is 100. However, it always prints "Perfect Score!" even for score = 50. Find and fix the bug!',
    timeEstimateMinutes: 4,
    code: `1: #include <stdio.h>
2: 
3: int main() {
4:     int score = 50;
5:     if (score = 100) {
6:         printf("Perfect Score!\\n");
7:     } else {
8:         printf("Keep Practicing!\\n");
9:     }
10:    return 0;
11: }`,
    hints: [
      'In C, `=` is the assignment operator, while `==` is the equality comparison operator.',
      'What happens when `score = 100` executes inside the `if (...)`?'
    ],
    explanation: '`score = 100` assigns 100 to `score`. The expression evaluates to 100, which in C is non-zero (TRUE), so the `if` body ALWAYS executes regardless of previous value. The fix is `if (score == 100)`.',
    buggyLineNumber: 5,
    bugType: 'semantic',
    bugExplanation: 'Single `=` performs assignment and evaluates to 100 (truthy). Equality check requires `==`.',
    correctReplacement: '    if (score == 100) {',
    options: [
      {
        lineNumber: 5,
        replacement: '    if (score == 100) {',
        label: 'Change `if (score = 100)` to `if (score == 100)`',
        isCorrect: true,
        feedback: 'Correct! `==` compares values for equality, while `=` assigns a value.'
      },
      {
        lineNumber: 4,
        replacement: '    int score == 50;',
        label: 'Change `int score = 50;` to `int score == 50;`',
        isCorrect: false,
        feedback: 'Incorrect: Variable declaration requires the assignment operator `=`.'
      },
      {
        lineNumber: 7,
        replacement: '    } else if (score == 50) {',
        label: 'Add `else if (score == 50)`',
        isCorrect: false,
        feedback: 'Incorrect: The bug is in line 5 where `score = 100` is overwriting the variable.'
      }
    ]
  },

  {
    id: 'bug-off-by-one-loop',
    title: 'Off-By-One Array Loop Bounds',
    category: 'spot-the-bug',
    difficulty: 'beginner',
    concept: 'Arrays & Loop Bounds',
    description: 'An array of size 5 has valid indices 0 to 4. Find the line that causes an out-of-bounds memory access.',
    timeEstimateMinutes: 5,
    code: `1: #include <stdio.h>
2: 
3: int main() {
4:     int numbers[5] = {10, 20, 30, 40, 50};
5:     for (int i = 0; i <= 5; i++) {
6:         printf("%d ", numbers[i]);
7:     }
8:     return 0;
9: }`,
    hints: [
      'Array indices in C are 0-indexed: index 0 to 4.',
      'What index is accessed when `i = 5` in `numbers[i]`?'
    ],
    explanation: 'When `i <= 5` is used, the loop runs for `i = 5`, attempting to access `numbers[5]`. This is 1 element past the allocated 5-element array (undefined behavior / garbage memory read). The fix is `i < 5`.',
    buggyLineNumber: 5,
    bugType: 'runtime',
    bugExplanation: '`i <= 5` accesses `numbers[5]` out of bounds. Must be `i < 5`.',
    correctReplacement: '    for (int i = 0; i < 5; i++) {',
    options: [
      {
        lineNumber: 5,
        replacement: '    for (int i = 0; i < 5; i++) {',
        label: 'Change `i <= 5` to `i < 5`',
        isCorrect: true,
        feedback: 'Correct! Array of size 5 has indices 0, 1, 2, 3, and 4. `i < 5` stops before index 5.'
      },
      {
        lineNumber: 4,
        replacement: '    int numbers[6] = {10, 20, 30, 40, 50};',
        label: 'Change `numbers[5]` to `numbers[6]`',
        isCorrect: false,
        feedback: 'Incorrect: We should fix the loop bound to match the 5 elements.'
      },
      {
        lineNumber: 5,
        replacement: '    for (int i = 1; i <= 5; i++) {',
        label: 'Change `i = 0` to `i = 1`',
        isCorrect: false,
        feedback: 'Incorrect: Starting at `i = 1` skips the first element `numbers[0]` (10).'
      }
    ]
  }
];

export function getExerciseById(id: string): PracticeExercise | undefined {
  return PRACTICE_EXERCISES.find(ex => ex.id === id);
}

export function getExercisesByCategory(category: string): PracticeExercise[] {
  if (category === 'all') return PRACTICE_EXERCISES;
  return PRACTICE_EXERCISES.filter(ex => ex.category === category);
}
