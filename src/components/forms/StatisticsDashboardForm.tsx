import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react';
import { databaseService } from '../../services/database';

function StatisticsDashboardForm() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalUsers: 0,
    activeBorrowings: 0,
    overdueBooks: 0,
    todayBorrows: 0,
    thisMonthBorrows: 0,
    todayVisitors: 0,
    weekVisitors: 0,
    monthVisitors: 0,
    totalVisitors: 0,
    activeVisitors: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadStatistics();
  }, [timeRange]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      // Load library stats
      const libraryStats = await databaseService.getLibraryStats();
      
      // Load borrow records for additional stats
      const borrowRecords = await databaseService.getBorrowRecords();
      const activeBorrows = borrowRecords.filter(record => record.status === 'active');
      const overdueBorrows = borrowRecords.filter(record => {
        const dueDate = new Date(record.due_date);
        const today = new Date();
        return record.status === 'active' && dueDate < today;
      });

      // Calculate today's borrows
      const today = new Date().toISOString().split('T')[0];
      const todayBorrows = borrowRecords.filter(record => 
        record.borrow_date.startsWith(today)
      ).length;

      // Calculate this month's borrows
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthStart = thisMonth.toISOString();
      const thisMonthBorrows = borrowRecords.filter(record => 
        record.borrow_date >= thisMonthStart
      ).length;

      // Load visitor stats
      const visitorStats = await databaseService.getVisitorStats();

      setStats({
        totalBooks: libraryStats.total_books,
        availableBooks: libraryStats.available_books,
        borrowedBooks: libraryStats.borrowed_books,
        totalUsers: libraryStats.total_users,
        activeBorrowings: activeBorrows.length,
        overdueBooks: overdueBorrows.length,
        todayBorrows,
        thisMonthBorrows,
        todayVisitors: visitorStats.todayVisitors,
        weekVisitors: visitorStats.weekVisitors,
        monthVisitors: visitorStats.monthVisitors,
        totalVisitors: visitorStats.totalVisitors,
        activeVisitors: visitorStats.activeVisitors
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend, trendValue }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span className="ml-1">{trendValue}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Statistik</h1>
          <p className="text-gray-600">Monitoring kinerja perpustakaan</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
            <option value="90d">90 Hari Terakhir</option>
          </select>
          <button
            onClick={loadStatistics}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Buku"
          value={stats.totalBooks.toLocaleString()}
          icon={<Book className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Buku Tersedia"
          value={stats.availableBooks.toLocaleString()}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Buku Dipinjam"
          value={stats.borrowedBooks.toLocaleString()}
          icon={<BookOpen className="w-6 h-6 text-orange-600" />}
          color="bg-orange-100"
        />
        <StatCard
          title="Total Pengguna"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Peminjaman Aktif"
          value={stats.activeBorrowings.toLocaleString()}
          icon={<Activity className="w-6 h-6 text-indigo-600" />}
          color="bg-indigo-100"
        />
        <StatCard
          title="Buku Terlambat"
          value={stats.overdueBooks.toLocaleString()}
          icon={<AlertCircle className="w-6 h-6 text-red-600" />}
          color="bg-red-100"
        />
        <StatCard
          title="Peminjaman Hari Ini"
          value={stats.todayBorrows.toLocaleString()}
          icon={<Calendar className="w-6 h-6 text-teal-600" />}
          color="bg-teal-100"
        />
        <StatCard
          title="Peminjaman Bulan Ini"
          value={stats.thisMonthBorrows.toLocaleString()}
          icon={<TrendingUp className="w-6 h-6 text-pink-600" />}
          color="bg-pink-100"
        />
      </div>

      {/* Visitor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pengunjung Hari Ini"
          value={stats.todayVisitors.toLocaleString()}
          icon={<Eye className="w-6 h-6 text-cyan-600" />}
          color="bg-cyan-100"
        />
        <StatCard
          title="Pengunjung Minggu Ini"
          value={stats.weekVisitors.toLocaleString()}
          icon={<Calendar className="w-6 h-6 text-indigo-600" />}
          color="bg-indigo-100"
        />
        <StatCard
          title="Pengunjung Bulan Ini"
          value={stats.monthVisitors.toLocaleString()}
          icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Total Pengunjung"
          value={stats.totalVisitors.toLocaleString()}
          icon={<Users className="w-6 h-6 text-emerald-600" />}
          color="bg-emerald-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Borrowing Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tren Peminjaman</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Grafik tren peminjaman akan ditampilkan di sini</p>
            </div>
          </div>
        </div>

        {/* Book Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Distribusi Status Buku</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Grafik distribusi status buku akan ditampilkan di sini</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default StatisticsDashboardForm;

