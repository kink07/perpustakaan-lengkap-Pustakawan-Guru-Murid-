import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Search, 
  Camera, 
  Mic, 
  ChevronDown, 
  Globe, 
  MapPin, 
  FileText, 
  Video, 
  BookOpen, 
  Download,
  Clock,
  Phone,
  Mail,
  MapPin as LocationIcon,
  ArrowLeft,
  Share2,
  Heart,
  Bookmark,
  User
} from 'lucide-react';
import { BookData } from '../types/book';
import { DDC_CATEGORIES } from '../constants/ddcCategories';
import Dashboard from './Dashboard';
import { databaseService } from '../services/database';
import { useNotification } from '../contexts/NotificationContext';

interface DigitalLibraryProps {
  currentUser?: any;
  onNavigateToDashboard?: () => void;
  onNavigateToAuth?: () => void;
  onBookAdded?: () => void;
  onNavigateToStatistics?: () => void;
  bookRefreshTrigger?: number;
}

function DigitalLibrary({ currentUser, onNavigateToDashboard, onNavigateToAuth, onBookAdded, onNavigateToStatistics, bookRefreshTrigger }: DigitalLibraryProps) {
  const { showNotification } = useNotification();
  const [books, setBooks] = useState<BookData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState<{ [bookId: string]: boolean }>({});
  const [bookmarkStatus, setBookmarkStatus] = useState<{ [bookId: string]: boolean }>({});

  // Load books from database on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  // Load books from database
  const loadBooks = async () => {
    try {
      const booksData = await databaseService.getCatalogBooks();
      // Convert catalog books to BookData format
      console.log('Loading books from database:', booksData);
      const convertedBooks: BookData[] = booksData.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category || '',
        publisher: book.publisher || '',
        publicationYear: book.publication_year?.toString() || '',
        isbn: book.isbn || '',
        status: book.status === 'available' ? 'Tersedia' : 
                book.status === 'borrowed' ? 'Dipinjam' : 
                book.status === 'reserved' ? 'Dipesan' : 
                book.status === 'damaged' ? 'Rusak' : 'Hilang',
        cover: book.cover_image_url || book.cover || undefined,
        location: book.location || '',
        description: book.description || '',
        pages: book.pages?.toString() || '',
        language: book.language || 'Indonesia',
        price: book.price?.toString() || '',
        notes: book.notes || '',
        // Map all fields from CatalogBook to BookData
        subtitle: book.subtitle || '',
        coAuthor: book.coAuthor || '',
        editor: book.editor || '',
        translator: book.translator || '',
        illustrator: book.illustrator || '',
        publicationPlace: book.publicationPlace || '',
        edition: book.edition || '',
        issn: book.issn || '',
        series: book.series || '',
        volume: book.volume || '',
        subcategory: book.subcategory || '',
        subjects: book.subjects || [],
        physicalDescription: book.physicalDescription || '',
        contentType: book.contentType || 'Teks',
        mediaType: book.mediaType || 'Tanpa Mediasi',
        carrierType: book.carrierType || 'Volume',
        copyNumber: book.copyNumber || 1,
        barcode: book.barcode || '',
        source: book.source || '',
        acquisitionDate: book.acquisition_date || new Date().toISOString().split('T')[0],
        condition: book.condition || 'Baik',
        abstract: book.abstract || '',
        digitalFiles: book.digital_files || [],
        callNumber: book.callNumber || '',
        deweyNumber: book.deweyNumber || '',
        dimensions: book.dimensions || ''
      }));
      console.log('Converted books with covers:', convertedBooks.map(b => ({ id: b.id, title: b.title, cover: b.cover })));
      setBooks(convertedBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  // Load existing favorites and bookmarks on component mount
  useEffect(() => {
    if (currentUser && (currentUser.role === 'student' || currentUser.role === 'teacher')) {
      loadUserFavorites();
      loadUserBookmarks();
    }
  }, [currentUser]);

  // Listen for book additions and refresh
  useEffect(() => {
    if (onBookAdded) {
      loadBooks();
    }
  }, [onBookAdded]);

  // Listen for book refresh trigger
  useEffect(() => {
    if (bookRefreshTrigger && bookRefreshTrigger > 0) {
      loadBooks();
    }
  }, [bookRefreshTrigger]);

  // Load user's existing favorites
  const loadUserFavorites = async () => {
    try {
      const favorites = await databaseService.getStudentFavorites(currentUser!.id);
      const statusMap: { [bookId: string]: boolean } = {};
      favorites.forEach(fav => {
        statusMap[fav.book_id] = true;
      });
      setFavoriteStatus(statusMap);
      console.log('Loaded favorites status:', statusMap);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Load user's existing bookmarks
  const loadUserBookmarks = async () => {
    try {
      const bookmarks = await databaseService.getUserBookmarks(currentUser!.id);
      const statusMap: { [bookId: string]: boolean } = {};
      bookmarks.forEach(bookmark => {
        statusMap[bookmark.book_id] = true;
      });
      setBookmarkStatus(statusMap);
      console.log('Loaded bookmarks status:', statusMap);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  // Filter books based on search and category
  const filteredBooks = (books || []).filter(book => {
    if (!book || !book.title || !book.author) return false;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (book.subjects || []).some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Show notification using global notification system
  const showLocalNotification = (type: 'success' | 'error', message: string) => {
    showNotification({
      type,
      title: type === 'success' ? 'Berhasil!' : 'Gagal!',
      message
    });
  };

  // 1. Share function - untuk semua orang (tanpa login)
  const handleShare = async (book: BookData) => {
    const shareData = {
      title: book.title,
      text: `Lihat buku "${book.title}" oleh ${book.author}`,
      url: `${window.location.origin}/book/${book.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to copy to clipboard
        copyToClipboard(shareData.url);
      }
    } else {
      // Fallback to copy to clipboard
      copyToClipboard(shareData.url);
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showLocalNotification('success', 'Link berhasil disalin ke clipboard!');
    } catch (err) {
      showLocalNotification('error', 'Gagal menyalin link');
    }
  };

  // 2. Love function - toggle favorit dengan perubahan warna
  const handleLove = async (book: BookData) => {
    if (!currentUser) {
      showLocalNotification('error', 'Silakan login terlebih dahulu untuk menambah ke favorit');
      return;
    }

    if (currentUser.role !== 'student' && currentUser.role !== 'teacher') {
      showLocalNotification('error', 'Fitur favorit hanya untuk siswa dan guru');
      return;
    }

    try {
      console.log('Toggling favorite for user:', currentUser.id, 'book:', book.id);
      
      // Gunakan fungsi toggle yang baru
      const result = await databaseService.toggleStudentFavorite(currentUser.id, book.id, {
        personal_rating: 5,
        notes: '',
        tags: []
      });

      if (result) {
        if (result.removed) {
          setFavoriteStatus(prev => ({ ...prev, [book.id]: false }));
          showLocalNotification('success', 'Buku berhasil dihapus dari favorit!');
          console.log('Favorite removed successfully');
        } else {
          setFavoriteStatus(prev => ({ ...prev, [book.id]: true }));
          showLocalNotification('success', 'Buku berhasil ditambahkan ke favorit!');
          console.log('Favorite added successfully');
        }
      } else {
        showLocalNotification('error', 'Gagal mengubah status favorit');
        console.error('Failed to toggle favorite - no result returned');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showLocalNotification('error', 'Gagal mengubah status favorit');
    }
  };

  // 3. Bookmark function - toggle bookmark dengan perubahan warna
  const handleBookmark = async (book: BookData) => {
    if (!currentUser) {
      showLocalNotification('error', 'Silakan login terlebih dahulu untuk menambah bookmark');
      return;
    }

    if (currentUser.role !== 'student' && currentUser.role !== 'teacher') {
      showLocalNotification('error', 'Fitur bookmark hanya untuk siswa dan guru');
      return;
    }

    try {
      console.log('Toggling bookmark for user:', currentUser.id, 'book:', book.id);
      
      // Gunakan fungsi toggle yang baru
      const result = await databaseService.toggleBookmark(currentUser.id, book.id, {
        notes: '',
        tags: []
      });

      if (result) {
        if (result.removed) {
          setBookmarkStatus(prev => ({ ...prev, [book.id]: false }));
          showLocalNotification('success', 'Buku berhasil dihapus dari bookmark!');
          console.log('Bookmark removed successfully');
        } else {
          setBookmarkStatus(prev => ({ ...prev, [book.id]: true }));
          showLocalNotification('success', 'Buku berhasil ditambahkan ke bookmark!');
          console.log('Bookmark added successfully');
        }
      } else {
        showLocalNotification('error', 'Gagal mengubah status bookmark');
        console.error('Failed to toggle bookmark - no result returned');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      showLocalNotification('error', 'Gagal mengubah status bookmark');
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return <FileText className="w-4 h-4" />;
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'E-Book':
        return <BookOpen className="w-4 h-4" />;
      case 'Flipbook':
        return <Book className="w-4 h-4" />;
      case 'Audio Book':
        return <Mic className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  const getFileColor = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return 'text-red-600 bg-red-50';
      case 'Video':
        return 'text-blue-600 bg-blue-50';
      case 'E-Book':
        return 'text-green-600 bg-green-50';
      case 'Flipbook':
        return 'text-purple-600 bg-purple-50';
      case 'Audio Book':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleProfileClick = () => {
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo and Library Name */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Book className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Perpustakaan Digital</h1>
                  <p className="text-sm text-gray-600">SMAN 1 Jakarta</p>
                </div>
              </div>
            </div>

            {/* User Profile and Language Toggle */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleProfileClick}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title={currentUser?.role === 'librarian' ? "Klik untuk ke Dashboard Statistik" : "Klik untuk ke Dashboard"}
                  >
                    {currentUser?.profile_image ? (
                      <img 
                        src={currentUser.profile_image} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center border-2 border-yellow-400">
                        <span className="text-white text-sm font-bold">
                          {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={onNavigateToAuth}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Login / Daftar"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}
              
              {/* Language Toggle */}
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-600" />
                <select className="border-none bg-transparent text-gray-700 font-medium focus:outline-none">
                  <option>ID</option>
                  <option>EN</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Temukan Koleksi Digital</h2>
            <p className="text-gray-600">Jelajahi ribuan buku, jurnal, dan materi pembelajaran</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-2">
            <div className="flex items-center space-x-2">
              {/* Collection Type Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="text-sm font-medium">
                    Kategori
                  </span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {DDC_CATEGORIES.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => {
                          setSelectedCategory(category.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          selectedCategory === category.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-8 w-px bg-gray-200"></div>

              {/* Search Input */}
              <div className="flex-1 flex items-center space-x-3 px-4">
                <input
                  type="text"
                  placeholder="Cari judul buku, pengarang, atau topik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-3 text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none"
                />
                
                {/* Search Icons */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Books Collection */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Koleksi Buku</h3>
            <p className="text-gray-600">{filteredBooks.length} hasil ditemukan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white border-2 border-blue-200 rounded-lg shadow-md hover:border-yellow-300 hover:shadow-lg transition-all duration-300 overflow-hidden group max-w-xs mx-auto">
                {/* Book Cover */}
                <div className="relative overflow-hidden">
                  <img
                    src={book.cover ? `${book.cover}?t=${Date.now()}` : 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300'}
                    alt={book.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    key={`${book.id}-${book.cover || 'default'}-${Date.now()}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {DDC_CATEGORIES.find(cat => cat.value === book.category)?.label.split(' - ')[0] || book.category}
                    </span>
                  </div>
                  
                  {/* Action Icons */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => handleShare(book)}
                      className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                      title="Bagikan"
                    >
                      <Share2 className="w-4 h-4 text-gray-700 hover:text-blue-600" />
                    </button>
                    <button 
                      onClick={() => handleLove(book)}
                      className={`p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200 ${
                        favoriteStatus[book.id] ? 'ring-2 ring-red-500' : ''
                      }`}
                      title={favoriteStatus[book.id] ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors duration-200 ${
                          favoriteStatus[book.id] 
                            ? 'text-red-600 fill-red-600' 
                            : 'text-gray-700 hover:text-red-600'
                        }`} 
                      />
                    </button>
                    <button 
                      onClick={() => handleBookmark(book)}
                      className={`p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200 ${
                        bookmarkStatus[book.id] ? 'ring-2 ring-green-500' : ''
                      }`}
                      title={bookmarkStatus[book.id] ? "Hapus dari Bookmark" : "Simpan untuk Nanti"}
                    >
                      <Bookmark 
                        className={`w-4 h-4 transition-colors duration-200 ${
                          bookmarkStatus[book.id] 
                            ? 'text-green-600 fill-green-600' 
                            : 'text-gray-700 hover:text-green-600'
                        }`} 
                      />
                    </button>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-600 text-xs mb-2">{book.author}</p>

                  
                  {/* Book Details */}
                  <div className="space-y-0.5 mb-2">
                    <div className="flex items-center text-gray-500 text-xs">
                      <span className="font-medium w-16">Terbit:</span>
                      <span>{book.publisher}, {book.publicationYear}</span>
                    </div>
                    {book.subtitle && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <span className="font-medium w-16">Sub Judul:</span>
                        <span className="line-clamp-1">{book.subtitle}</span>
                      </div>
                    )}
                    {book.coAuthor && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <span className="font-medium w-16">Co-Author:</span>
                        <span className="line-clamp-1">{book.coAuthor}</span>
                      </div>
                    )}
                    {book.edition && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <span className="font-medium w-16">Edisi:</span>
                        <span>{book.edition}</span>
                      </div>
                    )}
                    {book.isbn && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <span className="font-medium w-16">ISBN:</span>
                        <span className="font-mono text-blue-600">{book.isbn}</span>
                      </div>
                    )}
                    {book.callNumber && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <span className="font-medium w-16">No. Panggil:</span>
                        <span className="font-mono text-blue-600">{book.callNumber}</span>
                      </div>
                    )}
                    {book.deweyNumber && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <span className="font-medium w-16">Dewey:</span>
                        <span className="font-mono text-green-600">{book.deweyNumber}</span>
                      </div>
                    )}
                    {book.pages && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <span className="font-medium w-16">Halaman:</span>
                        <span>{book.pages}</span>
                      </div>
                    )}
                    {book.language && book.language !== 'Indonesia' && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <span className="font-medium w-16">Bahasa:</span>
                        <span>{book.language}</span>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-gray-500 text-xs mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{book.location}</span>
                  </div>

                  {/* Subjects */}
                  {book.subjects && book.subjects.length > 0 && (
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-1">
                        {book.subjects.slice(0, 3).map((subject, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {subject}
                          </span>
                        ))}
                        {book.subjects.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            +{book.subjects.length - 3} lagi
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Abstract */}
                  {book.abstract && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        <span className="font-medium">Abstrak:</span> {book.abstract}
                      </p>
                    </div>
                  )}

                  {/* Digital Files */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">File Digital:</p>
                    <div className="flex flex-wrap gap-1">
                      {(book.digitalFiles || []).length > 0 ? (
                        (book.digitalFiles || []).map((fileUrl, index) => {
                          // Extract file extension from URL
                          const fileExtension = fileUrl.split('.').pop()?.toLowerCase() || '';
                          const fileName = fileUrl.split('/').pop() || `File ${index + 1}`;
                          
                          return (
                            <a
                              key={index}
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                              <Download className="w-3 h-3" />
                              <span className="truncate max-w-20">{fileName}</span>
                            </a>
                          );
                        })
                      ) : (
                        <span className="text-gray-500 text-xs">Tidak ada file digital</span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Profile Perpustakaan */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Profil Perpustakaan</h4>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Perpustakaan Digital</p>
                  <p className="text-sm text-gray-600">SMAN 1 Jakarta</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Perpustakaan digital modern yang menyediakan akses ke ribuan koleksi buku dan materi pembelajaran untuk mendukung proses belajar mengajar.
              </p>
              
            </div>

            {/* Menu Navigasi */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Menu Navigasi</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Beranda</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Koleksi Digital</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Katalog Online</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Riwayat Peminjaman</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Profil Pengguna</a></li>
              </ul>
            </div>

            {/* Layanan Perpustakaan */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Layanan Perpustakaan</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Peminjaman Buku</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Akses E-Book</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Ruang Baca Digital</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Konsultasi Referensi</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pelatihan Literasi</a></li>
              </ul>
            </div>

            {/* Jam Operasional & Kontak */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Jam Operasional</h4>
              <div className="space-y-2 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Senin - Jumat: 07:00 - 16:00</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Sabtu: 08:00 - 12:00</span>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">(021) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">perpus@sman1jakarta.sch.id</span>
                </div>
                <div className="flex items-center">
                  <LocationIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">Jl. Pendidikan No. 123, Jakarta</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 Perpustakaan Digital SMAN 1 Jakarta. Semua hak dilindungi undang-undang.</p>
          </div>
        </div>
      </footer>


    </div>
  );
}

export default DigitalLibrary;