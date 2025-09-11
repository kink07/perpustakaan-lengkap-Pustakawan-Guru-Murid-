import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  User as UserIcon, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { databaseService } from '../../services/database';
import { BorrowRecord, User as UserType } from '../../types/database';

interface BorrowRecordWithUser extends BorrowRecord {
  user?: UserType;
  book?: any;
}

function ActiveBorrowingsForm() {
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecordWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('borrow_date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadActiveBorrowings();
  }, []);

  const loadActiveBorrowings = async () => {
    try {
      setLoading(true);
      const records = await databaseService.getBorrowRecords();
      const users = await databaseService.getUsers();
      const books = await databaseService.getBooks();

      // Filter only active borrowings
      const activeRecords = records.filter(record => record.status === 'active');

      // Enrich records with user and book data
      const enrichedRecords = activeRecords.map(record => ({
        ...record,
        user: users.find(user => user.id === record.user_id),
        book: books.find(book => book.id === record.book_id)
      }));

      setBorrowRecords(enrichedRecords);
    } catch (error) {
      console.error('Error loading active borrowings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (record: BorrowRecordWithUser) => {
    const dueDate = new Date(record.due_date);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) {
      return {
        status: 'overdue',
        label: 'Terlambat',
        color: 'text-red-600 bg-red-100',
        days: Math.abs(daysUntilDue)
      };
    } else if (daysUntilDue <= 3) {
      return {
        status: 'warning',
        label: 'Mendekati Jatuh Tempo',
        color: 'text-yellow-600 bg-yellow-100',
        days: daysUntilDue
      };
    } else {
      return {
        status: 'normal',
        label: 'Aktif',
        color: 'text-green-600 bg-green-100',
        days: daysUntilDue
      };
    }
  };

  const filteredRecords = borrowRecords.filter(record => {
    const matchesSearch = !searchQuery || 
      record.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.user?.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || 
      getStatusInfo(record).status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'borrow_date':
        aValue = new Date(a.borrow_date).getTime();
        bValue = new Date(b.borrow_date).getTime();
        break;
      case 'due_date':
        aValue = new Date(a.due_date).getTime();
        bValue = new Date(b.due_date).getTime();
        break;
      case 'user_name':
        aValue = a.user?.name || '';
        bValue = b.user?.name || '';
        break;
      case 'book_title':
        aValue = a.book?.title || '';
        bValue = b.book?.title || '';
        break;
      default:
        aValue = new Date(a.borrow_date).getTime();
        bValue = new Date(b.borrow_date).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleReturnBook = async (recordId: string) => {
    try {
      await databaseService.updateBorrowRecord(recordId, {
        status: 'returned',
        return_date: new Date().toISOString()
      });
      
      // Log activity
      await databaseService.createActivity({
        user_id: recordId, // This should be the current user ID
        type: 'return',
        description: 'Buku dikembalikan'
      });

      loadActiveBorrowings();
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const handleExtendBorrowing = async (recordId: string) => {
    try {
      const record = borrowRecords.find(r => r.id === recordId);
      if (record) {
        const newDueDate = new Date(record.due_date);
        newDueDate.setDate(newDueDate.getDate() + 7); // Extend by 7 days

        await databaseService.updateBorrowRecord(recordId, {
          due_date: newDueDate.toISOString()
        });

        loadActiveBorrowings();
      }
    } catch (error) {
      console.error('Error extending borrowing:', error);
    }
  };

  const statusCounts = {
    total: borrowRecords.length,
    overdue: borrowRecords.filter(r => getStatusInfo(r).status === 'overdue').length,
    warning: borrowRecords.filter(r => getStatusInfo(r).status === 'warning').length,
    normal: borrowRecords.filter(r => getStatusInfo(r).status === 'normal').length
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Peminjaman Aktif</h1>
          <p className="text-gray-600">Kelola peminjaman buku yang sedang berlangsung</p>
        </div>
        <button
          onClick={loadActiveBorrowings}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Terlambat</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.overdue}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Peringatan</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.warning}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Normal</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.normal}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan nama, email, atau judul buku..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="overdue">Terlambat</option>
              <option value="warning">Peringatan</option>
              <option value="normal">Normal</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="borrow_date">Tanggal Pinjam</option>
              <option value="due_date">Jatuh Tempo</option>
              <option value="user_name">Nama Peminjam</option>
              <option value="book_title">Judul Buku</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peminjam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buku
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Pinjam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jatuh Tempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRecords.map((record) => {
                const statusInfo = getStatusInfo(record);
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.user?.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.user?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {record.book?.title || 'Unknown Book'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.book?.author || 'Unknown Author'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.borrow_date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.due_date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                        {statusInfo.days !== undefined && (
                          <span className="ml-1">
                            ({statusInfo.days} hari)
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReturnBook(record.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Kembalikan
                        </button>
                        <button
                          onClick={() => handleExtendBorrowing(record.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Perpanjang
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {sortedRecords.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Tidak ada peminjaman aktif</p>
            <p className="text-gray-400">Semua buku telah dikembalikan</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActiveBorrowingsForm;
