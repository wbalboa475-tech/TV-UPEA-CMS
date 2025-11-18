import React, { useState } from 'react';
import { 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Music, 
  File,
  Download,
  Trash2,
  MoreVertical,
  Eye
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { filesAPI } from '../../api/files';
import { formatFileSize, formatDuration, getFileType } from '../../utils/helpers';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

const FileCard = ({ file, programColor, showDownload = true }) => {
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);
  const fileType = getFileType(file.mimeType);

  const getIcon = () => {
    switch (fileType) {
      case 'video':
        return <Video size={32} className="text-purple-600" />;
      case 'image':
        return <ImageIcon size={32} className="text-blue-600" />;
      case 'audio':
        return <Music size={32} className="text-orange-600" />;
      case 'document':
        return <FileText size={32} className="text-red-600" />;
      default:
        return <File size={32} className="text-gray-600" />;
    }
  };

  // Descargar archivo
  const downloadMutation = useMutation({
    mutationFn: async () => {
      const blob = await filesAPI.download(file.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast.success('Descarga iniciada');
    },
    onError: (error) => {
      toast.error('Error al descargar el archivo');
    },
  });

  // Eliminar archivo
  const deleteMutation = useMutation({
    mutationFn: () => filesAPI.delete(file.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
      toast.success('Archivo eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al eliminar archivo');
    },
  });

  const handleDownload = (e) => {
    e.stopPropagation();
    downloadMutation.mutate();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar este archivo?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow group">
      {/* Thumbnail o preview */}
      <div className="relative h-48 bg-gray-100 rounded-t-xl flex items-center justify-center overflow-hidden">
          {/* Mostrar imágenes */}
  {file.mimeType?.startsWith("image/") ? (
    <img
      src={file.url || file.thumbnailUrl || file.path}
      alt={file.originalName}
      className="w-full h-full object-cover"
    />
  ) : null}

  {/* Mostrar videos */}
  {file.mimeType?.startsWith("video/") ? (
    <video
      src={file.url || file.thumbnailUrl || file.path}
      className="w-full h-full object-cover"
      muted
    />
  ) : null}

  {/* Si no es imagen ni video → icono */}
  {!file.mimeType?.startsWith("image/") &&
   !file.mimeType?.startsWith("video/") && (
    <div>{getIcon()}</div>
  )}
        
        {/* Overlay con acciones */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
        {showDownload && (
          <button 
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
            className="p-3 bg-white rounded-lg hover:bg-gray-100 disabled:opacity-50"
            title="Descargar para vMix"
          >
            <Download size={20} className="text-gray-700" />
          </button>
        )}
          <button 
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="p-3 bg-white rounded-lg hover:bg-red-50 disabled:opacity-50"
          title="Eliminar"
        >
          <Trash2 size={20} className="text-red-600" />
          </button>
          </div>

        {/* Badge de duración para videos */}
        {fileType === 'video' && file.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(file.duration)}
          </div>
        )}

        {/* Badge de resolución */}
        {file.resolution && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {file.resolution}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 truncate flex-1 text-sm">
            {file.originalName}
          </h3>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            <MoreVertical size={16} />
          </button>
        </div>

        <div className="space-y-1 text-xs text-gray-600">
          <p className="font-medium">{formatFileSize(file.size)}</p>
          {file.codec && <p className="text-gray-500">Codec: {file.codec}</p>}
          <p className="text-gray-500">
            {format(new Date(file.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
          </p>
        </div>

        {/* Uploader */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ backgroundColor: programColor || '#3B82F6' }}
            >
              {file.uploader?.name?.charAt(0)}
            </div>
            <span className="text-xs text-gray-600">{file.uploader?.name}</span>
          </div>
          
          {/* Indicador de descarga */}
          {downloadMutation.isPending && (
            <div className="text-xs text-primary-600 font-medium">
              Descargando...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileCard;