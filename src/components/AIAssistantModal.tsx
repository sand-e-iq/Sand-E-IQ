import React, { useState, useEffect, useRef } from 'react';
import { AppLanguage } from '../types/i18n';
import { sound } from '../utils/audio';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Brain,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang: AppLanguage;
  initialContext?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export const AIAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLang,
  initialContext,
}) => {
  const isTamil = currentLang === 'ta';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = isTamil
        ? `வணக்கம்! நான் உங்கள் **Sand.E IQ AI கற்றல் வழிகாட்டி**. புதிர்களின் தர்க்கத்தை அறியவோ, நினைவாற்றல் மற்றும் வடிவத் தொடர் உத்திகளைக் கற்றுக்கொள்ளவோ என்னிடம் கேளுங்கள்!`
        : `Greetings! I am your **Sand.E IQ AI Learning Assistant**. Ask me about deductive puzzle reasoning, memory strategies, or how to break down complex sequence challenges!`;

      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isOpen, isTamil]);

  // When initialContext is passed, trigger automatic prompt
  useEffect(() => {
    if (isOpen && initialContext) {
      sendMessage(
        isTamil
          ? `இந்தக் கேள்வியின் தர்க்கத்தை எளிமையாக விளக்கவும்: ${initialContext}`
          : `Please explain the reasoning and step-by-step logic for this problem: ${initialContext}`,
        initialContext
      );
    }
  }, [initialContext, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const sendMessage = async (userText: string, contextOverride?: string) => {
    if (!userText.trim() || isLoading) return;

    sound.playClick(500);
    const newMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          context: contextOverride || initialContext || '',
          language: currentLang,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to reach AI assistant service');
      }

      const data = await res.json();
      const aiReply = data.reply || (isTamil ? 'மன்னிக்கவும், தர்க்க விளக்கத்தை உருவாக்க முடியவில்லை.' : 'Apologies, could not generate guidance at this moment.');

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: data.source,
        },
      ]);
      sound.playSuccess();
    } catch (err: any) {
      console.error('AI assistant error:', err);
      setErrorMsg(isTamil ? 'சேவை இணைப்பில் சிக்கல் ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'Connection error. Please try asking again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = isTamil
    ? [
        'வடிவப் புதிர்களைத் தீர்ப்பதற்கான எளிய உத்திகள் யாவை?',
        'நினைவாற்றல் கட்ட ஆட்டத்தில் அதிக மதிப்பெண் பெறுவது எப்படி?',
        'எண் தொடர்களில் உள்ள வேறுபாடுகளைக் கண்டறிவது எப்படி?',
        'Sand.E IQ மதிப்பெண் முறை எவ்வாறு கணக்கிடப்படுகிறது?',
      ]
    : [
        'How can I spot rules faster in Raven-style pattern matrices?',
        'What are the best working memory retention techniques?',
        'How do I identify alternating arithmetic and geometric series?',
        'Explain how Sand.E IQ scores and speed bonuses work.',
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl h-[90vh] max-h-[680px] flex flex-col rounded-3xl bg-[#060b17] border border-cyan-400/40 shadow-[0_0_40px_rgba(0,217,255,0.25)] overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-900/40 bg-[#03060e]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.4)]">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {isTamil ? 'Sand.E AI கற்றல் வழிகாட்டி' : 'Sand.E AI Learning Coach'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  AI-Powered
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {isTamil ? 'தமிழ் & English தர்க்க சிந்தனை வழிகாட்டி' : 'Cognitive logic, tips, and step-by-step explanations'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message history */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 no-scrollbar">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(0,102,255,0.3)]'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-100 shadow-md'
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[9px] font-mono mt-1.5 opacity-60 ${
                      isUser ? 'text-right' : 'text-left text-cyan-300'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 max-w-[80%] mr-auto items-center text-xs text-cyan-300 font-mono">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                <Brain className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-400/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{isTamil ? 'AI சிந்தித்து விடையளிக்கிறது...' : 'AI Cognitive Engine analyzing...'}</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-[#040812] border-t border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold whitespace-nowrap">
              {isTamil ? 'உடனடி கேள்விகள்:' : 'Quick Prompts:'}
            </span>
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(q)}
                className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/50 text-[11px] text-slate-300 whitespace-nowrap transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputValue);
          }}
          className="p-3 sm:p-4 bg-[#03060e] border-t border-blue-900/40 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isTamil
                ? 'உங்கள் தர்க்க சந்தேகங்கள் அல்லது கேள்விகளை எழுதுங்கள்...'
                : 'Ask AI Coach about logic, patterns, or memory tips...'
            }
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 text-white transition-all shadow-[0_0_15px_rgba(0,217,255,0.4)] cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
