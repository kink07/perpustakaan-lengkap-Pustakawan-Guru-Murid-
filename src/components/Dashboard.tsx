import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Eye, 
  Archive, 
  User, 
  LogOut, 
  Search, 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  Clock,
  Activity,
  Target,
  Award,
  Calendar,
  FileText,
  Heart,
  Bookmark,
  Share2,
  Building,
  Briefcase,
  Monitor,
  Edit3
} from 'lucide-react';

import CirculationForm from './forms/CirculationForm';
import CollectionManagementForm from './forms/CollectionManagementForm';
import UserManagementForm from './forms/UserManagementForm';
import { databaseService } from '../services/database';
import VisitorForm from './forms/VisitorForm';
import ReportsForm from './forms/ReportsForm';
import SettingsForm from './forms/SettingsForm';
import InventoryForm from './forms/InventoryForm';
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
import TeacherFavoritesForm from './forms/TeacherFavoritesForm';
import TeacherBookmarksForm from './forms/TeacherBookmarksForm';
import TeacherSharedBooksForm from './forms/TeacherSharedBooksForm';
import StudentBookmarksForm from './forms/StudentBookmarksForm';
import StudentSharedBooksForm from './forms/StudentSharedBooksForm';
import StatisticsDashboardForm from './forms/StatisticsDashboardForm';
import SystemNotificationsForm from './forms/SystemNotificationsForm';
import ActivityLogForm from './forms/ActivityLogForm';
import EditProfileModal from './EditProfileModal';

interface DashboardProps {
  user: any;
  onLogout: () => void;
  onNavigateToLibrary: () => void;
  onNavigateToOPAC: () => void;
  onBookAdded?: () => void;
  dashboardType?: 'librarian' | 'teacher' | 'student' | 'default';
  initialActiveMenu?: string;
  onUserUpdate?: (user: any) => void;
  onMenuChange?: (menuId: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenu?: MenuItem[];
}

function Dashboard({ user, onLogout, onNavigateToLibrary, onNavigateToOPAC, onBookAdded, dashboardType = 'default', initialActiveMenu, onUserUpdate, onMenuChange }: DashboardProps) {
  const [activeMenu, setActiveMenu] = useState(initialActiveMenu || 'opac');
  const [currentUser, setCurrentUser] = useState(user);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);

  // Update activeMenu when initialActiveMenu changes
  useEffect(() => {
    if (initialActiveMenu) {
      setActiveMenu(initialActiveMenu);
    }
  }, [initialActiveMenu]);

  // Update currentUser when user prop changes
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  // Define menu items based on dashboard type
  const getMenuItems = (): MenuItem[] => {
    const commonItems = [
      { id: 'opac', label: 'Beranda', icon: <Search className="w-5 h-5" /> }
    ];

    if (dashboardType === 'librarian') {
      return [
        ...commonItems,
        { id: 'statistics', label: 'Dashboard Statistik', icon: <BarChart3 className="w-5 h-5" /> },
        {
          id: 'collection-management',
          label: 'Manajemen Koleksi',
          icon: <Book className="w-5 h-5" />
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
        { id: 'notifications', label: 'Notifikasi Sistem', icon: <Bell className="w-5 h-5" /> },
        { id: 'activity-logs', label: 'Log Aktivitas', icon: <Activity className="w-5 h-5" /> },
        { id: 'visitors', label: 'Pengunjung', icon: <Eye className="w-5 h-5" /> },
        { id: 'inventory', label: 'Inventarisasi', icon: <Archive className="w-5 h-5" /> },
        { id: 'reports', label: 'Laporan', icon: <BarChart3 className="w-5 h-5" /> },
        { id: 'settings', label: 'Pengaturan', icon: <Settings className="w-5 h-5" /> }
      ];
    } else if (dashboardType === 'teacher') {
      return [
        ...commonItems,
        { id: 'profile', label: 'Profil Saya', icon: <User className="w-5 h-5" /> },
        { id: 'class-management', label: 'Manajemen Kelas', icon: <Users className="w-5 h-5" /> },
        { id: 'curriculum-books', label: 'Buku Kurikulum', icon: <Book className="w-5 h-5" /> },
        { id: 'teaching-materials', label: 'Materi Ajar', icon: <FileText className="w-5 h-5" /> },
        { id: 'favorites', label: 'Favorit Saya', icon: <Heart className="w-5 h-5" /> },
        { id: 'bookmarks', label: 'Bookmark', icon: <Bookmark className="w-5 h-5" /> },
        { id: 'shared-books', label: 'Buku Dibagikan', icon: <Share2 className="w-5 h-5" /> }
      ];
    } else if (dashboardType === 'student') {
      return [
        ...commonItems,
        { id: 'profile', label: 'Profil Saya', icon: <User className="w-5 h-5" /> },
        { id: 'borrowed-books', label: 'Buku Dipinjam', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'reservations', label: 'Reservasi', icon: <Calendar className="w-5 h-5" /> },
        { id: 'favorites', label: 'Favorit Saya', icon: <Heart className="w-5 h-5" /> },
        { id: 'bookmarks', label: 'Bookmark', icon: <Bookmark className="w-5 h-5" /> },
        { id: 'shared-books', label: 'Buku Dibagikan', icon: <Share2 className="w-5 h-5" /> },
        { id: 'digital-library', label: 'Perpustakaan Digital', icon: <Monitor className="w-5 h-5" /> },
        { id: 'reading-history', label: 'Riwayat Bacaan', icon: <Clock className="w-5 h-5" /> }
      ];
    } else {
      // Default dashboard for unknown types
      return [
        ...commonItems,
        { id: 'profile', label: 'Profil Saya', icon: <User className="w-5 h-5" /> }
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
      // Notify parent component about menu change
      if (onMenuChange) {
        onMenuChange(menuId);
      }
      // Auto-collapse sidebar on mobile after menu selection
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    }
  };

  const handleEditBook = (book: any) => {
    setEditingBook(book);
    setActiveMenu('cataloging');
  };

  const handleBookSaved = () => {
    setEditingBook(null);
    if (onBookAdded) {
      onBookAdded();
    }
  };

  const handleSaveProfile = async (userData: any) => {
    try {
      // Filter hanya field yang valid untuk database
      const validUpdates = {
        name: userData.name,
        institution: userData.institution,
        position: userData.position,
        phone: userData.phone,
        profile_image: userData.profile_image
      };
      
      console.log('Updating profile with:', validUpdates);
      
      // Update user data in the database
      const updatedUserData = await databaseService.updateUser(currentUser.id, validUpdates);
      
      // Update local user state
      setCurrentUser(updatedUserData);
      
      // Notify parent component about user update
      if (onUserUpdate) {
        onUserUpdate(updatedUserData);
      }
      
      console.log('Profile updated successfully:', validUpdates);
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Terjadi kesalahan saat memperbarui profil.');
    }
  };

  const handleQuickAction = (menuId: string) => {
    setActiveMenu(menuId);
    // Notify parent component about menu change
    if (onMenuChange) {
      onMenuChange(menuId);
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'collection-management':
        return <CollectionManagementForm user={user} onBookAdded={handleBookSaved} onEditBook={handleEditBook} editingBook={editingBook} />;
      case 'circulation':
        return <CirculationForm user={user} />;
      case 'user-management':
        return <UserManagementForm />;
      case 'statistics':
        return <StatisticsDashboardForm />;
      case 'active-borrowings':
      case 'notifications':
        return <SystemNotificationsForm />;
      case 'activity-logs':
        return <ActivityLogForm />;
      case 'visitors':
        return <VisitorForm user={user} />;
      case 'inventory':
        return <InventoryForm />;
      case 'reports':
        return <ReportsForm />;
      case 'settings':
        return <SettingsForm />;
      case 'profile':
        return currentUser.role === 'teacher' ? <TeacherProfileForm /> : <StudentProfileForm />;
      case 'class-management':
        return <TeacherClassManagementForm />;
      case 'curriculum-books':
        return <TeacherCurriculumBooksForm />;
      case 'teaching-materials':
        return <TeacherTeachingMaterialsForm />;
      case 'borrowed-books':
        return <StudentBorrowedBooksForm />;
      case 'favorites':
        return dashboardType === 'teacher' ? <TeacherFavoritesForm user={user} /> : <StudentFavoritesForm user={user} />;
      case 'bookmarks':
        return dashboardType === 'teacher' ? <TeacherBookmarksForm user={user} /> : <StudentBookmarksForm user={user} />;
      case 'shared-books':
        return dashboardType === 'teacher' ? <TeacherSharedBooksForm /> : <StudentSharedBooksForm />;
      case 'digital-library':
        return <StudentDigitalLibraryForm />;
      case 'reading-history':
        return <StudentReadingHistoryForm />;
      case 'opac':
        onNavigateToOPAC();
        return null;
      default:
        return null;
    }
  };



  const renderLibrarianDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Selamat Datang, {currentUser.name}</h1>
            <p className="text-blue-100">Dashboard Pustakawan - Kelola perpustakaan digital</p>
          </div>
          <div className="hidden md:block">
            <Users className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Librarian Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Buku</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <Book className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Peminjaman Aktif</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Pengguna</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pengunjung Hari Ini</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <Eye className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          <div className="text-center py-8">
            <p className="text-gray-500">Aktivitas akan dimuat dari database</p>
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
            <h1 className="text-2xl font-bold mb-2">Selamat Datang, {currentUser.name}</h1>
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
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Materi Dibuat</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rating Mengajar</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <Award className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Kelas Aktif</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          <div className="text-center py-8">
            <p className="text-gray-500">Aktivitas akan dimuat dari database</p>
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
            <h1 className="text-2xl font-bold mb-2">Selamat Datang, {currentUser.name}</h1>
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
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <Book className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Sedang Dipinjam</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Target Tahun Ini</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <Target className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Reservasi</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          <div className="text-center py-8">
            <p className="text-gray-500">Aktivitas akan dimuat dari database</p>
          </div>
        </div>
      </div>

      {/* Reading Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rekomendasi Bacaan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center py-8">
            <p className="text-gray-500">Rekomendasi akan dimuat dari database</p>
          </div>
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

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            {/* Profile Picture */}
            <div 
              className="relative cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsEditProfileOpen(true)}
              title="Klik untuk edit profil"
            >
              {currentUser?.profile_image ? (
                <img 
                  src={currentUser.profile_image} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center border-2 border-yellow-400">
                  <div className="text-white text-lg font-bold">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                </div>
              )}
            </div>
            
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1 min-w-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                    onClick={() => setIsEditProfileOpen(true)}
                    title="Klik untuk edit profil"
                  >
                    {/* Name with Edit Icon */}
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{currentUser.name}</h3>
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    {/* Role */}
                    <div className="flex items-center space-x-1 mb-1">
                      <Briefcase className="w-3 h-3 text-gray-500" />
                      <p className="text-sm text-gray-600">
                        {currentUser.role === 'librarian' ? 'Pustakawan' : 
                         currentUser.role === 'teacher' ? 'Guru' : 'Siswa'}
                      </p>
                    </div>
                    
                    {/* Institution */}
                    <div className="flex items-center space-x-1">
                      <Building className="w-3 h-3 text-blue-500" />
                      <p className="text-sm text-blue-600 font-medium">
                        {currentUser.institution || 'SMAN 1 Jakarta'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Collapse Button */}
                  <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                    title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    {isSidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
            
            {isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                title="Expand sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>
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
                        onClick={() => handleQuickAction(subItem.id)}
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

      {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          user={currentUser}
          onSave={handleSaveProfile}
        />
    </div>
  );
}

export default Dashboard;