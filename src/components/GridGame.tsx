import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Difficulty, GridPuzzle } from '../types/game';
import { AppLanguage } from '../types/i18n';
import { t } from '../utils/i18n';
import { GRID_PUZZLES, generateProceduralGridPuzzle } from '../data/gridPuzzles';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { calculateIQEstimate, saveScoreToLeaderboard } from '../utils/storage';
import { loadGridSession, saveGridSession, clearSession } from '../utils/gameSessionStorage';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Clock,
  Zap,
  ChevronRight,
  ShieldAlert,
  Flame,
  BookmarkCheck,
} from 'lucide-react';

interface Props {
  currentLang?: AppLanguage;
  onWin: (stats: {
    mode: 'grid';
    difficulty: Difficulty;
    score: number;
    iqEstimate: number;
    timeSeconds: number;
    accuracy: number;
    title: string;
  }) => void;
}

export const GridGame: React.FC<Props> = ({ currentLang = 'ta', onWin }) => {
  const isTa = currentLang === 'ta';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';
  const isHi = currentLang === 'hi';

  const initialSaved = useMemo(() => loadGridSession(), []);

  const [difficulty, setDifficulty] = useState<Difficulty>(() => initialSaved?.difficulty ?? 'easy');
  const [puzzleIndex, setPuzzleIndex] = useState(() => initialSaved?.puzzleIndex ?? 0);

  const initialPuzzle = useMemo(() => {
    const diff = initialSaved?.difficulty ?? 'easy';
    const subset = GRID_PUZZLES.filter((p) => p.difficulty === diff);
    const idx = initialSaved?.puzzleIndex ?? 0;
    return subset[idx % subset.length] || GRID_PUZZLES[0];
  }, [initialSaved]);

  const [currentPuzzle, setCurrentPuzzle] = useState<GridPuzzle>(initialPuzzle);

  // Grid state: 0 = unselected, 1 = filled, 2 = crossed
  const [playerGrid, setPlayerGrid] = useState<number[][]>(() => {
    if (
      initialSaved?.playerGrid &&
      initialSaved.playerGrid.length === initialPuzzle.size &&
      initialSaved.playerGrid[0]?.length === initialPuzzle.size
    ) {
      return initialSaved.playerGrid;
    }
    return Array(initialPuzzle.size)
      .fill(0)
      .map(() => Array(initialPuzzle.size).fill(0));
  });

  const [activeTool, setActiveTool] = useState<'fill' | 'cross'>('fill');
  const [isHardcore, setIsHardcore] = useState(() => initialSaved?.isHardcore ?? false);
  const [strikes, setStrikes] = useState(() => initialSaved?.strikes ?? 0);
  const [moves, setMoves] = useState(() => initialSaved?.moves ?? 0);
  const [errors, setErrors] = useState(() => initialSaved?.errors ?? 0);
  const [hintsUsed, setHintsUsed] = useState(() => initialSaved?.hintsUsed ?? 0);
  const [timeElapsed, setTimeElapsed] = useState(() => initialSaved?.timeElapsed ?? 0);
  const [timerActive, setTimerActive] = useState(true);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<number>(1);
  const [isResumedBanner, setIsResumedBanner] = useState(
    () =>
      Boolean(
        initialSaved &&
          (initialSaved.moves > 0 ||
            initialSaved.puzzleIndex > 0 ||
            initialSaved.playerGrid?.some((row) => row.some((c) => c !== 0)))
      )
  );

  const isRestoredFirstTimeRef = React.useRef(Boolean(initialSaved));

  // Available puzzles for current difficulty
  const availablePuzzles = useMemo(() => {
    return GRID_PUZZLES.filter((p) => p.difficulty === difficulty);
  }, [difficulty]);

  // Load selected puzzle
  const loadPuzzle = useCallback(
    (puz: GridPuzzle) => {
      setCurrentPuzzle(puz);
      const empty = Array(puz.size)
        .fill(0)
        .map(() => Array(puz.size).fill(0));
      setPlayerGrid(empty);
      setStrikes(0);
      setMoves(0);
      setErrors(0);
      setHintsUsed(0);
      setTimeElapsed(0);
      setTimerActive(true);
      setHintMessage(null);
      setIsCompleted(false);
    },
    []
  );

  // Switch difficulty
  const handleSelectDifficulty = (diff: Difficulty) => {
    sound.playClick(480);
    setDifficulty(diff);
    setPuzzleIndex(0);
    const subset = GRID_PUZZLES.filter((p) => p.difficulty === diff);
    loadPuzzle(subset[0] || generateProceduralGridPuzzle(diff));
  };

  // Switch puzzle within difficulty
  const handleNextPuzzle = () => {
    sound.playClick(520);
    const nextIdx = (puzzleIndex + 1) % availablePuzzles.length;
    setPuzzleIndex(nextIdx);
    if (nextIdx === 0 && puzzleIndex === availablePuzzles.length - 1) {
      // Generate endless procedural puzzle!
      loadPuzzle(generateProceduralGridPuzzle(difficulty));
    } else {
      loadPuzzle(availablePuzzles[nextIdx]);
    }
  };

  // Initialize first puzzle only if not restored from saved state
  useEffect(() => {
    if (isRestoredFirstTimeRef.current) {
      isRestoredFirstTimeRef.current = false;
      return;
    }
    loadPuzzle(GRID_PUZZLES[0]);
  }, [loadPuzzle]);

  // Save grid session continuously & on exit
  useEffect(() => {
    if (isCompleted) return;
    saveGridSession({
      difficulty,
      puzzleIndex,
      playerGrid,
      strikes,
      moves,
      errors,
      hintsUsed,
      timeElapsed,
      isHardcore,
      lastUpdated: Date.now(),
    });
  }, [
    difficulty,
    puzzleIndex,
    playerGrid,
    strikes,
    moves,
    errors,
    hintsUsed,
    timeElapsed,
    isHardcore,
    isCompleted,
  ]);

  useEffect(() => {
    const handleVis = () => {
      if (!isCompleted) {
        saveGridSession({
          difficulty,
          puzzleIndex,
          playerGrid,
          strikes,
          moves,
          errors,
          hintsUsed,
          timeElapsed,
          isHardcore,
          lastUpdated: Date.now(),
        });
      }
    };
    document.addEventListener('visibilitychange', handleVis);
    window.addEventListener('beforeunload', handleVis);
    return () => {
      document.removeEventListener('visibilitychange', handleVis);
      window.removeEventListener('beforeunload', handleVis);
    };
  }, [
    difficulty,
    puzzleIndex,
    playerGrid,
    strikes,
    moves,
    errors,
    hintsUsed,
    timeElapsed,
    isHardcore,
    isCompleted,
  ]);

  // Timer tick (paused when user is outside the app or completed)
  useEffect(() => {
    if (!timerActive || isCompleted) return;
    const interval = setInterval(() => {
      if (document.hidden) return; // Freeze timer if outside app!
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, isCompleted]);

  // Check if row clue is satisfied
  const isRowSatisfied = useCallback(
    (rowIndex: number): boolean => {
      if (!currentPuzzle || !playerGrid[rowIndex]) return false;
      const expectedClues = currentPuzzle.rowClues[rowIndex];
      if (expectedClues.length === 1 && expectedClues[0] === 0) {
        return !playerGrid[rowIndex].some((c) => c === 1);
      }
      const actualClues: number[] = [];
      let count = 0;
      for (let c = 0; c < currentPuzzle.size; c++) {
        if (playerGrid[rowIndex][c] === 1) {
          count++;
        } else if (count > 0) {
          actualClues.push(count);
          count = 0;
        }
      }
      if (count > 0) actualClues.push(count);
      return JSON.stringify(actualClues) === JSON.stringify(expectedClues);
    },
    [currentPuzzle, playerGrid]
  );

  // Check if col clue is satisfied
  const isColSatisfied = useCallback(
    (colIndex: number): boolean => {
      if (!currentPuzzle) return false;
      const expectedClues = currentPuzzle.colClues[colIndex];
      if (expectedClues.length === 1 && expectedClues[0] === 0) {
        for (let r = 0; r < currentPuzzle.size; r++) {
          if (playerGrid[r]?.[colIndex] === 1) return false;
        }
        return true;
      }
      const actualClues: number[] = [];
      let count = 0;
      for (let r = 0; r < currentPuzzle.size; r++) {
        if (playerGrid[r]?.[colIndex] === 1) {
          count++;
        } else if (count > 0) {
          actualClues.push(count);
          count = 0;
        }
      }
      if (count > 0) actualClues.push(count);
      return JSON.stringify(actualClues) === JSON.stringify(expectedClues);
    },
    [currentPuzzle, playerGrid]
  );

  // Check overall puzzle completion
  const checkVictory = useCallback(
    (grid: number[][]) => {
      if (isCompleted || !currentPuzzle) return;
      let allFilledMatch = true;

      for (let r = 0; r < currentPuzzle.size; r++) {
        for (let c = 0; c < currentPuzzle.size; c++) {
          const solutionVal = currentPuzzle.solution[r][c];
          const playerVal = grid[r][c];
          if (solutionVal === 1 && playerVal !== 1) {
            allFilledMatch = false;
            break;
          }
          if (solutionVal === 0 && playerVal === 1) {
            allFilledMatch = false;
            break;
          }
        }
        if (!allFilledMatch) break;
      }

      if (allFilledMatch) {
        setIsCompleted(true);
        setTimerActive(false);
        sound.playFanfare();
        triggerConfetti();

        const accuracy = Math.max(60, 100 - errors * 6 - hintsUsed * 4);
        const { iq, score } = calculateIQEstimate(difficulty, timeElapsed, accuracy, 'grid');

        // Automatically save to local browser storage!
        saveScoreToLeaderboard({
          playerName: 'Player 1',
          mode: 'grid',
          difficulty,
          score,
          iqEstimate: iq,
          timeSeconds: timeElapsed,
          accuracy,
          notes: `${currentPuzzle.title} (${currentPuzzle.size}x${currentPuzzle.size})`,
        });

        onWin({
          mode: 'grid',
          difficulty,
          score,
          iqEstimate: iq,
          timeSeconds: timeElapsed,
          accuracy,
          title: currentPuzzle.title,
        });
      }
    },
    [currentPuzzle, difficulty, errors, hintsUsed, isCompleted, onWin, timeElapsed]
  );

  // Cell Interaction Handler
  const handleCellAction = (row: number, col: number, overrideTool?: 'fill' | 'cross') => {
    if (isCompleted || !currentPuzzle) return;

    const tool = overrideTool || activeTool;
    const currentVal = playerGrid[row][col];
    let nextVal = 0;

    if (tool === 'fill') {
      nextVal = currentVal === 1 ? 0 : 1;
    } else {
      nextVal = currentVal === 2 ? 0 : 2;
    }

    // Play appropriate sound
    if (nextVal === 1) sound.playFill();
    else if (nextVal === 2) sound.playCross();
    else sound.playClear();

    // Check for mistake if hardcore mode
    if (nextVal === 1 && currentPuzzle.solution[row][col] === 0) {
      setErrors((prev) => prev + 1);
      if (isHardcore) {
        setStrikes((prev) => {
          const s = prev + 1;
          sound.playBuzzer();
          if (s >= 3) {
            alert('Game Over! 3 strikes reached. Restarting puzzle.');
            loadPuzzle(currentPuzzle);
          }
          return s;
        });
        return;
      }
    }

    const newGrid = playerGrid.map((r, rIdx) =>
      r.map((c, cIdx) => (rIdx === row && cIdx === col ? nextVal : c))
    );

    setPlayerGrid(newGrid);
    setMoves((prev) => prev + 1);
    checkVictory(newGrid);
  };

  // Provide a logical deductive hint
  const handleRequestHint = () => {
    if (isCompleted || !currentPuzzle) return;
    sound.playClick(620);
    setHintsUsed((prev) => prev + 1);

    // Find an unfilled cell that should be 1, or an uncrossed cell that should be 0
    for (let r = 0; r < currentPuzzle.size; r++) {
      for (let c = 0; c < currentPuzzle.size; c++) {
        if (currentPuzzle.solution[r][c] === 1 && playerGrid[r][c] !== 1) {
          const rowClues = currentPuzzle.rowClues[r].join(', ');
          const colClues = currentPuzzle.colClues[c].join(', ');
          const hintMsg = isTa
            ? `தர்க்கக் குறிப்பு: வரிசை ${r + 1} (குறிப்புகள்: [${rowClues}]) மற்றும் நெடுவரிசை ${c + 1} (குறிப்புகள்: [${colClues}]) ஆகியவற்றைக் கவனியுங்கள். கட்டம் (${r + 1}, ${c + 1}) கண்டிப்பாக நிரப்பப்பட வேண்டும்.`
            : isFr
            ? `Indice : Observez la ligne ${r + 1} (Indices : [${rowClues}]) et la colonne ${c + 1} (Indices : [${colClues}]). La case (${r + 1}, ${c + 1}) doit être REMPLIE.`
            : isEs
            ? `Pista : Mira la fila ${r + 1} (Pistas: [${rowClues}]) y la columna ${c + 1} (Pistas: [${colClues}]). La celda (${r + 1}, ${c + 1}) debe LLENARSE.`
            : isHi
            ? `संकेत: पंक्ति ${r + 1} (संकेत: [${rowClues}]) और स्तंभ ${c + 1} (संकेत: [${colClues}]) देखें। खाना (${r + 1}, ${c + 1}) अवश्य भरा जाना चाहिए।`
            : `Deduction hint: Look at Row ${r + 1} (Clues: [${rowClues}]) and Column ${c + 1} (Clues: [${colClues}]). Cell (${r + 1}, ${c + 1}) must be FILLED.`;
          setHintMessage(hintMsg);
          // Highlight that cell briefly
          const newGrid = playerGrid.map((rowArr, ri) =>
            rowArr.map((val, ci) => (ri === r && ci === c ? 1 : val))
          );
          setPlayerGrid(newGrid);
          sound.playSuccess();
          checkVictory(newGrid);
          return;
        }
      }
    }

    setHintMessage(
      isTa
        ? 'நிரப்ப வேண்டிய அனைத்துக் கட்டங்களும் கண்டுபிடிக்கப்பட்டுவிட்டன! மீதமுள்ள காலிக் கட்டங்களை (×) எனக் குறியிடுங்கள்.'
        : isFr
        ? 'Toutes les cases remplies sont déjà trouvées ! Cochez les espaces vides restants.'
        : isEs
        ? '¡Todas las casillas llenas ya han sido encontradas! Marca los espacios vacíos.'
        : isHi
        ? 'सभी भरे खाने मिल चुके हैं! शेष खाली स्थानों पर क्रॉस (×) लगाएँ।'
        : 'All filled cells have already been found! Cross out remaining empty spaces.'
    );
  };

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 w-full min-w-0">
      {/* Puzzle Continuity Notification */}
      {isResumedBanner && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              {isTa
                ? `முந்தைய புதிர் தொடர்கிறது: நிலை ${t(difficulty, currentLang)} #${puzzleIndex + 1} (${moves} நகர்வுகள் சேமிக்கப்பட்டது)`
                : `Resumed previous puzzle: ${t(difficulty, currentLang)} #${puzzleIndex + 1} (${moves} moves saved)`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSession('grid');
              const empty = Array(currentPuzzle.size)
                .fill(0)
                .map(() => Array(currentPuzzle.size).fill(0));
              setPlayerGrid(empty);
              setStrikes(0);
              setMoves(0);
              setErrors(0);
              setHintsUsed(0);
              setTimeElapsed(0);
              setIsResumedBanner(false);
            }}
            className="text-[11px] underline text-slate-400 hover:text-cyan-200 cursor-pointer transition-colors"
          >
            {isTa ? 'புதிரை மறுதொடக்கம் செய்ய' : 'Restart Puzzle'}
          </button>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        {/* Difficulty segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
          {(['easy', 'medium', 'hard', 'master'] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleSelectDifficulty(d)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize whitespace-nowrap ${
                difficulty === d
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t(d, currentLang)} {d === 'easy' ? '5x5' : d === 'medium' ? '6x6' : d === 'hard' ? '7x7' : '8x8'}
            </button>
          ))}
        </div>

        {/* Live HUD info */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono tabular-nums text-slate-200">{formatTime(timeElapsed)}</span>
          </div>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono tabular-nums text-slate-200">
              {moves} {isTa ? 'நகர்வுகள்' : isFr ? 'coups' : isEs ? 'movs' : isHi ? 'चालें' : 'moves'}
            </span>
          </div>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsHardcore(!isHardcore)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                isHardcore ? 'bg-rose-950/40 text-rose-400 border border-rose-800/40' : 'text-slate-500 hover:text-slate-400'
              }`}
              title={isTa ? 'கடுமை முறை: 3 பிழைகள் ஏற்பட்டால் ஆட்டம் முடிவடையும்' : 'Hardcore Mode: 3 strikes and game over'}
            >
              <Flame className="w-3 h-3" />
              <span>
                {isHardcore
                  ? `${isTa ? 'பிழைகள்' : 'Strikes'}: ${strikes}/3`
                  : isTa
                  ? 'கடுமை: ஆஃப்'
                  : 'Hardcore: Off'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Puzzle Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Puzzle Board */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center select-none">
          <div className="w-full flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{currentPuzzle.title}</h2>
              {currentPuzzle.description && (
                <p className="text-xs text-slate-400 mt-0.5">{currentPuzzle.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClear();
                  loadPuzzle(currentPuzzle);
                }}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                title={t('reset', currentLang)}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextPuzzle}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors cursor-pointer"
              >
                <span>{t('nextPuzzle', currentLang)}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid Container with Clues */}
          <div className="inline-block p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-x-auto max-w-full">
            <div className="grid" style={{ gridTemplateColumns: `auto repeat(${currentPuzzle.size}, minmax(36px, 48px))` }}>
              {/* Top-Left Blank Intersection */}
              <div className="w-14 sm:w-20 h-14 sm:h-20 border-b-2 border-r-2 border-slate-700/80 flex items-center justify-center text-[10px] text-slate-600 font-mono">
                CLUES
              </div>

              {/* Column Clues (Vertical Top) */}
              {currentPuzzle.colClues.map((clues, cIdx) => {
                const satisfied = isColSatisfied(cIdx);
                return (
                  <div
                    key={`col-${cIdx}`}
                    className={`h-14 sm:h-20 border-b-2 border-slate-700/80 flex flex-col justify-end items-center pb-1 gap-0.5 transition-colors ${
                      satisfied ? 'bg-emerald-950/20 text-emerald-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {clues.map((clue, idx) => (
                      <span
                        key={idx}
                        className={`text-xs font-mono font-medium leading-none ${
                          satisfied ? 'line-through opacity-60 text-emerald-300' : ''
                        }`}
                      >
                        {clue}
                      </span>
                    ))}
                  </div>
                );
              })}

              {/* Rows with Row Clues & Cells */}
              {playerGrid.map((row, rIdx) => {
                const rowSatisfied = isRowSatisfied(rIdx);
                return (
                  <React.Fragment key={`row-${rIdx}`}>
                    {/* Row Clue Header */}
                    <div
                      className={`w-14 sm:w-20 border-r-2 border-slate-700/80 pr-2 flex items-center justify-end gap-1.5 transition-colors ${
                        rowSatisfied ? 'bg-emerald-950/20 text-emerald-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {currentPuzzle.rowClues[rIdx].map((clue, idx) => (
                        <span
                          key={idx}
                          className={`text-xs font-mono font-medium ${
                            rowSatisfied ? 'line-through opacity-60 text-emerald-300' : ''
                          }`}
                        >
                          {clue}
                        </span>
                      ))}
                    </div>

                    {/* Row Cells */}
                    {row.map((cellVal, cIdx) => {
                      const isFilled = cellVal === 1;
                      const isCrossed = cellVal === 2;

                      return (
                        <button
                          key={`cell-${rIdx}-${cIdx}`}
                          type="button"
                          onContextMenu={(e) => {
                            e.preventDefault();
                            handleCellAction(rIdx, cIdx, 'cross');
                          }}
                          onClick={() => handleCellAction(rIdx, cIdx)}
                          className={`w-9 sm:w-12 h-9 sm:h-12 border border-slate-800/80 transition-all flex items-center justify-center font-bold text-base focus:outline-none ${
                            isFilled
                              ? 'bg-cyan-500 border-cyan-400 shadow-[inset_0_0_10px_rgba(6,182,212,0.5)] text-slate-950'
                              : isCrossed
                              ? 'bg-slate-900/90 text-slate-500 hover:bg-slate-850'
                              : 'bg-slate-950 hover:bg-slate-900/80'
                          }`}
                        >
                          {isCrossed && <span className="font-mono text-sm sm:text-base text-rose-400/70">×</span>}
                        </button>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Touch Tool Toggle (Mobile & Quick Action) */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">
              {isTa ? 'கருவி:' : isFr ? 'Outil :' : isEs ? 'Herramienta :' : isHi ? 'टूल:' : 'Action Tool:'}
            </span>
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  sound.playClick(440);
                  setActiveTool('fill');
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTool === 'fill'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-3 h-3 rounded-sm bg-cyan-400 inline-block border border-cyan-200" />
                <span>{isTa ? 'நிரப்பு (Fill)' : isFr ? 'Remplir' : isEs ? 'Llenar' : isHi ? 'भरें (Tile)' : 'Fill (Tile)'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick(440);
                  setActiveTool('cross');
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTool === 'cross'
                    ? 'bg-rose-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="font-mono text-sm leading-none font-bold text-rose-300">×</span>
                <span>{isTa ? 'குறுக்குக்குறி (Cross ×)' : isFr ? 'Croix (Vide)' : isEs ? 'Cruz (Vacío)' : isHi ? 'क्रॉस (×)' : 'Cross (Empty)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Logic Assistant & Controls */}
        <div className="lg:col-span-4 space-y-4">
          {/* Rules & Instructions */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>
                {isTa
                  ? 'விளையாடும் முறை (எளிய விதிகள்)'
                  : isFr
                  ? 'Comment Jouer (Règles Simples)'
                  : isEs
                  ? 'Cómo Jugar (Reglas Simples)'
                  : isHi
                  ? 'खेलने के नियम (सरल गाइड)'
                  : 'How to Play (Simple Rules)'}
              </span>
            </div>
            <ul className="text-xs text-slate-400 space-y-2.5 leading-relaxed">
              <li>
                <strong className="text-slate-200">
                  {isTa
                    ? 'எண்கள் நிரப்பும் கட்டங்களைக் குறிக்கின்றன:'
                    : isFr
                    ? 'Les nombres indiquent les blocs :'
                    : isEs
                    ? 'Los números indican los bloques :'
                    : isHi
                    ? 'संख्याएँ भरे जाने वाले खानों को दर्शाती हैं:'
                    : 'Numbers show filled blocks:'}
                </strong>{' '}
                {isTa ? (
                  <>
                    <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300 font-mono">2, 1</code> என்பது தொடர்ந்து 2 நிரப்பப்பட்ட கட்டங்கள், பிறகு குறைந்தது 1 இடைவெளி, பின்னர் 1 நிரப்பப்பட்ட கட்டத்தைக் குறிக்கும்.
                  </>
                ) : isFr ? (
                  <>
                    Un indice <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300 font-mono">2, 1</code> signifie 2 cases consécutives remplies, au moins 1 espace vide, puis 1 case remplie.
                  </>
                ) : isEs ? (
                  <>
                    Una pista de <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300 font-mono">2, 1</code> significa 2 casillas seguidas llenas, al menos 1 espacio vacío, y luego 1 casilla llena.
                  </>
                ) : isHi ? (
                  <>
                    संकेत <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300 font-mono">2, 1</code> का अर्थ: 2 लगातार भरे खाने, कम से कम 1 खाली स्थान, फिर 1 भरा खाना।
                  </>
                ) : (
                  <>
                    A clue of <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300 font-mono">2, 1</code> means: 2 consecutive filled tiles, at least 1 empty space, then 1 filled tile.
                  </>
                )}
              </li>
              <li>
                <strong className="text-slate-200">
                  {isTa ? 'கட்டுப்பாடு:' : isFr ? 'Contrôles :' : isEs ? 'Controles :' : isHi ? 'कंट्रोल:' : 'Controls:'}
                </strong>{' '}
                {isTa
                  ? 'நிரப்ப இடது கிளிக் (Left-click ⬛), காலியாக வைக்க வலது கிளிக் (Right-click ✕).'
                  : isFr
                  ? 'Clic gauche pour Remplir (⬛), Clic droit pour Cocher (✕).'
                  : isEs
                  ? 'Clic izquierdo para Llenar (⬛), Clic derecho para Cruz (✕).'
                  : isHi
                  ? 'भरने के लिए बायाँ क्लिक (Left-click ⬛), खाली रखने के लिए दायाँ क्लिक (Right-click ✕)।'
                  : 'Left-click to Fill (⬛), Right-click to Mark Cross (✕).'}
              </li>
              <li>
                <strong className="text-slate-200">
                  {isTa ? 'பச்சை நிறம்:' : isFr ? 'Surlignage vert :' : isEs ? 'Resaltado verde :' : isHi ? 'हरा रंग:' : 'Green highlight:'}
                </strong>{' '}
                {isTa
                  ? 'சரியான வரிசை மற்றும் நெடுவரிசை அமைந்ததும் எண்கள் தானாகவே பச்சை நிறமாக மாறி அடிக்கப்படும்.'
                  : isFr
                  ? 'Quand une ligne ou colonne est correcte, les indices deviennent verts et sont barrés.'
                  : isEs
                  ? 'Cuando una fila o columna es correcta, los números se vuelven verdes y se tachan.'
                  : isHi
                  ? 'पंक्ति या स्तंभ पूरा होने पर संख्याएँ हरी होकर कट जाती हैं।'
                  : 'When a row or column is completed correctly, numbers turn green and cross out.'}
              </li>
            </ul>
          </div>

          {/* Hint Card */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>{isTa ? 'அறிவார்ந்த குறிப்பு (Smart Hint)' : isFr ? 'Indice Intelligent' : isEs ? 'Pista Inteligente' : isHi ? 'मदद संकेत (Smart Hint)' : 'Smart Hint'}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {isTa ? 'பயன்படுத்தியது:' : isFr ? 'Utilisé :' : isEs ? 'Usado :' : isHi ? 'उपयोग:' : 'Used:'} {hintsUsed}
              </span>
            </div>

            {hintMessage ? (
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed font-sans">
                {hintMessage}
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                {isTa
                  ? 'புதிரில் தடுமாற்றமா? அடுத்த சரியான நகர்வை அறிய கீழே கிளிக் செய்யவும்!'
                  : isFr
                  ? 'Besoin d’aide ? Cliquez ci-dessous pour voir le prochain coup correct !'
                  : isEs
                  ? '¿Necesitas ayuda? ¡Haz clic abajo para revelar el siguiente movimiento correcto!'
                  : isHi
                  ? 'मदद चाहिए? अगला सही कदम देखने के लिए नीचे क्लिक करें!'
                  : 'Need help? Tap below to reveal the next correct tile move!'}
              </p>
            )}

            <button
              type="button"
              onClick={handleRequestHint}
              className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTa ? 'அடுத்த நகர்வைக் காட்டு' : isFr ? 'Afficher l’Étape Suivante' : isEs ? 'Mostrar Siguiente Paso' : isHi ? 'अगला कदम दिखाएँ' : 'Show Next Step'}</span>
            </button>
          </div>

          {/* Quick Stats Pill */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono">
            <span>
              {isTa ? 'துல்லியம்' : isFr ? 'Précision' : isEs ? 'Precisión' : isHi ? 'सटीकता' : 'Accuracy'}: {Math.max(60, 100 - errors * 6 - hintsUsed * 4)}%
            </span>
            <span>
              {isTa ? 'பிழைகள்' : isFr ? 'Erreurs' : isEs ? 'Errores' : isHi ? 'गलतियाँ' : 'Errors'}: {errors}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
