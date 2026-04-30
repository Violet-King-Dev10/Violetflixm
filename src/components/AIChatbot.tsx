import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hello! I'm your VioletFlix assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Simple AI-like responses (since aiService is not in your api.ts)
    setTimeout(() => {
      let reply = "I'm here to help! What would you like to know about VioletFlix?";

      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        reply = "Hello! Welcome to VioletFlix Movie. How can I assist you?";
      } else if (lowerMsg.includes('sports') || lowerMsg.includes('live')) {
        reply = "You can watch live football matches in the Sports section. Click the Sports tab!";
      } else if (lowerMsg.includes('movie') || lowerMsg.includes('watch')) {
        reply = "Browse our huge collection of movies and series. Click 'Movies' or 'Series' in the navigation.";
      } else if (lowerMsg.includes('creator') || lowerMsg.includes('violetking')) {
        reply = "VioletKingDev is the creator of VioletFlix. He built this platform with love ❤️";
      }

      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[90%] max-w-[450px] h-[580px] bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-red-600 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="font-bold text-white text-sm">VioletFlix Assistant</h3>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-[10px] text-white/80">Online</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-white hover:bg-black/20 p-1 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide" ref={scrollRef}>
                {messages.map((m, i) => (
                  <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      'max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
                      m.role === 'user' 
                        ? 'bg-red-600 text-white rounded-tr-none' 
                        : 'bg-[#2f2f2f] text-gray-200 rounded-tl-none'
                    )}>
                      {m.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#2f2f2f] px-4 py-3 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 bg-black/20 border-t border-white/10">
                <div className="relative flex items-center gap-2">
                  <input
                    className="flex-1 bg-[#2f2f2f] border-none rounded-full py-3 px-5 text-sm focus:ring-1 focus:ring-red-600 text-white placeholder:text-gray-500"
                    placeholder="Ask me anything about VioletFlix..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    disabled={isTyping || !input.trim()}
                    className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300',
          isOpen ? 'bg-white text-black' : 'bg-red-600 text-white'
        )}
      >
        {isOpen ? <X className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
      </motion.button>
    </div>
  );
                                            }
