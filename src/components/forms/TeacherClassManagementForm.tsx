import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Edit, 
  TrendingUp, 
  BarChart3,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Upload,
  CheckCircle,
  Clock,
  Target,
  Award,
  User,
  Calendar,
  FileText,
  Star,
  AlertCircle,
  Activity,
  Zap,
  Book,
  GraduationCap,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  studentId: string;
  class: string;
  email: string;
  booksRead: number;
  currentlyBorrowed: number;
  averageRating: number;
  readingStreak: number;
  lastActivity: string;
  readingGoal: number;
  completedAssignments: number;
  totalAssignments: number;
  literacyScore: number;
  avatar: string;
  status: 'active' | 'inactive' | 'at_risk';
}

interface Assignment {
  id: number;
  title: string;
  bookTitle: string;
  dueDate: string;
  assignedDate: string;
  completionRate: number;
  averageScore: number;
  type: 'reading' | 'summary' | 'analysis' | 'presentation';
  status: 'active' | 'completed' | 'overdue';
}

function TeacherClassManagementForm() {
  const [activeTab, setActiveTab] = useState('student-reading');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    bookTitle: '',
    description: '',
    dueDate: '',
    assignmentType: 'reading',
    points: 10,
    selectedClasses: [] as string[]
  });

  const students: Student[] = [
    {
      id: 1,
      name: "Ahmad Rizki Pratama",
      studentId: "2024001",
      class: "XII IPA 1",
      email: "ahmad.rizki@student.sman1jakarta.sch.id",
      booksRead: 15,
      currentlyBorrowed: 3,
      averageRating: 4.2,
      readingStreak: 7,
      lastActivity: "2024-01-20",
      readingGoal: 20,
      completedAssignments: 8,
      totalAssignments: 10,
      literacyScore: 85,
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      status: 'active'
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      studentId: "2024002",
      class: "XII IPA 1",
      email: "siti.nurhaliza@student.sman1jakarta.sch.id",
      booksRead: 22,
      currentlyBorrowed: 2,
      averageRating: 4.8,
      readingStreak: 14,
      lastActivity: "2024-01-21",
      readingGoal: 25,
      completedAssignments: 10,
      totalAssignments: 10,
      literacyScore: 95,
      avatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150",
      status: 'active'
    },
    {
      id: 3,
      name: "Budi Santoso",
      studentId: "2024003",
      class: "XII IPA 2",
      email: "budi.santoso@student.sman1jakarta.sch.id",
      booksRead: 5,
      currentlyBorrowed: 1,
      averageRating: 3.5,
      readingStreak: 2,
      lastActivity: "2024-01-18",
      readingGoal: 15,
      completedAssignments: 4,
      totalAssignments: 10,
      literacyScore: 65,
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
      status: 'at_risk'
    }
  ];

  const assignments: Assignment[] = [
    {
      id: 1,
      title: "Analisis Teks Argumentasi",
      bookTitle: "Bahasa Indonesia Kelas XI",
      dueDate: "2024-01-25",
      assignedDate: "2024-01-15",
      completionRate: 75,
      averageScore: 82,
      type: 'analysis',
      status: 'active'
    },
    {
      id: 2,
      title: "Ringkasan Bab Fungsi Linear",
      bookTitle: "Matematika Kelas X",
      dueDate: "2024-01-20",
      assignedDate: "2024-01-10",
      completionRate: 100,
      averageScore: 88,
      type: 'summary',
      status: 'completed'
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentId.includes(searchQuery);
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'at_risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Tidak Aktif';
      case 'at_risk': return 'Perlu Perhatian';
      default: return 'Unknown';
    }
  };

  const handleClassSelection = (className: string) => {
    setNewAssignment(prev => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(className)
        ? prev.selectedClasses.filter(c => c !== className)
        : [...prev.selectedClasses, className]
    }));
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Tugas "${newAssignment.title}" telah dibuat untuk ${newAssignment.selectedClasses.length} kelas`);
    setShowNewAssignment(false);
    setNewAssignment({
      title: '',
      bookTitle: '',
      description: '',
      dueDate: '',
      assignmentType: 'reading',
      points: 10,
      selectedClasses: []
    });
  };

  const tabs = [
    { id: 'student-reading', label: 'Bacaan Siswa', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'assignments', label: 'Tugas Membaca', icon: <Edit className="w-4 h-4" /> },
    { id: 'reading-progress', label: 'Progress Bacaan', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'class-statistics', label: 'Statistik Kelas', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const renderStudentReading = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Kelas</option>
          <option value="XII IPA 1">XII IPA 1</option>
          <option value="XII IPA 2">XII IPA 2</option>
          <option value="XI IPA 1">XI IPA 1</option>
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
          <option value="at_risk">Perlu Perhatian</option>
        </select>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.class} • {student.studentId}</p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                    {getStatusText(student.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{student.booksRead}</p>
                    <p className="text-xs text-blue-700">Buku Dibaca</p>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{student.literacyScore}</p>
                    <p className="text-xs text-green-700">Skor Literasi</p>
                  </div>
                  
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-lg font-bold text-yellow-600">{student.readingStreak}</p>
                    <p className="text-xs text-yellow-700">Hari Berturut</p>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">{student.completedAssignments}/{student.totalAssignments}</p>
                    <p className="text-xs text-purple-700">Tugas Selesai</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Aktivitas terakhir: {new Date(student.lastActivity).toLocaleDateString('id-ID')}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                      <Eye className="w-4 h-4 mr-1 inline" />
                      Detail
                    </button>
                    <button className="px-3 py-1 text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors text-sm">
                      <Mail className="w-4 h-4 mr-1 inline" />
                      Kontak
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Tugas Membaca Aktif</h3>
        <button
          onClick={() => setShowNewAssignment(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2 inline" />
          Buat Tugas Baru
        </button>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                <p className="text-sm text-gray-600">Buku: {assignment.bookTitle}</p>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                assignment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {assignment.status === 'active' ? 'Aktif' :
                 assignment.status === 'completed' ? 'Selesai' : 'Terlambat'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{assignment.completionRate}%</p>
                <p className="text-xs text-gray-600">Completion Rate</p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{assignment.averageScore}</p>
                <p className="text-xs text-gray-600">Rata-rata Nilai</p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-bold text-gray-900">{new Date(assignment.dueDate).toLocaleDateString('id-ID')}</p>
                <p className="text-xs text-gray-600">Deadline</p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-bold text-gray-900">{assignment.type}</p>
                <p className="text-xs text-gray-600">Jenis Tugas</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Dibuat: {new Date(assignment.assignedDate).toLocaleDateString('id-ID')}
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                  <Eye className="w-4 h-4 mr-1 inline" />
                  Lihat Hasil
                </button>
                <button className="px-3 py-1 text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors text-sm">
                  <Download className="w-4 h-4 mr-1 inline" />
                  Export
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReadingProgress = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Rata-rata Buku/Siswa</p>
              <p className="text-2xl font-bold text-blue-900">14.2</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Target Tercapai</p>
              <p className="text-2xl font-bold text-green-900">78%</p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Skor Literasi Rata-rata</p>
              <p className="text-2xl font-bold text-yellow-900">81.7</p>
            </div>
            <Award className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Progress Membaca per Kelas</h4>
        <div className="space-y-4">
          {['XII IPA 1', 'XII IPA 2', 'XI IPA 1'].map((className) => {
            const classStudents = students.filter(s => s.class === className);
            const avgProgress = classStudents.reduce((sum, s) => sum + (s.booksRead / s.readingGoal * 100), 0) / classStudents.length;
            
            return (
              <div key={className} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{className}</p>
                  <p className="text-sm text-gray-600">{classStudents.length} siswa</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(avgProgress, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">{Math.round(avgProgress)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderClassStatistics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Siswa</p>
              <p className="text-2xl font-bold text-blue-900">{students.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Siswa Aktif</p>
              <p className="text-2xl font-bold text-green-900">
                {students.filter(s => s.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Perlu Perhatian</p>
              <p className="text-2xl font-bold text-yellow-900">
                {students.filter(s => s.status === 'at_risk').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Tugas Aktif</p>
              <p className="text-2xl font-bold text-purple-900">
                {assignments.filter(a => a.status === 'active').length}
              </p>
            </div>
            <Edit className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Analisis Performa Kelas</h4>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Grafik analisis performa akan ditampilkan di sini</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manajemen Kelas</h2>
            <p className="text-sm text-gray-600">Kelola bacaan dan progress siswa di kelas Anda</p>
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

      {/* New Assignment Modal */}
      {showNewAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Buat Tugas Membaca Baru</h3>
                <button
                  onClick={() => setShowNewAssignment(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateAssignment} className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Tugas *
                    </label>
                    <input
                      type="text"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment(prev => ({...prev, title: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Analisis Karakter Tokoh"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buku/Materi *
                    </label>
                    <input
                      type="text"
                      value={newAssignment.bookTitle}
                      onChange={(e) => setNewAssignment(prev => ({...prev, bookTitle: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Cari atau ketik judul buku"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Tugas *
                    </label>
                    <select
                      value={newAssignment.assignmentType}
                      onChange={(e) => setNewAssignment(prev => ({...prev, assignmentType: e.target.value}))}
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
                      Deadline *
                    </label>
                    <input
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment(prev => ({...prev, dueDate: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poin/Nilai
                    </label>
                    <input
                      type="number"
                      value={newAssignment.points}
                      onChange={(e) => setNewAssignment(prev => ({...prev, points: parseInt(e.target.value)}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Kelas *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['X IPA 1', 'X IPA 2', 'X IPS 1', 'XI IPA 1', 'XI IPA 2', 'XI IPS 1', 'XII IPA 1', 'XII IPA 2', 'XII IPS 1'].map((className) => (
                      <label key={className} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAssignment.selectedClasses.includes(className)}
                          onChange={() => handleClassSelection(className)}
                          className="text-blue-600"
                        />
                        <span className="text-sm">{className}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instruksi Tugas
                  </label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment(prev => ({...prev, description: e.target.value}))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Berikan instruksi detail tentang apa yang harus dilakukan siswa"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button
                  type="submit"
                  disabled={newAssignment.selectedClasses.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2 inline" />
                  Buat Tugas
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewAssignment(false)}
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
        {activeTab === 'student-reading' && renderStudentReading()}
        {activeTab === 'assignments' && renderAssignments()}
        {activeTab === 'reading-progress' && renderReadingProgress()}
        {activeTab === 'class-statistics' && renderClassStatistics()}
      </div>
    </div>
  );
}

export default TeacherClassManagementForm;