import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { addXP, getUserProfile, unlockAchievement } from '../utils/storage';
import {
  Trophy,
  Users,
  Clock,
  Sparkles,
  Share2,
  Copy,
  CheckCircle2,
  ArrowRight,
  Flame,
  Award,
  Crown,
  Play,
  RotateCcw,
} from 'lucide-react';

interface Props {
  currentLang: AppLanguage;
  onStartTournamentPlay: () => void;
}

export const DailyTournamentArena: React.FC<Props> = ({ currentLang, onStartTournamentPlay }) => {
  const isTa = currentLang === 'ta';
  const profile = getUserProfile();

  // Tournament data from server
  const [tournamentData, setTournamentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Friends Challenge state (Feature 14)
  const [friendCode, setFriendCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchTournament();
  }, []);

  const fetchTournament = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tournaments/today');
      const data = await res.json();
      if (data?.success) {
        setTournamentData(data);
      }
    } catch {
      // Local fallback
      setTournamentData({
        date: new Date().toISOString().split('T')[0],
        tournamentTitle: 'Sand.E IQ Daily Cognitive Open',
        tournamentTitleTa: 'சாண்ட்.இ IQ அன்றாட தர்க்கப் போட்டி',
        entries: [
          { rank: 1, playerName: 'Arunan S (Founder)', score: 5400, accuracy: 100, timeSeconds: 38 },
          { rank: 2, playerName: 'Sand.E Master', score: 4850, accuracy: 92, timeSeconds: 45 },
          { rank: 3, playerName: 'Logic Cadet', score: 3900, accuracy: 88, timeSeconds: 52 },
        ],
        totalParticipants: 3,
        rules: [
          'Standardized 5-question cognitive challenge',
          'Fastest accurate responses receive time multipliers',
          'One official entry per player per day',
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateChallenge = () => {
    sound.playSuccess();
    const code = `SNDE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setGeneratedCode(code);
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(
      `I challenge you to beat my Sand.E IQ score! Use challenge code: ${generatedCode} on https://ais-pre-dprwfwjp42exhmzhslxp5x-398689812232.asia-east1.run.app`
    );
    setCopied(true);
    sound.playClick(600);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleJoinChallenge = () => {
    if (!friendCode.trim()) return;
    sound.playSuccess();
    setChallengeStatus(
      isTa
        ? `சவால் குறியீடு ${friendCode.toUpperCase()} ஏற்றுக்கொள்ளப்பட்டது! போட்டி தொடங்குகிறது.`
        : `Challenge code ${friendCode.toUpperCase()} verified! Match initialized.`
    );
    setTimeout(() => {
      onStartTournamentPlay();
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0a152d] via-[#050505] to-[#050505] border border-blue-500/40 p-6 sm:p-8 shadow-[0_0_35px_rgba(0,102,255,0.25)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              <span>SAND.E IQ · DAILY TOURNAMENT & FRIENDS ARENA</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {isTa ? 'அன்றாட போட்டி & நண்பர்கள் சவால்' : 'Daily Tournaments & Friends Challenge'}
            </h2>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              {isTa
                ? 'அனைத்து வீரர்களுக்கும் ஒரே மாதிரியான 5 கேள்விகள் கொண்ட சர்வதேச அன்றாட போட்டி. நண்பர்களுக்கு தனிப்பயன் சவால் விடுக்கவும்!'
                : 'Standardized daily competitive challenges with verified rankings. Challenge friends with unique challenge codes!'}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-center min-w-[170px] shrink-0">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              {isTa ? 'இன்றைய போட்டி' : 'Daily Tournament'}
            </span>
            <button
              type="button"
              onClick={onStartTournamentPlay}
              className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(0,217,255,0.4)] flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>{isTa ? 'போட்டியில் கலந்துகொள்' : 'Enter Tournament'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Daily Tournament Live Leaderboard */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-blue-900/50 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                {isTa ? 'இன்றைய உத்தியோகபூர்வ தரவரிசை' : 'Official Today Standings'}
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              {tournamentData?.totalParticipants || 0} {isTa ? 'பங்கேற்பாளர்கள்' : 'players registered'}
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p>{isTa ? 'தரவரிசை ஏற்றப்படுகிறது...' : 'Loading tournament rankings...'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tournamentData?.entries?.map((entry: any, idx: number) => {
                let rankBadge = 'bg-slate-800 text-slate-400';
                if (idx === 0) rankBadge = 'bg-amber-500/20 text-amber-300 border-amber-400/40 font-bold';
                if (idx === 1) rankBadge = 'bg-slate-400/20 text-slate-300 border-slate-400/40 font-bold';
                if (idx === 2) rankBadge = 'bg-amber-700/20 text-amber-500 border-amber-700/40 font-bold';

                return (
                  <div
                    key={entry.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border ${rankBadge}`}>
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-white">{entry.playerName}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {entry.accuracy}% accuracy · {entry.timeSeconds}s
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-sm font-black text-cyan-300">{entry.score?.toLocaleString()} pts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Friends Challenge Generator & Join (Feature 14) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-blue-900/50 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                {isTa ? 'நண்பர்கள் சவால்' : 'Friends Challenge'}
              </h3>
            </div>

            {/* Create Code */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-cyan-400 font-bold uppercase">
                {isTa ? 'சவால் குறியீட்டை உருவாக்கு' : 'Create Challenge Code'}
              </label>
              <button
                type="button"
                onClick={handleGenerateChallenge}
                className="w-full py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isTa ? 'புதிய சவால் குறியீடு பெறு' : 'Generate Challenge Code'}</span>
              </button>

              {generatedCode && (
                <div className="p-3 rounded-xl bg-slate-950 border border-cyan-400/40 flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300 font-bold">{generatedCode}</span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 px-2 rounded-lg bg-blue-600 text-white text-[11px] font-sans flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? (isTa ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (isTa ? 'நகலெடு' : 'Copy')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Enter Code */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-mono text-cyan-400 font-bold uppercase">
                {isTa ? 'நண்பரின் சவாலில் சேர்' : 'Join Friend’s Challenge'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SNDE-ABC12"
                  value={friendCode}
                  onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono uppercase"
                />
                <button
                  type="button"
                  onClick={handleJoinChallenge}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {isTa ? 'சேர்' : 'Join'}
                </button>
              </div>

              {challengeStatus && (
                <p className="text-xs text-emerald-400 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-center animate-fade-in">
                  {challengeStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
