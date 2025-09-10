import React, { useState } from 'react';
import { 
  BookOpen, 
  Archive, 
  RefreshCw, 
  Bookmark, 
  Clock, 
  DollarSign,
  User,
  Search,
  Calendar,
  Scan,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Bell,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calculator,
  TrendingUp,
  Activity,
  Target,
  Award
} from 'lucide-react';

interface CirculationFormProps {
  user?: any;
}

function CirculationForm({ user }: CirculationFormProps) {
  const [activeTab, setActiveTab] = useState('check-out');
  const [transactionData, setTransactionData] = useState({
    memberBarcode: '',
    bookBarcode: '',
    dueDate: '',
    notes: '',
    fineAmount: '',
    paymentMethod: 'cash'
  });

  const tabs = [
    { id: 'check-out', label: 'Peminjaman', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'check-in', label: 'Pengembalian', icon: <Archive className="w-4 h-4" /> },
    { id: 'renewals', label: 'Perpanjangan', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'reservations', label: 'Reservasi', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'overdue-management', label: 'Manajemen Keterlambatan', icon: <Clock className="w-4 h-4" /> },
    { id: 'fines-fees', label: 'Denda & Biaya', icon: <DollarSign className="w-4 h-4" /> }
  ];

  const renderCheckOut = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          Form Peminjaman Buku
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member Information Section */}
          <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="text-md font-semibold text-blue-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Informasi Anggota
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari Anggota</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama, NIS, atau email anggota"
                  />
                  <button type="button" className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Keanggotaan</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Status akan muncul setelah pencarian"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Nama anggota akan muncul di sini"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kelas/Jabatan</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Kelas atau jabatan anggota"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buku Sedang Dipinjam</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="0"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batas Peminjaman</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="5"
                  readOnly
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Anggota *</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={transactionData.memberBarcode}
                onChange={(e) => setTransactionData(prev => ({...prev, memberBarcode: e.target.value}))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Scan atau ketik barcode anggota"
                required
              />
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Scan className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Buku *</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={transactionData.bookBarcode}
                onChange={(e) => setTransactionData(prev => ({...prev, bookBarcode: e.target.value}))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Scan atau ketik barcode buku"
                required
              />
              <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Scan className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Peminjaman *</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Jatuh Tempo *</label>
            <input
              type="date"
              value={transactionData.dueDate}
              onChange={(e) => setTransactionData(prev => ({...prev, dueDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Peminjaman</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Peminjaman Reguler (7 hari)</option>
              <option>Peminjaman Panjang (14 hari)</option>
              <option>Peminjaman Referensi (3 hari)</option>
              <option>Peminjaman Guru (30 hari)</option>
              <option>Peminjaman Khusus</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Petugas</label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Peminjaman</label>
            <textarea
              value={transactionData.notes}
              onChange={(e) => setTransactionData(prev => ({...prev, notes: e.target.value}))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan khusus untuk peminjaman ini"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <BookOpen className="w-4 h-4 mr-2 inline" />
            Proses Peminjaman
          </button>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Reset Form
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-semibold text-blue-900 mb-2">Peminjaman Hari Ini</h5>
          <p className="text-2xl font-bold text-blue-600">127</p>
          <p className="text-sm text-blue-700">+15% dari kemarin</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-semibold text-green-900 mb-2">Buku Tersedia</h5>
          <p className="text-2xl font-bold text-green-600">12,456</p>
          <p className="text-sm text-green-700">78% dari total koleksi</p>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h5 className="font-semibold text-orange-900 mb-2">Antrian Reservasi</h5>
          <p className="text-2xl font-bold text-orange-600">23</p>
          <p className="text-sm text-orange-700">Perlu diproses</p>
        </div>
      </div>
    </div>
  );

  const renderCheckIn = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Archive className="w-5 h-5 mr-2 text-green-600" />
          Form Pengembalian Buku
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member Information Section */}
          <div className="md:col-span-2 bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="text-md font-semibold text-green-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Informasi Anggota
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari Anggota</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama, NIS, atau email anggota"
                  />
                  <button type="button" className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Keanggotaan</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Status akan muncul setelah pencarian"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Nama anggota akan muncul di sini"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kelas/Jabatan</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Kelas atau jabatan anggota"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Denda Belum Dibayar</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Rp 0"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buku yang Dipinjam</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="0"
                  readOnly
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Buku *</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Scan atau ketik barcode buku"
                required
              />
              <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Scan className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pengembalian *</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kondisi Buku Saat Kembali</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Baik - Tidak Ada Kerusakan</option>
              <option>Baik - Kerusakan Ringan</option>
              <option>Cukup - Kerusakan Sedang</option>
              <option>Buruk - Kerusakan Berat</option>
              <option>Hilang - Tidak Dikembalikan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Keterlambatan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Tepat Waktu</option>
              <option>Terlambat 1-3 Hari</option>
              <option>Terlambat 4-7 Hari</option>
              <option>Terlambat 8-14 Hari</option>
              <option>Terlambat &gt; 14 Hari</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Denda (Rp)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Petugas Penerima</label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Pengembalian</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan kondisi buku atau kejadian khusus"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Archive className="w-4 h-4 mr-2 inline" />
            Proses Pengembalian
          </button>
          <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <Calculator className="w-4 h-4 mr-2 inline" />
            Hitung Denda
          </button>
        </div>
      </div>
    </div>
  );

  const renderRenewals = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <RefreshCw className="w-5 h-5 mr-2 text-blue-600" />
          Form Perpanjangan Peminjaman
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Anggota *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan barcode anggota"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Buku *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan barcode buku"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jatuh Tempo Saat Ini</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jatuh Tempo Baru *</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Perpanjangan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Perpanjangan ke-1</option>
              <option>Perpanjangan ke-2</option>
              <option>Perpanjangan ke-3</option>
              <option>Perpanjangan Khusus</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alasan Perpanjangan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Masih Membutuhkan</option>
              <option>Penelitian Berlanjut</option>
              <option>Tugas Sekolah</option>
              <option>Referensi Jangka Panjang</option>
              <option>Lainnya</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biaya Perpanjangan (Rp)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Tunai</option>
              <option>Transfer Bank</option>
              <option>E-Wallet</option>
              <option>Kartu Debit</option>
              <option>Gratis</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Perpanjangan</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan khusus untuk perpanjangan ini"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            Proses Perpanjangan
          </button>
        </div>
      </div>
    </div>
  );

  const renderReservations = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Bookmark className="w-5 h-5 mr-2 text-purple-600" />
          Form Reservasi Buku
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Anggota *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan barcode anggota"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Buku *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan barcode buku"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Reservasi *</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kebutuhan</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioritas Reservasi</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Normal</option>
              <option>Tinggi - Tugas Sekolah</option>
              <option>Urgent - Ujian</option>
              <option>Khusus - Penelitian</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Notifikasi</label>
            <div className="space-y-2">
              {['Email', 'SMS', 'WhatsApp', 'Telepon', 'Pengumuman'].map((method) => (
                <label key={method} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Hold (hari)</label>
            <input
              type="number"
              defaultValue="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="14"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Pickup</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Meja Sirkulasi</option>
              <option>Ruang Referensi</option>
              <option>Loker Pickup</option>
              <option>Ruang Baca</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Alasan Reservasi</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Jelaskan mengapa buku ini perlu direservasi"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Bookmark className="w-4 h-4 mr-2 inline" />
            Buat Reservasi
          </button>
        </div>
      </div>
    </div>
  );

  const renderOverdueManagement = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Manajemen Keterlambatan
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Keterlambatan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Semua Keterlambatan</option>
              <option>1-3 Hari Terlambat</option>
              <option>4-7 Hari Terlambat</option>
              <option>8-14 Hari Terlambat</option>
              <option>&gt; 14 Hari Terlambat</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Tindakan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Kirim Reminder</option>
              <option>Telepon Anggota</option>
              <option>Surat Peringatan</option>
              <option>Suspend Keanggotaan</option>
              <option>Lapor ke Wali Kelas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Pesan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Reminder Sopan</option>
              <option>Peringatan Pertama</option>
              <option>Peringatan Kedua</option>
              <option>Peringatan Final</option>
              <option>Custom Message</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Kontak</label>
            <div className="space-y-2">
              {['Email', 'SMS', 'WhatsApp', 'Telepon', 'Surat Fisik'].map((method) => (
                <label key={method} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Tindakan</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pesan Custom</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tulis pesan khusus untuk anggota yang terlambat"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <Bell className="w-4 h-4 mr-2 inline" />
            Kirim Reminder
          </button>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <AlertCircle className="w-4 h-4 mr-2 inline" />
            Suspend Anggota
          </button>
        </div>
      </div>
    </div>
  );

  const renderFinesFees = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Manajemen Denda & Biaya
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Anggota *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan barcode anggota"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Denda *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Denda Keterlambatan</option>
              <option>Denda Kerusakan</option>
              <option>Denda Kehilangan</option>
              <option>Biaya Administrasi</option>
              <option>Biaya Penggantian</option>
              <option>Biaya Layanan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Denda (Rp) *</label>
            <input
              type="number"
              value={transactionData.fineAmount}
              onChange={(e) => setTransactionData(prev => ({...prev, fineAmount: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran *</label>
            <select
              value={transactionData.paymentMethod}
              onChange={(e) => setTransactionData(prev => ({...prev, paymentMethod: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">Tunai</option>
              <option value="bank_transfer">Transfer Bank</option>
              <option value="e_wallet">E-Wallet (OVO, GoPay, DANA)</option>
              <option value="debit_card">Kartu Debit</option>
              <option value="installment">Cicilan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Pembayaran</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Belum Dibayar</option>
              <option>Dibayar Sebagian</option>
              <option>Lunas</option>
              <option>Dibebaskan</option>
              <option>Dalam Proses</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Jatuh Tempo</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Diskon/Keringanan (%)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
              max="100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alasan Diskon</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Tidak Ada</option>
              <option>Siswa Berprestasi</option>
              <option>Kondisi Ekonomi</option>
              <option>Kesalahan Sistem</option>
              <option>Kebijakan Sekolah</option>
              <option>Lainnya</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Denda</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan detail tentang denda dan pembayaran"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <CreditCard className="w-4 h-4 mr-2 inline" />
            Proses Pembayaran
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FileText className="w-4 h-4 mr-2 inline" />
            Cetak Kwitansi
          </button>
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
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sirkulasi</h2>
            <p className="text-sm text-gray-600">Kelola peminjaman, pengembalian, dan layanan sirkulasi</p>
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

      {/* Content */}
      <div className="p-6">
        {activeTab === 'check-out' && renderCheckOut()}
        {activeTab === 'check-in' && renderCheckIn()}
        {activeTab === 'renewals' && renderRenewals()}
        {activeTab === 'reservations' && renderReservations()}
        {activeTab === 'overdue-management' && renderOverdueManagement()}
        {activeTab === 'fines-fees' && renderFinesFees()}
      </div>
    </div>
  );
}

export default CirculationForm;