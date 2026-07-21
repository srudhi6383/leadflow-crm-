import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Contact,
  BarChart3,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ isCollapsed, onToggle, mobileOpen, onMobileClose }) => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Companies', path: '/companies', icon: Building2 },
    { name: 'Contacts', path: '/contacts', icon: Contact },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white dark:bg-slate-800 border-r border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-xl text-white shadow-md shadow-primary-600/20 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              {(!isCollapsed || mobileOpen) && (
                <div className="flex flex-col">
                  <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                    LeadFlow <span className="text-primary-600">AI</span>
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                    SaaS CRM Suite
                  </span>
                </div>
              )}
            </div>

            {/* Collapse toggle desktop button */}
            <button
              onClick={onToggle}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => mobileOpen && onMobileClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-slate-100'
                    } ${isCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`
                  }
                  title={isCollapsed && !mobileOpen ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {(!isCollapsed || mobileOpen) && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile Pill */}
        {(!isCollapsed || mobileOpen) && user && (
          <div className="p-3 m-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={
                  user.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
                }
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-white dark:border-slate-700 shadow-sm shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {user.name}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                  {user.role}
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
              PRO
            </span>
          </div>
        )}
      </aside>
    </>
  );
};
