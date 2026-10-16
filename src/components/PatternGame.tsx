import React, { useState, useEffect, useCallback } from 'react';
import { Difficulty, PatternPuzzle } from '../types/game';
import { AppLanguage } from '../types/i18n';
import { t } from '../utils/i18n';
import { PATTERN_PUZZLES } from '../data/patternPuzzles';
import { PatternCellView } from './PatternCellView';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { calculateIQEstimate, saveScoreToLeaderboard } from '../utils/storage';
import { loadPatternSession, savePatternSession, clearSession } from '../utils/gameSessionStorage';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  ChevronRight,
  Info,
  BookmarkCheck,
} from 'lucide-react';

interface Props {
  currentLang?: AppLanguage;
  onWin: (stats: {
    mode: 'pattern';
    difficulty: Difficulty;
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  }) => void;
}

export const PatternGame: React.FC<Props> = ({ currentLang = 'ta', onWin }) => {
  const isTa = currentLang === 'ta';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';
  const isHi = currentLang === 'hi';

  const initialSaved = React.useMemo(() => loadPatternSession(), []);

  const [difficulty, setDifficulty] = useState<Difficulty>(() => initialSaved?.difficulty ?? 'easy');
  const [puzzleIndex, setPuzzleIndex] = useState(() => initialSaved?.puzzleIndex ?? 0);
  const [selectedOption, setSelectedOption] = useState<number | null>(
    () => initialSaved?.selectedOption ?? null
  );
  const [isAnswered, setIsAnswered] = useState(() => initialSaved?.isAnswered ?? false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(() => initialSaved?.isCorrect ?? null);
  const [timeElapsed, setTimeElapsed] = useState(() => initialSaved?.timeElapsed ?? 0);
  const [streak, setStreak] = useState(() => initialSaved?.streak ?? 0);
  const [isResumedBanner, setIsResumedBanner] = useState(
    () => Boolean(initialSaved && (initialSaved.puzzleIndex > 0 || initialSaved.streak > 0))
  );

  const availablePuzzles = PATTERN_PUZZLES.filter(
    (p) => p.difficulty === difficulty || difficulty === 'master'
  );
  const currentPuzzle = availablePuzzles[puzzleIndex % availablePuzzles.length] || PATTERN_PUZZLES[0];

  // Save session continuously & on exit
  useEffect(() => {
    savePatternSession({
      difficulty,
      puzzleIndex,
      selectedOption,
      isAnswered,
      isCorrect,
      timeElapsed,
      streak,
      lastUpdated: Date.now(),
    });
  }, [difficulty, puzzleIndex, selectedOption, isAnswered, isCorrect, timeElapsed, streak]);

  useEffect(() => {
    const handleVis = () => {
      savePatternSession({
        difficulty,
        puzzleIndex,
        selectedOption,
        isAnswered,
        isCorrect,
        timeElapsed,
        streak,
        lastUpdated: Date.now(),
      });
    };
    document.addEventListener('visibilitychange', handleVis);
    window.addEventListener('beforeunload', handleVis);
    return () => {
      document.removeEventListener('visibilitychange', handleVis);
      window.removeEventListener('beforeunload', handleVis);
    };
  }, [difficulty, puzzleIndex, selectedOption, isAnswered, isCorrect, timeElapsed, streak]);

  // Timer: Pause when outside the app
  useEffect(() => {
    if (isAnswered) return;
    const interval = setInterval(() => {
      if (document.hidden) return; // Freeze timer if outside app!
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isAnswered]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    sound.playClick(520);
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;

    const correct = selectedOption === currentPuzzle.correctIndex;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playFanfare();
      triggerConfetti();
      setStreak((prev) => prev + 1);

      const accuracy = 100;
      const { iq, score } = calculateIQEstimate(difficulty, timeElapsed, accuracy, 'pattern');

      saveScoreToLeaderboard({
        playerName: 'Player 1',
        mode: 'pattern',
        difficulty,
        score,
        iqEstimate: iq,
        timeSeconds: timeElapsed,
        accuracy,
        notes: `Pattern Matrix: ${currentPuzzle.title}`,
      });

      onWin({
        mode: 'pattern',
        difficulty,
        score,
        iqEstimate: iq,
        timeSeconds: timeElapsed,
        accuracy,
        title: currentPuzzle.title,
      });
    } else {
      sound.playBuzzer();
      setStreak(0);
    }
  };

  const handleNextPuzzle = () => {
    sound.playClick(480);
    setPuzzleIndex((prev) => (prev + 1) % availablePuzzles.length);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setTimeElapsed(0);
  };

  // Keyboard numbers 1-6
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) {
        if (e.key === 'Enter') handleNextPuzzle();
        return;
      }
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 6) {
        handleSelectOption(num - 1);
      } else if (e.key === 'Enter' && selectedOption !== null) {
        handleSubmitAnswer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, selectedOption]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 w-full min-w-0">
      {/* Pattern Matrix Continuity Notification */}
      {isResumedBanner && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              {isTa
                ? `முந்தைய பேட்டர்ன் தொடர்கிறது: நிலை ${t(difficulty, currentLang)} #${puzzleIndex + 1} (${streak} தொடர் வெற்றிகள்)`
                : `Resumed previous pattern matrix: ${t(difficulty, currentLang)} #${puzzleIndex + 1} (${streak} streak)`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSession('pattern');
              setPuzzleIndex(0);
              setSelectedOption(null);
              setIsAnswered(false);
              setIsCorrect(null);
              setTimeElapsed(0);
              setStreak(0);
              setIsResumedBanner(false);
            }}
            className="text-[11px] underline text-slate-400 hover:text-cyan-200 cursor-pointer transition-colors"
          >
            {isTa ? 'முதல் புதிரிலிருந்து தொடங்க' : 'Restart from Puzzle 1'}
          </button>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
          {(['easy', 'medium', 'hard', 'master'] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                sound.playClick(440);
                setDifficulty(d);
                setPuzzleIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setIsCorrect(null);
                setTimeElapsed(0);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
                difficulty === d
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono tabular-nums text-slate-200">{formatTime(timeElapsed)}</span>
          </div>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono tabular-nums text-slate-200">Streak: {streak}</span>
          </div>
        </div>
      </div>

      {/* Main Puzzle Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Matrix Grid (3x3) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div>
              <span className="text-xs text-cyan-400 font-mono uppercase tracking-wider">
                Raven Matrix · {currentPuzzle.category}
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">{currentPuzzle.title}</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Pattern {puzzleIndex + 1}/{availablePuzzles.length}
            </span>
          </div>

          {/* 3x3 Grid */}
          <div className="w-full max-w-[380px] grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
            {currentPuzzle.cells.map((cell, idx) => {
              if (idx === 8) {
                // The missing cell
                const displayCell = isAnswered && selectedOption !== null
                  ? currentPuzzle.options[selectedOption]
                  : null;

                return (
                  <PatternCellView
                    key={`matrix-cell-${idx}`}
                    cell={displayCell}
                    isCorrect={isAnswered ? isCorrect : null}
                    className="border-2 border-dashed border-cyan-500/50"
                  />
                );
              }

              return (
                <PatternCellView
                  key={`matrix-cell-${idx}`}
                  cell={cell}
                />
              );
            })}
          </div>

          <p className="mt-4 text-xs text-slate-500 text-center">
            Identify the governing law across rows and columns to determine the 9th element.
          </p>
        </div>

        {/* Options & Analysis */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Select Missing Element:</span>
              <span className="text-[11px] text-slate-500">Keys 1–6</span>
            </div>

            {/* 6 candidate options in 3x2 grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {currentPuzzle.options.map((opt, idx) => (
                <div key={`opt-${idx}`} className="relative group">
                  <PatternCellView
                    cell={opt}
                    isSelected={selectedOption === idx}
                    isCorrect={
                      isAnswered
                        ? idx === currentPuzzle.correctIndex
                          ? true
                          : idx === selectedOption
                          ? false
                          : null
                        : null
                    }
                    onClick={() => handleSelectOption(idx)}
                  />
                  <div className="absolute top-1 left-2 text-[10px] font-mono text-slate-500 group-hover:text-slate-300 pointer-events-none">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit / Next Action */}
            {!isAnswered ? (
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                <span>{isTa ? 'பதிலை உறுதிசெய்' : isFr ? 'Confirmer' : isEs ? 'Confirmar' : isHi ? 'उत्तर की पुष्टि करें' : 'Confirm Selection'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextPuzzle}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md"
              >
                <span>{isTa ? 'அடுத்த வடிவ புதிர்' : isFr ? 'Motif Suivant' : isEs ? 'Siguiente Patrón' : isHi ? 'अगला पैटर्न' : 'Next Progressive Pattern'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Logical Deduction Explanation */}
          {isAnswered && (
            <div className={`p-5 rounded-2xl border transition-all ${
              isCorrect
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-semibold text-sm mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">
                      {isTa ? 'சரியான தர்க்க முடிவு (+புள்ளிகள்)!' : 'Deduction Verified (+Score)'}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-300">
                      {isTa ? 'தவறான தேர்வு! மீண்டும் கவனியுங்கள்' : 'Incorrect Hypothesis'}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-serif">
                {currentPuzzle.ruleExplanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
