import React, { useState } from 'react';
import { 
  Book, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Eye, 
  Archive, 
  ShoppingCart, 
  Wrench, 
  Camera, 
  Tag, 
  Folder, 
  User, 
  LogOut, 
  Search, 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Home,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Target,
  Award,
  Calendar,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Shield,
  Database,
  Server,
  HardDrive,
  Wifi,
  Monitor,
  Smartphone
} from 'lucide-react';

import { BookData } from '../types/book';
import DescriptiveCatalogingForm from './DescriptiveCatalogingForm';
import BookListTable from './BookListTable';
import CirculationForm from './forms/CirculationForm';
import UserManagementForm from './forms/UserManagementForm';
import VisitorForm from './forms/VisitorForm';
import ReportsForm from './forms/ReportsForm';
import SettingsForm from './forms/SettingsForm';
import InventoryForm from './forms/InventoryForm';
import AcquisitionForm from './forms/AcquisitionForm';
import MaintenanceForm from './forms/MaintenanceForm';
import DigitizationForm from './forms/DigitizationForm';
import LabelBarcodeForm from './forms/LabelBarcodeForm';
import ClassificationForm from './forms/ClassificationForm';
import StudentProfileForm from './forms/StudentProfileForm';
import TeacherProfileForm from './forms/TeacherProfileForm';
import StudentFavoritesForm from './forms/StudentFavoritesForm';
import StudentReservationsForm from './forms/StudentReservationsForm';
import StudentBorrowedBooksForm from './forms/StudentBorrowedBooksForm';
import StudentDigitalLibraryForm from './forms/StudentDigitalLibraryForm';
import StudentReadingHistoryForm from './forms/StudentReadingHistoryForm';
import TeacherClassManagementForm from './forms/TeacherClassManagementForm';
import TeacherCurriculumBooksForm from './forms/TeacherCurriculumBooksForm';
import TeacherTeachingMaterialsForm from './forms/TeacherTeachingMaterialsForm';

interface DashboardProps {
  user: any;
  books: BookData[];
  setBooks: (books: BookData[]) => void;
  onLogout: () => void;
  onNavigateToLibrary: () => void;
  onNavigateToOPAC: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenu?: MenuItem[];
}

function Dashboard({ user, books, setBooks, onLogout, onNavigateToLibrary, onNavigateToOPAC }: DashboardProps) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  // Define menu items based on user role
  const getMenuItems = (): MenuItem[] => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
      { id: 'opac', label: 'OPAC', icon: <Search className="w-5 h-5" /> }
    ];

    if (user.role === 'librarian') {
      return [
        ...commonItems,
        {
          id: 'collection-management',
          label: 'Manajemen Koleksi',
          icon: <Book className="w-5 h-5" />,
          hasSubmenu: true,
          submenu: [
            { id: 'cataloging', label: 'Kataloging', icon: <FileText className="w-4 h-4" /> },
            { id: 'book-list', label: 'Daftar Buku', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'label-barcode', label: 'Label & Barcode', icon: <Tag className="w-4 h-4" /> }
          ]
        },
        {
          id: 'circulation',
          label: 'Sirkulasi',
          icon: <BookOpen className="w-5 h-5" />
        },
        {
          id: 'user-management',
          label: 'Manajemen Pengguna',
          icon: <Users className="w-5 h-5" />
        },
        { id: 'visitors', label: 'Pengunjung', icon: <Eye className="w-5 h-5" /> },
        {
          id: 'acquisition',
          label: 'Pengadaan',
          icon: <ShoppingCart className="w-5 h-5" />,
          hasSubmenu: true,
          submenu: [
            { id: 'selection', label: 'Seleksi', icon: <CheckCircle className="w-4 h-4" /> },
            { id: 'ordering', label: 'Pemesanan', icon: <ShoppingCart className="w-4 h-4" /> },
            { id: 'receiving', label: 'Penerimaan', icon: <Download className="w-4 h-4" /> }
          ]
        },
        { id: 'inventory', label: 'Inventarisasi', icon: <Archive className="w-5 h-5" /> },
        { id: 'maintenance', label: 'Perawatan & Perbaikan', icon: <Wrench className="w-5 h-5" /> },
        { id: 'digitization', label: 'Digitalisasi Koleksi', icon: <Camera className="w-5 h-5" /> },
        { id: 'reports', label: 'Laporan', icon: <BarChart3 className="w-5 h-5" /> },
        { id: 'settings', label: 'Pengaturan', icon: <Settings className="w-5 h-5" /> }
      ];
    } else if (user.role === 'teacher') {
      return [
        ...commonItems,
        { id: 'profile', label: 'Profil Saya', icon: <User className="w-5 h-5" /> },
        { id: 'class-management', label: 'Manajemen Kelas', icon: <Users className="w-5 h-5" /> },
        { id: 'curriculum-books', label: 'Buku Kurikulum', icon: <Book className="w-5 h-5" /> },
        { id: 'teaching-materials', label: 'Materi Ajar', icon: <FileText className="w-5 h-5" /> }
      ];
    } else {
      return [
        ...commonItems,
        { id: 'profile', label: 'Profil Saya', icon: <User className="w-5 h-5" /> },
        { id: 'borrowed-books', label: 'Buku Dipinjam', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'reservations', label: 'Reservasi', icon: <Calendar className="w-5 h-5" /> },
        { id: 'favorites', label: 'Favorit', icon: <Award className="w-5 h-5" /> },
        { id: 'digital-library', label: 'Perpustakaan Digital', icon: <Monitor className="w-5 h-5" /> },
        { id: 'reading-history', label: 'Riwayat Bacaan', icon: <Clock className="w-5 h-5" /> }
      ];
    }
  };

  const menuItems = getMenuItems();

  const toggleSubmenu = (menuId: string) => {
    setOpenSubmenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (menuId: string, hasSubmenu?: boolean) => {
    if (hasSubmenu) {
      toggleSubmenu(menuId);
    } else {
      setActiveMenu(menuId);
      // Auto-collapse sidebar on mobile after menu selection
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return renderDashboardContent();
      case 'cataloging':
        return <DescriptiveCatalogingForm books={books} setBooks={setBooks} />;
      case 'book-list':
        return <BookListTable books={books} setBooks={setBooks} />;
      case 'label-barcode':
        return <LabelBarcodeForm books={books} />;
      case 'circulation':
        return <CirculationForm user={user} />;
      case 'user-management':
        return <UserManagementForm />;
      case 'visitors':
        return <VisitorForm user={user} />;
      case 'acquisition':
      case 'selection':
      case 'ordering':
      case 'receiving':
        return <AcquisitionForm />;
      case 'inventory':
        return <InventoryForm />;
      case 'maintenance':
        return <MaintenanceForm />;
      case 'digitization':
        return <DigitizationForm />;
      case 'reports':
        return <ReportsForm />;
      case 'settings':
        return <SettingsForm />;
      case 'profile':
        return user.role === 'teacher' ? <TeacherProfileForm /> : <StudentProfileForm />;
      case 'class-management':
        return <TeacherClassManagementForm />;
      case 'curriculum-books':
        return <TeacherCurriculumBooksForm />;
      case 'teaching-materials':
        return <TeacherTeachingMaterialsForm />;
      case 'borrowed-books':
        return <StudentBorrowedBooksForm />;
      case 'favorites':
        return <StudentFavoritesForm />;
      case 'digital-library':
        return <StudentDigitalLibraryForm />;
      case 'reading-history':
        return <StudentReadingHistoryForm />;
      case 'opac':
        onNavigateToOPAC();
        return null;
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => {
    if (user.role === 'librarian') {
      return renderLibrarianDashboard();
    } else if (user.role === 'teacher') {
      return renderTeacherDashboard();
    } else {
      return renderStudentDashboard();
    }
  };

  const renderLibrarianDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Selamat Datang, {user.name}</h1>
            <p className="text-blue-100">Dashboard Pustakawan - Kelola perpustakaan digital dengan mudah</p>
          </div>
          <div className="hidden md:block">
            <Book className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Koleksi</p>
              <p className="text-2xl font-bold text-gray-900">15,847</p>
              <p className="text-green-600 text-xs mt-1">+234 bulan ini</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pengguna Aktif</p>
              <p className="text-2xl font-bold text-gray-900">2,341</p>
              <p className="text-green-600 text-xs mt-1">+89 minggu ini</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Peminjaman Hari Ini</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
              <p className="text-green-600 text-xs mt-1">+15% dari kemarin</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pengunjung Hari Ini</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-green-600 text-xs mt-1">+12 dari kemarin</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Collection Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performa Koleksi</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Tersedia</span>
                <span className="text-sm text-gray-600">78% (12,456 buku)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Dipinjam</span>
                <span className="text-sm text-gray-600">18% (2,891 buku)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Perawatan</span>
                <span className="text-sm text-gray-600">3% (456 buku)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '3%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Hilang/Rusak</span>
                <span className="text-sm text-gray-600">1% (44 buku)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '1%' }}></div>
              </div>
            </div>
          </div>

          {/* Circulation Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Sirkulasi (7 Hari Terakhir)</h3>
            <div className="flex items-end justify-between h-32 space-x-2">
              {[45, 52, 38, 61, 55, 48, 67].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-500 hover:bg-blue-600"
                    style={{ height: `${(value / 70) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Populer</h3>
            <div className="space-y-3">
              {[
                { category: '500 - Sains', percentage: 28, count: 456 },
                { category: '300 - Sosial', percentage: 22, count: 358 },
                { category: '800 - Sastra', percentage: 18, count: 293 },
                { category: '900 - Sejarah', percentage: 16, count: 261 },
                { category: '400 - Bahasa', percentage: 16, count: 260 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm text-gray-600">{item.count} peminjaman</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-4">
              {[
                {
                  type: 'borrow',
                  text: 'Peminjaman buku "Matematika Kelas X"',
                  user: 'Ahmad Rizki',
                  time: '5 menit yang lalu',
                  color: 'border-blue-500'
                },
                {
                  type: 'register',
                  text: 'Registrasi pengguna baru',
                  user: 'Siti Nurhaliza',
                  time: '15 menit yang lalu',
                  color: 'border-green-500'
                },
                {
                  type: 'return',
                  text: 'Pengembalian buku "Fisika Dasar"',
                  user: 'Bambang Sutrisno',
                  time: '30 menit yang lalu',
                  color: 'border-orange-500'
                },
                {
                  type: 'overdue',
                  text: 'Buku terlambat dikembalikan',
                  user: 'Dewi Sartika',
                  time: '1 jam yang lalu',
                  color: 'border-red-500'
                }
              ].map((activity, index) => (
                <div key={index} className={`border-l-4 ${activity.color} pl-4 py-2`}>
                  <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-600">oleh {activity.user} • {activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Peringatan & Notifikasi</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">23 Buku Terlambat</p>
                  <p className="text-xs text-red-700">Perlu tindak lanjut segera</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Inventaris Bulanan</p>
                  <p className="text-xs text-yellow-700">Jadwal: 25 Januari 2024</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Backup Sistem</p>
                  <p className="text-xs text-blue-700">Terakhir: 20 Jan 2024, 02:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setActiveMenu('cataloging')}
                className="p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <FileText className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-blue-900">Katalog Baru</p>
              </button>
              
              <button 
                onClick={() => setActiveMenu('check-out')}
                className="p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <BookOpen className="w-5 h-5 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-green-900">Peminjaman</p>
              </button>
              
              <button 
                onClick={() => setActiveMenu('user-registration')}
                className="p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
              >
                <User className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-purple-900">Daftar User</p>
              </button>
              
              <button 
                onClick={() => setActiveMenu('reports')}
                className="p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group"
              >
                <BarChart3 className="w-5 h-5 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-orange-900">Laporan</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Sistem</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Database</span>
              </div>
              <span className="text-sm text-green-600">Online</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Server</span>
              </div>
              <span className="text-sm text-green-600">Normal</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Backup</span>
              </div>
              <span className="text-sm text-yellow-600">Scheduled</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Storage</span>
              </div>
              <span className="text-sm text-green-600">67% Used</span>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ikhtisar Bulanan</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Peminjaman</span>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">3,247</p>
                <p className="text-xs text-green-600">+12% dari bulan lalu</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Pengguna Baru</span>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">156</p>
                <p className="text-xs text-green-600">+8% dari bulan lalu</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Koleksi Baru</span>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">89</p>
                <p className="text-xs text-blue-600">+15% dari bulan lalu</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Rating Layanan</span>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">4.8/5.0</p>
                <p className="text-xs text-green-600">+0.2 dari bulan lalu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeacherDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Selamat Datang, {user.name}</h1>
            <p className="text-green-100">Dashboard Guru - Kelola pembelajaran dan materi ajar</p>
          </div>
          <div className="hidden md:block">
            <Users className="w-16 h-16 text-green-200" />
          </div>
        </div>
      </div>

      {/* Teacher Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Siswa</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Materi Dibuat</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rating Mengajar</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
            </div>
            <Award className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Kelas Aktif</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm font-medium text-gray-900">Materi baru "Fungsi Linear" diupload</p>
            <p className="text-xs text-gray-600">untuk kelas XII IPA 1 • 2 jam yang lalu</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="text-sm font-medium text-gray-900">Tugas "Analisis Teks" diselesaikan</p>
            <p className="text-xs text-gray-600">oleh 28 dari 32 siswa • 1 hari yang lalu</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Selamat Datang, {user.name}</h1>
            <p className="text-purple-100">Dashboard Siswa - Jelajahi dunia pengetahuan</p>
          </div>
          <div className="hidden md:block">
            <BookOpen className="w-16 h-16 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Student Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Buku Dibaca</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
            <Book className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Sedang Dipinjam</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Target Tahun Ini</p>
              <p className="text-2xl font-bold text-gray-900">20</p>
            </div>
            <Target className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Reservasi</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm font-medium text-gray-900">Meminjam "Matematika Kelas X"</p>
            <p className="text-xs text-gray-600">Jatuh tempo: 25 Januari 2024</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="text-sm font-medium text-gray-900">Menyelesaikan "Sejarah Indonesia"</p>
            <p className="text-xs text-gray-600">Rating: 5 bintang • 2 hari yang lalu</p>
          </div>
        </div>
      </div>

      {/* Reading Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rekomendasi Bacaan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.slice(0, 2).map((book) => (
            <div key={book.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={book.cover || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=100'}
                alt={book.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{book.title}</h4>
                <p className="text-xs text-gray-600">{book.author}</p>
                <button className="mt-2 text-xs text-blue-600 hover:text-blue-800">
                  Lihat Detail →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Fixed Position */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-30 flex flex-col ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Book className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Dashboard {user.role === 'librarian' ? 'Pustakawan' : user.role === 'teacher' ? 'Guru' : 'Siswa'}</h2>
                <p className="text-xs text-gray-600">SMAN 1 Jakarta</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-600 truncate">
                  {user.role === 'librarian' ? user.position : 
                   user.role === 'teacher' ? user.subject :
                   user.class}
                </p>
                <p className="text-xs text-gray-500">{user.employeeId || user.teacherId || user.studentId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 min-h-0">
          <div className="space-y-1 px-3">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id, item.hasSubmenu)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeMenu === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`${isSidebarCollapsed ? 'mx-auto' : ''}`}>
                      {item.icon}
                    </span>
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.hasSubmenu && (
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      openSubmenus.includes(item.id) ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>

                {/* Submenu */}
                {item.hasSubmenu && item.submenu && !isSidebarCollapsed && (
                  <div className={`mt-1 space-y-1 transition-all duration-200 overflow-hidden ${
                    openSubmenus.includes(item.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveMenu(subItem.id)}
                        className={`w-full flex items-center space-x-3 px-6 py-2 text-sm rounded-lg transition-colors ${
                          activeMenu === subItem.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {subItem.icon}
                        <span>{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Actions - Fixed at bottom */}
        <div className="border-t border-gray-200 p-3 space-y-2 flex-shrink-0">
          <button
            onClick={onLogout}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors ${
              isSidebarCollapsed ? 'justify-center' : 'space-x-3'
            }`}
          >
            <LogOut className={`w-5 h-5 ${isSidebarCollapsed ? 'mx-auto' : ''}`} />
            {!isSidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {menuItems.find(item => item.id === activeMenu)?.label || 
                 menuItems.flatMap(item => item.submenu || []).find(sub => sub.id === activeMenu)?.label ||
                 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}
    </div>
  );
}

export default Dashboard;