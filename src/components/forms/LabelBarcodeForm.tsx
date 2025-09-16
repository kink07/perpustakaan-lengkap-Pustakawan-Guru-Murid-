import { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Loader2,
  Printer,
  Settings,
  QrCode,
  Eye,
  CheckSquare,
  Square,
  Book,
  BookOpen
} from 'lucide-react';
import { databaseService } from '../../services/database';
import { BookLabel, CatalogBook } from '../../types/database';

interface LabelBarcodeFormProps {
  user: any;
  onBookAdded?: () => void;
}

function LabelBarcodeForm({ user, onBookAdded }: LabelBarcodeFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookLabels, setBookLabels] = useState<BookLabel[]>([]);
  const [catalogBooks, setCatalogBooks] = useState<CatalogBook[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewLabel, setPreviewLabel] = useState<BookLabel | null>(null);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [labelSettings, setLabelSettings] = useState({
    labelSize: 'medium' as 'small' | 'medium' | 'large',
    barcodeSize: 'medium' as 'small' | 'medium' | 'large',
    labelTemplate: 'standard',
    includeTitle: true,
    includeAuthor: false,
    includeCallNumber: true,
    includeBarcode: true,
    includeYear: true,
    libraryName: 'Perpustakaan SDN Pejaten Timur 11 Pagi'
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

  // Preview label
  const handlePreviewLabel = (label: BookLabel) => {
    setPreviewLabel(label);
    setShowPreviewModal(true);
  };

  // Load JsBarcode script when preview modal opens
  useEffect(() => {
    if (showPreviewModal && previewLabel) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js';
      script.onload = () => {
        if (typeof (window as any).JsBarcode !== 'undefined') {
          try {
            (window as any).JsBarcode(`#preview-barcode-${previewLabel.barcode}`, previewLabel.barcode, {
              format: "CODE128",
              width: 1,
              height: 50,
              displayValue: true,
              margin: 3,
              background: "white",
              lineColor: "black",
              fontSize: 8,
              textAlign: "center",
              textPosition: "bottom",
              textMargin: 2,
              valid: function(valid: boolean) {
                if (valid) {
                  console.log('Preview barcode generated successfully for scanner');
                } else {
                  console.error('Invalid preview barcode data for scanner');
                }
              },
              quietZone: 3,
              flat: true,
              font: "monospace"
            });
          } catch (error) {
            console.error('Error generating preview barcode:', error);
          }
        }
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [showPreviewModal, previewLabel]);

  // Filter labels based on search
  const filteredLabels = bookLabels.filter(label => {
    const book = label.book;
    if (!book) return false;
    
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         label.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.publication_year?.toString().includes(searchQuery) ||
                         book.callNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Select/Deselect all labels
  const handleSelectAllLabels = () => {
    if (selectedLabels.length === filteredLabels.length) {
      setSelectedLabels([]);
    } else {
      setSelectedLabels(filteredLabels.map(label => label.id));
    }
  };

  // Select/Deselect individual label
  const handleSelectLabel = (labelId: string) => {
    setSelectedLabels(prev => 
      prev.includes(labelId) 
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  // Print selected labels
  const handlePrintSelectedLabels = async () => {
    try {
      setLoading(true);
      
      const success = await databaseService.printMultipleLabels(selectedLabels);
      
      if (success) {
        // Update print counts in local state
        setBookLabels(prev => prev.map(label => 
          selectedLabels.includes(label.id) 
            ? { ...label, print_count: (label.print_count || 0) + 1, last_printed_at: new Date().toISOString() }
            : label
        ));
        
        setSelectedLabels([]);
        
        // Trigger refresh of books in other components
        if (onBookAdded) {
          onBookAdded();
        }
      }
    } catch (error) {
      console.error('Error printing selected labels:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fix incompatible barcodes
  const handleFixBarcodes = async () => {
    try {
      setLoading(true);
      
      const result = await databaseService.fixIncompatibleBarcodes();
      
      if (result.fixed > 0) {
        alert(`Berhasil memperbaiki ${result.fixed} dari ${result.total} barcode yang tidak kompatibel dengan scanner.`);
        // Reload labels to show updated barcodes
        await loadBookLabels();
        
        // Trigger refresh of books in other components
        if (onBookAdded) {
          onBookAdded();
        }
      } else {
        alert('Semua barcode sudah kompatibel dengan scanner atau tidak ada barcode yang perlu diperbaiki.');
      }
    } catch (error) {
      console.error('Error fixing barcodes:', error);
      alert('Terjadi kesalahan saat memperbaiki barcode.');
    } finally {
      setLoading(false);
    }
  };

  // Generate industrial barcode SVG for display
  const generateBarcodeSVG = (barcode: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    const width = size === 'small' ? 200 : size === 'medium' ? 300 : 400;
    const height = size === 'small' ? 40 : size === 'medium' ? 60 : 80;
    
    // Use a placeholder that will be replaced by JsBarcode
    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" id="preview-barcode-${barcode}">
        <rect x="0" y="0" width="${width}" height="${height}" fill="white" stroke="black" stroke-width="1"/>
        <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="monospace" font-size="12" fill="black">Loading...</text>
      </svg>
    `;
  };

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
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cetak Label & Barcode</h2>
            <p className="text-gray-600">Generate dan cetak label untuk koleksi buku</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleFixBarcodes}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              title="Perbaiki barcode yang tidak kompatibel dengan scanner"
            >
              <Settings className="w-4 h-4" />
              <span>Perbaiki Barcode</span>
            </button>
            
            {filteredLabels.length > 0 && (
                <button
                onClick={() => handlePreviewLabel(filteredLabels[0])}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
                </button>
            )}
            
            {selectedLabels.length > 0 && (
            <button
                onClick={handlePrintSelectedLabels}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Printer className="w-4 h-4" />
                <span>Cetak</span>
            </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Buku</p>
              <p className="text-2xl font-bold text-gray-900">{catalogBooks.length}</p>
        </div>
            <Book className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dipilih</p>
              <p className="text-2xl font-bold text-gray-900">{selectedLabels.length}</p>
                  </div>
            <CheckSquare className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dengan Barcode</p>
              <p className="text-2xl font-bold text-gray-900">{bookLabels.length}</p>
                      </div>
            <QrCode className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Barcode Valid</p>
              <p className="text-2xl font-bold text-gray-900">{bookLabels.filter(label => databaseService.validateBarcode(label.barcode)).length}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Settings */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Pengaturan Label</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran Label</label>
                <select
                  value={labelSettings.labelSize}
                  onChange={(e) => setLabelSettings(prev => ({ ...prev, labelSize: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="small">Kecil (5x3 cm)</option>
                  <option value="medium">Sedang (7x4 cm)</option>
                  <option value="large">Besar (10x6 cm)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Informasi yang Disertakan</label>
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
                      checked={labelSettings.includeCallNumber}
                      onChange={(e) => setLabelSettings(prev => ({ ...prev, includeCallNumber: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Call Number</span>
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
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={labelSettings.includeYear}
                      onChange={(e) => setLabelSettings(prev => ({ ...prev, includeYear: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tahun Terbit</span>
                  </label>
              </div>
            </div>

              <button
                onClick={handleSelectAllLabels}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Pilih Semua
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Book List */}
        <div className="lg:col-span-2">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari berdasarkan judul, pengarang, tahun terbit, barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Book List Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={handleSelectAllLabels}
                        className="flex items-center space-x-2"
                      >
                        {selectedLabels.length === filteredLabels.length && filteredLabels.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BUKU
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TAHUN TERBIT
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BARCODE
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CALL NUMBER
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KATEGORI
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AKSI
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLabels.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>Tidak ada label ditemukan</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLabels.map((label) => (
                      <tr key={label.id} className={selectedLabels.includes(label.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleSelectLabel(label.id)}
                            className="flex items-center"
                          >
                            {selectedLabels.includes(label.id) ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {label.book?.title || 'Unknown Book'}
                            </div>
                            <div className="text-sm text-gray-500">
                              oleh {label.book?.author || 'Unknown Author'}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {label.book?.publication_year || '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          <div className="flex items-center space-x-2">
                            <span className={databaseService.validateBarcode(label.barcode) ? 'text-green-600' : 'text-red-600'}>
                              {label.barcode}
                            </span>
                            {!databaseService.validateBarcode(label.barcode) && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Tidak Valid
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {label.book?.callNumber || '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {label.book?.category || 'Umum'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handlePreviewLabel(label)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Preview Label"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePrintLabel(label.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Print Label"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


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

      {/* Preview Label Modal */}
      {showPreviewModal && previewLabel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Preview Label & Barcode</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Label Preview */}
              <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Preview Label ({previewLabel.label_size})</h4>
                
                {/* Label sesuai gambar - Layout 2 kolom */}
                <div className={`relative border border-black bg-white mx-auto ${labelSettings.labelSize === 'small' ? 'w-48 h-32' : labelSettings.labelSize === 'medium' ? 'w-64 h-40' : 'w-80 h-48'}`}>
                  {/* Garis pembagi vertikal */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black transform -translate-x-1/2"></div>
                  
                  {/* Kolom Kiri */}
                  <div className="absolute left-0 top-0 bottom-0 w-1/2 p-2 flex flex-col items-center justify-center">
                    {/* Judul */}
                    <div className="text-center mb-2">
                      <span className="text-xs font-bold">{previewLabel.book?.title || 'Judul Buku'}</span>
                    </div>
                    
                    {/* Barcode */}
                    <div className="flex justify-center mb-2">
                      <div className="bg-white border border-black p-1">
                        <div dangerouslySetInnerHTML={{ __html: generateBarcodeSVG(previewLabel.barcode, labelSettings.barcodeSize) }} />
                      </div>
                    </div>
                    
                    {/* No Barcode */}
                    <div className="text-center">
                      <span className="text-xs font-mono">{previewLabel.barcode}</span>
                    </div>
                  </div>
                  
                  {/* Kolom Kanan - Center aligned */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 p-2 flex flex-col justify-center items-center text-center">
                    {/* Nama Perpustakaan */}
                    <div className="mb-2">
                      <div className="text-xs leading-tight">{labelSettings.libraryName}</div>
                    </div>
                    
                    {/* Nomor Panggil */}
                    <div className="mb-2">
                      <div className="text-xs font-mono leading-tight text-center">
                        {(previewLabel.book?.callNumber || '000.00 ABC a').split(' ').map((word, index) => (
                          <div key={index}>{word}</div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tahun Terbit */}
                    <div>
                      <div className="text-xs">{previewLabel.book?.publication_year || '2025'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Label Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran Label</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran Barcode</label>
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
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Perpustakaan</label>
                  <input
                    type="text"
                    value={labelSettings.libraryName}
                    onChange={(e) => setLabelSettings(prev => ({ ...prev, libraryName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nama perpustakaan"
                  />
                </div>
              </div>

              {/* Book Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Informasi Buku</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Judul:</span> {previewLabel.book?.title || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Pengarang:</span> {previewLabel.book?.author || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Nomor Panggil:</span> {previewLabel.book?.callNumber || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Tahun Terbit:</span> {previewLabel.book?.publication_year || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Barcode:</span> {previewLabel.barcode}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {previewLabel.book?.status || 'available'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => handlePrintLabel(previewLabel.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cetak Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabelBarcodeForm;