import React from 'react';
import { AppLanguage } from '../types/i18n';
import { AppLogo } from './AppLogo';
import {
  X,
  Smartphone,
  CheckCircle2,
  Download,
  Share2,
  PlusSquare,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang: AppLanguage;
  deferredPrompt: any;
  onTriggerInstall: () => void;
}

export const InstallAppModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLang,
  deferredPrompt,
  onTriggerInstall,
}) => {
  if (!isOpen) return null;

  const isTa = currentLang === 'ta';
  const isIos =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#030712] border-2 border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(37,99,235,0.25)] relative space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with App Logo */}
        <div className="flex items-center gap-4">
          <AppLogo variant="icon" size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400">
                Progressive Web App
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">By Arunan S</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isTa ? 'Sand.E செயலியை நிறுவுங்கள்' : 'Install Sand.E App'}
            </h2>
          </div>
        </div>

        {/* Benefits List */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>100% Offline · Works without any internet connection</span>
          </div>
          <div className="flex items-center gap-2.5 text-cyan-400 font-semibold">
            <Zap className="w-4 h-4 shrink-0" />
            <span>Instant Home Screen Launch · Full screen native app feel</span>
          </div>
          <div className="flex items-center gap-2.5 text-amber-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Progress automatically saved across sessions</span>
          </div>
        </div>

        {/* Direct Action or Platform Instructions */}
        {deferredPrompt ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={onTriggerInstall}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isTa ? 'இப்போதே நிறுவுக (Install Now)' : 'Install Arunan IQ Now'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Your browser will prompt to confirm installation to your home screen or desktop.
            </p>
          </div>
        ) : isIos ? (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
            <div className="font-bold text-white flex items-center gap-1.5 text-sm">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>iOS Safari Installation Steps:</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 leading-relaxed text-slate-300">
              <li>
                Tap the <strong className="text-white">Share button</strong> (square with arrow up) at the bottom of Safari.
              </li>
              <li>
                Scroll down in the share sheet and tap <strong className="text-white">"Add to Home Screen"</strong>.
              </li>
              <li>
                Tap <strong className="text-white">Add</strong> in the top right corner.
              </li>
            </ol>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
            <div className="font-bold text-white flex items-center gap-1.5 text-sm">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Browser Installation:</span>
            </div>
            <p className="leading-relaxed">
              Open your browser menu (⋮ or ⋯) and click <strong className="text-white">"Install Arunan IQ"</strong> or <strong className="text-white">"Add to Home screen"</strong>.
            </p>
          </div>
        )}

        <div className="pt-2 text-center text-[11px] text-slate-500 font-mono">
          Made by Arunan S · Arunan IQ Progressive Web App
        </div>
      </div>
    </div>
  );
};
