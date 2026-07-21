import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Zap, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

export const Login = () => {
  const { login, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'admin@leadflow.ai',
      password: 'password123',
    },
  });

  const onSubmit = async (data) => {
    const res = await login(data.email, data.password);
    if (res.success) {
      toast.success(`Welcome back, ${res.user.name}!`);
      navigate('/dashboard');
    } else {
      toast.error(res.message || 'Invalid credentials');
    }
  };

  const fillDemoAdmin = () => {
    setValue('email', 'admin@leadflow.ai');
    setValue('password', 'password123');
  };

  const fillDemoSales = () => {
    setValue('email', 'sarah.chen@leadflow.ai');
    setValue('password', 'password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary-600 rounded-2xl text-white shadow-lg shadow-primary-600/30 mb-2">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            LeadFlow <span className="text-primary-600">AI</span> CRM
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enterprise Sales Intelligence & Deal Pipeline Suite
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="admin@leadflow.ai"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
            })}
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              Remember Me
            </label>
            <a href="#forgot" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              Forgot Password?
            </a>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full py-3">
            Sign In to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> One-Click Demo Access:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              Demo Admin User
            </button>
            <button
              type="button"
              onClick={fillDemoSales}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              Demo Sales AE
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an enterprise account?{' '}
          <Link to="/register" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
            Register Workspace
          </Link>
        </p>
      </div>
    </div>
  );
};
