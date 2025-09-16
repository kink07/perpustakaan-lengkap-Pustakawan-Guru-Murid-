import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  X, 
  Eye, 
  Edit, 
  Trash2, 
  Upload,
  Download,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  Settings,
  RefreshCw
} from 'lucide-react';
import { databaseService } from '../../services/database';
import { CatalogBook, ExcelBookData, ExcelMapping } from '../../types/database';
import { ExcelUtils } from '../../utils/excelUtils';

interface BookListFormProps {
  user: any;
  onBookAdded?: () => void;
  onEditBook?: (book: CatalogBook) => void;
}

function BookListForm({ user, onBookAdded, onEditBook }: BookListFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [catalogBooks, setCatalogBooks] = useState<CatalogBook[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [excelMapping, setExcelMapping] = useState<ExcelMapping>({
    title: 'A',
    author: 'B',
    isbn: 'C',
    publisher: 'D',
    publication_year: 'E',
    category: 'F',
    subcategory: 'G',
    language: 'H',
    pages: 'I',
    description: 'J',
    status: 'K',
    location: 'L',
    acquisition_date: 'M',
    acquisition_method: 'N',
    price: 'O',
    notes: 'P'
  });
  const [importResults, setImportResults] = useState<{ success: number; errors: any[] } | null>(null);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  // Load catalog books from database
  useEffect(() => {
    loadCatalogBooks();
  }, []);

  const loadCatalogBooks = async () => {
    try {
      setLoading(true);
      const books = await databaseService.getCatalogBooks();
      setCatalogBooks(books);
    } catch (error) {
      console.error('Error loading catalog books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBooks([]);
      setSelectAll(false);
      setShowBulkActions(false);
    } else {
      const allBookIds = filteredBooks.map(book => book.id);
      setSelectedBooks(allBookIds);
      setSelectAll(true);
      setShowBulkActions(true);
    }
  };

  // Handle individual book selection
  const handleSelectBook = (bookId: string) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
      setSelectAll(false);
      if (selectedBooks.length === 1) {
        setShowBulkActions(false);
      }
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
      setShowBulkActions(true);
    }
  };

  // Handle edit book - use callback to Dashboard
  const handleEditBook = (book: CatalogBook) => {
    if (onEditBook) {
      onEditBook(book);
    }
  };

  // Delete book
  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus buku ini?')) return;

    try {
      const success = await databaseService.deleteCatalogBook(bookId);
      if (success) {
        await loadCatalogBooks();
        if (onBookAdded) onBookAdded();
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  // Update book status
  const handleUpdateBookStatus = async (bookId: string, newStatus: string) => {
    try {
      const success = await databaseService.updateBookStatus(bookId, newStatus, 'Status updated via Book List', user.id);
      if (success) {
        await loadCatalogBooks();
      }
    } catch (error) {
      console.error('Error updating book status:', error);
    }
  };

  // Bulk actions
  const handleBulkStatusUpdate = async (newStatus: string) => {
    try {
      for (const bookId of selectedBooks) {
        await databaseService.updateBookStatus(bookId, newStatus, 'Bulk status update', user.id);
      }
      setSelectedBooks([]);
      setShowBulkActions(false);
      await loadCatalogBooks();
    } catch (error) {
      console.error('Error updating bulk status:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedBooks.length} buku yang dipilih?`)) return;

    try {
      for (const bookId of selectedBooks) {
        await databaseService.deleteCatalogBook(bookId);
      }
      setSelectedBooks([]);
      setShowBulkActions(false);
      await loadCatalogBooks();
    } catch (error) {
      console.error('Error deleting bulk books:', error);
    }
  };

  // Filter books based on search and filters
  const filteredBooks = catalogBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (book.isbn && book.isbn.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categories = [...new Set(catalogBooks.map(book => book.category).filter(Boolean))];

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'borrowed': return 'bg-blue-100 text-blue-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      case 'lost': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Tersedia';
      case 'borrowed': return 'Dipinjam';
      case 'reserved': return 'Dipesan';
      case 'damaged': return 'Rusak';
      case 'lost': return 'Hilang';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Daftar Buku</h2>
        <p className="text-gray-600">Kelola daftar buku perpustakaan dengan import/export Excel</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari judul, penulis, atau ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="available">Tersedia</option>
              <option value="borrowed">Dipinjam</option>
              <option value="reserved">Dipesan</option>
              <option value="damaged">Rusak</option>
              <option value="lost">Hilang</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Pilih Semua</span>
          </label>
          
          {showBulkActions && (
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Ubah Status</option>
                <option value="available">Tersedia</option>
                <option value="borrowed">Dipinjam</option>
                <option value="reserved">Dipesan</option>
                <option value="damaged">Rusak</option>
                <option value="lost">Hilang</option>
              </select>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import Excel</span>
          </button>
          
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Books List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredBooks.map((book) => (
          <div key={book.id} className={`bg-white rounded-lg shadow-md overflow-hidden ${viewMode === 'list' ? 'flex' : ''} ${selectedBooks.includes(book.id) ? 'ring-2 ring-blue-500' : ''}`}>
            {viewMode === 'grid' ? (
              <>
                <div className="relative h-48 bg-gray-200">
                  {book.cover_image_url || book.cover ? (
                    <img 
                      src={book.cover_image_url || book.cover} 
                      alt={book.title} 
                      className="w-full h-48 object-contain bg-gray-50" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center" style={{ display: book.cover_image_url || book.cover ? 'none' : 'flex' }}>
                    <Book className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book.id)}
                      onChange={() => handleSelectBook(book.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ml-2"
                    />
                  </div>
                  <p className="text-gray-600 text-sm mb-2">oleh {book.author}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                      {getStatusLabel(book.status)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditBook(book)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="Edit Buku"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <select
                        value={book.status}
                        onChange={(e) => handleUpdateBookStatus(book.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="available">Tersedia</option>
                        <option value="borrowed">Dipinjam</option>
                        <option value="reserved">Dipesan</option>
                        <option value="damaged">Rusak</option>
                        <option value="lost">Hilang</option>
                      </select>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Hapus Buku"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {book.cover_image_url || book.cover ? (
                    <img 
                      src={book.cover_image_url || book.cover} 
                      alt={book.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center" style={{ display: book.cover_image_url || book.cover ? 'none' : 'flex' }}>
                    <Book className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-gray-600 text-sm">oleh {book.author}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book.id)}
                      onChange={() => handleSelectBook(book.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                      {getStatusLabel(book.status)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditBook(book)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="Edit Buku"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <select
                        value={book.status}
                        onChange={(e) => handleUpdateBookStatus(book.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="available">Tersedia</option>
                        <option value="borrowed">Dipinjam</option>
                        <option value="reserved">Dipesan</option>
                        <option value="damaged">Rusak</option>
                        <option value="lost">Hilang</option>
                      </select>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Hapus Buku"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada buku yang ditemukan</p>
        </div>
      )}
    </div>
  );
}

export default BookListForm;