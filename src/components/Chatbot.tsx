import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Loader2, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { dbService } from '../services/db';
import { ChatbotSettings, Profile, Project, Skill, Experience, Certificate, Settings } from '../types';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

class MarkdownErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Markdown rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-sm p-3 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/20 w-full overflow-hidden break-words">
          <p className="font-bold flex items-center gap-1.5"><Bot size={14}/> Gagal merender pesan AI.</p>
          <p className="text-xs mt-1 font-mono">{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load Settings
  useEffect(() => {
    const loadSettings = async () => {
      const s = await dbService.getChatbotSettings();
      setSettings(s);
    };
    loadSettings();
  }, []);

  // Load History from Session Storage
  useEffect(() => {
    const history = sessionStorage.getItem('aster_chat_history');
    if (history) {
      try {
        setMessages(JSON.parse(history));
      } catch (e) {
        console.error("Gagal memuat history chat.");
      }
    }
  }, []);

  // Save History to Session Storage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('aster_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    sessionStorage.removeItem('aster_chat_history');
    toast.success("Riwayat chat dihapus.");
  };

  const sendMessage = async () => {
    if (!input.trim() || !settings || !settings.enabled) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Gather context
      const [profile, skills, projects, experiences, certificates, siteSettings] = await Promise.all([
        dbService.getProfile(),
        dbService.getSkills(),
        dbService.getProjects(),
        dbService.getExperiences(),
        dbService.getCertificates(),
        dbService.getSettings()
      ]);

      const currentTime = new Date().toLocaleString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });

      const contextData = { profile, skills, projects, experiences, certificates, settings: siteSettings, currentTime };

      const currentMessages = [...messages, userMessage];

      // Call API
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages,
          contextData,
          settings
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mendapatkan respons.");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.text,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `*Maaf, terjadi kesalahan: ${error.message}*`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!settings || !settings.enabled) return null;

  const isOnline = settings.status === 'online';

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="fixed bottom-6 right-6 z-50 p-4 bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl cursor-pointer hover:scale-105 transition-all group"
            aria-label="Buka Chat AI"
          >
            <MessageCircle size={28} className="group-hover:animate-pulse" />
            {isOnline && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-32px)] md:w-full max-w-[380px] h-[50vh] max-h-[60vh] md:h-[600px] md:max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-3 md:p-4 text-white flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
                  <Bot className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[13px] md:text-sm leading-tight">{settings.aiName}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-amber-400'} animate-pulse`}></span>
                    <span className="text-[10px] text-white/80 font-medium">
                      {isOnline ? 'Online & Ready to Assist' : 'Away / Busy'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClearChat();
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors tooltip"
                  title="Bersihkan Chat"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50 relative scroll-smooth custom-scrollbar">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-1.5 max-w-[80%] md:max-w-[85%]"
                >
                  <div className="bg-white dark:bg-slate-800 p-3 md:p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700/50 text-[13px] md:text-sm text-slate-700 dark:text-slate-300">
                    <MarkdownErrorBoundary>
                      <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-a:text-primary max-w-none text-[13px] md:text-sm">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                        >
                          {settings.welcomeMessage}
                        </ReactMarkdown>
                      </div>
                    </MarkdownErrorBoundary>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium px-1">Baru saja</span>
                </motion.div>
              )}

              {/* Chat Messages */}
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className={`flex flex-col gap-1.5 ${isUser ? 'items-end max-w-[75%] md:max-w-[85%] ml-auto' : 'items-start max-w-[80%] md:max-w-[85%]'}`}
                  >
                    <div className={`p-3 md:p-3.5 rounded-2xl shadow-sm text-[13px] md:text-sm ${
                      isUser 
                        ? 'bg-primary text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm border border-slate-100 dark:border-slate-700/50'
                    }`}>
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <MarkdownErrorBoundary>
                          <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:p-0 prose-pre:border prose-pre:border-slate-800 overflow-hidden break-words max-w-none text-[13px] md:text-sm">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code(props: any) {
                                  const {children, className, node, ...rest} = props;
                                  const match = /language-(\w+)/.exec(className || '');
                                  return match ? (
                                    <SyntaxHighlighter
                                      {...rest}
                                      children={String(children).replace(/\n$/, '')}
                                      style={vscDarkPlus as any}
                                      language={match[1]}
                                      PreTag="div"
                                      className="rounded-lg text-[12px] !m-0 !p-3"
                                    />
                                  ) : (
                                    <code className={`${className || ''} bg-slate-100 dark:bg-slate-800 text-primary dark:text-blue-300 px-1.5 py-0.5 rounded-md text-xs`} {...rest}>
                                      {children}
                                    </code>
                                  )
                                }
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </MarkdownErrorBoundary>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-1.5 max-w-[80%] md:max-w-[85%]"
                >
                  <div className="bg-white dark:bg-slate-800 p-3 md:p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700/50 w-fit">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="p-2 md:p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="relative flex items-end gap-1 md:gap-2 bg-slate-50 dark:bg-slate-950 p-1 md:p-2 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder={settings.placeholderText}
                  className="w-full max-h-[120px] bg-transparent text-[13px] md:text-sm text-slate-800 dark:text-slate-200 px-2 md:px-3 py-2 md:py-2.5 resize-none focus:outline-none custom-scrollbar"
                  rows={1}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    sendMessage();
                  }}
                  disabled={!input.trim() || isTyping}
                  className="p-2 md:p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors flex-shrink-0 mb-0.5 mr-0.5 cursor-pointer shadow-sm shadow-primary/20"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Send className="w-4 h-4 md:w-5 md:h-5 ml-0.5" />}
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[9px] text-slate-400 font-medium">Shift + Enter untuk baris baru</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
