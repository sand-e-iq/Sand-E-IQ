import React, { useState, useEffect } from 'react';
import { DetectiveCase, Difficulty } from '../types/game';
import { AppLanguage, LANGUAGES } from '../types/i18n';
import { t, getSpeechLangCode } from '../utils/i18n';
import { DETECTIVE_MEHUL_CASES, getLocalizedCase } from '../data/detectiveMehulCases';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import {
  saveScoreToLeaderboard,
  getActiveDetectiveName,
  setActiveDetectiveName,
  getAllDetectiveUsers,
  removeDetectiveUser,
} from '../utils/storage';
import { loadDetectiveSession, saveDetectiveSession, clearSession } from '../utils/gameSessionStorage';
import {
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Clock,
  RotateCcw,
  ChevronRight,
  Volume2,
  VolumeX,
  Languages,
  ShieldAlert,
  Award,
  Zap,
  Eye,
  FileText,
  BookmarkCheck,
  User,
  Edit3,
  Check,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

interface Props {
  currentLang: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
  onDetectiveNameChange?: (name: string) => void;
  onWin: (stats: {
    mode: 'detective';
    difficulty: Difficulty;
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  }) => void;
}

export const DetectiveMehulGame: React.FC<Props> = ({
  currentLang,
  onSelectLanguage,
  onDetectiveNameChange,
  onWin,
}) => {
  const initialSaved = React.useMemo(() => loadDetectiveSession(), []);

  const [detectiveName, setDetectiveName] = useState(() => getActiveDetectiveName());
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [customNameInput, setCustomNameInput] = useState('');
  const [usersList, setUsersList] = useState<string[]>(() => getAllDetectiveUsers());

  const [caseIndex, setCaseIndex] = useState(() => initialSaved?.caseIndex ?? 0);
  const [selectedSuspectId, setSelectedSuspectId] = useState<number | null>(
    () => initialSaved?.selectedSuspectId ?? null
  );
  const [isAnswered, setIsAnswered] = useState(() => initialSaved?.isAnswered ?? false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(() => initialSaved?.isCorrect ?? null);
  const [revealedClues, setRevealedClues] = useState<number[]>(
    () => initialSaved?.revealedClues ?? []
  );
  const [timeElapsed, setTimeElapsed] = useState(() => initialSaved?.timeElapsed ?? 0);
  const [solvedCount, setSolvedCount] = useState(() => initialSaved?.solvedCount ?? 0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isResumedBanner, setIsResumedBanner] = useState(
    () =>
      Boolean(
        initialSaved &&
          (initialSaved.caseIndex > 0 ||
            initialSaved.solvedCount > 0 ||
            (initialSaved.revealedClues && initialSaved.revealedClues.length > 0))
      )
  );

  const isFirstRenderRef = React.useRef(true);
  const prevCaseIndexRef = React.useRef(caseIndex);

  const currentCase: DetectiveCase =
    DETECTIVE_MEHUL_CASES[caseIndex % DETECTIVE_MEHUL_CASES.length];

  const loc = getLocalizedCase(currentCase, currentLang, detectiveName);

  const isTa = currentLang === 'ta';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';
  const isHi = currentLang === 'hi';

  const handleSwitchUser = (name: string) => {
    sound.playSuccess();
    const updated = setActiveDetectiveName(name);
    setDetectiveName(updated);
    setUsersList(getAllDetectiveUsers());
    if (onDetectiveNameChange) onDetectiveNameChange(updated);
    setIsUserModalOpen(false);
  };

  const handleSaveCustomName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customNameInput.trim()) return;
    sound.playSuccess();
    const updated = setActiveDetectiveName(customNameInput.trim());
    setDetectiveName(updated);
    setUsersList(getAllDetectiveUsers());
    setCustomNameInput('');
    if (onDetectiveNameChange) onDetectiveNameChange(updated);
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (nameToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick(400);
    const updatedUsers = removeDetectiveUser(nameToDelete);
    setUsersList(updatedUsers);
    const cur = getActiveDetectiveName();
    setDetectiveName(cur);
    if (onDetectiveNameChange) onDetectiveNameChange(cur);
  };

  // Initialize case when caseIndex changes
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    if (prevCaseIndexRef.current !== caseIndex) {
      prevCaseIndexRef.current = caseIndex;
      setSelectedSuspectId(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setRevealedClues([]);
      setTimeElapsed(0);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [caseIndex, currentLang]);

  // Save session on any update & when user leaves app
  useEffect(() => {
    saveDetectiveSession({
      caseIndex,
      solvedCount,
      revealedClues,
      selectedSuspectId,
      timeElapsed,
      isAnswered,
      isCorrect,
      lastUpdated: Date.now(),
    });
  }, [caseIndex, solvedCount, revealedClues, selectedSuspectId, timeElapsed, isAnswered, isCorrect]);

  useEffect(() => {
    const handleVis = () => {
      saveDetectiveSession({
        caseIndex,
        solvedCount,
        revealedClues,
        selectedSuspectId,
        timeElapsed,
        isAnswered,
        isCorrect,
        lastUpdated: Date.now(),
      });
    };
    document.addEventListener('visibilitychange', handleVis);
    window.addEventListener('beforeunload', handleVis);
    return () => {
      document.removeEventListener('visibilitychange', handleVis);
      window.removeEventListener('beforeunload', handleVis);
    };
  }, [caseIndex, solvedCount, revealedClues, selectedSuspectId, timeElapsed, isAnswered, isCorrect]);

  // Timer: Pause when user leaves app or case is answered
  useEffect(() => {
    if (isAnswered) return;
    const interval = setInterval(() => {
      if (document.hidden) return;
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isAnswered]);

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${loc.title}. ${loc.synopsis} ${loc.question}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = getSpeechLangCode(currentLang);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleClue = (idx: number) => {
    sound.playClick(600);
    setRevealedClues((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSelectSuspect = (id: number) => {
    if (isAnswered) return;
    sound.playClick(440);
    setSelectedSuspectId(id);
  };

  const handleSubmitDeduction = () => {
    if (selectedSuspectId === null || isAnswered) return;

    const correct = selectedSuspectId === currentCase.correctSuspectId;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playFanfare();
      triggerConfetti();
      setSolvedCount((prev) => prev + 1);

      const baseScore =
        currentCase.difficulty === 'easy'
          ? 2500
          : currentCase.difficulty === 'medium'
          ? 4000
          : 6000;
      const timeBonus = Math.max(0, 90 - timeElapsed) * 15;
      const score = baseScore + timeBonus;
      const iqEstimate = Math.min(155, 125 + solvedCount * 5 + (timeElapsed < 45 ? 8 : 2));

      saveScoreToLeaderboard({
        playerName:
          currentLang === 'ta'
            ? `துப்பறியும் ${detectiveName}`
            : `Detective ${detectiveName}`,
        mode: 'detective',
        difficulty: currentCase.difficulty,
        score,
        iqEstimate,
        timeSeconds: timeElapsed,
        accuracy: 100,
        notes: `Case #${currentCase.caseNumber}: ${loc.title}`,
      });

      onWin({
        mode: 'detective',
        difficulty: currentCase.difficulty,
        score,
        iqEstimate,
        timeSeconds: timeElapsed,
        accuracy: 100,
        title: loc.title,
      });
    } else {
      sound.playBuzzer();
    }
  };

  const handleNextCase = () => {
    sound.playClick(520);
    setCaseIndex((prev) => (prev + 1) % DETECTIVE_MEHUL_CASES.length);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-7 w-full min-w-0">
      {/* Case Continuity Notification */}
      {isResumedBanner && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">
              {isTa
                ? `முந்தைய வழக்கு தொடர்கிறது: வழக்கு #${currentCase.caseNumber} - ${loc.title}`
                : `Resumed previous investigation: Case #${currentCase.caseNumber} - ${loc.title}`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSession('detective');
              setCaseIndex(0);
              setSolvedCount(0);
              setSelectedSuspectId(null);
              setRevealedClues([]);
              setIsAnswered(false);
              setIsCorrect(null);
              setTimeElapsed(0);
              setIsResumedBanner(false);
            }}
            className="text-[11px] underline text-slate-400 hover:text-amber-200 cursor-pointer transition-colors shrink-0 ml-2"
          >
            {isTa ? 'முதல் வழக்கு' : 'Restart #1'}
          </button>
        </div>
      )}

      {/* Top Banner - Detective Header with Name & User Switcher */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-blue-950/30 to-[#02040a] border-2 border-blue-500/30 flex flex-wrap items-center justify-between gap-3 sm:gap-5 shadow-2xl">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-500/20 via-blue-900/30 to-amber-500/20 border-2 border-blue-400/50 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shrink-0">
            🕵️‍♂️
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wider font-mono">
                {isTa ? `துப்பறியும் ${detectiveName}` : `Detective ${detectiveName}`}
              </span>

              {/* User to User Switch & Change Name Button */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick(440);
                  setIsUserModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 hover:bg-blue-500/35 border border-blue-400/50 text-[10px] sm:text-xs font-mono text-cyan-300 font-bold cursor-pointer transition-all shadow-sm"
                title={isTa ? 'துப்பறியும் பெயர் மாற்றம் / பயனர் தேர்வு' : 'Change Detective Name / Switch User'}
              >
                <Edit3 className="w-3 h-3 text-cyan-400" />
                <span>{isTa ? 'பெயர் மாற்றம்' : 'Change User'}</span>
              </button>

              <span className="text-slate-600">·</span>
              <span className="text-xs sm:text-sm text-slate-300 font-semibold capitalize">
                Case #{currentCase.caseNumber}
              </span>
            </div>
            <h2 className="text-lg sm:text-3xl font-black text-white tracking-tight mt-0.5">
              {loc.title}
            </h2>
          </div>
        </div>

        {/* Action Controls: 5 Languages Switcher, Audio, Timer */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Direct 5-Language Selector Pills */}
          <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-md">
            {LANGUAGES.map((langItem) => {
              const isSelected = currentLang === langItem.code;
              return (
                <button
                  key={langItem.code}
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onSelectLanguage(langItem.code);
                  }}
                  className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title={`${langItem.name} (${langItem.nativeName})`}
                >
                  <span className="text-xs sm:text-sm select-none">{langItem.flag}</span>
                  <span className="hidden sm:inline font-semibold text-[11px]">{langItem.nativeName}</span>
                </button>
              );
            })}
          </div>

          {/* Voice Read Aloud */}
          <button
            type="button"
            onClick={handleSpeech}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse shadow-md'
                : 'bg-slate-900 text-slate-200 border-slate-700 hover:text-white hover:bg-slate-800'
            }`}
            title={t('readAloud', currentLang)}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-slate-950" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline">{isSpeaking ? t('stopVoice', currentLang) : t('readAloud', currentLang)}</span>
          </button>

          {/* Stopwatch Elapsed & Cases Solved */}
          <div className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold">{formatTime(timeElapsed)}</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-bold">🏆 {solvedCount}</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Casefile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: Crime Dossier & Suspect Interrogations (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Crime Dossier Box */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>{t('crimeDossier', currentLang)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-lg">{currentCase.sceneVisualEmoji}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif">
              "{loc.synopsis}"
            </p>

            {/* Crime Scene Details Checklist */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono block">
                {currentLang === 'ta'
                  ? 'தடய அறிவியல் சான்றுகள்:'
                  : currentLang === 'fr'
                  ? 'Observations Médico-Légales :'
                  : currentLang === 'es'
                  ? 'Observaciones Forenses :'
                  : currentLang === 'hi'
                  ? 'अपराध स्थल के सुराग :'
                  : 'Forensic Crime Scene Observations:'}
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {loc.crimeSceneDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">▶</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suspect Statements Interrogation Area */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
                <Eye className="w-4 h-4" />
                <span>{t('suspectStatements', currentLang)}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {currentLang === 'ta'
                  ? 'ஒருவரைத் தேர்ந்தெடுக்கவும்'
                  : currentLang === 'fr'
                  ? 'Cliquer pour accuser'
                  : currentLang === 'es'
                  ? 'Toca para acusar'
                  : currentLang === 'hi'
                  ? 'आरोपी चुनें'
                  : 'Tap to accuse'}
              </span>
            </div>

            <div className="space-y-3">
              {loc.suspects.map((suspect) => {
                const isSelected = selectedSuspectId === suspect.id;
                let cardStyle =
                  'border-slate-800 bg-slate-950/70 hover:border-amber-400/50 hover:bg-slate-900';

                if (isSelected) {
                  cardStyle =
                    'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.25)]';
                }
                if (isAnswered) {
                  if (suspect.id === currentCase.correctSuspectId) {
                    cardStyle =
                      'border-emerald-500 bg-emerald-950/50 text-emerald-200 ring-2 ring-emerald-500';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'border-rose-500 bg-rose-950/50 text-rose-200';
                  }
                }

                return (
                  <div
                    key={suspect.id}
                    onClick={() => handleSelectSuspect(suspect.id)}
                    className={`p-3.5 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 sm:gap-4 select-none ${cardStyle}`}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl sm:text-4xl shrink-0 shadow-md">
                      {suspect.avatar}
                    </div>

                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm sm:text-lg text-white">
                          {suspect.name}
                        </span>
                        <span className="text-[11px] sm:text-xs font-mono text-slate-400 bg-slate-900/80 px-2 sm:px-2.5 py-0.5 rounded-lg border border-slate-800">
                          {suspect.role}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif italic">
                        "{suspect.statement}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detective Question, Clues & Verdict (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Question & Accusation Button */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div>
              <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider block mb-1">
                {currentLang === 'ta' ? 'புலனாய்வுக் கேள்வி:' : 'Detective Inquiry:'}
              </span>
              <p className="text-sm font-bold text-white leading-relaxed">
                {loc.question}
              </p>
            </div>

            {!isAnswered ? (
              <button
                type="button"
                disabled={selectedSuspectId === null}
                onClick={handleSubmitDeduction}
                className="w-full py-3.5 sm:py-4 px-5 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 hover:from-red-500 hover:to-amber-300 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{t('arrestCulprit', currentLang)}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextCase}
                className="w-full py-3.5 sm:py-4 px-5 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <span>{t('nextCase', currentLang)}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Interactive Magnifying Glass Clues */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>
                  {isTa ? `துப்பறியும் ${detectiveName}-ன் துப்புகள்` : `${detectiveName}'s Forensic Clues`}
                </span>
              </span>
              <span className="text-[11px] text-slate-500">
                {t('tapToInspect', currentLang)}
              </span>
            </div>

            <div className="space-y-2">
              {loc.clues.map((clue, idx) => {
                const isRevealed = revealedClues.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleClue(idx)}
                    className="w-full p-2.5 sm:p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 flex items-center gap-2">
                        <span>{clue.icon}</span>
                        <span>{clue.label}</span>
                      </span>
                      <span className="text-[10px] text-cyan-400 font-bold">
                        {isRevealed ? t('hideInspect', currentLang) : t('inspect', currentLang)}
                      </span>
                    </div>

                    {isRevealed && (
                      <p className="text-xs text-cyan-200/90 mt-2 pl-5 sm:pl-6 leading-relaxed border-t border-slate-800/80 pt-2 font-serif">
                        {clue.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detective Verdict (Shown after answering) */}
          {isAnswered && (
            <div
              className={`p-5 sm:p-6 rounded-3xl border-2 space-y-3 transition-all ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100 shadow-xl'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-100 shadow-xl'
              }`}
            >
              <div className="flex items-center gap-2 text-base font-black">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <span className="text-emerald-300">
                      {isTa
                        ? `சபாஷ்! துப்பறியும் ${detectiveName} வழக்கை வெற்றிகரமாகத் தீர்த்தார்!`
                        : `Case Solved by Detective ${detectiveName}!`}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                    <span className="text-rose-300">
                      {t('caseFailed', currentLang)}
                    </span>
                  </>
                )}
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
                <p>
                  <strong>
                    {isTa
                      ? `துப்பறியும் ${detectiveName}-ன் அதிரடித் தீர்ப்பு:`
                      : `Detective ${detectiveName}'s Forensic Deduction:`}
                  </strong>{' '}
                  {loc.mehulVerdict}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center gap-2">
                <span>🕵️‍♂️</span>
                <span className="italic">"{loc.catchphrase}"</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User-to-User Switcher & Detective Name Change Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-gradient-to-b from-[#030712] via-slate-900 to-[#02040a] border-2 border-blue-500/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_40px_rgba(37,99,235,0.3)] relative space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-xl">
                  🕵️‍♂️
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {isTa ? 'துப்பறியும் பயனர் பெயர் மாற்றம்' : 'Detective & User Switching'}
                  </h3>
                  <p className="text-[11px] text-cyan-300 font-mono">
                    {isTa ? 'பயனர் மாற்றம் (User to User Change)' : 'Switch User or Rename Detective'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Active Detective Badge */}
            <div className="p-3 rounded-2xl bg-slate-950/90 border border-blue-500/30 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {isTa ? 'தற்போதைய துப்பறிவாளர்:' : 'Current Detective:'}
              </span>
              <span className="text-sm font-black text-amber-400 font-mono flex items-center gap-1.5">
                <span>🕵️‍♂️</span>
                <span>{detectiveName}</span>
              </span>
            </div>

            {/* 1. Quick Select: User to User change */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider block">
                {isTa ? 'பயனர்கள் பட்டியல் (Select User):' : 'Saved Users (Tap to Switch):'}
              </label>
              <div className="flex flex-wrap gap-2">
                {usersList.map((usr) => {
                  const isActive = usr.toLowerCase() === detectiveName.toLowerCase();
                  return (
                    <div
                      key={usr}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer select-none ${
                        isActive
                          ? 'bg-blue-600 border-cyan-400 text-white shadow-md ring-2 ring-blue-400/40'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-400/50 hover:bg-slate-800'
                      }`}
                      onClick={() => handleSwitchUser(usr)}
                    >
                      <User className="w-3.5 h-3.5 text-cyan-300" />
                      <span>{usr}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-cyan-300" />}
                      {!isActive && usersList.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteUser(usr, e)}
                          className="hover:text-rose-400 ml-1 text-slate-500 transition-colors"
                          title="Remove user"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Custom Name Input: User Change Our Name */}
            <form onSubmit={handleSaveCustomName} className="space-y-3 pt-2 border-t border-slate-800/80">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider block">
                {isTa ? 'புதிய பெயரை உள்ளிடவும் (Type New Name):' : 'Type New Name:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customNameInput}
                  onChange={(e) => setCustomNameInput(e.target.value)}
                  placeholder={isTa ? 'எ.கா: குமார், Sand.E, Arunan' : 'e.g. Sherlock, Sand.E, Alex'}
                  maxLength={24}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-sm text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!customNameInput.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isTa ? 'சேமி' : 'Save'}</span>
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                <span className="font-mono text-[10px] text-slate-500">Quick:</span>
                {['Sand.E', 'குமார்', 'Sherlock', 'அருணன்', 'Player 1'].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setCustomNameInput(suggestion)}
                    className="px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </form>

            <p className="text-[11px] text-slate-400 leading-relaxed font-serif pt-1">
              {isTa
                ? '💡 நீங்கள் அமைக்கும் பெயர் அனைத்து மர்மக் குற்ற வழக்குகள், துப்புகள் மற்றும் வெற்றிப் பலகையில் அதிகாரியாகப் பதிவாகும்.'
                : '💡 The detective name you select will be used in all case dossiers, forensic clues, and victory leaderboards.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
