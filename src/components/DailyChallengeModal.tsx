import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { triggerConfetti } from '../utils/confetti';
import {
  getUserProfile,
  recordDailyCompletion,
  addXP,
  getStreakCalendar,
  unlockAchievement,
} from '../utils/storage';
import {
  requestNotificationPermission,
  getNotificationSettings,
  saveNotificationSettings,
  sendBrowserNotification,
  isNotificationSupported,
} from '../utils/notifications';
import {
  Calendar,
  Flame,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bell,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang: AppLanguage;
  onLaunchPersonalized?: (category: string) => void;
}

export const DailyChallengeModal: React.FC<Props> = ({ isOpen, onClose, currentLang }) => {
  const isTa = currentLang === 'ta';
  const [activeTab, setActiveTab] = useState<'qotd' | 'calendar' | 'reminders'>('qotd');

  // QOTD state
  const [qotd, setQotd] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [streakData, setStreakData] = useState(() => getStreakCalendar());

  // Notification state
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifTime, setNotifTime] = useState('19:00');
  const [notifMessage, setNotifMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchQOTD();
      setStreakData(getStreakCalendar(calendarYear, calendarMonth));
      const settings = getNotificationSettings();
      setNotifEnabled(settings.enabled);
      setNotifTime(settings.time);
    }
  }, [isOpen, calendarMonth, calendarYear]);

  const fetchQOTD = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/qotd');
      const data = await res.json();
      if (data?.question) {
        setQotd(data.question);
      }
    } catch {
      // Local fallback QOTD
      setQotd({
        id: 'qotd-fallback',
        category: 'spatial',
        title: 'Cube Face Projection',
        titleTa: 'கனசதுர பக்கக் காட்சி',
        prompt: 'A 3x3x3 cube is painted neon cyan on all outer faces, then cut into 27 unit cubes. How many small cubes have EXACTLY TWO painted faces?',
        promptTa: 'ஒரு 3x3x3 கனசதுரத்தின் வெளிப்பகுதிகள் அனைத்தும் சியான் வண்ணம் பூசப்பட்டு, 27 சிறிய துண்டுகளாக வெட்டப்படுகின்றன. சரியாக இரண்டு முகங்களில் மட்டுமே வண்ணம் உள்ள சிறிய கனசதுரங்கள் எத்தனை?',
        options: [
          { id: 'opt-1', text: '12 unit cubes', textTa: '12 சிறிய கனசதுரங்கள்', isCorrect: true },
          { id: 'opt-2', text: '8 unit cubes', textTa: '8 சிறிய கனசதுரங்கள்', isCorrect: false },
          { id: 'opt-3', text: '6 unit cubes', textTa: '6 சிறிய கனசதுரங்கள்', isCorrect: false },
          { id: 'opt-4', text: '16 unit cubes', textTa: '16 சிறிய கனசதுரங்கள்', isCorrect: false },
        ],
        explanation: 'A cube has 12 edges. On each edge of length 3, exactly 1 cube (the middle edge piece) has 2 painted faces. 12 edges * 1 = 12 cubes.',
        explanationTa: 'ஒரு கனசதுரத்திற்கு 12 விளிம்புகள் உள்ளன. 3 நீளமுள்ள ஒவ்வொரு விளிம்பின் நடுவில் உள்ள 1 சிறிய கனசதுரத்திற்கு மட்டுமே 2 முகங்கள் வண்ணமாக இருக்கும். 12 x 1 = 12.',
        bonusXP: 150,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optId: string) => {
    if (answered || !qotd) return;
    setSelectedOption(optId);
    setAnswered(true);

    const chosen = qotd.options.find((o: any) => o.id === optId);
    const correct = Boolean(chosen?.isCorrect);
    setIsCorrect(correct);

    if (correct) {
      sound.playSuccess();
      triggerConfetti();
      const bonus = qotd.bonusXP || 150;
      addXP(bonus);
      setEarnedXP(bonus);
      const todayKey = new Date().toISOString().split('T')[0];
      recordDailyCompletion(todayKey, 1000);
      setStreakData(getStreakCalendar(calendarYear, calendarMonth));
    } else {
      sound.playError();
    }
  };

  const handleVoiceRead = () => {
    if (!qotd) return;
    const promptText = isTa ? qotd.promptTa || qotd.prompt : qotd.prompt;
    speech.speak(promptText, isTa ? 'ta' : 'en');
  };

  const handleToggleNotifications = async () => {
    if (!notifEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotifEnabled(true);
        saveNotificationSettings({ enabled: true, time: notifTime });
        setNotifMessage(isTa ? 'அறிவிப்புகள் வெற்றிகரமாக செயல்படுத்தப்பட்டன!' : 'Notifications enabled successfully!');
      } else {
        setNotifMessage(isTa ? 'அனுமதி மறுக்கப்பட்டது அல்லது பிரவுசர் ஆதரிக்கவில்லை.' : 'Permission denied or not supported by browser.');
      }
    } else {
      setNotifEnabled(false);
      saveNotificationSettings({ enabled: false });
      setNotifMessage(isTa ? 'அறிவிப்புகள் முடக்கப்பட்டன.' : 'Notifications disabled.');
    }
  };

  const handleTestNotification = () => {
    const sent = sendBrowserNotification(
      isTa ? '🔥 Sand.E IQ சோதனை அறிவிப்பு' : '🔥 Sand.E IQ Practice Reminder',
      {
        body: isTa
          ? 'உங்கள் தினசரி மூளைப் பயிற்சி தயாராக உள்ளது! தொடர் வெற்றியைப் பாதுகாக்கவும்.'
          : 'Your daily cognitive brain challenge is ready! Keep your mind sharp and maintain your streak.',
      }
    );
    if (sent) {
      setNotifMessage(isTa ? 'சோதனை அறிவிப்பு அனுப்பப்பட்டது!' : 'Test notification sent!');
    } else {
      setNotifMessage(isTa ? 'அறிவிப்பை அனுப்ப முடியவில்லை. அனுமதியை சரிபார்க்கவும்.' : 'Could not send. Check browser permissions.');
    }
  };

  if (!isOpen) return null;

  const profile = getUserProfile();
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNamesTa = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0a1226] via-[#050505] to-[#050505] border border-blue-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,102,255,0.3)] my-auto max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/40">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{isTa ? 'அன்றாட IQ சவால் & தொடர்ச்சி' : 'Daily IQ Challenge & Streak'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {profile.dailyStreak || 0} {isTa ? 'நாட்கள்' : 'Days'} 🔥
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isTa ? 'அன்றாட புதிர், தொடர் காலண்டர் & பயிற்சி நினைவூட்டல்கள்' : 'Question of the Day, Streak Calendar & Daily Reminders'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-blue-900/40 my-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('qotd')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'qotd'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isTa ? 'இன்றைய கேள்வி (QOTD)' : 'Question of the Day'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isTa ? 'தொடர் காலண்டர்' : 'Streak Calendar'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reminders')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'reminders'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{isTa ? 'நினைவூட்டல்' : 'Reminders'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: QUESTION OF THE DAY */}
          {activeTab === 'qotd' && (
            <div className="space-y-4">
              {loading || !qotd ? (
                <div className="p-8 text-center text-slate-400">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p>{isTa ? 'இன்றைய கேள்வி ஏற்றப்படுகிறது...' : 'Loading Question of the Day...'}</p>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-cyan-500/30 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      ⚡ {isTa ? 'அன்றாட நுண்ணறிவு' : 'Daily Micro-Challenge'} · +{qotd.bonusXP || 150} XP
                    </span>
                    <button
                      type="button"
                      onClick={handleVoiceRead}
                      className="p-1.5 rounded-lg bg-blue-500/20 text-cyan-300 hover:bg-blue-500/30 border border-cyan-400/30 text-xs flex items-center gap-1 cursor-pointer"
                      title="Read question aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isTa ? 'கேள்வி வாசி' : 'Listen'}</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {isTa ? qotd.titleTa || qotd.title : qotd.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {isTa ? qotd.promptTa || qotd.prompt : qotd.prompt}
                    </p>
                  </div>

                  {/* 4 Choices */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {qotd.options?.map((opt: any) => {
                      const isSelected = selectedOption === opt.id;
                      let btnStyle = 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-300';
                      if (answered) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-400 text-emerald-300 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300 line-through';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-blue-600/40 border-cyan-400 text-white';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={answered}
                          onClick={() => handleSelectOption(opt.id)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{isTa ? opt.textTa || opt.text : opt.text}</span>
                          {answered && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />}
                          {answered && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after answering */}
                  {answered && (
                    <div className="p-4 rounded-xl bg-blue-950/40 border border-cyan-500/30 text-xs space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-cyan-300">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{isTa ? 'தர்க்க விளக்கம்:' : 'Deductive Explanation:'}</span>
                        </span>
                        {isCorrect && (
                          <span className="font-mono text-emerald-400 font-bold">+{earnedXP} XP Earned!</span>
                        )}
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {isTa ? qotd.explanationTa || qotd.explanation : qotd.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STREAK CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              {/* Calendar navigation header */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-blue-900/40">
                <button
                  type="button"
                  onClick={() => {
                    if (calendarMonth === 0) {
                      setCalendarMonth(11);
                      setCalendarYear((y) => y - 1);
                    } else {
                      setCalendarMonth((m) => m - 1);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <div className="text-sm font-bold text-white">
                    {isTa ? monthNamesTa[calendarMonth] : monthNamesEn[calendarMonth]} {calendarYear}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400">
                    {streakData.completedDays.length} {isTa ? 'நாட்கள் முடிக்கப்பட்டன' : 'days completed this month'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (calendarMonth === 11) {
                      setCalendarMonth(0);
                      setCalendarYear((y) => y + 1);
                    } else {
                      setCalendarMonth((m) => m + 1);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day grid */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-900/50">
                <div className="grid grid-cols-7 gap-1 text-center mb-2 text-[10px] font-mono text-slate-400 font-bold">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {/* Empty offset padding */}
                  {Array.from({ length: streakData.firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="p-2" />
                  ))}

                  {/* Day cells */}
                  {Array.from({ length: streakData.daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const isDone = streakData.completedDays.includes(dayNum);
                    const isToday =
                      dayNum === new Date().getDate() &&
                      calendarMonth === new Date().getMonth() &&
                      calendarYear === new Date().getFullYear();

                    return (
                      <div
                        key={dayNum}
                        className={`p-2 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                          isDone
                            ? 'bg-gradient-to-br from-amber-500/25 to-orange-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                            : isToday
                            ? 'bg-blue-600/30 border border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                            : 'bg-slate-900/40 text-slate-500 border border-slate-800/60'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {isDone && <span className="text-[10px] mt-0.5">🔥</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Streak Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 text-center">
                  <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                    {isTa ? 'தற்போதைய தொடர்' : 'Current Streak'}
                  </div>
                  <div className="text-2xl font-black text-white mt-0.5">
                    {profile.dailyStreak || 0} 🔥
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/30 text-center">
                  <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                    {isTa ? 'மொத்த XP புள்ளிகள்' : 'Total XP'}
                  </div>
                  <div className="text-2xl font-black text-white mt-0.5">
                    {profile.xp || 0} ⚡
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRACTICE REMINDERS */}
          {activeTab === 'reminders' && (
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-blue-900/50 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span>{isTa ? 'தினசரி பயிற்சி நினைவூட்டல் அமைப்புகள்' : 'Daily Practice Reminders'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isTa
                    ? 'உங்கள் தொடர் வெற்றியைப் பாதுகாக்க தினசரி நினைவூட்டல்களை அமைக்கவும்.'
                    : 'Configure gentle browser notifications so you never break your cognitive streak.'}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">
                    {isTa ? 'பிரவுசர் நினைவூட்டல்' : 'Browser Notifications'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isNotificationSupported()
                      ? isTa
                        ? 'பிரவுசர் ஆதரவு உள்ளது'
                        : 'Supported on this browser'
                      : isTa
                      ? 'இந்த பிரவுசரில் ஆதரவு இல்லை'
                      : 'Not supported in current browser'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleNotifications}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    notifEnabled
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {notifEnabled ? (isTa ? 'இயக்கத்தில்' : 'Enabled') : (isTa ? 'முடங்கியது' : 'Disabled')}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs font-bold text-white">
                  {isTa ? 'நினைவூட்டல் நேரம்' : 'Reminder Time'}
                </span>
                <input
                  type="time"
                  value={notifTime}
                  onChange={(e) => {
                    setNotifTime(e.target.value);
                    saveNotificationSettings({ time: e.target.value });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="px-3.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold cursor-pointer"
                >
                  🔔 {isTa ? 'சோதனை அறிவிப்பு அனுப்புக' : 'Send Test Notification'}
                </button>
              </div>

              {notifMessage && (
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 text-center animate-fade-in">
                  {notifMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
