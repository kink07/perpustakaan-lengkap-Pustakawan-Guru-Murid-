import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Book, 
  User, 
  Calendar,
  Tag,
  CheckCircle,
  AlertCircle,
  Eye,
  Download
} from 'lucide-react';
import { databaseService } from '../../services/database';
import { BookData } from '../../types/book';

function AdvancedSearchForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    year: '',
    status: '',
    language: '',
    publisher: ''
  });
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [results, setResults] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const categories = [
    'Fiksi', 'Non-Fiksi', 'Pendidikan', 'Sains', 'Teknologi', 
    'Sejarah', 'Biografi', 'Agama', 'Kesehatan', 'Lainnya'
  ];

  const statuses = [
    { value: 'available', label: 'Tersedia' },
    { value: 'borrowed', label: 'Dipinjam' },
    { value: 'maintenance', label: 'Perawatan' },
    { value: 'lost', label: 'Hilang' }
  ];

  const languages = ['Indonesia', 'English', 'Arab', 'Mandarin', 'Lainnya'];

  useEffect(() => {
    if (searchQuery || Object.values(filters).some(filter => filter !== '')) {
      performSearch();
    }
  }, [searchQuery, filters, sortBy, sortOrder]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const books = await databaseService.getBooks();
      
      let filteredBooks = books.filter(book => {
        // Text search
        const matchesQuery = !searchQuery || 
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.publisher.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by category
        const matchesCategory = !filters.category || book.category === filters.category;

        // Filter by author
        const matchesAuthor = !filters.author || 
          book.author.toLowerCase().includes(filters.author.toLowerCase());

        // Filter by year
        const matchesYear = !filters.year || book.publicationYear === filters.year;

        // Filter by status
        const matchesStatus = !filters.status || book.status === filters.status;

        // Filter by language
        const matchesLanguage = !filters.language || book.language === filters.language;

        // Filter by publisher
        const matchesPublisher = !filters.publisher || 
          book.publisher.toLowerCase().includes(filters.publisher.toLowerCase());

        return matchesQuery && matchesCategory && matchesAuthor && 
               matchesYear && matchesStatus && matchesLanguage && matchesPublisher;
      });

      // Sort results
      filteredBooks.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'author':
            aValue = a.author.toLowerCase();
            bValue = b.author.toLowerCase();
            break;
          case 'year':
            aValue = parseInt(a.publicationYear) || 0;
            bValue = parseInt(b.publicationYear) || 0;
            break;
          case 'category':
            aValue = a.category.toLowerCase();
            bValue = b.category.toLowerCase();
            break;
          default:
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
        }

        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      setResults(filteredBooks);
      setTotalResults(filteredBooks.length);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      author: '',
      year: '',
      status: '',
      language: '',
      publisher: ''
    });
    setSearchQuery('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Tersedia':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Dipinjam':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'Perawatan':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Hilang':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pencarian Lanjutan</h1>
          <p className="text-gray-600">Temukan buku dengan filter yang tepat</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan judul, penulis, atau penerbit..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter Pencarian</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Kategori</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Penulis</label>
              <input
                type="text"
                value={filters.author}
                onChange={(e) => setFilters({...filters, author: e.target.value})}
                placeholder="Nama penulis..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Terbit</label>
              <input
                type="number"
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                placeholder="Tahun..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({...filters, language: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Bahasa</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Penerbit</label>
              <input
                type="text"
                value={filters.publisher}
                onChange={(e) => setFilters({...filters, publisher: e.target.value})}
                placeholder="Nama penerbit..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Urutkan berdasarkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="title">Judul</option>
            <option value="author">Penulis</option>
            <option value="year">Tahun Terbit</option>
            <option value="category">Kategori</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          {totalResults} hasil ditemukan
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Book className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                    {getStatusIcon(book.status)}
                  </div>
                  <p className="text-gray-600 mb-2">Oleh: {book.author}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      {book.category}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {book.publicationYear}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {book.publisher}
                    </span>
                  </div>
                  {book.abstract && (
                    <p className="text-gray-600 mt-3 text-sm line-clamp-2">{book.abstract}</p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {results.length === 0 && !loading && (
            <div className="text-center py-12">
              <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada buku yang ditemukan</p>
              <p className="text-gray-400">Coba ubah kata kunci atau filter pencarian</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdvancedSearchForm;

