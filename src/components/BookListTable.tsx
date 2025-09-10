import React, { useState } from 'react';
import { 
  Book, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  Eye,
  Download,
  Upload,
  RefreshCw,
  MapPin,
  Calendar,
  User,
  FileText,
  Tag,
  CheckCircle,
  AlertCircle,
  Clock,
  Archive
} from 'lucide-react';
import { BookData } from '../types/book';
import { getCategoryLabel } from '../constants/ddcCategories';

interface BookListTableProps {
  books: BookData[];
  setBooks: (books: BookData[]) => void;
}

function BookListTable({ books, setBooks }: BookListTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<BookData | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const statusOptions = ['Semua', 'Tersedia', 'Dipinjam', 'Perawatan', 'Hilang'];
  const conditionOptions = ['Sangat Baik', 'Baik', 'Cukup', 'Rusak Ringan', 'Rusak Berat'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.callNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'Semua' || book.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (book: BookData) => {
    setEditingId(book.id);
    setEditData({ ...book });
  };

  const handleSave = () => {
    if (editData) {
      setBooks(books.map(book => book.id === editData.id ? editData : book));
      setEditingId(null);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      setBooks(books.filter(book => book.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tersedia': return 'text-green-700 bg-green-100';
      case 'Dipinjam': return 'text-blue-700 bg-blue-100';
      case 'Perawatan': return 'text-orange-700 bg-orange-100';
      case 'Hilang': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Sangat Baik': return 'text-green-700 bg-green-100';
      case 'Baik': return 'text-blue-700 bg-blue-100';
      case 'Cukup': return 'text-yellow-700 bg-yellow-100';
      case 'Rusak Ringan': return 'text-orange-700 bg-orange-100';
      case 'Rusak Berat': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

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
                <option key={status} value={status}>{status}</option>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buku</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengarang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publikasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klasifikasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {editingId === book.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editData?.title || ''}
                        onChange={(e) => setEditData(prev => prev ? {...prev, title: e.target.value} : null)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={editData?.isbn || ''}
                        onChange={(e) => setEditData(prev => prev ? {...prev, isbn: e.target.value} : null)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="ISBN"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">{book.title}</div>
                      <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>
                      <div className="text-xs text-gray-500">{book.pages} hal</div>
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  {editingId === book.id ? (
                    <input
                      type="text"
                      value={editData?.author || ''}
                      onChange={(e) => setEditData(prev => prev ? {...prev, author: e.target.value} : null)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{book.author}</div>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  {editingId === book.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editData?.publisher || ''}
                        onChange={(e) => setEditData(prev => prev ? {...prev, publisher: e.target.value} : null)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="Penerbit"
                      />
                      <input
                        type="text"
                        value={editData?.year || ''}
                        onChange={(e) => setEditData(prev => prev ? {...prev, year: e.target.value} : null)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="Tahun"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm text-gray-900">{book.publisher}</div>
                      <div className="text-xs text-gray-500">{book.publicationYear}</div>
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  {editingId === book.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editData?.callNumber || ''}
                        onChange={(e) => setEditData(prev => prev ? {...prev, callNumber: e.target.value} : null)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="No. Panggil"
                      />
                      <input
                        type="text"
                        value={editData?.deweyNumber || ''}
                        onChange={(e) => setEditData(prev => prev ? {...prev, deweyNumber: e.target.value} : null)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="Dewey"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm font-mono text-blue-600">{book.callNumber}</div>
                      <div className="text-xs text-gray-500">Dewey: {book.deweyNumber}</div>
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  {editingId === book.id ? (
                    <input
                      type="text"
                      value={editData?.location || ''}
                      onChange={(e) => setEditData(prev => prev ? {...prev, location: e.target.value} : null)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <div>
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {book.location}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getCategoryLabel(book.category)}
                      </div>
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  {editingId === book.id ? (
                    <select
                      value={editData?.status || ''}
                      onChange={(e) => setEditData(prev => prev ? {...prev, status: e.target.value as any} : null)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Tersedia">Tersedia</option>
                      <option value="Dipinjam">Dipinjam</option>
                      <option value="Perawatan">Perawatan</option>
                      <option value="Hilang">Hilang</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(book.status)}`}>
                      {book.status}
                    </span>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  {editingId === book.id ? (
                    <select
                      value={editData?.condition || ''}
                      onChange={(e) => setEditData(prev => prev ? {...prev, condition: e.target.value} : null)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    >
                      {conditionOptions.map(condition => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(book.condition)}`}>
                      {book.condition}
                    </span>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  {editingId === book.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSave}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Simpan"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Batal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
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
                  )}
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