import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Share2,
  Folder,
  Tag,
  Calendar,
  User,
  Clock,
  Star,
  BookOpen,
  Video,
  Image,
  Mic,
  Archive,
  Link,
  Copy,
  Save,
  RefreshCw
} from 'lucide-react';

interface TeachingMaterial {
  id: number;
  title: string;
  subject: string;
  grade: string;
  chapter: string;
  type: 'document' | 'presentation' | 'worksheet' | 'assessment' | 'multimedia';
  format: string;
  size: string;
  uploadDate: string;
  lastModified: string;
  downloads: number;
  views: number;
  rating: number;
  description: string;
  tags: string[];
  isPublic: boolean;
  sharedWith: string[];
  fileUrl: string;
}

function TeacherTeachingMaterialsForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: '',
    grade: '',
    chapter: '',
    type: 'document',
    description: '',
    tags: [] as string[],
    newTag: '',
    isPublic: false,
    file: null as File | null
  });

  const teachingMaterials: TeachingMaterial[] = [
    {
      id: 1,
      title: "Lembar Kerja Fungsi Kuadrat",
      subject: "Matematika",
      grade: "X",
      chapter: "Fungsi Kuadrat",
      type: 'worksheet',
      format: 'PDF',
      size: '2.5 MB',
      uploadDate: '2024-01-15',
      lastModified: '2024-01-20',
      downloads: 45,
      views: 128,
      rating: 4.7,
      description: "Lembar kerja interaktif untuk memahami konsep fungsi kuadrat dengan berbagai variasi soal",
      tags: ['matematika', 'fungsi', 'kuadrat', 'latihan'],
      isPublic: true,
      sharedWith: ['X IPA 1', 'X IPA 2'],
      fileUrl: '#'
    },
    {
      id: 2,
      title: "Presentasi Hukum Newton",
      subject: "Fisika",
      grade: "XI",
      chapter: "Dinamika",
      type: 'presentation',
      format: 'PPTX',
      size: '15.8 MB',
      uploadDate: '2024-01-10',
      lastModified: '2024-01-18',
      downloads: 32,
      views: 89,
      rating: 4.5,
      description: "Presentasi lengkap tentang hukum Newton dengan animasi dan contoh aplikasi",
      tags: ['fisika', 'newton', 'dinamika', 'presentasi'],
      isPublic: false,
      sharedWith: ['XI IPA 1'],
      fileUrl: '#'
    },
    {
      id: 3,
      title: "Video Eksperimen Kimia Organik",
      subject: "Kimia",
      grade: "XII",
      chapter: "Kimia Organik",
      type: 'multimedia',
      format: 'MP4',
      size: '125 MB',
      uploadDate: '2024-01-08',
      lastModified: '2024-01-12',
      downloads: 67,
      views: 234,
      rating: 4.9,
      description: "Video demonstrasi eksperimen kimia organik dengan penjelasan step-by-step",
      tags: ['kimia', 'organik', 'eksperimen', 'video'],
      isPublic: true,
      sharedWith: ['XII IPA 1', 'XII IPA 2'],
      fileUrl: '#'
    }
  ];

  const filteredMaterials = teachingMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = filterSubject === 'all' || material.subject === filterSubject;
    const matchesType = filterType === 'all' || material.type === filterType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-5 h-5" />;
      case 'presentation': return <FileText className="w-5 h-5" />;
      case 'worksheet': return <Edit className="w-5 h-5" />;
      case 'assessment': return <CheckCircle className="w-5 h-5" />;
      case 'multimedia': return <Video className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'text-blue-600 bg-blue-50';
      case 'presentation': return 'text-green-600 bg-green-50';
      case 'worksheet': return 'text-orange-600 bg-orange-50';
      case 'assessment': return 'text-purple-600 bg-purple-50';
      case 'multimedia': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'document': return 'Dokumen';
      case 'presentation': return 'Presentasi';
      case 'worksheet': return 'Lembar Kerja';
      case 'assessment': return 'Penilaian';
      case 'multimedia': return 'Multimedia';
      default: return 'File';
    }
  };

  const handleAddTag = () => {
    if (newMaterial.newTag.trim() && !newMaterial.tags.includes(newMaterial.newTag.trim())) {
      setNewMaterial(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewMaterial(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Materi pembelajaran berhasil diupload!');
    setShowUploadModal(false);
    setNewMaterial({
      title: '',
      subject: '',
      grade: '',
      chapter: '',
      type: 'document',
      description: '',
      tags: [],
      newTag: '',
      isPublic: false,
      file: null
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Materi Ajar</h2>
              <p className="text-sm text-gray-600">Kelola dan bagikan materi pembelajaran</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Upload Materi
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
              placeholder="Cari materi ajar..."
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
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Jenis</option>
            <option value="document">Dokumen</option>
            <option value="presentation">Presentasi</option>
            <option value="worksheet">Lembar Kerja</option>
            <option value="assessment">Penilaian</option>
            <option value="multimedia">Multimedia</option>
          </select>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Upload Materi Ajar</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpload} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Materi *
                  </label>
                  <input
                    type="text"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial(prev => ({...prev, title: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan judul materi"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mata Pelajaran *
                    </label>
                    <select
                      value={newMaterial.subject}
                      onChange={(e) => setNewMaterial(prev => ({...prev, subject: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Pilih Mata Pelajaran</option>
                      <option value="Matematika">Matematika</option>
                      <option value="Fisika">Fisika</option>
                      <option value="Kimia">Kimia</option>
                      <option value="Biologi">Biologi</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                      <option value="Bahasa Inggris">Bahasa Inggris</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kelas *
                    </label>
                    <select
                      value={newMaterial.grade}
                      onChange={(e) => setNewMaterial(prev => ({...prev, grade: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Pilih Kelas</option>
                      <option value="X">Kelas X</option>
                      <option value="XI">Kelas XI</option>
                      <option value="XII">Kelas XII</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bab/Topik
                    </label>
                    <input
                      type="text"
                      value={newMaterial.chapter}
                      onChange={(e) => setNewMaterial(prev => ({...prev, chapter: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama bab atau topik"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Materi *
                    </label>
                    <select
                      value={newMaterial.type}
                      onChange={(e) => setNewMaterial(prev => ({...prev, type: e.target.value as any}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="document">Dokumen</option>
                      <option value="presentation">Presentasi</option>
                      <option value="worksheet">Lembar Kerja</option>
                      <option value="assessment">Penilaian</option>
                      <option value="multimedia">Multimedia</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Materi
                  </label>
                  <textarea
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial(prev => ({...prev, description: e.target.value}))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Jelaskan isi dan tujuan materi ini"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag Materi
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMaterial.newTag}
                        onChange={(e) => setNewMaterial(prev => ({...prev, newTag: e.target.value}))}
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
                    
                    {newMaterial.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newMaterial.tags.map((tag) => (
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Klik untuk upload atau drag & drop</p>
                    <p className="text-xs text-gray-500">PDF, DOC, PPT, XLS, gambar, video (max 100MB)</p>
                    <input
                      type="file"
                      onChange={(e) => setNewMaterial(prev => ({...prev, file: e.target.files?.[0] || null}))}
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Pilih File
                      </span>
                    </label>
                  </div>
                  {newMaterial.file && (
                    <div className="mt-2 text-sm text-gray-600">
                      File terpilih: {newMaterial.file.name}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newMaterial.isPublic}
                    onChange={(e) => setNewMaterial(prev => ({...prev, isPublic: e.target.checked}))}
                    className="text-blue-600"
                  />
                  <label className="text-sm text-gray-700">
                    Bagikan dengan guru lain (publik)
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2 inline" />
                  Upload Materi
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Materials List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredMaterials.map((material) => (
            <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getTypeColor(material.type)}`}>
                  {getTypeIcon(material.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{material.title}</h3>
                      <p className="text-sm text-gray-600">{material.subject} - Kelas {material.grade}</p>
                      {material.chapter && (
                        <p className="text-xs text-gray-500">Bab: {material.chapter}</p>
                      )}
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                      {getTypeLabel(material.type)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{material.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {material.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Download className="w-3 h-3" />
                      <span>{material.downloads} downloads</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{material.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{material.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Archive className="w-3 h-3" />
                      <span>{material.size}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Diupload: {new Date(material.uploadDate).toLocaleDateString('id-ID')} • 
                      Dibagikan ke: {material.sharedWith.join(', ')}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                        <Eye className="w-4 h-4 mr-1 inline" />
                        Preview
                      </button>
                      <button className="px-3 py-1 text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors text-sm">
                        <Download className="w-4 h-4 mr-1 inline" />
                        Download
                      </button>
                      <button className="px-3 py-1 text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors text-sm">
                        <Share2 className="w-4 h-4 mr-1 inline" />
                        Bagikan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Belum ada materi ajar</p>
            <p className="text-sm text-gray-500">Upload materi pertama Anda</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherTeachingMaterialsForm;