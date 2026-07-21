import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="p-4 bg-red-50 dark:bg-red-950/60 text-red-600 rounded-3xl mb-4 shadow-lg shadow-red-600/10">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">403 - Access Denied</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        Your current user role does not possess permissions to view or edit this protected resource.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={ArrowLeft}>
          Back to Safety
        </Button>
      </Link>
    </div>
  );
};
