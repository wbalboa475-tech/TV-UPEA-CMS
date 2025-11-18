import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Shield, Calendar, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    toast.success('Perfil actualizado exitosamente');
  };

  const getRoleLabel = (role) => {
    const roles = {
      admin: 'Administrador',
      producer: 'Productor',
      editor: 'Editor',
      viewer: 'Visualizador',
    };
    return roles[role] || role;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">
          Gestiona tu información personal
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800" />
        
        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex items-end justify-between -mt-16 mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-28 h-28 bg-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {getInitials(user?.name)}
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border-2 border-gray-200 hover:bg-gray-50">
                <Camera size={20} className="text-gray-600" />
              </button>
            </div>

            <Button
              variant={isEditing ? 'secondary' : 'primary'}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre Completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={<User size={20} className="text-gray-400" />}
              />
              <Input
                label="Correo Electrónico"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={<Mail size={20} className="text-gray-400" />}
              />
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Guardar Cambios
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Shield size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rol</p>
                    <p className="font-semibold text-gray-900">{getRoleLabel(user?.role)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Último acceso</p>
                    <p className="font-semibold text-gray-900">
                      {user?.lastLogin 
                        ? format(new Date(user.lastLogin), "d 'de' MMMM, yyyy", { locale: es })
                        : 'Nunca'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cambiar Contraseña
        </h3>
        <form className="space-y-4">
          <Input
            label="Contraseña Actual"
            type="password"
            placeholder="••••••••"
          />
          <Input
            label="Nueva Contraseña"
            type="password"
            placeholder="••••••••"
          />
          <Input
            label="Confirmar Nueva Contraseña"
            type="password"
            placeholder="••••••••"
          />
          <div className="flex justify-end pt-2">
            <Button variant="primary">
              Actualizar Contraseña
            </Button>
          </div>
        </form>
      </div>

      {/* Account Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Estadísticas de Cuenta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">48</p>
            <p className="text-sm text-gray-600 mt-1">Archivos Subidos</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">12</p>
            <p className="text-sm text-gray-600 mt-1">Carpetas Creadas</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">2.4 GB</p>
            <p className="text-sm text-gray-600 mt-1">Espacio Usado</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;