import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  Award,
  Target,
  Zap,
  ArrowUpRight,
  Building2,
  Users,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { analyticsService } from '../services/analyticsService';
import { formatCurrency } from '../utils/formatters';

export const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getAnalytics();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setError('Failed to fetch telemetry analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        <CardSkeleton count={4} />
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAnalytics} />;
  }

  const { revenueTrend, conversionFunnel, leadSourcesBreakdown, topCompanies, teamPerformance, kpis } = data || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Financial & Sales Analytics</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enterprise revenue growth forecasts, sales conversion funnels, and account performance
        </p>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Avg Deal Size</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(kpis?.avgDealSize || 0)}
            </span>
            <span className="text-xs font-semibold text-emerald-600">+8.5%</span>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Pipeline Win Rate</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {kpis?.winRate || 0}%
            </span>
            <span className="text-xs font-semibold text-emerald-600">+3.2%</span>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Sales Cycle Length</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {kpis?.salesCycleDays || 0} Days
            </span>
            <span className="text-xs font-semibold text-emerald-600">-2.4 days</span>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">MRR YoY Growth</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {kpis?.mrrGrowth || '+18.4%'}
            </span>
            <span className="text-xs font-semibold text-emerald-600">On Track</span>
          </div>
        </Card>
      </div>

      {/* Row 1 Charts: Revenue Trend & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Quarterly Revenue Trend vs Targets</CardTitle>
              <p className="text-xs text-slate-500">Gross closed value per month ($)</p>
            </div>
            <Badge variant="success">Q3 Revenue Target Met</Badge>
          </CardHeader>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" name="Closed Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Sales Conversion Funnel</CardTitle>
              <p className="text-xs text-slate-500">Stage-by-stage deal progression percentages</p>
            </div>
          </CardHeader>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionFunnel || []} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Bar dataKey="count" name="Opportunities Count" radius={[0, 6, 6, 0]}>
                  {(conversionFunnel || []).map((entry, index) => (
                    <Cell key={`funnel-${index}`} fill={entry.fill || '#4F46E5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Top Enterprise Accounts & Sales Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Companies */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <CardTitle>Top Value Enterprise Accounts</CardTitle>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/60 text-slate-400 font-semibold uppercase">
                  <th className="pb-3 px-2">Account Name</th>
                  <th className="pb-3 px-2">Industry</th>
                  <th className="pb-3 px-2">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(topCompanies || []).map((comp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-2 font-semibold text-slate-800 dark:text-slate-200">
                      {comp.name}
                    </td>
                    <td className="py-3 px-2 text-slate-500 dark:text-slate-400">{comp.industry}</td>
                    <td className="py-3 px-2 font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(comp.totalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Team Leaderboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <CardTitle>Sales Executive Quota Leaderboard</CardTitle>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/60 text-slate-400 font-semibold uppercase">
                  <th className="pb-3 px-2">Sales Rep</th>
                  <th className="pb-3 px-2">Deals Closed</th>
                  <th className="pb-3 px-2">Revenue Won</th>
                  <th className="pb-3 px-2">Quota %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(teamPerformance || []).map((rep, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-2 font-semibold text-slate-800 dark:text-slate-200">
                      {rep.name}
                    </td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{rep.dealsWon} deals</td>
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(rep.revenueWon)}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rep.quotaProgress >= 100
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {rep.quotaProgress}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
