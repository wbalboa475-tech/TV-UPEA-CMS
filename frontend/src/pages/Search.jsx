import React, { useState } from 'react';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { filesAPI } from '../api/files';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import FileCard from '../components/files/FileCard';
import FileList from '../components/files/FileList';
import { useFileStore } from '../store/fileStore';

const Search = () => {
  const { viewMode } = useFileStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['search', searchTerm, filters],
    queryFn: () => filesAPI.getAll({ 
      search: searchTerm,
      type: filters.type,
    }),
    enabled: false,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      refetch();
    }
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const files = data?.data?.files || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Búsqueda Avanzada</h1>
        <p className="text-gray-600 mt-1">
          Encuentra archivos y carpetas rápidamente
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre de archivo..."
              icon={<SearchIcon size={20} className="text-gray-400" />}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
          >
            Buscar
          </Button>
          <Button
            type="button"
            variant="secondary"
            icon={<Filter size={20} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Archivo
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todos</option>
                <option value="video">Videos</option>
                <option value="image">Imágenes</option>
                <option value="document">Documentos</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Desde
              </label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Hasta
              </label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                icon={<X size={18} />}
                onClick={clearFilters}
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" text="Buscando..." />
        </div>
      ) : files.length > 0 ? (
        <div>
          <div className="mb-4">
            <p className="text-gray-600">
              Se encontraron <strong>{files.length}</strong> resultado{files.length !== 1 ? 's' : ''}
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {files.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <FileList files={files} />
          )}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <SearchIcon size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-600">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Search;