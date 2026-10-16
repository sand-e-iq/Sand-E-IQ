import React, { useState, useEffect, useRef } from 'react';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import {
  Users,
  Copy,
  Check,
  Play,
  RotateCcw,
  Trophy,
  Clock,
  Sparkles,
  Zap,
  ShieldAlert,
  ArrowRight,
  LogOut,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  score: number;
  currentQIndex: number;
  lastActive: number;
  isHost: boolean;
}

interface RoomData {
  code: string;
  status: 'lobby' | 'playing' | 'ended';
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  hostId: string;
  players: Player[];
}

interface Props {
  currentLang: AppLanguage;
  onWin: (stats: {
    mode: 'multiplayer';
    difficulty: 'easy' | 'medium' | 'hard';
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  }) => void;
}

export const MultiplayerArena: React.FC<Props> = ({ currentLang, onWin }) => {
  const isTa = currentLang === 'ta';

  const [view, setView] = useState<'home' | 'lobby' | 'playing' | 'leaderboard'>('home');
  const [playerName, setPlayerName] = useState(() => {
    try {
      const p = localStorage.getItem('sande_iq_user_progress_v4');
      if (p) {
        const parsed = JSON.parse(p);
        if (parsed?.playerName) return parsed.playerName;
      }
    } catch {}
    return 'Challenger 1';
  });

  const [inputCode, setInputCode] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [qCount, setQCount] = useState(5);

  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // In-match questions
  const matchQuestions = [
    {
      prompt: 'If ALL BLOOPS are Razzies and ALL Razzies are Lizzies, are all Bloops definitely Lizzies?',
      promptTa: 'அனைத்து BLOOPS-களும் Razzies மற்றும் அனைத்து Razzies-களும் Lizzies எனில், அனைத்து Bloops-களும் உறுதியாக Lizzies ஆகுமா?',
      options: [
        { text: 'Yes, absolutely (Deductive certainty)', textTa: 'ஆம், உறுதியாக (தர்க்க உறுதி)', isCorrect: true },
        { text: 'No, false', textTa: 'இல்லை, தவறு', isCorrect: false },
        { text: 'Cannot be determined', textTa: 'தீர்மானிக்க முடியாது', isCorrect: false },
        { text: 'Only some are', textTa: 'சில மட்டுமே', isCorrect: false },
      ],
      points: 500,
    },
    {
      prompt: 'What comes next in the Fibonacci step: 1, 1, 2, 3, 5, 8, 13, ?',
      promptTa: 'ஃபிபோனாச்சி எண் வரிசையில் அடுத்த எண் எது: 1, 1, 2, 3, 5, 8, 13, ?',
      options: [
        { text: '18', textTa: '18', isCorrect: false },
        { text: '21', textTa: '21', isCorrect: true },
        { text: '24', textTa: '24', isCorrect: false },
        { text: '26', textTa: '26', isCorrect: false },
      ],
      points: 600,
    },
    {
      prompt: 'A bat and ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much is the ball?',
      promptTa: 'மட்டையும் பந்தும் சேர்த்து $1.10. மட்டை பந்தை விட $1.00 அதிகம் எனில் பந்தின் விலை என்ன?',
      options: [
        { text: '$0.10', textTa: '$0.10', isCorrect: false },
        { text: '$0.05 (5 cents)', textTa: '$0.05 (5 காசுகள்)', isCorrect: true },
        { text: '$0.01', textTa: '$0.01', isCorrect: false },
        { text: '$0.15', textTa: '$0.15', isCorrect: false },
      ],
      points: 750,
    },
    {
      prompt: 'Which shape has the highest rotational symmetry order?',
      promptTa: 'அதிக சுழற்சி சமச்சீர்மை வரிசையைக் கொண்ட வடிவம் எது?',
      options: [
        { text: 'Equilateral Triangle', textTa: 'சமபக்க முக்கோணம் (3)', isCorrect: false },
        { text: 'Square', textTa: 'சதுரம் (4)', isCorrect: false },
        { text: 'Regular Hexagon', textTa: 'ஒழுங்கு அறுங்கோணம் (6)', isCorrect: true },
        { text: 'Rectangle', textTa: 'செவ்வகம் (2)', isCorrect: false },
      ],
      points: 650,
    },
    {
      prompt: 'Speed = 60 km/h. Distance = 150 km. How long does the trip take?',
      promptTa: 'வேகம் = 60 கி.மீ/மணி. தூரம் = 150 கி.மீ. பயணம் செய்ய எவ்வளவு நேரம் ஆகும்?',
      options: [
        { text: '2 hours 15 minutes', textTa: '2 மணி 15 நிமிடம்', isCorrect: false },
        { text: '2 hours 30 minutes', textTa: '2 மணி 30 நிமிடம்', isCorrect: true },
        { text: '2 hours 45 minutes', textTa: '2 மணி 45 நிமிடம்', isCorrect: false },
        { text: '3 hours', textTa: '3 மணி நேரம்', isCorrect: false },
      ],
      points: 500,
    },
  ];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [myScore, setMyScore] = useState(0);

  // Polling loop for active room
  useEffect(() => {
    if (!roomCode) return;

    const pollRoom = async () => {
      try {
        const res = await fetch(`/api/multiplayer/room/${roomCode}`);
        if (!res.ok) {
          if (res.status === 404) {
            setErrorMsg(isTa ? 'அறை மூடப்பட்டது.' : 'Room was closed.');
            setView('home');
          }
          return;
        }
        const data: RoomData = await res.json();
        setRoomData(data);

        if (data.status === 'playing' && view === 'lobby') {
          sound.playFanfare();
          setView('playing');
        } else if (data.status === 'ended' && view !== 'leaderboard') {
          sound.playFanfare();
          triggerConfetti();
          setView('leaderboard');
        }
      } catch {
        // Network lag tolerance
      }
    };

    pollRoom();
    const interval = setInterval(pollRoom, 2000);
    return () => clearInterval(interval);
  }, [roomCode, view, isTa]);

  // Create Room
  const handleCreateRoom = async () => {
    if (!playerName.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    sound.playClick(520);

    try {
      const res = await fetch('/api/multiplayer/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim(),
          difficulty,
          questionCount: qCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create room');

      setRoomCode(data.roomCode);
      setMyPlayerId(data.playerId);
      setIsHost(true);
      setView('lobby');
      sound.playSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection error. Ensure dev server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Join Room
  const handleJoinRoom = async () => {
    if (!playerName.trim() || !inputCode.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    sound.playClick(520);

    try {
      const res = await fetch('/api/multiplayer/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: inputCode.trim().toUpperCase(),
          playerName: playerName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to join room');

      setRoomCode(data.roomCode);
      setMyPlayerId(data.playerId);
      setIsHost(false);
      setView('lobby');
      sound.playSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Room not found. Check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Host starts the match
  const handleStartMatch = async () => {
    if (!roomCode || !myPlayerId || !isHost) return;
    sound.playClick(550);

    try {
      const res = await fetch(`/api/multiplayer/room/${roomCode}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: myPlayerId }),
      });
      if (res.ok) {
        sound.playFanfare();
        setView('playing');
      }
    } catch {
      // ignore
    }
  };

  // Submit Answer in Playing State
  const handleAnswer = async (optIdx: number) => {
    if (selectedOptionIndex !== null || !roomCode || !myPlayerId) return;

    setSelectedOptionIndex(optIdx);
    const q = matchQuestions[currentQIndex];
    const isCorrect = q.options[optIdx]?.isCorrect;
    const earned = isCorrect ? q.points : 0;

    if (isCorrect) {
      sound.playSuccess();
      setMyScore((s) => s + earned);
    } else {
      sound.playError();
    }

    try {
      await fetch(`/api/multiplayer/room/${roomCode}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: myPlayerId,
          points: earned,
          nextQIndex: currentQIndex + 1,
        }),
      });
    } catch {}

    setTimeout(() => {
      setSelectedOptionIndex(null);
      if (currentQIndex < matchQuestions.length - 1) {
        setCurrentQIndex((i) => i + 1);
      } else {
        setView('leaderboard');
      }
    }, 1200);
  };

  const copyRoomCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setIsCopied(true);
    sound.playClick(600);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // VIEW 1: HOME / CREATE OR JOIN
  if (view === 'home') {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0a152d] via-[#050505] to-[#050505] border border-blue-500/40 p-6 sm:p-8 shadow-[0_0_35px_rgba(0,102,255,0.25)] text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>REAL-TIME MULTIPLAYER HEAD-TO-HEAD</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isTa ? 'நண்பர்களுடன் நேரலை சவால்' : 'Multiplayer Challenge Arena'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            {isTa
              ? 'ஒரு தனிப்பட்ட அறையை உருவாக்கி அதன் குறியீட்டைப் பகிருங்கள் அல்லது உங்கள் நண்பரின் அறைக்குறியீட்டை உள்ளிட்டு நேரலையில் போட்டியிடுங்கள்.'
              : 'Create a private room to challenge friends with synchronized questions and live scoreboards, or join an existing match code.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Player Name Input */}
        <div className="p-4 rounded-2xl bg-[#060a16] border border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-mono text-cyan-300 font-bold uppercase">
            {isTa ? 'உங்கள் வீரர் பெயர்:' : 'Your Player Name:'}
          </span>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={18}
            className="w-full sm:w-64 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Create vs Join Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Create Room Box */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-blue-500/30 space-y-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👑</span>
                <h3 className="text-lg font-bold text-white">
                  {isTa ? 'புதிய அறை உருவாக்கு' : 'Host a Private Room'}
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                {isTa
                  ? 'தனித்துவ அறைக்குறியீடு உருவாக்கப்படும். சிரம நிலையையும் வினாக்கள் எண்ணிக்கையையும் தேர்ந்தெடுக்கலாம்.'
                  : 'Generates a 5-digit room code to share. Host controls match settings.'}
              </p>

              <div className="mt-4 space-y-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block mb-1">{isTa ? 'சிரமம்:' : 'Difficulty:'}</span>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                          difficulty === d
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={isLoading || !playerName.trim()}
              onClick={handleCreateRoom}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(0,217,255,0.4)] cursor-pointer disabled:opacity-40"
            >
              {isLoading ? 'Creating...' : isTa ? 'அறையை உருவாக்கு (Host)' : 'Create Room Code'}
            </button>
          </div>

          {/* Join Room Box */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-blue-500/30 space-y-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🚪</span>
                <h3 className="text-lg font-bold text-white">
                  {isTa ? 'அறையில் சேரவும்' : 'Join with Room Code'}
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                {isTa
                  ? 'நண்பர் பகிர்ந்த 5-எழுத்து குறியீட்டை உள்ளிட்டு உடனடியாக சவாலில் இணையவும்.'
                  : 'Enter the 5-character code shared by your friend to join their lobby.'}
              </p>

              <div className="mt-5 space-y-1">
                <span className="text-xs font-mono text-cyan-400 block font-bold">
                  {isTa ? 'அறைக்குறியீடு:' : 'Enter 5-Letter Code:'}
                </span>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="e.g. 7X8K2"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-cyan-400/50 text-cyan-300 font-mono text-center text-xl font-black uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={isLoading || !inputCode.trim()}
              onClick={handleJoinRoom}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-400/60 text-cyan-300 font-bold transition-all shadow-md cursor-pointer disabled:opacity-40"
            >
              {isLoading ? 'Connecting...' : isTa ? 'அறையில் நுழை (Join)' : 'Join Match'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: LOBBY
  if (view === 'lobby') {
    const playersList = roomData?.players || [];

    return (
      <div className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-slate-950 border border-cyan-400/40 text-center space-y-6 shadow-[0_0_35px_rgba(0,217,255,0.25)]">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold">
            {isTa ? 'அறை தயாராக உள்ளது' : 'Multiplayer Match Lobby'}
          </span>
          <h2 className="text-2xl font-black text-white">
            {isTa ? 'வீரர்கள் காத்திருப்பு கூடம்' : 'Waiting for Challengers'}
          </h2>
        </div>

        {/* Shareable Room Code Box */}
        <div className="p-4 rounded-2xl bg-[#060a16] border border-cyan-400/60 max-w-xs mx-auto space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            {isTa ? 'பகிர வேண்டிய அறைக்குறியீடு' : 'Share This Room Code'}
          </span>
          <div className="text-3xl font-black font-mono tracking-widest text-cyan-300">
            {roomCode}
          </div>
          <button
            type="button"
            onClick={copyRoomCode}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold cursor-pointer transition-all"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? (isTa ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (isTa ? 'குறியீட்டை நகலெடு' : 'Copy Code')}</span>
          </button>
        </div>

        {/* Connected Players List */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>{isTa ? 'இணைந்துள்ள வீரர்கள்' : 'Connected Players'} ({playersList.length})</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Synced</span>
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
            {playersList.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{p.isHost ? '👑' : '🎮'}</span>
                  <span className="font-bold text-white">{p.name}</span>
                  {p.id === myPlayerId && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                      YOU
                    </span>
                  )}
                </div>
                <span className="text-slate-400 font-mono text-[11px]">
                  {p.isHost ? (isTa ? 'அறை தலைவர்' : 'Host') : (isTa ? 'இணைந்தார்' : 'Ready')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {isHost ? (
            <button
              type="button"
              onClick={handleStartMatch}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(0,217,255,0.4)] cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>{isTa ? 'போட்டியைத் தொடங்கு' : 'Start Match Now'}</span>
            </button>
          ) : (
            <div className="text-xs text-cyan-300 font-mono p-3 rounded-xl bg-blue-950/40 border border-cyan-400/30 animate-pulse">
              {isTa ? 'அறை தலைவர் போட்டியைத் தொடங்கும் வரை காத்திருங்கள்...' : 'Waiting for host to launch the match...'}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setRoomCode(null);
              setView('home');
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
          >
            {isTa ? 'வெளியேறு' : 'Leave Room'}
          </button>
        </div>
      </div>
    );
  }

  // VIEW 3: IN MATCH PLAYING
  if (view === 'playing') {
    const q = matchQuestions[currentQIndex];
    const liveLeaderboard = [...(roomData?.players || [])].sort((a, b) => b.score - a.score);

    return (
      <div className="w-full max-w-3xl mx-auto space-y-4 animate-fade-in">
        {/* HUD: Round, Score & Opponent Standings */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-blue-500/40 shadow-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-blue-600/20 text-cyan-300 border border-cyan-400/40">
              Q {currentQIndex + 1} / {matchQuestions.length}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Room: {roomCode}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">{isTa ? 'உங்கள் புள்ளி:' : 'Your Score:'}</span>
            <span className="text-lg font-black text-cyan-300 font-mono">
              {myScore}
            </span>
          </div>
        </div>

        {/* Live Mini Leaderboard Strip */}
        <div className="p-2.5 rounded-xl bg-[#060a16] border border-slate-800 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold shrink-0">
            {isTa ? 'நேரலை நிலவரம்:' : 'Live Ranks:'}
          </span>
          {liveLeaderboard.map((p, rank) => (
            <div
              key={p.id}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono shrink-0 ${
                p.id === myPlayerId
                  ? 'bg-blue-600/30 border border-cyan-400/50 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-300'
              }`}
            >
              <span>#{rank + 1}</span>
              <span className="truncate max-w-[80px]">{p.name}</span>
              <span className="text-cyan-300 font-bold">{p.score}</span>
            </div>
          ))}
        </div>

        {/* Question Prompt */}
        <div className="p-6 rounded-3xl bg-[#080d1a] border border-blue-500/30 shadow-[0_0_25px_rgba(0,102,255,0.2)] space-y-5">
          <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {isTa ? q.promptTa : q.prompt}
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {q.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;
              let style = 'bg-slate-900 border-slate-800 text-white hover:border-cyan-400 hover:bg-slate-850';

              if (selectedOptionIndex !== null) {
                if (opt.isCorrect) {
                  style = 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]';
                } else if (isSelected) {
                  style = 'bg-rose-950 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
                } else {
                  style = 'opacity-40 bg-slate-900 border-slate-800 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedOptionIndex !== null}
                  onClick={() => handleAnswer(idx)}
                  className={`p-4 rounded-2xl border text-left font-semibold text-sm sm:text-base transition-all cursor-pointer ${style}`}
                >
                  {isTa ? opt.textTa : opt.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // VIEW 4: MATCH LEADERBOARD & RESULTS
  const finalLeaderboard = [...(roomData?.players || [])].sort((a, b) => b.score - a.score);
  const amIWinner = finalLeaderboard[0]?.id === myPlayerId;

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-950 border border-cyan-400/40 text-center space-y-6 shadow-[0_0_40px_rgba(0,217,255,0.3)] animate-fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-3xl">
        {amIWinner ? '🏆' : '🎖️'}
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          {amIWinner
            ? isTa ? 'வெற்றி! நீங்கள் முதலிடம்!' : 'Victory! You Won the Match!'
            : isTa ? 'போட்டி முடிந்தது!' : 'Match Completed!'}
        </h2>
        <p className="text-xs text-cyan-300 font-mono mt-1">
          Room {roomCode} · Official Sand.E IQ Match
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-2 text-left">
        <span className="text-xs font-mono uppercase text-slate-400 block px-1">
          {isTa ? 'இறுதி வெற்றிப்பலகை' : 'Final Match Leaderboard'}
        </span>
        <div className="space-y-2">
          {finalLeaderboard.map((p, rank) => (
            <div
              key={p.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                rank === 0
                  ? 'bg-amber-950/40 border-amber-400/60 text-white shadow-md'
                  : p.id === myPlayerId
                  ? 'bg-blue-950/40 border-cyan-400/50 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-base w-6 text-center text-cyan-400">
                  #{rank + 1}
                </span>
                <div>
                  <span className="font-bold text-sm text-white block">
                    {p.name} {p.id === myPlayerId ? ' (You)' : ''}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {p.isHost ? 'Host' : 'Challenger'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-cyan-300 font-mono block">
                  {p.score.toLocaleString()} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            sound.playClick(500);
            setCurrentQIndex(0);
            setSelectedOptionIndex(null);
            setMyScore(0);
            setView('lobby');
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold transition-all cursor-pointer shadow-md"
        >
          {isTa ? 'மீண்டும் விளையாடு (Lobby)' : 'Play Another Round'}
        </button>
        <button
          type="button"
          onClick={() => {
            setRoomCode(null);
            setView('home');
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
        >
          {isTa ? 'அரங்கிலிருந்து வெளியேறு' : 'Exit to Main Menu'}
        </button>
      </div>
    </div>
  );
};
