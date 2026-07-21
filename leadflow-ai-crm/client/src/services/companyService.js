import api from './api';

export const companyService = {
  async getCompanies(params = {}) {
    const res = await api.get('/companies', { params });
    return res.data;
  },

  async getCompanyById(id) {
    const res = await api.get(`/companies/${id}`);
    return res.data;
  },

  async createCompany(data) {
    const res = await api.post('/companies', data);
    return res.data;
  },

  async updateCompany(id, data) {
    const res = await api.put(`/companies/${id}`, data);
    return res.data;
  },

  async deleteCompany(id) {
    const res = await api.delete(`/companies/${id}`);
    return res.data;
  },

  async exportCsv(params = {}) {
    const res = await api.get('/companies', {
      params: { ...params, exportCsv: 'true' },
      responseType: 'blob',
    });
    return res.data;
  },
};
