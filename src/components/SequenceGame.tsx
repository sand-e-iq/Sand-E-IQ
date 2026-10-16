import React, { useState, useEffect } from 'react';
import { Difficulty, SequencePuzzle } from '../types/game';
import { SEQUENCE_PUZZLES } from '../data/sequencePuzzles';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { calculateIQEstimate, saveScoreToLeaderboard } from '../utils/storage';
import { loadSequenceSession, saveSequenceSession, clearSession } from '../utils/gameSessionStorage';
import { Clock, Zap, ChevronRight, CheckCircle2, XCircle, Sparkles, BookmarkCheck } from 'lucide-react';

interface Props {
  onWin: (stats: {
    mode: 'sequence';
    difficulty: Difficulty;
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  }) => void;
}

export const SequenceGame: React.FC<Props> = ({ onWin }) => {
  const initialSaved = React.useMemo(() => loadSequenceSession(), []);

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

  const available = SEQUENCE_PUZZLES.filter(
    (p) => p.difficulty === difficulty || difficulty === 'master'
  );
  const currentPuzzle = available[puzzleIndex % available.length] || SEQUENCE_PUZZLES[0];

  // Save session continuously & on exit
  useEffect(() => {
    saveSequenceSession({
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
      saveSequenceSession({
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
    sound.playClick(500);
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered) return;

    const correct = selectedOption === currentPuzzle.correctIndex;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playFanfare();
      triggerConfetti();
      setStreak((prev) => prev + 1);

      const { iq, score } = calculateIQEstimate(difficulty, timeElapsed, 100, 'sequence');

      saveScoreToLeaderboard({
        playerName: 'Player 1',
        mode: 'sequence',
        difficulty,
        score,
        iqEstimate: iq,
        timeSeconds: timeElapsed,
        accuracy: 100,
        notes: `Sequence: ${currentPuzzle.title}`,
      });

      onWin({
        mode: 'sequence',
        difficulty,
        score,
        iqEstimate: iq,
        timeSeconds: timeElapsed,
        accuracy: 100,
        title: currentPuzzle.title,
      });
    } else {
      sound.playBuzzer();
      setStreak(0);
    }
  };

  const handleNext = () => {
    sound.playClick(480);
    setPuzzleIndex((prev) => (prev + 1) % available.length);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setTimeElapsed(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 w-full min-w-0">
      {/* Sequence Continuity Notification */}
      {isResumedBanner && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Resumed previous sequence: {difficulty.toUpperCase()} #{puzzleIndex + 1} ({streak} streak)
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSession('sequence');
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
            Restart from Puzzle 1
          </button>
        </div>
      )}

      {/* Top HUD */}
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

      {/* Main Sequence Card */}
      <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Cognitive Series · {currentPuzzle.domain}
          </span>
          <h2 className="text-xl font-bold text-white mt-1">{currentPuzzle.title}</h2>
          <p className="text-xs text-slate-400 mt-1">{currentPuzzle.prompt}</p>
        </div>

        {/* Visual Sequence Cards */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 py-6 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
          {currentPuzzle.sequence.map((item, idx) => {
            const isMissing = item === '?';
            return (
              <div
                key={idx}
                className={`w-14 h-16 sm:w-16 sm:h-20 rounded-xl flex items-center justify-center font-mono font-bold text-lg sm:text-xl transition-all shadow-md ${
                  isMissing
                    ? 'border-2 border-dashed border-cyan-400 bg-cyan-950/20 text-cyan-400 animate-pulse'
                    : 'border border-slate-800 bg-slate-900 text-slate-100'
                }`}
              >
                {isMissing && isAnswered && selectedOption !== null
                  ? currentPuzzle.options[selectedOption]
                  : item}
              </div>
            );
          })}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {currentPuzzle.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let btnStyle = 'border-slate-800 bg-slate-900/80 text-slate-200 hover:border-slate-700';

            if (isSelected) {
              btnStyle = 'border-cyan-400 bg-cyan-950/40 text-cyan-300 ring-2 ring-cyan-400/30';
            }
            if (isAnswered) {
              if (idx === currentPuzzle.correctIndex) {
                btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'border-rose-500 bg-rose-950/40 text-rose-300';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-xl border font-mono font-bold text-lg transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${btnStyle}`}
              >
                <span>{opt}</span>
                <span className="text-[10px] font-sans font-normal text-slate-500">Option {idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        {!isAnswered ? (
          <button
            type="button"
            disabled={selectedOption === null}
            onClick={handleSubmit}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <span>Evaluate Hypothesis</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md"
          >
            <span>Proceed to Next Series</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Explanation */}
        {isAnswered && (
          <div className={`p-5 rounded-2xl border transition-all ${
            isCorrect
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-semibold text-sm mb-1.5">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Correct Sequence Deduction</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-300">Incorrect Selection</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currentPuzzle.ruleExplanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
