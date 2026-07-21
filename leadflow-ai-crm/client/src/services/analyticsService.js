import api from './api';

export const analyticsService = {
  async getAnalytics() {
    const res = await api.get('/analytics');
    return res.data;
  },
};
