import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { programsAPI } from '../../api/programs';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const EditProgramModal = ({ program, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: program?.name || '',
    description: program?.description || '',
    schedule: program?.schedule || '',
    color: program?.color || '#3B82F6',
  });

  const updateMutation = useMutation({
    mutationFn: (data) => programsAPI.update(program.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['programs']);
      toast.success('Programa actualizado exitosamente');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al actualizar programa');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const colorOptions = [
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Morado', value: '#8B5CF6' },
    { name: 'Amarillo', value: '#F59E0B' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Índigo', value: '#6366F1' },
    { name: 'Lima', value: '#84CC16' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Programa"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre del programa */}
        <Input
          label="Nombre del Programa"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Ej: Noticiero Central"
          required
        />

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe el contenido del programa..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={3}
          />
        </div>

        {/* Horario */}
        <Input
          label="Horario"
          value={formData.schedule}
          onChange={(e) => handleChange('schedule', e.target.value)}
          placeholder="Ej: Lunes a Viernes 20:00"
        />

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color del Programa
          </label>
          <div className="grid grid-cols-3 gap-3">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange('color', option.value)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  formData.color === option.value
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: option.value }}
                />
                <span className="text-sm font-medium">{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Vista previa */}
        <div className="p-4 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
          <div
            className="px-6 py-3 rounded-lg text-white font-semibold inline-block"
            style={{ backgroundColor: formData.color }}
          >
            {formData.name || 'Nombre del Programa'}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={updateMutation.isPending}
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProgramModal;