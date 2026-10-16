import { AchievementItem, CustomQuizItem, Difficulty, GameMode, LeaderboardEntry, UserProfile } from '../types/game';

const LEADERBOARD_KEY = 'sande_iq_genuine_leaderboard_v4';
const PROFILE_KEY = 'sande_iq_user_progress_v4';
const DAILY_COMPLETED_KEY = 'sande_iq_daily_completed_v4';
const CUSTOM_QUIZZES_KEY = 'sande_iq_custom_quizzes_v1';

const DEFAULT_PROFILE: UserProfile = {
  playerName: 'Player 1',
  gamesPlayed: 0,
  gamesWon: 0,
  highestIQ: 100,
  bestScores: {},
  unlockedBadges: [],
  soundEnabled: true,
  dailyStreak: 0,
  lastDailyDate: '',
  totalScore: 0,
  xp: 0,
  level: 1,
  avatar: '🧠',
  title: 'Cadet Thinker',
  theme: 'dark',
  categoryStats: {},
  streakHistory: [],
  notificationsEnabled: false,
  reminderTime: '19:00',
  customQuizzes: [],
  bookmarkedQuestionIds: [],
  voiceReadingEnabled: true,
};

// Available achievement catalog
export const ALL_ACHIEVEMENTS: Omit<AchievementItem, 'isUnlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_spark',
    name: 'First Spark',
    nameTa: 'முதல் தீப்பொறி',
    description: 'Complete your first quiz or brain challenge.',
    descriptionTa: 'உங்கள் முதல் புதிர் அல்லது வினாடி வினாவை முடிக்கவும்.',
    icon: '⚡',
    category: 'quiz',
  },
  {
    id: 'quiz_easy_master',
    name: 'Logic Cadet',
    nameTa: 'தர்க்க மாணவர்',
    description: 'Complete an Easy IQ Quiz with over 80% accuracy.',
    descriptionTa: 'எளிய வினாடி வினாவில் 80% க்கும் மேல் துல்லியத்துடன் முடிக்கவும்.',
    icon: '🎯',
    category: 'quiz',
  },
  {
    id: 'quiz_hard_victor',
    name: 'Master Strategist',
    nameTa: 'தலைசிறந்த உத்தியாளர்',
    description: 'Triumph over a Hard difficulty quiz with flawless accuracy.',
    descriptionTa: 'கடின வினாடி வினாவில் 100% துல்லியத்துடன் வெற்றி பெறுங்கள்.',
    icon: '🏆',
    category: 'quiz',
  },
  {
    id: 'daily_thinker',
    name: 'Daily Thinker',
    nameTa: 'தினசரி சிந்தனையாளர்',
    description: 'Solve a Daily Brain Puzzle on Sand.E IQ.',
    descriptionTa: 'Sand.E IQ தினசரி மூளைப் புதிரைத் தீர்க்கவும்.',
    icon: '📅',
    category: 'daily',
  },
  {
    id: 'streak_3',
    name: 'Streak Champion',
    nameTa: 'தொடர் வெற்றியாளர்',
    description: 'Maintain a 3-day consecutive puzzle solving streak.',
    descriptionTa: 'தொடர்ந்து 3 நாட்கள் புதிர்களைத் தீர்த்து சாதனை படைக்கவும்.',
    icon: '🔥',
    category: 'daily',
  },
  {
    id: 'memory_prodigy',
    name: 'Memory Prodigy',
    nameTa: 'நினைவாற்றல் மேதை',
    description: 'Reach Level 6 or higher in the Memory Matrix game.',
    descriptionTa: 'நினைவாற்றல் கட்ட ஆட்டத்தில் நிலை 6 அல்லது அதற்கும் மேல் அடையுங்கள்.',
    icon: '🧠',
    category: 'memory',
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    nameTa: 'மின்னல் வேகம்',
    description: 'Complete a challenge in under 30 seconds with 100% accuracy.',
    descriptionTa: '30 வினாடிகளுக்குள் 100% துல்லியத்துடன் புதிரை முடிக்கவும்.',
    icon: '⚡',
    category: 'mastery',
  },
  {
    id: 'flawless_mind',
    name: 'Flawless Mind',
    nameTa: 'குறையற்ற நுண்ணறிவு',
    description: 'Attain a 100% flawless score on any game round.',
    descriptionTa: 'எந்தவொரு ஆட்டத்திலும் 100% தவறில்லாத மதிப்பெண் பெறுங்கள்.',
    icon: '✨',
    category: 'mastery',
  },
  {
    id: 'high_scorer',
    name: 'Score Titan (5,000+)',
    nameTa: 'மதிப்பெண் நாயகன் (5,000+)',
    description: 'Score 5,000 points or more in a single session.',
    descriptionTa: 'ஒரே ஆட்டத்தில் 5,000 அல்லது அதற்கு மேற்பட்ட புள்ளிகள் பெறுங்கள்.',
    icon: '💎',
    category: 'mastery',
  },
  {
    id: 'first_quiz',
    name: 'First Quiz',
    nameTa: 'முதல் வினாடி வினா',
    description: 'Complete your first official IQ Quiz session.',
    descriptionTa: 'உங்கள் முதல் அதிகாரப்பூர்வ வினாடி வினாவை முடிக்கவும்.',
    icon: '⚡',
    category: 'quiz',
  },
  {
    id: 'brain_beginner',
    name: 'Brain Beginner',
    nameTa: 'ஆரம்பநிலை மூளையாளர்',
    description: 'Complete any 3 brain puzzle challenges.',
    descriptionTa: 'ஏதேனும் 3 மூளைப் புதிர் சவால்களை முடிக்கவும்.',
    icon: '🌱',
    category: 'mastery',
  },
  {
    id: 'logic_master',
    name: 'Logic Master',
    nameTa: 'தர்க்க மேதை',
    description: 'Solve logical reasoning or pattern challenges with high accuracy.',
    descriptionTa: 'தர்க்க பகுப்பாய்வு அல்லது வடிவ சவால்களை உயர் துல்லியத்துடன் தீர்க்கவும்.',
    icon: '🧩',
    category: 'quiz',
  },
  {
    id: 'memory_champion',
    name: 'Memory Champion',
    nameTa: 'நினைவாற்றல் சாம்பியன்',
    description: 'Excel in spatial matrix or memory card matching mini-games.',
    descriptionTa: 'நினைவாற்றல் கட்ட ஆட்டம் அல்லது அட்டைப் பொருத்தத்தில் சிறந்து விளங்கவும்.',
    icon: '🧠',
    category: 'memory',
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    nameTa: 'நூற்றுக்கு நூறு',
    description: 'Attain 100% flawless accuracy on any challenge round.',
    descriptionTa: 'எந்தவொரு சவாலிலும் 100% தவறில்லாத முழு துல்லியம் பெறவும்.',
    icon: '🌟',
    category: 'mastery',
  },
  {
    id: 'daily_practice_streak',
    name: 'Daily Practice Streak',
    nameTa: 'தினசரி பயிற்சி தொடர்ச்சி',
    description: 'Complete daily brain training multiple days in a row.',
    descriptionTa: 'தொடர்ச்சியாக பல நாட்கள் தினசரி மூளைப் பயிற்சியை முடிக்கவும்.',
    icon: '🔥',
    category: 'daily',
  },
  {
    id: 'challenge_champion',
    name: 'Challenge Champion',
    nameTa: 'சவால் வெற்றியாளர்',
    description: 'Accumulate over 5,000 cognitive points or win a multiplayer match.',
    descriptionTa: '5,000 புள்ளிகளுக்கு மேல் குவிக்கவும் அல்லது மல்டிபிளேயரில் வெற்றி பெறவும்.',
    icon: '🏆',
    category: 'mastery',
  },
  {
    id: 'xp_1000',
    name: 'XP Prodigy',
    nameTa: 'புள்ளி சாதனையாளர்',
    description: 'Accumulate over 1,000 cognitive XP across your challenges.',
    descriptionTa: '1,000 க்கும் மேற்பட்ட அறிவுத்திறன் புள்ளிகளைப் பெறுங்கள்.',
    icon: '⚡',
    category: 'mastery',
  },
  {
    id: 'xp_5000',
    name: 'Level Vanguard',
    nameTa: 'நிலை 5 முன்னணி',
    description: 'Reach Level 5 or higher in the Sand.E IQ level progression system.',
    descriptionTa: 'சாண்ட்.இ IQ முன்னேற்றத்தில் நிலை 5 அல்லது அதற்கும் மேல் அடையுங்கள்.',
    icon: '🎖️',
    category: 'mastery',
  },
  {
    id: 'streak_7',
    name: 'Week of Brilliance',
    nameTa: 'ஒளிரும் வார சாதனை',
    description: 'Maintain a 7-day uninterrupted puzzle solving streak.',
    descriptionTa: 'தொடர்ந்து 7 நாட்கள் புதிர்களைத் தீர்த்து சாதனை படைக்கவும்.',
    icon: '🔥',
    category: 'daily',
  },
  {
    id: 'tournament_champ',
    name: 'Tournament Contender',
    nameTa: 'போட்டி வீரன்',
    description: 'Submit an official score to the Sand.E IQ Daily Tournament.',
    descriptionTa: 'தினசரி போட்டியில் அதிகாரப்பூர்வ மதிப்பெண்ணைப் பதிவு செய்யுங்கள்.',
    icon: '👑',
    category: 'mastery',
  },
  {
    id: 'custom_architect',
    name: 'Quiz Architect',
    nameTa: 'வினா வடிவமைப்பாளர்',
    description: 'Create and save your first custom quiz with custom deductive questions.',
    descriptionTa: 'உங்கள் சொந்த வினாடி வினாவை உருவாக்கி சேமிக்கவும்.',
    icon: '🛠️',
    category: 'quiz',
  },
  {
    id: 'adaptive_survivor',
    name: 'Adaptive Genius',
    nameTa: 'தகவமைப்பு மேதை',
    description: 'Conquer the real-time dynamic Adaptive Difficulty quiz mode.',
    descriptionTa: 'தகவமைப்பு கடின வினாடி வினா முறையில் வெற்றிகரமாக முடிக்கவும்.',
    icon: '🧬',
    category: 'quiz',
  },
  {
    id: 'voice_reader',
    name: 'Auditory Thinker',
    nameTa: 'செவிவழி சிந்தனையாளர்',
    description: 'Listen to question clues using the integrated Voice Reading system.',
    descriptionTa: 'குரல் வாசிப்பு வசதியைப் பயன்படுத்தி கேள்விகளைக் கேளுங்கள்.',
    icon: '🔊',
    category: 'quiz',
  },
  {
    id: 'theme_shifter',
    name: 'Chroma Master',
    nameTa: 'வண்ண மாஸ்டர்',
    description: 'Switch between signature Cyber Dark and High-Contrast Light themes.',
    descriptionTa: 'டார்க் மற்றும் லைட் தீம்களுக்கு இடையே மாறவும்.',
    icon: '🌓',
    category: 'mastery',
  },
  {
    id: 'wiki_explorer',
    name: 'Omni Scholar',
    nameTa: 'பல்நோக்கு அறிஞர்',
    description: 'Explore Wikipedia articles and ace a Knowledge Challenge in the Knowledge Hub.',
    descriptionTa: 'விக்கிபீடியா அறிவு மையத்தில் கட்டுரைகளை ஆராய்ந்து வினாடி வினாவை முடிக்கவும்.',
    icon: '🌐',
    category: 'quiz',
  },
];

// Returns genuinely recorded leaderboard scores from user sessions (no invented records)
export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) {
      return [];
    }
    const parsed: LeaderboardEntry[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => b.score - a.score);
  } catch (err) {
    console.error('Failed reading genuine leaderboard from localStorage', err);
    return [];
  }
}

export function saveScoreToLeaderboard(
  entry: Omit<LeaderboardEntry, 'id' | 'date'>
): LeaderboardEntry {
  const all = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: 'rec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    date: new Date().toISOString(),
    isUser: true,
  };

  all.push(newEntry);
  all.sort((a, b) => b.score - a.score);

  // Keep top 100 authentic entries
  const trimmed = all.slice(0, 100);

  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed saving genuine score to localStorage', e);
  }

  // Update user profile stats & unlock achievements
  updateStatsOnGameEnd(newEntry);

  return newEntry;
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (e) {
    console.error('Failed clearing leaderboard', e);
  }
}

export function exportLeaderboardJson(): string {
  const data = {
    appName: 'Sand.E IQ',
    tagline: 'Challenge Your Mind',
    leaderboard: getLeaderboard(),
    profile: getUserProfile(),
    exportedAt: new Date().toISOString(),
    isAuthentic: true,
  };
  return JSON.stringify(data, null, 2);
}

export function importLeaderboardJson(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (Array.isArray(data.leaderboard)) {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data.leaderboard));
    }
    if (data.profile && typeof data.profile.playerName === 'string') {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));
    }
    return true;
  } catch {
    return false;
  }
}

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function updateUserProfile(partial: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const updated = { ...current, ...partial };
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed updating profile', e);
  }
  return updated;
}

export function unlockAchievement(badgeId: string): void {
  const profile = getUserProfile();
  if (!profile.unlockedBadges.includes(badgeId)) {
    updateUserProfile({
      unlockedBadges: [...profile.unlockedBadges, badgeId],
    });
  }
}

export function getFullAchievementsList(): AchievementItem[] {
  const profile = getUserProfile();
  const unlocked = new Set(profile.unlockedBadges);
  return ALL_ACHIEVEMENTS.map((item) => ({
    ...item,
    isUnlocked: unlocked.has(item.id),
  }));
}

function updateStatsOnGameEnd(entry: LeaderboardEntry) {
  const profile = getUserProfile();
  const key = `${entry.mode}_${entry.difficulty}`;
  const currentBest = profile.bestScores[key] || 0;

  const newBestScores = {
    ...profile.bestScores,
    [key]: Math.max(currentBest, entry.score),
  };

  const newHighestIQ = Math.max(profile.highestIQ, entry.iqEstimate);
  const newTotalScore = (profile.totalScore || 0) + entry.score;

  // Check achievements/badges
  const badges = new Set(profile.unlockedBadges);
  badges.add('first_spark');

  if (entry.mode === 'quiz' && entry.difficulty === 'easy' && entry.accuracy >= 80) {
    badges.add('quiz_easy_master');
  }
  if (entry.mode === 'quiz' && entry.difficulty === 'hard' && entry.accuracy === 100) {
    badges.add('quiz_hard_victor');
  }
  if (entry.mode === 'daily') {
    badges.add('daily_thinker');
  }
  if (entry.mode === 'memory' && entry.score >= 3500) {
    badges.add('memory_prodigy');
  }
  if (entry.timeSeconds <= 30 && entry.accuracy === 100) {
    badges.add('speed_demon');
  }
  if (entry.accuracy === 100) {
    badges.add('flawless_mind');
  }
  if (entry.score >= 5000) {
    badges.add('high_scorer');
  }

  // Mandatory 7 Named Badges
  if (entry.mode === 'quiz') {
    badges.add('first_quiz');
  }
  if (profile.gamesPlayed + 1 >= 3) {
    badges.add('brain_beginner');
  }
  if ((entry.mode === 'quiz' || entry.mode === 'pattern' || entry.mode === 'grid') && entry.accuracy >= 80) {
    badges.add('logic_master');
  }
  if ((entry.mode === 'memory' || entry.mode === 'braingames') && entry.score >= 2000) {
    badges.add('memory_champion');
  }
  if (entry.accuracy === 100) {
    badges.add('perfect_score');
  }
  if (newTotalScore >= 5000 || entry.score >= 3500) {
    badges.add('challenge_champion');
  }

  updateUserProfile({
    gamesPlayed: profile.gamesPlayed + 1,
    gamesWon: profile.gamesWon + 1,
    highestIQ: newHighestIQ,
    bestScores: newBestScores,
    totalScore: newTotalScore,
    unlockedBadges: Array.from(badges),
  });
}

// Daily Brain Puzzle completion tracking
export function recordDailyCompletion(dateKey: string, score: number): number {
  const profile = getUserProfile();
  try {
    const raw = localStorage.getItem(DAILY_COMPLETED_KEY) || '{}';
    const record = JSON.parse(raw);
    record[dateKey] = {
      completedAt: new Date().toISOString(),
      score,
    };
    localStorage.setItem(DAILY_COMPLETED_KEY, JSON.stringify(record));
  } catch {}

  // Check daily streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];

  let currentStreak = profile.dailyStreak || 0;
  if (profile.lastDailyDate === yesterdayKey) {
    currentStreak += 1;
  } else if (profile.lastDailyDate !== dateKey) {
    currentStreak = 1;
  }

  if (currentStreak >= 3) {
    unlockAchievement('streak_3');
  }
  if (currentStreak >= 2) {
    unlockAchievement('daily_practice_streak');
  }
  unlockAchievement('daily_thinker');

  updateUserProfile({
    dailyStreak: currentStreak,
    lastDailyDate: dateKey,
  });

  return currentStreak;
}

export function isDailyCompleted(dateKey: string): boolean {
  try {
    const raw = localStorage.getItem(DAILY_COMPLETED_KEY);
    if (!raw) return false;
    const record = JSON.parse(raw);
    return Boolean(record[dateKey]);
  } catch {
    return false;
  }
}

// Cognitive score formula: describes quiz performance as a cognitive score index (not a clinically valid IQ diagnosis)
export function calculateIQEstimate(
  difficulty: Difficulty,
  timeSeconds: number,
  accuracy: number,
  mode: GameMode
): { iq: number; score: number } {
  // Base score points
  const basePoints = {
    easy: 2000,
    medium: 3500,
    hard: 5500,
    master: 8000,
  }[difficulty];

  const targetTime = {
    easy: 60,
    medium: 120,
    hard: 200,
    master: 300,
  }[difficulty];

  const timeFactor = Math.max(0.4, Math.min(1.8, (targetTime * 1.5 - timeSeconds) / targetTime));
  const accuracyFactor = accuracy / 100;

  const rawScore = Math.round(basePoints * timeFactor * Math.pow(accuracyFactor, 1.8));

  // Scaled cognitive performance index (normalized around 100-145 for game tiers)
  const baseRating = {
    easy: 105,
    medium: 115,
    hard: 125,
    master: 135,
  }[difficulty];

  const speedBonus = Math.round(Math.max(-6, Math.min(12, (targetTime - timeSeconds) / 12)));
  const accuracyBonus = Math.round((accuracyFactor - 0.7) * 18);

  const cognitiveScore = Math.max(85, Math.min(155, baseRating + speedBonus + accuracyBonus));

  return {
    iq: cognitiveScore,
    score: rawScore,
  };
}

// User-to-User switching & Detective Name customization
const ACTIVE_DETECTIVE_KEY = 'sande_iq_active_detective_v1';
const USERS_LIST_KEY = 'sande_iq_detective_users_v1';
const DEFAULT_USERS = ['Arunan', 'Sand.E', 'Sherlock', 'Player 1'];

export function getAllDetectiveUsers(): string[] {
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY);
    if (!raw) {
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function getActiveDetectiveName(): string {
  try {
    const saved = localStorage.getItem(ACTIVE_DETECTIVE_KEY);
    if (saved && saved.trim()) return saved.trim();
    const profile = getUserProfile();
    if (profile?.playerName && profile.playerName !== 'Player 1') {
      return profile.playerName;
    }
  } catch {}
  return 'Arunan';
}

export function setActiveDetectiveName(name: string): string {
  const clean = name.trim() || 'Arunan';
  try {
    localStorage.setItem(ACTIVE_DETECTIVE_KEY, clean);
    const users = getAllDetectiveUsers();
    if (!users.includes(clean)) {
      const updated = [clean, ...users];
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updated));
    }
    updateUserProfile({ playerName: clean });
  } catch {}
  return clean;
}

export function removeDetectiveUser(name: string): string[] {
  try {
    const users = getAllDetectiveUsers().filter((u) => u !== name);
    const finalUsers = users.length > 0 ? users : ['Arunan'];
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(finalUsers));
    if (getActiveDetectiveName() === name) {
      setActiveDetectiveName(finalUsers[0]);
    }
    return finalUsers;
  } catch {
    return ['Arunan'];
  }
}

// -------------------------------------------------------------
// ADVANCED LEVEL & XP PROGRESSION SYSTEM (Features 2, 6, 7, 16, 21, 23)
// -------------------------------------------------------------

export interface LevelInfo {
  level: number;
  currentXP: number;
  minXP: number;
  maxXP: number;
  progressPercent: number;
  titleEn: string;
  titleTa: string;
  badgeIcon: string;
}

const LEVEL_THRESHOLDS = [
  { level: 1, minXP: 0, maxXP: 500, titleEn: 'Cadet Thinker', titleTa: 'தர்க்க மாணவர்', icon: '🌱' },
  { level: 2, minXP: 500, maxXP: 1500, titleEn: 'Logic Explorer', titleTa: 'ஆராய்ச்சி சிந்தனையாளர்', icon: '🔍' },
  { level: 3, minXP: 1500, maxXP: 3500, titleEn: 'Pattern Analyst', titleTa: 'வடிவ ஆய்வாளர்', icon: '🔷' },
  { level: 4, minXP: 3500, maxXP: 7000, titleEn: 'Spatial Strategist', titleTa: 'இடஞ்சார்ந்த உத்தியாளர்', icon: '📐' },
  { level: 5, minXP: 7000, maxXP: 12000, titleEn: 'Neuro Mastermind', titleTa: 'மூளை மேதாவிலாசர்', icon: '🧠' },
  { level: 6, minXP: 12000, maxXP: 20000, titleEn: 'Cognitive Titan', titleTa: 'அறிவுத்திறன் நாயகன்', icon: '⚡' },
  { level: 7, minXP: 20000, maxXP: 32000, titleEn: 'Reasoning Grandmaster', titleTa: 'தர்க்க கிராண்ட்மாஸ்டர்', icon: '👑' },
  { level: 8, minXP: 32000, maxXP: 50000, titleEn: 'Sand.E Legend', titleTa: 'சாண்ட்.இ சாதனையாளர்', icon: '🏆' },
];

export function calculateLevelFromXP(xp: number = 0): LevelInfo {
  const currentXP = Math.max(0, xp);
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    const tier = LEVEL_THRESHOLDS[i];
    if (currentXP >= tier.minXP) {
      const range = tier.maxXP - tier.minXP;
      const progressInTier = Math.min(range, currentXP - tier.minXP);
      const progressPercent = Math.min(100, Math.round((progressInTier / range) * 100));
      return {
        level: tier.level,
        currentXP,
        minXP: tier.minXP,
        maxXP: tier.maxXP,
        progressPercent,
        titleEn: tier.titleEn,
        titleTa: tier.titleTa,
        badgeIcon: tier.icon,
      };
    }
  }

  const first = LEVEL_THRESHOLDS[0];
  return {
    level: 1,
    currentXP: 0,
    minXP: 0,
    maxXP: 500,
    progressPercent: 0,
    titleEn: first.titleEn,
    titleTa: first.titleTa,
    badgeIcon: first.icon,
  };
}

export function addXP(amount: number): { newXP: number; newLevel: number; leveledUp: boolean } {
  const profile = getUserProfile();
  const oldXP = profile.xp || 0;
  const oldLevel = calculateLevelFromXP(oldXP).level;
  const newXP = oldXP + Math.max(0, amount);
  const newLevelInfo = calculateLevelFromXP(newXP);

  const leveledUp = newLevelInfo.level > oldLevel;

  // Check achievements
  if (newXP >= 1000) unlockAchievement('xp_1000');
  if (newLevelInfo.level >= 5) unlockAchievement('xp_5000');

  updateUserProfile({
    xp: newXP,
    level: newLevelInfo.level,
    title: newLevelInfo.titleEn,
  });

  return { newXP, newLevel: newLevelInfo.level, leveledUp };
}

// -------------------------------------------------------------
// SMART ANALYTICS & CATEGORY STATS (Feature 6 & 7)
// -------------------------------------------------------------

export function recordCategoryPerformance(category: string, isCorrect: boolean, timeSeconds: number) {
  const profile = getUserProfile();
  const cleanCat = (category || 'general').toLowerCase();
  const currentStats = profile.categoryStats || {};
  const cat = currentStats[cleanCat] || { correct: 0, total: 0, timeSecondsTotal: 0 };

  const updatedCat = {
    correct: cat.correct + (isCorrect ? 1 : 0),
    total: cat.total + 1,
    timeSecondsTotal: cat.timeSecondsTotal + Math.max(1, timeSeconds),
  };

  updateUserProfile({
    categoryStats: {
      ...currentStats,
      [cleanCat]: updatedCat,
    },
  });
}

export interface CategoryAnalysis {
  category: string;
  categoryTa: string;
  icon: string;
  accuracy: number;
  totalAnswered: number;
  averageTimeSeconds: number;
  strengthRating: 'Elite' | 'Proficient' | 'Developing' | 'Needs Practice';
}

const CATEGORY_NAMES: Record<string, { en: string; ta: string; icon: string }> = {
  logic: { en: 'Logical Reasoning', ta: 'தர்க்க பகுப்பாய்வு', icon: '🧠' },
  pattern: { en: 'Pattern Recognition', ta: 'வடிவ அடையாளம்', icon: '🔷' },
  sequence: { en: 'Number Sequences', ta: 'எண் தொடர்கள்', icon: '🔢' },
  spatial: { en: 'Spatial Agility', ta: 'இடஞ்சார்ந்த பகுப்பாய்வு', icon: '📐' },
  math: { en: 'Mental Mathematics', ta: 'மனக்கணிதம்', icon: '⚡' },
  memory: { en: 'Working Memory', ta: 'நினைவாற்றல்', icon: '🃏' },
  verbal: { en: 'Verbal & Language', ta: 'சொல் வளம்', icon: '🔤' },
  general: { en: 'General Cognition', ta: 'பொது நுண்ணறிவு', icon: '🎯' },
};

export function getCategoryAnalytics(): {
  categories: CategoryAnalysis[];
  weakestCategory: CategoryAnalysis | null;
  strongestCategory: CategoryAnalysis | null;
  overallAccuracy: number;
} {
  const profile = getUserProfile();
  const stats = profile.categoryStats || {};

  const categories: CategoryAnalysis[] = Object.keys(stats).map((key) => {
    const data = stats[key];
    const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    const avgTime = data.total > 0 ? Math.round(data.timeSecondsTotal / data.total) : 0;
    const meta = CATEGORY_NAMES[key] || { en: key.toUpperCase(), ta: key, icon: '💡' };

    let strengthRating: CategoryAnalysis['strengthRating'] = 'Needs Practice';
    if (acc >= 90) strengthRating = 'Elite';
    else if (acc >= 75) strengthRating = 'Proficient';
    else if (acc >= 55) strengthRating = 'Developing';

    return {
      category: meta.en,
      categoryTa: meta.ta,
      icon: meta.icon,
      accuracy: acc,
      totalAnswered: data.total,
      averageTimeSeconds: avgTime,
      strengthRating,
    };
  });

  if (categories.length === 0) {
    // Provide sensible initial benchmark categories
    return {
      categories: [
        { category: 'Logical Reasoning', categoryTa: 'தர்க்க பகுப்பாய்வு', icon: '🧠', accuracy: 80, totalAnswered: 0, averageTimeSeconds: 15, strengthRating: 'Proficient' },
        { category: 'Pattern Recognition', categoryTa: 'வடிவ அடையாளம்', icon: '🔷', accuracy: 75, totalAnswered: 0, averageTimeSeconds: 18, strengthRating: 'Proficient' },
        { category: 'Number Sequences', categoryTa: 'எண் தொடர்கள்', icon: '🔢', accuracy: 70, totalAnswered: 0, averageTimeSeconds: 20, strengthRating: 'Developing' },
        { category: 'Spatial Agility', categoryTa: 'இடஞ்சார்ந்த பகுப்பாய்வு', icon: '📐', accuracy: 65, totalAnswered: 0, averageTimeSeconds: 22, strengthRating: 'Developing' },
      ],
      weakestCategory: null,
      strongestCategory: null,
      overallAccuracy: 75,
    };
  }

  const sortedByAcc = [...categories].sort((a, b) => b.accuracy - a.accuracy);
  const strongestCategory = sortedByAcc[0];
  const weakestCategory = sortedByAcc[sortedByAcc.length - 1];

  const totalAnsweredAll = categories.reduce((sum, c) => sum + c.totalAnswered, 0);
  const totalCorrectAll = Object.values(stats).reduce((sum, s) => sum + s.correct, 0);
  const overallAccuracy = totalAnsweredAll > 0 ? Math.round((totalCorrectAll / totalAnsweredAll) * 100) : 80;

  return {
    categories: sortedByAcc,
    weakestCategory,
    strongestCategory,
    overallAccuracy,
  };
}

// -------------------------------------------------------------
// DAILY STREAK CALENDAR (Feature 4)
// -------------------------------------------------------------

export function getStreakCalendar(year?: number, month?: number): {
  daysInMonth: number;
  firstDayOfWeek: number;
  completedDays: number[];
  currentStreak: number;
} {
  const profile = getUserProfile();
  const now = new Date();
  const targetYear = year ?? now.getFullYear();
  const targetMonth = month ?? now.getMonth(); // 0-indexed

  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(targetYear, targetMonth, 1).getDay(); // 0 is Sunday

  const completedDays: number[] = [];
  const streakHistory = profile.streakHistory || [];

  for (const dateStr of streakHistory) {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (y === targetYear && m === targetMonth + 1) {
      completedDays.push(d);
    }
  }

  // Include lastDailyDate if in this month
  if (profile.lastDailyDate) {
    const [y, m, d] = profile.lastDailyDate.split('-').map(Number);
    if (y === targetYear && m === targetMonth + 1 && !completedDays.includes(d)) {
      completedDays.push(d);
    }
  }

  return {
    daysInMonth,
    firstDayOfWeek,
    completedDays,
    currentStreak: profile.dailyStreak || 0,
  };
}

// -------------------------------------------------------------
// CUSTOM QUIZ MAKER STORAGE (Feature 16)
// -------------------------------------------------------------

export function getCustomQuizzes(): CustomQuizItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_QUIZZES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomQuiz(quiz: CustomQuizItem): CustomQuizItem[] {
  const all = getCustomQuizzes();
  const existingIdx = all.findIndex((q) => q.id === quiz.id);
  let updated: CustomQuizItem[];
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = quiz;
  } else {
    updated = [quiz, ...all];
  }

  try {
    localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(updated));
    unlockAchievement('custom_architect');
  } catch (err) {
    console.error('Failed saving custom quiz', err);
  }
  return updated;
}

export function deleteCustomQuiz(id: string): CustomQuizItem[] {
  const all = getCustomQuizzes();
  const updated = all.filter((q) => q.id !== id);
  try {
    localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
}

// -------------------------------------------------------------
// THEME SWITCHING (Feature 23)
// -------------------------------------------------------------

export function getTheme(): 'dark' | 'light' {
  const profile = getUserProfile();
  return profile.theme || 'dark';
}

export function setTheme(theme: 'dark' | 'light'): 'dark' | 'light' {
  updateUserProfile({ theme });
  if (typeof document !== 'undefined') {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }
  unlockAchievement('theme_shifter');
  return theme;
}

