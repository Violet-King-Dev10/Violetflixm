import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import { useAuth } from '../lib/AuthContext';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

interface MovieDiscussionProps {
  movieId: string;
}

export function MovieDiscussion({ movieId }: MovieDiscussionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pusher = new Pusher('f8dda6420856102084bc', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe(`movie-${movieId}`);
    channel.bind('message', (data: ChatMessage) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      pusher.unsubscribe(`movie-${movieId}`);
    };
  }, [movieId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await axios.post('/api/chat/send', {
        movieId,
        message: newMessage,
        name: user.name || user.email.split('@')[0]
      });
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden flex flex-col border border-white/10 h-[500px]">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Reviews & Discussion</h3>
            <p className="text-[10px] text-gray-400">Join the conversation</p>
          </div>
        </div>
        <div className="flex -space-x-2">
           {[1,2,3].map(i => (
             <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-gray-600 flex items-center justify-center text-[10px]"><User className="w-3 h-3"/></div>
           ))}
           <div className="w-6 h-6 rounded-full border-2 border-black bg-gray-800 text-[8px] flex items-center justify-center">+42</div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {messages.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p>No messages yet. Be the first to start the discussion!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = user && (msg.name === (user.name || user.email.split('@')[0]));
          return (
            <div 
              key={msg.id} 
              className={cn("flex flex-col max-w-[80%]", isMe ? "ml-auto items-end" : "mr-auto")}
            >
              <span className="text-[10px] text-gray-500 mb-1 px-1 capitalize">{msg.name}</span>
              <div className={cn(
                "px-4 py-2 rounded-2xl text-sm",
                isMe ? "bg-red-600 text-white rounded-tr-none" : "bg-[#2f2f2f] text-gray-200 rounded-tl-none"
              )}>
                {msg.message}
              </div>
              <span className="text-[8px] text-gray-600 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-black/20 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-[#2f2f2f] border-none rounded-full py-2 px-6 pr-12 text-sm focus:ring-1 focus:ring-red-600 placeholder:text-gray-500"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
}
