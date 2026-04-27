import React from 'react';
import { Github, Linkedin, Twitter, Globe, Mail, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const SOCIAL_LINKS = [
  { name: 'Portfolio', icon: Globe, url: 'https://portfolio-Violetkingdev-projects.vercel.app/#', color: 'text-blue-400' },
  { name: 'GitHub', icon: Github, url: 'https://github.com/Violet-King-Dev10', color: 'text-white' },
  { name: 'LinkedIn', icon: Linkedin, url: '#', color: 'text-blue-600' },
  { name: 'Twitter', icon: Twitter, url: '#', color: 'text-sky-400' },
  { name: 'Contact', icon: Mail, url: `obij77708@gmail.com', color: 'text-red-500' },
];

export function About() {
  return (
    <div className="pt-32 pb-20 px-4 md:px-12 max-w-4xl mx-auto">
      <div className="text-center space-y-6 mb-20">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic">About VioletFlix Movie</h1>
        <p className="text-xl text-gray-400 leading-relaxed">
          VioletFlix Movie is a next-generation streaming experience, built for streaming, downloads, and community reviews. 
          Our mission is to bring high-quality entertainment to everyone, everywhere, with a seamless and interactive interface.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-1 bg-red-600 rounded-full" />
            The Creator
          </h2>
          <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xl font-bold">Neaterry6s</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Neaterry6s is a visionary full-stack developer dedicated to crafting immersive web experiences. 
              With a background in building scalable applications and integrating artificial intelligence, 
              he pushes the boundaries of what's possible on the web.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all", link.color)}
                  title={link.name}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-right justify-end">
            The Vision
            <span className="w-8 h-1 bg-red-600 rounded-full" />
          </h2>
          <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/5 space-y-4 text-right">
            <p className="text-gray-400 text-sm leading-relaxed">
              We believe streaming should be more than just watching. It should be about connecting. 
              Our platform integrates real-time discussion rooms, AI-powered assistance, and personalized 
              content discovery to create a community around the stories we love.
            </p>
            <div className="flex items-center justify-end gap-2 text-red-500 font-bold uppercase text-[10px] tracking-widest pt-4">
               Made with <Heart className="w-3 h-3 fill-current" /> in Nigeria
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// End of file
