import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="p-4 bg-primary-50 dark:bg-primary-950/60 text-primary-600 rounded-3xl mb-4 shadow-lg shadow-primary-600/10">
        <FileQuestion className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        The requested CRM page or route could not be located on the server.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={ArrowLeft}>
          Return to Executive Dashboard
        </Button>
      </Link>
    </div>
  );
};
