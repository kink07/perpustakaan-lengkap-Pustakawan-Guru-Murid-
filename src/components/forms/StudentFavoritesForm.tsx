import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  Book, 
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
  Bookmark
} from 'lucide-react';

interface FavoriteBook {
  id: number;
  title: string;
  author: string;
  category: string;
  rating: number;
  personalRating: number;
  dateAdded: string;
  notes: string;
  tags: string[];
  cover: string;
  availability: 'available' | 'borrowed' | 'reserved';
  readCount: number;
}

function StudentFavoritesForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddFavorite, setShowAddFavorite] = useState(false);
  const [newFavorite, setNewFavorite] = useState({
    bookSearch: '',
    personalRating: 5,
    notes: '',
    tags: [] as string[],
    newTag: ''
  });

  const favoriteBooks: FavoriteBook[] = [
    {
      id: 1,
      title: "Matematika Kelas X - Kurikulum Merdeka",
      author: "Dr. Ahmad Susanto, M.Pd",
      category: "500",
      rating: 4.5,
      personalRating: 5,
      dateAdded: "2024-01-15",
      notes: "Sangat membantu untuk memahami konsep matematika",
      tags: ["matematika", "kurikulum-merdeka", "wajib"],
      cover: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300",
      availability: 'available',
      readCount: 3
    },
    {
      id: 2,
      title: "Sejarah Indonesia Modern",
      author: "Prof. Dr. Sartono Kartodirdjo",
      category: "900",
      rating: 4.8,
      personalRating: 5,
      dateAdded: "2024-01-10",
      notes: "Perspektif sejarah yang menarik dan objektif",
      tags: ["sejarah", "indonesia", "referensi"],
      cover: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300",
      availability: 'borrowed',
      readCount: 2
    },
    {
      id: 3,
      title: "Fisika Dasar - Mekanika dan Termodinamika",
      author: "Dr. Bambang Ruwanto, M.Si",
      category: "500",
      rating: 4.3,
      personalRating: 4,
      dateAdded: "2024-01-05",
      notes: "Penjelasan konsep fisika yang mudah dipahami",
      tags: ["fisika", "sains", "eksperimen"],
      cover: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300",
      availability: 'available',
      readCount: 1
    }
  ];

  const filteredBooks = favoriteBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'borrowed': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Tersedia';
      case 'borrowed': return 'Dipinjam';
      case 'reserved': return 'Direservasi';
      default: return 'Unknown';
    }
  };

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

  const handleAddFavorite = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Buku telah ditambahkan ke favorit!');
    setShowAddFavorite(false);
    setNewFavorite({
      bookSearch: '',
      personalRating: 5,
      notes: '',
      tags: [],
      newTag: ''
    });
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredBooks.map((book) => (
        <div key={book.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(book.availability)}`}>
                {getAvailabilityText(book.availability)}
              </span>
            </div>
            <div className="absolute top-2 left-2">
              <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded-full px-2 py-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-xs font-medium">{book.personalRating}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {book.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {tag}
                </span>
              ))}
              {book.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{book.tags.length - 3}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>Dibaca {book.readCount}x</span>
              <span>{new Date(book.dateAdded).toLocaleDateString('id-ID')}</span>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                <BookOpen className="w-4 h-4 mr-1 inline" />
                {book.availability === 'available' ? 'Pinjam' : 'Reservasi'}
              </button>
              <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredBooks.map((book) => (
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
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{book.personalRating}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(book.availability)}`}>
                    {getAvailabilityText(book.availability)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {book.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              {book.notes && (
                <p className="text-sm text-gray-600 mb-2 italic">"{book.notes}"</p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Ditambahkan: {new Date(book.dateAdded).toLocaleDateString('id-ID')} • Dibaca {book.readCount}x
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                    <Eye className="w-4 h-4 mr-1 inline" />
                    Detail
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                    <BookOpen className="w-4 h-4 mr-1 inline" />
                    {book.availability === 'available' ? 'Pinjam' : 'Reservasi'}
                  </button>
                </div>
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
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Buku Favorit</h2>
              <p className="text-sm text-gray-600">Koleksi buku yang Anda sukai</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={() => setShowAddFavorite(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Tambah Favorit
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari buku favorit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
        </div>
      </div>

      {/* Add Favorite Modal */}
      {showAddFavorite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Tambah Buku Favorit</h3>
                <button
                  onClick={() => setShowAddFavorite(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddFavorite} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari Buku *
                  </label>
                  <input
                    type="text"
                    value={newFavorite.bookSearch}
                    onChange={(e) => setNewFavorite(prev => ({...prev, bookSearch: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ketik judul buku atau pengarang"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating Personal *
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewFavorite(prev => ({...prev, personalRating: rating}))}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            rating <= newFavorite.personalRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {newFavorite.personalRating} dari 5
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Personal
                  </label>
                  <textarea
                    value={newFavorite.notes}
                    onChange={(e) => setNewFavorite(prev => ({...prev, notes: e.target.value}))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Star className="w-4 h-4 mr-2 inline" />
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
        {viewMode === 'grid' ? renderGridView() : renderListView()}
        
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Belum ada buku favorit</p>
            <p className="text-sm text-gray-500">Tambahkan buku yang Anda sukai ke daftar favorit</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentFavoritesForm;