import React, { useState, useEffect } from 'react';
import { getTodayPuzzle, DAILY_PUZZLES_BANK } from '../data/dailyPuzzles';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { recordDailyCompletion, isDailyCompleted, getUserProfile, saveScoreToLeaderboard } from '../utils/storage';
import {
  Calendar,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Bot,
  Lightbulb,
  Award,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  currentLang: AppLanguage;
  onOpenAIAssistant: (context?: string) => void;
  onWin: (stats: any) => void;
}

export const DailyPuzzleGame: React.FC<Props> = ({ currentLang, onOpenAIAssistant, onWin }) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSolved, setIsSolved] = useState(() => isDailyCompleted(selectedDate));
  const [userProfile, setUserProfile] = useState(() => getUserProfile());

  const puzzle = getTodayPuzzle(selectedDate);
  const isTamil = currentLang === 'ta';

  useEffect(() => {
    setIsSolved(isDailyCompleted(selectedDate));
    setSelectedOption(null);
    setShowExplanation(isDailyCompleted(selectedDate));
    setShowHint(false);
  }, [selectedDate]);

  const handleSelectOption = (optId: string) => {
    if (selectedOption !== null || isSolved) return;

    setSelectedOption(optId);
    const chosen = puzzle.options.find((o) => o.id === optId);
    const isCorrect = Boolean(chosen?.isCorrect);

    if (isCorrect) {
      sound.playFanfare();
      triggerConfetti();
      setIsSolved(true);
      setShowExplanation(true);

      const streak = recordDailyCompletion(selectedDate, puzzle.bonusPoints);
      setUserProfile(getUserProfile());

      saveScoreToLeaderboard({
        playerName: userProfile.playerName || 'Player 1',
        mode: 'daily',
        difficulty: 'medium',
        score: puzzle.bonusPoints,
        iqEstimate: 125,
        timeSeconds: 45,
        accuracy: 100,
        notes: `Daily Brain Puzzle (${selectedDate}) Solved`,
      });

      onWin({
        mode: 'daily',
        difficulty: 'medium',
        score: puzzle.bonusPoints,
        iqEstimate: 125,
        timeSeconds: 45,
        accuracy: 100,
        title: `Daily Puzzle · ${puzzle.title}`,
      });
    } else {
      sound.playError();
      setShowExplanation(true);
    }
  };

  const handleDayShift = (delta: number) => {
    sound.playClick(450);
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + delta);
    setSelectedDate(curr.toISOString().split('T')[0]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Daily Header Banner */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-[#0a142e] via-[#060a17] to-[#040812] border border-cyan-400/30 shadow-[0_0_25px_rgba(0,217,255,0.2)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedDate}</span>
              </span>
              {userProfile.dailyStreak ? (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                  <span>{userProfile.dailyStreak} {isTamil ? 'நாள் தொடர்' : 'Day Streak'}</span>
                </span>
              ) : null}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isTamil ? puzzle.titleTa : puzzle.title}
            </h2>
          </div>

          {/* Date Selector Navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDayShift(-1)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-300 px-2">
              {isTamil ? 'நாள்' : 'Day'} #{puzzle.dayNumber}
            </span>
            <button
              type="button"
              onClick={() => handleDayShift(1)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Puzzle Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#070b14] border border-blue-500/30 shadow-[0_0_20px_rgba(0,102,255,0.15)] space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-cyan-400 font-bold tracking-wider">
              {isTamil ? 'தினசரி தர்க்க புதிர்' : 'Daily Logic Challenge'}
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">
              +{puzzle.bonusPoints} {isTamil ? 'புள்ளிகள்' : 'Points'}
            </span>
          </div>

          <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
            {isTamil ? puzzle.promptTa : puzzle.prompt}
          </p>
        </div>

        {/* Clue button */}
        {!isSolved && (
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick(440);
                setShowHint((h) => !h);
              }}
              className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? (isTamil ? 'குறிப்பை மறை' : 'Hide Hint') : (isTamil ? '💡 குறிப்பு தேவைப்படுகிறதா?' : '💡 Need a Hint?')}</span>
            </button>
          </div>
        )}

        {showHint && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs leading-relaxed animate-fade-in">
            {isTamil ? puzzle.hintTa : puzzle.hint}
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {puzzle.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            let btnStyle = 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-cyan-400/50 hover:bg-slate-800';

            if (selectedOption !== null || isSolved) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400';
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
              } else {
                btnStyle = 'opacity-40 bg-slate-900/60 border-slate-800 text-slate-400';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={selectedOption !== null || isSolved}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full p-4 rounded-2xl border text-left font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
              >
                <span className="text-sm font-semibold">
                  {isTamil ? opt.textTa : opt.text}
                </span>
                {(selectedOption !== null || isSolved) && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isSelected && !opt.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Explanation */}
        {showExplanation && (
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-400/40 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase font-mono">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>{isTamil ? 'சரியான விடை & முழு தர்க்கம்' : 'Full Deductive Reasoning'}</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenAIAssistant(`${puzzle.title}: ${puzzle.prompt}\nSolution: ${puzzle.explanation}`)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isTamil ? 'AI ஆலோசனை' : 'Ask AI Tutor'}</span>
              </button>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {isTamil ? puzzle.explanationTa : puzzle.explanation}
            </p>

            {isSolved && (
              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {isTamil
                    ? 'வாழ்த்துகள்! இன்றைய புதிர் தீர்க்கப்பட்டு மதிப்பெண்கள் சேர்க்கப்பட்டன.'
                    : 'Congratulations! Today’s daily challenge has been mastered.'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
