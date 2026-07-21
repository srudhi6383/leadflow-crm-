import React from 'react';

export const Skeleton = ({ className = '', variant = 'text' }) => {
  const base = 'animate-pulse bg-slate-200 dark:bg-slate-700/60 rounded-xl';

  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    card: 'h-32 w-full',
    avatar: 'h-10 w-10 rounded-full',
    table: 'h-12 w-full',
  };

  return <div className={`${base} ${variants[variant] || ''} ${className}`} />;
};

export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="w-full space-y-3">
    <div className="h-10 bg-slate-200/60 dark:bg-slate-800 rounded-xl animate-pulse" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800/40 rounded-xl animate-pulse" />
    ))}
  </div>
);

export const CardSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
        <Skeleton variant="text" className="w-1/2" />
        <Skeleton variant="title" className="w-3/4" />
        <Skeleton variant="text" className="w-1/3" />
      </div>
    ))}
  </div>
);
