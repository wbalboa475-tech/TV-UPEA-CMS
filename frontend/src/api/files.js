import api from './axios';

export const filesAPI = {
  // Subir archivo
  upload: async (formData, onUploadProgress) => {
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  // Obtener archivos
  getAll: async (params) => {
    const response = await api.get('/files', { params });
    return response.data;
  },

  // Obtener archivo por ID
  getById: async (id) => {
    const response = await api.get(`/files/${id}`);
    return response.data;
  },

  // Actualizar archivo
  update: async (id, data) => {
    const response = await api.put(`/files/${id}`, data);
    return response.data;
  },

  // Eliminar archivo
  delete: async (id) => {
    const response = await api.delete(`/files/${id}`);
    return response.data;
  },

  // Descargar archivo
  download: async (id) => {
    const response = await api.get(`/files/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};