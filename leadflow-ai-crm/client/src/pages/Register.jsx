import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Zap, Mail, Lock, User, Briefcase, Phone, ArrowRight } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

export const Register = () => {
  const { register: registerAuth, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'Sales',
    },
  });

  const onSubmit = async (data) => {
    const res = await registerAuth(data);
    if (res.success) {
      toast.success('Registration successful! Welcome to LeadFlow AI.');
      navigate('/dashboard');
    } else {
      toast.error(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 my-8">
      <div className="w-full max-w-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary-600 rounded-2xl text-white shadow-lg shadow-primary-600/30 mb-2">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create your CRM Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join LeadFlow AI to streamline sales pipelines & close deals faster
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            icon={User}
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name', { required: 'Full name is required' })}
          />

          <Input
            label="Work Email Address"
            type="email"
            icon={Mail}
            placeholder="john@company.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' },
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Title"
              icon={Briefcase}
              placeholder="Senior Account Executive"
              {...register('title')}
            />

            <Input
              label="Phone Number"
              icon={Phone}
              placeholder="+1 (555) 000-0000"
              {...register('phone')}
            />
          </div>

          <Select
            label="System Role"
            options={[
              { value: 'Sales', label: 'Sales Representative / AE' },
              { value: 'Admin', label: 'Workspace Administrator' },
              { value: 'User', label: 'Standard Team Member' },
            ]}
            {...register('role')}
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters required' },
            })}
          />

          <Button type="submit" variant="primary" loading={loading} className="w-full py-3">
            Get Started Now <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
