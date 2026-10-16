import React, { useState, useEffect, useCallback } from 'react';
import { ChildPuzzle, Difficulty } from '../types/game';
import { AppLanguage } from '../types/i18n';
import { t, getSpeechLangCode } from '../utils/i18n';
import { CHILD_PUZZLES, getLocalizedChildPuzzle } from '../data/childPuzzles';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { saveScoreToLeaderboard } from '../utils/storage';
import { loadChildSession, saveChildSession, clearSession } from '../utils/gameSessionStorage';
import { ChildGuideModal } from './ChildGuideModal';
import {
  Sparkles,
  Star,
  CheckCircle2,
  HelpCircle,
  Clock,
  RotateCcw,
  ChevronRight,
  Heart,
  Smile,
  Zap,
  BookOpen,
  Volume2,
  VolumeX,
  BookmarkCheck,
} from 'lucide-react';

interface Props {
  currentLang?: AppLanguage;
  onWin: (stats: {
    mode: 'child';
    difficulty: Difficulty;
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  }) => void;
}

export const ChildGame: React.FC<Props> = ({ currentLang = 'ta', onWin }) => {
  const initialSaved = React.useMemo(() => loadChildSession(), []);

  const [puzzleIndex, setPuzzleIndex] = useState(() => initialSaved?.puzzleIndex ?? 0);
  const [selectedOption, setSelectedOption] = useState<number | null>(
    () => initialSaved?.selectedOption ?? null
  );
  const [isAnswered, setIsAnswered] = useState(() => initialSaved?.isAnswered ?? false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(() => initialSaved?.isCorrect ?? null);
  const [showHint, setShowHint] = useState(false);
  const [stars, setStars] = useState(3);
  const [totalStars, setTotalStars] = useState(() => initialSaved?.totalStars ?? 0);
  const [timeElapsed, setTimeElapsed] = useState(() => initialSaved?.timeElapsed ?? 0);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isResumedBanner, setIsResumedBanner] = useState(
    () => Boolean(initialSaved && (initialSaved.puzzleIndex > 0 || initialSaved.totalStars > 0))
  );

  // For mini-grid type
  const [gridState, setGridState] = useState<number[][]>(() => initialSaved?.gridState ?? []);

  const isRestoredFirstTimeRef = React.useRef(true);

  const rawPuzzle: ChildPuzzle = CHILD_PUZZLES[puzzleIndex % CHILD_PUZZLES.length];
  const currentPuzzle = getLocalizedChildPuzzle(rawPuzzle, currentLang);

  // Initialize or reset puzzle
  const initPuzzle = useCallback((puz: ChildPuzzle) => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setShowHint(false);
    setStars(3);
    setTimeElapsed(0);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);

    if (puz.type === 'grid' && puz.gridSize) {
      const empty = Array(puz.gridSize)
        .fill(0)
        .map(() => Array(puz.gridSize).fill(0));
      setGridState(empty);
    }
  }, []);

  useEffect(() => {
    if (isRestoredFirstTimeRef.current) {
      isRestoredFirstTimeRef.current = false;
      // If we didn't have gridState from save and puzzle is grid, initialize it
      if (rawPuzzle.type === 'grid' && rawPuzzle.gridSize && (!gridState || gridState.length === 0)) {
        const empty = Array(rawPuzzle.gridSize)
          .fill(0)
          .map(() => Array(rawPuzzle.gridSize).fill(0));
        setGridState(empty);
      }
      return;
    }
    initPuzzle(rawPuzzle);
  }, [rawPuzzle, initPuzzle]);

  // Persist current session continuously & when leaving app
  useEffect(() => {
    saveChildSession({
      puzzleIndex,
      totalStars,
      gridState,
      timeElapsed,
      selectedOption,
      isAnswered,
      isCorrect,
      lastUpdated: Date.now(),
    });
  }, [puzzleIndex, totalStars, gridState, timeElapsed, selectedOption, isAnswered, isCorrect]);

  useEffect(() => {
    const handleVis = () => {
      saveChildSession({
        puzzleIndex,
        totalStars,
        gridState,
        timeElapsed,
        selectedOption,
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
  }, [puzzleIndex, totalStars, gridState, timeElapsed, selectedOption, isAnswered, isCorrect]);

  // Timer: Pause when outside the app or answered
  useEffect(() => {
    if (isAnswered) return;
    const interval = setInterval(() => {
      if (document.hidden) return; // Freeze timer if user switched app or tab!
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

    try {
      window.speechSynthesis.cancel();
      const readText = `${currentPuzzle.title}. ${currentPuzzle.question} ${
        showHint ? currentPuzzle.hint : ''
      }`;
      const utterance = new SpeechSynthesisUtterance(readText);
      utterance.lang = getSpeechLangCode(currentLang);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  // Grid cell click
  const handleCellClick = (r: number, c: number) => {
    if (isAnswered || currentPuzzle.type !== 'grid') return;

    sound.playFill();
    const nextVal = gridState[r][c] === 1 ? 0 : 1;
    const newGrid = gridState.map((row, ri) =>
      row.map((val, ci) => (ri === r && ci === c ? nextVal : val))
    );
    setGridState(newGrid);

    // Check if grid matches solution
    if (currentPuzzle.gridSolution) {
      const isMatch = currentPuzzle.gridSolution.every((row, ri) =>
        row.every((val, ci) => val === newGrid[ri][ci])
      );

      if (isMatch) {
        handleWin();
      }
    }
  };

  // Choice option click
  const handleSelectChoice = (optionId: number) => {
    if (isAnswered) return;
    sound.playClick(520);
    setSelectedOption(optionId);
  };

  const handleConfirmChoice = () => {
    if (selectedOption === null || isAnswered) return;

    const correct = selectedOption === currentPuzzle.correctAnswerIndex;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      handleWin();
    } else {
      sound.playBuzzer();
      setStars((prev) => Math.max(1, prev - 1));
    }
  };

  const handleWin = () => {
    setIsAnswered(true);
    setIsCorrect(true);
    sound.playFanfare();
    triggerConfetti();

    setTotalStars((prev) => prev + stars);

    // Calculate junior friendly IQ rating
    const juniorIQ = Math.min(138, 110 + stars * 6 + (timeElapsed < 25 ? 6 : 2));
    const score = 1500 + stars * 500 + Math.max(0, 40 - timeElapsed) * 20;

    saveScoreToLeaderboard({
      playerName: 'Junior Genius',
      mode: 'child',
      difficulty: 'easy',
      score,
      iqEstimate: juniorIQ,
      timeSeconds: timeElapsed,
      accuracy: stars === 3 ? 100 : stars === 2 ? 85 : 70,
      notes: `Child IQ: ${currentPuzzle.title} (⭐⭐⭐)`,
    });

    onWin({
      mode: 'child',
      difficulty: 'easy',
      score,
      iqEstimate: juniorIQ,
      timeSeconds: timeElapsed,
      accuracy: stars === 3 ? 100 : stars === 2 ? 85 : 70,
      title: currentPuzzle.title,
    });
  };

  const handleNextPuzzle = () => {
    sound.playClick(480);
    const nextIdx = (puzzleIndex + 1) % CHILD_PUZZLES.length;
    setPuzzleIndex(nextIdx);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 w-full min-w-0">
      {/* Level Continuity Notification */}
      {isResumedBanner && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {currentLang === 'ta'
                ? `முந்தைய நிலை தொடர்கிறது: நிலை ${puzzleIndex + 1} / ${CHILD_PUZZLES.length}`
                : `Resumed previous progress: Level ${puzzleIndex + 1} / ${CHILD_PUZZLES.length}`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSession('child');
              setPuzzleIndex(0);
              setTotalStars(0);
              setIsResumedBanner(false);
              initPuzzle(CHILD_PUZZLES[0]);
            }}
            className="text-[11px] underline text-slate-400 hover:text-amber-200 cursor-pointer transition-colors"
          >
            {currentLang === 'ta' ? 'முதல் நிலையிலிருந்து தொடங்க' : 'Restart Level 1'}
          </button>
        </div>
      )}

      {/* Cheerful Junior Header Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-cyan-500/10 border border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl shadow-sm">
            {currentPuzzle.icon || '⭐'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                {t('modeChild', currentLang)}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 capitalize">{currentPuzzle.category}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">{currentPuzzle.title}</h2>
          </div>
        </div>

        {/* Stars Collected, Timer, Speech & Child Guide Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-3 bg-slate-950/70 px-3.5 py-2 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-amber-300 font-mono tabular-nums text-sm">
                {totalStars} {t('stars', currentLang)}
              </span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-200 tabular-nums">{formatTime(timeElapsed)}</span>
            </div>
          </div>

          {/* Voice read-aloud button for young learners */}
          <button
            type="button"
            onClick={handleSpeech}
            className={`p-2 sm:px-3 sm:py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isSpeaking
                ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-amber-400/50 hover:bg-slate-850'
            }`}
            title={isSpeaking ? t('stopVoice', currentLang) : t('readAloud', currentLang)}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline">
              {isSpeaking ? t('stopVoice', currentLang) : t('readAloud', currentLang)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick(520);
              setIsGuideOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-md cursor-pointer whitespace-nowrap"
            title={t('howToPlay', currentLang)}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('childGuideBtn', currentLang)}</span>
          </button>
        </div>
      </div>

      {/* Main Play Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 text-center shadow-xl">
        <div className="max-w-xl mx-auto space-y-2">
          <p className="text-lg font-bold text-slate-100">{currentPuzzle.question}</p>
        </div>

        {/* --- TYPE 1: MINI GRID PUZZLE (3x3 or 4x4) --- */}
        {currentPuzzle.type === 'grid' && currentPuzzle.gridSize && (
          <div className="flex flex-col items-center justify-center space-y-4 py-2">
            <div className="p-4 rounded-3xl bg-slate-950 border-2 border-amber-500/30 shadow-2xl inline-block">
              {/* Grid with top and left clue labels */}
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `auto repeat(${currentPuzzle.gridSize}, minmax(50px, 64px))`,
                }}
              >
                {/* Top-Left Corner */}
                <div className="w-12 h-12 flex items-center justify-center text-xs text-amber-400 font-bold">
                  {currentPuzzle.icon}
                </div>

                {/* Column Clues */}
                {currentPuzzle.colClues?.map((clues, ci) => (
                  <div
                    key={`c-${ci}`}
                    className="w-12 sm:w-16 h-12 flex items-center justify-center text-amber-300 font-mono font-black text-sm sm:text-base bg-amber-950/20 rounded-xl border border-amber-500/20"
                  >
                    {clues.join(', ')}
                  </div>
                ))}

                {/* Rows with Clues & Big Cells */}
                {gridState.map((row, ri) => (
                  <React.Fragment key={`r-${ri}`}>
                    {/* Row Clue */}
                    <div className="w-12 h-12 sm:h-16 flex items-center justify-center text-amber-300 font-mono font-black text-sm sm:text-base bg-amber-950/20 rounded-xl border border-amber-500/20">
                      {currentPuzzle.rowClues?.[ri].join(', ')}
                    </div>

                    {/* Cells */}
                    {row.map((cellVal, ci) => {
                      const isFilled = cellVal === 1;
                      return (
                        <button
                          key={`cell-${ri}-${ci}`}
                          type="button"
                          onClick={() => handleCellClick(ri, ci)}
                          className={`w-12 sm:w-16 h-12 sm:h-16 rounded-2xl border-2 transition-all flex items-center justify-center cursor-pointer text-2xl font-bold shadow-md ${
                            isFilled
                              ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.5)] scale-105'
                              : 'bg-slate-900 border-slate-700/80 hover:border-amber-400/50 hover:bg-slate-850'
                          }`}
                        >
                          {isFilled ? currentPuzzle.icon || '⭐' : ''}
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              {currentLang === 'ta'
                ? 'கட்டங்களைத் தட்டி வண்ணம் தீட்டவும்! மேலே மற்றும் இடதுபுறம் உள்ள எண்களை கவனிக்கவும்.'
                : currentLang === 'fr'
                ? 'Touche les cases pour les colorier ! Suis les chiffres en haut et à gauche.'
                : currentLang === 'es'
                ? '¡Toca las casillas para colorearlas! Sigue los números de arriba y de la izquierda.'
                : currentLang === 'hi'
                ? 'बक्सों को छूकर रंग भरें! ऊपर और बाएँ दिए गए अंकों को देखें।'
                : 'Tap the squares to color them! Match the numbers on top and left.'}
            </p>
          </div>
        )}

        {/* --- TYPE 2: PATTERN & SEQUENCE CHOICE PUZZLE --- */}
        {currentPuzzle.type === 'choice' && (
          <div className="space-y-6">
            {/* Visual Sequence Chain */}
            <div className="flex flex-wrap items-center justify-center gap-3 p-6 rounded-3xl bg-slate-950 border border-slate-800">
              {currentPuzzle.sequenceVisual?.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                    item.label === 'Next?' || item.label?.includes('?')
                      ? 'border-2 border-dashed border-amber-400 bg-amber-500/10 min-w-[70px] min-h-[75px] animate-pulse'
                      : 'border-slate-800 bg-slate-900/90 min-w-[70px] min-h-[75px]'
                  }`}
                >
                  <span className="text-3xl select-none">{item.emoji}</span>
                  <span className="text-[11px] font-semibold text-slate-300 mt-1 font-sans">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* 4 Large Touch-Friendly Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {currentPuzzle.options?.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let cardStyle =
                  'border-slate-800 bg-slate-950/80 hover:border-amber-400/60 hover:bg-slate-900';

                if (isSelected) {
                  cardStyle =
                    'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]';
                }
                if (isAnswered) {
                  if (idx === currentPuzzle.correctAnswerIndex) {
                    cardStyle =
                      'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'border-rose-500 bg-rose-950/40 text-rose-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectChoice(idx)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer select-none ${cardStyle}`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="text-xs font-bold text-slate-100">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Confirm Choice Button */}
            {!isAnswered ? (
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleConfirmChoice}
                className="w-full max-w-sm mx-auto py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{t('checkAnswer', currentLang)}</span>
                <CheckCircle2 className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        )}

        {/* Hint & Encouragement Box */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick(440);
                setShowHint(!showHint);
              }}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? t('hideClue', currentLang) : t('needClue', currentLang)}</span>
            </button>
            <span className="text-slate-700">·</span>
            <button
              type="button"
              onClick={() => {
                sound.playClick(500);
                setIsGuideOpen(true);
              }}
              className="text-slate-400 hover:text-amber-400 underline underline-offset-2 transition-colors cursor-pointer"
            >
              {t('howToPlay', currentLang)} 📖
            </button>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                }`}
              />
            ))}
            <span className="text-slate-400 ml-1 font-mono">{t('stars', currentLang)}</span>
          </div>
        </div>

        {showHint && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 text-left leading-relaxed">
            💡 <strong>{t('helpfulClue', currentLang)}</strong> {currentPuzzle.hint}
          </div>
        )}

        {/* Solved Explanation Banner */}
        {isAnswered && (
          <div
            className={`p-5 rounded-2xl border text-center space-y-3 transition-all ${
              isCorrect
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-base font-extrabold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span className="text-emerald-300">{t('fantasticJob', currentLang)} ⭐⭐⭐</span>
                </>
              ) : (
                <span>{t('tryAgain', currentLang)}</span>
              )}
            </div>

            <p className="text-xs text-slate-300 max-w-md mx-auto">{currentPuzzle.explanation}</p>

            <button
              type="button"
              onClick={handleNextPuzzle}
              className="py-3 px-6 rounded-2xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>{t('nextPuzzle', currentLang)}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Interactive Child Guide & Instructions Modal */}
      <ChildGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
};
