/**
 * Formatear tamaño de archivo
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Formatear duración de video
 */
export const formatDuration = (seconds) => {
  if (!seconds) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Obtener tipo de archivo desde mimetype
 */
export const getFileType = (mimeType) => {
  if (!mimeType) return 'other';
  
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('spreadsheet')) {
    return 'document';
  }
  
  return 'other';
};

/**
 * Obtener iniciales del nombre
 */
export const getInitials = (name) => {
  if (!name) return '??';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Truncar texto
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validar email
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Obtener color según extensión
 */
export const getFileColor = (extension) => {
  const colors = {
    // Videos
    mp4: 'text-purple-600',
    mov: 'text-purple-600',
    avi: 'text-purple-600',
    mkv: 'text-purple-600',
    
    // Imágenes
    jpg: 'text-blue-600',
    jpeg: 'text-blue-600',
    png: 'text-blue-600',
    gif: 'text-blue-600',
    svg: 'text-blue-600',
    
    // Documentos
    pdf: 'text-red-600',
    doc: 'text-blue-700',
    docx: 'text-blue-700',
    xls: 'text-green-600',
    xlsx: 'text-green-600',
    
    // Audio
    mp3: 'text-orange-600',
    wav: 'text-orange-600',
    
    default: 'text-gray-600',
  };
  
  return colors[extension?.toLowerCase()] || colors.default;
};