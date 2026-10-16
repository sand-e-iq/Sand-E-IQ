import React, { useState } from 'react';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import { CustomQuizItem, IQQuizQuestion } from '../types/game';
import { saveCustomQuiz, getCustomQuizzes, deleteCustomQuiz } from '../utils/storage';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Play,
  Save,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang: AppLanguage;
  onPlayCustomQuiz?: (quiz: CustomQuizItem) => void;
}

export const CustomQuizMakerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLang,
  onPlayCustomQuiz,
}) => {
  if (!isOpen) return null;

  const isTa = currentLang === 'ta';
  const [quizzes, setQuizzes] = useState<CustomQuizItem[]>(() => getCustomQuizzes());
  const [view, setView] = useState<'list' | 'create'>('list');

  // Form state
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCategory, setQuizCategory] = useState('logic');
  const [questions, setQuestions] = useState<IQQuizQuestion[]>([
    {
      id: 'q-custom-1',
      difficulty: 'medium',
      category: 'pattern',
      title: 'Deductive Reasoning Test',
      titleTa: 'தர்க்க பகுப்பாய்வு தேர்வு',
      prompt: 'If all bloops are razzies and all razzies are lazies, are all bloops definitely lazies?',
      promptTa: 'அனைத்து ப்ளூப்களும் ராஸிகள் மற்றும் அனைத்து ராஸிகளும் லேசிகள் என்றால், அனைத்து ப்ளூப்களும் லேசிகள் ஆகுமா?',
      options: [
        { id: 'opt-1', text: 'Yes, definitely true (Syllogism)', textTa: 'ஆம், முற்றிலும் உண்மை (தர்க்க நியதி)', isCorrect: true },
        { id: 'opt-2', text: 'No, false', textTa: 'இல்லை, தவறு', isCorrect: false },
        { id: 'opt-3', text: 'Cannot be determined', textTa: 'தீர்மானிக்க முடியாது', isCorrect: false },
        { id: 'opt-4', text: 'Only in alternate logic', textTa: 'மாற்று தர்க்கத்தில் மட்டுமே', isCorrect: false },
      ],
      explanation: 'By standard transitive property of categorical syllogisms: A subset of B, and B subset of C, implies A subset of C.',
      explanationTa: 'தர்க்க நியதிப்படி A என்பது B-ன் பகுதி, B என்பது C-ன் பகுதி என்றால், A கண்டிப்பாக C-ன் பகுதியாகும்.',
      cognitiveTip: 'Look for transitive relations.',
      cognitiveTipTa: 'தொடர்பு விதியை கவனியுங்கள்.',
    },
  ]);

  // Current draft question
  const [draftPrompt, setDraftPrompt] = useState('');
  const [draftOptions, setDraftOptions] = useState([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [draftExplanation, setDraftExplanation] = useState('');

  const handleAddQuestionToDraft = () => {
    if (!draftPrompt.trim() || draftOptions.some((o) => !o.text.trim())) {
      sound.playError();
      return;
    }

    const newQ: IQQuizQuestion = {
      id: 'q-custom-' + Date.now(),
      difficulty: 'medium',
      category: quizCategory as any,
      title: `Custom Question ${questions.length + 1}`,
      titleTa: `தனிப்பயன் வினா ${questions.length + 1}`,
      prompt: draftPrompt,
      promptTa: draftPrompt,
      options: draftOptions.map((o, idx) => ({
        id: `opt-${idx + 1}`,
        text: o.text,
        textTa: o.text,
        isCorrect: o.isCorrect,
      })),
      explanation: draftExplanation || 'Standard deductive logic.',
      explanationTa: draftExplanation || 'தர்க்கரீதியான முழு விளக்கம்.',
      cognitiveTip: 'Think carefully about options.',
      cognitiveTipTa: 'கவனமாக சிந்தியுங்கள்.',
    };

    setQuestions([...questions, newQ]);
    sound.playSuccess();
    setDraftPrompt('');
    setDraftOptions([
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
    setDraftExplanation('');
  };

  const handleSaveQuiz = () => {
    if (!quizTitle.trim() || questions.length === 0) {
      sound.playError();
      return;
    }

    const newQuiz: CustomQuizItem = {
      id: 'cq-' + Date.now(),
      title: quizTitle.trim(),
      author: 'You',
      createdAt: new Date().toISOString(),
      category: quizCategory,
      questions,
    };

    const updated = saveCustomQuiz(newQuiz);
    setQuizzes(updated);
    sound.playSuccess();
    setView('list');
    setQuizTitle('');
  };

  const handleDelete = (id: string) => {
    sound.playClick(400);
    const updated = deleteCustomQuiz(id);
    setQuizzes(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0a1226] via-[#050505] to-[#050505] border border-blue-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,102,255,0.3)] my-auto max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-600/20 text-indigo-300 border border-indigo-400/40">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {isTa ? 'தனிப்பயன் வினாடி வினா உருவாக்குநர்' : 'Custom Quiz Maker & Creator'}
              </h2>
              <p className="text-xs text-slate-400">
                {isTa
                  ? 'உங்கள் சொந்த தர்க்க வினாடி வினாக்களை உருவாக்கி, சேமித்து நண்பர்களுடன் விளையாடுங்கள்'
                  : 'Design custom question sets, save to local library & challenge friends'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center gap-2 my-3 shrink-0">
          <button
            type="button"
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              view === 'list'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {isTa ? 'சேமிக்கப்பட்ட வினாக்கள்' : 'Saved Quizzes'} ({quizzes.length})
          </button>
          <button
            type="button"
            onClick={() => setView('create')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              view === 'create'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isTa ? 'புதிய வினாடி வினா உருவாக்கு' : 'Create New Quiz'}</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {view === 'list' ? (
            <div className="space-y-3">
              {quizzes.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm">
                    {isTa ? 'சேமிக்கப்பட்ட தனிப்பயன் வினாடி வினாக்கள் இல்லை.' : 'No custom quizzes created yet.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setView('create')}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    + {isTa ? 'முதல் வினாவை உருவாக்கவும்' : 'Create Your First Quiz'}
                  </button>
                </div>
              ) : (
                quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{quiz.title}</h4>
                      <p className="text-xs text-slate-400">
                        {quiz.questions.length} {isTa ? 'கேள்விகள்' : 'questions'} · {quiz.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {onPlayCustomQuiz && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onPlayCustomQuiz(quiz);
                          }}
                          className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>{isTa ? 'ஆடு' : 'Play'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(quiz.id)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  {isTa ? 'வினாடி வினா தலைப்பு' : 'Quiz Title'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Detective Logic Test"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              {/* Added questions list */}
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-slate-400 font-bold">
                  {questions.length} {isTa ? 'கேள்விகள் சேர்க்கப்பட்டுள்ளன' : 'Questions Added'}
                </span>
                {questions.map((q, i) => (
                  <div key={q.id} className="text-xs text-slate-300 p-2 rounded-lg bg-slate-900">
                    <strong>Q{i + 1}:</strong> {q.prompt}
                  </div>
                ))}
              </div>

              {/* Add question form */}
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-cyan-500/30 space-y-3">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  + {isTa ? 'கேள்வி விவரங்கள்' : 'Add Question'}
                </span>
                <input
                  type="text"
                  placeholder="Enter Question Prompt / கேள்வி விளக்கம்"
                  value={draftPrompt}
                  onChange={(e) => setDraftPrompt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />

                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-bold">
                    {isTa ? '4 பதில்கள் (சரியான விடையைத் தேர்ந்தெடுக்கவும்)' : '4 Options (Mark correct answer)'}
                  </span>
                  {draftOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={opt.isCorrect}
                        onChange={() => {
                          setDraftOptions(
                            draftOptions.map((o, i) => ({ ...o, isCorrect: i === idx }))
                          );
                        }}
                        className="accent-cyan-400 cursor-pointer"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={opt.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraftOptions(
                            draftOptions.map((o, i) => (i === idx ? { ...o, text: val } : o))
                          );
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Deductive Explanation (optional) / விளக்கம்"
                  value={draftExplanation}
                  onChange={(e) => setDraftExplanation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />

                <button
                  type="button"
                  onClick={handleAddQuestionToDraft}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold"
                >
                  + {isTa ? 'இந்தக் கேள்வியைச் சேர்' : 'Add Question to Quiz'}
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveQuiz}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isTa ? 'வினாடி வினாவை சேமிக்க' : 'Save Quiz'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
