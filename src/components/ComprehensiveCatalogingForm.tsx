import React, { useState } from 'react';
import { 
  Book, 
  Save, 
  X, 
  Plus, 
  Search, 
  Upload, 
  Camera,
  FileText,
  User,
  Calendar,
  MapPin,
  Hash,
  Globe,
  Tag,
  Bookmark,
  Edit3,
  CheckCircle,
  AlertCircle,
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Copy,
  Settings,
  Archive,
  Database
} from 'lucide-react';

interface BookData {
  id?: string;
  // Informasi Dasar
  title: string;
  subtitle: string;
  author: string;
  coAuthor: string;
  editor: string;
  translator: string;
  abstract: string;
  
  // Publikasi
  publisher: string;
  publicationPlace: string;
  publicationYear: string;
  edition: string;
  isbn: string;
  issn: string;
  language: string;
  series: string;
  volume: string;
  
  // Klasifikasi
  deweyNumber: string;
  callNumber: string;
  subjects: string[];
  contentType: string;
  mediaType: string;
  carrierType: string;
  
  // Deskripsi Fisik
  pages: string;
  dimensions: string;
  condition: string;
  physicalDescription: string;
  notes: string;
  
  // Pengadaan
  location: string;
  copyNumber: string;
  barcode: string;
  price: string;
  source: string;
  acquisitionDate: string;
  
  // Status
  status: 'available' | 'borrowed' | 'maintenance' | 'lost';
  createdAt: string;
  updatedAt: string;
}

function ComprehensiveCatalogingForm() {
  const [activeTab, setActiveTab] = useState('descriptive');
  const [viewMode, setViewMode] = useState<'form' | 'list'>('form');
  const [editingBook, setEditingBook] = useState<BookData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Sample book data
  const [books, setBooks] = useState<BookData[]>([
    {
      id: '1',
      title: 'Matematika Kelas X',
      subtitle: 'Kurikulum Merdeka',
      author: 'Dr. Ahmad Susanto, M.Pd',
      coAuthor: 'Dra. Siti Nurhaliza',
      editor: 'Prof. Dr. Bambang Ruwanto',
      translator: '',
      abstract: 'Buku matematika untuk siswa kelas X yang mengikuti kurikulum merdeka dengan pendekatan kontekstual dan berbasis masalah.',
      publisher: 'Erlangga',
      publicationPlace: 'Jakarta',
      publicationYear: '2023',
      edition: '1',
      isbn: '978-602-298-123-4',
      issn: '',
      language: 'Indonesia',
      series: 'Kurikulum Merdeka',
      volume: '1',
      deweyNumber: '510.07',
      callNumber: '510.07 SUS m',
      subjects: ['Matematika', 'Pendidikan', 'SMA'],
      contentType: 'Teks',
      mediaType: 'Tanpa Mediasi',
      carrierType: 'Volume',
      pages: '324',
      dimensions: '25 x 18 cm',
      condition: 'Baik',
      physicalDescription: 'Buku dengan sampul berwarna biru, berisi ilustrasi dan diagram matematika',
      notes: 'Dilengkapi dengan CD pembelajaran interaktif',
      location: 'Rak A-1, Lantai 1',
      copyNumber: '1',
      barcode: '2024001001',
      price: '125000',
      source: 'Pembelian',
      acquisitionDate: '2024-01-15',
      status: 'available',
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: '2',
      title: 'Sejarah Indonesia Modern',
      subtitle: 'Dari Kemerdekaan hingga Reformasi',
      author: 'Prof. Dr. Sartono Kartodirdjo',
      coAuthor: 'Dr. Anhar Gonggong',
      editor: 'Dr. Taufik Abdullah',
      translator: '',
      abstract: 'Kajian komprehensif tentang sejarah Indonesia modern mulai dari proklamasi kemerdekaan hingga era reformasi.',
      publisher: 'Gramedia Pustaka Utama',
      publicationPlace: 'Jakarta',
      publicationYear: '2022',
      edition: '3',
      isbn: '978-602-03-4567-8',
      issn: '',
      language: 'Indonesia',
      series: 'Sejarah Nusantara',
      volume: '2',
      deweyNumber: '959.8',
      callNumber: '959.8 KAR s',
      subjects: ['Sejarah', 'Indonesia', 'Politik'],
      contentType: 'Teks',
      mediaType: 'Tanpa Mediasi',
      carrierType: 'Volume',
      pages: '456',
      dimensions: '23 x 15 cm',
      condition: 'Sangat Baik',
      physicalDescription: 'Buku hardcover dengan foto-foto sejarah dan peta',
      notes: 'Edisi revisi dengan tambahan bab tentang era digital',
      location: 'Rak B-3, Lantai 2',
      copyNumber: '2',
      barcode: '2024002001',
      price: '185000',
      source: 'Hibah',
      acquisitionDate: '2024-02-10',
      status: 'borrowed',
      createdAt: '2024-02-10T09:30:00Z',
      updatedAt: '2024-02-10T09:30:00Z'
    },
    {
      id: '3',
      title: 'Fisika Dasar',
      subtitle: 'Mekanika dan Termodinamika',
      author: 'Dr. Bambang Ruwanto, M.Si',
      coAuthor: 'Dr. Widagdo Setiabudi',
      editor: 'Prof. Dr. Yohanes Surya',
      translator: '',
      abstract: 'Buku fisika dasar yang membahas konsep mekanika klasik dan termodinamika dengan pendekatan eksperimental.',
      publisher: 'ITB Press',
      publicationPlace: 'Bandung',
      publicationYear: '2023',
      edition: '2',
      isbn: '978-979-861-234-5',
      issn: '',
      language: 'Indonesia',
      series: 'Fisika untuk Semua',
      volume: '1',
      deweyNumber: '530',
      callNumber: '530 RUW f',
      subjects: ['Fisika', 'Mekanika', 'Termodinamika'],
      contentType: 'Teks',
      mediaType: 'Tanpa Mediasi',
      carrierType: 'Volume',
      pages: '398',
      dimensions: '24 x 17 cm',
      condition: 'Baik',
      physicalDescription: 'Buku dengan ilustrasi diagram dan rumus fisika, sampul berwarna hijau',
      notes: 'Dilengkapi dengan soal latihan dan pembahasan',
      location: 'Rak C-2, Lantai 1',
      copyNumber: '3',
      barcode: '2024003001',
      price: '165000',
      source: 'Pembelian',
      acquisitionDate: '2024-01-20',
      status: 'available',
      createdAt: '2024-01-20T10:15:00Z',
      updatedAt: '2024-01-20T10:15:00Z'
    },
    {
      id: '4',
      title: 'Bahasa Indonesia Kelas XI',
      subtitle: 'Komunikasi Efektif',
      author: 'Dra. Sri Wahyuni, M.Pd',
      coAuthor: 'Drs. Agus Trianto',
      editor: 'Dr. Dendy Sugono',
      translator: '',
      abstract: 'Buku pembelajaran bahasa Indonesia untuk kelas XI dengan fokus pada kemampuan komunikasi efektif dan literasi.',
      publisher: 'Balai Pustaka',
      publicationPlace: 'Jakarta',
      publicationYear: '2023',
      edition: '1',
      isbn: '978-979-407-789-0',
      issn: '',
      language: 'Indonesia',
      series: 'Bahasa Indonesia Modern',
      volume: '2',
      deweyNumber: '499.221',
      callNumber: '499.221 WAH b',
      subjects: ['Bahasa Indonesia', 'Komunikasi', 'Literasi'],
      contentType: 'Teks',
      mediaType: 'Tanpa Mediasi',
      carrierType: 'Volume',
      pages: '287',
      dimensions: '25 x 18 cm',
      condition: 'Sangat Baik',
      physicalDescription: 'Buku dengan sampul soft cover, berisi contoh teks dan latihan komunikasi',
      notes: 'Dilengkapi dengan audio untuk latihan berbicara',
      location: 'Rak A-5, Lantai 1',
      copyNumber: '1',
      barcode: '2024004001',
      price: '95000',
      source: 'Pembelian',
      acquisitionDate: '2024-03-05',
      status: 'maintenance',
      createdAt: '2024-03-05T11:20:00Z',
      updatedAt: '2024-03-05T11:20:00Z'
    },
    {
      id: '5',
      title: 'Kimia Organik',
      subtitle: 'Struktur dan Reaksi',
      author: 'Prof. Dr. Mulyono Hamjoyo',
      coAuthor: 'Dr. Ratna Sari Dewi',
      editor: 'Prof. Dr. Ismunandar',
      translator: '',
      abstract: 'Pembahasan mendalam tentang kimia organik meliputi struktur molekul, mekanisme reaksi, dan sintesis senyawa organik.',
      publisher: 'Universitas Indonesia Press',
      publicationPlace: 'Depok',
      publicationYear: '2022',
      edition: '4',
      isbn: '978-979-456-123-7',
      issn: '',
      language: 'Indonesia',
      series: 'Kimia Terapan',
      volume: '3',
      deweyNumber: '547',
      callNumber: '547 MUL k',
      subjects: ['Kimia', 'Kimia Organik', 'Molekul'],
      contentType: 'Teks',
      mediaType: 'Tanpa Mediasi',
      carrierType: 'Volume',
      pages: '512',
      dimensions: '26 x 19 cm',
      condition: 'Baik',
      physicalDescription: 'Buku tebal dengan struktur molekul dan diagram reaksi kimia',
      notes: 'Referensi utama untuk mahasiswa kimia tingkat lanjut',
      location: 'Rak D-1, Lantai 2',
      copyNumber: '2',
      barcode: '2024005001',
      price: '225000',
      source: 'Hibah Universitas',
      acquisitionDate: '2024-02-15',
      status: 'available',
      createdAt: '2024-02-15T14:30:00Z',
      updatedAt: '2024-02-15T14:30:00Z'
    },
    {
      id: '6',
      title: 'Biologi Sel dan Molekuler',
      subtitle: 'Dasar-dasar Kehidupan',
      author: 'Dr. Siti Rahayu Lestari, M.Si',
      coAuthor: 'Dr. Budi Santoso',
      editor: 'Prof. Dr. Sangkot Marzuki',
      translator: '',
      abstract: 'Eksplorasi komprehensif tentang struktur dan fungsi sel, proses molekuler, dan mekanisme kehidupan tingkat seluler.',
      publisher: 'Gadjah Mada University Press',
      publicationPlace: 'Yogyakarta',
      publicationYear: '2023',
      edition: '2',
      isbn: '978-602-386-456-8',
      issn: '',
      language: 'Indonesia',
      series: 'Biologi Modern',
      volume: '1',
      deweyNumber: '571.6',
      callNumber: '571.6 RAH b',
      subjects: ['Biologi', 'Sel', 'Molekuler', 'Genetika'],
      contentType: 'Teks',
      mediaType: 'Tanpa Mediasi',
      carrierType: 'Volume',
      pages: '445',
      dimensions: '24 x 17 cm',
      condition: 'Sangat Baik',
      physicalDescription: 'Buku dengan ilustrasi mikroskopis sel dan diagram molekuler berwarna',
      notes: 'Dilengkapi dengan CD berisi animasi proses seluler',
      location: 'Rak C-4, Lantai 2',
      copyNumber: '1',
      barcode: '2024006001',
      price: '195000',
      source: 'Pembelian',
      acquisitionDate: '2024-03-10',
      status: 'borrowed',
      createdAt: '2024-03-10T16:45:00Z',
      updatedAt: '2024-03-10T16:45:00Z'
    },
    {
      id: '7',
      title: 'Ekonomi Makro',
      subtitle: 'Teori dan Aplikasi',
      author: 'Prof. Dr. Boediono',
      coAuthor: 'Dr. Sri Mulyani Indrawati',
      editor: 'Dr. Chatib Basri',
      translator: '',
      abstract: 'Analisis mendalam tentang ekonomi makro Indonesia dengan pendekatan teoritis dan praktis dalam konteks global.',
      publisher: 'BPFE Yogyakarta',
      publicationPlace: 'Yogyakarta',
      publicationYear: '2022',
      edition: '5',
      isbn: '978-979-503-234-9',
      issn: '',
      language: 'Indonesia',
      series: 'Ekonomi Indonesia',
      volume: '2',
      deweyNumber: '339',
      callNumber: '339 BOE e',
      subjects: ['Ekonomi', 'Makro', 'Kebijakan', 'Indonesia'],
      contentType: 'Teks',
      mediaType: 'Tanpa Mediasi',
      carrierType: 'Volume',
      pages: '378',
      dimensions: '23 x 15 cm',
      condition: 'Baik',
      physicalDescription: 'Buku dengan grafik ekonomi dan tabel statistik',
      notes: 'Studi kasus ekonomi Indonesia terkini',
      location: 'Rak E-2, Lantai 1',
      copyNumber: '3',
      barcode: '2024007001',
      price: '155000',
      source: 'Pembelian',
      acquisitionDate: '2024-01-25',
      status: 'available',
      createdAt: '2024-01-25T13:20:00Z',
      updatedAt: '2024-01-25T13:20:00Z'
    },
    {
      id: '8',
      title: 'Sosiologi Pendidikan',
      subtitle: 'Perspektif Kontemporer',
      author: 'Dr. Nasution Harahap, M.A',
      coAuthor: 'Dr. Ida Bagus Mantra',
      editor: 'Prof. Dr. Selo Soemardjan',
      translator: '',
      abstract: 'Kajian sosiologi pendidikan dengan perspektif kontemporer, membahas isu-isu pendidikan dalam masyarakat modern.',
      publisher: 'Rajawali Pers',
      publicationPlace: 'Jakarta',
      publicationYear: '2023',
      edition: '3',
      isbn: '978-602-425-678-1',
      issn: '',
      language: 'Indonesia',
      series: 'Sosiologi Terapan',
      volume: '1',
      deweyNumber: '370.19',
      callNumber: '370.19 NAS s',
      subjects: ['Sosiologi', 'Pendidikan', 'Masyarakat', 'Kontemporer'],
      contentType: 'Teks',
      mediaType: 'Tanpa Mediasi',
      carrierType: 'Volume',
      pages: '312',
      dimensions: '23 x 15 cm',
      condition: 'Baik',
      physicalDescription: 'Buku dengan studi kasus dan analisis sosial pendidikan',
      notes: 'Dilengkapi dengan penelitian lapangan terbaru',
      location: 'Rak F-1, Lantai 2',
      copyNumber: '2',
      barcode: '2024008001',
      price: '135000',
      source: 'Hibah',
      acquisitionDate: '2024-02-20',
      status: 'available',
      createdAt: '2024-02-20T09:15:00Z',
      updatedAt: '2024-02-20T09:15:00Z'
    },
    {
      id: '9',
      title: 'Geografi Indonesia',
      subtitle: 'Fisik dan Manusia',
      author: 'Prof. Dr. Bintarto',
      coAuthor: 'Dr. Surastopo Hadisumarno',
      editor: 'Dr. Nursid Sumaatmadja',
      translator: '',
      abstract: 'Pembahasan komprehensif tentang geografi Indonesia meliputi aspek fisik, manusia, dan lingkungan.',
      publisher: 'LP3ES',
      publicationPlace: 'Jakarta',
      publicationYear: '2022',
      edition: '6',
      isbn: '978-979-8391-45-2',
      issn: '',
      language: 'Indonesia',
      series: 'Geografi Nusantara',
      volume: '1',
      deweyNumber: '915.98',
      callNumber: '915.98 BIN g',
      subjects: ['Geografi', 'Indonesia', 'Fisik', 'Manusia'],
      contentType: 'Teks',
      mediaType: 'Tanpa Mediasi',
      carrierType: 'Volume',
      pages: '467',
      dimensions: '25 x 18 cm',
      condition: 'Sangat Baik',
      physicalDescription: 'Buku dengan peta berwarna dan foto-foto geografis Indonesia',
      notes: 'Atlas mini Indonesia terlampir',
      location: 'Rak G-3, Lantai 1',
      copyNumber: '1',
      barcode: '2024009001',
      price: '175000',
      source: 'Pembelian',
      acquisitionDate: '2024-03-01',
      status: 'lost',
      createdAt: '2024-03-01T11:30:00Z',
      updatedAt: '2024-03-01T11:30:00Z'
    },
    {
      id: '10',
      title: 'Psikologi Perkembangan',
      subtitle: 'Anak dan Remaja',
      author: 'Dr. Sarlito Wirawan Sarwono',
      coAuthor: 'Dr. Eko A. Meinarno',
      editor: 'Prof. Dr. Fuad Nashori',
      translator: '',
      abstract: 'Studi komprehensif tentang perkembangan psikologi anak dan remaja dengan pendekatan multidisipliner.',
      publisher: 'Salemba Humanika',
      publicationPlace: 'Jakarta',
      publicationYear: '2023',
      edition: '4',
      isbn: '978-602-5614-89-3',
      issn: '',
      language: 'Indonesia',
      series: 'Psikologi Terapan',
      volume: '2',
      deweyNumber: '155.4',
      callNumber: '155.4 SAR p',
      subjects: ['Psikologi', 'Perkembangan', 'Anak', 'Remaja'],
      contentType: 'Teks',
      mediaType: 'Tanpa Mediasi',
      carrierType: 'Volume',
      pages: '356',
      dimensions: '23 x 15 cm',
      condition: 'Baik',
      physicalDescription: 'Buku dengan diagram perkembangan dan studi kasus',
      notes: 'Dilengkapi dengan instrumen tes psikologi',
      location: 'Rak H-2, Lantai 2',
      copyNumber: '2',
      barcode: '2024010001',
      price: '145000',
      source: 'Pembelian',
      acquisitionDate: '2024-03-15',
      status: 'available',
      createdAt: '2024-03-15T15:45:00Z',
      updatedAt: '2024-03-15T15:45:00Z'
    }
  ]);

  const [formData, setFormData] = useState<Partial<BookData>>({
    title: '',
    subtitle: '',
    author: '',
    coAuthor: '',
    editor: '',
    translator: '',
    abstract: '',
    publisher: '',
    publicationPlace: '',
    publicationYear: '',
    edition: '',
    isbn: '',
    issn: '',
    language: 'Indonesia',
    series: '',
    volume: '',
    deweyNumber: '',
    callNumber: '',
    subjects: [],
    contentType: 'Teks',
    mediaType: 'Tanpa Mediasi',
    carrierType: 'Volume',
    pages: '',
    dimensions: '',
    condition: 'Baik',
    physicalDescription: '',
    notes: '',
    location: '',
    copyNumber: '1',
    barcode: '',
    price: '',
    source: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
    status: 'available'
  });

  const [newSubject, setNewSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const tabs = [
    { id: 'descriptive', label: 'Katalogisasi Deskriptif', icon: <FileText className="w-4 h-4" /> },
    { id: 'subject', label: 'Katalogisasi Subjek', icon: <Tag className="w-4 h-4" /> },
    { id: 'copy', label: 'Copy Cataloging', icon: <Copy className="w-4 h-4" /> },
    { id: 'original', label: 'Original Cataloging', icon: <Edit3 className="w-4 h-4" /> },
    { id: 'maintenance', label: 'Pemeliharaan Katalog', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'batch', label: 'Pemrosesan Batch', icon: <Database className="w-4 h-4" /> },
    { id: 'booklist', label: 'Daftar Buku', icon: <List className="w-4 h-4" /> }
  ];

  const handleInputChange = (field: keyof BookData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects?.includes(newSubject.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...(prev.subjects || []), newSubject.trim()]
      }));
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects?.filter(s => s !== subject) || []
    }));
  };

  const generateCallNumber = () => {
    if (formData.deweyNumber && formData.author) {
      const authorCode = formData.author.split(' ').pop()?.substring(0, 3).toLowerCase() || 'xxx';
      const titleCode = formData.title?.substring(0, 1).toLowerCase() || 'x';
      const callNumber = `${formData.deweyNumber} ${authorCode} ${titleCode}`;
      handleInputChange('callNumber', callNumber);
    }
  };

  const generateBarcode = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    handleInputChange('barcode', `${timestamp}${random}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (editingBook) {
        // Update existing book
        setBooks(prev => prev.map(book => 
          book.id === editingBook.id 
            ? { ...formData, id: editingBook.id, updatedAt: new Date().toISOString() } as BookData
            : book
        ));
      } else {
        // Add new book
        const newBook: BookData = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as BookData;
        setBooks(prev => [newBook, ...prev]);
      }
      
      setIsSubmitting(false);
      setSubmitStatus('success');
      setEditingBook(null);
      resetForm();
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      author: '',
      coAuthor: '',
      editor: '',
      translator: '',
      abstract: '',
      publisher: '',
      publicationPlace: '',
      publicationYear: '',
      edition: '',
      isbn: '',
      issn: '',
      language: 'Indonesia',
      series: '',
      volume: '',
      deweyNumber: '',
      callNumber: '',
      subjects: [],
      contentType: 'Teks',
      mediaType: 'Tanpa Mediasi',
      carrierType: 'Volume',
      pages: '',
      dimensions: '',
      condition: 'Baik',
      physicalDescription: '',
      notes: '',
      location: '',
      copyNumber: '1',
      barcode: '',
      price: '',
      source: '',
      acquisitionDate: new Date().toISOString().split('T')[0],
      status: 'available'
    });
    setNewSubject('');
    setEditingBook(null);
  };

  const editBook = (book: BookData) => {
    setFormData(book);
    setEditingBook(book);
    setActiveTab('descriptive');
    setViewMode('form');
  };

  const deleteBook = (bookId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      setBooks(prev => prev.filter(book => book.id !== bookId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'borrowed': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Tersedia';
      case 'borrowed': return 'Dipinjam';
      case 'maintenance': return 'Perawatan';
      case 'lost': return 'Hilang';
      default: return 'Unknown';
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.callNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || book.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sistem Katalogisasi Komprehensif</h2>
              <p className="text-sm text-gray-600">Manajemen koleksi perpustakaan digital</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {activeTab === 'booklist' && (
              <button
                onClick={() => setViewMode(viewMode === 'form' ? 'list' : 'form')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {viewMode === 'form' ? <List className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{viewMode === 'form' ? 'Lihat Daftar' : 'Tambah Buku'}</span>
              </button>
            )}
            
            {submitStatus === 'success' && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Berhasil disimpan!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'booklist') {
                  setViewMode('list');
                } else {
                  setViewMode('form');
                }
              }}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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

      {/* Content */}
      <div className="p-6">
        {/* Book List View */}
        {activeTab === 'booklist' && viewMode === 'list' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan judul, pengarang, atau nomor panggil..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="available">Tersedia</option>
                  <option value="borrowed">Dipinjam</option>
                  <option value="maintenance">Perawatan</option>
                  <option value="lost">Hilang</option>
                </select>
              </div>
            </div>

            {/* Books Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">No</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">Judul & Pengarang</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">Publikasi</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">Klasifikasi</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">Lokasi</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book, index) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 text-sm">{index + 1}</td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{book.title}</p>
                          {book.subtitle && <p className="text-sm text-gray-600">{book.subtitle}</p>}
                          <p className="text-sm text-gray-600">oleh {book.author}</p>
                          {book.coAuthor && <p className="text-xs text-gray-500">Co-author: {book.coAuthor}</p>}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">
                        <div>
                          <p>{book.publisher}</p>
                          <p className="text-gray-600">{book.publicationPlace}, {book.publicationYear}</p>
                          {book.isbn && <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">
                        <div>
                          <p className="font-mono text-blue-600">{book.callNumber}</p>
                          <p className="text-gray-600">Dewey: {book.deweyNumber}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {book.subjects.slice(0, 2).map((subject, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {subject}
                              </span>
                            ))}
                            {book.subjects.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{book.subjects.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">
                        <div>
                          <p>{book.location}</p>
                          <p className="text-gray-600">Copy: {book.copyNumber}</p>
                          <p className="text-xs text-gray-500 font-mono">{book.barcode}</p>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                          {getStatusLabel(book.status)}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => editBook(book)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteBook(book.id!)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredBooks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Book className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Tidak ada buku yang ditemukan</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form View */}
        {(viewMode === 'form' || activeTab !== 'booklist') && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Katalogisasi Deskriptif */}
            {activeTab === 'descriptive' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informasi Dasar</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul Utama *</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan judul buku"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Judul</label>
                    <input
                      type="text"
                      value={formData.subtitle || ''}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Sub judul (opsional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pengarang Utama *</label>
                    <input
                      type="text"
                      value={formData.author || ''}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nama pengarang"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pengarang Tambahan</label>
                    <input
                      type="text"
                      value={formData.coAuthor || ''}
                      onChange={(e) => handleInputChange('coAuthor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Co-author (opsional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Editor</label>
                    <input
                      type="text"
                      value={formData.editor || ''}
                      onChange={(e) => handleInputChange('editor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nama editor"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Penerjemah</label>
                    <input
                      type="text"
                      value={formData.translator || ''}
                      onChange={(e) => handleInputChange('translator', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nama penerjemah"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Penerbit *</label>
                    <input
                      type="text"
                      value={formData.publisher || ''}
                      onChange={(e) => handleInputChange('publisher', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nama penerbit"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tempat Terbit</label>
                    <input
                      type="text"
                      value={formData.publicationPlace || ''}
                      onChange={(e) => handleInputChange('publicationPlace', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Kota terbit"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Terbit *</label>
                    <input
                      type="number"
                      value={formData.publicationYear || ''}
                      onChange={(e) => handleInputChange('publicationYear', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2024"
                      min="1900"
                      max="2030"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Edisi</label>
                    <input
                      type="text"
                      value={formData.edition || ''}
                      onChange={(e) => handleInputChange('edition', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Edisi ke-"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
                    <select
                      value={formData.language || 'Indonesia'}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Indonesia">Indonesia</option>
                      <option value="Inggris">Inggris</option>
                      <option value="Arab">Arab</option>
                      <option value="Jawa">Jawa</option>
                      <option value="Sunda">Sunda</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                    <input
                      type="text"
                      value={formData.isbn || ''}
                      onChange={(e) => handleInputChange('isbn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="978-xxx-xxx-xxx-x"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ISSN</label>
                    <input
                      type="text"
                      value={formData.issn || ''}
                      onChange={(e) => handleInputChange('issn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="xxxx-xxxx"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seri</label>
                    <input
                      type="text"
                      value={formData.series || ''}
                      onChange={(e) => handleInputChange('series', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nama seri"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
                    <input
                      type="text"
                      value={formData.volume || ''}
                      onChange={(e) => handleInputChange('volume', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Volume ke-"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Abstrak/Ringkasan</label>
                  <textarea
                    value={formData.abstract || ''}
                    onChange={(e) => handleInputChange('abstract', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ringkasan isi buku"
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mt-8">Klasifikasi</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Dewey</label>
                    <input
                      type="text"
                      value={formData.deweyNumber || ''}
                      onChange={(e) => handleInputChange('deweyNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="000.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Panggil</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.callNumber || ''}
                        onChange={(e) => handleInputChange('callNumber', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="000.00 ABC a"
                      />
                      <button
                        type="button"
                        onClick={generateCallNumber}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Generate otomatis"
                      >
                        <Hash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjek/Topik</label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tambah subjek baru"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                      />
                      <button
                        type="button"
                        onClick={addSubject}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah</span>
                      </button>
                    </div>
                    
                    {formData.subjects && formData.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {subject}
                            <button
                              type="button"
                              onClick={() => removeSubject(subject)}
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

                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mt-8">Deskripsi Fisik</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Halaman</label>
                    <input
                      type="number"
                      value={formData.pages || ''}
                      onChange={(e) => handleInputChange('pages', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dimensi (cm)</label>
                    <input
                      type="text"
                      value={formData.dimensions || ''}
                      onChange={(e) => handleInputChange('dimensions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="21 x 14 cm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kondisi</label>
                    <select
                      value={formData.condition || 'Baik'}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Sangat Baik">Sangat Baik</option>
                      <option value="Baik">Baik</option>
                      <option value="Cukup">Cukup</option>
                      <option value="Rusak Ringan">Rusak Ringan</option>
                      <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Fisik Lengkap</label>
                  <textarea
                    value={formData.physicalDescription || ''}
                    onChange={(e) => handleInputChange('physicalDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Deskripsi detail kondisi fisik buku, ilustrasi, dll."
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mt-8">Pengadaan & Lokasi</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Rak</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Rak A-1, Lantai 1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Eksemplar</label>
                    <input
                      type="number"
                      value={formData.copyNumber || '1'}
                      onChange={(e) => handleInputChange('copyNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Barcode</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.barcode || ''}
                        onChange={(e) => handleInputChange('barcode', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Scan atau input manual"
                      />
                      <button
                        type="button"
                        onClick={generateBarcode}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        title="Generate barcode"
                      >
                        <Hash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp)</label>
                    <input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sumber Perolehan</label>
                    <input
                      type="text"
                      value={formData.source || ''}
                      onChange={(e) => handleInputChange('source', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Pembelian, Hibah, Tukar Menukar, dll."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pengadaan</label>
                    <input
                      type="date"
                      value={formData.acquisitionDate || ''}
                      onChange={(e) => handleInputChange('acquisitionDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Tambahan</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Catatan khusus tentang buku ini"
                  />
                </div>
              </div>
            )}

            {/* Other tabs content */}
            {activeTab !== 'descriptive' && activeTab !== 'booklist' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fitur Dalam Pengembangan</h3>
                <p className="text-gray-600">
                  Menu "{tabs.find(tab => tab.id === activeTab)?.label}" sedang dalam tahap pengembangan.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {activeTab === 'descriptive' && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Reset Form</span>
                </button>
                
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Simpan Draft
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.title || !formData.author || !formData.publisher || !formData.publicationYear}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{editingBook ? 'Update Buku' : 'Simpan Buku'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default ComprehensiveCatalogingForm;