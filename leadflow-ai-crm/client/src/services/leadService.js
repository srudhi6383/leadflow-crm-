import api from './api';

export const leadService = {
  async getLeads(params = {}) {
    const res = await api.get('/leads', { params });
    return res.data;
  },

  async getLeadById(id) {
    const res = await api.get(`/leads/${id}`);
    return res.data;
  },

  async createLead(data) {
    const res = await api.post('/leads', data);
    return res.data;
  },

  async updateLead(id, data) {
    const res = await api.put(`/leads/${id}`, data);
    return res.data;
  },

  async addNote(id, text) {
    const res = await api.post(`/leads/${id}/notes`, { text });
    return res.data;
  },

  async deleteLead(id) {
    const res = await api.delete(`/leads/${id}`);
    return res.data;
  },

  async exportCsv(params = {}) {
    const res = await api.get('/leads', {
      params: { ...params, exportCsv: 'true' },
      responseType: 'blob',
    });
    return res.data;
  },
};
