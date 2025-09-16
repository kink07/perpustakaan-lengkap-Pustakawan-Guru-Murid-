import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Book as BookIcon, 
  Search,
  Filter,
  Grid,
  List,
  Plus,
  X,
  Eye,
  Download,
  Share2,
  BookOpen,
  Calendar,
  User,
  Tag,
  Loader2
} from 'lucide-react';
import { databaseService } from '../../services/database';
import { Book } from '../../types/database';

interface FavoriteBook {
  id: number;
  user_id: string;
  book_id: string;
  personal_rating: number;
  notes: string;
  tags: string[];
  date_added: string;
  read_count: number;
  book?: Book;
}

interface TeacherFavoritesFormProps {
  user: any;
}

function TeacherFavoritesForm({ user }: TeacherFavoritesFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [favoriteBooks, setFavoriteBooks] = useState<FavoriteBook[]>([]);
  const [showAddFavorite, setShowAddFavorite] = useState(false);
  const [newFavorite, setNewFavorite] = useState({
    bookSearch: '',
    personalRating: 5,
    notes: '',
    tags: [] as string[],
    newTag: ''
  });

  // Load favorites from database
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        if (user && user.id && user.role === 'teacher') {
          console.log('Loading favorites for user:', user.id);
          const favoritesData = await databaseService.getStudentFavorites(user.id);
          console.log('Favorites data loaded:', favoritesData);
          setFavoriteBooks(favoritesData);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadFavorites();
    }
  }, [user]);

  // Add favorite to database
  const handleAddFavorite = async (bookId: string) => {
    try {
      if (user && user.id && user.role === 'teacher') {
        const newFavoriteData = await databaseService.addStudentFavorite(user.id, bookId, {
          personal_rating: newFavorite.personalRating,
          notes: newFavorite.notes,
          tags: newFavorite.tags
        });
        
        if (newFavoriteData) {
          setFavoriteBooks(prev => [newFavoriteData, ...prev]);
          setShowAddFavorite(false);
          setNewFavorite({
            bookSearch: '',
            personalRating: 5,
            notes: '',
            tags: [],
            newTag: ''
          });
        }
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  // Remove favorite from database
  const handleRemoveFavorite = async (bookId: string) => {
    try {
      if (user && user.id && user.role === 'teacher') {
        const success = await databaseService.removeStudentFavorite(user.id, bookId);
        if (success) {
          setFavoriteBooks(prev => prev.filter(fav => fav.book_id !== bookId));
        }
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const filteredBooks = favoriteBooks.filter(favorite => {
    const book = favorite.book;
    if (!book) return false;
    
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         favorite.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddTag = () => {
    if (newFavorite.newTag.trim() && !newFavorite.tags.includes(newFavorite.newTag.trim())) {
      setNewFavorite(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewFavorite(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredBooks.map((favorite) => {
        const book = favorite.book;
        if (!book) return null;
        
        return (
          <div key={favorite.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={book.cover || "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300"}
                alt={book.title}
                className="w-full h-48 object-contain bg-gray-50"
              />
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  Favorit
                </span>
              </div>
              <button
                onClick={() => handleRemoveFavorite(book.id)}
                className="absolute top-2 left-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2">
                <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded-full px-2 py-1">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  <span className="text-xs font-medium">{favorite.personal_rating}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{book.author}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {favorite.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
                {favorite.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{favorite.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>Dibaca {favorite.read_count}x</span>
                <span>{new Date(favorite.date_added).toLocaleDateString('id-ID')}</span>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                  <BookOpen className="w-4 h-4 mr-1 inline" />
                  Baca
                </button>
                <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
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
      {filteredBooks.map((favorite) => {
        const book = favorite.book;
        if (!book) return null;
        
        return (
          <div key={favorite.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                      <span className="text-sm font-medium">{favorite.personal_rating}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFavorite(book.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-700 mb-2">Notes: {favorite.notes || 'Tidak ada catatan'}</p>
                  <div className="flex flex-wrap gap-2">
                    {favorite.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Dibaca {favorite.read_count}x • Ditambahkan: {new Date(favorite.date_added).toLocaleDateString('id-ID')}
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
          <h1 className="text-2xl font-bold text-gray-900">Favorit Saya</h1>
          <p className="text-gray-600">Kelola buku favorit Anda</p>
        </div>
        <button
          onClick={() => setShowAddFavorite(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Favorit</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari buku, penulis, atau tag..."
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

      {/* Add Favorite Modal */}
      {showAddFavorite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tambah Favorit</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleAddFavorite('mock-book-id'); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari Buku
                  </label>
                  <input
                    type="text"
                    value={newFavorite.bookSearch}
                    onChange={(e) => setNewFavorite(prev => ({...prev, bookSearch: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan judul atau penulis buku"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating Personal
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewFavorite(prev => ({...prev, personalRating: star}))}
                        className={`w-8 h-8 ${
                          star <= newFavorite.personalRating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      >
                        <Heart className="w-full h-full" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan
                  </label>
                  <textarea
                    value={newFavorite.notes}
                    onChange={(e) => setNewFavorite(prev => ({...prev, notes: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Mengapa buku ini menjadi favorit Anda?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag Personal
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newFavorite.newTag}
                        onChange={(e) => setNewFavorite(prev => ({...prev, newTag: e.target.value}))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Tambah tag baru"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {newFavorite.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newFavorite.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
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
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Heart className="w-4 h-4 mr-2 inline" />
                  Tambah ke Favorit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFavorite(false)}
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
            <span className="ml-2 text-gray-600">Memuat favorit...</span>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? renderGridView() : renderListView()}
            
            {filteredBooks.length === 0 && !loading && (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Belum ada buku favorit</p>
                <p className="text-sm text-gray-500">Tambahkan buku yang Anda sukai ke daftar favorit</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TeacherFavoritesForm;
