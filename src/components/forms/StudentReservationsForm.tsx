import React, { useState } from 'react';
import { 
  Bookmark, 
  Plus, 
  Search, 
  Calendar,
  Clock,
  User,
  Book,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  RefreshCw,
  Bell,
  MapPin
} from 'lucide-react';

interface Reservation {
  id: number;
  bookTitle: string;
  author: string;
  callNumber: string;
  reservationDate: string;
  expectedAvailableDate: string;
  status: 'waiting' | 'ready' | 'expired' | 'cancelled';
  queuePosition: number;
  totalQueue: number;
  notificationMethod: string[];
  cover: string;
  location: string;
}

function StudentReservationsForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [newReservation, setNewReservation] = useState({
    bookSearch: '',
    notificationEmail: true,
    notificationSMS: false,
    notificationWhatsApp: true,
    priority: 'normal',
    notes: ''
  });

  const reservations: Reservation[] = [
    {
      id: 1,
      bookTitle: "Ekonomi Makro - Teori dan Aplikasi",
      author: "Dr. Budi Santoso, S.E., M.M",
      callNumber: "339 SAN e",
      reservationDate: "2024-01-18",
      expectedAvailableDate: "2024-01-25",
      status: 'ready',
      queuePosition: 1,
      totalQueue: 1,
      notificationMethod: ['email', 'whatsapp'],
      cover: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300",
      location: "Rak E-2, Lantai 1"
    },
    {
      id: 2,
      bookTitle: "Psikologi Perkembangan - Anak dan Remaja",
      author: "Dr. Rita Eka Izzaty, M.Si",
      callNumber: "155.4 IZZ p",
      reservationDate: "2024-01-16",
      expectedAvailableDate: "2024-01-30",
      status: 'waiting',
      queuePosition: 2,
      totalQueue: 3,
      notificationMethod: ['email'],
      cover: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300",
      location: "Rak G-3, Lantai 2"
    }
  ];

  const filteredReservations = reservations.filter(reservation =>
    reservation.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Siap Diambil';
      case 'waiting': return 'Menunggu';
      case 'expired': return 'Kadaluarsa';
      case 'cancelled': return 'Dibatalkan';
      default: return 'Unknown';
    }
  };

  const handleNewReservation = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Reservasi baru telah dibuat!');
    setShowNewReservation(false);
    setNewReservation({
      bookSearch: '',
      notificationEmail: true,
      notificationSMS: false,
      notificationWhatsApp: true,
      priority: 'normal',
      notes: ''
    });
  };

  const handleCancelReservation = (id: number) => {
    if (confirm('Apakah Anda yakin ingin membatalkan reservasi ini?')) {
      alert(`Reservasi ID ${id} telah dibatalkan`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Reservasi Buku</h2>
              <p className="text-sm text-gray-600">Kelola reservasi buku yang sedang dipinjam orang lain</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowNewReservation(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Reservasi Baru
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari reservasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* New Reservation Modal */}
      {showNewReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Buat Reservasi Baru</h3>
                <button
                  onClick={() => setShowNewReservation(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleNewReservation} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari Buku untuk Direservasi *
                  </label>
                  <input
                    type="text"
                    value={newReservation.bookSearch}
                    onChange={(e) => setNewReservation(prev => ({...prev, bookSearch: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ketik judul buku, pengarang, atau nomor panggil"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioritas Reservasi
                  </label>
                  <select
                    value={newReservation.priority}
                    onChange={(e) => setNewReservation(prev => ({...prev, priority: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent - Tugas Sekolah</option>
                    <option value="research">Penelitian</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metode Notifikasi
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newReservation.notificationEmail}
                        onChange={(e) => setNewReservation(prev => ({...prev, notificationEmail: e.target.checked}))}
                        className="text-blue-600"
                      />
                      <span className="text-sm">Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newReservation.notificationSMS}
                        onChange={(e) => setNewReservation(prev => ({...prev, notificationSMS: e.target.checked}))}
                        className="text-blue-600"
                      />
                      <span className="text-sm">SMS</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newReservation.notificationWhatsApp}
                        onChange={(e) => setNewReservation(prev => ({...prev, notificationWhatsApp: e.target.checked}))}
                        className="text-blue-600"
                      />
                      <span className="text-sm">WhatsApp</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Reservasi
                  </label>
                  <textarea
                    value={newReservation.notes}
                    onChange={(e) => setNewReservation(prev => ({...prev, notes: e.target.value}))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Alasan reservasi atau catatan khusus"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Bookmark className="w-4 h-4 mr-2 inline" />
                  Buat Reservasi
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewReservation(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reservations List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img
                  src={reservation.cover}
                  alt={reservation.bookTitle}
                  className="w-16 h-20 object-cover rounded border border-gray-200"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{reservation.bookTitle}</h3>
                      <p className="text-sm text-gray-600">{reservation.author}</p>
                      <p className="text-xs text-gray-500 font-mono">{reservation.callNumber}</p>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Direservasi: {new Date(reservation.reservationDate).toLocaleDateString('id-ID')}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Estimasi tersedia: {new Date(reservation.expectedAvailableDate).toLocaleDateString('id-ID')}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>Antrian: {reservation.queuePosition} dari {reservation.totalQueue}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{reservation.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {reservation.status === 'ready' && (
                        <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm">
                          <CheckCircle className="w-4 h-4 mr-1 inline" />
                          Ambil Sekarang
                        </button>
                      )}
                      
                      <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                        <Eye className="w-4 h-4 mr-1 inline" />
                        Detail
                      </button>
                      
                      {reservation.status === 'waiting' && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors text-sm"
                        >
                          <X className="w-4 h-4 mr-1 inline" />
                          Batal
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {reservation.status === 'ready' && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center text-green-800">
                        <Bell className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
                          Buku sudah tersedia! Silakan ambil di meja sirkulasi dalam 3 hari.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Belum ada reservasi aktif</p>
            <p className="text-sm text-gray-500">Buat reservasi untuk buku yang sedang dipinjam</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reservasi</p>
                <p className="text-lg font-bold text-gray-900">{reservations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Siap Diambil</p>
                <p className="text-lg font-bold text-gray-900">
                  {reservations.filter(r => r.status === 'ready').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Menunggu</p>
                <p className="text-lg font-bold text-gray-900">
                  {reservations.filter(r => r.status === 'waiting').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Notifikasi Aktif</p>
                <p className="text-lg font-bold text-gray-900">
                  {reservations.filter(r => r.notificationMethod.length > 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentReservationsForm;