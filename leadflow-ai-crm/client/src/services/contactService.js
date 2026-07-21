import api from './api';

export const contactService = {
  async getContacts(params = {}) {
    const res = await api.get('/contacts', { params });
    return res.data;
  },

  async getContactById(id) {
    const res = await api.get(`/contacts/${id}`);
    return res.data;
  },

  async createContact(data) {
    const res = await api.post('/contacts', data);
    return res.data;
  },

  async updateContact(id, data) {
    const res = await api.put(`/contacts/${id}`, data);
    return res.data;
  },

  async deleteContact(id) {
    const res = await api.delete(`/contacts/${id}`);
    return res.data;
  },

  async exportCsv(params = {}) {
    const res = await api.get('/contacts', {
      params: { ...params, exportCsv: 'true' },
      responseType: 'blob',
    });
    return res.data;
  },
};
