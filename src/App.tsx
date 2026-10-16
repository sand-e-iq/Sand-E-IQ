import React, { useState, useEffect } from 'react';
import { Difficulty, GameMode } from './types/game';
import { AppLanguage } from './types/i18n';
import { getInitialLanguage, saveLanguage, t } from './utils/i18n';
import { Header } from './components/Header';
import { IQQuizGame } from './components/IQQuizGame';
import { DailyPuzzleGame } from './components/DailyPuzzleGame';
import { MemoryMatrixGame } from './components/MemoryMatrixGame';
import { ChildGame } from './components/ChildGame';
import { DetectiveMehulGame } from './components/DetectiveMehulGame';
import { EnglishLearningGame } from './components/EnglishLearningGame';
import { GridGame } from './components/GridGame';
import { PatternGame } from './components/PatternGame';
import { SequenceGame } from './components/SequenceGame';
import { IQAssessment } from './components/IQAssessment';
import { AIAssistantModal } from './components/AIAssistantModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ProfileModal } from './components/ProfileModal';
import { WinModal } from './components/WinModal';
import { AppIntroModal } from './components/AppIntroModal';
import { WebsitePortal } from './components/WebsitePortal';
import { InstallAppModal } from './components/InstallAppModal';
import { LanguageModal } from './components/LanguageModal';
import { SafetyModal, SafetyModalTab } from './components/SafetyModal';
import { BrainGamesHub } from './components/BrainGamesHub';
import { MultiplayerArena } from './components/MultiplayerArena';
import { AdminDashboard } from './components/AdminDashboard';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { SmartAnalyticsModal } from './components/SmartAnalyticsModal';
import { CustomQuizMakerModal } from './components/CustomQuizMakerModal';
import { AdaptiveQuizGame } from './components/AdaptiveQuizGame';
import { SpatialReasoningGame } from './components/SpatialReasoningGame';
import { DailyTournamentArena } from './components/DailyTournamentArena';
import { WikipediaKnowledgeHub } from './components/WikipediaKnowledgeHub';
import { sound } from './utils/audio';
import { loadActiveMode, saveActiveMode } from './utils/gameSessionStorage';
import { getActiveDetectiveName, getTheme, setTheme, getUserProfile } from './utils/storage';
import { checkAndTriggerDailyReminder } from './utils/notifications';
import {
  Brain,
  Grid3X3,
  Shapes,
  Hash,
  Trophy,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  Star,
  BookmarkCheck,
  Smartphone,
  Globe2,
  Calendar,
  Zap,
  Bot,
  HelpCircle,
  Wifi,
  WifiOff,
  Flame,
} from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>(() => {
    const loaded = loadActiveMode();
    return loaded || 'quiz';
  });
  const [currentLang, setCurrentLang] = useState<AppLanguage>(getInitialLanguage());
  const [detectiveName, setDetectiveName] = useState(() => getActiveDetectiveName());
  const [viewMode, setViewMode] = useState<'app' | 'website'>('app');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isQuizMakerModalOpen, setIsQuizMakerModalOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(() => getTheme());
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [aiContext, setAiContext] = useState<string | undefined>(undefined);
  const [safetyModalTab, setSafetyModalTab] = useState<SafetyModalTab>('safety');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleOpenSafetyModal = (tab: SafetyModalTab = 'safety') => {
    sound.playClick(440);
    setSafetyModalTab(tab);
    setIsSafetyModalOpen(true);
  };

  const handleOpenAIAssistant = (context?: string) => {
    sound.playClick(540);
    setAiContext(context);
    setIsAIAssistantOpen(true);
  };

  useEffect(() => {
    saveActiveMode(currentMode);
  }, [currentMode]);

  useEffect(() => {
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice?.outcome === 'accepted') {
          setDeferredPrompt(null);
          setIsInstallOpen(false);
        }
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        saveActiveMode(currentMode);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleVisibility);
    };
  }, [currentMode]);

  useEffect(() => {
    try {
      const seen = localStorage.getItem('arunan_iq_intro_seen');
      if (!seen) {
        setIsIntroOpen(true);
      }
    } catch {
      // ignore
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Apply active theme
    const theme = getTheme();
    setCurrentTheme(theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }

    // Check practice reminder
    const p = getUserProfile();
    checkAndTriggerDailyReminder(p.dailyStreak || 0, currentLang === 'ta');

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleThemeToggle = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  const [lastWinStats, setLastWinStats] = useState<{
    mode: GameMode;
    difficulty: Difficulty;
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  } | null>(null);

  const handleSelectLanguage = (lang: AppLanguage) => {
    setCurrentLang(lang);
    saveLanguage(lang);
  };

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const handleGameWin = (stats: {
    mode: GameMode;
    difficulty: Difficulty;
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  }) => {
    setLastWinStats(stats);
    setIsWinModalOpen(true);
  };

  const isTamil = currentLang === 'ta';

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#050505] text-white flex flex-col selection:bg-blue-600/40 selection:text-cyan-200">
      {/* Offline Alert Banner (Feature 24) */}
      {!isOnline && (
        <div className="bg-amber-950/90 border-b border-amber-500/40 px-4 py-2 text-xs text-amber-300 flex items-center justify-center gap-2 font-mono">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>{isTamil ? 'ஆஃப்லைன் பயிற்சி முறை இயங்குகிறது · புதிர்கள் & விளையாட்டுகள் கிடைக்கும்' : 'Offline Practice Mode Active · Quizzes & Games Available Offline'}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          if (viewMode === 'website') setViewMode('app');
        }}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenIntro={() => setIsIntroOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        currentLang={currentLang}
        onSelectLanguage={handleSelectLanguage}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onOpenInstall={() => setIsInstallOpen(true)}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenSafetyModal={handleOpenSafetyModal}
        onOpenAIAssistant={() => handleOpenAIAssistant()}
        detectiveName={detectiveName}
        onOpenDailyModal={() => setIsDailyModalOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
        onToggleTheme={handleThemeToggle}
        currentTheme={currentTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-2.5 sm:px-6 py-6 sm:py-8 overflow-x-hidden">
        {viewMode === 'website' ? (
          <WebsitePortal
            currentLang={currentLang}
            onLaunchMode={(mode) => {
              setCurrentMode(mode);
              setViewMode('app');
            }}
            onOpenInstall={() => setIsInstallOpen(true)}
            isInstallable={Boolean(deferredPrompt)}
            onSelectLanguage={handleSelectLanguage}
            onOpenSafetyModal={handleOpenSafetyModal}
          />
        ) : (
          <>
            {/* Mode Hero Banner / Context */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-blue-900/40">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1">
                    {currentMode === 'quiz' && (
                      <>
                        <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                        <span className="text-cyan-400 font-bold">
                          {isTamil
                            ? 'தர்க்க வினாடி வினா · நேரக் கணிப்பான் & உடனடி விளக்கம்'
                            : 'Interactive Logic Quizzes · Timed MCQs & Instant Explanations'}
                        </span>
                      </>
                    )}
                    {currentMode === 'braingames' && (
                      <>
                        <Brain className="w-3.5 h-3.5 text-cyan-300" />
                        <span className="text-cyan-300 font-bold">
                          {isTamil
                            ? '8 ஊடாடும் மூளை விளையாட்டுகள் · உடனடி மறுவாய்ப்பு & சாதனைப் புள்ளிகள்'
                            : '8 Interactive Brain Games · Memory, Speed, Maths & Logic Mini-Games'}
                        </span>
                      </>
                    )}
                    {currentMode === 'multiplayer' && (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                        <span className="text-cyan-300 font-bold">
                          {isTamil
                            ? 'நண்பர்களுடன் நேரலை சவால் · நேரடி அறைக்குறியீடு & வெற்றிப்பலகை'
                            : 'Real-Time Multiplayer Challenge · Private Room Codes & Live Sync'}
                        </span>
                      </>
                    )}
                    {currentMode === 'admin' && (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400 font-bold">
                          {isTamil
                            ? 'நிர்வாகி கட்டுப்பாட்டு அறை · வினா வங்கி & தணிக்கைப் பதிவு'
                            : 'Admin Master Dashboard · Question Bank & Security Audits'}
                        </span>
                      </>
                    )}
                    {currentMode === 'daily' && (
                      <>
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400 font-bold">
                          {isTamil
                            ? 'தினசரி மூளைப் புதிர் · தொடர் சவால் & போனஸ்'
                            : 'Daily Brain Puzzles · Consecutive Day Streaks'}
                        </span>
                      </>
                    )}
                    {currentMode === 'memory' && (
                      <>
                        <Brain className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-purple-400 font-bold">
                          {isTamil
                            ? 'நினைவாற்றல் கட்ட ஆட்டம் · காட்சி நினைவாற்றல் பயிற்சி'
                            : 'Spatial Memory Matrix · Working Memory Retention'}
                        </span>
                      </>
                    )}
                    {currentMode === 'child' && (
                      <>
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-amber-400 font-bold">
                          {isTamil
                            ? 'சுட்டி IQ எளிய அரங்கம் · ஆரம்பநிலை மூளைப் புதிர்'
                            : 'Child IQ Easy Arena · Junior Mind Puzzles'}
                        </span>
                      </>
                    )}
                    {currentMode === 'detective' && (
                      <>
                        <span className="text-base leading-none">🕵️‍♂️</span>
                        <span className="text-red-400 font-bold">
                          {isTamil
                            ? `துப்பறியும் ${detectiveName} · மர்மக் குற்றப் புதிர்கள்`
                            : `Detective ${detectiveName} · Mystery Crime Riddles`}
                        </span>
                      </>
                    )}
                    {currentMode === 'english' && (
                      <>
                        <span className="text-base leading-none">🔤</span>
                        <span className="text-indigo-400 font-bold">
                          {isTamil
                            ? 'சுலப ஆங்கிலக் கல்வி · தமிழ் வழியில் சரியான இலக்கணம்'
                            : 'Easy & Correct English Learning · Grammar & Daily Usage'}
                        </span>
                      </>
                    )}
                    {currentMode === 'grid' && (
                      <>
                        <Grid3X3 className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400">Deductive Binary Logic · Nonogram Matrix</span>
                      </>
                    )}
                    {currentMode === 'pattern' && (
                      <>
                        <Shapes className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400">Raven's Progressive Matrices · Abstract Geometry</span>
                      </>
                    )}
                    {currentMode === 'sequence' && (
                      <>
                        <Hash className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400">Cognitive Sequences · Mathematical Intuition</span>
                      </>
                    )}
                    {currentMode === 'assessment' && (
                      <>
                        <Brain className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Cognitive Assessment Battery · Comprehensive Score</span>
                      </>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentMode === 'quiz' && (isTamil ? 'Sand.E IQ · வினாடி வினா அரங்கம்' : 'Sand.E IQ · Interactive Quiz Arena')}
                    {currentMode === 'braingames' && (isTamil ? 'Sand.E IQ · 8 மூளை விளையாட்டுகள்' : 'Sand.E IQ · 8 Interactive Brain Games')}
                    {currentMode === 'multiplayer' && (isTamil ? 'Sand.E IQ · மல்டிபிளேயர் நேரலை சவால்' : 'Sand.E IQ · Real-Time Multiplayer Arena')}
                    {currentMode === 'admin' && (isTamil ? 'Sand.E IQ · நிர்வாகி கட்டுப்பாட்டு அறை' : 'Sand.E IQ · Administrator Control Dashboard')}
                    {currentMode === 'daily' && (isTamil ? 'Sand.E IQ · இன்றைய மூளைப் புதிர்' : 'Sand.E IQ · Daily Brain Challenge')}
                    {currentMode === 'memory' && (isTamil ? 'Sand.E IQ · நினைவாற்றல் கட்ட ஆட்டம்' : 'Sand.E IQ · Memory Matrix')}
                    {currentMode === 'child' && (isTamil ? 'Sand.E · சுட்டி IQ (எளிது)' : 'Sand.E · Child IQ (Easy)')}
                    {currentMode === 'detective' && (isTamil ? `துப்பறியும் ${detectiveName}: மர்மக் கதைகள்` : `Detective ${detectiveName}: Mystery Riddles`)}
                    {currentMode === 'english' && (isTamil ? 'சுலபமான மற்றும் சரியான ஆங்கிலக் கல்வி' : 'Easy & Correct English Learning')}
                    {currentMode === 'grid' && t('modeGrid', currentLang)}
                    {currentMode === 'pattern' && t('modePattern', currentLang)}
                    {currentMode === 'sequence' && t('modeSequence', currentLang)}
                    {currentMode === 'assessment' && t('modeAssessment', currentLang)}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1.5 font-mono">
                    <span className="text-cyan-400 font-bold">Challenge Your Mind</span>
                    <span aria-hidden="true">·</span>
                    <span>100% Reliable Offline Storage</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isTamil ? 'மதிப்பெண்கள் தானாக சேமிக்கப்படும்' : 'Verified Authentic Scores'}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Status & Intro */}
                <div className="flex items-center gap-2.5 text-xs font-mono">
                  {/* AI Learning Assistant Fast Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenAIAssistant()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/25 hover:bg-blue-600/40 text-cyan-300 border border-cyan-400/50 transition-all cursor-pointer font-bold shadow-[0_0_15px_rgba(0,217,255,0.2)]"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{isTamil ? 'AI ஆசான்' : 'AI Assistant'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick(500);
                      setIsIntroOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all cursor-pointer font-bold shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isTamil ? 'அறிமுகம்' : 'Intro'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Game Arena */}
            <div className="transition-all duration-200">
              {currentMode === 'quiz' && (
                <IQQuizGame
                  currentLang={currentLang}
                  onWin={handleGameWin}
                  onOpenAIAssistant={handleOpenAIAssistant}
                />
              )}
              {currentMode === 'braingames' && (
                <BrainGamesHub
                  currentLang={currentLang}
                  onWin={handleGameWin}
                  onOpenAIAssistant={handleOpenAIAssistant}
                />
              )}
              {currentMode === 'multiplayer' && (
                <MultiplayerArena
                  currentLang={currentLang}
                  onWin={handleGameWin}
                />
              )}
              {currentMode === 'admin' && (
                <AdminDashboard
                  currentLang={currentLang}
                  onExit={() => setCurrentMode('quiz')}
                />
              )}
              {currentMode === 'daily' && (
                <DailyPuzzleGame
                  currentLang={currentLang}
                  onWin={handleGameWin}
                  onOpenAIAssistant={handleOpenAIAssistant}
                />
              )}
              {currentMode === 'memory' && (
                <MemoryMatrixGame
                  currentLang={currentLang}
                  onWin={handleGameWin}
                  onOpenAIAssistant={handleOpenAIAssistant}
                />
              )}
              {currentMode === 'child' && (
                <ChildGame currentLang={currentLang} onWin={handleGameWin} />
              )}
              {currentMode === 'detective' && (
                <DetectiveMehulGame
                  currentLang={currentLang}
                  onSelectLanguage={handleSelectLanguage}
                  onDetectiveNameChange={(name) => setDetectiveName(name)}
                  onWin={handleGameWin}
                />
              )}
              {currentMode === 'english' && (
                <EnglishLearningGame currentLang={currentLang} onWin={handleGameWin} />
              )}
              {currentMode === 'grid' && (
                <GridGame currentLang={currentLang} onWin={handleGameWin} />
              )}
              {currentMode === 'pattern' && (
                <PatternGame currentLang={currentLang} onWin={handleGameWin} />
              )}
              {currentMode === 'sequence' && <SequenceGame onWin={handleGameWin} />}
              {currentMode === 'tournament' && (
                <DailyTournamentArena
                  currentLang={currentLang}
                  onStartTournamentPlay={() => setCurrentMode('quiz')}
                />
              )}
              {currentMode === 'adaptive' && (
                <AdaptiveQuizGame
                  currentLang={currentLang}
                  onWin={handleGameWin}
                  onOpenAIAssistant={handleOpenAIAssistant}
                />
              )}
              {currentMode === 'spatial' && (
                <SpatialReasoningGame
                  currentLang={currentLang}
                  onWin={handleGameWin}
                  onOpenAIAssistant={handleOpenAIAssistant}
                />
              )}
              {currentMode === 'customquiz' && (
                <CustomQuizMakerModal
                  isOpen={true}
                  onClose={() => setCurrentMode('quiz')}
                  currentLang={currentLang}
                  onPlayCustomQuiz={() => setCurrentMode('quiz')}
                />
              )}
              {currentMode === 'wikipedia' && (
                <WikipediaKnowledgeHub
                  currentLang={currentLang}
                  onOpenAIAssistant={handleOpenAIAssistant}
                  onBackToMain={() => setCurrentMode('quiz')}
                />
              )}
              {currentMode === 'assessment' && (
                <IQAssessment
                  onFinish={(res) => {
                    setLastWinStats({
                      mode: 'assessment',
                      difficulty: 'master',
                      score: res.score,
                      iqEstimate: res.iq,
                      timeSeconds: res.timeSeconds,
                      accuracy: res.accuracy,
                      title: 'Comprehensive Cognitive Assessment',
                    });
                    setIsWinModalOpen(true);
                  }}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Floating AI Assistant Orb Button for Instant 1-Tap Access */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => handleOpenAIAssistant()}
          className="group relative flex items-center gap-2 p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(0,217,255,0.6)] hover:shadow-[0_0_35px_rgba(0,217,255,0.8)] transition-all cursor-pointer border border-cyan-300/40"
          title="Open AI Learning Coach"
        >
          <Bot className="w-5 h-5 text-white animate-pulse" />
          <span className="hidden sm:inline font-mono">
            {isTamil ? 'AI கற்றல் வழிகாட்டி' : 'AI Brain Assistant'}
          </span>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-950/70 bg-[#050505] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black tracking-wider text-white">
              SAND<span className="text-cyan-400">.</span><span className="text-blue-400">E IQ</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400 font-mono font-bold">Challenge Your Mind</span>
            <span aria-hidden="true">·</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 font-semibold font-mono shadow-sm">
              By Arunan S
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">100% Offline Capable Platform</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => {
                sound.playClick(500);
                setViewMode(viewMode === 'app' ? 'website' : 'app');
              }}
              className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-cyan-300 border border-cyan-400/30 font-semibold transition-colors cursor-pointer"
            >
              {viewMode === 'app' ? '🌐 View Website' : '🎮 Play in App'}
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick(500);
                setIsInstallOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold transition-colors cursor-pointer"
            >
              📲 Install App
            </button>
            <button
              type="button"
              onClick={() => handleOpenSafetyModal('safety')}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              title="View Safety Guarantee"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTamil ? 'பாதுகாப்பான தளம்' : 'Safe Website'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsLeaderboardOpen(true)}
              className="hover:text-cyan-300 transition-colors cursor-pointer font-bold text-slate-300"
            >
              {t('leaderboard', currentLang)}
            </button>
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="hover:text-cyan-300 transition-colors cursor-pointer font-bold text-slate-300"
            >
              {t('stats', currentLang)}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InstallAppModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
        currentLang={currentLang}
        deferredPrompt={deferredPrompt}
        onTriggerInstall={handleTriggerInstall}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentLang={currentLang}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentLang={currentLang}
        onThemeToggle={handleThemeToggle}
      />

      <DailyChallengeModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        currentLang={currentLang}
      />

      <SmartAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        currentLang={currentLang}
        onLaunchPersonalizedQuiz={() => {
          setCurrentMode('adaptive');
          setIsAnalyticsModalOpen(false);
        }}
      />

      <CustomQuizMakerModal
        isOpen={isQuizMakerModalOpen}
        onClose={() => setIsQuizMakerModalOpen(false)}
        currentLang={currentLang}
        onPlayCustomQuiz={() => {
          setCurrentMode('quiz');
          setIsQuizMakerModalOpen(false);
        }}
      />

      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => {
          setIsAIAssistantOpen(false);
          setAiContext(undefined);
        }}
        currentLang={currentLang}
        initialContext={aiContext}
      />

      <WinModal
        isOpen={isWinModalOpen}
        onClose={() => setIsWinModalOpen(false)}
        onPlayNext={() => setIsWinModalOpen(false)}
        onOpenLeaderboard={() => {
          setIsWinModalOpen(false);
          setIsLeaderboardOpen(true);
        }}
        stats={lastWinStats}
      />

      <AppIntroModal
        isOpen={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
        currentLang={currentLang}
        onSelectMode={(mode) => setCurrentMode(mode)}
        onSelectLanguage={handleSelectLanguage}
      />

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLang={currentLang}
        onSelectLanguage={handleSelectLanguage}
      />

      <SafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
        currentLang={currentLang}
        initialTab={safetyModalTab}
      />
    </div>
  );
}
