import { PatternPuzzle } from '../types/game';

export const PATTERN_PUZZLES: PatternPuzzle[] = [
  {
    id: 'pat-1',
    title: 'Progressive Rotation Sequence',
    difficulty: 'easy',
    category: 'rotation',
    ruleExplanation:
      'Each row rotates the directional indicator clockwise by 45°. Following the 3rd row: Top-left starts pointing Left (180°), Middle points Top-Left (225°), so the final cell must point directly Up (270° / -90°).',
    cells: [
      { shape: 'triangle', rotation: 0, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'triangle', rotation: 45, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'triangle', rotation: 90, shading: 'solid', colorTheme: 'cyan' },

      { shape: 'triangle', rotation: 90, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'triangle', rotation: 135, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'triangle', rotation: 180, shading: 'solid', colorTheme: 'cyan' },

      { shape: 'triangle', rotation: 180, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'triangle', rotation: 225, shading: 'solid', colorTheme: 'cyan' },
      null, // Missing ?
    ],
    options: [
      { shape: 'triangle', rotation: 270, shading: 'solid', colorTheme: 'cyan' }, // Correct (0)
      { shape: 'triangle', rotation: 315, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'triangle', rotation: 180, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'triangle', rotation: 270, shading: 'empty', colorTheme: 'cyan' },
      { shape: 'square', rotation: 270, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'triangle', rotation: 90, shading: 'solid', colorTheme: 'amber' },
    ],
    correctIndex: 0,
  },
  {
    id: 'pat-2',
    title: 'Dual Geometric Morphing',
    difficulty: 'easy',
    category: 'distribution',
    ruleExplanation:
      'Each row contains a Circle, Square, and Diamond. Furthermore, the inner element shading alternates: Empty, Hatched, Solid. In the third row, we have Hatched Diamond and Solid Circle, so the missing element is an Empty Square.',
    cells: [
      { shape: 'circle', shading: 'empty', colorTheme: 'emerald' },
      { shape: 'square', shading: 'hatched', colorTheme: 'emerald' },
      { shape: 'diamond', shading: 'solid', colorTheme: 'emerald' },

      { shape: 'square', shading: 'solid', colorTheme: 'emerald' },
      { shape: 'diamond', shading: 'empty', colorTheme: 'emerald' },
      { shape: 'circle', shading: 'hatched', colorTheme: 'emerald' },

      { shape: 'diamond', shading: 'hatched', colorTheme: 'emerald' },
      { shape: 'circle', shading: 'solid', colorTheme: 'emerald' },
      null,
    ],
    options: [
      { shape: 'square', shading: 'hatched', colorTheme: 'emerald' },
      { shape: 'square', shading: 'empty', colorTheme: 'emerald' }, // Correct (1)
      { shape: 'diamond', shading: 'empty', colorTheme: 'emerald' },
      { shape: 'circle', shading: 'empty', colorTheme: 'emerald' },
      { shape: 'square', shading: 'solid', colorTheme: 'emerald' },
      { shape: 'triangle', shading: 'empty', colorTheme: 'emerald' },
    ],
    correctIndex: 1,
  },
  {
    id: 'pat-3',
    title: 'Orbital Quantization',
    difficulty: 'medium',
    category: 'progression',
    ruleExplanation:
      'Across each row, the central shape remains constant while the outer satellite dot count increases by 1: Row 1 (1,2,3), Row 2 (2,3,4), Row 3 (3,4,?). The missing cell must have a Star with 5 satellite dots.',
    cells: [
      { shape: 'circle', dotsCount: 1, shading: 'solid', colorTheme: 'amber' },
      { shape: 'circle', dotsCount: 2, shading: 'solid', colorTheme: 'amber' },
      { shape: 'circle', dotsCount: 3, shading: 'solid', colorTheme: 'amber' },

      { shape: 'diamond', dotsCount: 2, shading: 'solid', colorTheme: 'amber' },
      { shape: 'diamond', dotsCount: 3, shading: 'solid', colorTheme: 'amber' },
      { shape: 'diamond', dotsCount: 4, shading: 'solid', colorTheme: 'amber' },

      { shape: 'star', dotsCount: 3, shading: 'solid', colorTheme: 'amber' },
      { shape: 'star', dotsCount: 4, shading: 'solid', colorTheme: 'amber' },
      null,
    ],
    options: [
      { shape: 'star', dotsCount: 6, shading: 'solid', colorTheme: 'amber' },
      { shape: 'diamond', dotsCount: 5, shading: 'solid', colorTheme: 'amber' },
      { shape: 'star', dotsCount: 5, shading: 'solid', colorTheme: 'amber' }, // Correct (2)
      { shape: 'star', dotsCount: 4, shading: 'empty', colorTheme: 'amber' },
      { shape: 'circle', dotsCount: 5, shading: 'solid', colorTheme: 'amber' },
      { shape: 'cross', dotsCount: 5, shading: 'solid', colorTheme: 'amber' },
    ],
    correctIndex: 2,
  },
  {
    id: 'pat-4',
    title: 'Concentric Inversion Matrix',
    difficulty: 'medium',
    category: 'spatial',
    ruleExplanation:
      'Nested shape rule: In each row, the outer polygon changes (Square -> Hexagon -> Circle) and the inner miniature shape inverts its shading. The 3rd row requires a Circle outer boundary with an inverted inner miniature solid triangle.',
    cells: [
      { shape: 'square', secondaryShape: 'triangle', shading: 'empty', colorTheme: 'purple' },
      { shape: 'hexagon', secondaryShape: 'triangle', shading: 'hatched', colorTheme: 'purple' },
      { shape: 'circle', secondaryShape: 'triangle', shading: 'solid', colorTheme: 'purple' },

      { shape: 'square', secondaryShape: 'diamond', shading: 'hatched', colorTheme: 'purple' },
      { shape: 'hexagon', secondaryShape: 'diamond', shading: 'solid', colorTheme: 'purple' },
      { shape: 'circle', secondaryShape: 'diamond', shading: 'empty', colorTheme: 'purple' },

      { shape: 'square', secondaryShape: 'triangle', shading: 'solid', colorTheme: 'purple' },
      { shape: 'hexagon', secondaryShape: 'triangle', shading: 'empty', colorTheme: 'purple' },
      null,
    ],
    options: [
      { shape: 'circle', secondaryShape: 'triangle', shading: 'hatched', colorTheme: 'purple' }, // Correct (0)
      { shape: 'circle', secondaryShape: 'diamond', shading: 'hatched', colorTheme: 'purple' },
      { shape: 'hexagon', secondaryShape: 'triangle', shading: 'hatched', colorTheme: 'purple' },
      { shape: 'square', secondaryShape: 'triangle', shading: 'solid', colorTheme: 'purple' },
      { shape: 'circle', secondaryShape: 'triangle', shading: 'empty', colorTheme: 'purple' },
      { shape: 'diamond', secondaryShape: 'triangle', shading: 'hatched', colorTheme: 'purple' },
    ],
    correctIndex: 0,
  },
  {
    id: 'pat-5',
    title: 'Logical XOR Vector Addition',
    difficulty: 'hard',
    category: 'addition',
    ruleExplanation:
      'Classic high-IQ XOR rule: The 3rd column is the logical superposition (XOR) of columns 1 and 2. Elements present in only one column are kept, while overlapping elements cancel out. In row 3, combining the cross-hairs results in a 4-point cross with hollow center.',
    cells: [
      { shape: 'line', rotation: 0, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'line', rotation: 90, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'cross', rotation: 0, shading: 'solid', colorTheme: 'cyan' },

      { shape: 'cross', rotation: 0, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'cross', rotation: 45, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'star', rotation: 0, shading: 'solid', colorTheme: 'cyan' },

      { shape: 'star', rotation: 0, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'cross', rotation: 0, shading: 'solid', colorTheme: 'cyan' },
      null,
    ],
    options: [
      { shape: 'line', rotation: 0, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'cross', rotation: 0, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'cross', rotation: 45, shading: 'solid', colorTheme: 'cyan' }, // Correct (2)
      { shape: 'star', rotation: 45, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'circle', rotation: 0, shading: 'solid', colorTheme: 'cyan' },
      { shape: 'diamond', rotation: 0, shading: 'solid', colorTheme: 'cyan' },
    ],
    correctIndex: 2,
  },
  {
    id: 'pat-6',
    title: 'Hyper-Dimensional Vertex Progression',
    difficulty: 'master',
    category: 'progression',
    ruleExplanation:
      'Vertex count law: Vertices of shapes sum along diagonals and increment systematically. Along column 3: Shape 1 has 6 vertices (Hexagon, 60°), Shape 2 has 8 vertices (Octagram, 90°), and Shape 3 must have 10 rotational vertices (Decagram, 120° with solid shading).',
    cells: [
      { shape: 'triangle', rotation: 0, shading: 'empty', dotsCount: 3, colorTheme: 'amber' },
      { shape: 'square', rotation: 45, shading: 'hatched', dotsCount: 4, colorTheme: 'amber' },
      { shape: 'hexagon', rotation: 60, shading: 'solid', dotsCount: 6, colorTheme: 'amber' },

      { shape: 'square', rotation: 0, shading: 'hatched', dotsCount: 4, colorTheme: 'amber' },
      { shape: 'hexagon', rotation: 45, shading: 'solid', dotsCount: 6, colorTheme: 'amber' },
      { shape: 'star', rotation: 90, shading: 'empty', dotsCount: 8, colorTheme: 'amber' },

      { shape: 'hexagon', rotation: 0, shading: 'solid', dotsCount: 6, colorTheme: 'amber' },
      { shape: 'star', rotation: 45, shading: 'empty', dotsCount: 8, colorTheme: 'amber' },
      null,
    ],
    options: [
      { shape: 'hexagon', rotation: 90, shading: 'hatched', dotsCount: 8, colorTheme: 'amber' },
      { shape: 'star', rotation: 120, shading: 'hatched', dotsCount: 10, colorTheme: 'amber' }, // Correct (1)
      { shape: 'star', rotation: 45, shading: 'solid', dotsCount: 8, colorTheme: 'amber' },
      { shape: 'circle', rotation: 0, shading: 'hatched', dotsCount: 10, colorTheme: 'amber' },
      { shape: 'square', rotation: 90, shading: 'solid', dotsCount: 6, colorTheme: 'amber' },
      { shape: 'triangle', rotation: 120, shading: 'hatched', dotsCount: 10, colorTheme: 'amber' },
    ],
    correctIndex: 1,
  },
];
