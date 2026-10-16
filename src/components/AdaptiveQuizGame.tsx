import React, { useState, useEffect, useRef } from 'react';
import { IQQuizQuestion } from '../types/game';
import { IQ_QUIZ_QUESTIONS } from '../data/iqQuizQuestions';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { triggerConfetti } from '../utils/confetti';
import {
  saveScoreToLeaderboard,
  addXP,
  recordCategoryPerformance,
  unlockAchievement,
  getUserProfile,
} from '../utils/storage';
import {
  Zap,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Bot,
  Brain,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface Props {
  currentLang: AppLanguage;
  onWin: (stats: {
    mode: 'quiz';
    difficulty: 'easy' | 'medium' | 'hard';
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  }) => void;
  onOpenAIAssistant: (contextQuestion?: string) => void;
}

export const AdaptiveQuizGame: React.FC<Props> = ({
  currentLang,
  onWin,
  onOpenAIAssistant,
}) => {
  const isTa = currentLang === 'ta';

  // Game state
  const [currentTier, setCurrentTier] = useState<'easy' | 'medium' | 'hard' | 'master'>('easy');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions] = useState(8);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [isGameOver, setIsGameOver] = useState(false);

  // Question selection
  const [activeQuestion, setActiveQuestion] = useState<IQQuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [eliminatedOptionIds, setEliminatedOptionIds] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [hintTier, setHintTier] = useState<0 | 1 | 2 | 3>(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Pick question based on current tier
  const pickQuestionForTier = (tier: 'easy' | 'medium' | 'hard' | 'master') => {
    const diff = tier === 'master' ? 'hard' : tier;
    const pool = IQ_QUIZ_QUESTIONS.filter((q) => q.difficulty === diff);
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex] || IQ_QUIZ_QUESTIONS[0];
  };

  useEffect(() => {
    const q = pickQuestionForTier('easy');
    setActiveQuestion(q);
    setTimeLeft(40);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (answered || isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [answered, isGameOver, questionIndex]);

  const handleTimeOut = () => {
    sound.playError();
    setAnswered(true);
    setCorrectStreak(0);
    // Demote difficulty on timeout
    if (currentTier === 'hard' || currentTier === 'master') setCurrentTier('medium');
    else setCurrentTier('easy');
  };

  const handleSelectOption = (optId: string) => {
    if (answered || !activeQuestion) return;
    setSelectedOption(optId);
    setAnswered(true);

    const chosen = activeQuestion.options.find((o) => o.id === optId);
    const isCorrect = Boolean(chosen?.isCorrect);

    // Record analytics
    recordCategoryPerformance(activeQuestion.category, isCorrect, 40 - timeLeft);

    if (isCorrect) {
      sound.playSuccess();
      const streakMultiplier = 1 + correctStreak * 0.25;
      const tierMultiplier = currentTier === 'master' ? 3.5 : currentTier === 'hard' ? 2.2 : currentTier === 'medium' ? 1.5 : 1.0;
      const points = Math.round(500 * tierMultiplier * streakMultiplier);

      setScore((s) => s + points);
      setCorrectCount((c) => c + 1);
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);

      // Adaptive difficulty scaling: 2 consecutive correct answers promotes tier
      if (newStreak >= 2) {
        if (currentTier === 'easy') setCurrentTier('medium');
        else if (currentTier === 'medium') setCurrentTier('hard');
        else if (currentTier === 'hard') setCurrentTier('master');
      }
    } else {
      sound.playError();
      setCorrectStreak(0);
      // Adaptive difficulty scaling: 1 wrong answer steps tier down
      if (currentTier === 'master') setCurrentTier('hard');
      else if (currentTier === 'hard') setCurrentTier('medium');
      else if (currentTier === 'medium') setCurrentTier('easy');
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 >= totalQuestions) {
      finishGame();
      return;
    }

    setQuestionIndex((i) => i + 1);
    setSelectedOption(null);
    setEliminatedOptionIds([]);
    setAnswered(false);
    setHintTier(0);
    speech.stop();
    setIsSpeaking(false);
    setTimeLeft(currentTier === 'master' ? 25 : currentTier === 'hard' ? 30 : 40);

    const nextQ = pickQuestionForTier(currentTier);
    setActiveQuestion(nextQ);
  };

  const finishGame = () => {
    setIsGameOver(true);
    triggerConfetti();
    unlockAchievement('adaptive_survivor');

    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const iqEstimate = Math.min(150, 105 + Math.round((accuracy / 100) * 35));
    const xpBonus = Math.round(score * 0.2) + 200;
    addXP(xpBonus);

    const profile = getUserProfile();
    saveScoreToLeaderboard({
      playerName: profile.playerName || 'Player 1',
      mode: 'quiz',
      difficulty: 'hard',
      score,
      iqEstimate,
      timeSeconds: totalQuestions * 25,
      accuracy,
      notes: `Adaptive Mode · ${currentTier.toUpperCase()} Peak Tier`,
    });

    onWin({
      mode: 'quiz',
      difficulty: 'hard',
      score,
      iqEstimate,
      timeSeconds: totalQuestions * 25,
      accuracy,
      title: 'Adaptive Cognitive Mastery',
    });
  };

  // Feature 18: Progressive Hints System
  const handleUseHint = () => {
    if (!activeQuestion) return;
    sound.playClick(450);

    if (hintTier === 0) {
      // Tier 1: General category hint
      setHintTier(1);
    } else if (hintTier === 1) {
      // Tier 2: 50/50 Eliminator (hide 2 wrong choices)
      const wrongOptions = activeQuestion.options.filter((o) => !o.isCorrect);
      const toEliminate = wrongOptions.slice(0, 2).map((o) => o.id);
      setEliminatedOptionIds(toEliminate);
      setHintTier(2);
    } else if (hintTier === 2) {
      // Tier 3: In-depth cognitive tip
      setHintTier(3);
    }
  };

  // Feature 20: Voice Reading
  const handleToggleVoice = () => {
    if (isSpeaking) {
      speech.stop();
      setIsSpeaking(false);
    } else {
      if (!activeQuestion) return;
      const text = isTa ? activeQuestion.promptTa : activeQuestion.prompt;
      setIsSpeaking(true);
      speech.speak(
        text,
        isTa ? 'ta' : 'en',
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
      unlockAchievement('voice_reader');
    }
  };

  if (!activeQuestion) return null;

  const tierColors = {
    easy: 'from-emerald-500/20 to-teal-500/20 border-emerald-400 text-emerald-300',
    medium: 'from-blue-500/20 to-cyan-500/20 border-cyan-400 text-cyan-300',
    hard: 'from-purple-500/20 to-pink-500/20 border-purple-400 text-purple-300',
    master: 'from-red-500/20 to-amber-500/20 border-amber-400 text-amber-300',
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-fade-in">
      {/* Top Header Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#0a152d] via-[#050505] to-[#050505] border border-blue-500/40 shadow-[0_0_35px_rgba(0,102,255,0.25)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isTa ? 'தகவமைப்பு கடின வினாடி வினா' : 'Adaptive Difficulty Engine'}</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase border ${tierColors[currentTier]}`}>
              Tier: {currentTier}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isTa ? 'சுய-சரிசெய்யும் அறிவுத்திறன் சவால்' : 'Self-Adjusting Cognitive Exam'}
          </h2>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-center min-w-[75px]">
            <span className="text-[10px] font-mono uppercase text-slate-400">{isTa ? 'கேள்வி' : 'Question'}</span>
            <div className="text-sm font-black text-white">{questionIndex + 1}/{totalQuestions}</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-900 border border-blue-500/30 text-center min-w-[85px]">
            <span className="text-[10px] font-mono uppercase text-cyan-400">{isTa ? 'மதிப்பெண்' : 'Score'}</span>
            <div className="text-sm font-black text-cyan-300">{score.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-center min-w-[70px]">
            <span className="text-[10px] font-mono uppercase text-amber-400">{isTa ? 'நேரம்' : 'Timer'}</span>
            <div className={`text-sm font-black ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
              {timeLeft}s
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-blue-900/50 space-y-5 shadow-2xl">
        {/* Tool bar: Voice Reading & Progressive Hints */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSpeaking
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,217,255,0.4)]'
                  : 'bg-blue-500/15 hover:bg-blue-500/25 text-cyan-300 border border-cyan-400/30'
              }`}
              title="Voice Reading (Web Speech API)"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isTa ? 'குரல் வாசிப்பு' : 'Read Aloud'}</span>
            </button>

            <button
              type="button"
              disabled={answered || hintTier >= 3}
              onClick={handleUseHint}
              className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Progressive Hints (Tier 1: Category, Tier 2: 50/50, Tier 3: In-depth)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {hintTier === 0
                  ? isTa
                    ? 'உதவிக்குறிப்பு 1'
                    : 'Hint 1 (Clue)'
                  : hintTier === 1
                  ? isTa
                    ? 'உதவிக்குறிப்பு 2 (50/50)'
                    : 'Hint 2 (50/50)'
                  : isTa
                  ? 'உதவிக்குறிப்பு 3 (முழுமை)'
                  : 'Hint 3 (Deep)'}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenAIAssistant(activeQuestion.prompt)}
            className="p-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-400/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>{isTa ? 'AI ஆசான்' : 'AI Coach'}</span>
          </button>
        </div>

        {/* Question Prompt */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
            Category: {activeQuestion.category}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {isTa ? activeQuestion.promptTa : activeQuestion.prompt}
          </h3>
        </div>

        {/* Active Progressive Hint Display */}
        {hintTier > 0 && (
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-400/40 text-xs space-y-1 animate-fade-in">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Progressive Hint Level {hintTier}:</span>
            </span>
            <p className="text-slate-300">
              {hintTier === 1 && (isTa ? `பிரிவு உத்தி: ${activeQuestion.cognitiveTipTa}` : `Deductive Tip: ${activeQuestion.cognitiveTip}`)}
              {hintTier === 2 && (isTa ? 'இரண்டு தவறான விருப்பங்கள் நீக்கப்பட்டுள்ளன (50/50)!' : 'Two incorrect choices have been eliminated (50/50)!')}
              {hintTier >= 3 && (isTa ? `ஆழமான தர்க்க வழிகாட்டி: ${activeQuestion.explanationTa}` : `Deep Logical Hint: ${activeQuestion.explanation}`)}
            </p>
          </div>
        )}

        {/* 4 Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {activeQuestion.options.map((opt) => {
            const isEliminated = eliminatedOptionIds.includes(opt.id);
            const isSelected = selectedOption === opt.id;

            if (isEliminated) {
              return (
                <div
                  key={opt.id}
                  className="p-3.5 rounded-2xl border border-slate-800/40 bg-slate-950/30 text-slate-600 text-xs line-through opacity-40 cursor-not-allowed"
                >
                  {isTa ? opt.textTa : opt.text}
                </div>
              );
            }

            let btnStyle = 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-200';
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
                className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <span>{isTa ? opt.textTa : opt.text}</span>
                {answered && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1.5" />}
                {answered && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-1.5" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Step */}
        {answered && (
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-cyan-500/30 space-y-3 animate-fade-in">
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-300 font-bold block mb-1">
                {isTa ? 'தர்க்க விளக்கம்:' : 'Deductive Solution:'}
              </strong>
              {isTa ? activeQuestion.explanationTa : activeQuestion.explanation}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs transition-all shadow-[0_0_15px_rgba(0,217,255,0.4)] flex items-center gap-1.5 cursor-pointer"
              >
                <span>{questionIndex + 1 >= totalQuestions ? (isTa ? 'முடிவுகளைக் காண்க' : 'View Results') : (isTa ? 'அடுத்த கேள்வி' : 'Next Question')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
