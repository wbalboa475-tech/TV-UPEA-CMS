import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { filesAPI } from '../api/files';
import { Grid, List, FolderOpen, Upload as UploadIcon } from 'lucide-react';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import FileCard from '../components/files/FileCard';
import FileList from '../components/files/FileList';
import { useFileStore } from '../store/fileStore';
import { useNavigate } from 'react-router-dom';

const Files = () => {
  const navigate = useNavigate();
  const { viewMode, setViewMode } = useFileStore();
  const [currentFolder, setCurrentFolder] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['files', currentFolder],
    queryFn: () => {
      const params = {};
      if (currentFolder) {
        params.folderId = currentFolder;
      }
      return filesAPI.getAll(params);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" text="Cargando archivos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error al cargar los archivos</p>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  const files = data?.data?.files || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Archivos</h1>
          <p className="text-gray-600 mt-1">
            {files.length} archivo{files.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List size={20} />
            </button>
          </div>

          {/* Actions */}
          <Button
            variant="secondary"
            icon={<FolderOpen size={20} />}
            onClick={() => navigate('/folders')}
          >
            Carpetas
          </Button>
          <Button
            variant="primary"
            icon={<UploadIcon size={20} />}
            onClick={() => navigate('/upload')}
          >
            Subir Archivo
          </Button>
        </div>
      </div>

      {/* Files display */}
      {files.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <FolderOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay archivos aún
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza subiendo tu primer archivo
          </p>
          <Button
            variant="primary"
            icon={<UploadIcon size={20} />}
            onClick={() => navigate('/upload')}
          >
            Subir Archivo
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <FileCard key={file.id} file={file} showDownload={true} />
          ))}
        </div>
      ) : (
        <FileList files={files} showDownload={true} />
      )}
    </div>
  );
};

export default Files;