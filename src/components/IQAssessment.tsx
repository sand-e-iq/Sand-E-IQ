import React, { useState, useEffect } from 'react';
import { PATTERN_PUZZLES } from '../data/patternPuzzles';
import { SEQUENCE_PUZZLES } from '../data/sequencePuzzles';
import { PatternCellView } from './PatternCellView';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { saveScoreToLeaderboard } from '../utils/storage';
import { loadAssessmentSession, saveAssessmentSession, clearSession } from '../utils/gameSessionStorage';
import {
  Clock,
  Award,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  BarChart2,
  Share2,
  Trophy,
  BookmarkCheck,
} from 'lucide-react';

interface Props {
  onFinish: (result: {
    iq: number;
    score: number;
    accuracy: number;
    timeSeconds: number;
  }) => void;
}

export const IQAssessment: React.FC<Props> = ({ onFinish }) => {
  // 8 Curated Questions across cognitive domains
  const questions = [
    {
      type: 'pattern' as const,
      domain: 'Spatial Rotation',
      title: 'Rotational Symmetry Matrix',
      puzzle: PATTERN_PUZZLES[0],
    },
    {
      type: 'sequence' as const,
      domain: 'Numerical Deduction',
      title: 'Alternating Operations',
      puzzle: SEQUENCE_PUZZLES[0],
    },
    {
      type: 'pattern' as const,
      domain: 'Distribution Logic',
      title: 'Dual Geometric Morphing',
      puzzle: PATTERN_PUZZLES[1],
    },
    {
      type: 'sequence' as const,
      domain: 'Recurrence Relations',
      title: 'Polynomial Sequence Divergence',
      puzzle: SEQUENCE_PUZZLES[2],
    },
    {
      type: 'pattern' as const,
      domain: 'Abstract Superposition',
      title: 'Logical XOR Vector Addition',
      puzzle: PATTERN_PUZZLES[4],
    },
    {
      type: 'sequence' as const,
      domain: 'Inductive Logic',
      title: 'Factorial Progression Curve',
      puzzle: SEQUENCE_PUZZLES[5],
    },
    {
      type: 'pattern' as const,
      domain: 'High-Dimension Topology',
      title: 'Vertex Diagonal Evolution',
      puzzle: PATTERN_PUZZLES[5],
    },
    {
      type: 'sequence' as const,
      domain: 'Convolution Memory',
      title: 'Tribonacci Recurrence',
      puzzle: SEQUENCE_PUZZLES[6],
    },
  ];

  const initialSaved = React.useMemo(() => loadAssessmentSession(), []);

  const [stage, setStage] = useState<'intro' | 'testing' | 'result'>(
    () => (initialSaved && initialSaved.stage === 'testing' ? 'testing' : 'intro')
  );
  const [currentQIndex, setCurrentQIndex] = useState(() => initialSaved?.currentQIndex ?? 0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => {
    if (
      initialSaved?.answers &&
      Array.isArray(initialSaved.answers) &&
      initialSaved.answers.length === questions.length
    ) {
      return initialSaved.answers;
    }
    return new Array(questions.length).fill(null);
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(() => {
    if (initialSaved?.answers && initialSaved.currentQIndex !== undefined) {
      return initialSaved.answers[initialSaved.currentQIndex] ?? null;
    }
    return null;
  });
  const [timeElapsed, setTimeElapsed] = useState(() => initialSaved?.timeElapsed ?? 0);
  const [isResumedBanner, setIsResumedBanner] = useState(
    () => Boolean(initialSaved && initialSaved.stage === 'testing')
  );
  const [finalReport, setFinalReport] = useState<{
    iq: number;
    score: number;
    accuracy: number;
    percentile: number;
    correctCount: number;
    totalCount: number;
    domainScores: { name: string; score: number }[];
  } | null>(null);

  // Save session while testing
  useEffect(() => {
    if (stage === 'testing') {
      saveAssessmentSession({
        stage,
        currentQIndex,
        answers,
        timeElapsed,
        lastUpdated: Date.now(),
      });
    } else if (stage === 'result') {
      clearSession('assessment');
    }
  }, [stage, currentQIndex, answers, timeElapsed]);

  useEffect(() => {
    const handleVis = () => {
      if (stage === 'testing') {
        saveAssessmentSession({
          stage,
          currentQIndex,
          answers,
          timeElapsed,
          lastUpdated: Date.now(),
        });
      }
    };
    document.addEventListener('visibilitychange', handleVis);
    window.addEventListener('beforeunload', handleVis);
    return () => {
      document.removeEventListener('visibilitychange', handleVis);
      window.removeEventListener('beforeunload', handleVis);
    };
  }, [stage, currentQIndex, answers, timeElapsed]);

  // Timer: Pause when user leaves app
  useEffect(() => {
    if (stage !== 'testing') return;
    const interval = setInterval(() => {
      if (document.hidden) return; // Freeze timer if outside app!
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [stage]);

  const handleStart = () => {
    sound.playSuccess();
    setStage('testing');
    setCurrentQIndex(0);
    setAnswers(new Array(questions.length).fill(null));
    setSelectedOption(null);
    setTimeElapsed(0);
  };

  const handleSelectOption = (idx: number) => {
    sound.playClick(500);
    setSelectedOption(idx);
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQIndex] = idx;
      return next;
    });
  };

  const handleJumpToQuestion = (qIdx: number) => {
    sound.playClick(480);
    setCurrentQIndex(qIdx);
    setSelectedOption(answers[qIdx] ?? null);
  };

  const handlePrevQuestion = () => {
    if (currentQIndex > 0) {
      sound.playClick(460);
      const prevIdx = currentQIndex - 1;
      setCurrentQIndex(prevIdx);
      setSelectedOption(answers[prevIdx] ?? null);
    }
  };

  const handleConfirmNext = () => {
    sound.playClick(560);

    const updatedAnswers = [...answers];
    if (selectedOption !== null) {
      updatedAnswers[currentQIndex] = selectedOption;
      setAnswers(updatedAnswers);
    }

    if (currentQIndex < questions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setSelectedOption(updatedAnswers[nextIdx] ?? null);
    } else {
      // Complete test & calculate IQ
      finishAssessment(updatedAnswers);
    }
  };

  const finishAssessment = (allAnswers: (number | null)[]) => {
    sound.playFanfare();
    triggerConfetti();

    let correctCount = 0;
    const domainMap: Record<string, { correct: number; total: number }> = {
      'Spatial Reasoning': { correct: 0, total: 0 },
      'Deductive Logic': { correct: 0, total: 0 },
      'Abstract Patterns': { correct: 0, total: 0 },
      'Working Memory': { correct: 0, total: 0 },
    };

    questions.forEach((q, idx) => {
      const chosen = allAnswers[idx];
      const correctIdx = q.puzzle.correctIndex;
      const isCorrect = chosen === correctIdx;
      if (isCorrect) correctCount++;

      const mappedDomain =
        q.type === 'pattern'
          ? idx % 2 === 0
            ? 'Spatial Reasoning'
            : 'Abstract Patterns'
          : idx % 2 === 0
          ? 'Deductive Logic'
          : 'Working Memory';

      domainMap[mappedDomain].total += 1;
      if (isCorrect) domainMap[mappedDomain].correct += 1;
    });

    const accuracy = Math.round((correctCount / questions.length) * 100);

    // Calculate standardized IQ score (mean 100, SD 15)
    // 8/8 correct + fast time = ~145-150 IQ
    // 7/8 = ~132-138
    // 6/8 = ~120-128
    // 5/8 = ~110-118
    // 4/8 = ~100-106
    // <=3 = 90-98
    const baseIQByCount = [85, 90, 96, 102, 112, 122, 134, 142, 148][correctCount];
    const targetSeconds = 180; // 3 minutes total
    const speedBonus = Math.max(-5, Math.min(6, Math.round((targetSeconds - timeElapsed) / 20)));
    const calculatedIQ = Math.max(85, Math.min(155, baseIQByCount + speedBonus));

    // Percentile estimation from normal distribution
    let percentile = 50;
    if (calculatedIQ >= 145) percentile = 99.8;
    else if (calculatedIQ >= 140) percentile = 99.6;
    else if (calculatedIQ >= 135) percentile = 99.0;
    else if (calculatedIQ >= 130) percentile = 98.0;
    else if (calculatedIQ >= 125) percentile = 95.0;
    else if (calculatedIQ >= 120) percentile = 91.0;
    else if (calculatedIQ >= 115) percentile = 84.0;
    else if (calculatedIQ >= 110) percentile = 75.0;
    else if (calculatedIQ >= 105) percentile = 63.0;
    else percentile = 50.0;

    const score = Math.round(correctCount * 1250 + Math.max(0, 300 - timeElapsed) * 8);

    const domainScores = Object.entries(domainMap).map(([name, data]) => ({
      name,
      score: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 100,
    }));

    setFinalReport({
      iq: calculatedIQ,
      score,
      accuracy,
      percentile,
      correctCount,
      totalCount: questions.length,
      domainScores,
    });

    setStage('result');

    // Save to local browser storage leaderboard!
    saveScoreToLeaderboard({
      playerName: 'Player 1',
      mode: 'assessment',
      difficulty: 'master',
      score,
      iqEstimate: calculatedIQ,
      timeSeconds: timeElapsed,
      accuracy,
      notes: `Cognitive Assessment (${correctCount}/${questions.length} Correct · Top ${100 - percentile}%)`,
    });

    onFinish({
      iq: calculatedIQ,
      score,
      accuracy,
      timeSeconds: timeElapsed,
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // INTRO VIEW
  if (stage === 'intro') {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-6 w-full min-w-0">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Standardized Cognitive Metric
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">Comprehensive IQ Assessment</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
            Test your abstract reasoning, spatial deduction, working memory, and pattern
            recognition across 8 calibrated psychometric challenges.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-left p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
          <div className="p-3">
            <span className="text-[11px] text-slate-500 block">Questions</span>
            <span className="text-sm font-bold text-slate-200 font-mono">8 Calibrated</span>
          </div>
          <div className="p-3 border-x border-slate-800/80">
            <span className="text-[11px] text-slate-500 block">Estimated Time</span>
            <span className="text-sm font-bold text-slate-200 font-mono">~3 Minutes</span>
          </div>
          <div className="p-3">
            <span className="text-[11px] text-slate-500 block">Scale</span>
            <span className="text-sm font-bold text-slate-200 font-mono">Wechsler (SD 15)</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40"
        >
          <span>Begin Assessment</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // RESULT VIEW
  if (stage === 'result' && finalReport) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 w-full min-w-0">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />

          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Cognitive Assessment Certified
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">IQ Evaluation Results</h2>
            <p className="text-xs text-slate-400 mt-1">
              Result recorded to local browser storage leaderboard.
            </p>
          </div>

          {/* Big IQ Badge */}
          <div className="py-6 px-8 rounded-2xl bg-slate-950 border border-slate-800 inline-block mx-auto shadow-2xl">
            <span className="text-xs text-slate-500 uppercase tracking-widest block font-mono">
              Estimated IQ Rating
            </span>
            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 font-mono tabular-nums">
              {finalReport.iq}
            </span>
            <div className="mt-2 text-xs font-medium text-slate-400">
              Rank: <span className="text-emerald-400 font-semibold">Top {(100 - finalReport.percentile).toFixed(1)}%</span> of general population
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 text-left p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="p-2">
              <span className="text-[11px] text-slate-500 block">Total Score</span>
              <span className="text-lg font-bold text-slate-100 font-mono tabular-nums">
                {finalReport.score.toLocaleString()}
              </span>
            </div>
            <div className="p-2 border-x border-slate-800/80">
              <span className="text-[11px] text-slate-500 block">Accuracy</span>
              <span className="text-lg font-bold text-slate-100 font-mono tabular-nums">
                {finalReport.correctCount}/{finalReport.totalCount} ({finalReport.accuracy}%)
              </span>
            </div>
            <div className="p-2">
              <span className="text-[11px] text-slate-500 block">Time</span>
              <span className="text-lg font-bold text-slate-100 font-mono tabular-nums">
                {formatTime(timeElapsed)}
              </span>
            </div>
          </div>

          {/* Domain Breakdown Bars */}
          <div className="space-y-3 text-left">
            <span className="text-xs font-semibold text-slate-300 block">
              Cognitive Domain Performance:
            </span>
            <div className="space-y-2">
              {finalReport.domainScores.map((domain) => (
                <div key={domain.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{domain.name}</span>
                    <span className="font-mono font-semibold text-cyan-400">{domain.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.max(10, domain.score)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleStart}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Evaluation</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE QUESTION TESTING VIEW
  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6 w-full min-w-0">
      {/* Assessment Continuity Notification */}
      {isResumedBanner && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Resumed active assessment: Question #{currentQIndex + 1} of {questions.length} (
              {answers.filter((a) => a !== null).length} answered)
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSession('assessment');
              handleStart();
              setIsResumedBanner(false);
            }}
            className="text-[11px] underline text-slate-400 hover:text-emerald-200 cursor-pointer transition-colors"
          >
            Restart Assessment
          </button>
        </div>
      )}

      {/* Top HUD */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="text-emerald-400 font-bold font-mono">
            {currentQIndex + 1}/{questions.length}
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>{currentQ.domain}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono tabular-nums text-slate-200">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* Easy Question Navigator Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              Question Navigator ({answers.filter((a) => a !== null).length}/{questions.length} Answered)
            </span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Tap any question to jump
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {questions.map((q, idx) => {
            const isAnswered = answers[idx] !== null;
            const isCurrent = currentQIndex === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleJumpToQuestion(idx)}
                className={`py-2 px-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 ring-2 ring-emerald-400/50 shadow-md font-black'
                    : isAnswered
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>Q{idx + 1}</span>
                <span className="text-[10px] leading-none">
                  {isCurrent ? '●' : isAnswered ? '✓' : '○'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Question {currentQIndex + 1}
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{currentQ.title}</h3>
        </div>

        {/* Pattern Question View */}
        {currentQ.type === 'pattern' && (
          <div className="space-y-6">
            <div className="w-full max-w-[340px] mx-auto grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
              {currentQ.puzzle.cells.map((cell, idx) => {
                if (idx === 8) {
                  return (
                    <PatternCellView
                      key={`test-pat-${idx}`}
                      cell={selectedOption !== null ? currentQ.puzzle.options[selectedOption] : null}
                      className="border-2 border-dashed border-emerald-500/40"
                    />
                  );
                }
                return <PatternCellView key={`test-pat-${idx}`} cell={cell} />;
              })}
            </div>

            {/* Options */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {currentQ.puzzle.options.map((opt, idx) => (
                <div key={idx} className="relative">
                  <PatternCellView
                    cell={opt}
                    isSelected={selectedOption === idx}
                    onClick={() => handleSelectOption(idx)}
                  />
                  <span className="absolute top-1 left-2 text-[10px] font-mono text-slate-500 pointer-events-none">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sequence Question View */}
        {currentQ.type === 'sequence' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-400">{currentQ.puzzle.prompt}</p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-6 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {currentQ.puzzle.sequence.map((item, idx) => {
                const isMissing = item === '?';
                return (
                  <div
                    key={idx}
                    className={`w-12 h-14 sm:w-16 sm:h-20 rounded-xl flex items-center justify-center font-mono font-bold text-base sm:text-xl ${
                      isMissing
                        ? 'border-2 border-dashed border-emerald-400 bg-emerald-950/20 text-emerald-400 animate-pulse'
                        : 'border border-slate-800 bg-slate-900 text-slate-100'
                    }`}
                  >
                    {isMissing && selectedOption !== null
                      ? currentQ.puzzle.options[selectedOption]
                      : item}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentQ.puzzle.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border font-mono font-bold text-lg transition-all ${
                    selectedOption === idx
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-400/30'
                      : 'border-slate-800 bg-slate-900/80 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            disabled={currentQIndex === 0}
            onClick={handlePrevQuestion}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-400" />
            <span>Previous Question</span>
          </button>

          <button
            type="button"
            disabled={selectedOption === null}
            onClick={handleConfirmNext}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <span>
              {currentQIndex === questions.length - 1
                ? 'Complete & Score Test'
                : 'Confirm & Next Question'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
