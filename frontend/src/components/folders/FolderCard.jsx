import React, { useState } from 'react';
import { Folder, MoreVertical, Edit2, Trash2, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const FolderCard = ({ folder, onClick }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group relative"
    >
      {/* Menu */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleMenuClick}
          className="p-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical size={18} />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Edit2 size={16} />
              Editar
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Share2 size={16} />
              Compartir
            </button>
            <hr className="my-1" />
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
              <Trash2 size={16} />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Folder Icon */}
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${folder.color}20` }}
      >
        <Folder size={32} style={{ color: folder.color }} />
      </div>

      {/* Info */}
      <h3 className="font-semibold text-gray-900 mb-1 truncate">
        {folder.name}
      </h3>
      
      {folder.program && (
        <p className="text-sm text-gray-600 mb-2 truncate">
          {folder.program}
        </p>
      )}

      {folder.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {folder.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
        <span>
          {folder.subfolders?.length || 0} subcarpetas
        </span>
        <span>
          {format(new Date(folder.createdAt), 'd MMM', { locale: es })}
        </span>
      </div>
    </div>
  );
};

export default FolderCard;  