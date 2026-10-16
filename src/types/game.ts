export type GameMode =
  | 'quiz'
  | 'braingames'
  | 'daily'
  | 'memory'
  | 'child'
  | 'detective'
  | 'english'
  | 'grid'
  | 'pattern'
  | 'sequence'
  | 'assessment'
  | 'multiplayer'
  | 'admin'
  | 'tournament'
  | 'customquiz'
  | 'adaptive'
  | 'spatial'
  | 'wikipedia'
  | 'analytics';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'master';

export type EnglishCategory = 'grammar' | 'vocab' | 'sentences' | 'spelling' | 'opposites';

export interface EnglishLessonOption {
  id: string;
  text: string;
  textTa?: string;
  isCorrect: boolean;
}

export interface EnglishLessonItem {
  id: string;
  category: EnglishCategory;
  level: 'easy' | 'medium' | 'hard';
  title: string;
  titleTa: string;
  titleFr?: string;
  titleEs?: string;
  titleHi?: string;
  prompt: string;
  promptTa: string;
  promptFr?: string;
  promptEs?: string;
  promptHi?: string;
  sentenceWithBlank?: string;
  incorrectCommon?: string;
  options: EnglishLessonOption[];
  explanation: string;
  explanationTa: string;
  pronunciationPhrase: string;
  ruleTip: string;
  ruleTipTa: string;
  emoji: string;
}

export interface DetectiveSuspect {
  id: number;
  name: string;
  nameTa: string;
  nameFr?: string;
  nameEs?: string;
  nameHi?: string;
  role: string;
  roleTa: string;
  roleFr?: string;
  roleEs?: string;
  roleHi?: string;
  avatar: string;
  statement: string;
  statementTa: string;
  statementFr?: string;
  statementEs?: string;
  statementHi?: string;
}

export interface DetectiveCase {
  id: string;
  caseNumber: number;
  difficulty: Difficulty;
  title: string;
  titleTa: string;
  titleFr?: string;
  titleEs?: string;
  titleHi?: string;
  synopsis: string;
  synopsisTa: string;
  synopsisFr?: string;
  synopsisEs?: string;
  synopsisHi?: string;
  sceneVisualEmoji: string;
  crimeSceneDetails: string[];
  crimeSceneDetailsTa: string[];
  crimeSceneDetailsFr?: string[];
  crimeSceneDetailsEs?: string[];
  crimeSceneDetailsHi?: string[];
  suspects: DetectiveSuspect[];
  clues: {
    label: string;
    labelTa: string;
    labelFr?: string;
    labelEs?: string;
    labelHi?: string;
    icon: string;
    description: string;
    descriptionTa: string;
    descriptionFr?: string;
    descriptionEs?: string;
    descriptionHi?: string;
  }[];
  question: string;
  questionTa: string;
  questionFr?: string;
  questionEs?: string;
  questionHi?: string;
  correctSuspectId: number;
  mehulVerdict: string;
  mehulVerdictTa: string;
  mehulVerdictFr?: string;
  mehulVerdictEs?: string;
  mehulVerdictHi?: string;
  mehulCatchphraseTa: string;
  mehulCatchphraseFr?: string;
  mehulCatchphraseEs?: string;
  mehulCatchphraseHi?: string;
}

export interface ChildPuzzle {
  id: string;
  category: 'grid' | 'pattern' | 'counting' | 'animals';
  title: string;
  titleTa?: string;
  titleFr?: string;
  titleEs?: string;
  titleHi?: string;
  question: string;
  questionTa?: string;
  questionFr?: string;
  questionEs?: string;
  questionHi?: string;
  hint: string;
  hintTa?: string;
  hintFr?: string;
  hintEs?: string;
  hintHi?: string;
  type: 'grid' | 'choice';
  gridSize?: number;
  gridSolution?: number[][];
  rowClues?: number[][];
  colClues?: number[][];
  icon?: string;
  sequenceVisual?: {
    emoji?: string;
    color?: string;
    label?: string;
    labelTa?: string;
    labelFr?: string;
    labelEs?: string;
    labelHi?: string;
    shape?: string;
  }[];
  options?: {
    id: number;
    label: string;
    labelTa?: string;
    labelFr?: string;
    labelEs?: string;
    labelHi?: string;
    emoji?: string;
    color?: string;
  }[];
  correctAnswerIndex?: number;
  explanation: string;
  explanationTa?: string;
  explanationFr?: string;
  explanationEs?: string;
  explanationHi?: string;
}

export interface GridPuzzle {
  id: string;
  title: string;
  difficulty: Difficulty;
  size: number;
  rowClues: number[][];
  colClues: number[][];
  solution: number[][]; // 1 for filled, 0 for empty
  description?: string;
}

export type ShapeType = 'circle' | 'square' | 'triangle' | 'diamond' | 'cross' | 'star' | 'hexagon' | 'line';
export type ShadingType = 'empty' | 'solid' | 'hatched' | 'dots' | 'half';

export interface PatternCell {
  shape?: ShapeType;
  secondaryShape?: ShapeType;
  count?: number;
  rotation?: number; // 0, 45, 90, 135, 180, etc.
  shading?: ShadingType;
  colorTheme?: 'cyan' | 'amber' | 'emerald' | 'purple' | 'slate';
  dotsCount?: number;
  customSvgPath?: string;
  customOverlay?: string;
  gridCoordinates?: { x: number; y: number }[];
}

export interface PatternPuzzle {
  id: string;
  title: string;
  difficulty: Difficulty;
  ruleExplanation: string;
  cells: (PatternCell | null)[]; // 9 cells for 3x3, index 8 is null (?)
  options: PatternCell[]; // 6 options
  correctIndex: number;
  category: 'rotation' | 'addition' | 'progression' | 'spatial' | 'distribution';
}

export interface SequencePuzzle {
  id: string;
  title: string;
  difficulty: Difficulty;
  prompt: string;
  sequence: (number | string)[];
  options: (number | string)[];
  correctIndex: number;
  ruleExplanation: string;
  domain: 'arithmetic' | 'geometric' | 'alternating' | 'fibonacci' | 'spatial';
}

export interface AssessmentQuestion {
  type: 'grid' | 'pattern' | 'sequence';
  puzzle: GridPuzzle | PatternPuzzle | SequencePuzzle;
  points: number;
  category: 'Deduction' | 'Pattern' | 'Working Memory' | 'Speed';
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  mode: GameMode;
  difficulty: Difficulty;
  score: number;
  iqEstimate: number;
  timeSeconds: number;
  accuracy: number;
  date: string;
  isUser?: boolean;
  notes?: string;
}

export interface UserProfile {
  playerName: string;
  gamesPlayed: number;
  gamesWon: number;
  highestIQ: number;
  bestScores: Record<string, number>;
  unlockedBadges: string[];
  soundEnabled: boolean;
  dailyStreak?: number;
  lastDailyDate?: string;
  totalScore?: number;
  // Advanced features
  xp?: number;
  level?: number;
  avatar?: string;
  title?: string;
  theme?: 'dark' | 'light';
  categoryStats?: Record<string, { correct: number; total: number; timeSecondsTotal: number }>;
  streakHistory?: string[]; // array of ISO date strings YYYY-MM-DD
  notificationsEnabled?: boolean;
  reminderTime?: string;
  customQuizzes?: CustomQuizItem[];
  bookmarkedQuestionIds?: string[];
  voiceReadingEnabled?: boolean;
}

export interface CustomQuizItem {
  id: string;
  title: string;
  titleTa?: string;
  author: string;
  createdAt: string;
  category: string;
  timeLimitSeconds?: number;
  questions: IQQuizQuestion[];
}

export interface DailyTournamentEntry {
  id: string;
  tournamentDate: string; // YYYY-MM-DD
  playerName: string;
  score: number;
  timeSeconds: number;
  accuracy: number;
  rank?: number;
  completedAt: string;
}

export interface FriendChallenge {
  code: string;
  creatorName: string;
  targetScore: number;
  accuracy: number;
  mode: GameMode;
  difficulty: Difficulty;
  questionIds: string[];
  createdAt: string;
}

export interface GameStats {
  score: number;
  timeElapsed: number;
  errors: number;
  moves: number;
  hintsUsed: number;
}

export interface IQQuizOption {
  id: string;
  text: string;
  textTa: string;
  isCorrect: boolean;
}

export interface IQQuizQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'pattern' | 'sequence' | 'verbal' | 'spatial' | 'memory';
  title: string;
  titleTa: string;
  prompt: string;
  promptTa: string;
  visualEmoji?: string;
  diagramSvg?: string;
  options: IQQuizOption[];
  explanation: string;
  explanationTa: string;
  cognitiveTip: string;
  cognitiveTipTa: string;
}

export interface DailyBrainPuzzle {
  id: string;
  dateKey: string; // YYYY-MM-DD
  dayNumber: number;
  title: string;
  titleTa: string;
  prompt: string;
  promptTa: string;
  type: 'logic_riddle' | 'sequence_matrix' | 'spatial_deduction' | 'math_intuition';
  options: {
    id: string;
    text: string;
    textTa: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  explanationTa: string;
  hint: string;
  hintTa: string;
  bonusPoints: number;
}

export interface AchievementItem {
  id: string;
  name: string;
  nameTa: string;
  description: string;
  descriptionTa: string;
  icon: string;
  category: 'quiz' | 'daily' | 'memory' | 'mastery';
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface WikipediaArticleSummary {
  pageid: number;
  title: string;
  extract: string;
  thumbnail?: string;
  fullurl: string;
  lang: 'en' | 'ta';
  wordCount?: number;
}

export interface WikipediaQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  cognitiveTip?: string;
  sourceArticle: string;
  sourceUrl: string;
  lang: 'en' | 'ta';
}

