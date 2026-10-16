import React from 'react';
import { Difficulty, GameMode } from '../types/game';
import { Trophy, CheckCircle2, ArrowRight, RotateCcw, Clock, Award, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPlayNext: () => void;
  onOpenLeaderboard: () => void;
  stats: {
    mode: GameMode;
    difficulty: Difficulty;
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  } | null;
}

export const WinModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onPlayNext,
  onOpenLeaderboard,
  stats,
}) => {
  if (!isOpen || !stats) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400" />

        <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            {stats.mode === 'child' ? '⭐ Star Achieved!' : 'Deduction Complete'}
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            {stats.mode === 'child' ? 'Super Job, Genius!' : 'Puzzle Solved!'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{stats.title}</p>
        </div>

        {/* Big Score Callout */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-xs font-mono text-slate-500 uppercase">
            {stats.mode === 'child' ? 'Junior IQ Rating' : 'Estimated IQ Rating'}
          </span>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 font-mono mt-1">
            {stats.iqEstimate}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Score: <strong className="text-slate-100 font-mono">{stats.score.toLocaleString()}</strong> pts
          </span>
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Solve Time</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-sm font-bold text-slate-200 font-mono">
                {formatTime(stats.timeSeconds)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Precision</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm font-bold text-slate-200 font-mono">
                {stats.accuracy}%
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          ✓ High score automatically saved to your local browser storage.
        </p>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick(500);
              onPlayNext();
            }}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Play Next Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick(440);
              onOpenLeaderboard();
            }}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>View on Local Leaderboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
