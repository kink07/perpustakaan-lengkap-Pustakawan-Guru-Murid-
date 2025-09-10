import React, { useState } from 'react';
import { 
  Monitor, 
  Search, 
  FileText, 
  Mic, 
  Video,
  Book,
  Download,
  Eye,
  Play,
  Headphones,
  Star,
  Clock,
  User,
  Calendar,
  Filter,
  Grid,
  List,
  Bookmark,
  Share2,
  Heart,
  Volume2,
  Pause,
  SkipForward,
  SkipBack,
  Settings,
  Wifi,
  Smartphone,
  Tablet,
  Laptop
} from 'lucide-react';

interface DigitalContent {
  id: number;
  title: string;
  author: string;
  type: 'ebook' | 'audiobook' | 'video' | 'interactive';
  category: string;
  duration?: string;
  size: string;
  format: string;
  rating: number;
  downloads: number;
  description: string;
  cover: string;
  url: string;
  isOfflineAvailable: boolean;
  lastAccessed?: string;
  progress?: number;
}

function StudentDigitalLibraryForm() {
  const [activeTab, setActiveTab] = useState('browse-books');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedContent, setSelectedContent] = useState<DigitalContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const digitalContent: DigitalContent[] = [
    {
      id: 1,
      title: "Matematika Interaktif Kelas X",
      author: "Dr. Ahmad Susanto",
      type: 'interactive',
      category: '500',
      duration: '2 jam',
      size: '150 MB',
      format: 'HTML5',
      rating: 4.8,
      downloads: 1250,
      description: "Pembelajaran matematika interaktif dengan simulasi dan latihan soal",
      cover: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "#",
      isOfflineAvailable: true,
      lastAccessed: "2024-01-20",
      progress: 65
    },
    {
      id: 2,
      title: "Sejarah Indonesia Audio Book",
      author: "Prof. Sartono Kartodirdjo",
      type: 'audiobook',
      category: '900',
      duration: '8 jam 30 menit',
      size: '245 MB',
      format: 'MP3',
      rating: 4.6,
      downloads: 890,
      description: "Narasi lengkap sejarah Indonesia dari masa kerajaan hingga modern",
      cover: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "#",
      isOfflineAvailable: true,
      lastAccessed: "2024-01-18",
      progress: 25
    },
    {
      id: 3,
      title: "Fisika Eksperimen Virtual",
      author: "Dr. Bambang Ruwanto",
      type: 'video',
      category: '500',
      duration: '45 menit',
      size: '1.2 GB',
      format: 'MP4',
      rating: 4.9,
      downloads: 2100,
      description: "Video eksperimen fisika dengan simulasi 3D dan penjelasan detail",
      cover: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "#",
      isOfflineAvailable: false,
      progress: 80
    },
    {
      id: 4,
      title: "E-Book Bahasa Indonesia Lengkap",
      author: "Dra. Sri Wahyuni",
      type: 'ebook',
      category: '400',
      size: '25 MB',
      format: 'EPUB',
      rating: 4.5,
      downloads: 1580,
      description: "Buku digital lengkap bahasa Indonesia dengan fitur pencarian dan bookmark",
      cover: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "#",
      isOfflineAvailable: true,
      lastAccessed: "2024-01-15",
      progress: 40
    }
  ];

  const tabs = [
    { id: 'browse-books', label: 'Jelajahi Buku', icon: <Search className="w-4 h-4" /> },
    { id: 'e-books', label: 'E-Book', icon: <FileText className="w-4 h-4" /> },
    { id: 'audio-books', label: 'Audio Book', icon: <Mic className="w-4 h-4" /> },
    { id: 'video-learning', label: 'Video Pembelajaran', icon: <Video className="w-4 h-4" /> }
  ];

  const filteredContent = digitalContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || content.category === filterCategory;
    const matchesTab = activeTab === 'browse-books' || 
                      (activeTab === 'e-books' && content.type === 'ebook') ||
                      (activeTab === 'audio-books' && content.type === 'audiobook') ||
                      (activeTab === 'video-learning' && content.type === 'video');
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ebook': return <FileText className="w-5 h-5" />;
      case 'audiobook': return <Mic className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'interactive': return <Monitor className="w-5 h-5" />;
      default: return <Book className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ebook': return 'text-blue-600 bg-blue-50';
      case 'audiobook': return 'text-green-600 bg-green-50';
      case 'video': return 'text-red-600 bg-red-50';
      case 'interactive': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ebook': return 'E-Book';
      case 'audiobook': return 'Audio Book';
      case 'video': return 'Video';
      case 'interactive': return 'Interaktif';
      default: return 'Digital';
    }
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContent.map((content) => (
        <div key={content.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={content.cover}
              alt={content.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(content.type)}`}>
                {getTypeIcon(content.type)}
                <span>{getTypeLabel(content.type)}</span>
              </span>
            </div>
            {content.progress && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black bg-opacity-50 rounded-full p-1">
                  <div className="w-full bg-gray-300 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${content.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{content.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{content.author}</p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
              {content.duration && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{content.duration}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Download className="w-3 h-3" />
                <span>{content.downloads}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{content.rating}</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mb-4 line-clamp-2">{content.description}</p>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setSelectedContent(content)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                {content.type === 'video' ? <Play className="w-4 h-4 mr-1 inline" /> : 
                 content.type === 'audiobook' ? <Headphones className="w-4 h-4 mr-1 inline" /> :
                 <Eye className="w-4 h-4 mr-1 inline" />}
                {content.type === 'video' ? 'Tonton' : 
                 content.type === 'audiobook' ? 'Dengar' : 'Baca'}
              </button>
              <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredContent.map((content) => (
        <div key={content.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-4">
            <img
              src={content.cover}
              alt={content.title}
              className="w-16 h-20 object-cover rounded"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{content.title}</h3>
                  <p className="text-sm text-gray-600">{content.author}</p>
                </div>
                
                <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(content.type)}`}>
                  {getTypeIcon(content.type)}
                  <span>{getTypeLabel(content.type)}</span>
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  {content.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{content.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{content.rating}</span>
                  </div>
                  <span>{content.size}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                    <Eye className="w-4 h-4 mr-1 inline" />
                    Preview
                  </button>
                  <button 
                    onClick={() => setSelectedContent(content)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    {content.type === 'video' ? 'Tonton' : 
                     content.type === 'audiobook' ? 'Dengar' : 'Baca'}
                  </button>
                </div>
              </div>
              
              {content.progress && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{content.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${content.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
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
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Perpustakaan Digital</h2>
              <p className="text-sm text-gray-600">Akses konten digital dan multimedia</p>
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
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari konten digital..."
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

      {/* Content */}
      <div className="p-6">
        {viewMode === 'grid' ? renderGridView() : renderListView()}
        
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Tidak ada konten digital ditemukan</p>
            <p className="text-sm text-gray-500">Coba ubah kata kunci pencarian atau filter</p>
          </div>
        )}
      </div>

      {/* Content Player Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{selectedContent.title}</h3>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Content Player Area */}
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {getTypeIcon(selectedContent.type)}
                    </div>
                    <p className="text-gray-600 mb-4">
                      {selectedContent.type === 'video' ? 'Video player akan dimuat di sini' :
                       selectedContent.type === 'audiobook' ? 'Audio player akan dimuat di sini' :
                       'E-book reader akan dimuat di sini'}
                    </p>
                    
                    {selectedContent.type === 'audiobook' && (
                      <div className="flex items-center justify-center space-x-4">
                        <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                          <SkipBack className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </button>
                        <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                          <SkipForward className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Detail Konten</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pengarang:</span>
                          <span className="text-gray-900">{selectedContent.author}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Format:</span>
                          <span className="text-gray-900">{selectedContent.format}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ukuran:</span>
                          <span className="text-gray-900">{selectedContent.size}</span>
                        </div>
                        {selectedContent.duration && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Durasi:</span>
                            <span className="text-gray-900">{selectedContent.duration}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-gray-900">{selectedContent.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Deskripsi</h4>
                      <p className="text-sm text-gray-600">{selectedContent.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="w-4 h-4 mr-2 inline" />
                        Download untuk Offline
                      </button>
                      <button className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        <Share2 className="w-4 h-4 mr-2 inline" />
                        Bagikan
                      </button>
                      <button className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Heart className="w-4 h-4 mr-2 inline" />
                        Tambah ke Favorit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDigitalLibraryForm;