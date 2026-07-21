import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ label = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-3" />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
};
