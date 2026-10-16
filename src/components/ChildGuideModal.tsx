import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { AppLanguage } from '../types/i18n';
import { getSpeechLangCode, t } from '../utils/i18n';
import {
  X,
  BookOpen,
  Volume2,
  VolumeX,
  Star,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Smile,
  ArrowRight,
  Trophy,
  Grid3X3,
  Shapes,
  HelpCircle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: AppLanguage;
}

export const ChildGuideModal: React.FC<Props> = ({ isOpen, onClose, currentLang = 'ta' }) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'pattern' | 'counting' | 'stars'>('grid');
  const [practiceGrid, setPracticeGrid] = useState<number[][]>([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [practiceSolved, setPracticeSolved] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!isOpen) return null;

  const isTa = currentLang === 'ta';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';
  const isHi = currentLang === 'hi';

  const speechTexts = {
    grid: isTa
      ? 'மினி கட்ட தர்க்கத்திற்கு வரவேற்கிறோம்! மேலே மற்றும் பக்கவாட்டில் உள்ள எண்களைப் பாருங்கள். எண் 2 என்றால், அந்த வரிசையில் 2 கட்டங்களைத் தொட்டு வண்ணம் தீட்டுங்கள்!'
      : isFr
      ? 'Bienvenue dans la Grille Logique ! Regarde les chiffres. Si tu vois 2, touche 2 cases pour les colorier !'
      : isEs
      ? '¡Bienvenido a la Mini Rejilla Lógica! Mira los números. ¡Si ves un 2, toca 2 casillas para pintarlas!'
      : isHi
      ? 'मिनी ग्रिड पहेली में आपका स्वागत है! संख्याओं को देखें। अगर 2 लिखा है तो उस लाइन के 2 बक्से रंगें!'
      : 'Welcome to Mini Grid Logic! Look at the numbers on the side. If you see a number 2, tap 2 boxes to paint them!',
    pattern: isTa
      ? 'வடிவ வரிசைக்கு வரவேற்கிறோம்! வண்ணங்களை சத்தமாகப் பாடிப் பாருங்கள்: சிவப்பு, மஞ்சள், சிவப்பு, மஞ்சள்... அடுத்து என்ன வரும் என்று தொடுங்கள்!'
      : isFr
      ? 'Bienvenue aux Détectives des Motifs ! Répète à voix haute : rouge, jaune, rouge, jaune... et choisis le suivant !'
      : isEs
      ? '¡Bienvenido a los Patrones! Di los colores en voz alta: rojo, amarillo, rojo, amarillo... ¡y toca el siguiente!'
      : isHi
      ? 'पैटर्न पहचान में आपका स्वागत है! रंगों को ज़ोर से बोलें: लाल, पीला, लाल, पीला... और अगला चुनें!'
      : 'Welcome to Pattern Detective! Say the colors or animals out loud, like red, yellow, red, yellow. Then tap the one that comes next!',
    counting: isTa
      ? 'எண் தாவல் ஒரு சுவையான விளையாட்டு! ஒன்று, இரண்டு, மூன்று என்று விரல்களில் எண்ணுங்கள், அல்லது இரட்டைப் படிகளாகத் தாவுங்கள்!'
      : isFr
      ? 'Compter, c’est comme sauter de nénuphar en nénuphar ! Compte 1, 2, 3, 4, 5 ou saute de 2 en 2 !'
      : isEs
      ? '¡Contar es como dar saltitos de rana! Cuenta 1, 2, 3, 4, 5, ¡o salta de dos en dos!'
      : isHi
      ? 'गिनती करना मेंढक की छलाँग जैसा है! 1, 2, 3, 4, 5 गिनें या 2-2 कदम कूदें!'
      : 'Counting is like hopping on lily pads! Count 1, 2, 3, 4, 5, or skip hop by two!',
    stars: isTa
      ? 'ஒவ்வொரு புதிரிலும் நீங்கள் மூன்று தங்க நட்சத்திரங்களை வெல்லலாம்! உதவி தேவைப்பட்டால் துப்புக் குறிப்பு பொத்தானைத் தட்டுங்கள்!'
      : isFr
      ? 'Tu peux gagner 3 étoiles d’or sur chaque puzzle ! Touche le bouton indice si tu as besoin d’aide !'
      : isEs
      ? '¡Puedes ganar 3 estrellas doradas en cada acertijo! ¡Toca la pista si necesitas ayuda!'
      : isHi
      ? 'आप हर पहेली में 3 सुनहरे सितारे जीत सकते हैं! मदद के लिए सुराग वाला बटन दबाएँ!'
      : 'You can earn 3 shiny gold stars on every puzzle! Tap the clue button if you ever need a little help!',
  };

  // Speech synthesis for kids
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
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

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handlePracticeCellClick = (r: number, c: number) => {
    sound.playFill();
    const nextVal = practiceGrid[r][c] === 1 ? 0 : 1;
    const newGrid = practiceGrid.map((row, ri) =>
      row.map((val, ci) => (ri === r && ci === c ? nextVal : val))
    );
    setPracticeGrid(newGrid);

    // Goal: paint top-left (0,0), top-right (0,2), and all 3 bottom (2,0), (2,1), (2,2)
    if (
      newGrid[0][0] === 1 &&
      newGrid[0][2] === 1 &&
      newGrid[2][0] === 1 &&
      newGrid[2][1] === 1 &&
      newGrid[2][2] === 1
    ) {
      setPracticeSolved(true);
      sound.playSuccess();
    }
  };

  const resetPractice = () => {
    sound.playClear();
    setPracticeGrid([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    setPracticeSolved(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
              ⭐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase font-mono tracking-wider text-amber-400">
                  {isTa
                    ? 'அருணன் IQ · சுட்டி அரங்கம்'
                    : isFr
                    ? 'Arunan IQ · Académie Junior'
                    : isEs
                    ? 'Arunan IQ · Academia Infantil'
                    : isHi
                    ? 'अरुणन IQ · जूनियर अकादमी'
                    : 'Arunan IQ · Junior Academy'}
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {isTa
                  ? 'விளையாடும் முறை: சுட்டி IQ வழிகாட்டி'
                  : isFr
                  ? 'Comment Jouer : Guide QI Enfant'
                  : isEs
                  ? 'Cómo Jugar: Guía CI Infantil'
                  : isHi
                  ? 'कैसे खेलें: बाल IQ गाइड'
                  : 'How to Play: Child IQ Guide'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                else {
                  speakText(speechTexts[activeTab]);
                }
              }}
              className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-750'
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
                stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar border-b border-slate-800/80">
          {[
            {
              id: 'grid',
              label: isTa
                ? '1. மினி கட்டங்கள்'
                : isFr
                ? '1. Mini Grilles'
                : isEs
                ? '1. Mini Rejillas'
                : isHi
                ? '1. मिनी ग्रिड'
                : '1. Mini Grids',
              icon: '🎨',
            },
            {
              id: 'pattern',
              label: isTa
                ? '2. வடிவ தாளங்கள்'
                : isFr
                ? '2. Motifs'
                : isEs
                ? '2. Patrones'
                : isHi
                ? '2. पैटर्न'
                : '2. Patterns',
              icon: '🎈',
            },
            {
              id: 'counting',
              label: isTa
                ? '3. எண் தாவல்கள்'
                : isFr
                ? '3. Sauts Chiffrés'
                : isEs
                ? '3. Saltos de Números'
                : isHi
                ? '3. संख्या कूद'
                : '3. Number Hops',
              icon: '🐸',
            },
            {
              id: 'stars',
              label: isTa
                ? '4. நட்சத்திரங்கள் & உதவி'
                : isFr
                ? '4. Étoiles & Aide'
                : isEs
                ? '4. Estrellas y Ayuda'
                : isHi
                ? '4. सितारे और मदद'
                : '4. Stars & Help',
              icon: '⭐',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                stopSpeaking();
                sound.playClick(500);
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-102'
                  : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Guide Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* TAB 1: MINI GRIDS */}
          {activeTab === 'grid' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-200 leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <span>🎨</span>
                  <span>
                    {isTa
                      ? 'விதி 1: எண்களின் குறிப்பைப் பார்த்து கட்டங்களை வண்ணமாக்குங்கள்'
                      : isFr
                      ? 'Règle n°1 : Peins les cases selon les chiffres indices'
                      : isEs
                      ? 'Regla n°1: Pinta las casillas según las pistas de números'
                      : isHi
                      ? 'नियम 1: संख्याओं के सुराग देखकर बक्सों को रंगें'
                      : 'Rule #1: Paint Squares with Number Clues'}
                  </span>
                </div>
                <p>
                  {isTa
                    ? 'கட்டத்தின் மேல் மற்றும் இடதுபுறம் உள்ள எண்களைப் பாருங்கள்:'
                    : isFr
                    ? 'Regarde les chiffres en haut et à gauche de la grille :'
                    : isEs
                    ? 'Mira los números en la parte superior y a la izquierda:'
                    : isHi
                    ? 'ग्रिड के ऊपर और बाएँ दिए गए अंकों को देखें:'
                    : 'Look at the numbers on the top and left of the grid:'}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-amber-100">
                  <li>
                    {isTa ? (
                      <>
                        எண் <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">1</strong> என்றால்: அந்த வரிசையில் <strong>1</strong> கட்டத்தை மட்டுமே வண்ணமாக்க வேண்டும்!
                      </>
                    ) : isFr ? (
                      <>
                        Un chiffre <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">1</strong> signifie : Colorie <strong>1</strong> case sur cette ligne !
                      </>
                    ) : isEs ? (
                      <>
                        Un número <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">1</strong> significa: ¡Pinta <strong>1</strong> casilla en esa línea!
                      </>
                    ) : isHi ? (
                      <>
                        संख्या <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">1</strong> का अर्थ: उस लाइन में केवल <strong>1</strong> बक्सा रंगें!
                      </>
                    ) : (
                      <>
                        A number <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">1</strong> means: Paint <strong>1</strong> square in that line!
                      </>
                    )}
                  </li>
                  <li>
                    {isTa ? (
                      <>
                        எண் <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">3</strong> என்றால்: அந்த வரிசையில் உள்ள <strong>3</strong> கட்டங்களையும் வண்ணமாக்க வேண்டும்!
                      </>
                    ) : isFr ? (
                      <>
                        Un chiffre <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">3</strong> signifie : Colorie les <strong>3</strong> cases !
                      </>
                    ) : isEs ? (
                      <>
                        Un número <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">3</strong> significa: ¡Pinta las <strong>3</strong> casillas!
                      </>
                    ) : isHi ? (
                      <>
                        संख्या <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">3</strong> का अर्थ: उस लाइन के सभी <strong>3</strong> बक्से रंगें!
                      </>
                    ) : (
                      <>
                        A number <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">3</strong> means: Paint all <strong>3</strong> squares in that line!
                      </>
                    )}
                  </li>
                  <li>
                    {isTa ? (
                      <>
                        எண் <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">0</strong> என்றால்: அந்த வரிசையில் எந்த கட்டத்தையும் தொடக்கூடாது!
                      </>
                    ) : isFr ? (
                      <>
                        Un chiffre <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">0</strong> signifie : Laisse toute la ligne vide !
                      </>
                    ) : isEs ? (
                      <>
                        Un número <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">0</strong> significa: ¡Deja toda la línea limpia!
                      </>
                    ) : isHi ? (
                      <>
                        संख्या <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">0</strong> का अर्थ: उस पूरी लाइन को खाली छोड़ दें!
                      </>
                    ) : (
                      <>
                        A number <strong className="font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-300">0</strong> means: Leave that whole line clean and empty!
                      </>
                    )}
                  </li>
                </ul>
              </div>

              {/* Interactive Mini Practice Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">
                    {isTa
                      ? 'இப்போதே முயற்சி செய்து சிரிக்கும் முகத்தை வரையுங்கள்! 😊'
                      : isFr
                      ? 'Essaie maintenant : Dessine un sourire ! 😊'
                      : isEs
                      ? 'Pruébalo ahora: ¡Dibuja una carita feliz! 😊'
                      : isHi
                      ? 'अभी आज़माएँ: मुस्कुराता चेहरा बनाएँ! 😊'
                      : 'Try it right now: Paint a Smiley! 😊'}
                  </span>
                  <button
                    type="button"
                    onClick={resetPractice}
                    className="text-amber-400 hover:text-amber-300 text-[11px] underline cursor-pointer"
                  >
                    {isTa ? 'மீண்டும் செய்' : isFr ? 'Réinitialiser' : isEs ? 'Reiniciar' : isHi ? 'रीसेट' : 'Reset Grid'}
                  </button>
                </div>

                <div className="inline-block p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <div
                    className="grid gap-1.5"
                    style={{ gridTemplateColumns: 'auto repeat(3, 44px)' }}
                  >
                    <div className="w-10 h-10 flex items-center justify-center text-xs text-amber-400 font-bold">
                      😊
                    </div>
                    {/* Col Clues */}
                    <div className="w-11 h-10 flex items-center justify-center font-mono font-bold text-xs text-amber-300 bg-amber-950/30 rounded-lg">
                      1, 1
                    </div>
                    <div className="w-11 h-10 flex items-center justify-center font-mono font-bold text-xs text-amber-300 bg-amber-950/30 rounded-lg">
                      1
                    </div>
                    <div className="w-11 h-10 flex items-center justify-center font-mono font-bold text-xs text-amber-300 bg-amber-950/30 rounded-lg">
                      1, 1
                    </div>

                    {/* Row 1: Eyes */}
                    <div className="w-10 h-11 flex items-center justify-center font-mono font-bold text-xs text-amber-300 bg-amber-950/30 rounded-lg">
                      1, 1
                    </div>
                    {[0, 1, 2].map((c) => (
                      <button
                        key={`cell-0-${c}`}
                        type="button"
                        onClick={() => handlePracticeCellClick(0, c)}
                        className={`w-11 h-11 rounded-xl border transition-all text-lg font-bold flex items-center justify-center cursor-pointer ${
                          practiceGrid[0][c] === 1
                            ? 'bg-amber-400 border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                            : 'bg-slate-950 border-slate-800 hover:border-amber-400/50'
                        }`}
                      >
                        {practiceGrid[0][c] === 1 ? '👁️' : ''}
                      </button>
                    ))}

                    {/* Row 2: Space */}
                    <div className="w-10 h-11 flex items-center justify-center font-mono font-bold text-xs text-slate-500 bg-slate-900 rounded-lg">
                      0
                    </div>
                    {[0, 1, 2].map((c) => (
                      <button
                        key={`cell-1-${c}`}
                        type="button"
                        onClick={() => handlePracticeCellClick(1, c)}
                        className={`w-11 h-11 rounded-xl border transition-all text-lg font-bold flex items-center justify-center cursor-pointer ${
                          practiceGrid[1][c] === 1
                            ? 'bg-amber-400 border-amber-300'
                            : 'bg-slate-950 border-slate-800 hover:border-amber-400/50'
                        }`}
                      >
                        {practiceGrid[1][c] === 1 ? '⭐' : ''}
                      </button>
                    ))}

                    {/* Row 3: Smile */}
                    <div className="w-10 h-11 flex items-center justify-center font-mono font-bold text-xs text-amber-300 bg-amber-950/30 rounded-lg">
                      3
                    </div>
                    {[0, 1, 2].map((c) => (
                      <button
                        key={`cell-2-${c}`}
                        type="button"
                        onClick={() => handlePracticeCellClick(2, c)}
                        className={`w-11 h-11 rounded-xl border transition-all text-lg font-bold flex items-center justify-center cursor-pointer ${
                          practiceGrid[2][c] === 1
                            ? 'bg-amber-400 border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                            : 'bg-slate-950 border-slate-800 hover:border-amber-400/50'
                        }`}
                      >
                        {practiceGrid[2][c] === 1 ? '💛' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {practiceSolved ? (
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>
                      {isTa
                        ? 'அற்புதம்! புன்னகை முகத்தை சரியாக வரைந்துவிட்டீர்கள்!'
                        : isFr
                        ? 'Hourra ! Tu as réussi le visage souriant !'
                        : isEs
                        ? '¡Hurra! ¡Hiciste la carita sonriente!'
                        : isHi
                        ? 'शाबाश! आपने मुस्कुराता चेहरा सही बनाया!'
                        : 'Hooray! You made the Smiley Face! That is how Mini Grids work!'}
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    {isTa
                      ? '💡 குறிப்பு: மேலே இரு கண்களுக்கு இடது மற்றும் வலது கட்டங்களை தொடவும்; அடியில் பெரிய புன்னகைக்கு 3 கட்டங்களையும் தொடவும்!'
                      : isFr
                      ? '💡 Indice : Touche en haut à gauche et à droite pour les yeux, et les 3 cases du bas pour le sourire !'
                      : isEs
                      ? '💡 Pista: ¡Toca arriba a la izquierda y derecha para los ojos, y las 3 casillas de abajo para la sonrisa!'
                      : isHi
                      ? '💡 सुराग: ऊपर बाएँ और दाएँ आँख के लिए छुएँ, और नीचे की तीनों मुस्कान के लिए!'
                      : '💡 Hint: Tap top-left and top-right for the 2 eyes, then tap all 3 bottom tiles for the big smile!'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PATTERNS */}
          {activeTab === 'pattern' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs sm:text-sm text-cyan-200 leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-cyan-300 text-sm">
                  <span>🎈</span>
                  <span>
                    {isTa
                      ? 'விதி 2: வடிவ துப்பறிவாளர் ஆகுங்கள் (பாட்டுப் பாடி கண்டுபிடிக்கலாம்!)'
                      : isFr
                      ? 'Règle n°2 : Deviens un Détective des Motifs !'
                      : isEs
                      ? 'Regla n°2: ¡Sé un Detective de Patrones!'
                      : isHi
                      ? 'नियम 2: पैटर्न जासूस बनें (लय में बोलें!)'
                      : 'Rule #2: Be a Pattern Detective (Sing the Song!)'}
                  </span>
                </div>
                <p>
                  {isTa
                    ? 'வடிவங்கள் இசை போல் மீண்டும் மீண்டும் வரும்! ரகசியம் என்னவென்றால், பெயர்களை சத்தமாகச் சொல்லுங்கள்:'
                    : isFr
                    ? 'Les motifs se répètent comme une chanson ! L’astuce est de les dire à voix haute :'
                    : isEs
                    ? '¡Los patrones se repiten como música! El secreto es decirlos en voz alta:'
                    : isHi
                    ? 'पैटर्न संगीत की तरह दोहराते हैं! राज़ यह है कि उन्हें ज़ोर से बोलें:'
                    : 'Patterns repeat like music! The secret trick is to say the items out loud with rhythm:'}
                </p>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-center gap-2 text-sm sm:text-base font-bold flex-wrap">
                  <span>🔴 {isTa ? 'சிவப்பு' : isFr ? 'Rouge' : isEs ? 'Rojo' : isHi ? 'लाल' : 'Red'}</span>
                  <span className="text-slate-600 text-sm">➡️</span>
                  <span>🟡 {isTa ? 'மஞ்சள்' : isFr ? 'Jaune' : isEs ? 'Amarillo' : isHi ? 'पीला' : 'Yellow'}</span>
                  <span className="text-slate-600 text-sm">➡️</span>
                  <span>🔴 {isTa ? 'சிவப்பு' : isFr ? 'Rouge' : isEs ? 'Rojo' : isHi ? 'लाल' : 'Red'}</span>
                  <span className="text-slate-600 text-sm">➡️</span>
                  <span>🟡 {isTa ? 'மஞ்சள்' : isFr ? 'Jaune' : isEs ? 'Amarillo' : isHi ? 'पीला' : 'Yellow'}</span>
                  <span className="text-slate-600 text-sm">➡️</span>
                  <span className="text-amber-400 underline animate-pulse">
                    🔴 {isTa ? 'சிவப்பு!' : isFr ? 'Rouge !' : isEs ? '¡Rojo!' : isHi ? 'लाल!' : 'Red!'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
                <span className="font-bold text-white block text-sm">
                  {isTa
                    ? 'கவனிக்க வேண்டிய வடிவ வகைகள்:'
                    : isFr
                    ? 'Types de motifs à chercher :'
                    : isEs
                    ? 'Tipos de patrones para buscar:'
                    : isHi
                    ? 'ध्यान देने योग्य पैटर्न के प्रकार:'
                    : 'Types of Patterns to Look For:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-400 block">
                      {isTa ? '1. வண்ண மாற்றம்' : isFr ? '1. Changement de Couleur' : isEs ? '1. Cambio de Color' : isHi ? '1. रंगों की अदला-बदली' : '1. Color Switch'}
                    </span>
                    <span className="text-slate-400 text-[11px] block">
                      {isTa
                        ? 'சிவப்பு பலூன், மஞ்சள் பலூன், சிவப்பு பலூன்... அடுத்து மஞ்சள்!'
                        : isFr
                        ? 'Ballon rouge, ballon jaune, ballon rouge... Le suivant est jaune !'
                        : isEs
                        ? 'Globo rojo, globo amarillo, globo rojo... ¡El siguiente es amarillo!'
                        : isHi
                        ? 'लाल गुब्बारा, पीला गुब्बारा, लाल गुब्बारा... अगला पीला होगा!'
                        : 'Like Red Balloon, Yellow Balloon, Red Balloon... Next is Yellow!'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400 block">
                      {isTa ? '2. செல்லப் பிராணிகள் வரிசை' : isFr ? '2. Défilé d’Animaux' : isEs ? '2. Desfile de Mascotas' : isHi ? '2. जानवरों की कतार' : '2. Animal Parade'}
                    </span>
                    <span className="text-slate-400 text-[11px] block">
                      {isTa
                        ? 'பூனை 🐱, நாய் 🐶, பூனை 🐱, நாய் 🐶... அடுத்து பூனை!'
                        : isFr
                        ? 'Chaton 🐱, Chiot 🐶, Chaton 🐱, Chiot 🐶... Ensuite Chaton !'
                        : isEs
                        ? 'Gatito 🐱, Perrito 🐶, Gatito 🐱, Perrito 🐶... ¡Sigue Gatito!'
                        : isHi
                        ? 'बिल्ली 🐱, कुत्ता 🐶, बिल्ली 🐱, कुत्ता 🐶... अगली बिल्ली!'
                        : 'Kitty 🐱, Puppy 🐶, Kitty 🐱, Puppy 🐶... Next is Kitty!'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COUNTING HOPS */}
          {activeTab === 'counting' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-200 leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                  <span>🐸</span>
                  <span>
                    {isTa
                      ? 'விதி 3: தவளையின் எண் தாவல்கள்'
                      : isFr
                      ? 'Règle n°3 : Sauts de Grenouille et Nombres'
                      : isEs
                      ? 'Regla n°3: Saltitos de Rana y Números'
                      : isHi
                      ? 'नियम 3: मेंढक की संख्या कूद'
                      : 'Rule #3: Number Hops & Frog Leaps'}
                  </span>
                </div>
                <p>
                  {isTa
                    ? 'எண்கள் முன்னோக்கித் தாவுகின்றன! எத்தனை படிகள் தாவுகின்றன என்று பாருங்கள்:'
                    : isFr
                    ? 'Les nombres avancent par bonds ! Regarde la taille du saut :'
                    : isEs
                    ? '¡Los números avanzan saltando! Mira qué tan grande es cada salto:'
                    : isHi
                    ? 'संख्याएँ आगे कूदती हैं! देखें हर छलाँग कितनी बड़ी है:'
                    : 'Numbers love to hop forward! Check how big each hop is:'}
                </p>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <strong className="text-white block">
                        {isTa ? 'ஒன்றாக எண்ணுதல்:' : isFr ? 'Compter de 1 en 1 :' : isEs ? 'Paso de 1 en 1:' : isHi ? 'एक-एक कदम गिनती:' : 'Step by 1:'}
                      </strong>
                      <span className="text-slate-400 text-[11px]">1 ➡️ 2 ➡️ 3 ➡️ 4 ➡️ 5 🚀</span>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono text-xs">+1</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <strong className="text-white block">
                        {isTa ? 'இரண்டிரண்டாகத் தாவுதல் (இரட்டைப் படிகள்):' : isFr ? 'Saut de 2 en 2 :' : isEs ? 'Salto de 2 en 2:' : isHi ? 'दो-दो कदम छलाँग:' : 'Skip Count by 2:'}
                      </strong>
                      <span className="text-slate-400 text-[11px]">2 ➡️ 4 ➡️ 6 ➡️ 8 🐸</span>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono text-xs">+2</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                💡 <strong>{isTa ? 'விரல் தந்திரம்:' : isFr ? 'Astuce des doigts :' : isEs ? 'Truco con los dedos:' : isHi ? 'उंगलियों की तरकीब:' : 'Handy Finger Trick:'}</strong>{' '}
                {isTa
                  ? 'விரல்களை உயர்த்தி எண்ணுங்கள்! தவளை 6-ல் இருந்து 2 தாவினால், 2 விரல்களை நீட்டி "7, 8!" என எண்ணுங்கள். விடை 8!'
                  : isFr
                  ? 'Utilise tes doigts ! Si la grenouille est à 6 et saute de 2, lève 2 doigts : « 7, 8 ! ». La réponse est 8 !'
                  : isEs
                  ? '¡Usa los dedos! Si la rana está en 6 y salta 2, levanta 2 dedos: "¡7, 8!". ¡La respuesta es 8!'
                  : isHi
                  ? 'उंगलियों से गिनें! अगर मेंढक 6 पर है और 2 कदम कूदता है, तो 2 उंगलियाँ उठाएँ: "7, 8!" उत्तर 8 है!'
                  : 'Put up your fingers to count along! If the frog is at 6 and hops 2, hold up 2 fingers and count: "7, 8!" The answer is 8!'}
              </div>
            </div>
          )}

          {/* TAB 4: STARS & TROPHIES */}
          {activeTab === 'stars' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-200 leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <span>⭐</span>
                  <span>
                    {isTa
                      ? 'விதி 4: 3 நட்சத்திரங்களை வென்று சாதனைப் பட்டியலில் இடம் பெறுங்கள்!'
                      : isFr
                      ? 'Règle n°4 : Gagne 3 Étoiles et entre au Classement !'
                      : isEs
                      ? 'Regla n°4: ¡Gana 3 estrellas y entra en la clasificación!'
                      : isHi
                      ? 'नियम 4: 3 सितारे जीतें और लीडरबोर्ड पर आएँ!'
                      : 'Rule #4: Earn 3 Stars & Get On the Leaderboard!'}
                  </span>
                </div>
                <p>
                  {isTa
                    ? 'ஒவ்வொரு விளையாட்டிலும் தங்க நட்சத்திரங்களைச் சேர்க்கலாம்:'
                    : isFr
                    ? 'Chaque partie peut te rapporter de belles étoiles dorées :'
                    : isEs
                    ? 'Cada juego puede darte brillantes estrellas doradas:'
                    : isHi
                    ? 'हर खेल में आप चमचमाते सितारे जीत सकते हैं:'
                    : 'Every game you play can earn you shiny Gold Stars:'}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30">
                    <span className="text-xl block">⭐⭐⭐</span>
                    <strong className="text-xs text-white block mt-1">3 {t('stars', currentLang)}</strong>
                    <span className="text-[10px] text-slate-400">
                      {isTa ? 'முதல் முயற்சியில் வெற்றி!' : isFr ? '1er coup !' : isEs ? '¡Al 1er intento!' : isHi ? 'पहली बार में!' : '1st try!'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xl block">⭐⭐</span>
                    <strong className="text-xs text-white block mt-1">2 {t('stars', currentLang)}</strong>
                    <span className="text-[10px] text-slate-400">
                      {isTa ? 'இரண்டாவது முயற்சி' : isFr ? '2e essai' : isEs ? '2° intento' : isHi ? 'दूसरे प्रयास में' : '2nd try'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xl block">⭐</span>
                    <strong className="text-xs text-white block mt-1">1 {t('stars', currentLang)}</strong>
                    <span className="text-[10px] text-slate-400">
                      {isTa ? 'நல்ல முயற்சி!' : isFr ? 'Bien essayé !' : isEs ? '¡Buen intento!' : isHi ? 'शानदार प्रयास!' : 'Great try!'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>
                    {isTa
                      ? 'தடுமாற்றமா? "துப்புக் குறிப்பு வேண்டுமா?" பொத்தானைப் பயன்படுத்துங்கள்!'
                      : isFr
                      ? 'Bloqué ? Utilise le bouton « Un indice ? » !'
                      : isEs
                      ? '¿Atascado? ¡Usa el botón de "¿Necesitas una pista?"!'
                      : isHi
                      ? 'मुश्किल लग रहा है? "सुराग चाहिए?" बटन दबाएँ!'
                      : 'Stuck? Use the "Need a Clue?" Button!'}
                  </span>
                </div>
                <p className="text-slate-400">
                  {isTa
                    ? 'உதவி கேட்பதில் எந்தத் தப்பும் இல்லை! குறிப்புப் பொத்தானைத் தட்டி எப்போது வேண்டுமானாலும் வழிகாட்டலைப் பெறலாம்.'
                    : isFr
                    ? 'Aucune pénalité pour demander de l’aide ! Touche le bouton d’indice pour te guider.'
                    : isEs
                    ? '¡No hay penalización por pedir ayuda! Toca el botón de pista en cualquier momento.'
                    : isHi
                    ? 'मदद माँगने में कोई हर्ज़ नहीं! जब चाहें सुराग बटन दबाकर सही दिशा जान सकते हैं।'
                    : 'There is no penalty for asking for help! Tap the clue button anytime for friendly guidance.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            {isTa
              ? 'மகிழ்ச்சியாக விளையாடி மூளையை சுறுசுறுப்பாக்குங்கள்! 🧠'
              : isFr
              ? 'Amuse-toi et fais travailler tes neurones ! 🧠'
              : isEs
              ? '¡Diviértete y ejercita tu mente! 🧠'
              : isHi
              ? 'मज़े करें और अपने दिमाग को तेज़ करें! 🧠'
              : 'Have fun and stretch your brain! 🧠'}
          </span>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              sound.playSuccess();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>
              {isTa
                ? 'புரிந்தது! விளையாடலாம்! 🚀'
                : isFr
                ? 'Compris ! Jouons ! 🚀'
                : isEs
                ? '¡Entendido! ¡A jugar! 🚀'
                : isHi
                ? 'समझ गया! चलो खेलें! 🚀'
                : "Got It! Let's Play!"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
