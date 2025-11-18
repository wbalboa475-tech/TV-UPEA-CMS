import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      toast.success('¡Bienvenido a TV UPEA CMS!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
      {/* Fondo con imagen: coloca la imagen en frontend/public/img/diseño-login.jpeg */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/diseño-login.jpeg')",
        }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Tarjeta de login (glass) */}
      <div className="relative z-10 w-full max-w-md px-8 py-10 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl">
        {/* Logo React arriba (opcional) */}
        <div className="flex justify-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
            alt="React Logo"
            className="w-12 h-12"
          />
        </div>

        <h2 className="text-center text-white text-3xl font-semibold mb-6 tracking-wide">
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Usuario */}
          <label className="sr-only" htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="w-full px-5 py-3 bg-white/20 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          {/* Contraseña */}
          <div className="relative">
            <label className="sr-only" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="w-full px-5 py-3 bg-white/20 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Recordarme + Olvidé contraseña */}
          <div className="flex items-center justify-between text-sm text-gray-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-cyan-400 bg-transparent border-white/30 rounded focus:ring-cyan-400"
              />
              Recuérdame
            </label>
            <Link to="/forgot-password" className="hover:text-cyan-400">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón login */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold rounded-2xl transition-all shadow-lg"
          >
            {loginMutation.isPending ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Registro */}
        <p className="text-center text-gray-300 mt-6">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;