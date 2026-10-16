import React, { useState } from 'react';
import { AppLanguage } from '../types/i18n';
import { GameMode } from '../types/game';
import { getSpeechLangCode, t } from '../utils/i18n';
import { sound } from '../utils/audio';
import {
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Brain,
  Star,
  Search,
  Grid3X3,
  Languages,
  Play,
  RotateCcw,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang: AppLanguage;
  onSelectMode?: (mode: GameMode) => void;
  onSelectLanguage?: (lang: AppLanguage) => void;
}

export const AppIntroModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLang = 'ta',
  onSelectMode,
  onSelectLanguage,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!isOpen) return null;

  const isTa = currentLang === 'ta';
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';
  const isHi = currentLang === 'hi';

  const slides: {
    id: string;
    badge: string;
    title: string;
    subtitle: string;
    icon: string;
    lucideIcon: React.ReactNode;
    highlightGradient: string;
    borderGlow: string;
    description: string;
    features: string[];
    actionText: string;
    modeTarget: GameMode;
  }[] = [
    {
      id: 'welcome',
      badge: isTa
        ? '🧠 Sand.E · பொது அறிமுகம்'
        : isFr
        ? '🧠 Sand.E · Bienvenue'
        : isEs
        ? '🧠 Sand.E · Bienvenida'
        : isHi
        ? '🧠 Sand.E · स्वागत'
        : '🧠 Sand.E · Welcome',
      title: isTa
        ? 'Sand.E - மூளைப் புதிர் & புலனாய்வு அரங்கம்'
        : isFr
        ? 'Sand.E - Arène d’Énigmes & Logique Cognitive'
        : isEs
        ? 'Sand.E - Arena de Lógica y Misterios Cognitivos'
        : isHi
        ? 'Sand.E - मस्तिष्क पहेलियाँ और बुद्धिमत्ता क्षेत्र'
        : 'Sand.E - Mind Puzzles & Detective Arena',
      subtitle: isTa
        ? 'குழந்தைகள் முதல் பெரியவர்கள் வரை அனைவருக்கும் ஏற்ற அறிவாற்றல் பயிற்சி தளம்'
        : isFr
        ? 'Plateforme d’entraînement intellectuel pour enfants, jeunes et adultes'
        : isEs
        ? 'Plataforma integral de entrenamiento cognitivo para todas las edades'
        : isHi
        ? 'बच्चों से लेकर बड़ों तक सभी के लिए समग्र बौद्धिक विकास मंच'
        : 'All-in-one cognitive intelligence, logical deduction & mystery solving platform',
      icon: '🧠',
      lucideIcon: <Brain className="w-6 h-6 text-amber-400" />,
      highlightGradient: 'from-blue-600/20 via-indigo-500/10 to-slate-900',
      borderGlow: 'border-blue-500/40',
      description: isTa
        ? 'Sand.E-விற்கு தங்களை அன்புடன் வரவேற்கிறோம்! சுட்டி IQ எளிய புதிர்கள், துப்பறியும் Arunan வழக்குகள், ஐன்ஸ்டைன் கட்டப்பிரிவு புதிர்கள், பேட்டர்ன் மேட்ரிக்ஸ் மற்றும் முழுமையான IQ மதிப்பீடு ஆகிய 6 அற்புத விளையாட்டு முறைகளை ஒரே இடத்தில் அனுபவியுங்கள்.'
        : isFr
        ? 'Bienvenue sur Sand.E ! Explorez 6 modes stimulants : QI Enfant pour les débutants, Détective Arunan, Grilles logiques style Einstein, Matrices de motifs et Évaluation complète du QI avec classement hors-ligne.'
        : isEs
        ? '¡Bienvenido a Sand.E! Descubre 6 modalidades de juego desafiantes: CI Infantil fácil, Misterios del Detective Arunan, Rejillas de lógica de Einstein, Matrices de patrones y Evaluación de CI integral.'
        : isHi
        ? 'Sand.E में आपका स्वागत है! 6 अनोखे खेल मोड का आनंद लें: बच्चों के लिए बाल IQ, जासूस मेहुल के रोमांचक केस, आइंस्टीन लॉजिक ग्रिड, पैटर्न मैट्रिक्स और संपूर्ण IQ टेस्ट।'
        : 'Welcome to Sand.E! Dive into 6 engaging cognitive arenas: Child IQ Easy for young minds, Detective Arunan mystery deduction, Einstein logic elimination grids, pattern matrices, and comprehensive IQ assessments.',
      features: isTa
        ? [
            '🎯 6 பிரத்யேக விளையாட்டு முறைகள்: சுட்டி IQ, துப்பறியும் Arunan, கட்டப்பிரிவு, பேட்டர்ன், எண் வரிசை, IQ தேர்வு',
            '🌐 5 உலக மொழிகள்: தமிழ், Français, Español, हिन्दी, English',
            '💾 100% ஆஃப்லைன் வசதி & உங்கள் சாதனத்திலேயே சேமிக்கப்படும் மதிப்பெண்கள்',
            '🔊 அனைத்து வழக்குகளுக்கும் உரை வாசிப்பு (Web Speech) வசதி',
          ]
        : isFr
        ? [
            '🎯 6 modes uniques : QI Enfant, Détective, Grilles, Matrices, Séries, Évaluation',
            '🌐 5 langues internationales au choix (Français, Tamil, Espagnol, Hindi, Anglais)',
            '💾 Sauvegarde 100% locale et hors-ligne des scores et trophées',
            '🔊 Synthèse vocale de lecture à voix haute dans chaque langue',
          ]
        : isEs
        ? [
            '🎯 6 modos de juego: CI Niños, Detective, Rejillas, Matrices, Series, Test de CI',
            '🌐 5 idiomas con cambio instantáneo (Español, Tamil, Francés, Hindi, Inglés)',
            '💾 100% fuera de línea con almacenamiento local en el navegador',
            '🔊 Lectura por voz integrada para todos los enunciados',
          ]
        : isHi
        ? [
            '🎯 6 बेहतरीन खेल मोड: बाल IQ, जासूस मेहुल, ग्रिड डिडक्शन, पैटर्न, श्रृंखला, IQ परीक्षा',
            '🌐 5 भाषाएँ: हिन्दी, तमिल, फ़्रेंच, स्पैनिश और अंग्रेज़ी',
            '💾 100% ऑफ़लाइन स्कोर और स्थानीय डेटा संरक्षण',
            '🔊 हर पहेली और केस के लिए आवाज़ से सुनने की सुविधा',
          ]
        : [
            '🎯 6 Unique Cognitive Modes: Child IQ, Detective Arunan, Grids, Pattern Matrix, Sequences & Assessment',
            '🌐 5 Global Languages: English, Tamil, French, Spanish, and Hindi',
            '💾 100% Offline Persistence: Scores & stars safely stored in browser local storage',
            '🔊 Spoken Web Speech Synthesis audio read-aloud for all puzzles and cases',
          ],
      actionText: isTa ? 'விளையாட்டைத் தொடங்கவும் 🚀' : 'Start Exploring 🚀',
      modeTarget: 'child',
    },
    {
      id: 'child',
      badge: isTa
        ? '⭐ சுட்டிகளுக்கான அரங்கம் (Junior)'
        : isFr
        ? '⭐ Académie Junior QI'
        : isEs
        ? '⭐ Academia Infantil CI'
        : isHi
        ? '⭐ बाल IQ सरल पहेलियाँ'
        : '⭐ Junior Mind Academy',
      title: isTa
        ? 'சுட்டி IQ · எளிய புதிர்கள் & பட வழிகாட்டி'
        : isFr
        ? 'QI Enfant · Puzzles Débutants & Guide Illustré'
        : isEs
        ? 'CI Infantil · Acertijos Sencillos y Guía Ilustrada'
        : isHi
        ? 'बाल IQ · आसान पहेलियाँ और सचित्र गाइड'
        : 'Child IQ Easy · Junior Puzzles & Illustrated Guide',
      subtitle: isTa
        ? 'சிறு குழந்தைகளுக்கான தொடுதிரை வரைதல், வண்ண வடிவங்கள் மற்றும் தவளை எண் தாவல்கள்'
        : isFr
        ? 'Coloriage logique 3x3, motifs de ballons et comptage par bonds pour enfants'
        : isEs
        ? 'Mini rejillas interactivas 3x3, secuencias de animales y saltos de rana'
        : isHi
        ? 'बच्चों के लिए 3x3 टच ड्रॉइंग, रंगीन गुब्बारे और मेंढक की गिनती'
        : 'Touch-friendly 3x3 grids, colorful balloon patterns, pet parades, and frog leaps',
      icon: '⭐',
      lucideIcon: <Star className="w-6 h-6 text-amber-400 fill-amber-400" />,
      highlightGradient: 'from-amber-500/20 via-pink-500/15 to-slate-900',
      borderGlow: 'border-amber-400/40',
      description: isTa
        ? 'சுட்டி IQ அரங்கம் குழந்தைகளும் ஆரம்பநிலை கற்றோரும் விளையாடி மகிழ பிரத்யேகமாக உருவாக்கப்பட்டது. எந்தவித எதிர்மறை மதிப்பெண்களும் இன்றி, எளிமையான குறிப்புகளுடன், 3 தங்க நட்சத்திரங்களை வென்று தன்னம்பிக்கையை வளர்க்கலாம்!'
        : isFr
        ? 'Le mode QI Enfant permet aux plus jeunes de développer leur sens de l’observation en s’amusant, avec des mini-grilles 3x3, des motifs colorés et un guide illustré interactif sans stress ni pénalités.'
        : isEs
        ? 'La arena infantil está diseñada especialmente para niños y principiantes. Sin penalizaciones, con pistas amigables y un sistema de 3 estrellas doradas que premia el esfuerzo y la curiosidad.'
        : isHi
        ? 'बाल IQ एरीना विशेष रूप से छोटे बच्चों के लिए है। बिना किसी निगेटिव मार्किंग के, सरल संकेतों और 3 सितारों के साथ बच्चे आत्मविश्वास के साथ अपनी तार्किक सोच बढ़ा सकते हैं।'
        : 'Crafted especially for young kids and puzzle beginners. With zero penalties, friendly hints, and positive reinforcement, children earn 3 gold stars while strengthening spatial and quantitative logic.',
      features: isTa
        ? [
            '🎨 தொடு வண்ண கட்ட வரைதல்: சிரிக்கும் முகம் (Smiley), அன்பு இதயம் (Heart), படகு (Sailboat)',
            '🎈 பலூன் வண்ணங்கள், பிராணிகள் தாள வரிசை & தவளையின் எண் தாவல் புதிர்கள்',
            '📖 படங்களுடன் கூடிய ஊடாடும் 4-பிரிவு "சுட்டி வழிகாட்டி" (Child Guide)',
            '🌟 3 தங்க நட்சத்திரங்கள், பாராட்டு ஒலிகள் & தமிழ் உரை வாசிப்பு',
          ]
        : isFr
        ? [
            '🎨 Coloriage logique 3x3 : Visage souriant, Cœur, Voilier',
            '🎈 Motifs de ballons, parade d’animaux et sauts de grenouille',
            '📖 Guide illustré interactif "Comment Jouer" avec exemples',
            '🌟 Système de 3 étoiles, félicitations sonores et lecture vocale',
          ]
        : isEs
        ? [
            '🎨 Dibujo lógico táctil 3x3: Carita feliz, Corazón, Velerito',
            '🎈 Globos de colores, desfile de mascotas y saltos de rana',
            '📖 Guía interactiva "Cómo Jugar" ilustrada paso a paso',
            '🌟 3 estrellas doradas, fanfarria de victoria y voz amigable',
          ]
        : isHi
        ? [
            '🎨 आसान 3x3 टच ड्रॉइंग: मुस्कुराता चेहरा, दिल का निशान, छोटी नाव',
            '🎈 रंगीन गुब्बारे, जानवरों की कतार और मेंढक की कूद गिनती',
            '📖 सचित्र इंटरैक्टिव "खेलने की विधि" गाइड',
            '🌟 3 सुनहरे सितारे, जीत की धुन और हिंदी में बोलकर समझाने की सुविधा',
          ]
        : [
            '🎨 Interactive 3x3 grid painting: Smiley Face, Love Heart, Sailboat',
            '🎈 Balloon color patterns, animal parades, and playful frog leap counting',
            '📖 Comprehensive 4-tab illustrated interactive "Child Guide" modal',
            '🌟 3-star rating, uplifting audio feedback, and spoken text-to-speech',
          ],
      actionText: isTa ? 'சுட்டி IQ விளையாடவும் ⭐' : 'Play Child IQ ⭐',
      modeTarget: 'child',
    },
    {
      id: 'detective',
      badge: isTa
        ? '🕵️‍♂️ துப்பறியும் Arunan (Tamil Mystery)'
        : isFr
        ? '🕵️‍♂️ Détective Arunan'
        : isEs
        ? '🕵️‍♂️ Detective Arunan'
        : isHi
        ? '🕵️‍♂️ जासूस मेहुल'
        : '🕵️‍♂️ Detective Arunan',
      title: isTa
        ? 'துப்பறியும் Arunan · குற்றப் புலனாய்வு வழக்குகள்'
        : isFr
        ? 'Détective Arunan · Mystères & Déductions Criminelles'
        : isEs
        ? 'Detective Arunan · Casos de Deducción Criminal'
        : isHi
        ? 'जासूस मेहुल · रहस्यमयी आपराधिक पहेलियाँ'
        : 'Detective Arunan · Crime Deduction Mysteries',
      subtitle: isTa
        ? 'MindYourLogic தமிழ் பாணியில் தடயங்களை ஆய்வு செய்து உண்மையான குற்றவாளியைக் கைது செய்யுங்கள்'
        : isFr
        ? 'Inspectez les scènes de crime, interrogez les suspects et arrêtez les coupables'
        : isEs
        ? 'Examina la escena del crimen, analiza las coartadas y arresta al sospechoso'
        : isHi
        ? 'क्राइम सीन का मुआयना करें, बयानों की जाँच करें और असली मुजरिम को पकड़ें'
        : 'Examine crime scenes, cross-examine suspect alibis, and crack cases with Detective Arunan',
      icon: '🕵️‍♂️',
      lucideIcon: <Search className="w-6 h-6 text-amber-400" />,
      highlightGradient: 'from-red-500/20 via-amber-500/15 to-slate-900',
      borderGlow: 'border-red-500/40',
      description: isTa
        ? 'MindYourLogic தமிழ் புகழ் துப்பறியும் மெஹுலின் உண்மை வழக்குகளைத் தீர்க்கும் வாய்ப்பு! குற்ற நடந்த இடம், தடய அறிவியல் சான்றுகள், சந்தேக நபர்களின் முரண்பாடான வாக்குமூலங்களை ஆராய்ந்து மெஹுலின் தீர்ப்புடன் குற்றவாளியை அம்பலப்படுத்துங்கள்!'
        : isFr
        ? 'Incarnez le détective Arunan dans des affaires captivantes : examinez le dossier de police, observez les détails médico-légaux, débusquez les mensonges des suspects et prononcez le verdict final !'
        : isEs
        ? '¡Únete al perspicaz Detective Arunan! Analiza el expediente policial, descubre contradicciones en los testimonios de los sospechosos y resuelve enigmas de crímenes misteriosos.'
        : isHi
        ? 'जासूस मेहुल के साथ वास्तविक रहस्यों को सुलझाएं! घटना स्थल की फॉरेंसिक रिपोर्ट पढ़ें, संदिग्धों के बयानों में झूठ पकड़ें और मेहुल के प्रसिद्ध अंदाज़ में मुजरिम को गिरफ्तार करें।'
        : 'Inspired by the popular detective riddles! Read the case dossier, inspect forensic evidence, catch suspects in their contradictory statements, and crack each mystery with Detective Arunan’s iconic verdict.',
      features: isTa
        ? [
            '📋 செட்டிநாடு மாளிகை, மெரினா கடற்கரை, அருங்காட்சியகம் உள்ளிட்ட 8 சுவாரசியமான வழக்குகள்',
            '🔬 தடய அறிவியல் சான்றுகள் & சந்தேக நபர்களின் நேரடி வாக்குமூலங்கள்',
            '💡 துப்பறியும் குறிப்புகள் & மெஹுலின் விரிவான தீர்ப்பு விளக்கம்',
            '🗣️ மெஹுலின் கம்பீரமான தமிழ் குரல் விவரிப்பு (Tamil Speech)',
          ]
        : isFr
        ? [
            '📋 8 affaires policières uniques avec synopsis détaillé',
            '🔬 Indices médico-légaux et déclarations de suspects',
            '💡 Indices progressifs et verdict complet expliqué par Arunan',
            '🗣️ Narration vocale complète et traduite',
          ]
        : isEs
        ? [
            '📋 8 casos misteriosos detallados con escenarios fascinantes',
            '🔬 Observaciones forenses y testimonios contradictorios',
            '💡 Sistema de pistas y explicación del veredicto final',
            '🗣️ Lectura en voz alta para cada interrogatorio',
          ]
        : isHi
        ? [
            '📋 8 रोमांचक जासूसी केस: हवेली का राज़, समुद्र तट का रहस्य, चोरी और षड्यंत्र',
            '🔬 फॉरेंसिक जाँच के बिंदु और संदिग्धों के बयान',
            '💡 मेहुल के संकेत और पूरे तर्क के साथ आख़िरी फैसला',
            '🗣️ आवाज़ में केस की पूरी दास्तान सुनने की सुविधा',
          ]
        : [
            '📋 8 Captivating mystery cases: Heritage mansions, beach cafes, museum heists',
            '🔬 Forensic crime scene observations and suspect interrogation cards',
            '💡 Progressive clue hint unlocks and Arunan’s thorough verdict rationale',
            '🗣️ Full voiceover audio narration with native speech synthesis',
          ],
      actionText: isTa ? 'அருணன் வழக்குகளைத் தீர்க்கவும் 🕵️‍♂️' : 'Crack Arunan Mysteries 🕵️‍♂️',
      modeTarget: 'detective',
    },
    {
      id: 'english',
      badge: isTa
        ? '🔤 சுலப ஆங்கிலக் கல்வி (Easy English)'
        : isFr
        ? '🔤 Anglais Facile et Correct'
        : isEs
        ? '🔤 Inglés Fácil y Correcto'
        : isHi
        ? '🔤 आसान अंग्रेज़ी सीखें'
        : '🔤 Easy & Correct English',
      title: isTa
        ? 'சுலபமான மற்றும் சரியான ஆங்கிலக் கல்வி'
        : isFr
        ? 'Apprentissage d’Anglais Facile & Correct'
        : isEs
        ? 'Aprende Inglés Fácil y Correcto'
        : isHi
        ? 'आसान और सही अंग्रेज़ी सीखें'
        : 'Easy & Correct English Learning Arena',
      subtitle: isTa
        ? 'தமிழ் விளக்கங்களுடன் எளிய இலக்கணம், பிழைகளைத் தவிர்த்தல் & சரியான உச்சரிப்பு'
        : isFr
        ? 'Règles de grammaire faciles, pièges courants évités et prononciation parlée'
        : isEs
        ? 'Reglas gramaticales claras, corrección de errores comunes y pronunciación'
        : isHi
        ? 'सरल व्याकरण, सामान्य गलतियों से बचाव और सही उच्चारण'
        : 'Simple grammar rules, avoiding common mistakes, polite phrases & native audio',
      icon: '🔤',
      lucideIcon: <Languages className="w-6 h-6 text-indigo-400" />,
      highlightGradient: 'from-indigo-500/20 via-purple-500/15 to-slate-900',
      borderGlow: 'border-indigo-400/40',
      description: isTa
        ? 'ஆங்கிலத்தை எளிய முறையில், இலக்கணப் பிழையின்றி கற்றுக்கொள்ள அருணன் IQ-வின் புதிய பகுதி! கட்டுரைகள் (a/an), ஒருமை-பன்மை, சரியான வினைச்சொற்கள், தினசரி உரையாடல் வாக்கியங்கள் மற்றும் பொன்விதிகள் அனைத்தும் தமிழ் விளக்கத்துடன் உள்ளன.'
        : 'Learn fluent, accurate English without common confusion! Master articles (a/an), subject-verb agreements, daily conversational phrases, and grammar rule tips with instant voice pronunciation.',
      features: isTa
        ? [
            '📚 எளிய இலக்கண விதிகள்: "a" vs "an", He/She/It வினைகள், "Did" வாக்கியங்கள்',
            '❌ தவிர்க்க வேண்டிய பொதுவான பிழைகள் & "இது ஏன் சரி?" என்ற தமிழ் விளக்கம்',
            '🗣️ நேரடி ஒலிப்பு (Text-to-Speech): ஒவ்வொரு வாக்கியத்தையும் தெளிவான ஆங்கிலத்தில் கேளுங்கள்',
            '⭐ பயிற்சி வினாடி வினா, தொடர் வெற்றிப் புள்ளிகள் & தனிப்பயன் கற்றல் நிலைகள்',
          ]
        : [
            '📚 Key grammar rules: "a" vs "an", subject-verb agreements, irregular plurals',
            '❌ Avoid common learner traps with "Why is this correct?" rationale cards',
            '🗣️ Built-in speech synthesis: Hear natural pronunciation at normal or slow speed',
            '⭐ Interactive quiz challenges, streak multipliers, and local score saving',
          ],
      actionText: isTa ? 'ஆங்கிலம் கற்கத் தொடங்குங்கள் 🔤' : 'Start English Learning 🔤',
      modeTarget: 'english',
    },
    {
      id: 'grids',
      badge: isTa
        ? '🧩 கட்டப்பிரிவு & மேட்ரிக்ஸ்'
        : isFr
        ? '🧩 Grilles & Matrices'
        : isEs
        ? '🧩 Rejillas y Matrices'
        : isHi
        ? '🧩 ग्रिड और मैट्रिक्स'
        : '🧩 Grids & Matrices',
      title: isTa
        ? 'ஐன்ஸ்டைன் கட்டப்பிரிவு & ரேவன் மேட்ரிக்ஸ்'
        : isFr
        ? 'Grilles d’Élimination & Matrices Progressives'
        : isEs
        ? 'Rejillas de Eliminación y Matrices de Raven'
        : isHi
        ? 'तार्किक ग्रिड और पैटर्न मैट्रिक्स'
        : 'Logic Elimination Grids & Pattern Matrices',
      subtitle: isTa
        ? 'கடுமையான தர்க்க விதிகள், சுழற்சி வடிவங்கள் மற்றும் கணித தொடர் வரிசைகள்'
        : isFr
        ? 'Raisonnement déductif pur, symétrie des formes et suites logiques'
        : isEs
        ? 'Deducción lógica pura, matrices de figuras y secuencias matemáticas'
        : isHi
        ? 'शुद्ध तार्किक क्षमता, आकृतियों का घूर्णन और गणितीय क्रम'
        : 'Pure constraint logic, shape rotations, color symmetry, and mathematical leaps',
      icon: '🧩',
      lucideIcon: <Grid3X3 className="w-6 h-6 text-cyan-400" />,
      highlightGradient: 'from-cyan-500/20 via-blue-500/15 to-slate-900',
      borderGlow: 'border-cyan-500/40',
      description: isTa
        ? 'உயர்நிலை அறிவாற்றல் பயிற்சிகளான ஐன்ஸ்டைன் கட்டப்பிரிவு புதிர்கள் (Grid Deduction), ரேவனின் முற்போக்கு மேட்ரிக்ஸ் புதிர்கள் மற்றும் விடுபட்ட எண் தொடர்களைத் தீர்த்து உங்கள் பகுத்தறியும் திறனை மேம்படுத்துங்கள்.'
        : isFr
        ? 'Développez vos compétences d’analyse avancées grâce aux grilles de déduction par élimination binaire (style énigme d’Einstein), aux matrices de Raven et aux suites numériques.'
        : isEs
        ? 'Fortalece tu razonamiento analítico con rejillas de eliminación binaria estilo Einstein, matrices progresivas de figuras y complejas secuencias numéricas.'
        : isHi
        ? 'आइंस्टीन शैली की ग्रिड पहेलियों, रेवेन के पैटर्न मैट्रिक्स और संख्यात्मक क्रमों को हल करके अपने विश्लेषणात्मक दिमाग को तेज़ करें।'
        : 'Sharpen your analytical acumen with Einstein-style binary deduction grids, Raven’s progressive matrices test of fluid intelligence, and multi-step numerical sequences.',
      features: isTa
        ? [
            '✅ கட்டப்பிரிவு: சரி (✓) மற்றும் தவறு (✗) குறிகளுடன் உண்மை அறியும் முறை',
            '🔷 மேட்ரிக்ஸ்: நிறம், அளவு, சுழற்சி மற்றும் வடிவ மாற்றங்களின் விதிகள்',
            '🔢 எண் வரிசை: பிபனாச்சி, வர்க்க எண்கள் மற்றும் கணித தொடர்கள்',
            '🏆 உடனடி IQ மதிப்பீடு & துல்லிய சதவீதக் கணக்கீடு',
          ]
        : isFr
        ? [
            '✅ Grilles de déduction avec marquage vert (✓) et rouge (✗)',
            '🔷 Matrices avec règles de rotation, taille, symétrie et couleur',
            '🔢 Séries numériques : Fibonacci, carrés parfaits et progressions',
            '🏆 Calcul instantané du quotient intellectuel et de la précision',
          ]
        : isEs
        ? [
            '✅ Rejillas lógicas con marcas binarias de acierto (✓) y descarte (✗)',
            '🔷 Matrices de figuras con reglas de rotación, reflejo y tamaño',
            '🔢 Secuencias numéricas con progresiones algebraicas y Fibonacci',
            '🏆 Estimación instantánea de CI y tasa de precisión',
          ]
        : isHi
        ? [
            '✅ ग्रिड डिडक्शन: सही (✓) और गलत (✗) चिह्नों से पहेली हल करें',
            '🔷 पैटर्न मैट्रिक्स: घुमाव, आकार, रंग और समरूपता के नियम',
            '🔢 संख्या क्रम: फिबोनाची, वर्ग और अंकगणितीय श्रृंखला',
            '🏆 तत्काल IQ स्कोर और सटीकता का सटीक विश्लेषण',
          ]
        : [
            '✅ Deduction Grids: Binary mark (✓) and eliminate (✗) constraint matrix',
            '🔷 Pattern Matrices: Shape rotation, scaling, symmetry, and color progression',
            '🔢 Sequences: Fibonacci progressions, exponents, and mathematical patterns',
            '🏆 Instant IQ estimation formula with speed & accuracy metrics',
          ],
      actionText: isTa ? 'கட்டப் புதிரைத் தொடங்கவும் 🧩' : 'Try Grid Logic 🧩',
      modeTarget: 'grid',
    },
    {
      id: 'multilingual',
      badge: isTa
        ? '🌍 5 உலக மொழிகள்'
        : isFr
        ? '🌍 5 Langues Internationales'
        : isEs
        ? '🌍 5 Idiomas Internacionales'
        : isHi
        ? '🌍 5 भाषाएँ'
        : '🌍 5 Global Languages',
      title: isTa
        ? 'தமிழ், பிரெஞ்சு, ஸ்பானிஷ், இந்தி, ஆங்கிலம்'
        : isFr
        ? 'Français, Tamil, Espagnol, Hindi, Anglais'
        : isEs
        ? 'Español, Tamil, Francés, Hindi, Inglés'
        : isHi
        ? 'हिन्दी, தமிழ், Français, Español, English'
        : 'Multilingual: TA, FR, ES, HI, EN',
      subtitle: isTa
        ? 'ஒரே கிளிக்கில் உங்கள் தாய்மொழியில் புதிர்களைத் தீர்க்கலாம்'
        : isFr
        ? 'Basculez de langue instantanément à tout moment'
        : isEs
        ? 'Cambia de idioma al instante con un solo toque'
        : isHi
        ? 'अपनी पसंदीदा भाषा में एक क्लिक से स्विच करें'
        : 'Switch smoothly between 5 languages with native translations',
      icon: '🌍',
      lucideIcon: <Languages className="w-6 h-6 text-emerald-400" />,
      highlightGradient: 'from-emerald-500/20 via-cyan-500/15 to-slate-900',
      borderGlow: 'border-emerald-500/40',
      description: isTa
        ? 'Sand.E முழுமையாக 5 மொழிகளை ஆதரிக்கிறது. மேல் பட்டியில் உள்ள மொழிக் குறியீட்டைத் தொட்டு எந்த நேரத்திலும் மொழியை மாற்றலாம். அனைத்து வழக்குகளும், கேள்விகளும், வழிகாட்டிகளும் துல்லியமாக மொழிபெயர்க்கப்பட்டுள்ளன.'
        : isFr
        ? 'Sand.E est conçu pour le monde entier ! Changez facilement de langue via le sélecteur dans l’en-tête. Tous les indices, dossiers, dialogues et guides sont intégralement traduits.'
        : isEs
        ? '¡Sand.E habla tu idioma! Selecciona el menú desplegable en la barra superior para cambiar a tu lengua preferida. Pistas, historias, guías y diálogos completamente localizados.'
        : isHi
        ? 'Sand.E दुनिया भर के खिलाड़ियों के लिए 5 भाषाओं का पूर्ण समर्थन करता है। ऊपर दिए गए भाषा मेनू से आप कभी भी अपनी भाषा बदल सकते हैं। सभी कहानियाँ और पहेलियाँ प्रामाणिक अनुवाद के साथ उपलब्ध हैं।'
        : 'Sand.E is built for a global audience! Use the language switcher in the header to alternate anytime. All cases, puzzle instructions, child guides, and voice synthesis support all 5 languages.',
      features: isTa
        ? [
            '🇮🇳 தமிழ் (Tamil) — தாய்மொழியில் தூய வழக்குகளும் விவரிப்புகளும்',
            '🇫🇷 Français — Version soignée pour les francophones',
            '🇪🇸 Español — Experiencia completa en lengua española',
            '🇮🇳 हिन्दी (Hindi) — शुद्ध और सरल पहेलियाँ एवं कहानियाँ',
            '🇬🇧 English — Standard international puzzle and assessment arena',
          ]
        : isFr
        ? [
            '🇫🇷 Français — Interface et narration complètes en français',
            '🇮🇳 Tamil (தமிழ்) — Énigmes et récits en tamoul authentique',
            '🇪🇸 Español — Expérience complète en espagnol',
            '🇮🇳 Hindi (हिन्दी) — Puzzles et affaires en hindi',
            '🇬🇧 English — Arène internationale complète',
          ]
        : isEs
        ? [
            '🇪🇸 Español — Interfaz y lectura de voz completa en español',
            '🇮🇳 Tamil (தமிழ்) — Casos y pistas en idioma tamil auténtico',
            '🇫🇷 Français — Énigmes et narration en français',
            '🇮🇳 Hindi (हिन्दी) — Puzzles y deducciones en hindi',
            '🇬🇧 English — Modo estándar internacional',
          ]
        : isHi
        ? [
            '🇮🇳 हिन्दी — संपूर्ण इंटरफ़ेस और आवाज़ की सुविधा',
            '🇮🇳 தமிழ் (Tamil) — तमिल भाषा में प्रमाणिक जासूसी केस',
            '🇫🇷 Français — फ़्रेंच भाषा में पहेलियाँ',
            '🇪🇸 Español — स्पैनिश में पूर्ण अनुभव',
            '🇬🇧 English — अंतर्राष्ट्रीय मानक प्रारूप',
          ]
        : [
            '🇬🇧 English — Standard international arena with rich cognitive assessments',
            '🇮🇳 Tamil (தமிழ்) — Authentic Detective Arunan cases and spoken guides',
            '🇫🇷 Français — Immersive francophone deduction dossiers',
            '🇪🇸 Español — Complete Spanish interface, hints and voiceover',
            '🇮🇳 Hindi (हिन्दी) — Comprehensive Hindi cases, puzzles, and TTS support',
          ],
      actionText: isTa ? 'அரங்கிற்குள் நுழையவும் 🌟' : 'Enter Arena 🌟',
      modeTarget: 'assessment',
    },
  ];

  const currentSlide = slides[slideIndex];

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const readText = `${currentSlide.title}. ${currentSlide.subtitle}. ${currentSlide.description}`;
      const utterance = new SpeechSynthesisUtterance(readText);
      utterance.lang = getSpeechLangCode(currentLang);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const handleNext = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    sound.playClick(500);
    if (slideIndex < slides.length - 1) {
      setSlideIndex((prev) => prev + 1);
    } else {
      sound.playSuccess();
      try {
        localStorage.setItem('arunan_iq_intro_seen', 'true');
      } catch {
        // ignore
      }
      onClose();
    }
  };

  const handlePrev = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    sound.playClick(440);
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1);
    }
  };

  const handleLaunchTarget = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    sound.playSuccess();
    try {
      localStorage.setItem('arunan_iq_intro_seen', 'true');
    } catch {
      // ignore
    }
    if (onSelectMode && currentSlide.modeTarget) {
      onSelectMode(currentSlide.modeTarget);
    }
    onClose();
  };

  const handleClose = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    try {
      localStorage.setItem('arunan_iq_intro_seen', 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden relative">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-sm">
              {currentSlide.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  {currentSlide.badge}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {slideIndex + 1} / {slides.length}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {currentSlide.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSelectLanguage && (
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-slate-800/80 border border-slate-700/80">
                {(
                  [
                    { code: 'ta' as AppLanguage, flag: '🇮🇳', label: 'தமிழ்' },
                    { code: 'en' as AppLanguage, flag: '🇬🇧', label: 'EN' },
                    { code: 'fr' as AppLanguage, flag: '🇫🇷', label: 'FR' },
                    { code: 'es' as AppLanguage, flag: '🇪🇸', label: 'ES' },
                    { code: 'hi' as AppLanguage, flag: '🇮🇳', label: 'हिन्दी' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      sound.playClick(450);
                      onSelectLanguage(item.code);
                    }}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      currentLang === item.code
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <span>{item.flag}</span>
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleSpeech}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={isSpeaking ? t('stopVoice', currentLang) : t('readAloud', currentLang)}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Intro"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Chapter Selector Pills */}
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto border-b border-slate-800/80 no-scrollbar">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                sound.playClick(440 + idx * 30);
                setSlideIndex(idx);
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                slideIndex === idx
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.id === 'welcome' ? (isTa ? 'அறிமுகம்' : 'Intro') : s.id === 'child' ? (isTa ? 'சுட்டி IQ' : 'Child IQ') : s.id === 'detective' ? (isTa ? 'துப்பறியும் Arunan' : 'Detective Arunan') : s.id === 'english' ? (isTa ? 'ஆங்கிலம்' : 'English') : s.id === 'grids' ? (isTa ? 'கட்டங்கள்' : 'Grids') : (isTa ? '5 மொழிகள்' : 'Languages')}</span>
            </button>
          ))}
        </div>

        {/* Slide Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          {/* Subtitle & Hero Description */}
          <div
            className={`p-5 rounded-3xl bg-gradient-to-br ${currentSlide.highlightGradient} border ${currentSlide.borderGlow} space-y-2.5 shadow-lg`}
          >
            <div className="text-xs font-semibold text-amber-300 font-mono">
              ✦ {currentSlide.subtitle}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {currentSlide.description}
            </p>
          </div>

          {/* Feature Checklist */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              {isTa ? 'முக்கிய சிறப்பம்சங்கள்:' : 'Key Highlights:'}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
              {currentSlide.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Pagination & Action Buttons */}
        <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
          {/* Slide Indicator Dots & Prev Button */}
          <div className="flex items-center gap-2">
            {slideIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Previous slide"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-1.5 px-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    sound.playClick(440 + i * 40);
                    setSlideIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    slideIndex === i ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLaunchTarget}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{currentSlide.actionText}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>{slideIndex === slides.length - 1 ? (isTa ? 'நன்றி, தொடங்குவோம்!' : 'Start Playing!') : (isTa ? 'அடுத்து' : 'Next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
