import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foldersAPI } from '../api/folders';
import { FolderPlus, Folder as FolderIcon, ChevronRight, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import FolderCard from '../components/folders/FolderCard';

const Folders = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentParentId, setCurrentParentId] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'Inicio' }]);
  const [newFolder, setNewFolder] = useState({
    name: '',
    description: '',
    program: '',
    color: '#3B82F6',
  });

  // Obtener carpetas
  const { data, isLoading } = useQuery({
    queryKey: ['folders', currentParentId],
    queryFn: () => foldersAPI.getAll({ parentId: currentParentId || 'root' }),
  });

  // Crear carpeta
  const createMutation = useMutation({
    mutationFn: foldersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['folders']);
      toast.success('Carpeta creada exitosamente');
      setShowCreateModal(false);
      setNewFolder({ name: '', description: '', program: '', color: '#3B82F6' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear carpeta');
    },
  });

  const handleCreateFolder = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...newFolder,
      parentId: currentParentId,
    });
  };

  const handleFolderClick = (folder) => {
    setCurrentParentId(folder.id);
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentParentId(newBreadcrumbs[newBreadcrumbs.length - 1].id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" text="Cargando carpetas..." />
      </div>
    );
  }

  const folders = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carpetas</h1>
          <p className="text-gray-600 mt-1">
            {folders.length} carpeta{folders.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Button
          variant="primary"
          icon={<FolderPlus size={20} />}
          onClick={() => setShowCreateModal(true)}
        >
          Nueva Carpeta
        </Button>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.id}>
            {index > 0 && <ChevronRight size={16} className="text-gray-400" />}
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className={`flex items-center gap-2 hover:text-primary-600 ${
                index === breadcrumbs.length - 1 ? 'text-primary-600 font-semibold' : ''
              }`}
            >
              {index === 0 && <Home size={16} />}
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Folders Grid */}
      {folders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <FolderIcon size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay carpetas aún
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza creando tu primera carpeta
          </p>
          <Button
            variant="primary"
            icon={<FolderPlus size={20} />}
            onClick={() => setShowCreateModal(true)}
          >
            Nueva Carpeta
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={() => handleFolderClick(folder)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nueva Carpeta"
      >
        <form onSubmit={handleCreateFolder} className="space-y-4">
          <Input
            label="Nombre de la Carpeta"
            value={newFolder.name}
            onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
            placeholder="Ej: Noticias 2024"
            required
          />

          <Input
            label="Programa (Opcional)"
            value={newFolder.program}
            onChange={(e) => setNewFolder({ ...newFolder, program: e.target.value })}
            placeholder="Ej: Noticiero Central"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (Opcional)
            </label>
            <textarea
              value={newFolder.description}
              onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
              placeholder="Describe el contenido de esta carpeta..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewFolder({ ...newFolder, color })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    newFolder.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createMutation.isPending}
            >
              Crear Carpeta
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Folders;