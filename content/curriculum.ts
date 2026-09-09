import { Topic, Lesson } from '@/types/curriculum';

export const CURRICULUM_TOPICS: Topic[] = [
  // Module 1: Introduction to C
  {
    id: 'topic-01',
    slug: '01-intro-c',
    moduleNumber: 1,
    title: 'Introduction to C & The Compilation Model',
    tagline: 'From source code to executable binary',
    description: 'Understand the anatomy of a C program, `#include` directives, the `main()` entry point, and the four stages of the C compilation pipeline.',
    estimatedMinutes: 25,
    difficulty: 'novice',
    icon: 'Cpu',
    lessons: [
      {
        id: 'lesson-01-01',
        slug: 'anatomy-c-program',
        topicSlug: '01-intro-c',
        title: 'Anatomy of a C Program',
        description: 'Deconstruct every line of the classic Hello World program.',
        order: 1,
        estimatedMinutes: 12,
        sections: [
          {
            title: '1. The Structure of C Source Code',
            content: 'Every C program follows a precise structural blueprint. Unlike scripting languages, C requires an explicit entry point function called `main()`, preprocessor directives to import input/output capabilities, and semicolons terminating every statement.',
            mentalModelTip: 'Think of C like a blueprint for hardware: nothing happens implicitly. Every resource and header must be explicitly requested.',
            codeSnippet: `#include <stdio.h>

int main() {
    printf("Hello, ICS Novice!\\n");
    return 0;
}`
          },
          {
            title: '2. The Role of `#include <stdio.h>`',
            content: 'The line `#include <stdio.h>` is a **Preprocessor Directive**. Before your code is compiled into machine instructions, the preprocessor copies and pastes the Standard Input/Output header file into your source file so the compiler knows how `printf` is defined.',
            commonNoviceMistake: 'Forgetting `#include <stdio.h>` causes the compiler to complain about "implicit declaration of function printf".'
          },
          {
            title: '3. The `main()` Function & Return Code 0',
            content: 'Execution always begins at `int main()`. The `int` keyword means `main` returns an integer status code to the Operating System. Returning `0` tells the OS: "The program completed successfully with zero errors."'
          }
        ],
        interactiveWidget: {
          title: 'Step-through Hello World',
          description: 'Step into the main() entry point and see the output printed to the terminal.',
          code: `#include <stdio.h>

int main() {
    printf("Hello, ICS Novice!\\n");
    return 0;
}`
        },
        quiz: [
          {
            id: 'q-01-01-1',
            question: 'Where does the operating system begin executing any C program?',
            options: [
              'At the very first line of the file',
              'Inside the `main()` function',
              'Inside `#include <stdio.h>`',
              'At the `return 0;` statement'
            ],
            correctOptionIndex: 1,
            explanation: 'The C runtime standard defines `main()` as the mandatory entry point where execution always begins.'
          },
          {
            id: 'q-01-01-2',
            question: 'What does returning `0` at the end of `main()` signal to the operating system?',
            options: [
              'The program produced 0 lines of output',
              'The program ran out of memory',
              'The program executed successfully with no errors',
              'The program is an infinite loop'
            ],
            correctOptionIndex: 2,
            explanation: 'By convention in Unix/C systems, return code 0 indicates normal, successful execution.'
          }
        ]
      },
      {
        id: 'lesson-01-02',
        slug: 'compilation-pipeline',
        topicSlug: '01-intro-c',
        title: 'The C Compilation Pipeline',
        description: 'How human-readable text transforms into machine binary.',
        order: 2,
        estimatedMinutes: 13,
        sections: [
          {
            title: '1. The Four Translation Stages',
            content: 'C is a compiled language. When you run `gcc main.c`, the compiler executes four distinct phases under the hood:\n\n1. **Preprocessing (`cpp`):** Strips comments, expands `#include` headers, and substitutes `#define` macros.\n2. **Compilation (`cc1`):** Translates preprocessed C code into Assembly instructions (`.s`).\n3. **Assembly (`as`):** Converts Assembly into machine binary Object Code (`.o`).\n4. **Linking (`ld`):** Combines object files with C standard libraries (e.g. `libc`) into the final runnable executable (`a.out`).',
            mentalModelTip: 'Source Code (.c) → Preprocessed (.i) → Assembly (.s) → Object (.o) → Executable binary'
          }
        ],
        quiz: [
          {
            id: 'q-01-02-1',
            question: 'Which stage of the compilation pipeline resolves `#include <stdio.h>` directives?',
            options: [
              'Linker',
              'Preprocessor',
              'Assembler',
              'Operating System Loader'
            ],
            correctOptionIndex: 1,
            explanation: 'The Preprocessor runs before compilation, expanding all `#include` headers into the source text.'
          }
        ]
      }
    ]
  },

  // Module 2: Variables & Memory
  {
    id: 'topic-02',
    slug: '02-variables-memory',
    moduleNumber: 2,
    title: 'Variables, Data Types & Memory Footprint',
    tagline: 'How computers store numbers, characters, and bytes',
    description: 'Learn how variables reserve fixed slots in RAM, why data types dictate byte size, and how assignment operators mutate memory.',
    estimatedMinutes: 30,
    difficulty: 'novice',
    icon: 'Database',
    lessons: [
      {
        id: 'lesson-02-01',
        slug: 'declaring-variables',
        topicSlug: '02-variables-memory',
        title: 'Declaring Variables & Data Types',
        description: 'Discover the fundamental C types: int, char, float, and double.',
        order: 1,
        estimatedMinutes: 15,
        sections: [
          {
            title: '1. What is a Variable in C?',
            content: 'A variable is a **named memory location** in RAM reserved to hold a value of a specific data type. In C, variables must be declared with their type before they can be used.',
            mentalModelTip: 'Think of a variable as a labeled mailbox in computer RAM. The data type determines the size of the box.',
            codeSnippet: `int age = 19;          // 4 bytes in RAM
char initial = 'A';    // 1 byte in RAM
float gpa = 3.85f;     // 4 bytes in RAM`
          },
          {
            title: '2. C Fundamental Types & Byte Sizes',
            content: '• `char` (1 byte, 8 bits): Stores single characters like `\'A\'` or small numbers (-128 to 127).\n• `int` (4 bytes, 32 bits): Stores whole integers (-2,147,483,648 to 2,147,483,647).\n• `float` (4 bytes): Single-precision floating-point decimals (~7 digits precision).\n• `double` (8 bytes): Double-precision floating-point decimals (~15 digits precision).'
          }
        ],
        interactiveWidget: {
          title: 'Memory Allocation Visualizer',
          description: 'Observe how four different data types occupy different byte sizes at distinct hexadecimal memory addresses.',
          code: `int main() {
    int age = 19;
    char grade = 'A';
    float weight = 64.5;
    return 0;
}`
        },
        relatedPracticeId: 'trace-swap-arithmetic',
        quiz: [
          {
            id: 'q-02-01-1',
            question: 'How many bytes of memory does a standard `char` variable occupy in C?',
            options: ['1 byte', '2 bytes', '4 bytes', '8 bytes'],
            correctOptionIndex: 0,
            explanation: 'A standard `char` in C is exactly 1 byte (8 bits), capable of storing ASCII character codes.'
          }
        ]
      },
      {
        id: 'lesson-02-02',
        slug: 'variable-mutation',
        topicSlug: '02-variables-memory',
        title: 'Variable Mutation & Memory Overwriting',
        description: 'How the assignment operator overwrites existing memory values.',
        order: 2,
        estimatedMinutes: 15,
        sections: [
          {
            title: '1. The Assignment Operator (`=`)',
            content: 'In C, `=` is NOT an equation of mathematical equality; it is a **destructive write command**. It evaluates the expression on the right-hand side and writes the resulting value into the memory location on the left-hand side, permanently overwriting whatever was there previously.',
            codeSnippet: `int x = 10;
x = 25;        // Overwrites 10 with 25
x = x + 5;     // Reads 25, adds 5, writes 30 into x`
          },
          {
            title: '2. The Classic Swap Problem',
            content: 'If you want to swap two variables `a` and `b`, doing `a = b;` destroys the original value of `a`. You MUST use a temporary variable `temp` to preserve `a` before overwriting it.',
            commonNoviceMistake: 'Writing `a = b; b = a;` does not swap: both variables end up with the original value of `b`!'
          }
        ],
        interactiveWidget: {
          title: 'Step Through Variable Swapping',
          description: 'Step through line-by-line and observe how the temp variable prevents data loss.',
          code: `int main() {
    int a = 5;
    int b = 10;
    int temp = a;
    a = b;
    b = temp;
    return 0;
}`
        },
        relatedPracticeId: 'trace-swap-arithmetic',
        quiz: [
          {
            id: 'q-02-02-1',
            question: 'If `int x = 7;`, what is the value of `x` after executing `x = x + 3;`?',
            options: ['7', '3', '10', 'Undefined'],
            correctOptionIndex: 2,
            explanation: '`x = x + 3` reads current value 7, adds 3 = 10, and writes 10 back into variable `x`.'
          }
        ]
      }
    ]
  },

  // Module 3: Operators & Expressions
  {
    id: 'topic-03',
    slug: '03-operators-expressions',
    moduleNumber: 3,
    title: 'Operators & Expressions',
    tagline: 'Arithmetic, integer division truncation & increment mechanics',
    description: 'Master integer division traps, remainder calculations with `%`, and the subtle difference between `x++` and `++x`.',
    estimatedMinutes: 25,
    difficulty: 'novice',
    icon: 'Sparkles',
    lessons: [
      {
        id: 'lesson-03-01',
        slug: 'integer-division-modulo',
        topicSlug: '03-operators-expressions',
        title: 'Integer Division & Modulo Operator',
        description: 'Why 17 / 5 equals 3 in C, and how % captures the remainder.',
        order: 1,
        estimatedMinutes: 12,
        sections: [
          {
            title: '1. Integer Division Truncation',
            content: 'When both operands in a division are integers (e.g. `17 / 5`), C performs **integer division**. The fractional portion is completely truncated (discarded), producing `3` instead of `3.4`.',
            mentalModelTip: 'Integer division rounds towards zero. To get decimals, at least one operand must be a float: `17.0 / 5.0 = 3.4`.'
          },
          {
            title: '2. The Modulo Operator (`%`)',
            content: 'The `%` operator calculates the integer remainder after division. For example, `17 % 5 = 2` because 5 goes into 17 three times with 2 left over.',
            codeSnippet: `int div = 17 / 5;   // 3
int rem = 17 % 5;   // 2`
          }
        ],
        interactiveWidget: {
          title: 'Inspect Division & Remainder',
          description: 'Step through integer arithmetic and watch div and rem calculate in real-time.',
          code: `int main() {
    int a = 17;
    int b = 5;
    int div = a / b;
    int rem = a % b;
    return 0;
}`
        },
        relatedPracticeId: 'predict-int-div-modulo',
        quiz: [
          {
            id: 'q-03-01-1',
            question: 'What is the exact result of `9 / 2` in C integer arithmetic?',
            options: ['4.5', '4', '5', '0'],
            correctOptionIndex: 1,
            explanation: 'Integer division truncates the decimal portion `.5`, yielding `4`.'
          }
        ]
      }
    ]
  },

  // Module 4: Conditionals & Decision Making
  {
    id: 'topic-04',
    slug: '04-conditionals',
    moduleNumber: 4,
    title: 'Decision Making & Conditionals',
    tagline: 'Branching logic, truth values and multi-way decisions',
    description: 'Learn how C represents truth values (0 is False, non-zero is True) and how `if-else` branches divert execution flow.',
    estimatedMinutes: 30,
    difficulty: 'beginner',
    icon: 'GitBranch',
    lessons: [
      {
        id: 'lesson-04-01',
        slug: 'if-else-branching',
        topicSlug: '04-conditionals',
        title: 'If-Else Conditionals & Truth Values',
        description: 'How C tests conditions and executes alternative code blocks.',
        order: 1,
        estimatedMinutes: 15,
        sections: [
          {
            title: '1. Truth in C: 0 vs Non-Zero',
            content: 'In traditional C (C89/C99), there is no native boolean keyword by default. Any expression that evaluates to `0` is **FALSE**, and any non-zero value (such as `1`, `42`, or `-5`) is **TRUE**.',
            mentalModelTip: 'Every condition like `marks >= 80` reduces to a single integer: `1` if true, `0` if false.'
          },
          {
            title: '2. The Danger of `=` vs `==`',
            content: '`==` is the equality comparison operator. Single `=` is assignment.\nIf you write `if (score = 100)`, C assigns 100 to `score`. The expression evaluates to 100 (non-zero), so the condition ALWAYS evaluates to TRUE!',
            commonNoviceMistake: 'Using `if (x = 5)` instead of `if (x == 5)` is one of the most common novice bugs in C.'
          }
        ],
        interactiveWidget: {
          title: 'Condition Evaluation Live Step-Through',
          description: 'Watch the condition evaluate to TRUE or FALSE and jump past the skipped branch.',
          code: `int main() {
    int marks = 85;
    int passed = 0;
    if (marks >= 80) {
        passed = 1;
    } else {
        passed = 0;
    }
    return 0;
}`
        },
        relatedPracticeId: 'trace-if-condition',
        quiz: [
          {
            id: 'q-04-01-1',
            question: 'What does the condition `if (5)` evaluate to in C?',
            options: ['False', 'True', 'Compile Error', 'Syntax Warning'],
            correctOptionIndex: 1,
            explanation: 'In C, any non-zero value is treated as True.'
          }
        ]
      }
    ]
  },

  // Module 5: Loops & Repetition
  {
    id: 'topic-05',
    slug: '05-loops',
    moduleNumber: 5,
    title: 'Loops & Iterative Execution',
    tagline: 'For loops, while loops, and accumulator patterns',
    description: 'Demystify loop lifecycles: initialization, condition checking, body execution, and step updates.',
    estimatedMinutes: 35,
    difficulty: 'beginner',
    icon: 'Layers',
    lessons: [
      {
        id: 'lesson-05-01',
        slug: 'for-loop-mechanics',
        topicSlug: '05-loops',
        title: 'The For Loop Lifecycle',
        description: 'Understand the 4 distinct phases of every for loop.',
        order: 1,
        estimatedMinutes: 18,
        sections: [
          {
            title: '1. The 4 Phases of a For Loop',
            content: 'A `for (init; condition; increment)` loop runs in an exact 4-step sequence:\n\n1. **Initialization:** Runs once at loop entry (e.g. `int i = 1`).\n2. **Condition Check:** Evaluates `i <= 3`. If TRUE, proceed to body. If FALSE, exit loop.\n3. **Body Execution:** Runs the statements inside `{ ... }`.\n4. **Increment/Step:** Runs `i++` and loops back to Step 2.',
            mentalModelTip: 'The increment step (i++) happens AFTER the body finishes, right before the next condition check.'
          }
        ],
        interactiveWidget: {
          title: 'Step Through For Loop Accumulator',
          description: 'Watch the iteration counter advance from 1 to 3 and accumulate the running sum.',
          code: `int main() {
    int total = 0;
    for (int i = 1; i <= 3; i++) {
        total = total + (i * 2);
    }
    return 0;
}`
        },
        relatedPracticeId: 'trace-loop-accumulator',
        quiz: [
          {
            id: 'q-05-01-1',
            question: 'How many times will `for (int i = 0; i < 5; i++)` execute its body?',
            options: ['4 times', '5 times', '6 times', 'Infinite times'],
            correctOptionIndex: 1,
            explanation: 'The loop executes for `i = 0, 1, 2, 3, 4` (exactly 5 times) and terminates when `i = 5`.'
          }
        ]
      }
    ]
  },

  // Module 6: Functions & The Call Stack
  {
    id: 'topic-06',
    slug: '06-functions',
    moduleNumber: 6,
    title: 'Functions & The Runtime Call Stack',
    tagline: 'Activation records, parameter pass-by-value, and return values',
    description: 'Learn how function calls push stack frames onto the runtime call stack, how parameters are copied by value, and how return values bubble back to callers.',
    estimatedMinutes: 35,
    difficulty: 'intermediate',
    icon: 'Layers',
    lessons: [
      {
        id: 'lesson-06-01',
        slug: 'call-stack-frames',
        topicSlug: '06-functions',
        title: 'Stack Frames & Pass-By-Value',
        description: 'How the CPU manages local variables and function returns in memory.',
        order: 1,
        estimatedMinutes: 18,
        sections: [
          {
            title: '1. What is a Call Stack Frame?',
            content: 'When a function is called, the system allocates a **Stack Frame** (activation record) on top of the call stack. This frame stores the function\'s parameters, local variables, and the return address to resume the caller.',
            mentalModelTip: 'The Call Stack operates in Last-In, First-Out (LIFO) order. When a function returns, its stack frame is instantly destroyed.'
          },
          {
            title: '2. C is Strictly Pass-By-Value',
            content: 'When you pass a variable to a function, C makes a **copy** of the variable\'s value. Modifying a parameter inside a function has zero effect on the original variable in the caller.'
          }
        ],
        interactiveWidget: {
          title: 'Watch Function Call & Return in the Call Stack',
          description: 'See main() suspend while add() pushes onto the stack and returns value 9.',
          code: `int add(int a, int b) {
    return a + b;
}

int main() {
    int x = 4;
    int y = 5;
    int result = add(x, y);
    return 0;
}`
        },
        quiz: [
          {
            id: 'q-06-01-1',
            question: 'What happens to a function\'s local variables when the function returns?',
            options: [
              'They are converted to global variables',
              'Their stack frame is popped and their memory is freed',
              'They remain in memory permanently',
              'They are copied into the main() function'
            ],
            correctOptionIndex: 1,
            explanation: 'When a function returns, its activation record is popped off the runtime stack.'
          }
        ]
      }
    ]
  },

  // Module 7: 1D Arrays
  {
    id: 'topic-07',
    slug: '07-arrays',
    moduleNumber: 7,
    title: '1D Arrays & Contiguous Memory Layout',
    tagline: 'Sequential index access and avoiding buffer overruns',
    description: 'Understand how arrays allocate contiguous blocks of memory in RAM, zero-based indexing, and the dangers of out-of-bounds access.',
    estimatedMinutes: 30,
    difficulty: 'intermediate',
    icon: 'Database',
    lessons: [
      {
        id: 'lesson-07-01',
        slug: 'array-memory-layout',
        topicSlug: '07-arrays',
        title: 'Array Indexing & Memory Footprint',
        description: 'How elements are indexed from 0 to N-1.',
        order: 1,
        estimatedMinutes: 15,
        sections: [
          {
            title: '1. Contiguous Memory in RAM',
            content: 'An array `int arr[5]` reserves 5 contiguous integer slots (20 bytes total). Element `arr[0]` is stored at the base address, `arr[1]` at base + 4 bytes, `arr[2]` at base + 8 bytes, and so on.',
            mentalModelTip: 'Array indices start at 0, not 1! An array of size 5 has valid indices 0, 1, 2, 3, and 4.'
          }
        ],
        interactiveWidget: {
          title: 'Array Traversal & Accumulation',
          description: 'Step through an array of 4 integers and see contiguous memory indexing.',
          code: `int main() {
    int scores[4] = {10, 20, 30, 40};
    int sum = 0;
    for (int i = 0; i < 4; i++) {
        sum = sum + scores[i];
    }
    return 0;
}`
        },
        relatedPracticeId: 'bug-off-by-one-loop',
        quiz: [
          {
            id: 'q-07-01-1',
            question: 'For an array declared as `int data[10];`, what is the highest valid index?',
            options: ['10', '9', '11', '0'],
            correctOptionIndex: 1,
            explanation: 'With 0-based indexing, an array of size N has indices from 0 up to N-1 (9).'
          }
        ]
      }
    ]
  },

  // Module 8: Pointers & Addresses
  {
    id: 'topic-08',
    slug: '08-pointers',
    moduleNumber: 8,
    title: 'Demystifying Pointers & Memory Addresses',
    tagline: 'Understanding the & address-of and * dereference operators',
    description: 'Demystify the most feared concept in C. Understand memory addresses, pointers as address holders, and dereferencing.',
    estimatedMinutes: 35,
    difficulty: 'intermediate',
    icon: 'Cpu',
    lessons: [
      {
        id: 'lesson-08-01',
        slug: 'address-and-pointer-basics',
        topicSlug: '08-pointers',
        title: 'The Address-Of (&) and Dereference (*) Operators',
        description: 'How pointers store memory locations of other variables.',
        order: 1,
        estimatedMinutes: 18,
        sections: [
          {
            title: '1. What is an Address?',
            content: 'Every byte in RAM has a unique numeric address (e.g. `0x7FFEE4B8`). The **Address-Of operator (`&`)** returns the memory address of a variable.',
            mentalModelTip: '`x` is the value in the mailbox. `&x` is the street address on the front of the mailbox.'
          },
          {
            title: '2. Pointer Variables (`int *ptr`)',
            content: 'A pointer is simply a variable whose value is the **memory address** of another variable.\nThe **Dereference operator (`*ptr`)** follows the address to read or modify the value stored at that location.',
            codeSnippet: `int x = 42;
int *ptr = &x;     // ptr holds the memory address of x
*ptr = 99;         // Modifies x to 99 through the pointer!`
          }
        ],
        interactiveWidget: {
          title: 'Pointer Mutation Visualizer',
          description: 'Step through creating a pointer and modifying x through *ptr.',
          code: `int main() {
    int x = 42;
    int *ptr = &x;
    *ptr = 99;
    return 0;
}`
        },
        quiz: [
          {
            id: 'q-08-01-1',
            question: 'What does the operator `&x` produce in C?',
            options: [
              'The value stored inside x',
              'The memory address of x',
              'The data type of x',
              'A pointer to the operating system'
            ],
            correctOptionIndex: 1,
            explanation: 'The `&` operator is the Address-Of operator, returning the hexadecimal RAM address where `x` is stored.'
          }
        ]
      }
    ]
  }
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return CURRICULUM_TOPICS.find(t => t.slug === slug);
}

export function getLessonBySlug(topicSlug: string, lessonSlug: string): { topic: Topic; lesson: Lesson } | undefined {
  const topic = getTopicBySlug(topicSlug);
  if (!topic) return undefined;
  const lesson = topic.lessons.find(l => l.slug === lessonSlug);
  if (!lesson) return undefined;
  return { topic, lesson };
}
