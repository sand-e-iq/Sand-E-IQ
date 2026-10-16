import { Difficulty, GameMode, EnglishCategory } from '../types/game';

const PREFIX = 'arunan_iq_session_';

export interface ChildGameSession {
  puzzleIndex: number;
  totalStars: number;
  gridState?: number[][];
  timeElapsed: number;
  selectedOption: number | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  lastUpdated: number;
}

export interface DetectiveGameSession {
  caseIndex: number;
  solvedCount: number;
  revealedClues: number[];
  selectedSuspectId: number | null;
  timeElapsed: number;
  isAnswered: boolean;
  isCorrect: boolean | null;
  lastUpdated: number;
}

export interface EnglishGameSession {
  selectedLevel: 'all' | 'easy' | 'medium' | 'hard';
  selectedCategory: EnglishCategory | 'all';
  currentIndex: number;
  score: number;
  streak: number;
  stars: number;
  timeElapsed: number;
  lastUpdated: number;
}

export interface GridGameSession {
  difficulty: Difficulty;
  puzzleIndex: number;
  playerGrid: number[][];
  strikes: number;
  moves: number;
  errors: number;
  hintsUsed: number;
  timeElapsed: number;
  isHardcore: boolean;
  lastUpdated: number;
}

export interface PatternGameSession {
  difficulty: Difficulty;
  puzzleIndex: number;
  selectedOption: number | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  timeElapsed: number;
  streak: number;
  lastUpdated: number;
}

export interface SequenceGameSession {
  difficulty: Difficulty;
  puzzleIndex: number;
  selectedOption: number | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  timeElapsed: number;
  streak: number;
  lastUpdated: number;
}

export interface AssessmentGameSession {
  stage: 'intro' | 'testing' | 'result';
  currentQIndex: number;
  answers: (number | null)[];
  timeElapsed: number;
  lastUpdated: number;
}

// Active mode persistence
export function saveActiveMode(mode: GameMode): void {
  try {
    localStorage.setItem(`${PREFIX}active_mode`, mode);
  } catch {
    // ignore
  }
}

export function loadActiveMode(): GameMode {
  try {
    const saved = localStorage.getItem(`${PREFIX}active_mode`) as GameMode;
    const validModes: GameMode[] = [
      'child',
      'detective',
      'english',
      'grid',
      'pattern',
      'sequence',
      'assessment',
    ];
    if (saved && validModes.includes(saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'child';
}

// Generic storage helper
function saveSessionItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function loadSessionItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch {
    // ignore
  }
  return null;
}

export function clearSession(mode: GameMode): void {
  try {
    localStorage.removeItem(`${PREFIX}${mode}`);
  } catch {
    // ignore
  }
}

// Mode-specific session getters & setters
export const saveChildSession = (data: ChildGameSession) => saveSessionItem('child', data);
export const loadChildSession = () => loadSessionItem<ChildGameSession>('child');

export const saveDetectiveSession = (data: DetectiveGameSession) => saveSessionItem('detective', data);
export const loadDetectiveSession = () => loadSessionItem<DetectiveGameSession>('detective');

export const saveEnglishSession = (data: EnglishGameSession) => saveSessionItem('english', data);
export const loadEnglishSession = () => loadSessionItem<EnglishGameSession>('english');

export const saveGridSession = (data: GridGameSession) => saveSessionItem('grid', data);
export const loadGridSession = () => loadSessionItem<GridGameSession>('grid');

export const savePatternSession = (data: PatternGameSession) => saveSessionItem('pattern', data);
export const loadPatternSession = () => loadSessionItem<PatternGameSession>('pattern');

export const saveSequenceSession = (data: SequenceGameSession) => saveSessionItem('sequence', data);
export const loadSequenceSession = () => loadSessionItem<SequenceGameSession>('sequence');

export const saveAssessmentSession = (data: AssessmentGameSession) => saveSessionItem('assessment', data);
export const loadAssessmentSession = () => loadSessionItem<AssessmentGameSession>('assessment');
