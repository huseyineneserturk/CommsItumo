import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import axios, { AxiosResponse } from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  timestamp: string;
  error?: string;
}

export const AIChatPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Kullanıcı girişi gerekli');
      }
      
      const token = await user.getIdToken();
      
      const response: AxiosResponse<ChatResponse> = await axios.post('http://127.0.0.1:8000/api/gemini/chat', {
        message: input
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: response.data.response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Bir hata oluştu, lütfen tekrar deneyin. 😔',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setMessages([]);
    setInput('');
  };

  const handleOpen = () => {
    setIsVisible(true);
    // Hoş geldin mesajı ekle
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: 'Merhaba! 👋 CommsItumo AI asistanınızım. Size nasıl yardımcı olabilirim? YouTube içerik üretimi, kanal büyütme stratejileri veya herhangi bir konuda sorularınızı sorabilirsiniz! 😊',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <>
      {/* Modern Floating Button */}
      <div
        onClick={handleOpen}
        className="fixed right-6 bottom-6 w-20 h-20 cursor-pointer z-50 group"
        title="AI Asistanı"
      >
        <img 
          src="/Resources/Pop_Up_Logo.png" 
          alt="AI Chat" 
          className="w-full h-full object-contain filter drop-shadow-2xl transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(147,51,234,0.6)]"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<div class="text-5xl filter drop-shadow-2xl transition-all duration-300 hover:scale-110">🤖</div>';
            }
          }}
        />
      </div>

      {/* Modern Chat Modal */}
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <img 
                    src="/Resources/Pop_Up_Logo.png" 
                    alt="AI Logo" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="text-2xl text-white">🤖</div>';
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">CommsItumo AI</h3>
                  <p className="text-slate-600">Akıllı Asistanınız</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                          : 'bg-white/20 backdrop-blur-xl text-slate-800 border border-white/30'
                      }`}
                    >
                      {message.sender === 'ai' ? (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }: any) => <p className="mb-2 last:mb-0 text-slate-800">{children}</p>,
                              strong: ({ children }: any) => <strong className="font-bold text-slate-900">{children}</strong>,
                              em: ({ children }: any) => <em className="italic text-slate-700">{children}</em>,
                              ul: ({ children }: any) => <ul className="list-disc list-inside ml-2 mb-2 text-slate-800">{children}</ul>,
                              ol: ({ children }: any) => <ol className="list-decimal list-inside ml-2 mb-2 text-slate-800">{children}</ol>,
                              li: ({ children }: any) => <li className="mb-1 text-slate-800">{children}</li>,
                              code: ({ children }: any) => (
                                <code className="bg-slate-100/50 px-2 py-1 rounded text-sm font-mono text-slate-900 border border-slate-200/50">
                                  {children}
                                </code>
                              ),
                              pre: ({ children }: any) => (
                                <pre className="bg-slate-100/50 p-3 rounded-xl overflow-x-auto mb-2 border border-slate-200/50">
                                  {children}
                                </pre>
                              ),
                              blockquote: ({ children }: any) => (
                                <blockquote className="border-l-4 border-purple-400 pl-4 italic mb-2 text-slate-700">
                                  {children}
                                </blockquote>
                              )
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap text-white font-medium">{message.text}</div>
                      )}
                    </div>

                    {message.sender === 'user' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/30">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                        <span className="text-slate-700 font-medium">AI düşünüyor...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-white/20 bg-white/5">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Sorunuzu yazın..."
                    className="flex-1 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent min-h-[50px] max-h-[120px]"
                    rows={1}
                    style={{ 
                      height: 'auto',
                      minHeight: '50px'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </form>
                
                {/* Info Text */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-slate-600">
                    YouTube içerik üretimi, kanal büyütme ve genel sorularınız için buradayım! 🚀
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 