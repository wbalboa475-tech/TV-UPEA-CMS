import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  Search,
  Users,
  Settings,
  BarChart3,
  X,
  Tv,
  Library,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Tv, label: 'Programas', path: '/programs' },
  { icon: Library, label: 'Biblioteca', path: '/library' },
  { icon: FolderOpen, label: 'Mis Archivos', path: '/files' },
  { icon: Upload, label: 'Subir Archivo', path: '/upload' },
  { icon: Search, label: 'Búsqueda', path: '/search' },
  { icon: BarChart3, label: 'Estadísticas', path: '/analytics' },
  { icon: Users, label: 'Usuarios', path: '/users', adminOnly: true },
  { icon: Settings, label: 'Configuración', path: '/settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">TV</span>
            </div>
            <span className="font-bold text-lg text-gray-900">TV UPEA</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-primary-50 rounded-lg">
          <p className="text-xs text-primary-900 font-semibold mb-1">
            💡 Tip del día
          </p>
          <p className="text-xs text-primary-700">
            Usa etiquetas para organizar mejor tus archivos
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;