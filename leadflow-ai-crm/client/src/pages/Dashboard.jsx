import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  DollarSign,
  Building2,
  TrendingUp,
  ArrowUpRight,
  Plus,
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  Activity as ActivityIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { dashboardService } from '../services/dashboardService';
import { formatCurrency, getStatusBadgeStyle } from '../utils/formatters';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getDashboardData();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setError('Could not load dashboard telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        <CardSkeleton count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const { stats, revenueChart, monthlyLeadsChart, leadSourcesChart, leadStatusChart, recentLeads, recentActivities } =
    data || {};

  const statCards = [
    {
      title: 'Total Pipeline Leads',
      value: stats?.totalLeads || 0,
      trend: stats?.trends?.leads || '+12.5%',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    },
    {
      title: 'Closed Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      trend: stats?.trends?.revenue || '+18.2%',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
    {
      title: 'Target Accounts',
      value: stats?.totalCompanies || 0,
      trend: stats?.trends?.companies || '+8.4%',
      icon: Building2,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    },
    {
      title: 'Deal Conversion Rate',
      value: `${stats?.conversionRate || 0}%`,
      trend: stats?.trends?.conversion || '+2.1%',
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    },
  ];

  const upcomingTasks = [
    { id: 1, text: 'Product demo call with Acme Corp CTO', time: 'Today, 2:30 PM', completed: false },
    { id: 2, text: 'Send updated enterprise proposal to Apex Financial', time: 'Tomorrow, 10:00 AM', completed: false },
    { id: 3, text: 'Follow up on Starlight Bio onboarding SLA', time: 'Jul 24, 4:00 PM', completed: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time telemetry, revenue velocity, and sales pipeline analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" icon={Plus} onClick={() => navigate('/leads')}>
            Add New Lead
          </Button>
          <Button variant="secondary" icon={BarChart2} onClick={() => navigate('/analytics')}>
            Analytics
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} hover className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {card.trend} <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1: Revenue Trend & Monthly Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Revenue Velocity & Forecast</CardTitle>
              <p className="text-xs text-slate-500">Monthly closed revenue vs target quotas</p>
            </div>
            <Badge variant="primary">2026 Q3</Badge>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Lead Generation & Conversions</CardTitle>
              <p className="text-xs text-slate-500">New leads vs Won deals monthly volume</p>
            </div>
            <Badge variant="success">High Growth</Badge>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyLeadsChart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="newLeads" fill="#6366F1" radius={[6, 6, 0, 0]} name="New Leads" />
                <Bar dataKey="wonDeals" fill="#10B981" radius={[6, 6, 0, 0]} name="Won Deals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2: Lead Sources & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div>
              <CardTitle>Lead Acquisition Sources</CardTitle>
              <p className="text-xs text-slate-500">Channel distribution percentage</p>
            </div>
          </CardHeader>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSourcesChart || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(leadSourcesChart || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#4F46E5'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Pipeline Leads */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Active High-Value Opportunities</CardTitle>
              <p className="text-xs text-slate-500">Latest pipeline leads requiring sales team focus</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>
              View All
            </Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/60 text-slate-400 font-semibold uppercase">
                  <th className="pb-3 px-2">Opportunity</th>
                  <th className="pb-3 px-2">Account</th>
                  <th className="pb-3 px-2">Est. Value</th>
                  <th className="pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(recentLeads || []).map((lead) => (
                  <tr key={lead._id || lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-2 font-semibold text-slate-800 dark:text-slate-200">
                      {lead.title}
                    </td>
                    <td className="py-3 px-2 text-slate-500 dark:text-slate-400">
                      {lead.company?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-2 font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(lead.value)}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeStyle(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Row 3: Audit Stream & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-primary-600" />
              <CardTitle>Real-Time Activity Audit Log</CardTitle>
            </div>
          </CardHeader>
          <div className="space-y-4">
            {(recentActivities || []).map((act, i) => (
              <div key={act._id || act.id || i} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-primary-600 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{act.userName}: </span>
                  <span className="text-slate-600 dark:text-slate-400">{act.description}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <CardTitle>Upcoming Tasks</CardTitle>
            </div>
          </CardHeader>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${task.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                <div className="flex-1 text-xs">
                  <p className={`font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {task.text}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">{task.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
