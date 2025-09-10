import React, { useState } from 'react';
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
  LogIn,
  Share2,
  Heart,
  Bookmark
} from 'lucide-react';
import { BookData } from '../types/book';
import { DDC_CATEGORIES } from '../constants/ddcCategories';
import LoginModal from './LoginModal';
import Dashboard from './Dashboard';

interface DigitalLibraryProps {
  books: BookData[];
  currentUser?: any;
  onNavigateToDashboard?: () => void;
  onOpenLogin?: () => void;
}

function DigitalLibrary({ books, currentUser, onNavigateToDashboard, onOpenLogin }: DigitalLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

            {/* Language Toggle */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <button
                  onClick={onNavigateToDashboard}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {currentUser.role === 'student' ? 'Siswa' : currentUser.role === 'teacher' ? 'Guru' : 'Pustakawan'}
                    </p>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (onOpenLogin) {
                      onOpenLogin();
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">Masuk</span>
                </button>
              )}
              
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {/* Book Cover */}
                <div className="relative overflow-hidden">
                  <img
                    src={book.cover || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300'}
                    alt={book.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {DDC_CATEGORIES.find(cat => cat.value === book.category)?.label.split(' - ')[0] || book.category}
                    </span>
                  </div>
                  
                  {/* Action Icons */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                      title="Bagikan"
                    >
                      <Share2 className="w-4 h-4 text-gray-700 hover:text-blue-600" />
                    </button>
                    <button 
                      className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                      title="Tambah ke Favorit"
                    >
                      <Heart className="w-4 h-4 text-gray-700 hover:text-red-600" />
                    </button>
                    <button 
                      className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                      title="Simpan untuk Nanti"
                    >
                      <Bookmark className="w-4 h-4 text-gray-700 hover:text-green-600" />
                    </button>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-600 mb-3">{book.author}</p>

                  
                  {/* Book Details */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className="font-medium w-20">Terbit:</span>
                      <span>{book.publisher}, {book.publicationYear}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className="font-medium w-20">No. Panggil:</span>
                      <span className="font-mono text-blue-600">{book.callNumber}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{book.location}</span>
                  </div>

                  {/* Digital Files */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">File Digital:</p>
                    <div className="flex flex-wrap gap-2">
                      {book.digitalFiles.map((fileType, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getFileColor(fileType)}`}
                        >
                          {getFileIcon(fileType)}
                          <span>{fileType}</span>
                        </div>
                      ))}
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
              <p className="text-gray-600 text-sm">
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