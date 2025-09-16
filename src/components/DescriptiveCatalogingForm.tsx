import React, { useState, useEffect } from 'react';
import { 
  Book,
  Save,
  X,
  Plus,
  Upload, 
  Camera,
  FileText,
  Hash,
  Tag
} from 'lucide-react';

import { BookData } from '../types/book';
import { DDC_CATEGORIES } from '../constants/ddcCategories';
import { databaseService } from '../services/database';
import { User as UserType, CatalogBook } from '../types/database';
import { useNotification } from '../contexts/NotificationContext';
import CameraUploadModal from './CameraUploadModal';

interface DescriptiveCatalogingFormProps {
  user: UserType;
  onBookAdded?: () => void;
  editingBook?: any;
}

interface FormBookData extends Omit<BookData, 'id' | 'status' | 'cover' | 'digitalFiles'> {
  coverImage: File | null;
  digitalFiles: File[];
  cover?: string; // Existing cover URL
  existingDigitalFiles?: string[]; // Existing digital file URLs
  subcategory?: string;
  description?: string;
}

function DescriptiveCatalogingForm({ user, onBookAdded, editingBook }: DescriptiveCatalogingFormProps) {
  const { showNotification } = useNotification();
  
  // Check if we're in edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  
  const [bookData, setBookData] = useState<FormBookData>({
    title: '',
    subtitle: '',
    author: '',
    coAuthor: '',
    editor: '',
    translator: '',
    illustrator: '',
    category: '',
    publisher: '',
    publicationPlace: '',
    publicationYear: '',
    edition: '',
    isbn: '',
    issn: '',
    callNumber: '',
    deweyNumber: '',
    pages: '',
    dimensions: '',
    language: 'Indonesia',
    series: '',
    volume: '',
    notes: '',
    subjects: [],
    physicalDescription: '',
    contentType: 'Teks',
    mediaType: 'Tanpa Mediasi',
    carrierType: 'Volume',
    location: '',
    copyNumber: 1,
    barcode: '',
    price: '',
    source: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
    condition: 'Baik',
    abstract: '',
    coverImage: null,
    digitalFiles: [],
    cover: '',
    existingDigitalFiles: [],
    subcategory: '',
    description: ''
  });

  const [newSubject, setNewSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Check for editing book data from props
  useEffect(() => {
    if (editingBook) {
      setIsEditMode(true);
      setEditingBookId(editingBook.id);
      
      // Populate form with existing data
      setBookData({
        title: editingBook.title || '',
        subtitle: editingBook.subtitle || '',
        author: editingBook.author || '',
        coAuthor: editingBook.coAuthor || '',
        editor: editingBook.editor || '',
        translator: editingBook.translator || '',
        illustrator: editingBook.illustrator || '',
        category: editingBook.category || '',
        publisher: editingBook.publisher || '',
        publicationPlace: editingBook.publicationPlace || '',
        publicationYear: editingBook.publication_year?.toString() || '',
        edition: editingBook.edition || '',
        isbn: editingBook.isbn || '',
        issn: editingBook.issn || '',
        callNumber: editingBook.callNumber || '',
        deweyNumber: editingBook.deweyNumber || '',
        pages: editingBook.pages?.toString() || '',
        dimensions: editingBook.dimensions || '',
        language: editingBook.language || 'Indonesia',
        series: editingBook.series || '',
        volume: editingBook.volume || '',
        notes: editingBook.notes || '',
        subjects: editingBook.subjects || [],
        physicalDescription: editingBook.physicalDescription || '',
        contentType: editingBook.contentType || 'Teks',
        mediaType: editingBook.mediaType || 'Tanpa Mediasi',
        carrierType: editingBook.carrierType || 'Volume',
        location: editingBook.location || '',
        copyNumber: editingBook.copyNumber || 1,
        barcode: editingBook.barcode || '',
        price: editingBook.price?.toString() || '',
        source: editingBook.source || '',
        acquisitionDate: editingBook.acquisition_date || new Date().toISOString().split('T')[0],
        condition: editingBook.condition || 'Baik',
        abstract: editingBook.abstract || '',
        coverImage: null,
        digitalFiles: [],
        cover: editingBook.cover_image_url || editingBook.cover || '',
        existingDigitalFiles: editingBook.digital_files || [],
        subcategory: editingBook.subcategory || '',
        description: editingBook.description || ''
      });
    } else {
      setIsEditMode(false);
      setEditingBookId(null);
    }
  }, [editingBook]);

  const handleInputChange = (field: keyof FormBookData, value: string | number) => {
    setBookData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSubject = () => {
    if (newSubject.trim() && !bookData.subjects.includes(newSubject.trim())) {
      setBookData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setBookData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const generateCallNumber = () => {
    // Simple call number generation based on Dewey and author
    if (bookData.deweyNumber && bookData.author) {
      const authorCode = bookData.author.split(' ').pop()?.substring(0, 3).toLowerCase() || 'xxx';
      const titleCode = bookData.title.substring(0, 1).toLowerCase();
      const callNumber = `${bookData.deweyNumber} ${authorCode} ${titleCode}`;
      handleInputChange('callNumber', callNumber);
    }
  };

  const generateBarcode = () => {
    // Generate simple barcode
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    handleInputChange('barcode', `${timestamp}${random}`);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setBookData(prev => ({
        ...prev,
        coverImage: file
      }));
    }
  };

  const handleDigitalFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setBookData(prev => ({
      ...prev,
      digitalFiles: [...prev.digitalFiles, ...files]
    }));
  };

  const removeDigitalFile = (index: number) => {
    setBookData(prev => ({
      ...prev,
      digitalFiles: prev.digitalFiles.filter((_, i) => i !== index)
    }));
  };

  const removeExistingDigitalFile = (index: number) => {
    setBookData(prev => ({
      ...prev,
      existingDigitalFiles: prev.existingDigitalFiles?.filter((_, i) => i !== index) || []
    }));
  };

  const removeCoverImage = () => {
    setBookData(prev => ({
      ...prev,
      coverImage: null
    }));
  };

  const handleCameraCapture = (file: File) => {
    setBookData(prev => ({
      ...prev,
      coverImage: file
    }));
    setShowCameraModal(false);
    showNotification({
      type: 'success',
      title: 'Berhasil',
      message: 'Foto berhasil diambil dan diproses!'
    });
  };

  const removeExistingCover = () => {
    setBookData(prev => ({
      ...prev,
      cover: ''
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setBookData(prev => ({
      ...prev,
      digitalFiles: [...prev.digitalFiles, ...files]
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'xls':
      case 'xlsx': return <FileText className="w-5 h-5 text-green-500" />;
      case 'ppt':
      case 'pptx': return <FileText className="w-5 h-5 text-orange-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <Camera className="w-5 h-5 text-purple-500" />;
      case 'mp4':
      case 'avi':
      case 'mov': return <FileText className="w-5 h-5 text-pink-500" />;
      case 'mp3':
      case 'wav': return <FileText className="w-5 h-5 text-yellow-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Check if barcode already exists (only for new books)
      if (!isEditMode && bookData.barcode) {
        const existingBook = await databaseService.getCatalogBookByBarcode(bookData.barcode);
        if (existingBook) {
          showNotification('Barcode sudah digunakan oleh buku lain. Silakan gunakan barcode yang berbeda.', 'error');
          setIsSubmitting(false);
          return;
        }
      }
      // Prepare data for database - all form fields must be in database
      const catalogData: Partial<CatalogBook> = {
        title: bookData.title,
        subtitle: bookData.subtitle || '',
        author: bookData.author || 'Tidak Diketahui',
        coAuthor: bookData.coAuthor || '',
        editor: bookData.editor || '',
        translator: bookData.translator || '',
        illustrator: bookData.illustrator || '',
        category: bookData.category || '',
        subcategory: bookData.subcategory || '',
        publisher: bookData.publisher || '',
        publicationPlace: bookData.publicationPlace || '',
        publication_year: bookData.publicationYear ? parseInt(bookData.publicationYear) : null,
        edition: bookData.edition && bookData.edition.trim() !== '' ? bookData.edition.trim() : null,
        isbn: bookData.isbn && bookData.isbn.trim() !== '' ? bookData.isbn.trim() : null,
        issn: bookData.issn && bookData.issn.trim() !== '' ? bookData.issn.trim() : null,
        series: bookData.series || '',
        volume: bookData.volume || '',
        language: bookData.language || 'Indonesia',
        pages: bookData.pages ? parseInt(bookData.pages) : null,
        dimensions: bookData.dimensions || '',
        abstract: bookData.abstract || '',
        description: bookData.description || '',
        subjects: bookData.subjects || [],
        status: isEditMode ? editingBook?.status || 'available' : 'available' as const,
        location: bookData.location || '',
        copyNumber: bookData.copyNumber || 1,
        barcode: bookData.barcode,
        price: bookData.price ? parseFloat(bookData.price) : null,
        source: bookData.source || '',
        acquisition_date: bookData.acquisitionDate || null,
        acquisition_method: 'Kataloging Manual',
        condition: bookData.condition || '',
        physicalDescription: bookData.physicalDescription || '',
        deweyNumber: bookData.deweyNumber || '',
        callNumber: bookData.callNumber || '',
        contentType: bookData.contentType || '',
        mediaType: bookData.mediaType || '',
        carrierType: bookData.carrierType || '',
        notes: bookData.notes || ''
      };

      // Remove undefined values to prevent database errors
      Object.keys(catalogData).forEach(key => {
        if (catalogData[key as keyof CatalogBook] === undefined) {
          delete catalogData[key as keyof CatalogBook];
        }
      });


      // Only add created_by for new books, not for updates
      if (!isEditMode) {
        catalogData.created_by = user.id;
      }

      let result;
      
      if (isEditMode && editingBookId) {
        // Update existing book
        result = await databaseService.updateCatalogBook(editingBookId, catalogData);
      } else {
        // Create new book
        result = await databaseService.createCatalogBook(catalogData);
      }
      
      if (result) {
        let coverUrl = '';
        const digitalFileUrls: string[] = [];

        // Handle cover image
        if (bookData.coverImage) {
          // Upload new cover image
          try {
            coverUrl = await databaseService.uploadBookCover(result.id, bookData.coverImage);
            console.log('Cover uploaded:', coverUrl);
          } catch (error) {
            console.error('Error uploading cover:', error);
            showNotification({
              type: 'warning',
              title: 'Peringatan',
              message: 'Buku berhasil disimpan, tetapi cover gagal diupload.'
            });
          }
        } else if (isEditMode && bookData.cover) {
          // Keep existing cover URL in edit mode
          coverUrl = bookData.cover;
          console.log('Keeping existing cover:', coverUrl);
        } else if (isEditMode && !bookData.cover && !bookData.coverImage) {
          // Cover was removed in edit mode
          coverUrl = null;
          console.log('Cover removed');
        }

        // Handle digital files
        if (bookData.digitalFiles.length > 0) {
          // Upload new digital files
          for (const file of bookData.digitalFiles) {
            try {
              const fileUrl = await databaseService.uploadBookDigitalFile(result.id, file);
              digitalFileUrls.push(fileUrl);
              console.log('Digital file uploaded:', fileUrl);
            } catch (error) {
              console.error('Error uploading digital file:', error);
            }
          }
        }
        
        // Handle existing digital files
        if (isEditMode && bookData.existingDigitalFiles && bookData.existingDigitalFiles.length > 0) {
          // Keep existing digital files URLs in edit mode
          digitalFileUrls.push(...bookData.existingDigitalFiles);
          console.log('Keeping existing digital files:', digitalFileUrls);
        }

        // Update book with cover and digital files URLs
        const updateData: any = {};
        
        // Handle cover update
        if (coverUrl !== undefined) {
          updateData.cover_image_url = coverUrl;
        }
        
        // Handle digital files update
        if (digitalFileUrls.length > 0) {
          updateData.digital_files = digitalFileUrls;
        } else if (isEditMode && bookData.existingDigitalFiles && bookData.existingDigitalFiles.length === 0) {
          // All digital files were removed
          updateData.digital_files = [];
        }
        
        // Always update if we have any file data or if we're in edit mode
        if (Object.keys(updateData).length > 0 || isEditMode) {
          const bookId = isEditMode && editingBookId ? editingBookId : result.id;
          await databaseService.updateCatalogBook(bookId, updateData);
          console.log('Updated book with file data:', updateData);
        }

        // Create book label automatically (only for new books)
        if (!isEditMode) {
          await databaseService.createBookLabel(result.id, {
            label_template: 'standard',
            label_size: 'medium',
            barcode_size: 'medium',
            created_by: user.id
          });
        }

        // Show success notification
        if (isEditMode) {
          showNotification({
            type: 'success',
            title: 'Berhasil!',
            message: 'Buku berhasil diperbarui!'
          });
          // Navigate back to book list
          window.location.href = '#book-list';
          window.location.reload();
        } else {
          showNotification({
            type: 'success',
            title: 'Berhasil!',
            message: 'Buku berhasil ditambahkan dengan file terlampir!'
          });
        }
        
        // Trigger refresh of books in other components
        if (onBookAdded) {
          onBookAdded();
        }
        
        // Reset form immediately
        resetForm();
        
        // Scroll to top of the form
        const formContainer = document.getElementById('cataloging-form');
        if (formContainer) {
          formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback to top of page
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error saving book:', error);
      setIsSubmitting(false);
      showNotification({
        type: 'error',
        title: 'Gagal!',
        message: 'Gagal menyimpan data buku. Silakan coba lagi.'
      });
    }
  };

  const resetForm = () => {
    setBookData({
      title: '',
      subtitle: '',
      author: '',
      coAuthor: '',
      editor: '',
      translator: '',
      illustrator: '',
      category: '',
      publisher: '',
      publicationPlace: '',
      publicationYear: '',
      edition: '',
      isbn: '',
      issn: '',
      callNumber: '',
      deweyNumber: '',
      pages: '',
      dimensions: '',
      language: 'Indonesia',
      series: '',
      volume: '',
      notes: '',
      subjects: [],
      physicalDescription: '',
      contentType: 'Teks',
      mediaType: 'Tanpa Mediasi',
      carrierType: 'Volume',
      location: '',
      copyNumber: 1,
      barcode: '',
      price: '',
      source: '',
      acquisitionDate: new Date().toISOString().split('T')[0],
      condition: 'Baik',
      abstract: '',
      coverImage: null,
      digitalFiles: [],
      subcategory: '',
      description: ''
    });
    setNewSubject('');
  };

  
  return (
    <div id="cataloging-form" className="bg-white rounded-xl shadow-lg">

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Buku' : 'Kataloging Buku'}
        </h2>
      </div>


      <form onSubmit={handleSubmit} className="p-6">
        {/* Informasi Dasar */}
        <div className="space-y-6 mb-8">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Book className="w-5 h-5 mr-2 text-blue-600" />
              Informasi Dasar
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Utama *
                </label>
                <input
                  type="text"
                  value={bookData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan judul buku"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Judul
                </label>
                <input
                  type="text"
                  value={bookData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan sub judul (opsional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pengarang Utama
                </label>
                <input
                  type="text"
                  value={bookData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama pengarang"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pengarang Tambahan
                </label>
                <input
                  type="text"
                  value={bookData.coAuthor}
                  onChange={(e) => handleInputChange('coAuthor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Co-author (opsional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Editor
                </label>
                <input
                  type="text"
                  value={bookData.editor}
                  onChange={(e) => handleInputChange('editor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama editor"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penerjemah
                </label>
                <input
                  type="text"
                  value={bookData.translator}
                  onChange={(e) => handleInputChange('translator', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama penerjemah"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ilustrator
                </label>
                <input
                  type="text"
                  value={bookData.illustrator}
                  onChange={(e) => handleInputChange('illustrator', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama ilustrator"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={bookData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Kategori</option>
                  {DDC_CATEGORIES.filter(cat => cat.value !== 'all').map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abstrak/Ringkasan
              </label>
              <textarea
                value={bookData.abstract}
                onChange={(e) => handleInputChange('abstract', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ringkasan isi buku"
              />
            </div>
          </div>
        </div>

        {/* Publikasi */}
        <div className="space-y-6 mb-8">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Publikasi
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penerbit
                </label>
                <input
                  type="text"
                  value={bookData.publisher}
                  onChange={(e) => handleInputChange('publisher', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama penerbit"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempat Terbit
                </label>
                <input
                  type="text"
                  value={bookData.publicationPlace}
                  onChange={(e) => handleInputChange('publicationPlace', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kota terbit"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun Terbit
                </label>
                <input
                  type="number"
                  value={bookData.publicationYear}
                  onChange={(e) => handleInputChange('publicationYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2024"
                  min="1900"
                  max="2030"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edisi
                </label>
                <input
                  type="text"
                  value={bookData.edition}
                  onChange={(e) => handleInputChange('edition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Edisi ke-"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bahasa
                </label>
                <select
                  value={bookData.language}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  value={bookData.isbn}
                  onChange={(e) => handleInputChange('isbn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="978-xxx-xxx-xxx-x"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ISSN
                </label>
                <input
                  type="text"
                  value={bookData.issn}
                  onChange={(e) => handleInputChange('issn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="xxxx-xxxx"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seri
                </label>
                <input
                  type="text"
                  value={bookData.series}
                  onChange={(e) => handleInputChange('series', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama seri"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume
                </label>
                <input
                  type="text"
                  value={bookData.volume}
                  onChange={(e) => handleInputChange('volume', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Volume ke-"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Klasifikasi */}
        <div className="space-y-6 mb-8">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-blue-600" />
              Klasifikasi
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Dewey
                </label>
                <input
                  type="text"
                  value={bookData.deweyNumber}
                  onChange={(e) => handleInputChange('deweyNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Panggil
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={bookData.callNumber}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjek/Topik
              </label>
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
                
                {bookData.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {bookData.subjects.map((subject, index) => (
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Konten
                </label>
                <select
                  value={bookData.contentType}
                  onChange={(e) => handleInputChange('contentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Teks">Teks</option>
                  <option value="Gambar">Gambar</option>
                  <option value="Audio">Audio</option>
                  <option value="Video">Video</option>
                  <option value="Multimedia">Multimedia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Media
                </label>
                <select
                  value={bookData.mediaType}
                  onChange={(e) => handleInputChange('mediaType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Tanpa Mediasi">Tanpa Mediasi</option>
                  <option value="Audio">Audio</option>
                  <option value="Komputer">Komputer</option>
                  <option value="Mikroform">Mikroform</option>
                  <option value="Proyeksi">Proyeksi</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Pembawa
                </label>
                <select
                  value={bookData.carrierType}
                  onChange={(e) => handleInputChange('carrierType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Volume">Volume</option>
                  <option value="CD">CD</option>
                  <option value="DVD">DVD</option>
                  <option value="Online">Online</option>
                  <option value="Mikrofilm">Mikrofilm</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Deskripsi Fisik */}
        <div className="space-y-6 mb-8">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-blue-600" />
              Deskripsi Fisik
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Halaman
                </label>
                <input
                  type="number"
                  value={bookData.pages}
                  onChange={(e) => handleInputChange('pages', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensi (cm)
                </label>
                <input
                  type="text"
                  value={bookData.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="21 x 14 cm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kondisi
                </label>
                <select
                  value={bookData.condition}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Fisik Lengkap
              </label>
              <textarea
                value={bookData.physicalDescription}
                onChange={(e) => handleInputChange('physicalDescription', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Deskripsi detail kondisi fisik buku, ilustrasi, dll."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Tambahan
              </label>
              <textarea
                value={bookData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Catatan khusus tentang buku ini"
              />
            </div>
          </div>
        </div>

        {/* Upload Files */}
        <div className="space-y-6 mb-8">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-600" />
              Upload File
            </h3>
          </div>
          
          <div className="space-y-6">
            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Buku
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                      id="cover-upload"
                    />
                    <div className="space-y-4">
                      <label htmlFor="cover-upload" className="cursor-pointer block">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Klik untuk upload cover buku</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
                      </label>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowCameraModal(true)}
                          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                        >
                          <Camera className="w-5 h-5" />
                          <span>Ambil Foto dengan Kamera</span>
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Foto akan otomatis di-crop dan dikompres HD</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* New Cover Image */}
                {bookData.coverImage && (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(bookData.coverImage)}
                      alt="Cover Preview"
                      className="w-full h-48 object-contain bg-gray-50 rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-medium">{bookData.coverImage.name}</p>
                      <p className="text-xs">{formatFileSize(bookData.coverImage.size)}</p>
                    </div>
                  </div>
                )}

                {/* Existing Cover Image */}
                {!bookData.coverImage && bookData.cover && (
                  <div className="relative">
                    <img
                      src={bookData.cover}
                      alt="Existing Cover"
                      className="w-full h-48 object-contain bg-gray-50 rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeExistingCover}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Hapus cover"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-medium text-green-600">Cover yang sudah ada</p>
                      <p className="text-xs">Klik upload di atas untuk mengganti cover</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Digital Files Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Digital
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleDigitalFilesUpload}
                  className="hidden"
                  id="digital-files-upload"
                />
                <label htmlFor="digital-files-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Klik untuk upload atau drag & drop file digital
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, XLS, PPT, gambar, video, audio, dll.
                  </p>
                </label>
              </div>

              {/* New Digital Files List */}
              {bookData.digitalFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    File Digital Baru ({bookData.digitalFiles.length})
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {bookData.digitalFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.name)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDigitalFile(index)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Digital Files List */}
              {bookData.existingDigitalFiles && bookData.existingDigitalFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    File Digital yang Sudah Ada ({bookData.existingDigitalFiles.length})
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {bookData.existingDigitalFiles.map((fileUrl, index) => {
                      const fileName = fileUrl.split('/').pop() || `File ${index + 1}`;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div className="flex items-center space-x-3">
                            {getFileIcon(fileName)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{fileName}</p>
                              <p className="text-xs text-green-600">File yang sudah ada</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                              title="Buka file"
                            >
                              <FileText className="w-4 h-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => removeExistingDigitalFile(index)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="Hapus file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pengadaan */}
        <div className="space-y-6 mb-8">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-600" />
              Pengadaan
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi Rak
                </label>
                <input
                  type="text"
                  value={bookData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rak A-1, Lantai 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Eksemplar
                </label>
                <input
                  type="number"
                  value={bookData.copyNumber}
                  onChange={(e) => handleInputChange('copyNumber', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={bookData.barcode}
                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Scan atau input manual"
                    required
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  value={bookData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sumber Perolehan
                </label>
                <input
                  type="text"
                  value={bookData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Pembelian, Hibah, Tukar Menukar, dll."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Pengadaan
                </label>
                <input
                  type="date"
                  value={bookData.acquisitionDate}
                  onChange={(e) => handleInputChange('acquisitionDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
              disabled={isSubmitting || !bookData.title || !bookData.barcode}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isEditMode ? 'Memperbarui...' : 'Menyimpan...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditMode ? 'Perbarui Buku' : 'Simpan Buku'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Camera Upload Modal */}
      <CameraUploadModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onImageCapture={handleCameraCapture}
      />
    </div>
  );
}

export default DescriptiveCatalogingForm;