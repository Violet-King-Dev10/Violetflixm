import React from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-1.5 select-none", className)}>
      <div className="relative group">
        <div className="absolute -inset-1 bg-red-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-[#141414] rounded-lg p-1 border border-white/10">
          <Play className="w-5 h-5 fill-red-600 text-red-600" />
        </div>
      </div>
      {!iconOnly && (
        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
          VioletFlix <span className="text-red-600">Flix</span>
        </span>
      )}
    </div>
  );
}
