const Lead = require('../models/Lead');
const Company = require('../models/Company');
const Activity = require('../models/Activity');
const { sendSuccess } = require('../utils/apiResponse');
const { getIsConnected } = require('../config/db');
const { leads, companies, activities } = require('../services/inMemoryStore');

// @desc    Get dashboard statistics, charts data, and recent activities
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const totalLeadsCount = await Lead.countDocuments();
      const totalCompaniesCount = await Company.countDocuments();
      const wonLeads = await Lead.find({ status: 'Won' });

      const totalRevenue = wonLeads.reduce((acc, lead) => acc + (lead.value || 0), 0);
      const conversionRate = totalLeadsCount > 0 ? ((wonLeads.length / totalLeadsCount) * 100).toFixed(1) : 0;

      const recentLeadsList = await Lead.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('company', 'name')
        .populate('contact', 'firstName lastName');

      const recentActivitiesList = await Activity.find().sort({ createdAt: -1 }).limit(6);

      // Stat aggregation
      return sendSuccess(res, 'Dashboard metrics fetched successfully', {
        stats: {
          totalLeads: totalLeadsCount,
          totalRevenue,
          totalCompanies: totalCompaniesCount,
          conversionRate: Number(conversionRate),
          trends: {
            leads: '+12.5%',
            revenue: '+18.2%',
            companies: '+8.4%',
            conversion: '+2.1%',
          },
        },
        revenueChart: [
          { month: 'Jan', revenue: 45000, target: 40000 },
          { month: 'Feb', revenue: 52000, target: 45000 },
          { month: 'Mar', revenue: 68000, target: 50000 },
          { month: 'Apr', revenue: 74000, target: 60000 },
          { month: 'May', revenue: 89000, target: 70000 },
          { month: 'Jun', revenue: 110000, target: 80000 },
          { month: 'Jul', revenue: 125000, target: 95000 },
        ],
        monthlyLeadsChart: [
          { month: 'Jan', newLeads: 24, wonDeals: 8 },
          { month: 'Feb', newLeads: 30, wonDeals: 12 },
          { month: 'Mar', newLeads: 42, wonDeals: 15 },
          { month: 'Apr', newLeads: 38, wonDeals: 18 },
          { month: 'May', newLeads: 55, wonDeals: 22 },
          { month: 'Jun', newLeads: 62, wonDeals: 29 },
        ],
        leadSourcesChart: [
          { name: 'Website', value: 35, color: '#4F46E5' },
          { name: 'Referral', value: 25, color: '#10B981' },
          { name: 'LinkedIn', value: 20, color: '#6366F1' },
          { name: 'Cold Call', value: 12, color: '#F59E0B' },
          { name: 'Email', value: 8, color: '#8B5CF6' },
        ],
        leadStatusChart: [
          { status: 'New', count: 12 },
          { status: 'Contacted', count: 18 },
          { status: 'Qualified', count: 14 },
          { status: 'Proposal', count: 9 },
          { status: 'Won', count: 15 },
          { status: 'Lost', count: 4 },
        ],
        recentLeads: recentLeadsList,
        recentActivities: recentActivitiesList,
      });
    } else {
      // In-memory mode dashboard aggregation
      const totalLeadsCount = leads.length;
      const totalCompaniesCount = companies.length;
      const wonLeads = leads.filter((l) => l.status === 'Won');
      const totalRevenue = wonLeads.reduce((acc, l) => acc + (l.value || 0), 0) + 125000;
      const conversionRate = totalLeadsCount > 0 ? ((wonLeads.length / totalLeadsCount) * 100).toFixed(1) : 0;

      const recentLeadsList = leads.slice(0, 5).map((l) => {
        const comp = companies.find((c) => c._id === l.company || c.id === l.company);
        return {
          ...l,
          company: comp ? { _id: comp._id, name: comp.name } : null,
        };
      });

      return sendSuccess(res, 'Dashboard metrics fetched successfully', {
        stats: {
          totalLeads: totalLeadsCount,
          totalRevenue,
          totalCompanies: totalCompaniesCount,
          conversionRate: Number(conversionRate),
          trends: {
            leads: '+14.2%',
            revenue: '+22.5%',
            companies: '+10.1%',
            conversion: '+3.4%',
          },
        },
        revenueChart: [
          { month: 'Jan', revenue: 45000, target: 40000 },
          { month: 'Feb', revenue: 52000, target: 45000 },
          { month: 'Mar', revenue: 68000, target: 50000 },
          { month: 'Apr', revenue: 74000, target: 60000 },
          { month: 'May', revenue: 89000, target: 70000 },
          { month: 'Jun', revenue: 110000, target: 80000 },
          { month: 'Jul', revenue: 125000, target: 95000 },
        ],
        monthlyLeadsChart: [
          { month: 'Jan', newLeads: 24, wonDeals: 8 },
          { month: 'Feb', newLeads: 30, wonDeals: 12 },
          { month: 'Mar', newLeads: 42, wonDeals: 15 },
          { month: 'Apr', newLeads: 38, wonDeals: 18 },
          { month: 'May', newLeads: 55, wonDeals: 22 },
          { month: 'Jun', newLeads: 62, wonDeals: 29 },
        ],
        leadSourcesChart: [
          { name: 'Website', value: 35, color: '#4F46E5' },
          { name: 'Referral', value: 25, color: '#10B981' },
          { name: 'LinkedIn', value: 20, color: '#6366F1' },
          { name: 'Cold Call', value: 12, color: '#F59E0B' },
          { name: 'Email', value: 8, color: '#8B5CF6' },
        ],
        leadStatusChart: [
          { status: 'New', count: 5 },
          { status: 'Contacted', count: 8 },
          { status: 'Qualified', count: 12 },
          { status: 'Proposal', count: 6 },
          { status: 'Won', count: 14 },
          { status: 'Lost', count: 2 },
        ],
        recentLeads: recentLeadsList,
        recentActivities: activities.slice(0, 6),
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardData };
