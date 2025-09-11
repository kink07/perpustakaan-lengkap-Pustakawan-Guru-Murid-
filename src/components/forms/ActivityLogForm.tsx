import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  User, 
  BookOpen, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Database,
  Shield,
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  BookMarked
} from 'lucide-react';
import { databaseService } from '../../services/database';

interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  description: string;
  book_id?: string;
  book_title?: string;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

function ActivityLogForm() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const activitiesData = await databaseService.getActivities();
      
      // Transform activities to include user and book details
      const enrichedActivities = await Promise.all(
        activitiesData.map(async (activity) => {
          try {
            const user = await databaseService.getUserById(activity.user_id);
            const book = activity.book_id ? await databaseService.getBookById(activity.book_id) : null;
            
            return {
              id: activity.id,
              user_id: activity.user_id,
              user_name: user?.name || 'Unknown User',
              user_role: user?.role || 'Unknown',
              action: activity.action,
              description: activity.description || activity.action,
              book_id: activity.book_id,
              book_title: book?.title || 'Unknown Book',
              created_at: activity.created_at,
              ip_address: activity.ip_address,
              user_agent: activity.user_agent
            };
          } catch (error) {
            console.error('Error loading activity details:', error);
            return {
              id: activity.id,
              user_id: activity.user_id,
              user_name: 'Unknown User',
              user_role: 'Unknown',
              action: activity.action,
              description: activity.description || activity.action,
              book_id: activity.book_id,
              book_title: 'Unknown Book',
              created_at: activity.created_at,
              ip_address: activity.ip_address,
              user_agent: activity.user_agent
            };
          }
        })
      );
      
      setActivities(enrichedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (!action || typeof action !== 'string') {
      return <Activity className="w-4 h-4 text-gray-600" />;
    }
    switch (action.toLowerCase()) {
      case 'login':
        return <Shield className="w-4 h-4 text-green-600" />;
      case 'logout':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'borrow':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'return':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'reserve':
        return <BookMarked className="w-4 h-4 text-purple-600" />;
      case 'search':
        return <Search className="w-4 h-4 text-yellow-600" />;
      case 'create':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'update':
        return <Database className="w-4 h-4 text-orange-600" />;
      case 'delete':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    if (!action || typeof action !== 'string') {
      return 'bg-gray-100 text-gray-800';
    }
    switch (action.toLowerCase()) {
      case 'login':
        return 'bg-green-100 text-green-800';
      case 'logout':
        return 'bg-red-100 text-red-800';
      case 'borrow':
        return 'bg-blue-100 text-blue-800';
      case 'return':
        return 'bg-green-100 text-green-800';
      case 'reserve':
        return 'bg-purple-100 text-purple-800';
      case 'search':
        return 'bg-yellow-100 text-yellow-800';
      case 'create':
        return 'bg-indigo-100 text-indigo-800';
      case 'update':
        return 'bg-orange-100 text-orange-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'librarian':
        return 'bg-blue-100 text-blue-800';
      case 'teacher':
        return 'bg-green-100 text-green-800';
      case 'student':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchTerm || 
      (activity.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.book_title || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = userFilter === 'all' || activity.user_role === userFilter;
    const matchesAction = actionFilter === 'all' || activity.action === actionFilter;
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const activityDate = new Date(activity.created_at);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          return activityDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return activityDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return activityDate >= monthAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesUser && matchesAction && matchesDate;
  });

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case 'user_name':
        aValue = (a.user_name || '').toLowerCase();
        bValue = (b.user_name || '').toLowerCase();
        break;
      case 'action':
        aValue = (a.action || '').toLowerCase();
        bValue = (b.action || '').toLowerCase();
        break;
      case 'book_title':
        aValue = (a.book_title || '').toLowerCase();
        bValue = (b.book_title || '').toLowerCase();
        break;
      default:
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
    }
    
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const totalPages = Math.ceil(sortedActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActivities = sortedActivities.slice(startIndex, endIndex);

  const getActivityStats = () => {
    const total = activities.length;
    const today = new Date().toDateString();
    const todayActivities = activities.filter(a => 
      new Date(a.created_at).toDateString() === today
    ).length;
    
    const actionCounts = activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonAction = Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return {
      total,
      today: todayActivities,
      mostCommon: mostCommonAction ? mostCommonAction[0] : 'N/A',
      mostCommonCount: mostCommonAction ? mostCommonAction[1] : 0
    };
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(sortedActivities, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const stats = getActivityStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📈 Log Aktivitas</h2>
          <p className="text-gray-600">Pantau dan audit semua aktivitas sistem perpustakaan</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadActivities}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Aktivitas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hari Ini</p>
              <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktivitas Terbanyak</p>
              <p className="text-lg font-bold text-gray-900">{stats.mostCommon}</p>
              <p className="text-sm text-gray-500">{stats.mostCommonCount} kali</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pengguna Aktif</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(activities.map(a => a.user_id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pencarian</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari berdasarkan user, aksi, atau buku..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role User</label>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Role</option>
                  <option value="librarian">Pustakawan</option>
                  <option value="teacher">Guru</option>
                  <option value="student">Murid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aksi</label>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Aksi</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="borrow">Pinjam</option>
                  <option value="return">Kembalikan</option>
                  <option value="reserve">Pesan</option>
                  <option value="search">Cari</option>
                  <option value="create">Buat</option>
                  <option value="update">Update</option>
                  <option value="delete">Hapus</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode Waktu</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Waktu</option>
                <option value="today">Hari Ini</option>
                <option value="week">7 Hari Terakhir</option>
                <option value="month">30 Hari Terakhir</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="created_at">Waktu</option>
                  <option value="user_name">User</option>
                  <option value="action">Aksi</option>
                  <option value="book_title">Buku</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urutan</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">Terbaru</option>
                  <option value="asc">Terlama</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Log Aktivitas ({filteredActivities.length} dari {activities.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buku
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(activity.created_at).toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {activity.user_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(activity.user_role)}`}>
                            {activity.user_role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getActionIcon(activity.action)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                        {activity.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {activity.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.book_title && activity.book_title !== 'Unknown Book' ? (
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="truncate max-w-32">{activity.book_title}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {paginatedActivities.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada aktivitas</h3>
              <p className="text-gray-500">
                {searchTerm || userFilter !== 'all' || actionFilter !== 'all' || dateFilter !== 'all'
                  ? 'Tidak ada aktivitas yang sesuai dengan filter yang dipilih'
                  : 'Belum ada aktivitas yang tercatat'
                }
              </p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Menampilkan {startIndex + 1} sampai {Math.min(endIndex, filteredActivities.length)} dari {filteredActivities.length} aktivitas
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityLogForm;