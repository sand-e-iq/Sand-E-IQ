import React, { useState, useEffect, useMemo } from 'react';
import { Difficulty, GameMode, LeaderboardEntry } from '../types/game';
import {
  getLeaderboard,
  clearLeaderboard,
  exportLeaderboardJson,
  importLeaderboardJson,
  getUserProfile,
  updateUserProfile,
} from '../utils/storage';
import { sound } from '../utils/audio';
import { AppLanguage } from '../types/i18n';
import { t } from '../utils/i18n';
import {
  Trophy,
  X,
  Trash2,
  Download,
  Upload,
  User,
  Medal,
  Clock,
  Sparkles,
  Search,
  Filter,
  Check,
  ShieldCheck,
  Brain,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  highlightId?: string;
  currentLang?: AppLanguage;
}

export const LeaderboardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  highlightId,
  currentLang = 'en',
}) => {
  const [arenaType, setArenaType] = useState<'global' | 'local'>('global');
  const [globalEntries, setGlobalEntries] = useState<any[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [diffFilter, setDiffFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'iq' | 'time' | 'date'>('score');
  const [editingName, setEditingName] = useState(false);
  const [playerName, setPlayerName] = useState('Player 1');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const isTa = currentLang === 'ta';

  const fetchGlobal = async () => {
    setLoadingGlobal(true);
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (data?.entries) {
        setGlobalEntries(data.entries);
      }
    } catch {
      // fallback to empty
    } finally {
      setLoadingGlobal(false);
    }
  };

  // Load leaderboard and user name
  const refreshData = () => {
    const data = getLeaderboard();
    setEntries(data);
    const profile = getUserProfile();
    setPlayerName(profile.playerName || 'Player 1');
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
      fetchGlobal();
    }
  }, [isOpen]);

  const handleSaveName = () => {
    if (!playerName.trim()) return;
    updateUserProfile({ playerName: playerName.trim() });
    setEditingName(false);
    sound.playSuccess();
    refreshData();
  };

  const handleClear = () => {
    if (window.confirm(isTa ? 'சேமிக்கப்பட்ட அனைத்து உண்மையான மதிப்பெண்களையும் அழிக்கவா?' : 'Clear all genuinely recorded scores on this device?')) {
      clearLeaderboard();
      sound.playClear();
      refreshData();
    }
  };

  const handleExport = () => {
    sound.playClick(500);
    const jsonStr = exportLeaderboardJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sande_iq_leaderboard_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importLeaderboardJson(content);
      if (ok) {
        sound.playSuccess();
        setImportStatus(isTa ? 'மதிப்பெண்கள் வெற்றிகரமாக இறக்குமதி செய்யப்பட்டன!' : 'Successfully imported records!');
        refreshData();
      } else {
        sound.playError();
        setImportStatus(isTa ? 'தவறான JSON கோப்பு' : 'Invalid JSON format');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  // Filter & Sort
  const filteredEntries = useMemo(() => {
    const listToFilter = arenaType === 'global' ? globalEntries : entries;
    return listToFilter
      .filter((e) => {
        if (modeFilter !== 'all' && e.mode !== modeFilter) return false;
        if (diffFilter !== 'all' && e.difficulty !== diffFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.score - a.score;
        if (sortBy === 'iq') return b.iqEstimate - a.iqEstimate;
        if (sortBy === 'time') return a.timeSeconds - b.timeSeconds;
        if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
        return 0;
      });
  }, [arenaType, globalEntries, entries, modeFilter, diffFilter, sortBy]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getModeLabel = (mode: GameMode) => {
    switch (mode) {
      case 'quiz':
        return isTa ? '⚡ IQ வினாடி வினா' : '⚡ IQ Quiz';
      case 'daily':
        return isTa ? '📅 தினசரி புதிர்' : '📅 Daily Puzzle';
      case 'memory':
        return isTa ? '🧠 நினைவாற்றல்' : '🧠 Memory Matrix';
      case 'child':
        return isTa ? '⭐ சுட்டி IQ' : '⭐ Child IQ';
      case 'detective':
        return isTa ? '🕵️‍♂️ துப்பறிதல்' : '🕵️‍♂️ Detective';
      case 'english':
        return isTa ? '🔤 ஆங்கிலம்' : '🔤 English';
      case 'grid':
        return isTa ? '🧩 கட்ட தர்க்கம்' : '🧩 Grid Nonogram';
      case 'pattern':
        return isTa ? '🔷 வடிவ மேட்ரிக்ஸ்' : '🔷 Pattern Matrix';
      case 'sequence':
        return isTa ? '🔢 தொடர்கள்' : '🔢 Sequences';
      case 'assessment':
        return isTa ? '📊 முழு மதிப்பீடு' : '📊 IQ Assessment';
      default:
        return mode;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] bg-[#070c18] border border-cyan-400/40 rounded-3xl shadow-[0_0_40px_rgba(0,217,255,0.2)] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-blue-900/40 bg-[#040710] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,217,255,0.3)]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Sand.E IQ · {isTa ? 'உண்மையான வெற்றிப்பலகை' : 'Genuine Leaderboard'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-mono text-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>100% Authentic Plays</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {isTa
                  ? 'சாதனத்தில் விளையாடப்பட்ட உண்மையான முடிவுகள் மட்டுமே பதிவு செய்யப்படுகின்றன.'
                  : 'Scores are verified local session results recorded from authentic user play.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global vs Device Tab Switcher (Feature 3) */}
        <div className="px-6 py-2 bg-[#03060f] border-b border-blue-950 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick(500);
              setArenaType('global');
              fetchGlobal();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              arenaType === 'global'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>🌍</span>
            <span>{isTa ? 'சர்வதேச அரங்கம் (Global)' : 'Global Arena'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick(500);
              setArenaType('local');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              arenaType === 'local'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>📱</span>
            <span>{isTa ? 'இந்த சாதனம் (This Device)' : 'This Device'}</span>
          </button>
        </div>

        {/* Player Profile Quick Setting */}
        <div className="px-6 py-3 bg-[#040813] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">{isTa ? 'வீரர் பெயர்:' : 'Player:'}</span>
            {editingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={24}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 border border-cyan-400 text-white font-semibold text-xs focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="p-1 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                className="font-bold text-cyan-300 hover:text-cyan-200 underline underline-offset-2 transition-colors cursor-pointer"
              >
                {playerName}
              </button>
            )}
          </div>

          {/* Backup / Restore / Reset Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Download local high scores as JSON file"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              <span>{isTa ? 'ஏற்றுமதி' : 'Export'}</span>
            </button>

            <label className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer transition-colors">
              <Upload className="w-3 h-3 text-emerald-400" />
              <span>{isTa ? 'இறக்குமதி' : 'Import'}</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-colors cursor-pointer"
              title="Clear stored scores"
            >
              <Trash2 className="w-3 h-3" />
              <span>{isTa ? 'அழி' : 'Clear'}</span>
            </button>
          </div>
        </div>

        {importStatus && (
          <div className="px-6 py-2 bg-emerald-950/60 text-emerald-300 text-xs border-b border-emerald-800">
            {importStatus}
          </div>
        )}

        {/* Filters and Sorting Bar */}
        <div className="px-6 py-3 bg-[#03060f] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-mono flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>{isTa ? 'வடிகட்டி:' : 'Filter:'}</span>
            </span>

            {/* Mode filter */}
            <select
              value={modeFilter}
              onChange={(e) => {
                sound.playClick(440);
                setModeFilter(e.target.value);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">{isTa ? 'அனைத்து ஆட்டங்களும்' : 'All Game Modes'}</option>
              <option value="quiz">IQ Quiz</option>
              <option value="daily">Daily Brain Puzzle</option>
              <option value="memory">Memory Matrix</option>
              <option value="detective">Detective Casefiles</option>
              <option value="child">Child IQ Arena</option>
              <option value="grid">Grid Deduction</option>
              <option value="pattern">Pattern Matrix</option>
              <option value="sequence">Sequences</option>
              <option value="assessment">IQ Assessment</option>
            </select>

            {/* Difficulty filter */}
            <select
              value={diffFilter}
              onChange={(e) => {
                sound.playClick(440);
                setDiffFilter(e.target.value);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">{isTa ? 'அனைத்து நிலைகளும்' : 'All Difficulties'}</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="master">Master</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">{isTa ? 'வரிசைப்படுத்து:' : 'Sort:'}</span>
            <select
              value={sortBy}
              onChange={(e) => {
                sound.playClick(440);
                setSortBy(e.target.value as any);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="score">{isTa ? 'அதிக மதிப்பெண்' : 'Highest Score'}</option>
              <option value="iq">{isTa ? 'அறிவாற்றல் குறியீடு' : 'Cognitive Rating'}</option>
              <option value="time">{isTa ? 'விரைவான நேரம்' : 'Fastest Time'}</option>
              <option value="date">{isTa ? 'சமீபத்தியது' : 'Most Recent'}</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-800/60 no-scrollbar">
          {filteredEntries.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-2xl text-slate-500">
                🎯
              </div>
              <p className="text-slate-300 font-bold text-sm">
                {isTa
                  ? 'இன்னும் மதிப்பெண்கள் பதிவாகவில்லை.'
                  : 'No genuinely recorded scores for this filter yet.'}
              </p>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                {isTa
                  ? 'வினாடி வினா, தினசரி புதிர் அல்லது நினைவாற்றல் ஆட்டத்தை முடித்து சாதனையைப் பதியுங்கள்!'
                  : 'Complete an IQ Quiz, Daily Brain Puzzle, or Memory Challenge to set your first genuine record!'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[560px]">
                <thead>
                  <tr className="text-[11px] font-mono text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-800">
                    <th className="pb-3 pl-2 w-12 font-medium">{isTa ? 'வரிசை' : 'Rank'}</th>
                    <th className="pb-3 font-medium">{isTa ? 'வீரர்' : 'Player'}</th>
                    <th className="pb-3 font-medium">{isTa ? 'ஆட்டம்' : 'Game Mode'}</th>
                    <th className="pb-3 font-medium">{isTa ? 'நிலை' : 'Level'}</th>
                    <th className="pb-3 text-right font-medium">{isTa ? 'அறிவாற்றல்' : 'Rating'}</th>
                    <th className="pb-3 text-right font-medium">{isTa ? 'மதிப்பெண்' : 'Score'}</th>
                    <th className="pb-3 text-right pr-2 font-medium">{isTa ? 'நேரம்' : 'Time'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs">
                  {filteredEntries.map((item, idx) => {
                    const isCurrentRun = highlightId && item.id === highlightId;

                    let rankBadge = (
                      <span className="font-mono text-slate-500 font-medium">#{idx + 1}</span>
                    );
                    if (idx === 0) {
                      rankBadge = (
                        <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center font-mono text-xs shadow-sm">
                          1
                        </span>
                      );
                    } else if (idx === 1) {
                      rankBadge = (
                        <span className="w-6 h-6 rounded-md bg-slate-300/20 text-slate-200 font-bold flex items-center justify-center font-mono text-xs">
                          2
                        </span>
                      );
                    } else if (idx === 2) {
                      rankBadge = (
                        <span className="w-6 h-6 rounded-md bg-amber-700/20 text-amber-500 font-bold flex items-center justify-center font-mono text-xs">
                          3
                        </span>
                      );
                    }

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isCurrentRun
                            ? 'bg-cyan-950/40 border-l-2 border-cyan-400'
                            : ''
                        }`}
                      >
                        <td className="py-3 pl-2">{rankBadge}</td>

                        <td className="py-3 font-medium text-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-100">{item.playerName}</span>
                            {item.isUser && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          {item.notes && (
                            <span className="text-[10px] text-slate-500 block truncate max-w-[220px]">
                              {item.notes}
                            </span>
                          )}
                        </td>

                        <td className="py-3 text-slate-300 font-medium">
                          {getModeLabel(item.mode)}
                        </td>

                        <td className="py-3">
                          <span className="capitalize text-slate-300 font-mono text-[11px]">
                            {item.difficulty}
                          </span>
                        </td>

                        <td className="py-3 text-right">
                          <span className="font-mono font-bold text-cyan-400 tabular-nums">
                            {item.iqEstimate}
                          </span>
                        </td>

                        <td className="py-3 text-right">
                          <span className="font-mono font-black text-white tabular-nums">
                            {item.score.toLocaleString()}
                          </span>
                        </td>

                        <td className="py-3 text-right pr-2 text-slate-400 font-mono">
                          {formatTime(item.timeSeconds)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
