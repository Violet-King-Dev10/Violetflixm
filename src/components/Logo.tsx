import React from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <div className="relative group">
        <div className="absolute -inset-1 bg-red-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-300" />
        <div className="relative bg-[#141414] rounded-xl p-2 border border-white/10">
          <Play className="w-6 h-6 fill-red-600 text-red-600" />
        </div>
      </div>
      
      {!iconOnly && (
        <div className="flex items-baseline">
          <span className="text-2xl font-black tracking-tighter text-white">Violet</span>
          <span className="text-2xl font-black tracking-tighter text-red-600">Flix</span>
        </div>
      )}
    </div>
  );
          }
