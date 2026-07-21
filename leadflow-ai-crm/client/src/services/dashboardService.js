import api from './api';

export const dashboardService = {
  async getDashboardData() {
    const res = await api.get('/dashboard');
    return res.data;
  },
};
