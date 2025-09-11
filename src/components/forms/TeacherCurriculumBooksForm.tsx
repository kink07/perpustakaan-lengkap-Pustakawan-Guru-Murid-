import React, { useState, useEffect } from 'react';
import { 
  Book, 
  GraduationCap, 
  Users, 
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Upload,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  FileText,
  Edit,
  Share2,
  Bookmark,
  Star,
  Award,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { databaseService } from '../../services/database';
import { CurriculumBook } from '../../types/database';

function TeacherCurriculumBooksForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [curriculumBooks, setCurriculumBooks] = useState<CurriculumBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<CurriculumBook | null>(null);
  const [assignmentData, setAssignmentData] = useState({
    selectedClasses: [] as string[],
    dueDate: '',
    instructions: '',
    assessmentType: 'reading',
    points: 10
  });

  // Load curriculum books from database
  useEffect(() => {
    const loadCurriculumBooks = async () => {
      try {
        setLoading(true);
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser && currentUser.id && currentUser.role === 'teacher') {
          const books = await databaseService.getCurriculumBooks(currentUser.id);
          setCurriculumBooks(books);
        }
      } catch (error) {
        console.error('Error loading curriculum books:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurriculumBooks();
  }, []);

  // Create new curriculum book
  const handleCreateCurriculumBook = async (bookData: Partial<CurriculumBook>) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser && currentUser.id && currentUser.role === 'teacher') {
        const newBook = await databaseService.createCurriculumBook(currentUser.id, bookData);
        if (newBook) {
          setCurriculumBooks(prev => [newBook, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error creating curriculum book:', error);
    }
  };

  const filteredBooks = curriculumBooks.filter(book => {
    const bookData = book.book;
    if (!bookData) return false;
    
    const matchesSearch = bookData.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookData.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (book.chapter && book.chapter.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = filterSubject === 'all' || book.subject === filterSubject;
    const matchesGrade = filterGrade === 'all' || book.grade === filterGrade;
    return matchesSearch && matchesSubject && matchesGrade;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Pemula';
      case 'intermediate': return 'Menengah';
      case 'advanced': return 'Lanjutan';
      default: return 'Unknown';
    }
  };

  const handleAssignToClass = (book: CurriculumBook) => {
    setSelectedBook(book);
    setShowAssignModal(true);
  };

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Buku "${selectedBook?.title}" telah di-assign ke ${assignmentData.selectedClasses.length} kelas`);
    setShowAssignModal(false);
    setAssignmentData({
      selectedClasses: [],
      dueDate: '',
      instructions: '',
      assessmentType: 'reading',
      points: 10
    });
  };

  const handleClassSelection = (className: string) => {
    setAssignmentData(prev => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(className)
        ? prev.selectedClasses.filter(c => c !== className)
        : [...prev.selectedClasses, className]
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Buku Kurikulum</h2>
              <p className="text-sm text-gray-600">Kelola materi pembelajaran sesuai kurikulum</p>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2 inline" />
            Tambah Materi
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari materi kurikulum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Mata Pelajaran</option>
            <option value="Matematika">Matematika</option>
            <option value="Fisika">Fisika</option>
            <option value="Kimia">Kimia</option>
            <option value="Biologi">Biologi</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="Bahasa Inggris">Bahasa Inggris</option>
            <option value="Sejarah">Sejarah</option>
            <option value="Geografi">Geografi</option>
          </select>
          
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Kelas</option>
            <option value="X">Kelas X</option>
            <option value="XI">Kelas XI</option>
            <option value="XII">Kelas XII</option>
          </select>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Assign Materi ke Kelas</h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmitAssignment} className="p-6">
              <div className="space-y-6">
                {/* Book Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={selectedBook.cover}
                      alt={selectedBook.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedBook.title}</h4>
                      <p className="text-sm text-gray-600">{selectedBook.author}</p>
                      <p className="text-sm text-gray-500">Bab: {selectedBook.chapter}</p>
                    </div>
                  </div>
                </div>
                
                {/* Class Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Kelas *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['X IPA 1', 'X IPA 2', 'X IPS 1', 'XI IPA 1', 'XI IPA 2', 'XI IPS 1', 'XII IPA 1', 'XII IPA 2', 'XII IPS 1'].map((className) => (
                      <label key={className} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={assignmentData.selectedClasses.includes(className)}
                          onChange={() => handleClassSelection(className)}
                          className="text-blue-600"
                        />
                        <span className="text-sm">{className}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Deadline *
                    </label>
                    <input
                      type="date"
                      value={assignmentData.dueDate}
                      onChange={(e) => setAssignmentData(prev => ({...prev, dueDate: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Penilaian
                    </label>
                    <select
                      value={assignmentData.assessmentType}
                      onChange={(e) => setAssignmentData(prev => ({...prev, assessmentType: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="reading">Tugas Membaca</option>
                      <option value="summary">Ringkasan</option>
                      <option value="analysis">Analisis</option>
                      <option value="presentation">Presentasi</option>
                      <option value="quiz">Kuis</option>
                      <option value="project">Proyek</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poin/Nilai
                    </label>
                    <input
                      type="number"
                      value={assignmentData.points}
                      onChange={(e) => setAssignmentData(prev => ({...prev, points: parseInt(e.target.value)}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimasi Waktu Baca (menit)
                    </label>
                    <input
                      type="number"
                      value={selectedBook.estimatedReadingTime}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instruksi untuk Siswa
                  </label>
                  <textarea
                    value={assignmentData.instructions}
                    onChange={(e) => setAssignmentData(prev => ({...prev, instructions: e.target.value}))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Berikan instruksi detail tentang apa yang harus dilakukan siswa dengan materi ini"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tujuan Pembelajaran
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {selectedBook.learningObjectives.map((objective, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button
                  type="submit"
                  disabled={assignmentData.selectedClasses.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Users className="w-4 h-4 mr-2 inline" />
                  Assign ke {assignmentData.selectedClasses.length} Kelas
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Books List */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat buku kurikulum...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBooks.map((book) => {
              const bookData = book.book;
              if (!bookData) return null;
              
              return (
                <div key={book.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-6">
                    <img
                      src={bookData.cover || "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300"}
                      alt={bookData.title}
                      className="w-20 h-28 object-cover rounded border border-gray-200"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{bookData.title}</h3>
                          <p className="text-sm text-gray-600 mb-1">{bookData.author}</p>
                          <p className="text-sm text-blue-600 font-medium">{book.subject} - Kelas {book.grade}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(book.difficulty)}`}>
                            {getDifficultyText(book.difficulty)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{book.student_feedback}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <p className="text-sm font-medium text-blue-900 mb-2">Bab: {book.chapter || 'Tidak ada bab'}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{book.estimated_reading_time} menit</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{book.assigned_classes.length} kelas</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Target className="w-4 h-4 mr-2" />
                            <span>{book.completion_rate}% selesai</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Tujuan Pembelajaran:</p>
                        <ul className="space-y-1">
                          {book.learning_objectives.slice(0, 2).map((objective, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                              <span className="text-xs text-gray-600">{objective}</span>
                            </li>
                          ))}
                          {book.learning_objectives.length > 2 && (
                            <li className="text-xs text-blue-600 ml-5">+{book.learning_objectives.length - 2} tujuan lainnya</li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Format Digital:</p>
                        <div className="flex flex-wrap gap-2">
                          {book.digital_formats.map((format) => (
                            <span key={format} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {format}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Materi Pendukung:</p>
                        <div className="flex flex-wrap gap-2">
                          {book.supplementary_materials.map((material) => (
                            <span key={material} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Terakhir di-assign: {book.last_assigned ? new Date(book.last_assigned).toLocaleDateString('id-ID') : 'Belum pernah'}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                            <Eye className="w-4 h-4 mr-1 inline" />
                            Preview
                          </button>
                          
                          <button className="px-3 py-1 text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors text-sm">
                            <BarChart3 className="w-4 h-4 mr-1 inline" />
                            Statistik
                          </button>
                          
                          <button
                            onClick={() => handleAssignToClass(book)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Users className="w-4 h-4 mr-1 inline" />
                            Assign ke Kelas
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Tidak ada materi kurikulum ditemukan</p>
            <p className="text-sm text-gray-500">Coba ubah filter pencarian Anda</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Book className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Materi</p>
                <p className="text-lg font-bold text-gray-900">{curriculumBooks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kelas Aktif</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Set(curriculumBooks.flatMap(book => book.assignedClasses)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rata-rata Completion</p>
                <p className="text-lg font-bold text-gray-900">
                  {Math.round(curriculumBooks.reduce((sum, book) => sum + book.completionRate, 0) / curriculumBooks.length)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rata-rata Rating</p>
                <p className="text-lg font-bold text-gray-900">
                  {(curriculumBooks.reduce((sum, book) => sum + book.studentFeedback, 0) / curriculumBooks.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherCurriculumBooksForm;