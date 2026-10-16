import React, { useState, useEffect } from 'react';
import { UserProfile, AchievementItem } from '../types/game';
import {
  getUserProfile,
  updateUserProfile,
  getFullAchievementsList,
  calculateLevelFromXP,
  getTheme,
  setTheme,
} from '../utils/storage';
import { sound } from '../utils/audio';
import { AppLanguage } from '../types/i18n';
import {
  User,
  X,
  Award,
  CheckCircle2,
  Zap,
  Flame,
  Trophy,
  ShieldCheck,
  Check,
  Brain,
  Sparkles,
  Sun,
  Moon,
  Bell,
  Palette,
  Layers,
} from 'lucide-react';
import {
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
} from '../utils/notifications';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: AppLanguage;
  onThemeToggle?: (theme: 'dark' | 'light') => void;
}

const AVATAR_OPTIONS = ['🧠', '⚡', '🤖', '🕵️‍♂️', '👑', '🎯', '🚀', '🧙‍♂️', '🦁', '🦅', '💎', '🔥'];

export const ProfileModal: React.FC<Props> = ({ isOpen, onClose, currentLang = 'en', onThemeToggle }) => {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [nameInput, setNameInput] = useState(profile.playerName || 'Player 1');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || '🧠');
  const [currentTheme, setCurrentThemeState] = useState<'dark' | 'light'>(getTheme());
  const [notifEnabled, setNotifEnabled] = useState(getNotificationSettings().enabled);

  const isTa = currentLang === 'ta';

  useEffect(() => {
    if (isOpen) {
      const p = getUserProfile();
      setProfile(p);
      setNameInput(p.playerName || 'Player 1');
      setSelectedAvatar(p.avatar || '🧠');
      setAchievements(getFullAchievementsList());
      setCurrentThemeState(getTheme());
      setNotifEnabled(getNotificationSettings().enabled);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    const updated = updateUserProfile({ playerName: nameInput.trim() });
    setProfile(updated);
    setIsEditing(false);
    sound.playSuccess();
  };

  const handleSelectAvatar = (av: string) => {
    setSelectedAvatar(av);
    sound.playClick(500);
    const updated = updateUserProfile({ avatar: av });
    setProfile(updated);
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    sound.playClick(520);
    setTheme(newTheme);
    setCurrentThemeState(newTheme);
    if (onThemeToggle) onThemeToggle(newTheme);
  };

  const handleNotifToggle = async () => {
    if (!notifEnabled) {
      const ok = await requestNotificationPermission();
      if (ok) {
        setNotifEnabled(true);
        saveNotificationSettings({ enabled: true });
        sound.playSuccess();
      }
    } else {
      setNotifEnabled(false);
      saveNotificationSettings({ enabled: false });
      sound.playClick(400);
    }
  };

  const winRate =
    profile.gamesPlayed > 0
      ? Math.round((profile.gamesWon / profile.gamesPlayed) * 100)
      : 100;

  // Level & XP System (Feature 2)
  const xp = profile.xp || 0;
  const levelInfo = calculateLevelFromXP(xp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0a152d] via-[#050505] to-[#050505] border border-cyan-400/40 rounded-3xl p-5 sm:p-6 space-y-5 shadow-[0_0_50px_rgba(0,102,255,0.35)] overflow-hidden max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-blue-900/40 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,217,255,0.3)]">
              {selectedAvatar}
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>{isTa ? 'வீரர் சுயவிவரம் & நிலைகள்' : 'Player Profile & Level System'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Lv. {levelInfo.level}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {isTa ? levelInfo.titleTa : levelInfo.titleEn} · {xp.toLocaleString()} XP
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-5 pr-1">
          {/* Level Progress Bar (Feature 2) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-900/50 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <span>{levelInfo.badgeIcon}</span>
                <span>Level {levelInfo.level} - {isTa ? levelInfo.titleTa : levelInfo.titleEn}</span>
              </span>
              <span className="text-slate-400">
                {levelInfo.currentXP} / {levelInfo.maxXP} XP ({levelInfo.progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 transition-all duration-500 shadow-[0_0_10px_rgba(0,217,255,0.4)]"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Profile Customization: Name & Avatar (Feature 22) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                  {isTa ? 'வீரர் பெயர்' : 'Player Name'}
                </span>
                {isEditing ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={20}
                      className="bg-slate-900 border border-cyan-400 px-3 py-1 rounded-xl text-white text-sm font-semibold focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="p-1.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-bold text-white">{profile.playerName}</span>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                    >
                      ({isTa ? 'பெயர் மாற்று' : 'Edit'})
                    </button>
                  </div>
                )}
              </div>

              {/* Theme & Notifications Quick Toggles */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleThemeChange(currentTheme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Toggle Dark / Light Theme"
                >
                  {currentTheme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  <span className="text-[11px] font-mono uppercase">{currentTheme}</span>
                </button>
                <button
                  type="button"
                  onClick={handleNotifToggle}
                  className={`p-2 rounded-xl border text-xs flex items-center gap-1 cursor-pointer ${
                    notifEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                  title="Practice Notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Avatar Selector Grid (Feature 22) */}
            <div className="space-y-1 pt-1 border-t border-slate-900">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                {isTa ? 'அவதார் சின்னத்தைத் தேர்வுசெய்க' : 'Choose Avatar Icon (12)'}
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => handleSelectAvatar(av)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                      selectedAvatar === av
                        ? 'bg-blue-600 border border-cyan-300 shadow-[0_0_12px_rgba(0,217,255,0.4)] scale-110'
                        : 'bg-slate-900 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">
                {isTa ? 'மொத்த XP' : 'Total XP'}
              </span>
              <span className="text-lg font-black text-cyan-300 font-mono tabular-nums">
                {xp.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">
                {isTa ? 'வென்ற சவால்கள்' : 'Rounds Won'}
              </span>
              <span className="text-lg font-black text-emerald-400 font-mono tabular-nums">
                {profile.gamesWon}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">
                {isTa ? 'தொடர் நாட்கள்' : 'Daily Streak'}
              </span>
              <span className="text-lg font-black text-amber-400 font-mono tabular-nums flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{profile.dailyStreak || 0}d</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">
                {isTa ? 'வெற்றி விகிதம்' : 'Win Rate'}
              </span>
              <span className="text-lg font-black text-white font-mono tabular-nums">
                {winRate}%
              </span>
            </div>
          </div>

          {/* Achievements & Badges Catalog (Feature 21) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isTa ? 'அறிவாற்றல் சாதனைகள் & பதக்கங்கள்' : 'Achievements & Badges'}</span>
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {achievements.filter((a) => a.isUnlocked).length} / {achievements.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto no-scrollbar pr-0.5">
              {achievements.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                    badge.isUnlocked
                      ? 'bg-slate-900/90 border-cyan-400/40 text-white shadow-[0_0_10px_rgba(0,217,255,0.15)]'
                      : 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-50'
                  }`}
                >
                  <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    {badge.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white block truncate">
                        {isTa ? badge.nameTa : badge.name}
                      </span>
                      {badge.isUnlocked && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                          UNLOCKED
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block leading-tight truncate">
                      {isTa ? badge.descriptionTa : badge.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
