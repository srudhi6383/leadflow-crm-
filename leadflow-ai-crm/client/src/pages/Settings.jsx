import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Bell,
  CheckCircle2,
  Palette,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { useTheme } from '../contexts/ThemeContext';

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');

  const tabs = [
    { id: 'appearance', label: 'Appearance & Theme', icon: Palette },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize CRM appearance theme and notification preferences
        </p>
      </div>

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

      {/* Tab 1: Appearance & Theme */}
      {activeTab === 'appearance' && (
        <Card className="max-w-3xl">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">Theme Preferences</h3>
          <p className="text-xs text-slate-500 mb-6">Choose your preferred CRM interface color theme</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Light Card */}
            <div
              onClick={() => setTheme('light')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                theme === 'light'
                  ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-xl text-amber-500 shadow-sm">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Light SaaS Mode</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Clean slate background</p>
                </div>
              </div>
              {theme === 'light' && <CheckCircle2 className="w-5 h-5 text-primary-600" />}
            </div>

            {/* Dark Card */}
            <div
              onClick={() => setTheme('dark')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                theme === 'dark'
                  ? 'border-primary-600 bg-slate-900 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-indigo-400 shadow-sm">
                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Dark Midnight Mode</h4>
                  <p className="text-xs text-slate-400">High contrast dark theme</p>
                </div>
              </div>
              {theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-primary-600" />}
            </div>
          </div>
        </Card>
      )}

      {/* Tab 2: Notification Preferences */}
      {activeTab === 'notifications' && (
        <Card className="max-w-2xl">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">Notification Channels</h3>
          <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Lead Assignment Alerts</span>
                <span className="text-slate-500">Receive email when a new lead opportunity is assigned to you</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-primary-600 w-4 h-4 cursor-pointer" />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Deal Status Changes</span>
                <span className="text-slate-500">Get notified when high-value deal status changes to Won</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-primary-600 w-4 h-4 cursor-pointer" />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Weekly Performance Summary</span>
                <span className="text-slate-500">Receive weekly pipeline telemetry email report</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-primary-600 w-4 h-4 cursor-pointer" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
