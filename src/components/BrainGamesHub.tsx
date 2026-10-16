import React, { useState, useEffect, useRef } from 'react';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import {
  Brain,
  RotateCcw,
  Zap,
  Clock,
  Trophy,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  HelpCircle,
  Hash,
  Shapes,
  Eye,
  Activity,
  Calculator,
  Grid2X2,
} from 'lucide-react';

export type BrainGameKey =
  | 'memory_cards'
  | 'number_sequence'
  | 'pattern_recognition'
  | 'logic_puzzle'
  | 'reaction_time'
  | 'quick_maths'
  | 'odd_one_out'
  | 'visual_memory';

interface Props {
  currentLang: AppLanguage;
  onWin: (stats: {
    mode: 'braingames';
    difficulty: 'easy' | 'medium' | 'hard';
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  }) => void;
  onOpenAIAssistant: (contextQuestion?: string) => void;
}

export const BrainGamesHub: React.FC<Props> = ({ currentLang, onWin, onOpenAIAssistant }) => {
  const isTa = currentLang === 'ta';
  const [selectedGame, setSelectedGame] = useState<BrainGameKey | null>(null);

  // High score tracking for each mini game in local storage
  const [personalBests, setPersonalBests] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem('sande_iq_brain_games_bests');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const savePersonalBest = (gameKey: string, score: number) => {
    setPersonalBests((prev) => {
      const current = prev[gameKey] || 0;
      if (score > current) {
        const next = { ...prev, [gameKey]: score };
        try {
          localStorage.setItem('sande_iq_brain_games_bests', JSON.stringify(next));
        } catch {}
        return next;
      }
      return prev;
    });
  };

  const gameCatalog = [
    {
      id: 'memory_cards' as BrainGameKey,
      icon: '🃏',
      name: isTa ? 'நினைவக அட்டைப் பொருத்தம்' : 'Memory Card Matching Game',
      badge: isTa ? 'நினைவாற்றல்' : 'Memory',
      color: 'from-blue-600/30 to-cyan-500/20 border-cyan-400/40 text-cyan-300',
      description: isTa
        ? 'மறைக்கப்பட்ட அட்டைகளைத் திறந்து ஒரே மாதிரியான ஜோடிகளைக் கண்டறியவும். அட்டைகளின் இருப்பிடத்தை நினைவில் வையுங்கள்.'
        : 'Flip cards and match identical symbols by remembering their coordinates.',
    },
    {
      id: 'number_sequence' as BrainGameKey,
      icon: '🔢',
      name: isTa ? 'எண் தொடர் சவால்' : 'Number Sequence Challenge',
      badge: isTa ? 'எண்ணியல்' : 'Arithmetic',
      color: 'from-amber-600/30 to-orange-500/20 border-amber-400/40 text-amber-300',
      description: isTa
        ? 'மாறும் எண் விகிதங்கள் மற்றும் தொடர்களில் விடுபட்ட அடுத்த எண்ணை விரைவாகக் கண்டறியவும்.'
        : 'Spot algebraic step deltas and Fibonacci-style progression patterns quickly.',
    },
    {
      id: 'pattern_recognition' as BrainGameKey,
      icon: '🔷',
      name: isTa ? 'வடிவ அடையாள விளையாட்டு' : 'Pattern Recognition Game',
      badge: isTa ? 'வடிவவியல்' : 'Geometry',
      color: 'from-purple-600/30 to-indigo-500/20 border-purple-400/40 text-purple-300',
      description: isTa
        ? 'வடிவங்கள், சுழற்சிகள் மற்றும் குறியீடுகளின் சமச்சீர்மை விதியை ஆய்ந்து விடை காணவும்.'
        : 'Decipher rotational geometry rules and matrix transformations.',
    },
    {
      id: 'logic_puzzle' as BrainGameKey,
      icon: '🧩',
      name: isTa ? 'தர்க்க புதிர் சவால்' : 'Logic Puzzle Game',
      badge: isTa ? 'தர்க்கம்' : 'Deduction',
      color: 'from-emerald-600/30 to-teal-500/20 border-emerald-400/40 text-emerald-300',
      description: isTa
        ? 'அறிவார்ந்த துப்பறியும் நிபந்தனைகளைக் கொண்டு உண்மையான விடையைத் தீர்மானிக்கவும்.'
        : 'Evaluate premises and conditions to deduce the only consistent conclusion.',
    },
    {
      id: 'reaction_time' as BrainGameKey,
      icon: '⚡',
      name: isTa ? 'வினைவேக சவால்' : 'Reaction Time Challenge',
      badge: isTa ? 'வேகம்' : 'Reflexes',
      color: 'from-rose-600/30 to-pink-500/20 border-rose-400/40 text-rose-300',
      description: isTa
        ? 'சிவப்பு விளக்கு நியான் பச்சையாக மாறும் வினாடியில் விரைவாகத் தொட்டு உங்கள் எதிர்வினை வேகத்தை மில்லிவினாடிகளில் அளவிடவும்.'
        : 'Test your motor reaction speed in milliseconds when the red node turns neon green.',
    },
    {
      id: 'quick_maths' as BrainGameKey,
      icon: '⚡🔢',
      name: isTa ? 'மின்னல் கணித சவால்' : 'Quick Maths Challenge',
      badge: isTa ? 'கணிதம்' : 'Mental Math',
      color: 'from-indigo-600/30 to-blue-500/20 border-indigo-400/40 text-indigo-300',
      description: isTa
        ? 'வினாடிகளுக்குள் மனக்கணக்குகளைத் தீர்த்து உயர் மதிப்பெண்களைப் பெறவும்.'
        : 'Rapid-fire mental arithmetic tests under time pressure.',
    },
    {
      id: 'odd_one_out' as BrainGameKey,
      icon: '🎯',
      name: isTa ? 'பொருந்தாத ஒன்றைக் கண்டறி' : 'Odd One Out',
      badge: isTa ? 'கூர்நோக்கு' : 'Observation',
      color: 'from-yellow-600/30 to-amber-500/20 border-yellow-400/40 text-yellow-300',
      description: isTa
        ? 'குழுவில் உள்ள 4 கூறுகளில் விதியை மீறும் தனித்த ஒரு உறுப்பைக் கண்டுபிடிக்கவும்.'
        : 'Identify the visual or functional anomaly among a group of items.',
    },
    {
      id: 'visual_memory' as BrainGameKey,
      icon: '👁️',
      name: isTa ? 'காட்சி நினைவாற்றல் சவால்' : 'Visual Memory Challenge',
      badge: isTa ? 'காட்சித் திறன்' : 'Spatial Retention',
      color: 'from-cyan-600/30 to-teal-500/20 border-cyan-400/40 text-cyan-300',
      description: isTa
        ? 'குறுகிய நேரம் ஒளிரும் கட்ட வடிவங்களை மனத்திரையில் பதித்துத் துல்லியமாக மீட்கவும்.'
        : 'Flash-retention grid challenge: remember all lit positions and reproduce the layout.',
    },
  ];

  if (!selectedGame) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0a152d] via-[#050505] to-[#050505] border border-blue-500/40 p-6 sm:p-8 shadow-[0_0_35px_rgba(0,102,255,0.25)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                <span>SAND.E IQ · BRAIN TRAINING HUB</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {isTa ? '8 ஊடாடும் மூளை விளையாட்டுகள்' : '8 Interactive Brain Games'}
              </h2>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                {isTa
                  ? 'நினைவாற்றல், வேகக் கணிதம், எதிர்வினை நேரம், தர்க்கப் புதிர்கள் மற்றும் வடிவங்களை மேம்படுத்தும் கவர்ச்சிகரமான மினி-கேம்கள்.'
                  : 'Engaging, fast-paced cognitive mini-games designed to enhance working memory, mental math, reaction time, and spatial agility.'}
              </p>
            </div>
          </div>
        </div>

        {/* 8 Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gameCatalog.map((game) => {
            const pb = personalBests[game.id] || 0;
            return (
              <div
                key={game.id}
                onClick={() => {
                  sound.playClick(500);
                  setSelectedGame(game.id);
                }}
                className="group relative p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#070b16] border border-blue-900/50 hover:border-cyan-400 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(0,217,255,0.25)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/80">
                      {game.icon}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-cyan-400/30">
                      {game.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    {isTa ? 'உயர் புள்ளி:' : 'Best:'} <strong className="text-cyan-300">{pb.toLocaleString()}</strong>
                  </span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
                    <span>{isTa ? 'ஆடு' : 'Play'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Mini-Game Container
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Return to Games Hub Bar */}
      <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-slate-950 border border-cyan-400/40">
        <button
          type="button"
          onClick={() => {
            sound.playClick(440);
            setSelectedGame(null);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
        >
          <span>←</span>
          <span>{isTa ? 'விளையாட்டுகள் பட்டியல்' : 'All 8 Brain Games'}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-cyan-300 font-bold uppercase">
            {gameCatalog.find((g) => g.id === selectedGame)?.name}
          </span>
          <button
            type="button"
            onClick={() => onOpenAIAssistant(`How do I excel in the ${selectedGame} brain game?`)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold cursor-pointer"
          >
            <span>{isTa ? 'AI உத்தி' : 'AI Tip'}</span>
          </button>
        </div>
      </div>

      {/* RENDER INDIVIDUAL MINI GAMES */}
      {selectedGame === 'memory_cards' && (
        <MemoryCardGame
          isTa={isTa}
          onComplete={(score, time, accuracy) => {
            savePersonalBest('memory_cards', score);
            onWin({
              mode: 'braingames',
              difficulty: 'medium',
              score,
              iqEstimate: 115,
              timeSeconds: time,
              accuracy,
              title: 'Memory Card Matching Master',
            });
          }}
        />
      )}

      {selectedGame === 'number_sequence' && (
        <NumberSequenceGame
          isTa={isTa}
          onComplete={(score, time, accuracy) => {
            savePersonalBest('number_sequence', score);
            onWin({
              mode: 'braingames',
              difficulty: 'medium',
              score,
              iqEstimate: 120,
              timeSeconds: time,
              accuracy,
              title: 'Number Sequence Challenge',
            });
          }}
        />
      )}

      {selectedGame === 'pattern_recognition' && (
        <PatternRecognitionMiniGame
          isTa={isTa}
          onComplete={(score, time, accuracy) => {
            savePersonalBest('pattern_recognition', score);
            onWin({
              mode: 'braingames',
              difficulty: 'hard',
              score,
              iqEstimate: 125,
              timeSeconds: time,
              accuracy,
              title: 'Pattern Recognition Genius',
            });
          }}
        />
      )}

      {selectedGame === 'logic_puzzle' && (
        <LogicPuzzleMiniGame
          isTa={isTa}
          onComplete={(score, time, accuracy) => {
            savePersonalBest('logic_puzzle', score);
            onWin({
              mode: 'braingames',
              difficulty: 'hard',
              score,
              iqEstimate: 128,
              timeSeconds: time,
              accuracy,
              title: 'Logic Puzzle Champion',
            });
          }}
        />
      )}

      {selectedGame === 'reaction_time' && (
        <ReactionTimeGame
          isTa={isTa}
          onComplete={(score, ms) => {
            savePersonalBest('reaction_time', score);
            onWin({
              mode: 'braingames',
              difficulty: 'medium',
              score,
              iqEstimate: Math.max(100, Math.min(145, Math.round(150 - ms / 10))),
              timeSeconds: Math.round(ms / 1000),
              accuracy: 100,
              title: 'Reflex Speed Master',
            });
          }}
        />
      )}

      {selectedGame === 'quick_maths' && (
        <QuickMathsGame
          isTa={isTa}
          onComplete={(score, time, accuracy) => {
            savePersonalBest('quick_maths', score);
            onWin({
              mode: 'braingames',
              difficulty: 'medium',
              score,
              iqEstimate: 118,
              timeSeconds: time,
              accuracy,
              title: 'Quick Maths Challenger',
            });
          }}
        />
      )}

      {selectedGame === 'odd_one_out' && (
        <OddOneOutGame
          isTa={isTa}
          onComplete={(score, time, accuracy) => {
            savePersonalBest('odd_one_out', score);
            onWin({
              mode: 'braingames',
              difficulty: 'easy',
              score,
              iqEstimate: 112,
              timeSeconds: time,
              accuracy,
              title: 'Odd One Out Detective',
            });
          }}
        />
      )}

      {selectedGame === 'visual_memory' && (
        <VisualMemoryMiniGame
          isTa={isTa}
          onComplete={(score, time, accuracy) => {
            savePersonalBest('visual_memory', score);
            onWin({
              mode: 'braingames',
              difficulty: 'hard',
              score,
              iqEstimate: 126,
              timeSeconds: time,
              accuracy,
              title: 'Visual Memory Titan',
            });
          }}
        />
      )}
    </div>
  );
};

// 1. MEMORY CARD MATCHING GAME
const MemoryCardGame: React.FC<{
  isTa: boolean;
  onComplete: (score: number, time: number, accuracy: number) => void;
}> = ({ isTa, onComplete }) => {
  const ICONS = ['🚀', '🧠', '⚡', '💎', '🔥', '🌟'];
  const [cards, setCards] = useState<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const initGame = () => {
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((sym, idx) => ({ id: idx, symbol: sym, isFlipped: false, isMatched: false }));
    setCards(deck);
    setFlippedIds([]);
    setMoves(0);
    setMatchedPairs(0);
    setSeconds(0);
    setIsFinished(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (isFinished) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isFinished]);

  const handleFlip = (id: number) => {
    if (flippedIds.length === 2 || isFinished) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    sound.playClick(500);
    const newFlipped = [...flippedIds, id];
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)));
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const c1 = cards.find((c) => c.id === firstId);
      const c2 = cards.find((c) => c.id === secondId);

      if (c1?.symbol === c2?.symbol) {
        sound.playSuccess();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c))
          );
          setFlippedIds([]);
          setMatchedPairs((p) => {
            const next = p + 1;
            if (next === ICONS.length) {
              setIsFinished(true);
              sound.playFanfare();
              triggerConfetti();
              const score = Math.max(500, 3000 - moves * 80 - seconds * 30);
              const accuracy = Math.round((ICONS.length / (moves + 1)) * 100);
              onComplete(score, seconds, Math.min(100, accuracy));
            }
            return next;
          });
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c))
          );
          setFlippedIds([]);
        }, 900);
      }
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#060a16] border border-blue-500/30 text-center space-y-5">
      <div className="flex items-center justify-between border-b border-blue-900/40 pb-3 text-xs font-mono">
        <span className="text-cyan-400 font-bold">{isTa ? 'அட்டைப் பொருத்தம் (12 அட்டைகள்)' : 'Memory Card Matching (12 Cards)'}</span>
        <div className="flex items-center gap-4 text-slate-300">
          <span>{isTa ? 'நகர்வுகள்:' : 'Moves:'} <strong className="text-white">{moves}</strong></span>
          <span>{isTa ? 'நேரம்:' : 'Time:'} <strong className="text-white">{seconds}s</strong></span>
          <span>{isTa ? 'ஜோடிகள்:' : 'Pairs:'} <strong className="text-emerald-400">{matchedPairs}/{ICONS.length}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((card) => {
          const showFace = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleFlip(card.id)}
              className={`h-20 sm:h-24 rounded-2xl text-3xl flex items-center justify-center font-bold transition-all cursor-pointer border ${
                card.isMatched
                  ? 'bg-emerald-950/70 border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : showFace
                  ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 border-cyan-300 shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                  : 'bg-slate-900 border-slate-800 hover:border-cyan-400/50 hover:bg-slate-850'
              }`}
            >
              {showFace ? card.symbol : '❓'}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={initGame}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isTa ? 'மறுதொடக்கம்' : 'Reset Match'}</span>
        </button>
      </div>
    </div>
  );
};

// 2. NUMBER SEQUENCE CHALLENGE
const NumberSequenceGame: React.FC<{
  isTa: boolean;
  onComplete: (score: number, time: number, accuracy: number) => void;
}> = ({ isTa, onComplete }) => {
  const problems = [
    { seq: [3, 6, 12, 24], ans: 48, options: [36, 48, 52, 60], tip: 'Doubling series (*2)' },
    { seq: [1, 4, 9, 16, 25], ans: 36, options: [30, 34, 36, 40], tip: 'Square numbers (n²)' },
    { seq: [5, 11, 23, 47], ans: 95, options: [89, 92, 95, 99], tip: '*2 + 1 step' },
    { seq: [100, 93, 85, 76], ans: 66, options: [64, 66, 68, 70], tip: 'Decreasing deltas: -7, -8, -9, -10' },
  ];

  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const cur = problems[step];

  const handleChoice = (opt: number) => {
    const isRight = opt === cur.ans;
    if (isRight) {
      sound.playSuccess();
      setCorrect((c) => c + 1);
    } else {
      sound.playError();
    }

    if (step < problems.length - 1) {
      setStep((s) => s + 1);
    } else {
      sound.playFanfare();
      triggerConfetti();
      const finalAcc = Math.round(((correct + (isRight ? 1 : 0)) / problems.length) * 100);
      const score = Math.max(500, 2500 * (finalAcc / 100) - seconds * 15);
      onComplete(Math.round(score), seconds, finalAcc);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#060a16] border border-blue-500/30 text-center space-y-6">
      <div className="flex items-center justify-between text-xs font-mono border-b border-blue-900/40 pb-3">
        <span className="text-amber-400 font-bold">{isTa ? 'எண் தொடர் சவால்' : 'Number Sequence Challenge'}</span>
        <span className="text-slate-300">{step + 1} / {problems.length}</span>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-slate-400 font-mono">{isTa ? 'அடுத்த எண்ணைக் கண்டறியவும்:' : 'Determine the next number in sequence:'}</p>
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {cur.seq.map((n, i) => (
            <span key={i} className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-base font-bold text-white">
              {n}
            </span>
          ))}
          <span className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400 font-mono text-lg font-black text-amber-300 animate-pulse">
            ?
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-2">
        {cur.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleChoice(opt)}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-500 border border-slate-800 text-white font-mono font-bold text-lg transition-all cursor-pointer shadow-md"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// 3. PATTERN RECOGNITION MINI GAME
const PatternRecognitionMiniGame: React.FC<{
  isTa: boolean;
  onComplete: (score: number, time: number, accuracy: number) => void;
}> = ({ isTa, onComplete }) => {
  const puzzles = [
    {
      grid: ['▲', '▲', '▲', '■', '■', '■', '●', '●', '?'],
      options: ['●', '▲', '■', '◆'],
      ans: '●',
      reason: 'Row 3 contains circles ●',
    },
    {
      grid: ['↗️', '➡️', '↘️', '⬆️', '↗️', '➡️', '↖️', '⬆️', '?'],
      options: ['↗️', '↘️', '⬇️', '⬅️'],
      ans: '↗️',
      reason: 'Clockwise rotational increment (+45°)',
    },
  ];

  const [pIndex, setPIndex] = useState(0);
  const [correct, setCorrect] = useState(0);

  const handleSelect = (opt: string) => {
    const isRight = opt === puzzles[pIndex].ans;
    if (isRight) {
      sound.playSuccess();
      setCorrect((c) => c + 1);
    } else {
      sound.playError();
    }

    if (pIndex < puzzles.length - 1) {
      setPIndex((i) => i + 1);
    } else {
      sound.playFanfare();
      triggerConfetti();
      const acc = Math.round(((correct + (isRight ? 1 : 0)) / puzzles.length) * 100);
      onComplete(acc * 25, 20, acc);
    }
  };

  const cur = puzzles[pIndex];

  return (
    <div className="p-6 rounded-3xl bg-[#060a16] border border-blue-500/30 text-center space-y-6">
      <div className="flex items-center justify-between text-xs font-mono border-b border-blue-900/40 pb-3">
        <span className="text-purple-400 font-bold">{isTa ? 'வடிவ அடையாள மேட்ரிக்ஸ்' : 'Pattern Recognition 3x3'}</span>
        <span className="text-slate-300">{pIndex + 1} / {puzzles.length}</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto p-3 rounded-2xl bg-slate-950 border border-purple-500/40">
        {cur.grid.map((sym, i) => (
          <div
            key={i}
            className={`h-16 rounded-xl flex items-center justify-center text-2xl font-bold border ${
              sym === '?'
                ? 'bg-purple-950/60 border-purple-400 text-purple-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            {sym}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        {cur.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleSelect(opt)}
            className="w-14 h-14 rounded-2xl bg-slate-900 hover:bg-purple-600 border border-slate-700 text-2xl text-white transition-all cursor-pointer shadow-md"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// 4. LOGIC PUZZLE MINI GAME
const LogicPuzzleMiniGame: React.FC<{
  isTa: boolean;
  onComplete: (score: number, time: number, accuracy: number) => void;
}> = ({ isTa, onComplete }) => {
  const handleAnswer = (correct: boolean) => {
    if (correct) {
      sound.playSuccess();
      sound.playFanfare();
      triggerConfetti();
      onComplete(2200, 25, 100);
    } else {
      sound.playError();
      onComplete(800, 30, 50);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#060a16] border border-blue-500/30 text-center space-y-6">
      <div className="text-xs font-mono text-emerald-400 font-bold uppercase border-b border-blue-900/40 pb-3">
        {isTa ? 'தர்க்கக் கொள்கை புதிர்' : 'Deductive Premise Puzzle'}
      </div>

      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-sm text-slate-200">
        <p className="font-semibold text-white">
          {isTa
            ? 'அருணன், கவின் மற்றும் முகில் ஆகியோர் ஓட்டப்பந்தயத்தில் பங்கேற்றனர்.'
            : 'Arunan, Kavin, and Mugil ran in a 100m sprint race.'}
        </p>
        <p className="text-slate-300 text-xs">
          • {isTa ? 'அருணன் கடைசியாக வரவில்லை.' : 'Arunan did NOT finish in last place.'}
        </p>
        <p className="text-slate-300 text-xs">
          • {isTa ? 'கவின் முதலாவதாக வரவில்லை.' : 'Kavin did NOT finish in first place.'}
        </p>
        <p className="text-slate-300 text-xs">
          • {isTa ? 'முகில் அருணனுக்குப் பின்னால் வந்தார்.' : 'Mugil finished behind Arunan.'}
        </p>
        <p className="font-bold text-cyan-300 pt-1 text-xs">
          {isTa ? 'பந்தயத்தில் முதலாவதாக வென்றவர் யார்?' : 'Who finished in FIRST place?'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => handleAnswer(true)}
          className="p-3.5 rounded-xl bg-slate-900 hover:bg-emerald-600 border border-slate-700 text-white font-bold transition-all cursor-pointer"
        >
          {isTa ? 'அருணன் (Arunan)' : 'Arunan'}
        </button>
        <button
          type="button"
          onClick={() => handleAnswer(false)}
          className="p-3.5 rounded-xl bg-slate-900 hover:bg-rose-600 border border-slate-700 text-white font-bold transition-all cursor-pointer"
        >
          {isTa ? 'கவின் (Kavin)' : 'Kavin'}
        </button>
        <button
          type="button"
          onClick={() => handleAnswer(false)}
          className="p-3.5 rounded-xl bg-slate-900 hover:bg-rose-600 border border-slate-700 text-white font-bold transition-all cursor-pointer"
        >
          {isTa ? 'முகில் (Mugil)' : 'Mugil'}
        </button>
      </div>
    </div>
  );
};

// 5. REACTION TIME CHALLENGE
const ReactionTimeGame: React.FC<{
  isTa: boolean;
  onComplete: (score: number, reactionMs: number) => void;
}> = ({ isTa, onComplete }) => {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [reactionMs, setReactionMs] = useState(0);
  const timerRef = useRef<any>(null);

  const startTest = () => {
    setGameState('waiting');
    const delay = 1500 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      clearTimeout(timerRef.current);
      sound.playError();
      alert(isTa ? 'மிகவும் முன்னதாக அழுத்திவிட்டீர்கள்! பச்சையாக மாறும் வரை காத்திருக்கவும்.' : 'Too early! Wait until it turns neon green.');
      setGameState('idle');
    } else if (gameState === 'ready') {
      const elapsed = Date.now() - startTime;
      sound.playSuccess();
      sound.playFanfare();
      triggerConfetti();
      setReactionMs(elapsed);
      setGameState('result');
      const score = Math.max(500, Math.round(3000 - elapsed * 4));
      onComplete(score, elapsed);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#060a16] border border-blue-500/30 text-center space-y-6">
      <div className="text-xs font-mono text-rose-400 font-bold uppercase border-b border-blue-900/40 pb-3">
        {isTa ? 'வினைவேக சவால் (Reaction Time)' : 'Reaction Speed Millisecond Test'}
      </div>

      {gameState === 'idle' && (
        <button
          type="button"
          onClick={startTest}
          className="w-full max-w-sm mx-auto h-44 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl flex flex-col items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(0,102,255,0.4)]"
        >
          <Zap className="w-8 h-8 text-cyan-300" />
          <span>{isTa ? 'தொடங்க அழுத்தவும்' : 'Tap to Start'}</span>
        </button>
      )}

      {gameState === 'waiting' && (
        <div
          onClick={handleClick}
          className="w-full max-w-sm mx-auto h-44 rounded-3xl bg-rose-900/80 border-2 border-rose-500 text-white font-bold text-lg flex flex-col items-center justify-center gap-2 cursor-pointer animate-pulse"
        >
          <span>🔴 {isTa ? 'காத்திருங்கள்...' : 'WAIT FOR GREEN...'}</span>
        </div>
      )}

      {gameState === 'ready' && (
        <div
          onClick={handleClick}
          className="w-full max-w-sm mx-auto h-44 rounded-3xl bg-emerald-500 border-4 border-emerald-300 text-slate-950 font-black text-2xl flex flex-col items-center justify-center gap-2 cursor-pointer shadow-[0_0_35px_rgba(16,185,129,0.8)]"
        >
          <span>⚡ {isTa ? 'இப்போதே தொடுங்கள்!' : 'TAP NOW!'}</span>
        </div>
      )}

      {gameState === 'result' && (
        <div className="space-y-4">
          <div className="text-3xl font-black text-cyan-300 font-mono">
            {reactionMs} ms
          </div>
          <p className="text-xs text-slate-400 font-mono">
            {reactionMs < 250 ? '⚡ Elite Olympic Reflexes!' : reactionMs < 350 ? '🌟 Excellent Human Reaction' : '👍 Solid baseline reflex'}
          </p>
          <button
            type="button"
            onClick={startTest}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold cursor-pointer"
          >
            {isTa ? 'மீண்டும் முயற்சிக்கவும்' : 'Try Again'}
          </button>
        </div>
      )}
    </div>
  );
};

// 6. QUICK MATHS CHALLENGE
const QuickMathsGame: React.FC<{
  isTa: boolean;
  onComplete: (score: number, time: number, accuracy: number) => void;
}> = ({ isTa, onComplete }) => {
  const questions = [
    { q: '14 + 27', a: 41, opts: [39, 41, 43, 45] },
    { q: '12 × 7', a: 84, opts: [74, 82, 84, 96] },
    { q: '150 ÷ 6', a: 25, opts: [20, 25, 30, 35] },
    { q: '9² - 15', a: 66, opts: [64, 66, 68, 71] },
  ];

  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const cur = questions[idx];

  const handleSelect = (choice: number) => {
    const isRight = choice === cur.a;
    if (isRight) {
      sound.playSuccess();
      setCorrect((c) => c + 1);
    } else {
      sound.playError();
    }

    if (idx < questions.length - 1) {
      setIdx((i) => i + 1);
    } else {
      sound.playFanfare();
      triggerConfetti();
      const acc = Math.round(((correct + (isRight ? 1 : 0)) / questions.length) * 100);
      const score = Math.max(500, acc * 25 - seconds * 10);
      onComplete(Math.round(score), seconds, acc);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#060a16] border border-blue-500/30 text-center space-y-6">
      <div className="flex items-center justify-between text-xs font-mono border-b border-blue-900/40 pb-3">
        <span className="text-cyan-400 font-bold">{isTa ? 'மின்னல் கணித சவால்' : 'Quick Mental Math'}</span>
        <span className="text-slate-300">{idx + 1} / {questions.length}</span>
      </div>

      <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-wider">
        {cur.q} = ?
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {cur.opts.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleSelect(opt)}
            className="p-4 rounded-2xl bg-slate-900 hover:bg-cyan-600 border border-slate-700 text-white font-mono font-bold text-xl transition-all cursor-pointer shadow-md"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// 7. ODD ONE OUT GAME
const OddOneOutGame: React.FC<{
  isTa: boolean;
  onComplete: (score: number, time: number, accuracy: number) => void;
}> = ({ isTa, onComplete }) => {
  const sets = [
    {
      items: ['🐶 Dog', '🐱 Cat', '🦅 Eagle', '🐰 Rabbit'],
      oddIndex: 2,
      explanation: isTa ? 'கழுகு மட்டுமே பறவை; மற்றவை பாலூட்டிகள்.' : 'Eagle is a bird; others are four-legged mammals.',
    },
    {
      items: ['▲ Triangle (3)', '■ Square (4)', '⬟ Pentagon (5)', '● Circle (0)'],
      oddIndex: 3,
      explanation: isTa ? 'வட்டம் பலகோணம் அல்ல (விளிம்புகள் அற்றது).' : 'Circle is curved with no linear edges.',
    },
  ];

  const [step, setStep] = useState(0);

  const handlePick = (pickedIndex: number) => {
    const isRight = pickedIndex === sets[step].oddIndex;
    if (isRight) {
      sound.playSuccess();
      sound.playFanfare();
      triggerConfetti();
      onComplete(2000, 15, 100);
    } else {
      sound.playError();
      onComplete(500, 20, 50);
    }
  };

  const cur = sets[step];

  return (
    <div className="p-6 rounded-3xl bg-[#060a16] border border-blue-500/30 text-center space-y-6">
      <div className="text-xs font-mono text-yellow-400 font-bold uppercase border-b border-blue-900/40 pb-3">
        {isTa ? 'பொருந்தாத ஒன்றைத் தேர்ந்தெடுக்கவும்' : 'Pick the Odd Item Out'}
      </div>

      <p className="text-sm text-slate-300 font-medium">
        {isTa ? 'கீழே உள்ளவற்றில் விதியை மீறும் தனித்த ஒன்றை அடையாளம் காணவும்:' : 'Spot the element that does not match the group category:'}
      </p>

      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {cur.items.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePick(idx)}
            className="p-4 rounded-2xl bg-slate-900 hover:bg-yellow-600 hover:text-slate-950 border border-slate-700 text-white font-semibold text-sm sm:text-base transition-all cursor-pointer shadow-md"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

// 8. VISUAL MEMORY MINI GAME
const VisualMemoryMiniGame: React.FC<{
  isTa: boolean;
  onComplete: (score: number, time: number, accuracy: number) => void;
}> = ({ isTa, onComplete }) => {
  const [litCells, setLitCells] = useState<number[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'done'>('memorize');

  useEffect(() => {
    // Generate 4 random cells in a 3x3 grid
    const picks = new Set<number>();
    while (picks.size < 4) {
      picks.add(Math.floor(Math.random() * 9));
    }
    const arr = Array.from(picks);
    setLitCells(arr);
    setSelectedCells([]);
    setPhase('memorize');

    const timer = setTimeout(() => {
      setPhase('recall');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCellClick = (idx: number) => {
    if (phase !== 'recall' || selectedCells.includes(idx)) return;
    sound.playClick(520);
    const updated = [...selectedCells, idx];
    setSelectedCells(updated);

    if (updated.length === litCells.length) {
      const correctCount = updated.filter((id) => litCells.includes(id)).length;
      if (correctCount === litCells.length) {
        sound.playSuccess();
        sound.playFanfare();
        triggerConfetti();
        onComplete(2400, 10, 100);
      } else {
        sound.playError();
        onComplete(900, 12, 50);
      }
      setPhase('done');
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#060a16] border border-blue-500/30 text-center space-y-6">
      <div className="text-xs font-mono text-cyan-400 font-bold uppercase border-b border-blue-900/40 pb-3">
        {isTa ? 'காட்சி நினைவாற்றல் பயிற்சி (3x3)' : 'Visual Spatial Flash Memory'}
      </div>

      <p className="text-xs text-slate-300 font-mono">
        {phase === 'memorize'
          ? isTa ? 'ஒளிரும் கட்டங்களை நினைவில் வையுங்கள்!' : 'MEMORIZE THE 4 LIT SQUARES!'
          : phase === 'recall'
          ? isTa ? 'நினைவில் வைத்த 4 கட்டங்களைத் தொடுங்கள்!' : 'TAP THE 4 LIT SQUARES FROM MEMORY!'
          : isTa ? 'முடிவு' : 'Round Complete!'}
      </p>

      <div className="grid grid-cols-3 gap-3 max-w-[220px] mx-auto p-3 rounded-2xl bg-slate-950 border border-blue-500/30">
        {Array.from({ length: 9 }).map((_, idx) => {
          const isLit = litCells.includes(idx);
          const isSelected = selectedCells.includes(idx);

          let bg = 'bg-slate-900 border-slate-800';
          if (phase === 'memorize' && isLit) {
            bg = 'bg-cyan-400 border-white shadow-[0_0_20px_rgba(0,217,255,0.8)]';
          } else if (phase === 'recall' && isSelected) {
            bg = 'bg-blue-600 border-cyan-300 shadow-[0_0_15px_rgba(0,102,255,0.6)]';
          } else if (phase === 'done') {
            if (isLit) bg = 'bg-emerald-500 border-emerald-300';
            else if (isSelected && !isLit) bg = 'bg-rose-500 border-rose-300';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={phase !== 'recall'}
              onClick={() => handleCellClick(idx)}
              className={`h-16 rounded-xl border transition-all cursor-pointer ${bg}`}
            />
          );
        })}
      </div>
    </div>
  );
};
