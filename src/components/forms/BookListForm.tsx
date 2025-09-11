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
}

function BookListForm({ user, onBookAdded }: BookListFormProps) {
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

  // Handle Excel file import
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setShowMappingModal(true);
    }
  };

  // Process Excel import
  const processExcelImport = async () => {
    if (!importFile) return;

    try {
      setLoading(true);
      
      // Parse Excel file with mapping
      const booksData = await ExcelUtils.parseExcelFileWithMapping(importFile, excelMapping);

      const results = await databaseService.importBooksFromExcel(
        booksData, 
        user.id
      );

      setImportResults(results);
      
      if (results.success > 0) {
        // Reload books after successful import
        await loadCatalogBooks();
      }
      
      setShowMappingModal(false);
      setShowImportModal(false);
    } catch (error) {
      console.error('Error importing Excel file:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Excel export
  const handleExcelExport = async () => {
    try {
      setLoading(true);
      const booksData = await databaseService.exportBooksToExcel();
      
      // Export to Excel file
      const filename = `daftar_buku_${new Date().toISOString().split('T')[0]}.xlsx`;
      ExcelUtils.exportToExcel(booksData, filename);
      
      setShowExportModal(false);
    } catch (error) {
      console.error('Error exporting Excel file:', error);
    } finally {
      setLoading(false);
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

  // Delete book
  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus buku ini?')) return;

    try {
      const success = await databaseService.deleteCatalogBook(bookId);
      if (success) {
        setCatalogBooks(prev => prev.filter(book => book.id !== bookId));
      }
    } catch (error) {
      console.error('Error deleting book:', error);
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
              <option value="reserved">Direservasi</option>
              <option value="damaged">Rusak</option>
              <option value="lost">Hilang</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedBooks.length > 0 && (
              <div className="flex items-center space-x-2 mr-4">
                <span className="text-sm text-gray-600">{selectedBooks.length} dipilih</span>
                <button
                  onClick={() => setShowBulkActions(true)}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Aksi Massal
                </button>
              </div>
            )}
            
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import Excel</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={() => ExcelUtils.generateTemplate()}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Template Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Books Grid/List */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada buku</h3>
          <p className="text-gray-500">Mulai tambahkan buku atau import dari Excel</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredBooks.map((book) => (
            <div key={book.id} className={`bg-white rounded-lg shadow-md overflow-hidden ${viewMode === 'list' ? 'flex' : ''} ${selectedBooks.includes(book.id) ? 'ring-2 ring-blue-500' : ''}`}>
              {viewMode === 'grid' ? (
                <>
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {book.cover_image_url ? (
                      <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <Book className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1">{book.title}</h3>
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBooks(prev => [...prev, book.id]);
                          } else {
                            setSelectedBooks(prev => prev.filter(id => id !== book.id));
                          }
                        }}
                        className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <p className="text-gray-600 mb-2">oleh {book.author}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        book.status === 'available' ? 'bg-green-100 text-green-800' :
                        book.status === 'borrowed' ? 'bg-yellow-100 text-yellow-800' :
                        book.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                        book.status === 'damaged' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {book.status === 'available' ? 'Tersedia' :
                         book.status === 'borrowed' ? 'Dipinjam' :
                         book.status === 'reserved' ? 'Direservasi' :
                         book.status === 'damaged' ? 'Rusak' : 'Hilang'}
                      </span>
                      {book.isbn && (
                        <span className="text-xs text-gray-500">ISBN: {book.isbn}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={book.status}
                        onChange={(e) => handleUpdateBookStatus(book.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="available">Tersedia</option>
                        <option value="borrowed">Dipinjam</option>
                        <option value="reserved">Direservasi</option>
                        <option value="damaged">Rusak</option>
                        <option value="lost">Hilang</option>
                      </select>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {book.cover_image_url ? (
                      <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <Book className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start space-x-3 flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{book.title}</h3>
                        <input
                          type="checkbox"
                          checked={selectedBooks.includes(book.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBooks(prev => [...prev, book.id]);
                            } else {
                              setSelectedBooks(prev => prev.filter(id => id !== book.id));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        book.status === 'available' ? 'bg-green-100 text-green-800' :
                        book.status === 'borrowed' ? 'bg-yellow-100 text-yellow-800' :
                        book.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                        book.status === 'damaged' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {book.status === 'available' ? 'Tersedia' :
                         book.status === 'borrowed' ? 'Dipinjam' :
                         book.status === 'reserved' ? 'Direservasi' :
                         book.status === 'damaged' ? 'Rusak' : 'Hilang'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">oleh {book.author}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {book.category && <span>Kategori: {book.category}</span>}
                        {book.isbn && <span className="ml-4">ISBN: {book.isbn}</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={book.status}
                          onChange={(e) => handleUpdateBookStatus(book.id, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="available">Tersedia</option>
                          <option value="borrowed">Dipinjam</option>
                          <option value="reserved">Direservasi</option>
                          <option value="damaged">Rusak</option>
                          <option value="lost">Hilang</option>
                        </select>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Import Data Excel</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih File Excel (.xlsx)
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileImport}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Format Excel yang didukung:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Kolom A: Judul Buku</li>
                  <li>Kolom B: Penulis</li>
                  <li>Kolom C: ISBN (opsional)</li>
                  <li>Kolom D: Penerbit</li>
                  <li>Kolom E: Tahun Terbit</li>
                  <li>Dan seterusnya...</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Export Data Excel</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <FileSpreadsheet className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Export {filteredBooks.length} buku ke file Excel
                </p>
                <button
                  onClick={handleExcelExport}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mx-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Excel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Column Mapping Modal */}
      {showMappingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Mapping Kolom Excel</h3>
              <button
                onClick={() => setShowMappingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Pilih kolom Excel yang sesuai dengan field database:
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Buku</label>
                  <select
                    value={excelMapping.title}
                    onChange={(e) => setExcelMapping(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(col => (
                      <option key={col} value={col}>Kolom {col}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
                  <select
                    value={excelMapping.author}
                    onChange={(e) => setExcelMapping(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(col => (
                      <option key={col} value={col}>Kolom {col}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                  <select
                    value={excelMapping.isbn || ''}
                    onChange={(e) => setExcelMapping(prev => ({ ...prev, isbn: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tidak ada</option>
                    {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(col => (
                      <option key={col} value={col}>Kolom {col}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penerbit</label>
                  <select
                    value={excelMapping.publisher || ''}
                    onChange={(e) => setExcelMapping(prev => ({ ...prev, publisher: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tidak ada</option>
                    {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(col => (
                      <option key={col} value={col}>Kolom {col}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowMappingModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={processExcelImport}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Modal */}
      {showBulkActions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Aksi Massal</h3>
              <button
                onClick={() => setShowBulkActions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                {selectedBooks.length} buku dipilih. Pilih aksi yang akan dilakukan:
              </p>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleBulkStatusUpdate('available')}
                  className="w-full text-left px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Set Status: Tersedia
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('damaged')}
                  className="w-full text-left px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Set Status: Rusak
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('lost')}
                  className="w-full text-left px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Set Status: Hilang
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="w-full text-left px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Hapus Buku
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Results */}
      {importResults && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Import Selesai</span>
          </div>
          <p className="text-sm text-gray-600">
            {importResults.success} buku berhasil diimport
            {importResults.errors.length > 0 && `, ${importResults.errors.length} error`}
          </p>
          <button
            onClick={() => setImportResults(null)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  );
}

export default BookListForm;
