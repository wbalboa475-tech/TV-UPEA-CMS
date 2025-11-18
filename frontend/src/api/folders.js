import api from './axios';

export const foldersAPI = {
  // Crear carpeta
  create: async (data) => {
    const response = await api.post('/folders', data);
    return response.data;
  },

  // Obtener carpetas
  getAll: async (params) => {
    const response = await api.get('/folders', { params });
    return response.data;
  },

  // Obtener carpeta por ID
  getById: async (id) => {
    const response = await api.get(`/folders/${id}`);
    return response.data;
  },

  // Actualizar carpeta
  update: async (id, data) => {
    const response = await api.put(`/folders/${id}`, data);
    return response.data;
  },

  // Eliminar carpeta
  delete: async (id) => {
    const response = await api.delete(`/folders/${id}`);
    return response.data;
  },
};