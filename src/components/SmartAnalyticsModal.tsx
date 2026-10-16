import React from 'react';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import { getCategoryAnalytics, getUserProfile } from '../utils/storage';
import {
  BarChart3,
  Brain,
  Target,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Award,
  ArrowRight,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang: AppLanguage;
  onLaunchPersonalizedQuiz: (category: string) => void;
}

export const SmartAnalyticsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLang,
  onLaunchPersonalizedQuiz,
}) => {
  if (!isOpen) return null;

  const isTa = currentLang === 'ta';
  const profile = getUserProfile();
  const analytics = getCategoryAnalytics();

  const handleStartWorkout = (catName: string) => {
    sound.playClick(520);
    onClose();
    onLaunchPersonalizedQuiz(catName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#0a142e] via-[#050505] to-[#050505] border border-blue-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,102,255,0.3)] my-auto max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-400/40">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{isTa ? 'அறிவுத்திறன் நுண்ணறிவு & பகுப்பாய்வு' : 'Smart Cognitive Analytics'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-cyan-400/30">
                  {analytics.overallAccuracy}% {isTa ? 'ஒட்டுமொத்த துல்லியம்' : 'Overall Acc'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isTa
                  ? 'பிரிவுவாரியான பலங்கள், பலவீனங்கள் மற்றும் தனிப்பயனாக்கப்பட்ட பயிற்சி பரிந்துரைகள்'
                  : 'Domain-specific performance radar, cognitive weaknesses & personalized workouts'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 mt-4">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-blue-900/50 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                {isTa ? 'விளையாடிய சுற்றுகள்' : 'Total Rounds'}
              </div>
              <div className="text-xl font-black text-white mt-1">
                {profile.gamesPlayed || 0}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-blue-900/50 text-center">
              <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                {isTa ? 'உச்ச நுண்ணறிவு மதிப்பீடு' : 'Peak Score Index'}
              </div>
              <div className="text-xl font-black text-cyan-300 mt-1">
                {profile.highestIQ || 100}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-blue-900/50 text-center">
              <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                {isTa ? 'தொடர் சாதனை' : 'Daily Streak'}
              </div>
              <div className="text-xl font-black text-amber-300 mt-1">
                {profile.dailyStreak || 0} 🔥
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-blue-900/50 text-center">
              <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                {isTa ? 'வெற்றி விகிதம்' : 'Win Rate'}
              </div>
              <div className="text-xl font-black text-emerald-300 mt-1">
                {profile.gamesPlayed > 0 ? Math.round((profile.gamesWon / profile.gamesPlayed) * 100) : 100}%
              </div>
            </div>
          </div>

          {/* Personalized Workout Callout (Feature 7) */}
          {analytics.weakestCategory && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-purple-950/70 border border-cyan-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_25px_rgba(0,102,255,0.25)]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-400/30">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{isTa ? 'தனிப்பயனாக்கப்பட்ட பயிற்சி பரிந்துரை' : 'Targeted Practice Recommendation'}</span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  {isTa ? 'கவனம் தேவைப்படும் பகுதி:' : 'Focus Area:'}{' '}
                  <span className="text-cyan-300">
                    {isTa ? analytics.weakestCategory.categoryTa : analytics.weakestCategory.category}
                  </span>{' '}
                  ({analytics.weakestCategory.accuracy}% {isTa ? 'துல்லியம்' : 'Acc'})
                </h3>
                <p className="text-xs text-slate-300">
                  {isTa
                    ? 'உங்கள் தர்க்க திறனை சமநிலைப்படுத்த 5 கேள்விகள் கொண்ட பிரத்யேக பயிற்சியைத் தொடங்குங்கள்.'
                    : 'Reinforce this cognitive skill with an adaptive 5-question targeted workout session.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleStartWorkout(analytics.weakestCategory!.category)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(0,217,255,0.4)] flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>{isTa ? 'பயிற்சியைத் தொடங்கு' : 'Start Workout'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Category-by-Category Accuracies */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isTa ? 'பிரிவுவாரியான துல்லிய பகுப்பாய்வு' : 'Domain Cognitive Accuracies'}</span>
            </h3>

            <div className="space-y-2.5">
              {analytics.categories.map((cat) => {
                let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
                if (cat.strengthRating === 'Developing') badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-400/30';
                if (cat.strengthRating === 'Needs Practice') badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-400/30';

                return (
                  <div
                    key={cat.category}
                    className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg p-1 rounded-lg bg-slate-900 border border-slate-800">
                          {cat.icon}
                        </span>
                        <div>
                          <div className="font-bold text-white">
                            {isTa ? cat.categoryTa : cat.category}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {cat.totalAnswered} {isTa ? 'பதிலளித்த கேள்விகள்' : 'answered'} · {cat.averageTimeSeconds}s avg
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badgeColor}`}>
                          {cat.strengthRating}
                        </span>
                        <span className="font-mono text-sm font-black text-cyan-300">
                          {cat.accuracy}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
                        style={{ width: `${cat.accuracy}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
