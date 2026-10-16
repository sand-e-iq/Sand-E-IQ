import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { saveScoreToLeaderboard, getUserProfile, unlockAchievement } from '../utils/storage';
import {
  Brain,
  Heart,
  RotateCcw,
  Sparkles,
  Zap,
  Bot,
  Trophy,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  currentLang: AppLanguage;
  onWin: (stats: any) => void;
  onOpenAIAssistant: (context?: string) => void;
}

export const MemoryMatrixGame: React.FC<Props> = ({ currentLang, onWin, onOpenAIAssistant }) => {
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'memorize' | 'recall' | 'gameover'>('intro');
  const [gridSize, setGridSize] = useState(3);
  const [targetTiles, setTargetTiles] = useState<number[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [wrongTiles, setWrongTiles] = useState<number[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const isTamil = currentLang === 'ta';

  // Determine grid size and tile count for current level
  const getLevelConfig = (lvl: number) => {
    if (lvl <= 2) return { size: 3, tilesCount: 3 };
    if (lvl <= 4) return { size: 3, tilesCount: 4 };
    if (lvl <= 6) return { size: 4, tilesCount: 5 };
    if (lvl <= 8) return { size: 4, tilesCount: 6 };
    if (lvl <= 10) return { size: 5, tilesCount: 7 };
    return { size: 5, tilesCount: 8 };
  };

  const startLevel = (nextLevel: number) => {
    const config = getLevelConfig(nextLevel);
    setGridSize(config.size);
    setSelectedTiles([]);
    setWrongTiles([]);

    const totalCells = config.size * config.size;
    const targets: number[] = [];
    while (targets.length < config.tilesCount) {
      const rand = Math.floor(Math.random() * totalCells);
      if (!targets.includes(rand)) {
        targets.push(rand);
      }
    }

    setTargetTiles(targets);
    setGameState('memorize');

    // Display for memorization window
    const duration = Math.max(1200, 2200 - nextLevel * 80);
    setTimeout(() => {
      setGameState('recall');
    }, duration);
  };

  const handleStartGame = () => {
    sound.playSuccess();
    setLevel(1);
    setLives(3);
    setScore(0);
    setTimeElapsed(0);
    startLevel(1);
  };

  // Timer while playing
  useEffect(() => {
    if (gameState === 'intro' || gameState === 'gameover') return;
    const interval = setInterval(() => {
      setTimeElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const handleCellClick = (index: number) => {
    if (gameState !== 'recall') return;
    if (selectedTiles.includes(index) || wrongTiles.includes(index)) return;

    if (targetTiles.includes(index)) {
      sound.playClick(650);
      const nextSelected = [...selectedTiles, index];
      setSelectedTiles(nextSelected);

      // Check if all targets found
      if (nextSelected.length === targetTiles.length) {
        sound.playSuccess();
        const earned = level * 600 + 200;
        const newScore = score + earned;
        setScore(newScore);

        if (level >= 6) {
          unlockAchievement('memory_prodigy');
        }

        setTimeout(() => {
          setLevel((l) => l + 1);
          startLevel(level + 1);
        }, 600);
      }
    } else {
      sound.playError();
      const nextWrong = [...wrongTiles, index];
      setWrongTiles(nextWrong);
      const remainingLives = lives - 1;
      setLives(remainingLives);

      if (remainingLives <= 0) {
        handleGameOver();
      }
    }
  };

  const handleGameOver = () => {
    setGameState('gameover');
    sound.playError();
    const profile = getUserProfile();

    saveScoreToLeaderboard({
      playerName: profile.playerName || 'Player 1',
      mode: 'memory',
      difficulty: level > 5 ? 'hard' : 'medium',
      score,
      iqEstimate: Math.min(145, 95 + level * 5),
      timeSeconds: timeElapsed,
      accuracy: Math.round((level / (level + 2)) * 100),
      notes: `Memory Matrix reached Level ${level}`,
    });

    onWin({
      mode: 'memory',
      difficulty: level > 5 ? 'hard' : 'medium',
      score,
      iqEstimate: Math.min(145, 95 + level * 5),
      timeSeconds: timeElapsed,
      accuracy: Math.round((level / (level + 2)) * 100),
      title: `Spatial Memory Matrix (Level ${level})`,
    });
  };

  if (gameState === 'intro') {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#070d1d] border border-cyan-400/30 shadow-[0_0_30px_rgba(0,217,255,0.2)] text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-3xl">
          🧠
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-bold">
            Sand.E IQ · Neuro-Agility
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isTamil ? 'நினைவாற்றல் கட்ட ஆட்டம்' : 'Spatial Memory Matrix'}
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            {isTamil
              ? 'ஒளிரும் நியான் சியான் கட்டங்களை நினைவில் வைத்துக்கொண்டு, அவை மறைந்த பிறகு சரியான இடங்களைத் தொட்டு வெற்றி பெறுங்கள்.'
              : 'Memorize the flashing neon cyan tiles. Once they vanish, recall and tap their exact coordinates to expand working memory capacity.'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400">{isTamil ? 'தொடக்க நிலை' : 'Starting'}</span>
            <div className="text-sm font-bold text-white">3x3 Matrix</div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400">{isTamil ? 'உயிர்கள்' : 'Lives'}</span>
            <div className="text-sm font-bold text-rose-400">3 Chances</div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400">{isTamil ? 'உச்ச நிலை' : 'Max Scale'}</span>
            <div className="text-sm font-bold text-cyan-400">5x5 Grid</div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartGame}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base shadow-[0_0_25px_rgba(0,217,255,0.4)] transition-all cursor-pointer"
        >
          {isTamil ? 'ஆட்டத்தைத் தொடங்கு' : 'Start Memory Challenge'}
        </button>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-slate-950 border border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.25)] text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400 text-3xl">
          💥
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">
            {isTamil ? 'ஆட்டம் நிறைவடைந்தது' : 'Memory Round Ended'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isTamil ? `நீங்கள் நிலை ${level}-ஐ எட்டினீர்கள்!` : `You reached Level ${level}!`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400">{isTamil ? 'மதிப்பெண்' : 'Score'}</span>
            <div className="text-xl font-black text-white">{score}</div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400">{isTamil ? 'நிலை' : 'Level'}</span>
            <div className="text-xl font-black text-cyan-400">{level}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleStartGame}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all cursor-pointer"
          >
            {isTamil ? 'மீண்டும் தொடங்கு' : 'Try Again'}
          </button>
          <button
            type="button"
            onClick={() => onOpenAIAssistant('Can you give me techniques to improve visual spatial memory on the Memory Matrix?')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{isTamil ? 'AI நினைவாற்றல் குறிப்புகள்' : 'Ask AI Memory Coach'}</span>
          </button>
        </div>
      </div>
    );
  }

  // PLAYING / RECALL STATE
  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* HUD Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/90 border border-blue-500/30">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            {isTamil ? 'நிலை' : 'Level'} {level}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {targetTiles.length} {isTamil ? 'கட்டங்கள்' : 'Tiles'}
          </span>
        </div>

        {/* Lives hearts */}
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className={`w-4 h-4 transition-colors ${
                i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="text-right">
          <span className="text-base font-black text-cyan-400 font-mono">{score}</span>
        </div>
      </div>

      {/* Status banner */}
      <div className="text-center py-1">
        {gameState === 'memorize' ? (
          <span className="text-xs font-mono uppercase text-cyan-300 font-bold tracking-widest animate-pulse">
            👀 {isTamil ? 'கட்டங்களை நினைவில் வையுங்கள்...' : 'Memorize Lit Tiles...'}
          </span>
        ) : (
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-widest">
            🎯 {isTamil ? 'சரியான கட்டங்களைத் தொடவும்!' : 'Recall & Tap Coordinates!'} ({selectedTiles.length}/{targetTiles.length})
          </span>
        )}
      </div>

      {/* Matrix Grid */}
      <div
        className="p-4 sm:p-6 rounded-3xl bg-slate-950 border border-blue-500/30 shadow-[0_0_25px_rgba(0,102,255,0.2)] mx-auto"
        style={{ maxWidth: '420px' }}
      >
        <div
          className="grid gap-2.5 sm:gap-3"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {[...Array(gridSize * gridSize)].map((_, idx) => {
            const isTarget = targetTiles.includes(idx);
            const isSelected = selectedTiles.includes(idx);
            const isWrong = wrongTiles.includes(idx);

            let cellClass = 'bg-slate-900 border-slate-800 hover:border-slate-700';

            if (gameState === 'memorize' && isTarget) {
              cellClass = 'bg-cyan-400 border-cyan-300 shadow-[0_0_20px_rgba(0,217,255,0.8)] scale-95';
            } else if (isSelected) {
              cellClass = 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.7)] scale-95';
            } else if (isWrong) {
              cellClass = 'bg-rose-600 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.7)] scale-95 animate-shake';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={gameState !== 'recall' || isSelected || isWrong}
                onClick={() => handleCellClick(idx)}
                className={`aspect-square rounded-2xl border transition-all duration-200 cursor-pointer ${cellClass}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
