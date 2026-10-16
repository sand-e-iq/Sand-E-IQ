import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Plus,
  Trash2,
  RefreshCw,
  BarChart3,
  Users,
  Brain,
  CheckCircle,
  AlertTriangle,
  FileText,
  Search,
} from 'lucide-react';

interface ManagedQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  title: string;
  titleTa: string;
  prompt: string;
  promptTa: string;
  options: { id: string; text: string; textTa: string; isCorrect: boolean }[];
  explanation: string;
  explanationTa: string;
  isPublished: boolean;
}

interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  adminUser: string;
}

interface AdminStats {
  activeRooms: number;
  totalManagedQuestions: number;
  auditLogsCount: number;
  systemUptimeSeconds: number;
  engineStatus: string;
  aiStatus: string;
}

interface Props {
  currentLang: AppLanguage;
  onExit: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ currentLang, onExit }) => {
  const isTa = currentLang === 'ta';

  // State
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard active view
  const [activeTab, setActiveTab] = useState<'stats' | 'questions' | 'audit'>('stats');

  // Server Data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [questions, setQuestions] = useState<ManagedQuestion[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // New question form state
  const [isAddingQ, setIsAddingQ] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleTa, setNewTitleTa] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newPromptTa, setNewPromptTa] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [newCategory, setNewCategory] = useState('logic');
  const [newExplanation, setNewExplanation] = useState('');
  const [newExplanationTa, setNewExplanationTa] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt1Ta, setOpt1Ta] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt2Ta, setOpt2Ta] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt3Ta, setOpt3Ta] = useState('');
  const [correctOptNum, setCorrectOptNum] = useState<1 | 2 | 3>(1);

  // Load admin data when token exists
  useEffect(() => {
    if (!authToken) return;

    const fetchData = async () => {
      try {
        const [statsRes, qRes, logsRes] = await Promise.all([
          fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${authToken}` } }),
          fetch('/api/admin/questions', { headers: { Authorization: `Bearer ${authToken}` } }),
          fetch('/api/admin/audit-logs', { headers: { Authorization: `Bearer ${authToken}` } }),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (qRes.ok) {
          const data = await qRes.json();
          setQuestions(data.questions || []);
        }
        if (logsRes.ok) {
          const data = await logsRes.json();
          setAuditLogs(data.logs || []);
        }
      } catch (err) {
        console.error('Failed fetching admin data', err);
      }
    };

    fetchData();
  }, [authToken, activeTab]);

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    sound.playClick(500);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication rejected');
      }

      setAuthToken(data.token);
      sound.playSuccess();
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Verify administrator credentials.');
      sound.playError();
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    sound.playClick(440);
    setAuthToken(null);
    setPassword('');
  };

  // CREATE QUESTION
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim() || !opt1.trim() || !opt2.trim() || !authToken) return;

    sound.playClick(520);
    try {
      const options = [
        { id: 'opt-1', text: opt1.trim(), textTa: opt1Ta.trim() || opt1.trim(), isCorrect: correctOptNum === 1 },
        { id: 'opt-2', text: opt2.trim(), textTa: opt2Ta.trim() || opt2.trim(), isCorrect: correctOptNum === 2 },
      ];
      if (opt3.trim()) {
        options.push({ id: 'opt-3', text: opt3.trim(), textTa: opt3Ta.trim() || opt3.trim(), isCorrect: correctOptNum === 3 });
      }

      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          titleTa: newTitleTa.trim() || newTitle.trim(),
          prompt: newPrompt.trim(),
          promptTa: newPromptTa.trim() || newPrompt.trim(),
          difficulty: newDifficulty,
          category: newCategory,
          options,
          explanation: newExplanation.trim() || 'Analytical deduction.',
          explanationTa: newExplanationTa.trim() || 'தர்க்கரீதியான பகுப்பாய்வு விளக்கம்.',
        }),
      });

      if (res.ok) {
        sound.playSuccess();
        const data = await res.json();
        setQuestions((prev) => [...prev, data.question]);
        setIsAddingQ(false);
        // Reset form
        setNewTitle('');
        setNewTitleTa('');
        setNewPrompt('');
        setNewPromptTa('');
        setOpt1('');
        setOpt2('');
        setOpt3('');
      }
    } catch (err) {
      console.error('Failed creating question', err);
    }
  };

  // DELETE QUESTION
  const handleDeleteQuestion = async (id: string) => {
    if (!confirm(isTa ? 'இந்த வினாவை நீக்க உறுதிப்படுத்துகிறீர்களா?' : 'Are you sure you want to delete this question?')) return;
    if (!authToken) return;

    sound.playClick(400);
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        sound.playSuccess();
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      }
    } catch (err) {
      console.error('Failed deleting question', err);
    }
  };

  // LOGIN SCREEN
  if (!authToken) {
    return (
      <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-[#060a16] border border-blue-500/40 shadow-[0_0_40px_rgba(0,102,255,0.25)] space-y-6 animate-fade-in text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 border border-cyan-400 text-cyan-300 mx-auto shadow-inner">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white">
            {isTa ? 'நிர்வாகி கட்டுப்பாட்டு அறை' : 'Admin Security Portal'}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {isTa ? 'அங்கீகரிக்கப்பட்ட நிர்வாகிகளுக்கு மட்டுமே' : 'Server-Side Authorization Required'}
          </p>
        </div>

        {loginError && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/60 text-xs text-rose-300 flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block font-bold mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block font-bold mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter master password"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <span className="text-cyan-400 font-bold">Standard Credentials:</span> username: <code className="text-white">admin</code> / password: <code className="text-white">sande_iq_master</code>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(0,217,255,0.4)] cursor-pointer"
          >
            {isLoading ? 'Verifying...' : isTa ? 'உள்நுழைக' : 'Authenticate & Enter'}
          </button>
        </form>

        <button
          type="button"
          onClick={onExit}
          className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          ← {isTa ? 'முகப்பிற்குத் திரும்பு' : 'Return to App'}
        </button>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-950 border border-blue-500/40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Sand.E IQ Master Control</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                SUPERADMIN AUTHENTICATED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Live Question Engine, Audit Logs & System Health
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>{isTa ? 'வெளியேறு' : 'Log Out'}</span>
          </button>
          <button
            type="button"
            onClick={onExit}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
          >
            {isTa ? 'செயலிக்குச் செல்' : 'Back to App'}
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-blue-900/40 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{isTa ? 'கணினி புள்ளிவிவரங்கள்' : 'System Metrics'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>{isTa ? 'வினா மேலாண்மை' : 'Question Bank'} ({questions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isTa ? 'தணிக்கை பதிவு' : 'Audit Logs'} ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: SYSTEM METRICS */}
      {activeTab === 'stats' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-900/50">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                Active Multiplayer Rooms
              </span>
              <span className="text-3xl font-black text-white font-mono mt-1 block">
                {stats?.activeRooms ?? 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-900/50">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                Managed Custom Questions
              </span>
              <span className="text-3xl font-black text-white font-mono mt-1 block">
                {questions.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-900/50">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                Recorded Security Audits
              </span>
              <span className="text-3xl font-black text-white font-mono mt-1 block">
                {auditLogs.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-900/50">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                Server Uptime
              </span>
              <span className="text-3xl font-black text-emerald-400 font-mono mt-1 block">
                {Math.floor((stats?.systemUptimeSeconds ?? 0) / 60)} mins
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#060a16] border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Engine Status Diagnostics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Core Neural Engine:</span>
                <span className="text-emerald-400 font-bold">ONLINE (v4.2.0)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">AI Assistant Service:</span>
                <span className="text-cyan-300 font-bold">{stats?.aiStatus || 'Connected'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTION BANK MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions by keyword or level..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsAddingQ(!isAddingQ)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingQ ? 'Cancel' : 'Add New Question'}</span>
            </button>
          </div>

          {/* ADD QUESTION FORM */}
          {isAddingQ && (
            <form onSubmit={handleCreateQuestion} className="p-5 rounded-2xl bg-[#060a16] border border-cyan-400/40 space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-cyan-300 font-mono uppercase">
                Create Managed Quiz Question
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    placeholder="e.g. Hexagonal Rotation"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">தலைப்பு (தமிழ்)</label>
                  <input
                    type="text"
                    value={newTitleTa}
                    onChange={(e) => setNewTitleTa(e.target.value)}
                    placeholder="அறுங்கோண சுழற்சி"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Prompt / Question (English)</label>
                  <textarea
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    required
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">வினா விளக்கம் (தமிழ்)</label>
                  <textarea
                    value={newPromptTa}
                    onChange={(e) => setNewPromptTa(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Option 1 {correctOptNum === 1 ? '(CORRECT)' : ''}</label>
                  <input
                    type="text"
                    value={opt1}
                    onChange={(e) => setOpt1(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Option 2 {correctOptNum === 2 ? '(CORRECT)' : ''}</label>
                  <input
                    type="text"
                    value={opt2}
                    onChange={(e) => setOpt2(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Option 3 (Optional)</label>
                  <input
                    type="text"
                    value={opt3}
                    onChange={(e) => setOpt3(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-400">Correct Option:</span>
                {[1, 2, 3].map((num) => (
                  <label key={num} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={correctOptNum === num}
                      onChange={() => setCorrectOptNum(num as any)}
                    />
                    <span>Option {num}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold cursor-pointer shadow-md"
              >
                Publish Question to Bank
              </button>
            </form>
          )}

          {/* QUESTIONS LIST */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">{q.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-cyan-300 border border-cyan-400/30">
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{q.prompt}</p>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 pt-1">
                    <span>{q.options.length} Options</span>
                    <span>·</span>
                    <span className="text-emerald-400">
                      Correct: {q.options.find((o) => o.isCorrect)?.text}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer shrink-0"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400">
            Recorded security events and administrative actions:
          </div>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-cyan-300 font-bold shrink-0">
                    {log.action}
                  </span>
                  <span className="text-slate-300 truncate">{log.details}</span>
                </div>
                <div className="text-slate-500 shrink-0 text-[11px]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
