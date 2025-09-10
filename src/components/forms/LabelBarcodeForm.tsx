import React, { useState } from 'react';
import { 
  Tag, 
  Printer, 
  Eye, 
  Download, 
  Search, 
  Filter,
  Grid,
  List,
  CheckCircle,
  Book,
  Hash,
  Calendar,
  User,
  MapPin,
  Settings,
  RefreshCw,
  Save,
  Upload,
  FileText,
  Camera,
  Scan,
  BarChart3,
  Target,
  Zap,
  Copy,
  Edit,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import { BookData } from '../types/book';

interface LabelBarcodeFormProps {
  books: BookData[];
}

interface LabelData {
  id: number;
  bookId: number;
  title: string;
  author: string;
  deweyNumber: string;
  callNumber: string;
  barcode: string;
  year: string;
  libraryName: string;
  location: string;
  category: string;
}

function LabelBarcodeForm({ books }: LabelBarcodeFormProps) {
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [labelSettings, setLabelSettings] = useState({
    libraryName: 'Perpustakaan SDN Pejaten Timur 11 Pagi',
    labelSize: 'standard',
    includeBarcode: true,
    includeDDC: true,
    includeCallNumber: true,
    includeYear: true,
    fontSize: 'medium',
    orientation: 'landscape'
  });
  const [previewMode, setPreviewMode] = useState(false);

  // Generate dummy data for demonstration
  const generateLabelData = (book: BookData): LabelData => {
    const authorCode = book.author.split(' ').pop()?.substring(0, 3).toUpperCase() || 'XXX';
    const titleCode = book.title.substring(0, 1).toUpperCase();
    
    return {
      id: book.id,
      bookId: book.id,
      title: book.title.length > 25 ? book.title.substring(0, 25) + '...' : book.title,
      author: book.author,
      deweyNumber: book.deweyNumber || '000',
      callNumber: book.callNumber || `${book.deweyNumber} ${authorCode} ${titleCode}`,
      barcode: book.barcode || `LIB${book.id.toString().padStart(9, '0')}`,
      year: book.publicationYear,
      libraryName: labelSettings.libraryName,
      location: book.location,
      category: book.category
    };
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.callNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectBook = (bookId: number) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBooks.length === filteredBooks.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(filteredBooks.map(book => book.id));
    }
  };

  const generateBarcodeStripes = () => {
    // Generate simple barcode pattern for visual representation
    const pattern = [];
    for (let i = 0; i < 50; i++) {
      const width = Math.random() > 0.5 ? 2 : 1;
      const isBlack = Math.random() > 0.3;
      pattern.push({ width, isBlack });
    }
    return pattern;
  };

  const renderLabelPreview = (labelData: LabelData) => {
    const barcodePattern = generateBarcodeStripes();
    
    return (
      <div className="border-2 border-gray-300 bg-white p-4 w-80 h-48 flex print:border-black print:break-inside-avoid">
        {/* Left Column */}
        <div className="flex-1 pr-2 border-r border-gray-300 flex flex-col justify-between">
          {/* Title */}
          <div className="mb-2">
            <h4 className="text-sm font-bold text-gray-900 leading-tight">
              {labelData.title}
            </h4>
          </div>
          
          {/* Barcode */}
          <div className="mb-2">
            <div className="flex items-end h-12 bg-white border border-gray-200 px-1 overflow-x-hidden">
              {barcodePattern.map((stripe, index) => (
                <div
                  key={index}
                  className={`${stripe.isBlack ? 'bg-black' : 'bg-white'} h-full`}
                  style={{ width: `${stripe.width}px` }}
                />
              ))}
            </div>
          </div>
          
          {/* Barcode Number */}
          <div className="text-xs font-mono text-center">
            {labelData.barcode.length > 12 ? labelData.barcode.substring(0, 12) + '...' : labelData.barcode}
          </div>
        </div>
        
        {/* Right Column */}
        <div className="flex-1 pl-2 flex flex-col justify-between text-center">
          {/* Library Name */}
          <div className="mb-1">
            <p className="text-xs font-semibold text-gray-900 leading-tight">
              {labelData.libraryName}
            </p>
          </div>
          
          {/* DDC Number */}
          <div className="mb-1">
            <p className="text-lg font-bold text-gray-900">
              {labelData.deweyNumber}
            </p>
          </div>
          
          {/* Author Code */}
          <div className="mb-1">
            <p className="text-lg font-bold text-gray-900">
              {labelData.author.split(' ').pop()?.substring(0, 3).toUpperCase() || 'XXX'} {labelData.author.split(' ').length > 1 ? labelData.author.split(' ')[0].substring(0, 1).toUpperCase() : ''}
            </p>
          </div>
          
          {/* Title Code */}
          <div className="mb-1">
            <p className="text-xl font-bold text-gray-900">
              {labelData.title.substring(0, 1).toUpperCase()}
            </p>
          </div>
          
          {/* Year */}
          <div>
            <p className="text-sm font-bold text-gray-900">
              {labelData.year}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Simulate PDF generation
    alert('Fitur download PDF akan segera tersedia');
  };

  const selectedBooksData = books.filter(book => selectedBooks.includes(book.id));

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Label & Barcode</h2>
              <p className="text-sm text-gray-600">Generate dan cetak label serta barcode untuk koleksi buku</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                previewMode 
                  ? 'bg-blue-600 text-white' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-4 h-4 mr-2 inline" />
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
            
            {selectedBooks.length > 0 && (
              <>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Printer className="w-4 h-4 mr-2 inline" />
                  Print ({selectedBooks.length})
                </button>
                
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2 inline" />
                  Download PDF
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {!previewMode ? (
        <>
          {/* Settings Panel */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Pengaturan Label
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Perpustakaan</label>
                <input
                  type="text"
                  value={labelSettings.libraryName}
                  onChange={(e) => setLabelSettings(prev => ({...prev, libraryName: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran Label</label>
                <select
                  value={labelSettings.labelSize}
                  onChange={(e) => setLabelSettings(prev => ({...prev, labelSize: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Kecil (6x4 cm)</option>
                  <option value="standard">Standard (8x6 cm)</option>
                  <option value="large">Besar (10x8 cm)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Orientasi</label>
                <select
                  value={labelSettings.orientation}
                  onChange={(e) => setLabelSettings(prev => ({...prev, orientation: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran Font</label>
                <select
                  value={labelSettings.fontSize}
                  onChange={(e) => setLabelSettings(prev => ({...prev, fontSize: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Kecil</option>
                  <option value="medium">Sedang</option>
                  <option value="large">Besar</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Komponen Label</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={labelSettings.includeBarcode}
                      onChange={(e) => setLabelSettings(prev => ({...prev, includeBarcode: e.target.checked}))}
                      className="text-blue-600" 
                    />
                    <span className="text-sm">Barcode</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={labelSettings.includeDDC}
                      onChange={(e) => setLabelSettings(prev => ({...prev, includeDDC: e.target.checked}))}
                      className="text-blue-600" 
                    />
                    <span className="text-sm">Nomor DDC</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={labelSettings.includeYear}
                      onChange={(e) => setLabelSettings(prev => ({...prev, includeYear: e.target.checked}))}
                      className="text-blue-600" 
                    />
                    <span className="text-sm">Tahun Terbit</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Label</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Template Standard</option>
                  <option>Template Minimalis</option>
                  <option>Template Lengkap</option>
                  <option>Template Custom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Book Selection */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Pilih Buku untuk Label</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari buku..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
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
                
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedBooks.length === filteredBooks.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                </button>
              </div>
            </div>

            {/* Book List */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedBooks.length === filteredBooks.length && filteredBooks.length > 0}
                        onChange={handleSelectAll}
                        className="text-blue-600"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buku</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengarang</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Panggil</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barcode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedBooks.includes(book.id)}
                          onChange={() => handleSelectBook(book.id)}
                          className="text-blue-600"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{book.title}</p>
                          <p className="text-xs text-gray-500">{book.publicationYear}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{book.author}</td>
                      <td className="px-4 py-3 text-sm font-mono text-blue-600">{book.callNumber}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{book.barcode}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{book.location}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          book.status === 'Tersedia' ? 'bg-green-100 text-green-800' :
                          book.status === 'Dipinjam' ? 'bg-blue-100 text-blue-800' :
                          book.status === 'Perawatan' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {book.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Tidak ada buku yang ditemukan</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Preview Mode */
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Preview Label ({selectedBooksData.length} label)
            </h3>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="w-4 h-4 mr-2 inline" />
                Print Labels
              </button>
              
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Download PDF
              </button>
            </div>
          </div>

          {selectedBooksData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4 print-area">
              {selectedBooksData.map((book) => {
                const labelData = generateLabelData(book);
                return (
                  <div key={book.id} className="flex justify-center">
                    {renderLabelPreview(labelData)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Belum ada buku yang dipilih</p>
              <p className="text-sm text-gray-500">Kembali ke edit mode untuk memilih buku</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      {!previewMode && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Book className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Buku</p>
                  <p className="text-lg font-bold text-gray-900">{books.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dipilih</p>
                  <p className="text-lg font-bold text-gray-900">{selectedBooks.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Label Siap</p>
                  <p className="text-lg font-bold text-gray-900">{selectedBooks.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Printer className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimasi Kertas</p>
                  <p className="text-lg font-bold text-gray-900">{Math.ceil(selectedBooks.length / 6)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabelBarcodeForm;