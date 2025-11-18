import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { filesAPI } from '../api/files';
import { programsAPI } from '../api/programs';
import { 
  FolderOpen, 
  Download, 
  Grid, 
  List,
  Filter,
  Search as SearchIcon,
  Calendar,
  HardDrive
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import FileCard from '../components/files/FileCard';
import FileList from '../components/files/FileList';
import { useFileStore } from '../store/fileStore';

const Library = () => {
  const { viewMode, setViewMode } = useFileStore();
  const [filters, setFilters] = useState({
    programId: '',
    type: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Obtener programas
  const { data: programsData } = useQuery({
    queryKey: ['programs'],
    queryFn: programsAPI.getAll,
  });

  // Obtener archivos con filtros
  const { data: filesData, isLoading, refetch } = useQuery({
    queryKey: ['library-files', filters],
    queryFn: () => filesAPI.getAll(filters),
  });

  const programs = programsData?.data || [];
  const files = filesData?.data?.files || [];
  const totalFiles = files.length;

  // Calcular tamaño total
  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);
  const totalSizeGB = (totalSize / (2)).toFixed(2);

  // Contar por tipo
  const videoCount = files.filter(f => f.mimeType?.startsWith('video/')).length;
  const imageCount = files.filter(f => f.mimeType?.startsWith('image/')).length;
  const documentCount = files.filter(f => f.mimeType?.includes('pdf') || f.mimeType?.includes('document')).length;

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      programId: '',
      type: '',
      search: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const getProgramColor = (programId) => {
    const program = programs.find(p => p.id === programId);
    return program?.color || '#3B82F6';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" text="Cargando biblioteca..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FolderOpen size={28} />
          Biblioteca de Contenido
        </h1>
        <p className="text-gray-600 mt-1">
          Todo el material multimedia disponible
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Archivos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalFiles}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderOpen size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Videos</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{videoCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Imágenes</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{imageCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Almacenamiento</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{totalSizeGB} GB</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <HardDrive size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <Input
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Buscar archivos..."
              icon={<SearchIcon size={20} className="text-gray-400" />}
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            icon={<Filter size={20} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>
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
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Programa
              </label>
              <select
                value={filters.programId}
                onChange={(e) => handleFilterChange('programId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todos los programas</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Archivo
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todos los tipos</option>
                <option value="video">Videos</option>
                <option value="image">Imágenes</option>
                <option value="document">Documentos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Desde
              </label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Hasta
              </label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>

            <div className="md:col-span-4 flex justify-end">
              <Button
                variant="ghost"
                onClick={clearFilters}
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Files Grid/List */}
      {files.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FolderOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron archivos
          </h3>
          <p className="text-gray-600">
            {filters.search || filters.programId || filters.type
              ? 'Intenta ajustar los filtros'
              : 'Comienza subiendo contenido en la sección Programas'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <FileCard 
              key={file.id} 
              file={file} 
              programColor={getProgramColor(file.programId)}
              showDownload={true}
            />
          ))}
        </div>
      ) : (
        <FileList files={files} showDownload={true} />
      )}

      {/* Download All Button */}
      {files.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            icon={<Download size={20} />}
            onClick={() => {
              // Implementar descarga múltiple si es necesario
              alert('Función de descarga múltiple - Próximamente');
            }}
          >
            Descargar Seleccionados
          </Button>
        </div>
      )}
    </div>
  );
};

export default Library;