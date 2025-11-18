import React from 'react';
import { 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Music, 
  File,
  Download,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { filesAPI } from '../../api/files';
import { formatFileSize, getFileType } from '../../utils/helpers';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

const FileList = ({ files, showDownload = true }) => {
  const queryClient = useQueryClient();
  
  const getIcon = (mimeType) => {
    const type = getFileType(mimeType);
    
    switch (type) {
      case 'video':
        return <Video size={20} className="text-purple-600" />;
      case 'image':
        return <ImageIcon size={20} className="text-blue-600" />;
      case 'audio':
        return <Music size={20} className="text-orange-600" />;
      case 'document':
        return <FileText size={20} className="text-red-600" />;
      default:
        return <File size={20} className="text-gray-600" />;
    }
  };

  // Descargar archivo
  const downloadMutation = useMutation({
    mutationFn: async (fileId) => {
      const blob = await filesAPI.download(fileId);
      const file = files.find(f => f.id === fileId);
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
    onError: () => {
      toast.error('Error al descargar el archivo');
    },
  });

  // Eliminar archivo
  const deleteMutation = useMutation({
    mutationFn: (fileId) => filesAPI.delete(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
      queryClient.invalidateQueries(['library-files']);
      toast.success('Archivo eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al eliminar archivo');
    },
  });

  const handleDownload = (e, fileId) => {
    e.stopPropagation();
    downloadMutation.mutate(fileId);
  };

  const handleDelete = (e, fileId) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar este archivo?')) {
      deleteMutation.mutate(fileId);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Tamaño
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Subido por
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Fecha
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {files.map((file) => (
            <tr key={file.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {getIcon(file.mimeType)}
                  <div>
                    <p className="font-medium text-gray-900">{file.originalName}</p>
                    {file.resolution && (
                      <p className="text-xs text-gray-500">{file.resolution}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {formatFileSize(file.size)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {file.uploader?.name?.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-600">{file.uploader?.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {format(new Date(file.createdAt), "d 'de' MMM, yyyy", { locale: es })}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  {showDownload && (
                    <button 
                      onClick={(e) => handleDownload(e, file.id)}
                      disabled={downloadMutation.isPending}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg disabled:opacity-50"
                      title="Descargar"
                    >
                      <Download size={18} />
                    </button>
                  )}
                  <button 
                    onClick={(e) => handleDelete(e, file.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;