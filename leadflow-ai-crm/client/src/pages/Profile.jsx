import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Award,
  Lock,
  Shield,
  Edit,
  UserCheck,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { authService } from '../services/authService';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      title: user?.title || '',
      phone: user?.phone || '',
    },
  });

  const {
    register: regPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors },
  } = useForm();

  const onUpdateProfile = async (data) => {
    setLoading(true);
    try {
      await authService.updateProfile(data);
      updateUser(data);
      toast.success('Profile credentials updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setLoading(true);
    try {
      await authService.updateProfile({ password: data.newPassword });
      toast.success('Password updated successfully');
      resetPass();
    } catch (err) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Profile Overview', icon: UserCheck },
    { id: 'edit-profile', label: 'User Profile Details', icon: Edit },
    { id: 'security', label: 'Password & Security', icon: Lock },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner Card */}
      <Card className="relative overflow-hidden p-8">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600" />
        <div className="relative pt-12 flex flex-col sm:flex-row items-center sm:items-end gap-5">
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
            }
            alt={user?.name || 'User'}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-lg shrink-0"
          />
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || 'Alex Morgan'}</h2>
              <Badge variant="primary">{user?.role || 'Admin'}</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user?.title || 'VP of Global Sales'}</p>
          </div>
        </div>
      </Card>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary-600" /> Contact Details
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Email Address</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Phone Line</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.phone || '+1 (555) 019-2834'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Title & Role</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user?.title} ({user?.role})
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Performance Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Deals Won</span>
                <span className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200">18 Deals</span>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">Quota Rate</span>
                <span className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-200">112%</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: User Profile Details Form */}
      {activeTab === 'edit-profile' && (
        <Card className="max-w-2xl">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">Edit Profile Details</h3>
          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Alex Morgan"
              error={profileErrors.name?.message}
              {...regProfile('name', { required: 'Name is required' })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Job Designation"
                placeholder="VP of Global Sales"
                {...regProfile('title')}
              />

              <Input
                label="Phone Number"
                placeholder="+1 (555) 019-2834"
                {...regProfile('phone')}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" loading={loading}>
                Save Profile Updates
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 3: Password & Security Form */}
      {activeTab === 'security' && (
        <Card className="max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary-600" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Update Account Password</h3>
          </div>
          <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              error={passErrors.currentPassword?.message}
              {...regPass('currentPassword', { required: 'Current password is required' })}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              error={passErrors.newPassword?.message}
              {...regPass('newPassword', {
                required: 'New password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              })}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" loading={loading}>
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
