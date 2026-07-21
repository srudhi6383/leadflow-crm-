const { sendSuccess } = require('../utils/apiResponse');

// @desc    Get detailed CRM Analytics and reporting metrics
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    return sendSuccess(res, 'Analytics data retrieved successfully', {
      revenueTrend: [
        { month: 'Jan', revenue: 42000, newDeals: 8, target: 40000 },
        { month: 'Feb', revenue: 58000, newDeals: 12, target: 45000 },
        { month: 'Mar', revenue: 64000, newDeals: 14, target: 50000 },
        { month: 'Apr', revenue: 89000, newDeals: 19, target: 60000 },
        { month: 'May', revenue: 95000, newDeals: 21, target: 70000 },
        { month: 'Jun', revenue: 118000, newDeals: 26, target: 80000 },
        { month: 'Jul', revenue: 142000, newDeals: 31, target: 95000 },
      ],
      conversionFunnel: [
        { stage: 'Total Leads', count: 120, percentage: 100, fill: '#4F46E5' },
        { stage: 'Contacted', count: 94, percentage: 78.3, fill: '#6366F1' },
        { stage: 'Qualified', count: 68, percentage: 56.6, fill: '#818CF8' },
        { stage: 'Proposal Sent', count: 42, percentage: 35.0, fill: '#A5B4FC' },
        { stage: 'Closed Won', count: 28, percentage: 23.3, fill: '#10B981' },
      ],
      leadSourcesBreakdown: [
        { source: 'Inbound Website', leads: 48, revenue: 185000, conversion: 28.5 },
        { source: 'Client Referral', leads: 32, revenue: 210000, conversion: 34.2 },
        { source: 'LinkedIn Outbound', leads: 26, revenue: 125000, conversion: 19.8 },
        { source: 'Cold Outreach', leads: 18, revenue: 78000, conversion: 12.4 },
        { source: 'Events & Webinars', leads: 12, revenue: 92000, conversion: 22.1 },
      ],
      topCompanies: [
        { name: 'Apex Financial Services', industry: 'Fintech', totalValue: 120000, deals: 2 },
        { name: 'Nexus Cloud Systems', industry: 'Cloud Infrastructure', totalValue: 95000, deals: 1 },
        { name: 'Acme Global Tech', industry: 'Enterprise Software', totalValue: 85000, deals: 2 },
        { name: 'Omni Retail Group', industry: 'E-commerce', totalValue: 62000, deals: 1 },
        { name: 'Starlight BioHealth', industry: 'Healthcare', totalValue: 45000, deals: 1 },
      ],
      teamPerformance: [
        { name: 'Sarah Chen', role: 'Senior Enterprise AE', dealsWon: 14, revenueWon: 345000, quotaProgress: 115 },
        { name: 'Marcus Vance', role: 'Account Executive', dealsWon: 9, revenueWon: 210000, quotaProgress: 92 },
        { name: 'Alex Morgan', role: 'VP of Global Sales', dealsWon: 5, revenueWon: 185000, quotaProgress: 108 },
      ],
      kpis: {
        avgDealSize: 48500,
        winRate: 23.3,
        salesCycleDays: 18.5,
        mrrGrowth: '+18.4%',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };
