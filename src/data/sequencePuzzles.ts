import { SequencePuzzle } from '../types/game';

export const SEQUENCE_PUZZLES: SequencePuzzle[] = [
  {
    id: 'seq-1',
    title: 'Oscillating Dual Step',
    difficulty: 'easy',
    domain: 'alternating',
    prompt: 'Identify the missing term in this alternating arithmetic sequence:',
    sequence: [3, 8, 6, 11, 9, 14, 12, '?'],
    options: [15, 17, 18, 16],
    correctIndex: 1, // 17
    ruleExplanation: 'The sequence alternates two operations: add 5 (+5), then subtract 2 (-2). 12 + 5 = 17.',
  },
  {
    id: 'seq-2',
    title: 'Fibonacci Square Difference',
    difficulty: 'easy',
    domain: 'fibonacci',
    prompt: 'Determine the continuation of the series:',
    sequence: [2, 3, 5, 8, 13, 21, 34, '?'],
    options: [47, 55, 52, 60],
    correctIndex: 1, // 55
    ruleExplanation: 'Each term is the sum of the preceding two terms (Fibonacci sequence): 21 + 34 = 55.',
  },
  {
    id: 'seq-3',
    title: 'Prime Power Offsets',
    difficulty: 'medium',
    domain: 'arithmetic',
    prompt: 'What number logically completes the matrix sequence?',
    sequence: [2, 6, 12, 20, 30, 42, 56, '?'],
    options: [68, 70, 72, 74],
    correctIndex: 2, // 72
    ruleExplanation: 'The differences between consecutive terms increase by +2 each step: +4, +6, +8, +10, +12, +14, so next difference is +16. 56 + 16 = 72 (or formula n*(n+1)).',
  },
  {
    id: 'seq-4',
    title: 'Cubic Decay Divergence',
    difficulty: 'medium',
    domain: 'geometric',
    prompt: 'Solve the missing variable in the decreasing polynomial curve:',
    sequence: [216, 125, 64, 27, 8, '?'],
    options: [1, 0, 2, 4],
    correctIndex: 0, // 1
    ruleExplanation: 'These are descending perfect cubes: 6^3 (216), 5^3 (125), 4^3 (64), 3^3 (27), 2^3 (8), so the next term is 1^3 = 1.',
  },
  {
    id: 'seq-5',
    title: 'Modular Clockwork Transform',
    difficulty: 'hard',
    domain: 'spatial',
    prompt: 'Find the hidden value governed by cyclic base-7 arithmetic:',
    sequence: [4, 7, 13, 25, 49, 97, '?'],
    options: [187, 193, 191, 189],
    correctIndex: 1, // 193
    ruleExplanation: 'Each term is multiplied by 2 and then decreased by 1: (x * 2) - 1. 97 * 2 = 194; 194 - 1 = 193.',
  },
  {
    id: 'seq-6',
    title: 'Recamán Geometric Spiral',
    difficulty: 'master',
    domain: 'spatial',
    prompt: 'Compute the next step in this non-linear sequence recursion:',
    sequence: [1, 2, 6, 24, 120, 720, '?'],
    options: [4320, 5040, 5760, 6480],
    correctIndex: 1, // 5040
    ruleExplanation: 'Factorial progression: 1! = 1, 2! = 2, 3! = 6, 4! = 24, 5! = 120, 6! = 720, 7! = 720 * 7 = 5040.',
  },
  {
    id: 'seq-7',
    title: 'Tribonacci Acceleration',
    difficulty: 'master',
    domain: 'fibonacci',
    prompt: 'Determine the 3-term convolution progression:',
    sequence: [1, 1, 2, 4, 7, 13, 24, 44, '?'],
    options: [81, 88, 85, 92],
    correctIndex: 0, // 81
    ruleExplanation: 'Tribonacci sequence: Each term is the sum of the three previous terms. 13 + 24 + 44 = 81.',
  },
];
