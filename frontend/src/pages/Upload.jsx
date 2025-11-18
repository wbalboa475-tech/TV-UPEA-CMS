import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload as UploadIcon, X, File, CheckCircle } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { filesAPI } from '../api/files';
import { programsAPI } from '../api/programs';
import Button from '../components/common/Button';
import { formatFileSize } from '../utils/helpers';

const Upload = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const programIdFromUrl = searchParams.get('programId');
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(programIdFromUrl || '');

  // Obtener programas
  const { data: programsData, isLoading: loadingPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: programsAPI.getAll,
  });

  const programs = programsData?.data || [];

  const uploadMutation = useMutation({
    mutationFn: async ({ file, index }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedProgram) {
        formData.append('programId', selectedProgram);
      }

      return filesAPI.upload(formData, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress((prev) => ({
          ...prev,
          [index]: percentCompleted,
        }));
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
      toast.success('Archivo subido exitosamente');
    },
    onError: (error) => {
      console.error('Error al subir:', error);
      toast.error(error.response?.data?.message || 'Error al subir archivo');
    },
  });

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadAll = async () => {
    if (!selectedProgram) {
      toast.error('Debes seleccionar un programa primero');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Debes seleccionar al menos un archivo');
      return;
    }
    
    for (let i = 0; i < selectedFiles.length; i++) {
      try {
        await uploadMutation.mutateAsync({
          file: selectedFiles[i],
          index: i,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    
    setTimeout(() => {
      navigate('/programs');
    }, 1000);
  };

  if (loadingPrograms) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando programas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subir Archivos</h1>
        <p className="text-gray-600 mt-1">
          Arrastra y suelta archivos o haz clic para seleccionar
        </p>
      </div>

      {/* Selector de Programa */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Programa *
        </label>
        <select
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          <option value="">Selecciona un programa...</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </div>

      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 bg-white'
        }`}
      >
        <UploadIcon
          size={64}
          className={`mx-auto mb-4 ${
            dragActive ? 'text-primary-600' : 'text-gray-400'
          }`}
        />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Arrastra archivos aquí
        </h3>
        <p className="text-gray-600 mb-4">
          o haz clic en el botón para seleccionar archivos
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input">
          <Button variant="primary" as="span">
            Seleccionar Archivos
          </Button>
        </label>
        <p className="text-xs text-gray-500 mt-4">
          Máximo 5GB por archivo • Videos, imágenes, documentos
        </p>
      </div>

      {/* Selected files */}
      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Archivos seleccionados ({selectedFiles.length})
            </h3>
            <Button
              variant="primary"
              onClick={handleUploadAll}
              disabled={uploadMutation.isPending || selectedFiles.length === 0 || !selectedProgram}
            >
              {uploadMutation.isPending ? 'Subiendo...' : 'Subir Todos'}
            </Button>
          </div>

          <div className="space-y-3">
            {selectedFiles.map((file, index) => {
              const progress = uploadProgress[index] || 0;
              const isComplete = progress === 100;

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {isComplete ? (
                      <CheckCircle size={24} className="text-green-600" />
                    ) : (
                      <File size={24} className="text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>

                    {/* Progress bar */}
                    {progress > 0 && (
                      <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary-600 h-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {!isComplete && !uploadMutation.isPending && (
                    <button
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-600"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;