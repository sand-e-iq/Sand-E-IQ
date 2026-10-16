import React, { useState, useEffect, useRef } from 'react';
import type { AppLanguage } from '../types/i18n';
import type { WikipediaArticleSummary, WikipediaQuizQuestion } from '../types/game';
import {
  searchWikipedia,
  fetchRandomWikipediaArticles,
  createKnowledgeChallenge,
  CURATED_TOPICS,
  CuratedTopic,
} from '../utils/wikipedia';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { triggerConfetti } from '../utils/confetti';
import { addXP, recordCategoryPerformance, unlockAchievement } from '../utils/storage';
import {
  Search,
  BookOpen,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  Brain,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Globe2,
  Shuffle,
  ChevronRight,
  Flame,
  ArrowLeft,
  Share2,
  Clock,
  Zap,
} from 'lucide-react';

interface Props {
  currentLang: AppLanguage;
  onOpenAIAssistant?: (context?: string) => void;
  onBackToMain?: () => void;
}

export const WikipediaKnowledgeHub: React.FC<Props> = ({
  currentLang,
  onOpenAIAssistant,
  onBackToMain,
}) => {
  // Wikipedia Search Language (defaults to currentLang if 'ta', else 'en')
  const [wikiLang, setWikiLang] = useState<'en' | 'ta'>(() => (currentLang === 'ta' ? 'ta' : 'en'));
  const isTamil = wikiLang === 'ta';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<string>('science');
  const [articles, setArticles] = useState<WikipediaArticleSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [expandedArticles, setExpandedArticles] = useState<Record<number, boolean>>({});

  // Knowledge Challenge Mode state
  const [mode, setMode] = useState<'browse' | 'loading_quiz' | 'challenge' | 'challenge_summary'>('browse');
  const [selectedArticle, setSelectedArticle] = useState<WikipediaArticleSummary | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<WikipediaQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [quizAnswerHistory, setQuizAnswerHistory] = useState<{
    question: string;
    chosen: string;
    correct: string;
    isCorrect: boolean;
    explanation: string;
  }[]>([]);
  const [earnedXP, setEarnedXP] = useState<number>(0);
  const [showReview, setShowReview] = useState<boolean>(false);

  // Sync wikiLang if global currentLang changes and user hasn't explicitly set query
  useEffect(() => {
    if (currentLang === 'ta' && wikiLang !== 'ta') {
      setWikiLang('ta');
    }
  }, [currentLang]);

  // Load articles when wikiLang or activeTopic changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const initialTopic = CURATED_TOPICS.find((t) => t.id === activeTopic);
    const query = searchQuery.trim() || (initialTopic ? (wikiLang === 'ta' ? initialTopic.labelTa : initialTopic.query) : (wikiLang === 'ta' ? 'அறிவியல்' : 'Science'));

    searchWikipedia(query, wikiLang, 9)
      .then((results) => {
        if (isMounted) {
          setArticles(results);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed fetching Wikipedia articles', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [wikiLang, activeTopic]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sound.playClick(500);
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setActiveTopic('');
    searchWikipedia(searchQuery, wikiLang, 12)
      .then((res) => {
        setArticles(res);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleSelectCuratedTopic = (topic: CuratedTopic) => {
    sound.playClick(440);
    setActiveTopic(topic.id);
    const query = wikiLang === 'ta' ? topic.labelTa : topic.query;
    setSearchQuery(query);
    setIsLoading(true);

    searchWikipedia(query, wikiLang, 10)
      .then((res) => {
        setArticles(res);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleFetchRandom = async () => {
    sound.playClick(600);
    setIsLoading(true);
    setActiveTopic('');
    setSearchQuery('');
    try {
      const randoms = await fetchRandomWikipediaArticles(wikiLang, 6);
      setArticles(randoms);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartKnowledgeChallenge = async (article: WikipediaArticleSummary) => {
    sound.playSuccess();
    setSelectedArticle(article);
    setMode('loading_quiz');

    try {
      const questions = await createKnowledgeChallenge(article, wikiLang);
      if (questions && questions.length > 0) {
        setQuizQuestions(questions);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowExplanation(false);
        setQuizScore(0);
        setCorrectAnswersCount(0);
        setQuizStreak(0);
        setQuizAnswerHistory([]);
        setEarnedXP(0);
        setShowReview(false);
        setMode('challenge');
      } else {
        alert(isTamil ? 'வினாடி வினா உருவாக்க முடியவில்லை. மற்றொரு கட்டுரையைத் தேர்ந்தெடுக்கவும்.' : 'Could not generate quiz. Please choose another article.');
        setMode('browse');
      }
    } catch (err) {
      console.error('Challenge start failed', err);
      setMode('browse');
    }
  };

  const handleSelectQuizOption = (optionIndex: number) => {
    if (selectedOption !== null || showExplanation) return;

    setSelectedOption(optionIndex);
    setShowExplanation(true);

    const currentQ = quizQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQ.correctIndex;

    const chosenText = currentQ.options[optionIndex] || '';
    const correctText = currentQ.options[currentQ.correctIndex] || '';

    setQuizAnswerHistory((prev) => [
      ...prev,
      {
        question: currentQ.question,
        chosen: chosenText,
        correct: correctText,
        isCorrect,
        explanation: currentQ.explanation,
      },
    ]);

    if (isCorrect) {
      sound.playCorrect();
      setCorrectAnswersCount((c) => c + 1);
      const newStreak = quizStreak + 1;
      setQuizStreak(newStreak);
      const streakBonus = newStreak * 25;
      const points = 250 + streakBonus;
      setQuizScore((s) => s + points);
      recordCategoryPerformance('wikipedia', true, 12);
    } else {
      sound.playWrong();
      setQuizStreak(0);
      recordCategoryPerformance('wikipedia', false, 15);
    }
  };

  const handleNextQuizQuestion = () => {
    sound.playClick(500);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Quiz complete!
      const totalQ = quizQuestions.length;
      const finalAccuracy = Math.round((correctAnswersCount / totalQ) * 100);

      // Award XP
      const xpGained = correctAnswersCount * 75 + (finalAccuracy === 100 ? 100 : 25);
      addXP(xpGained);
      setEarnedXP(xpGained);

      // Unlock Omni Scholar achievement
      unlockAchievement('wiki_explorer');

      if (finalAccuracy >= 70) {
        sound.playWin();
        triggerConfetti();
      }

      setMode('challenge_summary');
    }
  };

  const handleSpeakText = (text: string) => {
    if (isSpeaking) {
      speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speech.speak(text, wikiLang);
      setTimeout(() => setIsSpeaking(false), 8000);
    }
  };

  const toggleExpand = (pageid: number) => {
    sound.playClick(440);
    setExpandedArticles((prev) => ({
      ...prev,
      [pageid]: !prev[pageid],
    }));
  };

  // -------------------------------------------------------------
  // RENDER: Knowledge Challenge Loading Screen
  // -------------------------------------------------------------
  if (mode === 'loading_quiz') {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_35px_rgba(0,217,255,0.4)] animate-pulse">
          <Brain className="w-10 h-10 animate-bounce" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 animate-ping" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">
            {isTamil ? 'அறிவு வினாடி வினா தயாராகிறது...' : 'Generating Knowledge Challenge...'}
          </h2>
          <p className="text-sm text-cyan-400 font-mono">
            {selectedArticle?.title} · Wikimedia Source Engine
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isTamil
              ? 'விக்கிபீடியா கட்டுரையின் உண்மைகளை ஆய்வு செய்து சிந்தனை வினாக்களைத் தொகுக்கிறது.'
              : 'Synthesizing verified facts and deductive questions directly from the official Wikipedia article.'}
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Active Knowledge Challenge Quiz Screen
  // -------------------------------------------------------------
  if (mode === 'challenge' && quizQuestions.length > 0) {
    const currentQ = quizQuestions[currentQuestionIndex];
    const totalQ = quizQuestions.length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQ) * 100);

    return (
      <div className="w-full max-w-3xl mx-auto space-y-5 px-2.5 sm:px-4">
        {/* Challenge Header & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#080d1a] border border-cyan-500/30 shadow-[0_0_20px_rgba(0,217,255,0.15)]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick(440);
                setMode('browse');
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Exit to Articles"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-900/60 text-cyan-300 font-bold border border-cyan-500/30">
                  {isTamil ? 'விக்கிபீடியா சவால்' : 'Wikipedia Challenge'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentQuestionIndex + 1} / {totalQ}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white truncate max-w-[220px] sm:max-w-md">
                {selectedArticle?.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400">
                {isTamil ? 'மதிப்பெண்' : 'Score'}
              </span>
              <div className="text-lg sm:text-xl font-black text-cyan-400 font-mono">
                {quizScore}
              </div>
            </div>
            {quizStreak > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{quizStreak}x</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="p-5 sm:p-7 rounded-3xl bg-[#080d1a] border border-blue-500/30 shadow-[0_0_25px_rgba(0,102,255,0.2)] space-y-5">
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
              {isTamil ? `கேள்வி ${currentQuestionIndex + 1}` : `Question ${currentQuestionIndex + 1}`}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSpeakText(currentQ.question)}
                className="p-1.5 px-2.5 rounded-lg bg-blue-500/20 text-cyan-300 hover:bg-blue-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Voice Reading"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isTamil ? 'வாசி' : 'Listen'}</span>
              </button>

              {onOpenAIAssistant && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenAIAssistant(
                      `Wikipedia Article: ${selectedArticle?.title}\nQuestion: ${currentQ.question}`
                    )
                  }
                  className="p-1.5 px-2.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Ask AI Coach"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI</span>
                </button>
              )}
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle =
                'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-blue-950/60 hover:border-cyan-500/50 hover:text-white';

              if (showExplanation) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
                } else {
                  btnStyle = 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={showExplanation}
                  onClick={() => handleSelectQuizOption(idx)}
                  className={`w-full min-h-[50px] p-4 rounded-2xl border text-left font-medium text-sm sm:text-base flex items-center justify-between gap-3 transition-all cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xs font-mono text-cyan-300 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {showExplanation && (
                    <div className="shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/40 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  {isTamil ? 'விக்கிபீடியா உண்மை சரிபார்ப்பு' : 'Wikipedia Verified Source'}
                </span>
                <a
                  href={currentQ.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1"
                >
                  <span>{isTamil ? 'மூலம் பார்க்க' : 'View Source'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
              {currentQ.cognitiveTip && (
                <p className="text-xs text-cyan-300 font-mono pt-1">
                  💡 {currentQ.cognitiveTip}
                </p>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuizQuestion}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,217,255,0.5)] flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>
                    {currentQuestionIndex < totalQ - 1
                      ? isTamil
                        ? 'அடுத்த கேள்வி'
                        : 'Next Question'
                      : isTamil
                      ? 'முடிவுகளைப் பார்க்க'
                      : 'View Results'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Knowledge Challenge Summary / Results Screen
  // -------------------------------------------------------------
  if (mode === 'challenge_summary') {
    const totalQ = quizQuestions.length;
    const accuracy = Math.round((correctAnswersCount / totalQ) * 100);

    return (
      <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-950 border border-cyan-400/40 shadow-[0_0_35px_rgba(0,217,255,0.25)] text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-3xl">
          🏆
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isTamil ? 'அறிவு சவால் முடிந்தது!' : 'Knowledge Challenge Complete!'}
          </h2>
          <p className="text-sm text-cyan-300 font-mono mt-1">
            {selectedArticle?.title} · Wikipedia Knowledge Hub
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">
              {isTamil ? 'மதிப்பெண்' : 'Score'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-white">{quizScore}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">
              {isTamil ? 'துல்லியம்' : 'Accuracy'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-cyan-400">{accuracy}%</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">
              {isTamil ? 'பெற்ற XP' : 'XP Earned'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">+{earnedXP}</div>
          </div>
        </div>

        {/* Achievement Badge Notification */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-950/60 border border-blue-500/40 text-left">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xl shrink-0">
            🌐
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{isTamil ? 'சாதனை அன்லாக்: பல்நோக்கு அறிஞர்' : 'Achievement Unlocked: Omni Scholar'}</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              {isTamil
                ? 'விக்கிபீடியா கட்டுரையை வெற்றிகரமாக படித்து வினாடி வினாவை முடித்தீர்கள்!'
                : 'Successfully mastered article comprehension on the Wikipedia Knowledge Hub!'}
            </p>
          </div>
        </div>

        {/* Review Answers Button */}
        <div>
          <button
            type="button"
            onClick={() => setShowReview((prev) => !prev)}
            className="text-xs text-cyan-400 hover:text-cyan-300 underline font-mono cursor-pointer"
          >
            {showReview
              ? isTamil
                ? 'விடை மீளாய்வை மறை'
                : 'Hide Answer Review'
              : isTamil
              ? 'விடைகளை மீளாய்வு செய்'
              : 'Review Questions & Answers'}
          </button>
        </div>

        {/* Review Answers List */}
        {showReview && (
          <div className="space-y-3 text-left max-h-60 overflow-y-auto pr-1">
            {quizAnswerHistory.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  item.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                  <span>{item.question}</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  <span className="font-semibold text-white">{isTamil ? 'உங்கள் விடை: ' : 'Your answer: '}</span>
                  {item.chosen}
                </div>
                {!item.isCorrect && (
                  <div className="text-[11px] text-emerald-300">
                    <span className="font-semibold">{isTamil ? 'சரியான விடை: ' : 'Correct answer: '}</span>
                    {item.correct}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {selectedArticle && (
            <a
              href={selectedArticle.fullurl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isTamil ? 'விக்கிபீடியாவில் படிக்க' : 'Read Full Article on Wikipedia'}</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => {
              sound.playClick(500);
              setMode('browse');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,217,255,0.4)] cursor-pointer transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isTamil ? 'மேலும் கட்டுரைகளை ஆராய்' : 'Explore More Articles'}</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Main Browsing & Search Hub Screen
  // -------------------------------------------------------------
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 px-2.5 sm:px-6">
      {/* Hero Banner with Sand.E IQ Visual Identity */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#050505] via-[#081026] to-[#040817] border border-blue-500/40 shadow-[0_0_35px_rgba(0,102,255,0.25)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,217,255,0.3)]">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>SAND.E IQ KNOWLEDGE HUB</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-[11px] text-blue-300 font-mono">
                Official Wikimedia API
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {isTamil ? (
                <>
                  விக்கிபீடியா <span className="text-cyan-400">அறிவு மையம்</span>
                </>
              ) : (
                <>
                  Wikipedia <span className="text-cyan-400">Knowledge Hub</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTamil
                ? 'தமிழ் மற்றும் ஆங்கில விக்கிபீடியா கட்டுரைகளை உடனுக்குடன் தேடுங்கள், வாசியுங்கள் மற்றும் கட்டுரைகளின் அடிப்படையில் உருவாக்கப்படும் அறிவு வினாடி வினா சவால்களை வெல்லுங்கள்.'
                : 'Search verified articles across English and Tamil Wikipedia, read concise executive summaries, and take interactive Knowledge Challenge quizzes generated directly from article facts.'}
            </p>
          </div>

          {/* Language Switcher Controls */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 shrink-0">
            <div className="flex items-center p-1 rounded-2xl bg-slate-950/90 border border-blue-900/60 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  sound.playClick(440);
                  setWikiLang('en');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  wikiLang === 'en'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_12px_rgba(0,217,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick(440);
                  setWikiLang('ta');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  wikiLang === 'ta'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_12px_rgba(0,217,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇮🇳</span>
                <span>தமிழ் (Tamil)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleFetchRandom}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              title="Discover Random Articles"
            >
              <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isTamil ? '🎲 எதிர்பாராத கட்டுரை' : '🎲 Random Articles'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-cyan-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isTamil
                ? 'விக்கிபீடியாவில் தேடவும்... (எ.கா. ஆல்பர்ட் ஐன்ஸ்டைன், விண்வெளி, செயற்கை நுண்ணறிவு)'
                : 'Search Wikipedia... (e.g., Quantum Mechanics, Artificial Intelligence, Albert Einstein)'
            }
            className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl bg-slate-950/90 border border-blue-900/60 focus:border-cyan-400 text-white placeholder-slate-500 text-sm sm:text-base outline-none shadow-[0_4px_20px_rgba(0,0,0,0.5)] focus:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all"
          />
          <button
            type="submit"
            className="absolute right-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold font-mono transition-all shadow-[0_0_12px_rgba(0,217,255,0.4)] cursor-pointer"
          >
            {isTamil ? 'தேடு' : 'Search'}
          </button>
        </div>
      </form>

      {/* Curated Topic Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>{isTamil ? 'பிரபலமான தலைப்புகள்:' : 'Trending Knowledge Topics:'}</span>
          <span className="text-cyan-400">1-Tap Explore</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-blue-900/40">
          {CURATED_TOPICS.map((topic) => {
            const isSelected = activeTopic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => handleSelectCuratedTopic(topic)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold shadow-[0_0_12px_rgba(0,217,255,0.4)]'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>{topic.icon}</span>
                <span>{isTamil ? topic.labelTa : topic.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Status & Content Area */}
      {isLoading ? (
        <div className="py-20 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/20 border border-cyan-400 text-cyan-400 animate-spin">
            <Globe2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-mono text-cyan-300">
            {isTamil ? 'விக்கிபீடியா தேடல் நடைபெறுகிறது...' : 'Querying official Wikimedia API...'}
          </p>
        </div>
      ) : articles.length === 0 ? (
        <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">
            {isTamil ? 'கட்டுரைகள் எதுவும் கிடைக்கவில்லை' : 'No Articles Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isTamil
              ? 'வேறு ஒரு தலைப்பில் தேடவும் அல்லது மேலே உள்ள பிரபலமான தலைப்புகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்.'
              : 'Try searching for another keyword or select one of the curated knowledge topics above.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>
              {isTamil
                ? `${articles.length} கட்டுரைகள் கண்டறியப்பட்டன (${wikiLang.toUpperCase()}.WIKIPEDIA.ORG)`
                : `Showing ${articles.length} verified articles (${wikiLang.toUpperCase()}.WIKIPEDIA.ORG)`}
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Wikimedia API
            </span>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => {
              const isExpanded = Boolean(expandedArticles[article.pageid]);
              const snippet = article.extract;
              const displaySnippet =
                !isExpanded && snippet.length > 240
                  ? snippet.slice(0, 237) + '...'
                  : snippet;

              return (
                <div
                  key={article.pageid}
                  className="flex flex-col justify-between p-5 rounded-3xl bg-[#080d1a] border border-blue-900/50 hover:border-cyan-500/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(0,217,255,0.2)] transition-all group"
                >
                  <div className="space-y-3.5">
                    {/* Thumbnail or Fallback Icon */}
                    <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-900/40 flex items-center justify-center">
                      {article.thumbnail ? (
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            // If image fails, fallback to clean icon
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-cyan-400">
                          <BookOpen className="w-10 h-10 opacity-70" />
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            Wikipedia Article
                          </span>
                        </div>
                      )}

                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold">
                        {article.lang.toUpperCase()}
                      </div>

                      {article.wordCount && article.wordCount > 0 && (
                        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>~{Math.max(1, Math.ceil(article.wordCount / 100))} min read</span>
                        </div>
                      )}
                    </div>

                    {/* Article Title */}
                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </div>

                    {/* Article Summary Snippet */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {displaySnippet}
                    </p>

                    {snippet.length > 240 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(article.pageid)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono underline cursor-pointer"
                      >
                        {isExpanded
                          ? isTamil
                            ? 'சுருக்கமாகக் காட்டு'
                            : 'Show Less'
                          : isTamil
                          ? 'முழு சுருக்கத்தைக் காட்டு'
                          : 'Show Full Summary'}
                      </button>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-5 mt-4 border-t border-blue-950/70 space-y-2.5">
                    {/* Read on Wikipedia Button */}
                    <a
                      href={article.fullurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      <span>
                        {isTamil ? 'விக்கிபீடியாவில் படிக்க' : 'Read More on Wikipedia'}
                      </span>
                    </a>

                    {/* Interactive Knowledge Challenge Button */}
                    <button
                      type="button"
                      onClick={() => handleStartKnowledgeChallenge(article)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:shadow-[0_0_25px_rgba(0,217,255,0.5)] transition-all cursor-pointer"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>
                        {isTamil ? 'அறிவு வினாடி வினா சவால்' : 'Knowledge Challenge'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Attribution & License Notice Footer */}
      <div className="p-4 rounded-2xl bg-[#050505] border border-blue-950 text-center space-y-1 text-slate-500 text-xs">
        <p className="flex items-center justify-center gap-1.5 flex-wrap">
          <span>Official Wikimedia API Integration.</span>
          <span>·</span>
          <span>Content licensed under</span>
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            CC BY-SA 4.0
          </a>
          <span>·</span>
          <span>Wikipedia is a trademark of the Wikimedia Foundation.</span>
        </p>
      </div>
    </div>
  );
};
