import React, { useState, useEffect } from 'react';
import { EnglishCategory, EnglishLessonItem } from '../types/game';
import { AppLanguage } from '../types/i18n';
import { t } from '../utils/i18n';
import { ENGLISH_LESSONS } from '../data/englishLessons';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { saveScoreToLeaderboard } from '../utils/storage';
import { loadEnglishSession, saveEnglishSession, clearSession } from '../utils/gameSessionStorage';
import {
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Award,
  AlertTriangle,
  Languages,
  Check,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BookmarkCheck,
} from 'lucide-react';

interface Props {
  currentLang: AppLanguage;
  onWin: (stats: {
    mode: 'english';
    difficulty: 'easy' | 'medium' | 'hard';
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  }) => void;
}

export const EnglishLearningGame: React.FC<Props> = ({ currentLang, onWin }) => {
  const initialSaved = React.useMemo(() => loadEnglishSession(), []);

  const [selectedLevel, setSelectedLevel] = useState<'all' | 'easy' | 'medium' | 'hard'>(
    () => initialSaved?.selectedLevel ?? 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<EnglishCategory | 'all'>(
    () => initialSaved?.selectedCategory ?? 'all'
  );
  const [currentIndex, setCurrentIndex] = useState(() => initialSaved?.currentIndex ?? 0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(() => initialSaved?.score ?? 0);
  const [streak, setStreak] = useState(() => initialSaved?.streak ?? 0);
  const [stars, setStars] = useState(() => initialSaved?.stars ?? 0);
  const [timeElapsed, setTimeElapsed] = useState(() => initialSaved?.timeElapsed ?? 0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState<'normal' | 'slow'>('normal');
  const [isResumedBanner, setIsResumedBanner] = useState(
    () => Boolean(initialSaved && (initialSaved.currentIndex > 0 || initialSaved.score > 0))
  );

  // Count lessons by difficulty level
  const countAll = ENGLISH_LESSONS.length;
  const countEasy = ENGLISH_LESSONS.filter((item) => item.level === 'easy').length;
  const countMedium = ENGLISH_LESSONS.filter((item) => item.level === 'medium').length;
  const countHard = ENGLISH_LESSONS.filter((item) => item.level === 'hard').length;

  // Filter lessons based on both level and category
  const filteredLessons = ENGLISH_LESSONS.filter((item) => {
    const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchLevel && matchCategory;
  });

  // Safe fallback if category has no lessons in chosen level
  const activeLessons =
    filteredLessons.length > 0
      ? filteredLessons
      : ENGLISH_LESSONS.filter((item) => selectedLevel === 'all' || item.level === selectedLevel);

  const safeLessons = activeLessons.length > 0 ? activeLessons : ENGLISH_LESSONS;
  const currentLesson: EnglishLessonItem =
    safeLessons[currentIndex % safeLessons.length] || ENGLISH_LESSONS[0];

  const isTa = currentLang === 'ta';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';
  const isHi = currentLang === 'hi';

  // Save session on any change
  useEffect(() => {
    saveEnglishSession({
      selectedLevel,
      selectedCategory,
      currentIndex,
      score,
      streak,
      stars,
      timeElapsed,
      lastUpdated: Date.now(),
    });
  }, [selectedLevel, selectedCategory, currentIndex, score, streak, stars, timeElapsed]);

  useEffect(() => {
    const handleVis = () => {
      saveEnglishSession({
        selectedLevel,
        selectedCategory,
        currentIndex,
        score,
        streak,
        stars,
        timeElapsed,
        lastUpdated: Date.now(),
      });
    };
    document.addEventListener('visibilitychange', handleVis);
    window.addEventListener('beforeunload', handleVis);
    return () => {
      document.removeEventListener('visibilitychange', handleVis);
      window.removeEventListener('beforeunload', handleVis);
    };
  }, [selectedLevel, selectedCategory, currentIndex, score, streak, stars, timeElapsed]);

  // Timer: Pause when outside the app
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.hidden) return; // Freeze timer if outside app!
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset state on lesson or filter change
  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentIndex, selectedCategory, selectedLevel]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speechSpeed === 'slow' ? 0.75 : 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    sound.playClick(500);
    setSelectedOptionId(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId || isAnswered) return;

    const chosenOption = currentLesson.options.find((opt) => opt.id === selectedOptionId);
    const correct = chosenOption?.isCorrect ?? false;

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playSuccess();
      triggerConfetti();
      setScore((prev) => prev + 100 + streak * 20);
      setStreak((prev) => prev + 1);
      setStars((prev) => prev + 1);

      // Auto-pronounce the full correct sentence so learner hears it!
      setTimeout(() => {
        speakText(currentLesson.pronunciationPhrase);
      }, 300);

      // If user reaches 5 correct answers, trigger a win callback
      if ((stars + 1) % 5 === 0) {
        onWin({
          mode: 'english',
          difficulty: currentLesson.level,
          score: score + 150,
          iqEstimate: 120 + Math.min(25, stars * 2),
          timeSeconds: timeElapsed,
          accuracy: 100,
          title: isTa ? 'சுலப ஆங்கிலக் கல்வி' : 'Easy & Correct English',
        });
        saveScoreToLeaderboard({
          playerName: isTa ? 'சுலப ஆங்கில மாணவர்' : 'English Learner Star',
          mode: 'english',
          difficulty: currentLesson.level,
          score: score + 150,
          iqEstimate: 125,
          timeSeconds: timeElapsed,
          accuracy: 100,
          notes: `English Lesson: ${currentLesson.title} (${currentLesson.level.toUpperCase()})`,
        });
      }
    } else {
      sound.playBuzzer();
      setStreak(0);
    }
  };

  const handleNext = () => {
    sound.playClick(520);
    setCurrentIndex((prev) => (prev + 1) % safeLessons.length);
  };

  const handlePrev = () => {
    sound.playClick(480);
    setCurrentIndex((prev) => (prev - 1 + safeLessons.length) % safeLessons.length);
  };

  const handleRestart = () => {
    sound.playClick(440);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 w-full min-w-0">
      {/* Lesson Continuity Notification */}
      {isResumedBanner && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              {isTa
                ? `முந்தைய பாடம் தொடர்கிறது: பாடம் #${(currentIndex % safeLessons.length) + 1} (${currentLesson.titleTa})`
                : `Resumed previous lesson: Lesson #${(currentIndex % safeLessons.length) + 1} (${currentLesson.title})`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSession('english');
              setCurrentIndex(0);
              setScore(0);
              setStreak(0);
              setStars(0);
              setTimeElapsed(0);
              setIsResumedBanner(false);
            }}
            className="text-[11px] underline text-slate-400 hover:text-indigo-200 cursor-pointer transition-colors"
          >
            {isTa ? 'முதல் பாடத்திலிருந்து தொடங்க' : 'Restart from Lesson 1'}
          </button>
        </div>
      )}

      {/* Top Banner: Easy & Correct English Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border-2 border-indigo-500/30 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center text-3xl sm:text-4xl shadow-md shrink-0">
            {currentLesson.emoji}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-indigo-400 uppercase tracking-wider font-mono">
                {isTa ? 'சுலப ஆங்கிலக் கல்வி' : 'Easy & Correct English'}
              </span>
              <span className="text-slate-600">·</span>
              {/* Level Badge in Header */}
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-black font-mono uppercase tracking-wide border ${
                  currentLesson.level === 'easy'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : currentLesson.level === 'medium'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                {currentLesson.level === 'easy'
                  ? isTa
                    ? '🟢 எளிது (Easy)'
                    : '🟢 Easy'
                  : currentLesson.level === 'medium'
                  ? isTa
                    ? '🟡 நடுத்தரம் (Medium)'
                    : '🟡 Medium'
                  : isTa
                  ? '🔴 கடினம் (Hard)'
                  : '🔴 Hard'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-300 font-mono">
                Lesson #{(currentIndex % safeLessons.length) + 1} of {safeLessons.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              {isTa ? currentLesson.titleTa : currentLesson.title}
            </h2>
          </div>
        </div>

        {/* Stats: Score, Stars, Streak */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm shadow-sm">
            <span>⭐</span>
            <span>{stars} Stars</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs sm:text-sm shadow-sm">
            <span>🔥</span>
            <span>{streak} Streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold text-xs sm:text-sm shadow-sm">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>{score} Pts</span>
          </div>
        </div>
      </div>

      {/* Level Selection Row: Easy, Medium, Hard, All */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTa ? 'ஆங்கில நிலை (English Levels):' : 'Select English Level:'}</span>
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            {selectedLevel === 'all'
              ? isTa
                ? 'அனைத்து நிலைகளும்'
                : 'All Difficulty Levels'
              : selectedLevel === 'easy'
              ? isTa
                ? 'அடிப்படை & தினசரி'
                : 'Beginner & Daily'
              : selectedLevel === 'medium'
              ? isTa
                ? 'இடைநிலை & இலக்கணம்'
                : 'Intermediate & Grammar'
              : isTa
              ? 'மேம்பட்ட ஆங்கிலம்'
              : 'Advanced & Tricky Rules'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* All */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(460);
              setSelectedLevel('all');
              setCurrentIndex(0);
            }}
            className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
              selectedLevel === 'all'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/50'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-850 border-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 font-extrabold text-xs sm:text-sm">
              <span>⭐</span>
              <span>{isTa ? 'அனைத்தும்' : 'All'}</span>
            </div>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/40">
              {countAll}
            </span>
          </button>

          {/* Easy */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(480);
              setSelectedLevel('easy');
              setCurrentIndex(0);
            }}
            className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
              selectedLevel === 'easy'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/50'
                : 'bg-slate-950 text-emerald-400 hover:bg-slate-850 border-emerald-950/60 hover:text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-1.5 font-extrabold text-xs sm:text-sm">
              <span>🟢</span>
              <span>{isTa ? 'எளிது (Easy)' : 'Easy'}</span>
            </div>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/40">
              {countEasy}
            </span>
          </button>

          {/* Medium */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(500);
              setSelectedLevel('medium');
              setCurrentIndex(0);
            }}
            className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
              selectedLevel === 'medium'
                ? 'bg-amber-600 text-white border-amber-400 shadow-md ring-2 ring-amber-400/50'
                : 'bg-slate-950 text-amber-400 hover:bg-slate-850 border-amber-950/60 hover:text-amber-300'
            }`}
          >
            <div className="flex items-center gap-1.5 font-extrabold text-xs sm:text-sm">
              <span>🟡</span>
              <span>{isTa ? 'நடுத்தரம் (Medium)' : 'Medium'}</span>
            </div>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/40">
              {countMedium}
            </span>
          </button>

          {/* Hard */}
          <button
            type="button"
            onClick={() => {
              sound.playClick(520);
              setSelectedLevel('hard');
              setCurrentIndex(0);
            }}
            className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
              selectedLevel === 'hard'
                ? 'bg-rose-600 text-white border-rose-400 shadow-md ring-2 ring-rose-400/50'
                : 'bg-slate-950 text-rose-400 hover:bg-slate-850 border-rose-950/60 hover:text-rose-300'
            }`}
          >
            <div className="flex items-center gap-1.5 font-extrabold text-xs sm:text-sm">
              <span>🔴</span>
              <span>{isTa ? 'கடினம் (Hard)' : 'Hard'}</span>
            </div>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/40">
              {countHard}
            </span>
          </button>
        </div>
      </div>

      {/* Lesson Quick Navigation & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 flex-1">
          {[
            { id: 'all', label: isTa ? 'அனைத்தும்' : 'All Topics' },
            { id: 'grammar', label: isTa ? 'இலக்கணம்' : 'Grammar' },
            { id: 'sentences', label: isTa ? 'உரையாடல்' : 'Daily Sentences' },
            { id: 'vocab', label: isTa ? 'சொற்கள்' : 'Vocabulary' },
            { id: 'spelling', label: isTa ? 'எழுத்துக்கூட்டு' : 'Spelling' },
            { id: 'opposites', label: isTa ? 'எதிர்ச்சொல்' : 'Opposites' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                sound.playClick(460);
                setSelectedCategory(cat.id as any);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-500 text-white shadow-md ring-2 ring-indigo-400'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Easy Lesson Navigation Buttons (Previous / Next) */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all cursor-pointer hover:border-slate-700"
            title="Previous Lesson"
          >
            <ChevronLeft className="w-4 h-4 text-indigo-400" />
            <span>{isTa ? 'முந்தையது' : 'Prev'}</span>
          </button>
          <span className="text-xs font-mono text-slate-400 px-2">
            {(currentIndex % safeLessons.length) + 1}/{safeLessons.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all cursor-pointer hover:border-slate-700"
            title="Next Lesson"
          >
            <span>{isTa ? 'அடுத்தது' : 'Next'}</span>
            <ChevronRight className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </div>

      {/* Main Interactive Learning Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-6">
        {/* Lesson Challenge Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-indigo-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{isTa ? 'ஆங்கில சவால் (English Challenge)' : 'English Challenge'}</span>
            </span>

            {/* Pronunciation Audio Helper */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSpeechSpeed((prev) => (prev === 'normal' ? 'slow' : 'normal'))
                }
                className="px-2 py-1 text-[11px] font-mono rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                title="Toggle pronunciation speed"
              >
                Speed: {speechSpeed}
              </button>
              <button
                type="button"
                onClick={() => speakText(currentLesson.sentenceWithBlank || currentLesson.prompt)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-indigo-500 text-white border-indigo-400 animate-pulse'
                    : 'bg-slate-800 text-indigo-300 border-slate-700 hover:bg-slate-750 hover:text-white'
                }`}
                title="Listen to native English pronunciation"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
                <span>{isTa ? 'குரலில் கேள்' : 'Listen'}</span>
              </button>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-white">
            {currentLesson.prompt}
          </h3>
          {isTa && (
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              {currentLesson.promptTa}
            </p>
          )}
        </div>

        {/* Sentence with Blank Highlight */}
        {currentLesson.sentenceWithBlank && (
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-indigo-500/30 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-base sm:text-xl font-bold text-white tracking-wide leading-relaxed font-sans">
                {currentLesson.sentenceWithBlank.replace('___', '______')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => speakText(currentLesson.pronunciationPhrase)}
              className="p-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer shrink-0"
              title="Hear correct full pronunciation"
            >
              <Volume2 className="w-5 h-5 text-indigo-400" />
            </button>
          </div>
        )}

        {/* Multiple Choice Options */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono block">
            {isTa ? 'சரியான விடையைத் தேர்ந்தெடுக்கவும்:' : 'Choose the correct option:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentLesson.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnStyle =
                'border-slate-800 bg-slate-950/70 hover:border-indigo-400/50 hover:bg-slate-900 text-slate-200';

              if (isSelected) {
                btnStyle =
                  'border-indigo-400 bg-indigo-500/20 ring-2 ring-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)] text-white';
              }

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle =
                    'border-emerald-500 bg-emerald-950/60 text-emerald-100 ring-2 ring-emerald-500 shadow-md';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-rose-500 bg-rose-950/60 text-rose-200';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between gap-2 min-h-[5.5rem] select-none ${btnStyle} disabled:cursor-default`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base sm:text-lg font-black">{opt.text}</span>
                    {isAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    {isAnswered && isSelected && !opt.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </div>
                  {opt.textTa && (
                    <span className="text-xs text-slate-400 font-sans">{opt.textTa}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button: Check Answer or Next Lesson */}
        <div className="pt-2">
          {!isAnswered ? (
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={handleCheckAnswer}
              className="w-full py-4 px-6 rounded-2xl font-black text-base bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{isTa ? 'பதிலைச் சரிபார்! (Check Answer)' : 'Check Answer!'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl font-black text-base bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <span>{isTa ? 'அடுத்த பாடம்! (Next Lesson)' : 'Next Lesson!'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => speakText(currentLesson.pronunciationPhrase)}
                className="w-full sm:w-auto py-4 px-5 rounded-2xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <span>{isTa ? 'வாக்கியத்தை உச்சரி' : 'Hear Pronunciation'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Educational Feedback & Grammar Rule Card (Revealed after answering) */}
        {isAnswered && (
          <div
            className={`p-6 rounded-3xl border-2 space-y-4 transition-all animate-fade-in ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100 shadow-xl'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-100 shadow-xl'
            }`}
          >
            {/* Status Heading */}
            <div className="flex items-center gap-2.5 text-base sm:text-lg font-black">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300">
                    {isTa ? 'அற்புதம்! உங்கள் பதில் சரியானது! (Correct!)' : 'Splendid! Your answer is 100% correct!'}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  <span className="text-rose-300">
                    {isTa ? 'தவறான விடை! சரியான விதியைக் கற்றுக் கொள்ளுங்கள்!' : 'Incorrect option! Learn the rule below!'}
                  </span>
                </>
              )}
            </div>

            {/* Bilingual Explanations */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-slate-200">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono block flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-indigo-400" />
                <span>{isTa ? 'இது ஏன் சரி? (Why is this correct?)' : 'Why is this correct?'}</span>
              </span>
              <p className="text-sm font-sans leading-relaxed">
                {currentLesson.explanation}
              </p>
              {isTa && (
                <p className="text-xs sm:text-sm text-indigo-200 font-sans leading-relaxed pt-1 border-t border-slate-800">
                  {currentLesson.explanationTa}
                </p>
              )}
            </div>

            {/* Golden Rule Tip */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono block">
                ⭐ {isTa ? 'இலக்கண பொன்விதி (Grammar Rule Tip):' : 'Grammar Rule Tip:'}
              </span>
              <p className="text-xs sm:text-sm font-semibold">{currentLesson.ruleTip}</p>
              {isTa && (
                <p className="text-xs text-amber-300/90 pt-0.5">{currentLesson.ruleTipTa}</p>
              )}
            </div>

            {/* Common Mistake to Avoid */}
            {currentLesson.incorrectCommon && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-rose-400">
                    {isTa ? 'தவிர்க்க வேண்டிய பொதுவான பிழை:' : 'Avoid this common mistake:'}
                  </span>
                  <span>{currentLesson.incorrectCommon}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
