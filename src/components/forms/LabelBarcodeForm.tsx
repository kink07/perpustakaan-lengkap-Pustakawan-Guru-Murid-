import { useState, useEffect } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  X, 
  Trash2, 
  Loader2,
  Printer,
  Settings,
  QrCode,
  Barcode,
  Copy
} from 'lucide-react';
import { databaseService } from '../../services/database';
import { BookLabel, CatalogBook } from '../../types/database';

interface LabelBarcodeFormProps {
  user: any;
  onBookAdded?: () => void;
}

function LabelBarcodeForm({ user, onBookAdded }: LabelBarcodeFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemplate, setFilterTemplate] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [bookLabels, setBookLabels] = useState<BookLabel[]>([]);
  const [catalogBooks, setCatalogBooks] = useState<CatalogBook[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [labelSettings, setLabelSettings] = useState({
    labelSize: 'medium' as 'small' | 'medium' | 'large',
    barcodeSize: 'medium' as 'small' | 'medium' | 'large',
    labelTemplate: 'standard',
    includeTitle: true,
    includeAuthor: true,
    includeISBN: true,
    includeLocation: true,
    includeBarcode: true
  });

  // Load book labels and catalog books from database
  useEffect(() => {
    loadBookLabels();
    loadCatalogBooks();
  }, []);

  const loadBookLabels = async () => {
    try {
      setLoading(true);
      const labels = await databaseService.getBookLabels();
      setBookLabels(labels);
    } catch (error) {
      console.error('Error loading book labels:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogBooks = async () => {
    try {
      const books = await databaseService.getCatalogBooks();
      setCatalogBooks(books);
    } catch (error) {
      console.error('Error loading catalog books:', error);
    }
  };

  // Generate labels for selected books
  const handleGenerateLabels = async () => {
    try {
      setLoading(true);
      
      for (const bookId of selectedBooks) {
        // Check if label already exists
        const existingLabel = bookLabels.find(label => label.book_id === bookId);
        
        if (!existingLabel) {
          // Generate new label
          const newLabel = await databaseService.createBookLabel(bookId, {
            label_template: labelSettings.labelTemplate,
            label_size: labelSettings.labelSize,
            barcode_size: labelSettings.barcodeSize,
            created_by: user.id
          });
          
          if (newLabel) {
            setBookLabels(prev => [newLabel, ...prev]);
            
            // Trigger refresh of books in other components
            if (onBookAdded) {
              onBookAdded();
            }
          }
        }
      }
      
      setSelectedBooks([]);
      setShowGenerateModal(false);
      
      // Trigger refresh of books in other components
      if (onBookAdded) {
        onBookAdded();
      }
    } catch (error) {
      console.error('Error generating labels:', error);
    } finally {
      setLoading(false);
    }
  };

  // Print label
  const handlePrintLabel = async (labelId: string) => {
    try {
      const success = await databaseService.printBookLabel(labelId);
      if (success) {
        // Update print count in local state
        setBookLabels(prev => prev.map(label => 
          label.id === labelId 
            ? { ...label, print_count: (label.print_count || 0) + 1, last_printed_at: new Date().toISOString() }
            : label
        ));
        
        // Trigger refresh of books in other components
        if (onBookAdded) {
          onBookAdded();
        }
      }
    } catch (error) {
      console.error('Error printing label:', error);
    }
  };


  // Delete label
  const handleDeleteLabel = async (labelId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus label ini?')) return;

    try {
      const success = await databaseService.deleteBookLabel(labelId);
      if (success) {
        setBookLabels(prev => prev.filter(label => label.id !== labelId));
        
        // Trigger refresh of books in other components
        if (onBookAdded) {
          onBookAdded();
        }
      }
    } catch (error) {
      console.error('Error deleting label:', error);
    }
  };

  // Copy barcode to clipboard
  const handleCopyBarcode = async (barcode: string) => {
    try {
      await navigator.clipboard.writeText(barcode);
      // Show success message (you can implement a toast notification here)
    } catch (error) {
      console.error('Error copying barcode:', error);
    }
  };

  // Filter labels based on search and filters
  const filteredLabels = bookLabels.filter(label => {
    const book = label.book;
    if (!book) return false;
    
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         label.barcode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTemplate = filterTemplate === 'all' || label.label_template === filterTemplate;
    const matchesSize = filterSize === 'all' || label.label_size === filterSize;
    return matchesSearch && matchesTemplate && matchesSize;
  });

  // Get unique templates and sizes for filter
  const templates = [...new Set(bookLabels.map(label => label.label_template).filter(Boolean))];
  const sizes = [...new Set(bookLabels.map(label => label.label_size).filter(Boolean))];

  // Get books without labels
  const booksWithoutLabels = catalogBooks.filter(book => 
    !bookLabels.some(label => label.book_id === book.id)
  );

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Label & Barcode</h2>
        <p className="text-gray-600">Kelola label dan barcode untuk buku perpustakaan</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari judul, penulis, atau barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterTemplate}
              onChange={(e) => setFilterTemplate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Template</option>
              {templates.map(template => (
                <option key={template} value={template}>{template}</option>
              ))}
            </select>
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Ukuran</option>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
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
                  onClick={() => setShowGenerateModal(true)}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Generate Label
                </button>
              </div>
            )}
            
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Labels Grid/List */}
      {filteredLabels.length === 0 ? (
        <div className="text-center py-12">
          <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada label</h3>
          <p className="text-gray-500">Generate label untuk buku yang belum memiliki label</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredLabels.map((label) => (
            <div key={label.id} className={`bg-white rounded-lg shadow-md overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
              {viewMode === 'grid' ? (
                <>
                  <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                    <div className="text-center">
                      <Barcode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <div className="text-xs font-mono bg-white p-2 rounded border">
                        {label.barcode}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                      {label.book?.title || 'Unknown Book'}
                    </h3>
                    <p className="text-gray-600 mb-2">oleh {label.book?.author || 'Unknown Author'}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        label.label_size === 'small' ? 'bg-blue-100 text-blue-800' :
                        label.label_size === 'medium' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {label.label_size} label
                      </span>
                      <span className="text-xs text-gray-500">
                        Print: {label.print_count || 0}x
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePrintLabel(label.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Print Label"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopyBarcode(label.barcode)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Copy Barcode"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLabel(label.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Label"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Barcode className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {label.book?.title || 'Unknown Book'}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        label.label_size === 'small' ? 'bg-blue-100 text-blue-800' :
                        label.label_size === 'medium' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {label.label_size} label
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">oleh {label.book?.author || 'Unknown Author'}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {label.barcode}
                        </span>
                        <span className="ml-4">Print: {label.print_count || 0}x</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePrintLabel(label.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Print Label"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCopyBarcode(label.barcode)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Copy Barcode"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLabel(label.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Label"
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pengaturan Label & Barcode</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran Label</label>
                <select
                  value={labelSettings.labelSize}
                  onChange={(e) => setLabelSettings(prev => ({ ...prev, labelSize: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="small">Small (50x30mm)</option>
                  <option value="medium">Medium (70x40mm)</option>
                  <option value="large">Large (100x60mm)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran Barcode</label>
                <select
                  value={labelSettings.barcodeSize}
                  onChange={(e) => setLabelSettings(prev => ({ ...prev, barcodeSize: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Label</label>
                <select
                  value={labelSettings.labelTemplate}
                  onChange={(e) => setLabelSettings(prev => ({ ...prev, labelTemplate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="standard">Standard</option>
                  <option value="compact">Compact</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Elemen Label</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={labelSettings.includeTitle}
                      onChange={(e) => setLabelSettings(prev => ({ ...prev, includeTitle: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Judul Buku</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={labelSettings.includeAuthor}
                      onChange={(e) => setLabelSettings(prev => ({ ...prev, includeAuthor: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Penulis</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={labelSettings.includeISBN}
                      onChange={(e) => setLabelSettings(prev => ({ ...prev, includeISBN: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">ISBN</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={labelSettings.includeLocation}
                      onChange={(e) => setLabelSettings(prev => ({ ...prev, includeLocation: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Lokasi</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={labelSettings.includeBarcode}
                      onChange={(e) => setLabelSettings(prev => ({ ...prev, includeBarcode: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Barcode</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Labels Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Generate Label untuk Buku</h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Pilih buku yang akan dibuat labelnya:
              </p>
              
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {booksWithoutLabels.map((book) => (
                  <div key={book.id} className="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0">
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
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{book.title}</h4>
                      <p className="text-sm text-gray-600">oleh {book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {booksWithoutLabels.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Semua buku sudah memiliki label
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleGenerateLabels}
                disabled={selectedBooks.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Generate {selectedBooks.length} Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabelBarcodeForm;