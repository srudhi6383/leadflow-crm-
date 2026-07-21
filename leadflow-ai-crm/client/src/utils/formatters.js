/**
 * Formats numbers into currency strings ($12,500)
 */
export const formatCurrency = (val = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
};

/**
 * Formats ISO dates into readable strings (Jul 20, 2026)
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Returns color classes for lead status badges
 */
export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'New':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    case 'Contacted':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    case 'Qualified':
      return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
    case 'Proposal':
      return 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    case 'Won':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    case 'Lost':
      return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  }
};

/**
 * Returns color classes for priority badges
 */
export const getPriorityBadgeStyle = (priority) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 font-semibold';
    case 'High':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400';
    case 'Medium':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400';
    case 'Low':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};
