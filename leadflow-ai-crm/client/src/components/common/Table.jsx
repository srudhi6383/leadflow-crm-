import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export const Table = ({ columns = [], data = [], onSort, sortBy, order, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-700/80 ${className}`}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-700/80 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                onClick={() => col.sortable && onSort && onSort(col.key)}
                className={`py-3.5 px-4 ${col.sortable ? 'cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200' : ''}`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{col.title}</span>
                  {col.sortable && (
                    <ArrowUpDown className={`w-3.5 h-3.5 ${sortBy === col.key ? 'text-primary-600 dark:text-primary-400' : 'opacity-40'}`} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800/60">
          {data.map((row, rowIndex) => (
            <tr
              key={row._id || row.id || rowIndex}
              className="hover:bg-slate-50/70 dark:hover:bg-slate-700/40 transition-colors"
            >
              {columns.map((col, colIndex) => (
                <td key={col.key || colIndex} className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
