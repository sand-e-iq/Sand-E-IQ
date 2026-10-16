import React from 'react';
import { AppLanguage, LANGUAGES } from '../types/i18n';
import { sound } from '../utils/audio';
import { X, Check, Globe2, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
}

export const LanguageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  const isTa = currentLang === 'ta';

  const descriptions: Record<AppLanguage, string> = {
    ta: 'முழுமையான தமிழ் விளக்கம், துப்பறியும் அருணன் கதைகள், சுட்டி IQ மற்றும் எளிய ஆங்கிலப் பயிற்சிகள்.',
    en: 'Complete English experience with logic grids, Detective Arunan mysteries, and cognitive assessments.',
    fr: 'Expérience complète en français avec énigmes policières, grilles logiques et tests de QI.',
    es: 'Modo completo en español con acertijos policiales, cuadrículas de deducción y pruebas cognitivas.',
    hi: 'हिन्दी में जासूस अरूनन रहस्य पहेलियाँ, बाल IQ और तर्क क्षमता अभ्यास।',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#050505] border-2 border-blue-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,102,255,0.25)] relative space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick(440);
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(0,217,255,0.2)]">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{isTa ? 'மொழியைத் தேர்வு செய்க' : 'Choose App Language'}</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h2>
            <p className="text-xs text-slate-400">
              {isTa
                ? 'முதன்மை மொழி ஆங்கிலம் (English) அல்லது தமிழ் மற்றும் பிற மொழிகள்'
                : 'Main language is English · Instant switch to Tamil or other languages'}
            </p>
          </div>
        </div>

        {/* Language Options Grid */}
        <div className="grid grid-cols-1 gap-3">
          {LANGUAGES.map((item) => {
            const isSelected = currentLang === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  onSelectLanguage(item.code);
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,217,255,0.25)]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-blue-500/50 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl select-none">{item.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-white">
                        {item.nativeName}
                      </span>
                      <span className="text-xs font-mono text-cyan-300 font-semibold">
                        ({item.name})
                      </span>
                      {item.code === 'en' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-cyan-400/40">
                          Main / Default
                        </span>
                      )}
                      {item.code === 'ta' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40">
                          தமிழ்
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {descriptions[item.code]}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isSelected ? (
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-[0_0_12px_rgba(0,217,255,0.5)]">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-xs text-slate-500 font-mono">
                      {item.code.toUpperCase()}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Tip / Footer */}
        <div className="p-3 rounded-xl bg-slate-950/90 border border-blue-900/40 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            {isTa
              ? '✓ தேர்வு செய்தவுடன் அனைத்துப் பக்கங்களும் உடனடியாக மாறும்'
              : '✓ Instant switch across all tests, games, and explanations'}
          </span>
          <span className="font-mono text-cyan-400 font-bold">100% Offline</span>
        </div>
      </div>
    </div>
  );
};
