import React from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <div className="relative">
        <div className="bg-red-600 rounded-lg p-1.5">
          <Play className="w-5 h-5 fill-white text-white" />
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="text-xl font-black tracking-tighter text-white">Violet</span>
        <span className="text-xl font-black tracking-tighter text-red-600">Flix</span>
      </div>
    </div>
  );
          }
