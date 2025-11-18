import api from './axios';

export const programsAPI = {
  getAll: async () => {
    const response = await api.get('/programs');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/programs/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/programs', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/programs/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/programs/${id}`);
    return response.data;
  },
};