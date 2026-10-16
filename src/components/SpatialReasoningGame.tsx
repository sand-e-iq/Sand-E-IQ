import React, { useState } from 'react';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { triggerConfetti } from '../utils/confetti';
import {
  saveScoreToLeaderboard,
  addXP,
  recordCategoryPerformance,
  getUserProfile,
} from '../utils/storage';
import {
  Box,
  Compass,
  RotateCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Brain,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface Props {
  currentLang: AppLanguage;
  onWin: (stats: {
    mode: 'spatial';
    difficulty: 'easy' | 'medium' | 'hard';
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  }) => void;
  onOpenAIAssistant: (contextQuestion?: string) => void;
}

interface SpatialChallenge {
  id: string;
  title: string;
  titleTa: string;
  prompt: string;
  promptTa: string;
  asciiVisual?: string;
  options: { id: string; text: string; textTa: string; isCorrect: boolean }[];
  explanation: string;
  explanationTa: string;
}

const SPATIAL_CHALLENGES: SpatialChallenge[] = [
  {
    id: 'spat-1',
    title: '3D Cube Net Folding',
    titleTa: 'கனசதுர வலை மடிப்பு',
    prompt: 'Imagine folding a cross-shaped net of 6 squares into a 3D cube. If face A is on the bottom, which face ends up on the TOP opposite face?',
    promptTa: '6 சதுரங்கள் கொண்ட சிலுவை வடிவ வலையை கனசதுரமாக மடித்தால், தரைப்பகுதியில் (Bottom) முகம் A இருந்தால், அதற்கு நேர் எதிரான மேல் பகுதியில் (Top) எந்த முகம் அமையும்?',
    asciiVisual: `
      [ C ]
  [ B ][ A ][ D ][ F ]
      [ E ]
    `,
    options: [
      { id: 'opt-1', text: 'Face F (Two squares away on the arm)', textTa: 'முகம் F (இரண்டு சதுரங்கள் தள்ளி உள்ள முகம்)', isCorrect: true },
      { id: 'opt-2', text: 'Face B (Adjacent neighbor)', textTa: 'முகம் B (அருகில் உள்ள பக்கம்)', isCorrect: false },
      { id: 'opt-3', text: 'Face C (Adjacent upper wing)', textTa: 'முகம் C (மேல் பக்கம்)', isCorrect: false },
      { id: 'opt-4', text: 'Face E (Adjacent lower wing)', textTa: 'முகம் E (கீழ் பக்கம்)', isCorrect: false },
    ],
    explanation: 'When folding a standard 4-in-a-row net, opposite faces are separated by exactly one square. Face A is opposite Face F.',
    explanationTa: 'ஒரு வரிசையில் உள்ள சதுரங்களை மடிக்கும் போது, ஒரு சதுரம் இடைவெளி விட்டு அமையும் முகங்களே நேர் எதிரெதிர் முகங்களாக வரும். எனவே A-க்கு எதிரே F அமையும்.',
  },
  {
    id: 'spat-2',
    title: '90° Clockwise Spatial Rotation',
    titleTa: '90° கடிகார திசை முப்பரிமாண சுழற்சி',
    prompt: 'An asymmetric "L"-shaped block in 3D coordinates (facing North with its short foot pointing East) is rotated 90° clockwise horizontally. Where is the short foot pointing now?',
    promptTa: 'வடக்கு நோக்கி உள்ள ஒரு "L" வடிவ முப்பரிமாண கட்டையின் சிறிய கால் கிழக்கு நோக்கி உள்ளது. இதனை 90° கடிகார திசையில் கிடைமட்டமாக சுழற்றினால், அதன் சிறிய கால் இப்போது எந்த திசையை நோக்கும்?',
    options: [
      { id: 'opt-1', text: 'South (East rotated 90° clockwise)', textTa: 'தெற்கு (கிழக்கு 90° கடிகார திசையில் சுழன்றால் தெற்கு)', isCorrect: true },
      { id: 'opt-2', text: 'West', textTa: 'மேற்கு', isCorrect: false },
      { id: 'opt-3', text: 'North', textTa: 'வடக்கு', isCorrect: false },
      { id: 'opt-4', text: 'East', textTa: 'கிழக்கு', isCorrect: false },
    ],
    explanation: 'A 90° clockwise rotation shifts coordinates: North -> East, East -> South, South -> West, West -> North. The foot at East moves to South.',
    explanationTa: '90° கடிகார திசை சுழற்சியில் கிழக்கு திசை தெற்காக மாறும். எனவே சிறிய கால் தெற்கு நோக்கி இருக்கும்.',
  },
  {
    id: 'spat-3',
    title: 'Top-Down Orthographic Projection',
    titleTa: 'மேலிருந்து பார்க்கும் ஆர்த்தோகிராபிக் பார்வை',
    prompt: 'A solid pyramid rests on top of a cylinder of equal diameter. If viewed directly from ABOVE (orthographic bird’s eye view), what 2D shape is visible?',
    promptTa: 'ஒரு உருளையின் மேல் அதே விட்டம் கொண்ட பிரமிடு வைக்கப்பட்டுள்ளது. இதனை சரியாக மேலிருந்து (Bird’s Eye View) பார்த்தால் என்ன வடிவம் தெரியும்?',
    options: [
      { id: 'opt-1', text: 'A square inside a circle with intersecting diagonal apex lines', textTa: 'ஒரு வட்டத்தின் உள்ளே குறுக்குக் கோடுகள் கொண்ட சதுரம் (மைய உச்சி)', isCorrect: true },
      { id: 'opt-2', text: 'A plain solid rectangle', textTa: 'செவ்வகம்', isCorrect: false },
      { id: 'opt-3', text: 'Only a circle with nothing inside', textTa: 'வெற்று வட்டம் மட்டுமே', isCorrect: false },
      { id: 'opt-4', text: 'Two separate triangles', textTa: 'இரண்டு தனித்தனி முக்கோணங்கள்', isCorrect: false },
    ],
    explanation: 'From directly above, the circular base forms the outer perimeter, and the four sloping edges of the pyramid meet as diagonal cross lines at the central apex point.',
    explanationTa: 'மேலிருந்து பார்க்கும் போது உருளையின் விளிம்பு வட்டமாகவும், பிரமிட்டின் 4 பக்க சரிவுகள் மைய உச்சியில் சந்திக்கும் குறுக்குக் கோடுகளாகவும் தெரியும்.',
  },
];

export const SpatialReasoningGame: React.FC<Props> = ({ currentLang, onWin, onOpenAIAssistant }) => {
  const isTa = currentLang === 'ta';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQ = SPATIAL_CHALLENGES[currentIndex];

  const handleSelect = (optId: string) => {
    if (answered) return;
    setSelectedOption(optId);
    setAnswered(true);

    const chosen = currentQ.options.find((o) => o.id === optId);
    const isCorrect = Boolean(chosen?.isCorrect);
    recordCategoryPerformance('spatial', isCorrect, 15);

    if (isCorrect) {
      sound.playSuccess();
      setScore((s) => s + 750);
      setCorrectCount((c) => c + 1);
    } else {
      sound.playError();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= SPATIAL_CHALLENGES.length) {
      finish();
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
    setAnswered(false);
  };

  const finish = () => {
    triggerConfetti();
    const acc = Math.round((correctCount / SPATIAL_CHALLENGES.length) * 100);
    const iq = 110 + Math.round((acc / 100) * 30);
    addXP(score * 0.3);

    const profile = getUserProfile();
    saveScoreToLeaderboard({
      playerName: profile.playerName || 'Player 1',
      mode: 'spatial' as any,
      difficulty: 'hard',
      score,
      iqEstimate: iq,
      timeSeconds: 60,
      accuracy: acc,
      notes: 'Spatial Reasoning Master',
    });

    onWin({
      mode: 'spatial' as any,
      difficulty: 'hard',
      score,
      iqEstimate: iq,
      timeSeconds: 60,
      accuracy: acc,
      title: '3D Spatial Geometry Master',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#0a152d] via-[#050505] to-[#050505] border border-blue-500/40 shadow-[0_0_35px_rgba(0,102,255,0.25)] flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            <span>SAND.E IQ · SPATIAL & 3D REASONING</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isTa ? 'இடஞ்சார்ந்த முப்பரிமாண தர்க்கம்' : '3D Spatial Geometry & Mental Rotation'}
          </h2>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
          <span className="text-[10px] font-mono text-cyan-400 uppercase">Score</span>
          <div className="text-lg font-black text-white">{score}</div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/80 border border-blue-900/50 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
            Challenge {currentIndex + 1} of {SPATIAL_CHALLENGES.length}
          </span>
          <button
            type="button"
            onClick={() => speech.speak(isTa ? currentQ.promptTa : currentQ.prompt, isTa ? 'ta' : 'en')}
            className="p-1.5 rounded-lg bg-blue-500/20 text-cyan-300 text-xs flex items-center gap-1"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isTa ? 'கேள்வி வாசி' : 'Listen'}</span>
          </button>
        </div>

        <h3 className="text-lg font-bold text-white">
          {isTa ? currentQ.titleTa : currentQ.title}
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          {isTa ? currentQ.promptTa : currentQ.prompt}
        </p>

        {currentQ.asciiVisual && (
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800 whitespace-pre text-center">
            {currentQ.asciiVisual}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            let btnStyle = 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-200';
            if (answered) {
              if (opt.isCorrect) btnStyle = 'bg-emerald-950/60 border-emerald-400 text-emerald-300 font-bold';
              else if (isSelected) btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300 line-through';
            } else if (isSelected) {
              btnStyle = 'bg-blue-600/40 border-cyan-400 text-white';
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={answered}
                onClick={() => handleSelect(opt.id)}
                className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <span>{isTa ? opt.textTa : opt.text}</span>
                {answered && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1.5" />}
                {answered && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-1.5" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-cyan-500/30 space-y-3 animate-fade-in">
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-300 block mb-1">
                {isTa ? 'தர்க்க விளக்கம்:' : 'Spatial Deduction Solution:'}
              </strong>
              {isTa ? currentQ.explanationTa : currentQ.explanation}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentIndex + 1 >= SPATIAL_CHALLENGES.length ? (isTa ? 'முடிக்கவும்' : 'Finish') : (isTa ? 'அடுத்தது' : 'Next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
