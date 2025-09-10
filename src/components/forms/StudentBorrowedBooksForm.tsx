import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  RefreshCw, 
  Eye, 
  Calendar,
  User,
  Search,
  Filter,
  Download,
  Star,
  CheckCircle,
  AlertCircle,
  Book,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface BorrowedBook {
  id: number;
  title: string;
  author: string;
  callNumber: string;
  borrowDate: string;
  dueDate: string;
  renewalCount: number;
  maxRenewals: number;
  status: 'active' | 'overdue' | 'due_soon';
  cover: string;
  location: string;
  condition: string;
}

function StudentBorrowedBooksForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);

  const borrowedBooks: BorrowedBook[] = [
    {
      id: 1,
      title: "Matematika Kelas X - Kurikulum Merdeka",
      author: "Dr. Ahmad Susanto, M.Pd",
      callNumber: "510.07 SUS m",
      borrowDate: "2024-01-15",
      dueDate: "2024-01-22",
      renewalCount: 0,
      maxRenewals: 2,
      status: 'due_soon',
      cover: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300",
      location: "Rak A-1, Lantai 1",
      condition: "Baik"
    },
    {
      id: 2,
      title: "Fisika Dasar - Mekanika dan Termodinamika",
      author: "Dr. Bambang Ruwanto, M.Si",
      callNumber: "530 RUW f",
      borrowDate: "2024-01-10",
      dueDate: "2024-01-17",
      renewalCount: 1,
      maxRenewals: 2,
      status: 'overdue',
      cover: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300",
      location: "Rak C-2, Lantai 1",
      condition: "Baik"
    },
    {
      id: 3,
      title: "Bahasa Indonesia Kelas XI - Komunikasi Efektif",
      author: "Dra. Sri Wahyuni, M.Pd",
      callNumber: "499.221 WAH b",
      borrowDate: "2024-01-12",
      dueDate: "2024-01-25",
      renewalCount: 0,
      maxRenewals: 2,
      status: 'active',
      cover: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300",
      location: "Rak A-5, Lantai 1",
      condition: "Baik"
    }
  ];

  const filteredBooks = borrowedBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'due_soon': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'due_soon': return 'Segera Jatuh Tempo';
      case 'overdue': return 'Terlambat';
      default: return 'Unknown';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleRenewal = (bookId: number) => {
    alert(`Permintaan perpanjangan untuk buku ID ${bookId} telah dikirim ke pustakawan`);
  };

  const handleSelectBook = (bookId: number) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleBulkRenewal = () => {
    if (selectedBooks.length > 0) {
      alert(`Permintaan perpanjangan untuk ${selectedBooks.length} buku telah dikirim`);
      setSelectedBooks([]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Buku yang Sedang Dipinjam</h2>
              <p className="text-sm text-gray-600">Kelola buku yang sedang Anda pinjam</p>
            </div>
          </div>
          
          {selectedBooks.length > 0 && (
            <button
              onClick={handleBulkRenewal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Perpanjang Terpilih ({selectedBooks.length})
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari buku yang dipinjam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="due_soon">Segera Jatuh Tempo</option>
              <option value="overdue">Terlambat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredBooks.map((book) => {
            const daysUntilDue = getDaysUntilDue(book.dueDate);
            
            return (
              <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book.id)}
                    onChange={() => handleSelectBook(book.id)}
                    className="mt-2 text-blue-600"
                  />
                  
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded border border-gray-200"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                        <p className="text-xs text-gray-500 font-mono">{book.callNumber}</p>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                        {getStatusText(book.status)}
                      </span>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Dipinjam: {new Date(book.borrowDate).toLocaleDateString('id-ID')}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          Jatuh tempo: {new Date(book.dueDate).toLocaleDateString('id-ID')}
                          {daysUntilDue > 0 ? ` (${daysUntilDue} hari lagi)` : 
                           daysUntilDue === 0 ? ' (Hari ini)' : 
                           ` (Terlambat ${Math.abs(daysUntilDue)} hari)`}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        <span>Perpanjangan: {book.renewalCount}/{book.maxRenewals}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{book.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                          <Eye className="w-4 h-4 mr-1 inline" />
                          Detail
                        </button>
                        
                        {book.renewalCount < book.maxRenewals && (
                          <button
                            onClick={() => handleRenewal(book.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          >
                            <RefreshCw className="w-4 h-4 mr-1 inline" />
                            Perpanjang
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Tidak ada buku yang sedang dipinjam</p>
            <p className="text-sm text-gray-500">Kunjungi perpustakaan untuk meminjam buku</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-900">Total Dipinjam</p>
            <p className="text-2xl font-bold text-blue-600">{borrowedBooks.length}</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-yellow-900">Segera Jatuh Tempo</p>
            <p className="text-2xl font-bold text-yellow-600">
              {borrowedBooks.filter(book => book.status === 'due_soon').length}
            </p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-red-900">Terlambat</p>
            <p className="text-2xl font-bold text-red-600">
              {borrowedBooks.filter(book => book.status === 'overdue').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentBorrowedBooksForm;