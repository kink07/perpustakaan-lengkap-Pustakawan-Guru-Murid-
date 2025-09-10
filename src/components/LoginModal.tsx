import React, { useState } from 'react';
import { X, User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

// Sample users for demonstration
const sampleUsers = [
  {
    id: 1,
    username: 'siswa001',
    password: 'password123',
    role: 'student',
    name: 'Ahmad Rizki Pratama',
    class: 'XII IPA 1',
    studentId: '2024001',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: 'ahmad.rizki@student.sman1jakarta.sch.id'
  },
  {
    id: 2,
    username: 'guru001',
    password: 'password123',
    role: 'teacher',
    name: 'Dr. Siti Nurhaliza, S.Pd',
    subject: 'Matematika',
    teacherId: 'T2024001',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: 'siti.nurhaliza@sman1jakarta.sch.id'
  },
  {
    id: 3,
    username: 'pustakawan001',
    password: 'password123',
    role: 'librarian',
    name: 'Drs. Bambang Sutrisno',
    position: 'Kepala Perpustakaan',
    employeeId: 'L2024001',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: 'bambang.sutrisno@sman1jakarta.sch.id'
  }
];

function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const user = sampleUsers.find(u => u.username === username && u.password === password);
      
      if (user) {
        onLogin(user);
      } else {
        setError('Username atau password salah');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (user: any) => {
    setUsername(user.username);
    setPassword(user.password);
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

          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                placeholder="Masukkan username"
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

        {/* Demo Accounts */}
        <div className="px-6 pb-6">
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-3">Akun demo untuk testing:</p>
            <div className="space-y-2">
              {sampleUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleDemoLogin(user)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role === 'student' ? 'Siswa' : user.role === 'teacher' ? 'Guru' : 'Pustakawan'}
                        {' • '}
                        {user.username}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;