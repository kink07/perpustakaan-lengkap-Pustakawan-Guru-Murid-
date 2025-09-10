import React, { useState } from 'react';
import { 
  Clock, 
  Book, 
  Star, 
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  BarChart3,
  TrendingUp,
  Award,
  Target,
  CheckCircle
} from 'lucide-react';

interface ReadingHistory {
  id: number;
  title: string;
  author: string;
  category: string;
  borrowDate: string;
  returnDate: string;
  rating: number;
  review: string;
  readingTime: number; // in hours
  cover: string;
  completionStatus: 'completed' | 'partial' | 'not_started';
}

function StudentReadingHistoryForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'stats'>('list');

  const readingHistory: ReadingHistory[] = [
    {
      id: 1,
      title: "Sejarah Indonesia Modern",
      author: "Prof. Dr. Sartono Kartodirdjo",
      category: "900",
      borrowDate: "2023-12-01",
      returnDate: "2023-12-15",
      rating: 5,
      review: "Buku yang sangat informatif tentang sejarah Indonesia",
      readingTime: 12,
      cover: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300",
      completionStatus: 'completed'
    },
    {
      id: 2,
      title: "Kimia Organik - Struktur dan Reaksi",
      author: "Prof. Dr. Mulyono Hadi",
      category: "500",
      borrowDate: "2023-11-15",
      returnDate: "2023-11-29",
      rating: 4,
      review: "Penjelasan yang detail tentang kimia organik",
      readingTime: 8,
      cover: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300",
      completionStatus: 'completed'
    },
    {
      id: 3,
      title: "Biologi Sel dan Molekuler",
      author: "Dr. Siti Rahayu, M.Si",
      category: "500",
      borrowDate: "2023-10-20",
      returnDate: "2023-11-03",
      rating: 5,
      review: "Sangat membantu untuk memahami biologi sel",
      readingTime: 15,
      cover: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300",
      completionStatus: 'completed'
    }
  ];

  const filteredHistory = readingHistory.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    
    let matchesPeriod = true;
    if (filterPeriod !== 'all') {
      const returnDate = new Date(book.returnDate);
      const now = new Date();
      const diffMonths = (now.getFullYear() - returnDate.getFullYear()) * 12 + now.getMonth() - returnDate.getMonth();
      
      switch (filterPeriod) {
        case 'month':
          matchesPeriod = diffMonths < 1;
          break;
        case 'quarter':
          matchesPeriod = diffMonths < 3;
          break;
        case 'year':
          matchesPeriod = diffMonths < 12;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesPeriod;
  });

  const totalBooksRead = readingHistory.length;
  const totalReadingHours = readingHistory.reduce((sum, book) => sum + book.readingTime, 0);
  const averageRating = readingHistory.reduce((sum, book) => sum + book.rating, 0) / readingHistory.length;
  const favoriteCategory = readingHistory.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCategory = Object.entries(favoriteCategory).sort(([,a], [,b]) => b - a)[0];

  const renderStats = () => (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Buku Dibaca</p>
              <p className="text-2xl font-bold text-blue-900">{totalBooksRead}</p>
            </div>
            <Book className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Jam Membaca</p>
              <p className="text-2xl font-bold text-green-900">{totalReadingHours}</p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Rating Rata-rata</p>
              <p className="text-2xl font-bold text-yellow-900">{averageRating.toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Kategori Favorit</p>
              <p className="text-lg font-bold text-purple-900">{topCategory?.[0] || 'N/A'}</p>
            </div>
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Reading Progress Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Progress Membaca Bulanan</h4>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Grafik progress membaca akan ditampilkan di sini</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Pencapaian Literasi</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <Award className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="font-medium text-gray-900">Pembaca Aktif</p>
              <p className="text-sm text-gray-600">Membaca 10+ buku</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Reviewer Handal</p>
              <p className="text-sm text-gray-600">Menulis 5+ review</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Konsisten</p>
              <p className="text-sm text-gray-600">Membaca rutin 3 bulan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderList = () => (
    <div className="space-y-4">
      {filteredHistory.map((book) => (
        <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-4">
            <img
              src={book.cover}
              alt={book.title}
              className="w-16 h-20 object-cover rounded border border-gray-200"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
                
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < book.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Selesai: {new Date(book.returnDate).toLocaleDateString('id-ID')}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Waktu baca: {book.readingTime} jam</span>
                </div>
                
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="capitalize">{book.completionStatus === 'completed' ? 'Selesai' : 'Sebagian'}</span>
                </div>
              </div>
              
              {book.review && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 italic">"{book.review}"</p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Kategori: {book.category}</span>
                <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                  <Eye className="w-4 h-4 mr-1 inline" />
                  Baca Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Riwayat Bacaan</h2>
              <p className="text-sm text-gray-600">Lihat semua buku yang pernah Anda baca</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'stats' : 'list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'stats' 
                  ? 'bg-blue-600 text-white' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {viewMode === 'stats' ? (
                <>
                  <Book className="w-4 h-4 mr-2 inline" />
                  Lihat Daftar
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2 inline" />
                  Lihat Statistik
                </>
              )}
            </button>
            
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari dalam riwayat bacaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Periode</option>
            <option value="month">Bulan Ini</option>
            <option value="quarter">3 Bulan Terakhir</option>
            <option value="year">Tahun Ini</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="000">000 - Komputer</option>
            <option value="100">100 - Filsafat</option>
            <option value="200">200 - Agama</option>
            <option value="300">300 - Sosial</option>
            <option value="400">400 - Bahasa</option>
            <option value="500">500 - Sains</option>
            <option value="600">600 - Teknologi</option>
            <option value="700">700 - Seni</option>
            <option value="800">800 - Sastra</option>
            <option value="900">900 - Sejarah</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {viewMode === 'stats' ? renderStats() : renderList()}
        
        {viewMode === 'list' && filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Belum ada riwayat bacaan</p>
            <p className="text-sm text-gray-500">Mulai meminjam buku untuk melihat riwayat</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentReadingHistoryForm;