import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Book as BookIcon, 
  Search,
  Filter,
  Grid,
  List,
  Plus,
  X,
  Eye,
  Download,
  BookOpen,
  Calendar,
  User,
  Tag,
  Loader2,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { databaseService } from '../../services/database';
import { Book } from '../../types/database';

interface SharedBookData {
  id: number;
  user_id: string;
  book_id: string;
  shared_with: string[];
  share_message: string;
  date_shared: string;
  book?: Book;
}

function StudentSharedBooksForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [sharedBooks, setSharedBooks] = useState<SharedBookData[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [shareData, setShareData] = useState({
    shareMessage: '',
    shareWith: [] as string[],
    newShareWith: ''
  });

  // Load shared books from database
  useEffect(() => {
    const loadSharedBooks = async () => {
      try {
        setLoading(true);
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser && currentUser.id && currentUser.role === 'student') {
          const sharedBooksData = await databaseService.getUserSharedBooks(currentUser.id);
          setSharedBooks(sharedBooksData);
        }
      } catch (error) {
        console.error('Error loading shared books:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSharedBooks();
  }, []);

  // Share book
  const handleShareBook = async (bookId: string) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser && currentUser.id && currentUser.role === 'student') {
        const newSharedBook = await databaseService.shareBook(currentUser.id, bookId, {
          shared_with: shareData.shareWith,
          share_message: shareData.shareMessage
        });
        
        if (newSharedBook) {
          setSharedBooks(prev => [newSharedBook, ...prev]);
          setShowShareModal(false);
          setShareData({
            shareMessage: '',
            shareWith: [],
            newShareWith: ''
          });
          setSelectedBook(null);
        }
      }
    } catch (error) {
      console.error('Error sharing book:', error);
    }
  };

  // Remove shared book
  const handleRemoveSharedBook = async (sharedBookId: number) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser && currentUser.id && currentUser.role === 'student') {
        const success = await databaseService.removeSharedBook(currentUser.id, sharedBookId);
        if (success) {
          setSharedBooks(prev => prev.filter(sharedBook => sharedBook.id !== sharedBookId));
        }
      }
    } catch (error) {
      console.error('Error removing shared book:', error);
    }
  };

  const filteredSharedBooks = sharedBooks.filter(sharedBook => {
    const book = sharedBook.book;
    if (!book) return false;
    
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sharedBook.share_message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddShareWith = () => {
    if (shareData.newShareWith.trim() && !shareData.shareWith.includes(shareData.newShareWith.trim())) {
      setShareData(prev => ({
        ...prev,
        shareWith: [...prev.shareWith, prev.newShareWith.trim()],
        newShareWith: ''
      }));
    }
  };

  const handleRemoveShareWith = (emailToRemove: string) => {
    setShareData(prev => ({
      ...prev,
      shareWith: prev.shareWith.filter(email => email !== emailToRemove)
    }));
  };

  const copyShareLink = (bookId: string) => {
    const shareLink = `${window.location.origin}/book/${bookId}`;
    navigator.clipboard.writeText(shareLink);
    // You could add a toast notification here
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredSharedBooks.map((sharedBook) => {
        const book = sharedBook.book;
        if (!book) return null;
        
        return (
          <div key={sharedBook.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={book.cover || "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300"}
                alt={book.title}
                className="w-full h-48 object-contain bg-gray-50"
              />
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Dibagikan
                </span>
              </div>
              <button
                onClick={() => handleRemoveSharedBook(sharedBook.id)}
                className="absolute top-2 left-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2">
                <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded-full px-2 py-1">
                  <Share2 className="w-4 h-4 text-green-500 fill-current" />
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{book.author}</p>
              
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Dibagikan dengan:</p>
                <div className="flex flex-wrap gap-1">
                  {sharedBook.shared_with.slice(0, 2).map((email) => (
                    <span key={email} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {email}
                    </span>
                  ))}
                  {sharedBook.shared_with.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{sharedBook.shared_with.length - 2}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>Dibagikan: {new Date(sharedBook.date_shared).toLocaleDateString('id-ID')}</span>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                  <BookOpen className="w-4 h-4 mr-1 inline" />
                  Baca
                </button>
                <button 
                  onClick={() => copyShareLink(book.id)}
                  className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredSharedBooks.map((sharedBook) => {
        const book = sharedBook.book;
        if (!book) return null;
        
        return (
          <div key={sharedBook.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <img
                src={book.cover || "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300"}
                alt={book.title}
                className="w-20 h-28 object-cover rounded border border-gray-200"
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                    <p className="text-sm text-blue-600 font-medium">{book.category}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyShareLink(book.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveSharedBook(sharedBook.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-700 mb-2">Pesan: {sharedBook.share_message || 'Tidak ada pesan'}</p>
                  <div className="mb-2">
                    <p className="text-sm text-gray-700 mb-1">Dibagikan dengan:</p>
                    <div className="flex flex-wrap gap-2">
                      {sharedBook.shared_with.map((email) => (
                        <span key={email} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {email}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Dibagikan: {new Date(sharedBook.date_shared).toLocaleDateString('id-ID')}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                      <Eye className="w-4 h-4 mr-1 inline" />
                      Lihat
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                      <BookOpen className="w-4 h-4 mr-1 inline" />
                      Baca
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buku Dibagikan</h1>
          <p className="text-gray-600">Kelola buku yang telah Anda bagikan</p>
        </div>
        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Bagikan Buku</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari buku, penulis, atau pesan..."
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
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="000">Umum</option>
            <option value="100">Filsafat</option>
            <option value="200">Agama</option>
            <option value="300">Ilmu Sosial</option>
            <option value="400">Bahasa</option>
            <option value="500">Sains</option>
            <option value="600">Teknologi</option>
            <option value="700">Seni</option>
            <option value="800">Sastra</option>
            <option value="900">Sejarah</option>
          </select>
          
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Share Book Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bagikan Buku</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleShareBook('mock-book-id'); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari Buku
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan judul atau penulis buku"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan
                  </label>
                  <textarea
                    value={shareData.shareMessage}
                    onChange={(e) => setShareData(prev => ({...prev, shareMessage: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Tambahkan pesan untuk buku yang akan dibagikan"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bagikan dengan
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        value={shareData.newShareWith}
                        onChange={(e) => setShareData(prev => ({...prev, newShareWith: e.target.value}))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan email"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddShareWith())}
                      />
                      <button
                        type="button"
                        onClick={handleAddShareWith}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {shareData.shareWith.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {shareData.shareWith.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                          >
                            {email}
                            <button
                              type="button"
                              onClick={() => handleRemoveShareWith(email)}
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2 inline" />
                  Bagikan
                </button>
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat buku dibagikan...</span>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? renderGridView() : renderListView()}
            
            {filteredSharedBooks.length === 0 && !loading && (
              <div className="text-center py-12">
                <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Belum ada buku yang dibagikan</p>
                <p className="text-sm text-gray-500">Bagikan buku yang Anda sukai dengan teman</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StudentSharedBooksForm;
