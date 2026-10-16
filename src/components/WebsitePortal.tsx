import React from 'react';
import { AppLanguage } from '../types/i18n';
import { GameMode } from '../types/game';
import { AppLogo } from './AppLogo';
import {
  Sparkles,
  Smartphone,
  Globe2,
  Brain,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle2,
  Award,
  ArrowRight,
  Download,
  BookOpen,
  Laptop,
  Check,
  Search,
  Grid3X3,
  Languages,
  Calendar,
  Activity,
  RefreshCw,
  Lock,
} from 'lucide-react';

interface Props {
  currentLang: AppLanguage;
  onLaunchMode: (mode: GameMode) => void;
  onOpenInstall: () => void;
  isInstallable: boolean;
  onSelectLanguage?: (lang: AppLanguage) => void;
  onOpenSafetyModal?: (tab?: 'safety' | 'updates' | 'scan') => void;
}

export const WebsitePortal: React.FC<Props> = ({
  currentLang,
  onLaunchMode,
  onOpenInstall,
  isInstallable,
  onSelectLanguage,
  onOpenSafetyModal,
}) => {
  const isTa = currentLang === 'ta';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';
  const isHi = currentLang === 'hi';

  const modes = [
    {
      id: 'quiz' as GameMode,
      icon: '⚡',
      title: isTa ? 'Sand.E IQ தர்க்க வினாடி வினா' : 'Sand.E IQ Interactive Quiz',
      badge: isTa ? 'எளிது · நடுத்தரம் · கடினம்' : 'Easy · Medium · Hard',
      color: 'from-blue-600/25 to-cyan-500/20 border-cyan-400/40 text-cyan-300',
      description: isTa
        ? 'நேரக் கணிப்பான், உடனடி விளக்கம், மற்றும் துல்லிய மதிப்பெண்களுடன் கூடிய பலதெரிவு தர்க்க வினாடி வினா.'
        : 'Dynamic countdown timer, instant feedback explanations, and scoring across Easy, Medium, and Hard tiers.',
    },
    {
      id: 'braingames' as GameMode,
      icon: '🎮',
      title: isTa ? '8 ஊடாடும் மூளை விளையாட்டுகள்' : '8 Interactive Brain Games',
      badge: isTa ? 'அட்டைப் பொருத்தம் & கணிதம்' : 'Memory, Speed & Logic',
      color: 'from-cyan-600/25 to-blue-500/20 border-cyan-400/40 text-cyan-300',
      description: isTa
        ? 'நினைவக அட்டைப் பொருத்தம், எண் தொடர், வடிவ அடையாளம், தர்க்க புதிர், எதிர்வினை வேகம், மின்னல் கணிதம், பொருந்தாத ஒன்று மற்றும் காட்சி நினைவாற்றல்.'
        : 'Memory cards, number sequences, pattern recognition, logic puzzles, reaction time, quick maths, odd one out, and visual memory.',
    },
    {
      id: 'multiplayer' as GameMode,
      icon: '👥',
      title: isTa ? 'நேரலை மல்டிபிளேயர் அரங்கம்' : 'Real-Time Multiplayer Arena',
      badge: isTa ? 'அறைக்குறியீடு பகிர்வு' : 'Room Code Sync',
      color: 'from-indigo-600/25 to-purple-500/20 border-indigo-400/40 text-indigo-300',
      description: isTa
        ? 'தனிப்பட்ட அறைக்குறியீட்டை நண்பர்களுக்குப் பகிருங்கள்; நேரலையில் ஒன்றாக வினாக்களுக்கு விடையளித்து நேரலை வெற்றிப்பலகையில் போட்டியிடுங்கள்.'
        : 'Host or join private room matches with real-time question synchronization, instant scoring, and live leaderboards.',
    },
    {
      id: 'daily' as GameMode,
      icon: '📅',
      title: isTa ? 'தினசரி மூளைப் புதிர் (Daily Puzzle)' : 'Daily Brain Puzzle',
      badge: isTa ? 'தொடர் சாதனை' : 'Consecutive Streaks',
      color: 'from-amber-500/25 to-orange-500/20 border-amber-400/40 text-amber-300',
      description: isTa
        ? 'ஒவ்வொரு நாளும் புதிய தர்க்க புதிர், தொடர் வெற்றி கண்காணிப்பு மற்றும் உடனடி பகுப்பாய்வு தீர்வுகள்.'
        : 'Unique daily logic riddles, sequence matrices, and streak tracking to keep your mind razor-sharp.',
    },
    {
      id: 'memory' as GameMode,
      icon: '🧠',
      title: isTa ? 'நினைவாற்றல் கட்ட ஆட்டம் (Memory Matrix)' : 'Spatial Memory Matrix',
      badge: isTa ? '10 நிலைகள்' : 'Adaptive Tiers 1-10',
      color: 'from-purple-600/25 to-indigo-500/20 border-purple-400/40 text-purple-300',
      description: isTa
        ? 'ஒளிரும் நியான் கட்டங்களை நினைவில் வைத்துப் பதிக்கும் காட்சி நினைவாற்றல் மற்றும் அறிவாற்றல் பயிற்சி.'
        : 'Flash and recall spatial node coordinates across progressive grids to systematically strengthen working memory.',
    },
    {
      id: 'child' as GameMode,
      icon: '⭐',
      title: isTa
        ? 'சுட்டி IQ (Child IQ)'
        : isFr
        ? 'Enfant QI (Facile)'
        : isEs
        ? 'Niño CI (Fácil)'
        : isHi
        ? 'बाल IQ (सरल)'
        : 'Child IQ (Junior Logic)',
      badge: isTa ? 'வயது 4 - 12' : 'Ages 4 - 12',
      color: 'from-amber-500/20 to-pink-500/10 border-amber-500/30 text-amber-300',
      description: isTa
        ? 'வண்ணமயமான விலங்குகள், வடிவங்கள், எண்ணியல் மற்றும் 3x3 மினி-கட்டப் புதிர்கள். குழந்தைகளுக்கான குரல் வாசிப்பு வசதி.'
        : 'Vibrant animal logic, geometric shapes, visual math, and speech read-aloud for young inquisitive minds.',
    },
    {
      id: 'detective' as GameMode,
      icon: '🕵️‍♂️',
      title: isTa
        ? 'துப்பறியும் Arunan (Detective Arunan)'
        : isFr
        ? 'Détective Arunan'
        : isEs
        ? 'Detective Arunan'
        : isHi
        ? 'जासूस अरूनन'
        : 'Detective Arunan',
      badge: isTa ? 'முதன்மைக் கதை' : 'Flagship Riddles',
      color: 'from-red-600/20 to-amber-500/15 border-red-500/40 text-red-300',
      description: isTa
        ? 'செட்டிநாடு மாளிகை, சென்னை எக்ஸ்பிரஸ் என தமிழ் பாரம்பரிய மர்மக் கதைகள்! சாட்சிகளை விசாரித்து உண்மையான குற்றவாளியைக் கண்டறியுங்கள்.'
        : 'Compelling detective casefiles with suspects, interrogations, forensic clues, and deductive mystery solving.',
    },
    {
      id: 'english' as GameMode,
      icon: '📚',
      title: isTa
        ? 'சுலப ஆங்கிலக் கல்வி (Easy English)'
        : isFr
        ? 'Anglais Facile et Correct'
        : isEs
        ? 'Inglés Fácil y Correcto'
        : isHi
        ? 'सरल एवं सही अंग्रेज़ी'
        : 'Easy & Correct English',
      badge: isTa ? '3 நிலைகள்' : 'Easy · Medium · Hard',
      color: 'from-indigo-600/20 to-purple-600/15 border-indigo-500/30 text-indigo-300',
      description: isTa
        ? 'சரியான இலக்கணம், பொதுவான பிழைகள், தினசரி உரையாடல் மற்றும் உச்சரிப்புப் பயிற்சி. எளிய தமிழ் விளக்கங்களுடன்.'
        : 'Practical grammar rules, common error corrections, real-world conversational phrases, and audio pronunciation.',
    },
    {
      id: 'grid' as GameMode,
      icon: '⬛',
      title: isTa
        ? 'கட்ட தர்க்கம் (Nonogram Grid)'
        : isFr
        ? 'Logique Binaire (Nonogramme)'
        : isEs
        ? 'Lógica Nonograma'
        : isHi
        ? 'ग्रिड कटौती पहेली'
        : 'Grid Deduction (Nonogram)',
      badge: '5x5 - 8x8',
      color: 'from-cyan-600/20 to-blue-600/15 border-cyan-500/30 text-cyan-300',
      description: isTa
        ? 'வரிசை மற்றும் நெடுவரிசை எண்களைக் கொண்டு மறைந்துள்ள படங்களை நிரப்பும் முறை. விதிகளின்படி பச்சை நிறத்தில் ஒளிரும் உதவி.'
        : 'Pure mathematical deductive logic. Fill blocks or mark crosses based on numerical run constraints.',
    },
    {
      id: 'pattern' as GameMode,
      icon: '🔷',
      title: isTa
        ? 'பேட்டர்ன் மேட்ரிக்ஸ் (Raven Matrices)'
        : isFr
        ? 'Matrices Progressives'
        : isEs
        ? 'Matrices Progresivas'
        : isHi
        ? 'पैटर्न मैट्रिक्स'
        : "Pattern Matrix (Raven's)",
      badge: 'Spatial & Geometry',
      color: 'from-sky-600/20 to-indigo-600/15 border-sky-500/30 text-sky-300',
      description: isTa
        ? 'சுழற்சி, சமச்சீர்மை, உருமாற்றம் மற்றும் தருக்க உறவுகளை அடையாளம் காணும் உலகளாவிய அறிவாற்றல் சோதனை.'
        : 'Abstract 3x3 matrices testing spatial transformation, rotational symmetry, XOR overlap, and shape distribution.',
    },
    {
      id: 'sequence' as GameMode,
      icon: '🔢',
      title: isTa
        ? 'எண் தொடர்கள் (Sequences)'
        : isFr
        ? 'Suites Mathématiques'
        : isEs
        ? 'Secuencias Numéricas'
        : isHi
        ? 'गणितीय श्रृंखला'
        : 'Cognitive Sequences',
      badge: 'Math Induction',
      color: 'from-violet-600/20 to-pink-600/15 border-violet-500/30 text-violet-300',
      description: isTa
        ? 'மறைக்கப்பட்ட கணிதத் தொடர்களின் சூத்திரங்களைக் கண்டறியும் துப்பறிவு ஆற்றல்.'
        : 'Polynomial progressions, Fibonacci recurrences, alternating operation gates, and logical number induction.',
    },
    {
      id: 'assessment' as GameMode,
      icon: '🧠',
      title: isTa
        ? 'முழு IQ மதிப்பீடு (Standard Battery)'
        : isFr
        ? 'Évaluation Complète du QI'
        : isEs
        ? 'Evaluación Integral del CI'
        : isHi
        ? 'मानकीकृत IQ मूल्यांकन'
        : 'Comprehensive IQ Battery',
      badge: '8 Psychometric Domains',
      color: 'from-emerald-600/20 to-teal-600/15 border-emerald-500/30 text-emerald-300',
      description: isTa
        ? 'மென்சா தரநிலைக்கு ஒப்பான 8 பரிமாண உளவியல் தேர்வு. சதவீதத் தகுதி மற்றும் விரிவான பகுப்பாய்வு அறிக்கை.'
        : 'Standardized 8-domain evaluation measuring spatial, numerical, inductive, and memory abilities on an SD 15 scale.',
    },
  ];

  return (
    <div className="space-y-16 py-4 animate-fade-in w-full min-w-0 max-w-full overflow-hidden">
      {/* 1. Hero Landing Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#020617] via-[#030712] to-slate-950 border border-blue-900/50 p-6 sm:p-12 text-center shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-blue-950/10 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 flex flex-col items-center">
          {/* Official Logo Display */}
          <AppLogo variant="badge" className="shadow-2xl hover:scale-105 transition-transform" />

          {/* Creator Attribution Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 text-xs sm:text-sm font-semibold font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>
              {isTa
                ? 'வடிவமைப்பு & உருவாக்கம்: Arunan S (Made by Arunan S)'
                : 'Conceived & Built by Arunan S · Official App & Website'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {isTa
              ? 'Sand.E: மூளைத்திறன் & தர்க்கப் புதிர்களின் அரங்கம்'
              : 'Sand.E · Brain & Logic Puzzle Arena'}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            {isTa
              ? 'குழந்தைகளுக்கான சுட்டி IQ, துப்பறியும் மர்மக் கதைகள், எளிமையான ஆங்கிலக் கல்வி மற்றும் மென்சா அளவுகோல் IQ சோதனைகள் கொண்ட 100% ஆஃப்லைன் செயலி மற்றும் இணையதளம்.'
              : 'A 100% offline Progressive Web App and website uniting Child IQ, detective mystery riddles, practical English learning, and Mensa-aligned psychometric logic.'}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onLaunchMode('child')}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-xl hover:shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>⭐ {isTa ? 'ஆட்டத்தைத் தொடங்கு' : 'Play App Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenInstall}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-white border border-slate-700 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>{isTa ? 'செயலியை நிறுவு (Install App)' : 'Install as PWA App'}</span>
            </button>
          </div>

          {/* Quick Pillars Feature Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 w-full max-w-3xl text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-emerald-400 font-black text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Offline</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Zero internet required once opened</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-cyan-400 font-black text-sm flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 shrink-0" />
                  <span>5 Languages</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">1-tap</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {[
                  { code: 'ta' as AppLanguage, label: '🇮🇳 தமிழ்' },
                  { code: 'en' as AppLanguage, label: '🇬🇧 EN' },
                  { code: 'fr' as AppLanguage, label: '🇫🇷 FR' },
                  { code: 'es' as AppLanguage, label: '🇪🇸 ES' },
                  { code: 'hi' as AppLanguage, label: '🇮🇳 HI' },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => onSelectLanguage && onSelectLanguage(item.code)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentLang === item.code
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-amber-400 font-black text-sm flex items-center gap-1.5">
                <Zap className="w-4 h-4 shrink-0" />
                <span>Auto-Saved</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Resume exact level upon return</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-blue-400 font-black text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 shrink-0" />
                <span>Arunan S</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Independent creator & developer</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Made by Arunan S - Creator Spotlight */}
      <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-[#02040a] border-2 border-blue-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold uppercase tracking-wider">
                Creator Profile
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400 font-mono">Arunan S</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isTa ? 'ஆக்கியவர்: அருணன் எஸ் (Arunan S)' : 'Made by Arunan S'}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {isTa
                ? 'அருணன் எஸ் அவர்களால் உருவாக்கப்பட்ட இந்த செயலியும் இணையதளமும், அனைத்து வயதினரின் தருக்க சிந்தனை, மொழித்திறன் மற்றும் மூளை ஆற்றலை வளர்க்கும் நோக்கில் உருவாக்கப்பட்டது. விளம்பரங்கள் இன்றி, முழுமையாக ஆஃப்லைனில் செயல்படும் வகையில் வடிவமைக்கப்பட்டுள்ளது.'
                : 'Crafted with precision by Arunan S to provide world-class cognitive logic, deductive mystery puzzles, and language enrichment without ads, telemetry, or internet dependencies. Accessible worldwide across five major international languages.'}
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono text-slate-300">
              <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700">
                ✓ PWA Certified
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700">
                ✓ Child & Adult Safe
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700">
                ✓ Instant Level Resume
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700">
                ✓ Local High Score Vault
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-col items-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#c41622] to-red-800 flex items-center justify-center text-white shadow-xl mb-3 border-2 border-red-400/40">
              <span className="font-serif font-black text-3xl">AI</span>
            </div>
            <div className="font-bold text-white text-base">Arunan IQ</div>
            <div className="text-xs text-red-300 font-mono">By Arunan S</div>
            <div className="text-[11px] text-slate-400 mt-2 max-w-[180px]">
              Available as mobile app & browser website
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 7 Cognitive Game Modes Showcase */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            {isTa ? '7 சிந்தனைப் பிரிவுகள்' : 'Explore All 7 Game Modes'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isTa ? 'அருணன் IQ-வின் சிறப்பு அம்சங்கள்' : 'Comprehensive Mental Modules'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Each mode targets specific neurological and cognitive logic faculties, from elementary visual recognition to Mensa-grade abstract matrix analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modes.map((m) => (
            <div
              key={m.id}
              className={`p-6 rounded-3xl bg-gradient-to-br ${m.color} bg-slate-900/60 border flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{m.icon}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-950/80 border border-slate-800 text-slate-300">
                    {m.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white">{m.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => onLaunchMode(m.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950/90 hover:bg-white hover:text-slate-950 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-slate-800 cursor-pointer shadow"
                >
                  <span>{isTa ? 'இந்த பிரிவை விளையாடு' : 'Play This Mode'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Progressive Web App (PWA) & Website Installation Guide */}
      <section className="p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-8">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" />
            <span>Progressive Web App Guide</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isTa
              ? 'உங்கள் மொபைல் அல்லது கணினியில் நிறுவுவது எப்படி?'
              : 'Install Arunan IQ on Your Phone or Desktop'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Arunan IQ functions both as an online website and an installable app. You get an app icon on your home screen, full screen gameplay, and complete offline availability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Android */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Smartphone className="w-4 h-4" />
              <span>Android (Chrome / Edge)</span>
            </div>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Tap the three dots (⋮) menu in Chrome.</li>
              <li>Select <strong className="text-white">"Install App"</strong> or <strong className="text-white">"Add to Home screen"</strong>.</li>
              <li>Arunan IQ will install instantly like a native app.</li>
            </ol>
          </div>

          {/* iPhone / iOS */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Smartphone className="w-4 h-4" />
              <span>iPhone & iPad (Safari)</span>
            </div>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Open this website in Safari.</li>
              <li>Tap the <strong className="text-white">Share button (⎋)</strong> at the bottom.</li>
              <li>Scroll down and tap <strong className="text-white">"Add to Home Screen (⊞)"</strong>.</li>
            </ol>
          </div>

          {/* Desktop */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Laptop className="w-4 h-4" />
              <span>Windows, Mac & Chromebook</span>
            </div>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Look for the install icon (⊕) in the browser address bar.</li>
              <li>Click <strong className="text-white">"Install Arunan IQ"</strong>.</li>
              <li>Opens in a dedicated distraction-free window.</li>
            </ol>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero App Store downloads · Fast 1-click install</span>
          </div>

          <button
            type="button"
            onClick={onOpenInstall}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isTa ? 'இப்போதே நிறுவுக' : 'Install App Now'}</span>
          </button>
        </div>
      </section>

      {/* 5. Safe Website & Privacy Verified Guarantee */}
      <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border-2 border-emerald-500/30 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Safe Website & Child-Safe App</span>
              </span>
              <span className="text-slate-500 hidden sm:inline">·</span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">By Arunan S</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isTa
                ? 'பாதுகாப்பான இணையதளம் & தனிஉரிமை உத்தரவாதம்'
                : 'Safe Website, Zero Ads & 100% Privacy'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTa
                ? 'அருணன் IQ இணையதளம் முற்றிலும் விளம்பரங்கள் அற்றது. தனிநபர் தகவல்களை சேகரிக்காது. குழந்தைகள் மற்றும் பள்ளிகளுக்கு 100% பாதுகாப்பான கற்றல் சூழலை வழங்குகிறது.'
                : 'Arunan IQ is certified 100% safe, clean, and private. Zero third-party trackers, zero advertising, and all game state is stored locally on your device only.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            {onOpenSafetyModal && (
              <button
                type="button"
                onClick={() => onOpenSafetyModal('safety')}
                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isTa ? 'பாதுகாப்புச் சான்றிதழைப் பார்' : 'View Safety Details'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Pillars of Safety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
              <span>🛡️ Zero Ads</span>
            </div>
            <p className="text-xs text-slate-400">
              {isTa ? 'எந்த விளம்பரங்களும் இல்லை' : 'No pop-ups or banners'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-cyan-400 font-bold text-sm flex items-center gap-1.5">
              <span>🔒 100% Private</span>
            </div>
            <p className="text-xs text-slate-400">
              {isTa ? 'லோக்கல் ஸ்டோரேஜ் மட்டுமே' : 'Device-only local storage'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
              <span>👶 Child Friendly</span>
            </div>
            <p className="text-xs text-slate-400">
              {isTa ? 'வயது 4+ குழந்தைகளுக்கு ஏற்றது' : 'COPPA aligned, age 4+ safe'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-purple-400 font-bold text-sm flex items-center gap-1.5">
              <span>⚡ 100% Offline</span>
            </div>
            <p className="text-xs text-slate-400">
              {isTa ? 'இணையமின்றி தடையின்றி இயங்கும்' : 'Zero internet risk once loaded'}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Monthly Updates & Security Bulletin in Month */}
      <section className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-indigo-500/30 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Monthly Updates & Security Schedule</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold">
                October 2026 Active ✓
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isTa
                ? 'மாதாந்திர பாதுகாப்பு & தொடர் புதிய புதுப்பிப்புகள்'
                : 'Monthly Security & Continuous Updates in Month'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTa
                ? 'ஒவ்வொரு மாதமும் அருணன் S மேற்பார்வையில் புதிய அறிவுசார் புதிர்கள், இலக்கணப் பயிற்சிகள் மற்றும் முழு கணினிப் பாதுகாப்பு தணிக்கை மேற்கொள்ளப்படுகிறது.'
                : 'On the 1st of every month, Arunan IQ is updated with fresh cognitive riddles, curriculum expansions, and verified against the latest web security standards.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
            {onOpenSafetyModal && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenSafetyModal('updates')}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isTa ? 'மாதாந்திர பதிவுகள்' : 'Monthly Release Logs'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenSafetyModal('scan')}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                >
                  <Activity className="w-4 h-4" />
                  <span>{isTa ? 'பாதுகாப்பு சோதனை' : 'Run Security Scan'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3 Monthly Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Current Month: October 2026 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/40 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400">OCTOBER 2026</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                CURRENT · VERIFIED
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">English 3 Levels & Session Continuity</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Added 3-tier English learning (Easy, Medium, Hard), automatic gameplay session restore on leave/return, and client-side sandboxing.
            </p>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero Vulnerabilities Detected</span>
            </div>
          </div>

          {/* September 2026 */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400">SEPTEMBER 2026</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                STABLE
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Detective Arunan & 5 Languages</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Launched flagship Detective Arunan casefiles with Tamil cultural mysteries and full internationalization in 5 languages.
            </p>
            <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PWA Offline Cache Hardened</span>
            </div>
          </div>

          {/* Upcoming: November 2026 */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-amber-500/30 border-dashed space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">NOVEMBER 2026</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                UPCOMING
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Mystery Expansion & Dialogue Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Scheduled 20 new casefiles, interactive sentence builder, and bi-annual cryptographic audit on the 1st of the month.
            </p>
            <div className="text-[11px] font-mono text-amber-300 flex items-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Roadmap Scheduled</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer Signature */}
      <footer className="text-center pt-8 border-t border-slate-800 space-y-2 text-slate-400 text-xs">
        <div className="flex items-center justify-center gap-2 font-mono text-sm text-slate-200">
          <span>Made by</span>
          <span className="font-black text-white px-2 py-0.5 rounded bg-blue-600/30 border border-blue-500/40 text-blue-200">
            Arunan S
          </span>
        </div>
        <p>Sand.E · Progressive Web App & Educational Website · All Rights Reserved</p>
      </footer>
    </div>
  );
};
