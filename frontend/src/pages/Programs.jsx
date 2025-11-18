import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { programsAPI } from '../api/programs';
import { filesAPI } from '../api/files';
import { Tv, Upload as UploadIcon, Download, Grid, List, Eye, Settings, Edit2 } from 'lucide-react';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import FileCard from '../components/files/FileCard';
import FileList from '../components/files/FileList';
import EditProgramModal from '../components/programs/EditProgramModal'; 
import { useNavigate } from 'react-router-dom';
import { useFileStore } from '../store/fileStore';
import { useAuthStore } from '../store/authStore'; 

const Programs = () => {
  const navigate = useNavigate();
  const { viewMode, setViewMode } = useFileStore();
  const user = useAuthStore((state) => state.user);
  const [activeProgram, setActiveProgram] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null); // AGREGAR
  const [showEditModal, setShowEditModal] = useState(false); 

  // Obtener programas
  const { data: programsData, isLoading: loadingPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: programsAPI.getAll,
  });

  // Obtener archivos del programa activo
  const { data: filesData, isLoading: loadingFiles, refetch } = useQuery({
    queryKey: ['program-files', activeProgram],
    queryFn: () => filesAPI.getAll({ programId: activeProgram }),
    enabled: !!activeProgram,
  });

  const programs = programsData?.data || [];
  const files = filesData?.data?.files || [];

  // Seleccionar el primer programa por defecto
  React.useEffect(() => {
    if (programs.length > 0 && !activeProgram) {
      setActiveProgram(programs[0].id);
    }
  }, [programs, activeProgram]);

  if (loadingPrograms) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" text="Cargando programas..." />
      </div>
    );
  }

  const currentProgram = programs.find(p => p.id === activeProgram);

   const handleEditProgram = (program) => {
    setEditingProgram(program);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProgram(null);
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tv size={28} />
            Programas de TV
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona el contenido multimedia de cada programa
          </p>
        </div>
        
        {/* AGREGAR botón de editar programa si es admin */}
        {isAdmin && currentProgram && (
          <Button
            variant="secondary"
            icon={<Edit2 size={20} />}
            onClick={() => handleEditProgram(currentProgram)}
          >
            Editar Programa
          </Button>
        )}
    </div>  

      {/* Tabs de Programas */}
      <div className="bg-white rounded-xl border border-gray-200 p-2">
        <div className="flex gap-2 overflow-x-auto custom-scrollbar">
          {programs.map((program) => (
            <button
              key={program.id}
              onClick={() => setActiveProgram(program.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all ${
                activeProgram === program.id
                  ? 'text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: activeProgram === program.id ? program.color : 'transparent',
              }}
            >
              <div className="flex items-center gap-2">
                <span>{program.name}</span>
                {program.filesCount > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeProgram === program.id 
                      ? 'bg-white bg-opacity-30' 
                      : 'bg-gray-200'
                  }`}>
                    {program.filesCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del Programa */}
       {currentProgram && (
        <div className="space-y-4">
          {/* Info del programa */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentProgram.name}
                  </h2>
                  {/* AGREGAR botón de edición inline */}
                  {isAdmin && (
                    <button
                      onClick={() => handleEditProgram(currentProgram)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar programa"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                </div>
                {currentProgram.description && (
                  <p className="text-gray-600 mb-3">{currentProgram.description}</p>
                )}
                {currentProgram.schedule && (
                  <p className="text-sm text-gray-500">
                    📅 {currentProgram.schedule}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* View mode toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${
                      viewMode === 'grid'
                        ? 'bg-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Vista en cuadrícula"
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
                    title="Vista en lista"
                  >
                    <List size={20} />
                  </button>
                </div>

                <Button
                  variant="primary"
                  icon={<UploadIcon size={20} />}
                  onClick={() => navigate(`/upload?programId=${currentProgram.id}`)}
                >
                  Subir Contenido
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: currentProgram.color }}>
                  {files.length}
                </p>
                <p className="text-sm text-gray-600">Archivos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: currentProgram.color }}>
                  {files.filter(f => f.mimeType?.startsWith('video/')).length}
                </p>
                <p className="text-sm text-gray-600">Videos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: currentProgram.color }}>
                  {files.filter(f => f.mimeType?.startsWith('image/')).length}
                </p>
                <p className="text-sm text-gray-600">Imágenes</p>
              </div>
            </div>
          </div>

          {/* Archivos con miniaturas */}
          {loadingFiles ? (
            <div className="flex items-center justify-center py-12">
              <Loader size="md" text="Cargando archivos..." />
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <UploadIcon size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay contenido aún
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza subiendo videos e imágenes para este programa
              </p>
              <Button
                variant="primary"
                icon={<UploadIcon size={20} />}
                onClick={() => navigate(`/upload?programId=${currentProgram.id}`)}
              >
                Subir Contenido
              </Button>
            </div>
          ) : (
            <>
              {/* Encabezado de archivos */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Archivos ({files.length})
                </h3>
                <Button
                  variant="ghost"
                  icon={<Eye size={18} />}
                  onClick={() => navigate('/library')}
                >
                  Ver todos en biblioteca
                </Button>
              </div>

              {/* Grid de archivos con miniaturas */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <FileCard 
                      key={file.id} 
                      file={file} 
                      programColor={currentProgram.color}
                      showDownload={true}
                    />
                  ))}
                </div>
              ) : (
                <FileList files={files} showDownload={true} />
              )}
            </>
          )}
        </div>
        )}
            {editingProgram && (
        <EditProgramModal
          program={editingProgram}
          isOpen={showEditModal}
          onClose={closeEditModal}
        />
        )}
    </div>
  );
};

export default Programs;