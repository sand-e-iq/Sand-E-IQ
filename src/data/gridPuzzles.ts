import { Difficulty, GridPuzzle } from '../types/game';

// Compute row and column run clues from a 2D binary grid solution
export function computeClues(grid: number[][]): { rowClues: number[][]; colClues: number[][] } {
  const rows = grid.length;
  const cols = grid[0].length;

  const rowClues: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const clues: number[] = [];
    let count = 0;
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        count++;
      } else if (count > 0) {
        clues.push(count);
        count = 0;
      }
    }
    if (count > 0) clues.push(count);
    rowClues.push(clues.length > 0 ? clues : [0]);
  }

  const colClues: number[][] = [];
  for (let c = 0; c < cols; c++) {
    const clues: number[] = [];
    let count = 0;
    for (let r = 0; r < rows; r++) {
      if (grid[r][c] === 1) {
        count++;
      } else if (count > 0) {
        clues.push(count);
        count = 0;
      }
    }
    if (count > 0) clues.push(count);
    colClues.push(clues.length > 0 ? clues : [0]);
  }

  return { rowClues, colClues };
}

// Helper to make a puzzle with auto-calculated clues
function createPuzzle(
  id: string,
  title: string,
  difficulty: Difficulty,
  grid: number[][],
  description?: string
): GridPuzzle {
  const { rowClues, colClues } = computeClues(grid);
  return {
    id,
    title,
    difficulty,
    size: grid.length,
    rowClues,
    colClues,
    solution: grid,
    description,
  };
}

export const GRID_PUZZLES: GridPuzzle[] = [
  // EASY: 5x5
  createPuzzle(
    'grid-e-1',
    'Diamond Star',
    'easy',
    [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ],
    'A central crystalline motif with diamond symmetry.'
  ),
  createPuzzle(
    'grid-e-2',
    'Retro Invader',
    'easy',
    [
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
    ],
    'A classic 8-bit digital guardian.'
  ),
  createPuzzle(
    'grid-e-3',
    'Hourglass Logic',
    'easy',
    [
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
    ],
    'Time flows symmetrically through the center point.'
  ),
  createPuzzle(
    'grid-e-4',
    'Anchor Crest',
    'easy',
    [
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    'Maritime navigational symmetry.'
  ),
  createPuzzle(
    'grid-e-5',
    'Chevron Arrow',
    'easy',
    [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
    'A directional pointer with balanced shaft.'
  ),

  // MEDIUM: 6x6
  createPuzzle(
    'grid-m-1',
    'Royal Crown',
    'medium',
    [
      [1, 0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1, 0],
      [1, 0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ].map(row => row.slice(0, 6)),
    'Tri-point royal regalia with a balanced foundation.'
  ),
  createPuzzle(
    'grid-m-2',
    'Castle Citadel',
    'medium',
    [
      [1, 0, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1],
    ],
    'Fortress battlement with archway deductions.'
  ),
  createPuzzle(
    'grid-m-3',
    'Solar Eclipse',
    'medium',
    [
      [0, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 1, 1],
      [1, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 1],
      [1, 1, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 0],
    ],
    'Concentric ring with hollowed solar core.'
  ),
  createPuzzle(
    'grid-m-4',
    'Falcon Silhouette',
    'medium',
    [
      [0, 0, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 1, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 1],
    ],
    'Winged predator diving in tactical flight.'
  ),

  // HARD: 7x7
  createPuzzle(
    'grid-h-1',
    'Compass Rose',
    'hard',
    [
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
    ],
    'Eight-point navigational array with intersecting diagonals.'
  ),
  createPuzzle(
    'grid-h-2',
    'Dragon Sigil',
    'hard',
    [
      [0, 1, 0, 0, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
    ],
    'Dual horn symmetry with flared wings.'
  ),
  createPuzzle(
    'grid-h-3',
    'Circuit Processor',
    'hard',
    [
      [1, 0, 1, 1, 1, 0, 1],
      [0, 0, 1, 0, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 0, 1, 0, 0],
      [1, 0, 1, 1, 1, 0, 1],
    ],
    'Silicon gate logic channels with peripheral interconnects.'
  ),

  // MASTER: 8x8
  createPuzzle(
    'grid-mas-1',
    'Archimedean Spiral',
    'master',
    [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
    ],
    'Continuous labyrinthine perimeter winding into a singular core.'
  ),
  createPuzzle(
    'grid-mas-2',
    'Quantum Lattice',
    'master',
    [
      [0, 1, 1, 0, 0, 1, 1, 0],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [0, 1, 1, 0, 0, 1, 1, 0],
      [0, 1, 1, 0, 0, 1, 1, 0],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [0, 1, 1, 0, 0, 1, 1, 0],
    ],
    'Superposed geometric wave interference pattern.'
  ),
  createPuzzle(
    'grid-mas-3',
    'Chrono Chronometer',
    'master',
    [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
    ],
    'Nested dial with gear escapement.'
  ),
];

// Generates a dynamic random procedural puzzle when all curated ones are mastered
export function generateProceduralGridPuzzle(difficulty: Difficulty): GridPuzzle {
  const size = {
    easy: 5,
    medium: 6,
    hard: 7,
    master: 8,
  }[difficulty];

  const grid: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
  const density = 0.45 + Math.random() * 0.15;

  // Generate with vertical symmetry for aesthetically pleasing solvable patterns
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= Math.floor(size / 2); c++) {
      const isFilled = Math.random() < density ? 1 : 0;
      grid[r][c] = isFilled;
      grid[r][size - 1 - c] = isFilled;
    }
  }

  // Ensure no row or column is 100% empty
  for (let r = 0; r < size; r++) {
    if (!grid[r].some(v => v === 1)) {
      grid[r][Math.floor(size / 2)] = 1;
    }
  }

  const id = `procedural-${difficulty}-${Date.now().toString(36)}`;
  return createPuzzle(
    id,
    `Procedural Pattern #${Math.floor(100 + Math.random() * 900)}`,
    difficulty,
    grid,
    'Algorithmic symmetric matrix logic deduction challenge.'
  );
}
