import React, { useState, useEffect, useRef } from 'react';
import { IQQuizQuestion } from '../types/game';
import { IQ_QUIZ_QUESTIONS } from '../data/iqQuizQuestions';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { triggerConfetti } from '../utils/confetti';
import { saveScoreToLeaderboard, getUserProfile, addXP } from '../utils/storage';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  Zap,
  Bot,
  Brain,
  ShieldAlert,
  Flame,
  Award,
  Volume2,
  VolumeX,
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

export const IQQuizGame: React.FC<Props> = ({ currentLang, onWin, onOpenAIAssistant }) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameState, setGameState] = useState<'select' | 'playing' | 'round_end' | 'review'>('select');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [instantFeedback, setInstantFeedback] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [hintTier, setHintTier] = useState<0 | 1 | 2 | 3>(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [answeredHistory, setAnsweredHistory] = useState<{
    questionId: string;
    questionPrompt: string;
    questionPromptTa: string;
    chosenOptionId: string | null;
    chosenText: string;
    chosenTextTa: string;
    correctText: string;
    correctTextTa: string;
    isCorrect: boolean;
    explanation: string;
    explanationTa: string;
  }[]>([]);

  const filteredQuestions = React.useMemo(() => {
    return IQ_QUIZ_QUESTIONS.filter((q) => q.difficulty === difficulty);
  }, [difficulty]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];
  const maxTimeForLevel = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 45 : 30;

  // Countdown timer
  useEffect(() => {
    if (gameState !== 'playing' || showExplanation) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeSpent((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, showExplanation, currentIndex]);

  const handleStartGame = (level: 'easy' | 'medium' | 'hard') => {
    sound.playSuccess();
    setDifficulty(level);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setTotalTimeSpent(0);
    setAnsweredHistory([]);
    setHintTier(0);
    setEliminatedOptions([]);
    setTimeLeft(level === 'easy' ? 60 : level === 'medium' ? 45 : 30);
    setGameState('playing');
  };

  const handleRequestHint = () => {
    if (selectedOption !== null || showExplanation) return;
    sound.playClick(620);
    if (hintTier === 0) {
      setHintTier(1);
    } else if (hintTier === 1) {
      setHintTier(2);
      const wrong = currentQ.options.filter((o) => !o.isCorrect);
      if (wrong.length > 0) {
        setEliminatedOptions([wrong[0].id]);
      }
    } else if (hintTier === 2) {
      setHintTier(3);
      const wrong = currentQ.options.filter((o) => !o.isCorrect);
      if (wrong.length > 1) {
        setEliminatedOptions([wrong[0].id, wrong[1].id]);
      }
    }
  };

  const handleTimeExpire = () => {
    sound.playError();
    setStreak(0);
    const correctOpt = currentQ.options.find((o) => o.isCorrect);
    setAnsweredHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        questionPrompt: currentQ.prompt,
        questionPromptTa: currentQ.promptTa,
        chosenOptionId: null,
        chosenText: 'Timed out (No answer)',
        chosenTextTa: 'நேரம் முடிந்தது (விடையளிக்கவில்லை)',
        correctText: correctOpt?.text || '',
        correctTextTa: correctOpt?.textTa || '',
        isCorrect: false,
        explanation: currentQ.explanation,
        explanationTa: currentQ.explanationTa,
      },
    ]);
    setShowExplanation(true);
  };

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption !== null || showExplanation) return;

    setSelectedOption(optionId);
    const chosen = currentQ.options.find((o) => o.id === optionId);
    const correctOpt = currentQ.options.find((o) => o.isCorrect);
    const isCorrect = Boolean(chosen?.isCorrect);

    setAnsweredHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        questionPrompt: currentQ.prompt,
        questionPromptTa: currentQ.promptTa,
        chosenOptionId: optionId,
        chosenText: chosen?.text || '',
        chosenTextTa: chosen?.textTa || '',
        correctText: correctOpt?.text || '',
        correctTextTa: correctOpt?.textTa || '',
        isCorrect,
        explanation: currentQ.explanation,
        explanationTa: currentQ.explanationTa,
      },
    ]);

    if (isCorrect) {
      sound.playSuccess();
      const basePts = difficulty === 'easy' ? 1000 : difficulty === 'medium' ? 1500 : 2200;
      const speedMultiplier = Math.max(1, Math.round((timeLeft / maxTimeForLevel) * 500));
      const streakBonus = streak * 150;
      const roundEarned = basePts + speedMultiplier + streakBonus;

      setScore((s) => s + roundEarned);
      setCorrectCount((c) => c + 1);
      setStreak((st) => st + 1);
    } else {
      sound.playError();
      setStreak(0);
    }

    if (instantFeedback) {
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    sound.playClick(500);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setHintTier(0);
      setEliminatedOptions([]);
      setTimeLeft(maxTimeForLevel);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    sound.playFanfare();
    triggerConfetti();
    setGameState('round_end');

    const totalQ = filteredQuestions.length;
    const finalAccuracy = Math.round((correctCount / totalQ) * 100);
    // Scaled cognitive score index
    const baseRank = difficulty === 'easy' ? 105 : difficulty === 'medium' ? 118 : 132;
    const cognitiveRating = Math.max(85, Math.min(150, baseRank + Math.round((finalAccuracy - 60) * 0.4)));

    const profile = getUserProfile();
    const earnedXP = Math.round(score * 0.15) + (finalAccuracy === 100 ? 300 : 120);
    addXP(earnedXP);

    saveScoreToLeaderboard({
      playerName: profile.playerName || 'Player 1',
      mode: 'quiz',
      difficulty,
      score,
      iqEstimate: cognitiveRating,
      timeSeconds: totalTimeSpent,
      accuracy: finalAccuracy,
      notes: `Sand.E IQ Quiz (${difficulty.toUpperCase()} · ${correctCount}/${totalQ} Correct)`,
    });

    // Sync to global server leaderboard asynchronously
    try {
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: profile.playerName || 'Player 1',
          mode: 'quiz',
          difficulty,
          score,
          iqEstimate: cognitiveRating,
          timeSeconds: totalTimeSpent,
          accuracy: finalAccuracy,
        }),
      }).catch(() => {});
    } catch {}

    onWin({
      mode: 'quiz',
      difficulty,
      score,
      iqEstimate: cognitiveRating,
      timeSeconds: totalTimeSpent,
      accuracy: finalAccuracy,
      title: `${difficulty.toUpperCase()} Cognitive Logic Quiz`,
    });
  };

  const isTamil = currentLang === 'ta';

  if (gameState === 'select') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Futuristic Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0a1226] via-[#050505] to-[#050505] border border-blue-500/30 p-6 sm:p-8 shadow-[0_0_30px_rgba(0,102,255,0.2)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                <span>SAND.E IQ · CHALLENGE YOUR MIND</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {isTamil ? 'ஊடாடும் தர்க்க வினாடி வினா' : 'Interactive IQ-Style Quizzes'}
              </h2>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                {isTamil
                  ? 'எளிது, நடுத்தரம், மற்றும் கடின நிலைகளில் பலதெரிவு கேள்விகள், நேரக் கணிப்பான், உடனடி விளக்கம் மற்றும் துல்லிய மதிப்பெண்கள்.'
                  : 'Multi-tiered cognitive challenges with dynamic countdown timer, instant feedback explanations, and scoring.'}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/80 border border-blue-500/20 text-center min-w-[160px]">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{isTamil ? 'முறை' : 'Format'}</span>
              <span className="text-lg font-black text-white mt-1">4 Options · MCQs</span>
              <span className="text-[11px] text-slate-400 mt-1">Instant Feedback</span>
            </div>
          </div>

          {/* Difficulty Tier Selector */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Easy */}
            <button
              type="button"
              onClick={() => handleStartGame('easy')}
              className="group p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all text-left cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {isTamil ? 'எளிது' : 'EASY'}
                </span>
                <span className="text-xl">🟢</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {isTamil ? 'அடிப்படை தர்க்கம்' : 'Foundational Logic'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isTamil ? '60 வினாடி நேர வரம்பு · வடிவங்கள் மற்றும் எளிய தொடர்கள்' : '60s per prompt · Shape rotation & arithmetic series'}
              </p>
            </button>

            {/* Medium */}
            <button
              type="button"
              onClick={() => handleStartGame('medium')}
              className="group p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900/90 border border-blue-500/40 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all text-left cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-blue-500/20 text-cyan-300 border border-cyan-400/40">
                  {isTamil ? 'நடுத்தரம்' : 'MEDIUM'}
                </span>
                <span className="text-xl">🔵</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {isTamil ? 'பகுப்பாய்வு திறன்' : 'Analytical Deduction'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isTamil ? '45 வினாடி நேர வரம்பு · சமச்சீர்மை & வர்க்க தொடர்கள்' : '45s per prompt · Syllogisms & pattern progressions'}
              </p>
            </button>

            {/* Hard */}
            <button
              type="button"
              onClick={() => handleStartGame('hard')}
              className="group p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900/90 border border-purple-500/40 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all text-left cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {isTamil ? 'கடினம்' : 'HARD'}
                </span>
                <span className="text-xl">🟣</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                {isTamil ? 'உயர்நிலை மேட்ரிக்ஸ்' : 'Advanced Synthesis'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isTamil ? '30 வினாடி நேர வரம்பு · XOR அடுக்குகள் & ஃபிபோனாச்சி' : '30s per prompt · XOR superposition & complex logic'}
              </p>
            </button>
          </div>

          {/* Scientific Disclaimer Note */}
          <div className="mt-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              {isTamil
                ? 'பொறுப்புத் துறப்பு: வினாடி வினா முடிவுகள் Sand.E IQ மூளைப் பயிற்சி மதிப்பெண்களாக மட்டுமே விவரிக்கப்படுகின்றன. இவை மருத்துவ அல்லது உளவியல் சார்ந்த முழு மருத்துவ பரிசோதனை முடிவுகள் அல்ல.'
                : 'Scientific Notice: Quiz results represent cognitive brain-training scores and agility metrics on Sand.E IQ, not clinically calibrated or diagnostic psychometric IQ measurements.'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'round_end') {
    const totalQ = filteredQuestions.length;
    const accuracy = Math.round((correctCount / totalQ) * 100);

    return (
      <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-950 border border-cyan-400/40 shadow-[0_0_35px_rgba(0,217,255,0.25)] text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-3xl">
          🏆
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isTamil ? 'வினாடி வினா முடிந்தது!' : 'Quiz Round Completed!'}
          </h2>
          <p className="text-sm text-cyan-300 font-mono mt-1">
            {difficulty.toUpperCase()} · Sand.E IQ Brain Training
          </p>
        </div>

        {/* Score and Stats grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">{isTamil ? 'மதிப்பெண்' : 'Score'}</span>
            <div className="text-xl sm:text-2xl font-black text-white">{score}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">{isTamil ? 'துல்லியம்' : 'Accuracy'}</span>
            <div className="text-xl sm:text-2xl font-black text-cyan-400">{accuracy}%</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">{isTamil ? 'சரியானவை' : 'Correct'}</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">{correctCount}/{totalQ}</div>
          </div>
        </div>

        <p className="text-xs text-slate-400 italic">
          {isTamil
            ? 'உங்கள் மதிப்பெண் சாதனத்தின் அதிகாரப்பூர்வ வெற்றிப்பலகையில் பதிவு செய்யப்பட்டது.'
            : 'Your genuine score has been registered to the authentic Sand.E IQ leaderboard.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setGameState('review')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,217,255,0.2)]"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{isTamil ? 'விடைகளை மீளாய்வு செய்' : 'Review Answers'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleStartGame(difficulty)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isTamil ? 'மீண்டும் விளையாடு' : 'Play Again'}</span>
          </button>
          <button
            type="button"
            onClick={() => setGameState('select')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold transition-all cursor-pointer"
          >
            {isTamil ? 'நிலை தேர்வு' : 'Choose Level'}
          </button>
        </div>
      </div>
    );
  }

  // REVIEW STATE
  if (gameState === 'review') {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-5 animate-fade-in">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-cyan-400/40">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isTamil ? 'வினாடி வினா விடை மீளாய்வு' : 'Quiz Question-by-Question Review'}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {difficulty.toUpperCase()} · {answeredHistory.filter((a) => a.isCorrect).length}/{answeredHistory.length} {isTamil ? 'சரியானவை' : 'Correct'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setGameState('round_end')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            {isTamil ? 'திரும்பு' : 'Back to Summary'}
          </button>
        </div>

        <div className="space-y-4">
          {answeredHistory.map((item, idx) => (
            <div
              key={item.questionId || idx}
              className={`p-5 rounded-2xl border transition-all ${
                item.isCorrect
                  ? 'bg-emerald-950/25 border-emerald-500/40'
                  : 'bg-rose-950/25 border-rose-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                  Question {idx + 1}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                    item.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {item.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isTamil ? 'சரி' : 'CORRECT'}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>{isTamil ? 'தவறு' : 'INCORRECT'}</span>
                    </>
                  )}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-3">
                {isTamil ? item.questionPromptTa : item.questionPrompt}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">{isTamil ? 'உங்கள் விடை:' : 'Your Answer:'}</span>
                  <span className={`font-semibold ${item.isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {isTamil ? item.chosenTextTa : item.chosenText}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">{isTamil ? 'சரியான விடை:' : 'Correct Answer:'}</span>
                  <span className="font-semibold text-emerald-300">
                    {isTamil ? item.correctTextTa : item.correctText}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-cyan-400 font-bold uppercase text-[10px]">
                    {isTamil ? 'தர்க்க விளக்கம்' : 'Deductive Logic & Explanation'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenAIAssistant(`${item.questionPrompt} (${item.explanation})`)}
                    className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200 font-bold cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isTamil ? 'AI விளக்கம்' : 'Ask AI Coach'}</span>
                  </button>
                </div>
                <p>{isTamil ? item.explanationTa : item.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => handleStartGame(difficulty)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isTamil ? 'புதிய சுற்று விளையாடு' : 'Try Another Quiz'}</span>
          </button>
          <button
            type="button"
            onClick={() => setGameState('select')}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold transition-all cursor-pointer"
          >
            {isTamil ? 'நிலை தேர்வு' : 'Choose Level'}
          </button>
        </div>
      </div>
    );
  }

  // PLAYING STATE
  const isAnswered = selectedOption !== null || showExplanation;
  const timerPercentage = Math.round((timeLeft / maxTimeForLevel) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Top HUD: Level, Progress, Countdown Timer, Score */}
      <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-slate-950/90 border border-blue-500/30 shadow-[0_0_15px_rgba(0,102,255,0.15)]">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black uppercase bg-blue-500/20 text-cyan-300 border border-cyan-400/40">
            {difficulty}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {currentIndex + 1} / {filteredQuestions.length}
          </span>
        </div>

        {/* Countdown Timer with glowing ring */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-cyan-400/30">
            <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
            <span className={`font-mono font-bold text-sm ${timeLeft <= 10 ? 'text-rose-400' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
          {streak >= 2 && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
              <span>{streak}x Streak</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">{isTamil ? 'மதிப்பெண்:' : 'Score:'}</span>
          <span className="text-base sm:text-lg font-black text-white font-mono text-cyan-300">
            {score}
          </span>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div
          className={`h-full transition-all duration-1000 ${
            timeLeft <= 10 ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
          }`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-[#080d1a] border border-blue-500/30 shadow-[0_0_25px_rgba(0,102,255,0.2)] space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                {isTamil ? currentQ.titleTa : currentQ.title}
              </span>
              <button
                type="button"
                onClick={() => speech.speak(isTamil ? currentQ.promptTa : currentQ.prompt, isTamil ? 'ta' : 'en')}
                className="p-1 px-2 rounded-lg bg-blue-500/20 text-cyan-300 hover:bg-blue-500/30 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                title="Voice Reading (Web Speech API)"
              >
                <Volume2 className="w-3 h-3" />
                <span>{isTamil ? 'வாசி' : 'Listen'}</span>
              </button>

              <button
                type="button"
                disabled={isAnswered || hintTier >= 3}
                onClick={handleRequestHint}
                className="p-1 px-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-mono flex items-center gap-1 cursor-pointer disabled:opacity-40"
                title="Progressive Hint System (Clue -> 50/50 -> Max Clue)"
              >
                <span>💡</span>
                <span>
                  {hintTier === 0
                    ? isTamil
                      ? 'குறிப்பு'
                      : 'Hint'
                    : hintTier === 1
                    ? isTamil
                      ? '50/50 நீக்கு'
                      : '50/50 Elimination'
                    : isTamil
                    ? 'முழு குறிப்பு'
                    : 'Max Clue'}
                </span>
              </button>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {isTamil ? currentQ.promptTa : currentQ.prompt}
            </h2>
          </div>
          {currentQ.visualEmoji && (
            <span className="text-3xl p-2.5 rounded-2xl bg-blue-950/60 border border-blue-500/30 shrink-0">
              {currentQ.visualEmoji}
            </span>
          )}
        </div>

        {/* Progressive Hint Display */}
        {hintTier >= 1 && !showExplanation && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5 animate-fade-in font-mono shadow-inner">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">
                {isTamil ? `நிலை ${hintTier} முற்போக்கு குறிப்பு` : `Tier ${hintTier} Progressive Cognitive Hint`}
              </div>
              <div className="text-slate-200 text-xs">{isTamil ? currentQ.cognitiveTipTa : currentQ.cognitiveTip}</div>
              {hintTier >= 2 && (
                <div className="text-[11px] text-cyan-300 font-sans font-semibold">
                  {isTamil ? '🎯 தவறான விருப்பங்கள் நீக்கப்பட்டுள்ளன.' : '🎯 Incorrect options eliminated to assist your logic.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isEliminated = eliminatedOptions.includes(opt.id);
            let btnStyle = 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-cyan-400/60 hover:bg-slate-800/80';

            if (isEliminated && !isAnswered) {
              btnStyle = 'opacity-35 line-through bg-slate-950/60 border-slate-900 text-slate-500 cursor-not-allowed';
            } else if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400';
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.35)]';
              } else {
                btnStyle = 'opacity-50 bg-slate-900/60 border-slate-800 text-slate-400';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isAnswered || isEliminated}
                onClick={() => handleOptionSelect(opt.id)}
                className={`w-full p-4 rounded-2xl border text-left font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
              >
                <span className="text-sm sm:text-base font-semibold">
                  {isTamil ? opt.textTa : opt.text}
                </span>
                {isAnswered && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !opt.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Explanation Panel */}
        {showExplanation && (
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-400/40 shadow-inner space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase font-mono">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>{isTamil ? 'சரியான விடைக்கான விளக்கம்' : 'Answer Explanation'}</span>
              </div>

              {/* Trigger AI Learning Assistant */}
              <button
                type="button"
                onClick={() => onOpenAIAssistant(`${currentQ.prompt} (${currentQ.explanation})`)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                title="Ask AI Assistant about this reasoning"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isTamil ? 'AI விளக்கம்' : 'Ask AI Coach'}</span>
              </button>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {isTamil ? currentQ.explanationTa : currentQ.explanation}
            </p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{isTamil ? currentQ.cognitiveTipTa : currentQ.cognitiveTip}</span>
            </div>
          </div>
        )}

        {/* Bottom Action Button */}
        {isAnswered && (
          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(0,217,255,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <span>
                {currentIndex < filteredQuestions.length - 1
                  ? isTamil
                    ? 'அடுத்த கேள்வி'
                    : 'Next Question'
                  : isTamil
                  ? 'முடிவுகளைப் பார்'
                  : 'View Results'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
