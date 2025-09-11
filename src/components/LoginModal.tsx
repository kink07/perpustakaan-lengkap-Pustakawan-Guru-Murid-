import React, { useState } from 'react';
import { X, User, Lock, Eye, EyeOff } from 'lucide-react';
import { databaseService } from '../services/database';
import { User as DatabaseUser } from '../types/database';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: DatabaseUser) => void;
}

// Users will be loaded from database
const sampleUsers: any[] = [];

function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.error('Login timeout after 10 seconds');
      setError('Login timeout. Silakan coba lagi.');
      setIsLoading(false);
    }, 10000); // 10 second timeout

    try {
      console.log('Starting login process...');
      console.log('Email:', email);
      console.log('Password length:', password.length);
      
      // Use database service for authentication
      const { user, error } = await databaseService.signIn(email, password);
      
      console.log('Database service response:', { user, error });
      clearTimeout(timeoutId); // Clear timeout if login completes
      
      if (error) {
        console.error('Login error:', error);
        // Provide more specific error messages
        if (error.includes('Invalid login credentials')) {
          setError('Email atau password salah');
        } else if (error.includes('User not found')) {
          setError('User tidak ditemukan. Silakan daftar terlebih dahulu.');
        } else if (error.includes('Email not confirmed')) {
          setError('Email belum dikonfirmasi. Silakan cek email Anda.');
        } else {
          setError(`Login gagal: ${error}`);
        }
        setIsLoading(false);
      } else if (user) {
        console.log('Login successful:', user);
        onLogin(user);
        onClose(); // Close modal after successful login
        setIsLoading(false);
      } else {
        setError('Email atau password salah');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      clearTimeout(timeoutId);
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
      setIsLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Masuk ke Akun</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                placeholder="Masukkan email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                placeholder="Masukkan password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default LoginModal;