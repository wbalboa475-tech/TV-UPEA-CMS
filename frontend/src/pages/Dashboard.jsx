import React from 'react';
import { useAuthStore } from '../store/authStore';
import { FolderOpen, FileText, Upload, Clock } from 'lucide-react';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  const stats = [
    {
      icon: FolderOpen,
      label: 'Total Carpetas',
      value: '12',
      color: 'bg-blue-500',
    },
    {
      icon: FileText,
      label: 'Total Archivos',
      value: '15',
      color: 'bg-green-500',
    },
    {
      icon: Upload,
      label: 'Subidos Hoy',
      value: '8',
      color: 'bg-purple-500',
    },
    {
      icon: Clock,
      label: 'Pendientes',
      value: '0',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido, {user?.name}! 👋
        </h1>
        <p className="text-primary-100">
          Aquí está el resumen de tu actividad en TV UPEA 
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Actividad Reciente
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                video_programa_01.mp4
              </p>
              <p className="text-sm text-gray-600">Subido hace 2 horas</p>
            </div>
          </div>
          {/* Más items aquí */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;