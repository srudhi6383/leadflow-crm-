import React from 'react';

export const Card = ({ children, className = '', hover = false, padding = 'p-6', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shadow-soft ${
        hover ? 'card-hover' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-semibold text-slate-900 dark:text-slate-100 ${className}`}>
    {children}
  </h3>
);
