import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Loader2
} from 'lucide-react';
import { CatalogBook } from '../types/database';
import { databaseService } from '../services/database';
import { useNotification } from '../contexts/NotificationContext';

interface BookListTableProps {
  user: any;
  onBookUpdated?: () => void;
  onEditBook?: (book: CatalogBook) => void;
}

function BookListTable({ user, onBookUpdated, onEditBook }: BookListTableProps) {
  const { showNotification } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'available', label: 'Tersedia' },
    { value: 'borrowed', label: 'Dipinjam' },
    { value: 'reserved', label: 'Direservasi' },
    { value: 'damaged', label: 'Rusak' },
    { value: 'lost', label: 'Hilang' }
  ];

  // Load books from database
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const catalogBooks = await databaseService.getCatalogBooks();
      setBooks(catalogBooks);
    } catch (error) {
      console.error('Error loading books:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Gagal memuat daftar buku'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (book.isbn && book.isbn.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle select all functionality
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(filteredBooks.map(book => book.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectBook = (bookId: string) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  const handleEdit = (book: CatalogBook) => {
    if (onEditBook) {
      onEditBook(book);
    }
  };


  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      try {
        const success = await databaseService.deleteCatalogBook(id);
        if (success) {
          await loadBooks();
          showNotification({
            type: 'success',
            title: 'Berhasil',
            message: 'Buku berhasil dihapus'
          });
          if (onBookUpdated) onBookUpdated();
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'Gagal menghapus buku'
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-700 bg-green-100';
      case 'borrowed': return 'text-blue-700 bg-blue-100';
      case 'reserved': return 'text-yellow-700 bg-yellow-100';
      case 'damaged': return 'text-orange-700 bg-orange-100';
      case 'lost': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Tersedia';
      case 'borrowed': return 'Dipinjam';
      case 'reserved': return 'Direservasi';
      case 'damaged': return 'Rusak';
      case 'lost': return 'Hilang';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul, pengarang, atau nomor panggil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredBooks.length} dari {books.length} buku
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buku</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengarang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publikasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klasifikasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book.id)}
                    onChange={() => handleSelectBook(book.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                      {book.cover_image_url || book.cover ? (
                        <img 
                          src={book.cover_image_url || book.cover} 
                          alt={book.title} 
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Book className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">{book.title}</div>
                      {book.isbn && <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>}
                      {book.pages && <div className="text-xs text-gray-500">{book.pages} hal</div>}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{book.author}</div>
                </td>
                
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm text-gray-900">{book.publisher}</div>
                    <div className="text-xs text-gray-500">{book.publication_year}</div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm text-gray-900">{book.category}</div>
                    {book.subcategory && <div className="text-xs text-gray-500">{book.subcategory}</div>}
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {book.location}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(book.status)}`}>
                    {getStatusLabel(book.status)}
                  </span>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-gray-600 hover:text-gray-800"
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
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Menampilkan {filteredBooks.length} dari {books.length} buku
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              Sebelumnya
            </button>
            <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</span>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default BookListTable;