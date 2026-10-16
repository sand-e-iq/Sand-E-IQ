import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GameMode } from '../types/game';
import { AppLanguage, LANGUAGES } from '../types/i18n';
import { t } from '../utils/i18n';
import { sound } from '../utils/audio';
import { AppLogo } from './AppLogo';
import { getUserProfile, calculateLevelFromXP } from '../utils/storage';
import {
  Trophy,
  Volume2,
  VolumeX,
  BarChart3,
  Globe,
  ChevronDown,
  Sparkles,
  Smartphone,
  Globe2,
  ShieldCheck,
  Calendar,
  Bot,
  Brain,
  Zap,
  Menu,
  X,
  Flame,
  Sun,
  Moon,
  TrendingUp,
  Box,
  Wrench,
  Activity,
} from 'lucide-react';

interface Props {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onOpenLeaderboard: () => void;
  onOpenProfile: () => void;
  onOpenIntro: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentLang: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
  viewMode?: 'app' | 'website';
  onToggleViewMode?: (mode: 'app' | 'website') => void;
  onOpenInstall?: () => void;
  onOpenLanguageModal?: () => void;
  onOpenSafetyModal?: (tab?: 'safety' | 'updates' | 'scan') => void;
  onOpenAIAssistant?: () => void;
  detectiveName?: string;
  onOpenDailyModal?: () => void;
  onOpenAnalyticsModal?: () => void;
  onToggleTheme?: (theme: 'dark' | 'light') => void;
  currentTheme?: 'dark' | 'light';
}

export const Header: React.FC<Props> = ({
  currentMode,
  onSelectMode,
  onOpenLeaderboard,
  onOpenProfile,
  onOpenIntro,
  isMuted,
  onToggleMute,
  currentLang,
  onSelectLanguage,
  viewMode = 'app',
  onToggleViewMode,
  onOpenInstall,
  onOpenLanguageModal,
  onOpenSafetyModal,
  onOpenAIAssistant,
  detectiveName,
  onOpenDailyModal,
  onOpenAnalyticsModal,
  onToggleTheme,
  currentTheme = 'dark',
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const isTamil = currentLang === 'ta';

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const profile = getUserProfile();
  const levelInfo = calculateLevelFromXP(profile.xp || 0);

  const ALL_GAME_MODES: {
    id: GameMode;
    icon: string;
    nameEn: string;
    nameTa: string;
    badge?: string;
  }[] = [
    { id: 'quiz', icon: '⚡', nameEn: 'IQ Quiz', nameTa: 'IQ வினாடி வினா', badge: 'New' },
    { id: 'wikipedia', icon: '🌐', nameEn: 'Wikipedia Hub', nameTa: 'விக்கிபீடியா அறிவு மையம்', badge: 'Wiki' },
    { id: 'adaptive', icon: '🧬', nameEn: 'Adaptive Mode', nameTa: 'தகவமைப்பு முறை', badge: 'Smart' },
    { id: 'spatial', icon: '📐', nameEn: 'Spatial 3D', nameTa: 'முப்பரிமாணம்', badge: '3D' },
    { id: 'tournament', icon: '👑', nameEn: 'Daily Tournament', nameTa: 'தினசரி போட்டி', badge: 'Live' },
    { id: 'customquiz', icon: '🛠️', nameEn: 'Quiz Maker', nameTa: 'வினா தயாரிப்பாளர்', badge: 'Custom' },
    { id: 'braingames', icon: '🎮', nameEn: 'Brain Games (8)', nameTa: 'மூளை விளையாட்டுகள் (8)', badge: '8 Games' },
    { id: 'multiplayer', icon: '👥', nameEn: 'Multiplayer Arena', nameTa: 'மல்டிபிளேயர் நேரலை', badge: 'Live' },
    { id: 'daily', icon: '📅', nameEn: 'Daily Puzzle', nameTa: 'தினசரி புதிர்' },
    { id: 'memory', icon: '🧠', nameEn: 'Memory Matrix', nameTa: 'நினைவாற்றல் கட்டம்' },
    { id: 'child', icon: '⭐', nameEn: 'Child IQ (Easy)', nameTa: 'சுட்டி IQ (எளிது)' },
    { id: 'detective', icon: '🕵️‍♂️', nameEn: 'Detective Arunan', nameTa: 'துப்பறியும் அருணன்' },
    { id: 'english', icon: '🔤', nameEn: 'Easy English', nameTa: 'சுலப ஆங்கிலம்' },
    { id: 'grid', icon: '⬛', nameEn: 'Grid Deduction', nameTa: 'கட்ட தர்க்கம்' },
    { id: 'pattern', icon: '🔷', nameEn: 'Pattern Matrix', nameTa: 'வடிவ மேட்ரிக்ஸ்' },
    { id: 'sequence', icon: '🔢', nameEn: 'Sequences', nameTa: 'எண் தொடர்கள்' },
    { id: 'assessment', icon: '📊', nameEn: 'IQ Assessment', nameTa: 'IQ மதிப்பீடு' },
    { id: 'admin', icon: '🛡️', nameEn: 'Admin Portal', nameTa: 'நிர்வாகி போர்டல்', badge: 'Admin' },
  ];

  return (
    <header className="w-full max-w-full overflow-hidden border-b border-blue-900/50 bg-[#050505]/95 backdrop-blur-md sticky top-0 z-40 shadow-[0_4px_30px_-5px_rgba(0,102,255,0.3)]">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6">
        {/* Tier 1: Top Brand & Utility Controls */}
        <div className="py-1.5 sm:py-0 sm:h-16 border-b border-blue-950/70 w-full min-w-0">
          {/* MOBILE VIEW (< sm): Clean 2-Row Layout to prevent any cutoff or overflow */}
          <div className="flex sm:hidden flex-col gap-1.5 w-full min-w-0">
            {/* Mobile Row 1: Logo & Primary System Actions */}
            <div className="flex items-center justify-between gap-1 w-full min-w-0">
              <div className="flex items-center gap-1 shrink-0 min-w-0">
                <AppLogo variant="full" size="sm" />
              </div>

              {/* Utility actions: Modes Menu, App/Web, Sound, Stats, Leaderboard */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Mobile Modes Drawer Trigger Button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(480);
                    setIsMobileMenuOpen((prev) => !prev);
                  }}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isMobileMenuOpen
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_rgba(0,217,255,0.4)]'
                      : 'bg-slate-900 text-cyan-300 border-cyan-500/40 hover:bg-slate-800'
                  }`}
                  aria-label="Toggle Navigation Menu"
                  title="All Modes Menu"
                >
                  <Menu className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono uppercase">{isTamil ? 'பிரிவுகள்' : 'Modes'}</span>
                </button>

                {onToggleViewMode && (
                  <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-xs shadow-inner">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(500);
                        onToggleViewMode('app');
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'app'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_12px_rgba(0,217,255,0.4)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Interactive App Mode"
                    >
                      <span>🎮</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(520);
                        onToggleViewMode('website');
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'website'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Website Showcase & Information"
                    >
                      <span>🌐</span>
                    </button>
                  </div>
                )}

                {/* Audio Mute/Unmute */}
                <button
                  type="button"
                  onClick={onToggleMute}
                  aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  title={isMuted ? 'Audio Muted' : 'Audio Active'}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                </button>

                {/* Profile / Stats Button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(600);
                    onOpenProfile();
                  }}
                  aria-label={t('stats', currentLang)}
                  title={t('stats', currentLang)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                </button>

                {/* Leaderboard Button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onOpenLeaderboard();
                  }}
                  className="flex items-center gap-1 p-1.5 text-xs font-semibold rounded-xl bg-blue-500/10 text-cyan-300 border border-cyan-400/30 hover:bg-blue-500/20 transition-all cursor-pointer whitespace-nowrap shadow-sm"
                  title={t('leaderboard', currentLang)}
                >
                  <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>

            {/* Mobile Row 2: 1-Tap Language Switcher & AI Coach Button (100% visible, wide touch targets) */}
            <div className="flex items-center justify-between gap-1 w-full min-w-0 pt-0.5">
              {/* Quick 1-Tap Tamil / English Switcher & Full Selector */}
              <div className="relative flex items-center gap-1 bg-slate-950/90 border border-blue-900/50 rounded-xl p-0.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(520);
                    onSelectLanguage('en');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentLang === 'en'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_10px_rgba(0,217,255,0.35)] ring-1 ring-cyan-300'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Switch to English (Main Language)"
                  aria-pressed={currentLang === 'en'}
                >
                  <span>🇬🇧</span>
                  <span className="font-mono text-[11px]">EN</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(520);
                    onSelectLanguage('ta');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentLang === 'ta'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_10px_rgba(0,217,255,0.35)] ring-1 ring-cyan-300'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Switch to Tamil / தமிழ் மொழிக்கு மாறவும்"
                  aria-pressed={currentLang === 'ta'}
                >
                  <span>🇮🇳</span>
                  <span className="font-mono text-[11px]">தமிழ்</span>
                </button>

                {/* Language Modal / More languages button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(440);
                    if (onOpenLanguageModal) {
                      onOpenLanguageModal();
                    } else {
                      setIsLangMenuOpen((prev) => !prev);
                    }
                  }}
                  className="p-1 px-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-850 transition-colors cursor-pointer"
                  title="More Languages (Tamil, English, French, Spanish, Hindi)"
                  aria-label="More Languages"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>

                {isLangMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
                      onClick={() => setIsLangMenuOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-2 w-52 rounded-2xl bg-slate-950 border border-cyan-400/40 shadow-2xl p-1.5 z-50 animate-fade-in divide-y divide-slate-800">
                      <div className="px-2 py-1 text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-bold">
                        {isTamil ? 'மொழிகள்' : 'Languages (5)'}
                      </div>
                      <div className="pt-1 pb-1 space-y-0.5">
                        {LANGUAGES.map((langItem) => {
                          const isSelected = currentLang === langItem.code;
                          return (
                            <button
                              key={langItem.code}
                              type="button"
                              onClick={() => {
                                sound.playSuccess();
                                onSelectLanguage(langItem.code);
                                setIsLangMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                                isSelected
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{langItem.flag}</span>
                                <span className="font-semibold">{langItem.nativeName}</span>
                              </span>
                              <span className="text-[10px] opacity-75 font-mono">{langItem.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile AI Coach Button */}
              {onOpenAIAssistant && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(560);
                    onOpenAIAssistant();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600/30 to-cyan-500/30 hover:from-blue-600/50 hover:to-cyan-500/50 text-cyan-300 border border-cyan-400/50 text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(0,217,255,0.25)]"
                  title="Open AI Learning Assistant"
                >
                  <Bot className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                  <span>{isTamil ? 'AI ஆசான்' : 'AI Coach'}</span>
                </button>
              )}
            </div>
          </div>

          {/* DESKTOP / TABLET VIEW (sm:flex): Single Sleek Horizontal Navbar */}
          <div className="hidden sm:flex items-center justify-between gap-4 h-16 w-full min-w-0">
            {/* Brand Wordmark & Official App Logo */}
            <div className="flex items-center gap-2.5 shrink-0 min-w-0">
              <AppLogo variant="full" size="sm" />

              {/* AI Platform Badge */}
              <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-cyan-400/30 text-[10px] font-mono text-cyan-300 font-bold shadow-sm shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>AI-Powered Brain Arena</span>
              </span>

              {/* Creator Badge */}
              <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 shrink-0">
                <span>By Arunan S</span>
              </span>
            </div>

            {/* Center App vs Website Switcher */}
            {onToggleViewMode && (
              <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 text-xs shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(500);
                    onToggleViewMode('app');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'app'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_12px_rgba(0,217,255,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Interactive App Mode"
                >
                  <span>🎮</span>
                  <span className="ml-1">{isTamil ? 'செயலி' : 'App'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(520);
                    onToggleViewMode('website');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'website'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Website Showcase & Information"
                >
                  <span>🌐</span>
                  <span className="ml-1">{isTamil ? 'இணையம்' : 'Web'}</span>
                </button>
              </div>
            )}

            {/* Desktop Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* AI Learning Assistant Trigger Button */}
              {onOpenAIAssistant && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(560);
                    onOpenAIAssistant();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/30 to-cyan-500/30 hover:from-blue-600/50 hover:to-cyan-500/50 text-cyan-300 border border-cyan-400/50 text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(0,217,255,0.25)] hover:shadow-[0_0_20px_rgba(0,217,255,0.5)]"
                  title="Open AI Learning Assistant"
                >
                  <Bot className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                  <span>{isTamil ? 'AI ஆசான்' : 'AI Coach'}</span>
                </button>
              )}

              {/* Quick 1-Tap Tamil / English Switcher & Full Selector */}
              <div className="relative flex items-center gap-1 bg-slate-950/90 border border-blue-900/50 rounded-xl p-0.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(520);
                    onSelectLanguage('en');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentLang === 'en'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_10px_rgba(0,217,255,0.35)] ring-1 ring-cyan-300'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Switch to English (Main Language)"
                  aria-pressed={currentLang === 'en'}
                >
                  <span>🇬🇧</span>
                  <span className="font-mono text-[11px]">EN</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(520);
                    onSelectLanguage('ta');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentLang === 'ta'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_10px_rgba(0,217,255,0.35)] ring-1 ring-cyan-300'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Switch to Tamil / தமிழ் மொழிக்கு மாறவும்"
                  aria-pressed={currentLang === 'ta'}
                >
                  <span>🇮🇳</span>
                  <span className="font-mono text-[11px]">தமிழ்</span>
                </button>

                {/* Language Modal / More languages button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(440);
                    if (onOpenLanguageModal) {
                      onOpenLanguageModal();
                    } else {
                      setIsLangMenuOpen((prev) => !prev);
                    }
                  }}
                  className="p-1 px-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-850 transition-colors cursor-pointer"
                  title="More Languages (Tamil, English, French, Spanish, Hindi)"
                  aria-label="More Languages"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>

                {isLangMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
                      onClick={() => setIsLangMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-slate-950 border border-cyan-400/40 shadow-2xl p-1.5 z-50 animate-fade-in divide-y divide-slate-800">
                      <div className="px-2 py-1 text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-bold">
                        {isTamil ? 'மொழிகள்' : 'Languages (5)'}
                      </div>
                      <div className="pt-1 pb-1 space-y-0.5">
                        {LANGUAGES.map((langItem) => {
                          const isSelected = currentLang === langItem.code;
                          return (
                            <button
                              key={langItem.code}
                              type="button"
                              onClick={() => {
                                sound.playSuccess();
                                onSelectLanguage(langItem.code);
                                setIsLangMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                                isSelected
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{langItem.flag}</span>
                                <span className="font-semibold">{langItem.nativeName}</span>
                              </span>
                              <span className="text-[10px] opacity-75 font-mono">{langItem.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Audio Mute/Unmute */}
              <button
                type="button"
                onClick={onToggleMute}
                aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                title={isMuted ? 'Audio Muted' : 'Audio Active'}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              {/* Theme Toggle Button (Feature 23) */}
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={() => onToggleTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                  aria-label="Toggle Theme"
                  title="Toggle Dark / Light Theme"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                >
                  {currentTheme === 'dark' ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              )}

              {/* Daily IQ Challenge Trigger (Feature 1 & 4) */}
              {onOpenDailyModal && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(500);
                    onOpenDailyModal();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl bg-amber-500/10 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 transition-all cursor-pointer whitespace-nowrap shadow-sm"
                  title="Daily IQ Challenge & Streak Calendar"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="hidden lg:inline">{isTamil ? 'அன்றாட சவால்' : 'Daily Challenge'}</span>
                </button>
              )}

              {/* Smart Analytics Trigger (Feature 6 & 7) */}
              {onOpenAnalyticsModal && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(520);
                    onOpenAnalyticsModal();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl bg-blue-500/10 text-cyan-300 border border-cyan-400/30 hover:bg-blue-500/20 transition-all cursor-pointer whitespace-nowrap shadow-sm"
                  title="Smart Cognitive Analytics & Targeted Practice"
                >
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden xl:inline">{isTamil ? 'பகுப்பாய்வு' : 'Analytics'}</span>
                </button>
              )}

              {/* Player XP Level Pill Button (Feature 2) */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick(600);
                  onOpenProfile();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold hover:bg-slate-850 hover:border-cyan-400/50 transition-all cursor-pointer shadow-sm"
                title={`Level ${levelInfo.level} - ${isTamil ? levelInfo.titleTa : levelInfo.titleEn}`}
              >
                <span>{levelInfo.badgeIcon}</span>
                <span>Lv. {levelInfo.level}</span>
                <span className="hidden 2xl:inline text-[11px] text-slate-400">({(profile.xp || 0).toLocaleString()} XP)</span>
              </button>

              {/* Profile / Stats Button */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick(600);
                  onOpenProfile();
                }}
                aria-label={t('stats', currentLang)}
                title={t('stats', currentLang)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>

              {/* Leaderboard Button */}
              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  onOpenLeaderboard();
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl bg-blue-500/10 text-cyan-300 border border-cyan-400/30 hover:bg-blue-500/20 transition-all cursor-pointer whitespace-nowrap shadow-sm"
                title={t('leaderboard', currentLang)}
              >
                <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">{t('leaderboard', currentLang)}</span>
              </button>

              {/* Install PWA App Button */}
              {onOpenInstall && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(520);
                    onOpenInstall();
                  }}
                  className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 text-xs font-bold transition-all cursor-pointer shadow-sm"
                  title="Install App"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isTamil ? 'நிறுவுக' : 'Install'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tier 2: Futuristic Mode Navigation Bar */}
        <nav className="py-2.5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full min-w-0 max-w-full">
          {/* All Modes / Categories Drawer Trigger */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(480);
              setIsMobileMenuOpen(true);
            }}
            className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400"
            title={isTamil ? 'அனைத்து பிரிவுகளையும் பார்க்க' : 'Browse All Modes & Categories'}
          >
            <Menu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isTamil ? 'பிரிவுகள்' : 'All Modes'}</span>
          </button>

          {/* 1. IQ Quiz Mode */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(520);
              onSelectMode('quiz');
            }}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'quiz'
                ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-black shadow-[0_0_20px_rgba(0,217,255,0.5)] ring-2 ring-cyan-300'
                : 'text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-400/40'
            }`}
          >
            <span className="text-sm sm:text-base">⚡</span>
            <span>{isTamil ? 'IQ வினாடி வினா' : 'IQ Quiz'}</span>
          </button>

          {/* Wikipedia Knowledge Hub */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(520);
              onSelectMode('wikipedia');
            }}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'wikipedia'
                ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-black shadow-[0_0_20px_rgba(0,217,255,0.6)] ring-2 ring-cyan-300'
                : 'text-cyan-300 bg-blue-950/60 hover:bg-blue-900/60 border border-cyan-400/50'
            }`}
          >
            <span className="text-sm sm:text-base">🌐</span>
            <span>{isTamil ? 'விக்கிபீடியா அறிவு' : 'Wikipedia Hub'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-[10px] text-cyan-300 font-mono border border-cyan-400/40">
              Wiki
            </span>
          </button>

          {/* 2. Brain Games Hub (8 Mini-Games) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(520);
              onSelectMode('braingames');
            }}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'braingames'
                ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black shadow-[0_0_20px_rgba(0,217,255,0.5)] ring-2 ring-cyan-300'
                : 'text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40'
            }`}
          >
            <span className="text-sm sm:text-base">🎮</span>
            <span>{isTamil ? 'மூளை விளையாட்டுகள் (8)' : 'Brain Games (8)'}</span>
          </button>

          {/* 2. Daily Brain Puzzle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(520);
              onSelectMode('daily');
            }}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'daily'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-amber-300'
                : 'text-amber-400 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-400/40'
            }`}
          >
            <span className="text-sm sm:text-base">📅</span>
            <span>{isTamil ? 'தினசரி புதிர்' : 'Daily Puzzle'}</span>
          </button>

          {/* 3. Memory Matrix */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(530);
              onSelectMode('memory');
            }}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'memory'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-[0_0_20px_rgba(168,85,247,0.5)] ring-2 ring-purple-300'
                : 'text-purple-300 bg-purple-950/40 hover:bg-purple-900/40 border border-purple-400/40'
            }`}
          >
            <span className="text-sm sm:text-base">🧠</span>
            <span>{isTamil ? 'நினைவாற்றல்' : 'Memory Matrix'}</span>
          </button>

          {/* 4. Child IQ Arena */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(540);
              onSelectMode('child');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'child'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                : 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25'
            }`}
          >
            <span className="text-sm sm:text-base">⭐</span>
            <span>{t('modeChild', currentLang).replace('⭐ ', '')}</span>
          </button>

          {/* 5. Detective Mystery Casefiles */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(530);
              onSelectMode('detective');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'detective'
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-black shadow-lg shadow-red-600/30 ring-2 ring-red-400'
                : 'text-red-400 bg-red-950/40 hover:bg-red-900/40 border border-red-500/40 hover:text-red-300'
            }`}
          >
            <span className="text-sm sm:text-base">🕵️‍♂️</span>
            <span>
              {detectiveName
                ? isTamil
                  ? `துப்பறியும் ${detectiveName}`
                  : `Detective ${detectiveName}`
                : t('modeDetective', currentLang).replace('🕵️‍♂️ ', '')}
            </span>
          </button>

          {/* 6. Easy English Learning Mode */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(510);
              onSelectMode('english');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'english'
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-black shadow-lg ring-2 ring-indigo-400'
                : 'text-indigo-400 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-500/40 hover:text-indigo-300'
            }`}
          >
            <span className="text-sm sm:text-base">🔤</span>
            <span>{t('modeEnglish', currentLang).replace('🔤 ', '')}</span>
          </button>

          {/* 7. Grid Deduction */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(500);
              onSelectMode('grid');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
              currentMode === 'grid'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md ring-2 ring-cyan-300'
                : 'text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:text-white'
            }`}
          >
            <span className="text-sm sm:text-base">🧩</span>
            <span>{t('modeGrid', currentLang)}</span>
          </button>

          {/* 8. Pattern Matrix */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(500);
              onSelectMode('pattern');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
              currentMode === 'pattern'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md ring-2 ring-cyan-300'
                : 'text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:text-white'
            }`}
          >
            <span className="text-sm sm:text-base">🔷</span>
            <span>{t('modePattern', currentLang)}</span>
          </button>

          {/* 9. Sequences */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(500);
              onSelectMode('sequence');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
              currentMode === 'sequence'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md ring-2 ring-cyan-300'
                : 'text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:text-white'
            }`}
          >
            <span className="text-sm sm:text-base">🔢</span>
            <span>{t('modeSequence', currentLang)}</span>
          </button>

          {/* 10. IQ Assessment */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(500);
              onSelectMode('assessment');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
              currentMode === 'assessment'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md ring-2 ring-emerald-300'
                : 'text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30'
            }`}
          >
            <span className="text-sm sm:text-base">🧠</span>
            <span>{t('modeAssessment', currentLang)}</span>
          </button>

          {/* 11. Multiplayer Arena */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(520);
              onSelectMode('multiplayer');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'multiplayer'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-black shadow-[0_0_20px_rgba(0,102,255,0.6)] ring-2 ring-cyan-300'
                : 'text-cyan-300 bg-blue-950/50 hover:bg-blue-900/50 border border-blue-500/40'
            }`}
          >
            <span className="text-sm sm:text-base">👥</span>
            <span>{isTamil ? 'மல்டிபிளேயர் (நேரலை)' : 'Multiplayer (Live)'}</span>
          </button>

          {/* 12. Daily Tournaments (Feature 13) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(530);
              onSelectMode('tournament');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'tournament'
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.6)] ring-2 ring-amber-300'
                : 'text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/40'
            }`}
          >
            <span className="text-sm sm:text-base">👑</span>
            <span>{isTamil ? 'தினசரி போட்டி' : 'Tournaments'}</span>
          </button>

          {/* 13. Adaptive Difficulty Mode (Feature 8) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(520);
              onSelectMode('adaptive');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'adaptive'
                ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-black shadow-[0_0_20px_rgba(0,217,255,0.6)] ring-2 ring-cyan-300'
                : 'text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-400/40'
            }`}
          >
            <span className="text-sm sm:text-base">🧬</span>
            <span>{isTamil ? 'தகவமைப்பு முறை' : 'Adaptive Quiz'}</span>
          </button>

          {/* 14. Spatial Reasoning 3D (Feature 12) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(510);
              onSelectMode('spatial');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'spatial'
                ? 'bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 text-white font-black shadow-[0_0_20px_rgba(99,102,241,0.6)] ring-2 ring-cyan-300'
                : 'text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-400/40'
            }`}
          >
            <span className="text-sm sm:text-base">📐</span>
            <span>{isTamil ? 'முப்பரிமாண தர்க்கம்' : 'Spatial 3D'}</span>
          </button>

          {/* 15. Custom Quiz Maker (Feature 16) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(520);
              onSelectMode('customquiz');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'customquiz'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.5)] ring-2 ring-emerald-300'
                : 'text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-400/40'
            }`}
          >
            <span className="text-sm sm:text-base">🛠️</span>
            <span>{isTamil ? 'வினா தயாரிப்பாளர்' : 'Quiz Maker'}</span>
          </button>

          {/* 16. Admin Dashboard */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(540);
              onSelectMode('admin');
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 ${
              currentMode === 'admin'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white font-black shadow-[0_0_20px_rgba(220,38,38,0.5)] ring-2 ring-red-400'
                : 'text-amber-300 bg-slate-900 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            <span className="text-sm sm:text-base">🛡️</span>
            <span>{isTamil ? 'நிர்வாகி (Admin)' : 'Admin'}</span>
          </button>
        </nav>
      </div>

      {/* All Modes / பிரிவுகள் Drawer Modal rendered to document.body via Portal */}
      {isMobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex flex-col justify-end sm:justify-center items-center bg-black/85 backdrop-blur-md animate-fade-in p-0 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                sound.playClick(400);
                setIsMobileMenuOpen(false);
              }
            }}
          >
            <div className="w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-[#050505] border border-cyan-500/40 rounded-t-3xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,217,255,0.3)] overflow-hidden">
              {/* Header of Drawer */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-blue-900/60 bg-[#080d1a] shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    <Menu className="w-4 h-4 text-cyan-400" />
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                      <span>{isTamil ? 'அனைத்து விளையாட்டுகள் & பிரிவுகள்' : 'All Modes & Categories'}</span>
                    </h3>
                    <p className="text-[11px] font-mono text-cyan-400">
                      {isTamil ? `${ALL_GAME_MODES.length} ஊடாடும் பிரிவுகள்` : `${ALL_GAME_MODES.length} Interactive Modes`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(400);
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* List of Game Modes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 overscroll-contain">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ALL_GAME_MODES.map((mode) => {
                    const isActive = currentMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          sound.playSuccess();
                          onSelectMode(mode.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600/40 via-cyan-500/30 to-blue-600/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,217,255,0.25)]'
                            : 'bg-slate-950/80 hover:bg-slate-900/90 border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                            {mode.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-white truncate">
                              {isTamil ? mode.nameTa : mode.nameEn}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {isTamil ? mode.nameEn : mode.nameTa}
                            </div>
                          </div>
                        </div>
                        {mode.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shrink-0 ml-2">
                            {mode.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions inside Drawer */}
              <div className="p-3.5 border-t border-blue-900/40 bg-slate-950/95 space-y-2 shrink-0">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {onOpenDailyModal && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(500);
                        setIsMobileMenuOpen(false);
                        onOpenDailyModal();
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-amber-500/15 border border-amber-400/35 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="truncate">{isTamil ? 'தினசரி சவால்' : 'Daily Challenge'}</span>
                    </button>
                  )}

                  {onOpenAnalyticsModal && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(520);
                        setIsMobileMenuOpen(false);
                        onOpenAnalyticsModal();
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-blue-500/15 border border-cyan-400/35 text-cyan-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="truncate">{isTamil ? 'பகுப்பாய்வு' : 'Analytics'}</span>
                    </button>
                  )}

                  {onToggleTheme && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(450);
                        onToggleTheme(currentTheme === 'dark' ? 'light' : 'dark');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {currentTheme === 'dark' ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                      <span className="truncate">{currentTheme === 'dark' ? (isTamil ? 'இருண்ட தீம்' : 'Dark') : (isTamil ? 'ஒளிர் தீம்' : 'Light')}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      sound.playSuccess();
                      setIsMobileMenuOpen(false);
                      onOpenLeaderboard();
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5 text-purple-400" />
                    <span className="truncate">{t('leaderboard', currentLang)}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(500);
                    setIsMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{levelInfo.badgeIcon}</span>
                    <span className="text-white font-mono">Lv. {levelInfo.level} · {isTamil ? levelInfo.titleTa : levelInfo.titleEn}</span>
                  </div>
                  <span className="text-cyan-400 font-mono">{(profile.xp || 0).toLocaleString()} XP</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};
