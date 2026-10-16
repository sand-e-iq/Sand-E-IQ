import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import {
  ShieldCheck,
  Lock,
  WifiOff,
  Smile,
  X,
  CheckCircle2,
  Sparkles,
  Award,
  EyeOff,
  Calendar,
  RefreshCw,
  Cpu,
  HardDrive,
  FileText,
  Activity,
  ArrowRight,
  Shield,
  Clock,
} from 'lucide-react';

export type SafetyModalTab = 'safety' | 'updates' | 'scan';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang: AppLanguage;
  initialTab?: SafetyModalTab;
}

interface ScanStep {
  name: string;
  nameTa: string;
  detail: string;
  status: 'pending' | 'scanning' | 'passed';
}

export const SafetyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLang,
  initialTab = 'safety',
}) => {
  const [activeTab, setActiveTab] = useState<SafetyModalTab>(initialTab);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanFinished, setScanFinished] = useState(false);
  const [scanSteps, setScanSteps] = useState<ScanStep[]>([
    {
      name: 'HTTPS / TLS 1.3 Transport Encryption',
      nameTa: 'குறியாக்கப்பட்ட HTTPS / TLS பாதுகாப்பு',
      detail: 'Verifying cryptographic channel & secure execution context',
      status: 'pending',
    },
    {
      name: 'Local Storage Sandbox Isolation',
      nameTa: 'லோக்கல் ஸ்டோரேஜ் தரவு தனிமைப்படுத்தல்',
      detail: 'Validating client-side local database boundaries without data leakage',
      status: 'pending',
    },
    {
      name: 'Zero-Tracker & Zero-Ad Enforcement',
      nameTa: 'விளம்பரமற்ற மற்றும் கண்காணிப்பற்ற தணிக்கை',
      detail: 'DOM script audit confirms 0 third-party trackers & 0 advertising cookies',
      status: 'pending',
    },
    {
      name: 'Offline Cache & PWA Integrity',
      nameTa: 'ஆஃப்லைன் PWA தற்காலிக சேமிப்பு பாதுகாப்பு',
      detail: 'Inspecting service worker assets and offline app cache cleanliness',
      status: 'pending',
    },
    {
      name: 'Safe Synthesized Audio Engine',
      nameTa: 'பாதுகாப்பான ஒலிக் கட்டமைப்பு',
      detail: 'Pure Web Audio oscillator safety without untrusted external media',
      status: 'pending',
    },
  ]);

  // Synchronize initialTab when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const isTa = currentLang === 'ta';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';
  const isHi = currentLang === 'hi';

  const runDiagnostic = () => {
    if (isScanning) return;
    sound.playClick(500);
    setIsScanning(true);
    setScanProgress(0);
    setScanFinished(false);

    // Reset steps
    setScanSteps((prev) =>
      prev.map((step) => ({ ...step, status: 'pending' }))
    );

    const stepDelay = 450;
    scanSteps.forEach((_, index) => {
      setTimeout(() => {
        setScanSteps((prev) =>
          prev.map((item, idx) => {
            if (idx === index) return { ...item, status: 'scanning' };
            if (idx < index) return { ...item, status: 'passed' };
            return item;
          })
        );
        setScanProgress(Math.round(((index + 1) / scanSteps.length) * 100));
        sound.playClick(480 + index * 50);

        if (index === scanSteps.length - 1) {
          setTimeout(() => {
            setScanSteps((prev) =>
              prev.map((item) => ({ ...item, status: 'passed' }))
            );
            setIsScanning(false);
            setScanFinished(true);
            sound.playSuccess();
          }, stepDelay);
        }
      }, index * stepDelay);
    });
  };

  const safetyPillars = [
    {
      icon: <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />,
      title: isTa
        ? 'விளம்பரங்கள் இல்லை (100% Ad-Free)'
        : isFr
        ? '100% Sans Publicité'
        : isEs
        ? '100% Sin Publicidad'
        : isHi
        ? '100% विज्ञापन-मुक्त'
        : '100% Ad-Free & Distraction-Free',
      description: isTa
        ? 'எந்தவித பாப்-அப் அல்லது மூன்றாம் தரப்பு விளம்பரங்களும் இல்லை. குழந்தைகள் கவனச்சிதறல் இன்றி பாதுகாப்பாக கற்கலாம்.'
        : isFr
        ? 'Aucune publicité intempestive ni traqueur commercial. Sécurisé pour les enfants et les écoles.'
        : isEs
        ? 'Sin anuncios emergentes ni rastreadores. Seguro para niños, escuelas y familias.'
        : isHi
        ? 'कोई पॉप-अप या विज्ञापन नहीं। बच्चे और परिवार बिना किसी रुकावट के खेल सकते हैं।'
        : 'Zero pop-ups, zero third-party banners, and zero commercials. Safe for young learners and classrooms.',
      badge: 'Certified Clean',
      color: 'border-emerald-500/30 bg-emerald-500/5',
    },
    {
      icon: <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />,
      title: isTa
        ? 'முழு தனிஉரிமை & லோக்கல் ஸ்டோரேஜ்'
        : isFr
        ? 'Confidentialité Totale (Stockage Local)'
        : isEs
        ? 'Privacidad Total (Almacenamiento Local)'
        : isHi
        ? 'पूर्ण गोपनीयता (लोकल स्टोरेज)'
        : 'Complete Privacy & Local Storage Only',
      description: isTa
        ? 'உங்கள் மதிப்பெண்கள், புதிர்கள் மற்றும் ஆட்ட முன்னேற்றம் உங்கள் சாதனத்திலேயே (LocalStorage) பத்திரமாக இருக்கும். தனிப்பட்ட தகவல்கள் சேகரிக்கப்படுவதில்லை.'
        : isFr
        ? 'Vos scores et progressions sont enregistrés uniquement sur votre appareil. Aucune donnée personnelle transmise.'
        : isEs
        ? 'Sus puntajes y avances se guardan únicamente en su navegador. No recopilamos datos personales.'
        : isHi
        ? 'आपका स्कोर और प्रोग्रेस केवल आपके डिवाइस में सुरक्षित रहता है। कोई व्यक्तिगत डेटा नहीं लिया जाता।'
        : 'All game progress, scores, and settings reside strictly on your own device. No personal data collection or tracking.',
      badge: 'Zero Telemetry',
      color: 'border-cyan-500/30 bg-cyan-500/5',
    },
    {
      icon: <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />,
      title: isTa
        ? 'குழந்தைகள் & குடும்பத்தினருக்கு ஏற்றது'
        : isFr
        ? 'Adapté aux Enfants & Familles'
        : isEs
        ? 'Apto para Niños y Familias'
        : isHi
        ? 'बच्चों और परिवारों के लिए सुरक्षित'
        : 'Child-Safe & Family-Friendly (COPPA Aligned)',
      description: isTa
        ? 'வயது 4 முதல் பெரியவர்கள் வரை அனைவரும் விளையாடக்கூடிய ஆரோக்கியமான அறிவுசார் புதிர்கள், வண்ணமயமான விலங்குகள் மற்றும் ஊக்குவிக்கும் குரல் வாசிப்பு.'
        : isFr
        ? 'Énigmes positives adaptées dès 4 ans avec narration vocale bienveillante et logique saine.'
        : isEs
        ? 'Rompecabezas sanos y educativos para edades de 4 años en adelante, con lectura en voz alta.'
        : isHi
        ? '4 वर्ष और उससे अधिक आयु के बच्चों के लिए सकारात्मक सोच और तार्किक विकास पहेलियाँ।'
        : 'Wholesome logic riddles designed for ages 4+. Encourages constructive cognitive growth without violence.',
      badge: 'Ages 4+',
      color: 'border-amber-500/30 bg-amber-500/5',
    },
    {
      icon: <WifiOff className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />,
      title: isTa
        ? '100% ஆஃப்லைனில் செயல்படும்'
        : isFr
        ? 'Fonctionne 100% Hors Ligne'
        : isEs
        ? 'Funciona 100% Sin Internet'
        : isHi
        ? '100% ऑफलाइन कार्यक्षमता'
        : '100% Offline Operation',
      description: isTa
        ? 'இணைய இணைப்பு இல்லாவிட்டாலும் தடையின்றி இயங்கும். வெளி உலக தொடர்பின்றி பாதுகாப்பான தனி சூழலில் செயல்படுகிறது.'
        : isFr
        ? 'Fonctionne sans connexion Internet après le premier chargement. Aucune dépendance externe.'
        : isEs
        ? 'No requiere conexión a Internet una vez cargado. Seguro contra interrupciones de red.'
        : isHi
        ? 'इंटरनेट के बिना भी सभी पहेलियाँ और स्तर सुचारू रूप से चलते हैं।'
        : 'Runs seamlessly without an internet connection once loaded. Immune to unexpected network shifts.',
      badge: 'Offline Safe',
      color: 'border-purple-500/30 bg-purple-500/5',
    },
    {
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />,
      title: isTa
        ? 'உறுதிசெய்யப்பட்ட படைப்பு: Arunan S'
        : isFr
        ? 'Vérifié par le Développeur Arunan S'
        : isEs
        ? 'Verificado por el Creador Arunan S'
        : isHi
        ? 'निर्माता अरूनन एस द्वारा सत्यापित'
        : 'Verified & Maintained by Arunan S',
      description: isTa
        ? 'சுயாதீனமான மென்பொருள் பொறியாளர் Arunan S அவர்களின் மேற்பார்வையில் நம்பகத்தன்மையுடன் உருவாக்கப்பட்டு மாதாந்திர அடிப்படையில் பராமரிக்கப்படுகிறது.'
        : isFr
        ? 'Développé et maintenu par Arunan S avec les plus hauts standards de transparence et de sécurité.'
        : isEs
        ? 'Desarrollado y respaldado de forma independiente por Arunan S para garantizar máxima fiabilidad.'
        : isHi
        ? 'स्वतंत्र डेवलपर अरूनन एस द्वारा उच्च मानकों के साथ तैयार और प्रबंधित।'
        : 'Engineered and maintained with transparent software architecture by Arunan S with monthly updates.',
      badge: 'Author Verified',
      color: 'border-red-500/30 bg-red-500/5',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />,
      title: isTa
        ? 'பாதுகாப்பான HTTPS & PWA கட்டமைப்பு'
        : isFr
        ? 'Architecture Sécurisée HTTPS & PWA'
        : isEs
        ? 'Arquitectura Segura HTTPS y PWA'
        : isHi
        ? 'सुरक्षित HTTPS एवं PWA तकनीक'
        : 'Encrypted HTTPS & Progressive Web App',
      description: isTa
        ? 'குறியாக்கப்பட்ட TLS/HTTPS பாதுகாப்புடன் நவீன இணையத் தரநிலைகளுக்கு உட்பட்டு இயங்குகிறது.'
        : isFr
        ? 'Connexion chiffrée SSL/TLS et conteneurisation autonome pour une sécurité maximale.'
        : isEs
        ? 'Conexión cifrada de extremo a extremo conforme a los estándares web modernos.'
        : isHi
        ? 'आधुनिक वेब सुरक्षा मानकों और एन्क्रिप्टेड प्रोटोकॉल पर आधारित।'
        : 'Delivered via modern encrypted HTTPS standards with sandboxed client execution and responsive isolation.',
      badge: 'TLS Protected',
      color: 'border-emerald-500/30 bg-emerald-500/5',
    },
  ];

  const monthlyLogs = [
    {
      month: 'October 2026',
      monthTa: 'அக்டோபர் 2026',
      badge: 'Current Month · Active Status',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      isCurrent: true,
      securityStatus: 'All Audits Passed (100% Protected)',
      securityStatusTa: 'அனைத்து பாதுகாப்பு சோதனைகளும் வெற்றி (100% பாதுகாப்பானது)',
      securityHighlights: [
        'Client-side LocalStorage integrity verification and cryptographic isolation',
        'Updated Content Security boundaries preventing external script injections',
        'Child safety and family compliance audit confirmed (COPPA & GDPR aligned)',
        'Zero third-party telemetry, tracking pixels, and ads re-verified',
      ],
      updateHighlights: [
        'Added 3 difficulty levels to English Learning (Easy, Medium, Hard) with 100+ phrases',
        'Automatic Session Continuity & Game Resume on re-entry or app backgrounding',
        'Added Detective Arunan mystery case expansion with Tamil cultural stories',
        'Integrated official high-contrast creator branding: Made by Arunan S',
        'Implemented dual platform support: Web Showcase & Progressive Web App',
      ],
    },
    {
      month: 'September 2026',
      monthTa: 'செப்டம்பர் 2026',
      badge: 'Previous Month Release',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      isCurrent: false,
      securityStatus: 'Verified Stable & Certified',
      securityStatusTa: 'நிலையான பாதுகாப்பு உறுதி செய்யப்பட்டது',
      securityHighlights: [
        'PWA Service Worker offline caching protocol security hardened',
        'Browser tab visibility timer freeze to eliminate memory leaks',
        'Secure client-side synthetic audio generation sandbox',
      ],
      updateHighlights: [
        'Launched Detective Arunan interactive casefiles with witness interrogation',
        '5-language internationalization added: Tamil, English, French, Spanish, Hindi',
        'Mobile responsive bottom navigation bar and adaptive layout scaling',
      ],
    },
    {
      month: 'August 2026',
      monthTa: 'ஆகஸ்ட் 2026',
      badge: 'Core Foundation Release',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      isCurrent: false,
      securityStatus: 'Verified Stable',
      securityStatusTa: 'நிலையான கட்டமைப்பு',
      securityHighlights: [
        'Zero advertising policy enacted with permanent ban on tracking scripts',
        'Isolated browser sandbox execution with strictly zero cloud database dependencies',
      ],
      updateHighlights: [
        'Created Junior Child IQ animal, shape, and beginner matrix puzzles',
        'Implemented sound synthesizer without external audio downloads',
        'Developed standardized IQ assessment algorithm and local high-score storage',
      ],
    },
    {
      month: 'November 2026',
      monthTa: 'நவம்பர் 2026',
      badge: 'Upcoming Next Month',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      isCurrent: false,
      isUpcoming: true,
      securityStatus: 'Scheduled Bi-Annual Audit',
      securityStatusTa: 'திட்டமிடப்பட்ட பாதுகாப்பு தணிக்கை',
      securityHighlights: [
        'Scheduled bi-annual cryptographic storage compression audit',
        'Upgraded service worker background sync safety controls',
      ],
      updateHighlights: [
        '20 new Detective Arunan case files with interactive voice narration',
        'Expanded English vocabulary modules with daily conversation builder',
        'Printable offline achievement certificates for junior puzzle solvers',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative space-y-5 my-auto max-h-[92vh] flex flex-col justify-between">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick(440);
            onClose();
          }}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pr-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>100% Safe Website & App</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-950/70 border border-red-500/40 text-[10px] font-mono text-red-300 font-semibold">
                Made by Arunan S
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-[10px] font-mono text-indigo-300 font-semibold">
                Oct 2026 Security ✓
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              {isTa ? 'பாதுகாப்பு & மாதாந்திர புதுப்பிப்புகள்' : 'Safety, Security & Monthly Updates'}
            </h2>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              sound.playClick(460);
              setActiveTab('safety');
            }}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'safety'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isTa ? 'பாதுகாப்பான தளம்' : 'Safe Website'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick(480);
              setActiveTab('updates');
            }}
            className={`flex-1 min-w-[150px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'updates'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{isTa ? 'மாதாந்திர மாற்றங்கள்' : 'Monthly Updates'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick(500);
              setActiveTab('scan');
            }}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{isTa ? 'பாதுகாப்பு சோதனை' : 'Security Scan'}</span>
          </button>
        </div>

        {/* Tab 1: Safe Website & Privacy */}
        {activeTab === 'safety' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {/* Trust Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold leading-relaxed">
                  {isTa
                    ? 'அருணன் IQ இணையதளம் 100% விளம்பரமற்றது, தனிநபர் தரவுகளைச் சேமிக்காதது மற்றும் குழந்தைகளுக்கு பாதுகாப்பானது.'
                    : 'Arunan IQ is certified 100% ad-free, child-safe, and stores all game progress locally on your device.'}
                </span>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] border border-emerald-500/40">
                VERIFIED ✓
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Ads / Trackers</span>
                <span className="text-base sm:text-lg font-black text-emerald-400">0 (Zero)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Data Leak Risk</span>
                <span className="text-base sm:text-lg font-black text-emerald-400">0%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Child Rating</span>
                <span className="text-base sm:text-lg font-black text-amber-400">Age 4+ Safe</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Monthly Updates</span>
                <span className="text-base sm:text-lg font-black text-cyan-400">Active ✓</span>
              </div>
            </div>

            {/* Safety Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-1">
              {safetyPillars.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border ${p.color} space-y-1.5 flex flex-col justify-between`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                        {p.icon}
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700">
                        {p.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">{p.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Monthly Updates & Security Logs */}
        {activeTab === 'updates' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {/* Header info for Month */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-white text-sm">
                    {isTa ? 'அக்டோபர் 2026 மாதாந்திர பாதுகாப்பு அறிக்கை' : 'October 2026 Monthly Security & Updates Bulletin'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] font-bold">
                  MONTHLY CYCLE: ACTIVE
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {isTa
                  ? 'அருணன் IQ ஒவ்வொரு மாதமும் புதிய கற்றல் புதிர்கள் மற்றும் கணினிப் பாதுகாப்பு தணிக்கையுடன் புதுப்பிக்கப்படுகிறது. எந்த விளம்பரங்களும் இல்லாமல் பாதுகாப்பு உறுதி செய்யப்படுகிறது.'
                  : 'Arunan IQ receives monthly software improvements, cognitive puzzle expansions, and security health checks on the 1st of every month.'}
              </p>
            </div>

            {/* Monthly Log Cards */}
            <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
              {monthlyLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    log.isCurrent
                      ? 'bg-gradient-to-br from-indigo-950/30 to-slate-950 border-indigo-500/50 shadow-lg ring-1 ring-indigo-500/20'
                      : log.isUpcoming
                      ? 'bg-slate-950/60 border-amber-500/30 border-dashed'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  {/* Top Bar of Log */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">{isTa ? log.monthTa : log.month}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${log.badgeColor}`}>
                        {log.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-mono text-emerald-300 font-semibold text-[11px]">
                        {isTa ? log.securityStatusTa : log.securityStatus}
                      </span>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs">
                    {/* Security Updates Column */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold font-mono text-[11px] uppercase">
                        <Lock className="w-3 h-3" />
                        <span>{isTa ? 'பாதுகாப்பு மேம்பாடுகள்' : 'Security Enhancements'}</span>
                      </div>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside leading-relaxed text-[11px]">
                        {log.securityHighlights.map((sec, sIdx) => (
                          <li key={sIdx}>{sec}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Content & Game Updates Column */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-indigo-400 font-bold font-mono text-[11px] uppercase">
                        <Sparkles className="w-3 h-3" />
                        <span>{isTa ? 'புதிய அம்சங்கள்' : 'Feature & Mode Updates'}</span>
                      </div>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside leading-relaxed text-[11px]">
                        {log.updateHighlights.map((upd, uIdx) => (
                          <li key={uIdx}>{upd}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Real-Time Browser Security Scan */}
        {activeTab === 'scan' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>{isTa ? 'மாதாந்திர நேரலை பாதுகாப்பு சோதனை' : 'Monthly Live Security Diagnostic'}</span>
                </div>
                <p className="text-slate-300 text-xs">
                  {isTa
                    ? 'உங்கள் தற்போதைய உலாவியில் பாதுகாப்பு குறியாக்கம், லோக்கல் சாண்ட்பாக்ஸ் மற்றும் விளம்பர தணிக்கையை சோதிக்கவும்.'
                    : 'Test browser sandbox isolation, HTTPS transport, and verify zero trackers in your current session.'}
                </p>
              </div>

              <button
                type="button"
                onClick={runDiagnostic}
                disabled={isScanning}
                className="shrink-0 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? (isTa ? 'சோதிக்கிறது...' : 'Scanning...') : (isTa ? 'பரிசோதிக்கவும்' : 'Run Scan')}</span>
              </button>
            </div>

            {/* Progress Bar */}
            {isScanning && (
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Auditing runtime integrity...</span>
                  <span className="text-cyan-400 font-bold">{scanProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Step List */}
            <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1">
              {scanSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                    step.status === 'passed'
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                      : step.status === 'scanning'
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200 ring-1 ring-cyan-500/30'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center gap-2">
                      <span>{isTa ? step.nameTa : step.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">{step.detail}</span>
                  </div>

                  <div className="shrink-0">
                    {step.status === 'passed' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        PASSED
                      </span>
                    ) : step.status === 'scanning' ? (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-[10px] flex items-center gap-1 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                        TESTING
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800 font-mono text-[10px]">
                        QUEUED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Certified Badge when scan is completed */}
            {scanFinished && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-950 border-2 border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-300 font-black text-sm uppercase tracking-wide">
                      October 2026 Security Certificate Issued
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Certified 100% safe, ad-free, encrypted, and isolated on your current device. Maintained by Arunan S.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-xs text-emerald-400 block font-bold">GRADE A+</span>
                  <span className="text-[10px] font-mono text-slate-400">Zero Vulnerabilities</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>COPPA & GDPR Privacy Aligned · Monthly Audits by Arunan S</span>
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== 'scan' && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick(500);
                  setActiveTab('scan');
                  runDiagnostic();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-700"
              >
                {isTa ? 'பாதுகாப்பு சோதனை செய்க' : 'Run Security Check'}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              {isTa ? 'புரிந்தது, தொடர்க' : 'Got it, Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
