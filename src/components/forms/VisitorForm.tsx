import React, { useState } from 'react';
import { 
  Eye, 
  MapPin, 
  Activity, 
  Star, 
  Printer, 
  Monitor, 
  Wifi, 
  Smartphone,
  Save,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Clock,
  Calendar,
  User,
  Users,
  BarChart3,
  TrendingUp,
  Target,
  Award,
  CheckCircle,
  AlertCircle,
  Camera,
  QrCode,
  CreditCard,
  FileText,
  Settings,
  Bell,
  Globe,
  Shield,
  Zap,
  Coffee,
  Book,
  Headphones,
  Laptop,
  MousePointer
} from 'lucide-react';

interface VisitorFormProps {
  user?: any;
}

function VisitorForm({ user }: VisitorFormProps) {
  const [activeTab, setActiveTab] = useState('visitor-monitoring');
  const [visitorData, setVisitorData] = useState({
    visitorName: '',
    visitorId: '',
    purpose: '',
    duration: '',
    location: '',
    contactPerson: '',
    notes: ''
  });

  const tabs = [
    { id: 'visitor-monitoring', label: 'Monitoring Pengunjung', icon: <Eye className="w-4 h-4" /> },
    { id: 'visitor-location', label: 'Lokasi Pengunjung', icon: <MapPin className="w-4 h-4" /> },
    { id: 'visitor-activity', label: 'Aktivitas Pengunjung', icon: <Activity className="w-4 h-4" /> },
    { id: 'visitor-feedback', label: 'Feedback Pengunjung', icon: <Star className="w-4 h-4" /> },
    { id: 'print-services', label: 'Layanan Cetak', icon: <Printer className="w-4 h-4" /> },
    { id: 'computer-access', label: 'Akses Komputer', icon: <Monitor className="w-4 h-4" /> },
    { id: 'wifi-access', label: 'Akses WiFi', icon: <Wifi className="w-4 h-4" /> },
    { id: 'digital-cards', label: 'Kartu Digital', icon: <Smartphone className="w-4 h-4" /> }
  ];

  const renderVisitorMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-blue-600" />
          Registrasi Pengunjung
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pengunjung *</label>
            <input
              type="text"
              value={visitorData.visitorName}
              onChange={(e) => setVisitorData(prev => ({...prev, visitorName: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama lengkap pengunjung"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Identitas *</label>
            <input
              type="text"
              value={visitorData.visitorId}
              onChange={(e) => setVisitorData(prev => ({...prev, visitorId: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="KTP/SIM/Paspor"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Pengunjung *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Siswa Sekolah Lain</option>
              <option>Mahasiswa</option>
              <option>Peneliti</option>
              <option>Guru/Dosen</option>
              <option>Masyarakat Umum</option>
              <option>Orang Tua Siswa</option>
              <option>Vendor/Supplier</option>
              <option>Tamu Resmi</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asal Institusi</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama sekolah/universitas/instansi"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tujuan Kunjungan *</label>
            <select
              value={visitorData.purpose}
              onChange={(e) => setVisitorData(prev => ({...prev, purpose: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Tujuan</option>
              <option>Membaca/Belajar</option>
              <option>Penelitian</option>
              <option>Mengerjakan Tugas</option>
              <option>Akses Internet</option>
              <option>Fotokopi/Print</option>
              <option>Konsultasi</option>
              <option>Kunjungan Resmi</option>
              <option>Lainnya</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Durasi</label>
            <select
              value={visitorData.duration}
              onChange={(e) => setVisitorData(prev => ({...prev, duration: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>&lt; 1 Jam</option>
              <option>1-2 Jam</option>
              <option>2-4 Jam</option>
              <option>4-6 Jam</option>
              <option>Seharian</option>
              <option>Tidak Tentu</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Area yang Dikunjungi</label>
            <div className="space-y-2">
              {['Ruang Baca Umum', 'Ruang Referensi', 'Ruang Komputer', 'Ruang Diskusi', 'Area Koleksi', 'Ruang Audio Visual'].map((area) => (
                <label key={area} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{area}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kontak Person</label>
            <input
              type="text"
              value={visitorData.contactPerson}
              onChange={(e) => setVisitorData(prev => ({...prev, contactPerson: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Staff yang bertanggung jawab"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Masuk</label>
            <input
              type="time"
              defaultValue={new Date().toTimeString().slice(0, 5)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Waktu Keluar</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Kunjungan</label>
            <textarea
              value={visitorData.notes}
              onChange={(e) => setVisitorData(prev => ({...prev, notes: e.target.value}))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan khusus tentang kunjungan"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <CheckCircle className="w-4 h-4 mr-2 inline" />
            Check In Pengunjung
          </button>
          <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <QrCode className="w-4 h-4 mr-2 inline" />
            Generate QR Code
          </button>
        </div>
      </div>
    </div>
  );

  const renderVisitorLocation = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Tracking Lokasi Pengunjung
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Pengunjung *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan QR code atau input manual"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Saat Ini *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Lobby/Entrance</option>
              <option>Ruang Baca Umum - Lantai 1</option>
              <option>Ruang Baca Umum - Lantai 2</option>
              <option>Ruang Referensi</option>
              <option>Ruang Komputer</option>
              <option>Ruang Diskusi A</option>
              <option>Ruang Diskusi B</option>
              <option>Ruang Audio Visual</option>
              <option>Area Koleksi</option>
              <option>Toilet</option>
              <option>Kantin</option>
              <option>Keluar</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Masuk Area</label>
            <input
              type="time"
              defaultValue={new Date().toTimeString().slice(0, 5)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aktivitas di Area</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Membaca</option>
              <option>Mengerjakan Tugas</option>
              <option>Penelitian</option>
              <option>Diskusi Kelompok</option>
              <option>Akses Komputer</option>
              <option>Fotokopi/Print</option>
              <option>Konsultasi</option>
              <option>Istirahat</option>
              <option>Transit</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas Area</label>
            <div className="flex space-x-2">
              <input
                type="number"
                className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="25"
                readOnly
              />
              <span className="text-sm text-gray-600 py-2">/ 30 orang</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">83% terisi</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Kepadatan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Sepi (&lt; 30%)</option>
              <option>Normal (30-70%)</option>
              <option>Ramai (70-90%)</option>
              <option>Penuh (&gt; 90%)</option>
              <option>Overkapasitas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Petugas Monitoring</label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Tracking</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Manual Entry</option>
              <option>QR Code Scan</option>
              <option>RFID Card</option>
              <option>Facial Recognition</option>
              <option>Mobile App Check-in</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Observasi Perilaku</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan perilaku atau kejadian khusus"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Eye className="w-4 h-4 mr-2 inline" />
            Update Lokasi
          </button>
        </div>
      </div>
    </div>
  );

  const renderVisitorActivity = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Log Aktivitas Pengunjung
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Pengunjung *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan QR atau input ID"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Aktivitas *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Membaca Buku</option>
              <option>Akses Komputer</option>
              <option>Penelitian</option>
              <option>Mengerjakan Tugas</option>
              <option>Diskusi Kelompok</option>
              <option>Konsultasi Pustakawan</option>
              <option>Fotokopi/Print</option>
              <option>Akses WiFi</option>
              <option>Menonton Video Edukasi</option>
              <option>Menggunakan Database</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Mulai</label>
            <input
              type="time"
              defaultValue={new Date().toTimeString().slice(0, 5)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Selesai</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sumber Daya yang Digunakan</label>
            <div className="space-y-2">
              {[
                'Buku Fisik',
                'E-Book',
                'Database Online',
                'Komputer/Laptop',
                'Internet/WiFi',
                'Printer/Scanner',
                'Ruang Diskusi',
                'Proyektor',
                'Audio System'
              ].map((resource) => (
                <label key={resource} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{resource}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level Kepuasan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Sangat Puas</option>
              <option>Puas</option>
              <option>Cukup</option>
              <option>Kurang Puas</option>
              <option>Tidak Puas</option>
              <option>Belum Dinilai</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bantuan yang Diberikan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Tidak Ada</option>
              <option>Orientasi Perpustakaan</option>
              <option>Bantuan Pencarian</option>
              <option>Konsultasi Referensi</option>
              <option>Bantuan Teknis</option>
              <option>Bimbingan Penelitian</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Petugas yang Membantu</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama petugas"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Detail Aktivitas</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi detail aktivitas yang dilakukan pengunjung"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Activity className="w-4 h-4 mr-2 inline" />
            Simpan Aktivitas
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrintServices = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Printer className="w-5 h-5 mr-2 text-blue-600" />
          Layanan Cetak & Fotokopi
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Pengguna *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan kartu atau input ID"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Layanan *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Fotokopi Hitam Putih</option>
              <option>Fotokopi Berwarna</option>
              <option>Print Dokumen</option>
              <option>Print Foto</option>
              <option>Scan to Email</option>
              <option>Scan to USB</option>
              <option>Binding/Jilid</option>
              <option>Laminating</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran Kertas *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>A4 (21 x 29.7 cm)</option>
              <option>A3 (29.7 x 42 cm)</option>
              <option>A5 (14.8 x 21 cm)</option>
              <option>Letter (21.6 x 27.9 cm)</option>
              <option>Legal (21.6 x 35.6 cm)</option>
              <option>F4 (21 x 33 cm)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Halaman *</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Copy</label>
            <input
              type="number"
              defaultValue="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Orientasi</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Portrait</option>
              <option>Landscape</option>
              <option>Auto</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kualitas Print</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Draft (Cepat)</option>
              <option>Normal</option>
              <option>High Quality</option>
              <option>Photo Quality</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duplex/Bolak-balik</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Single Side</option>
              <option>Double Side - Long Edge</option>
              <option>Double Side - Short Edge</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biaya Total (Rp)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="0"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Tunai</option>
              <option>Kartu Pelajar</option>
              <option>E-Wallet</option>
              <option>Transfer Bank</option>
              <option>Gratis (Staff/Guru)</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Layanan</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan khusus untuk layanan cetak ini"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Printer className="w-4 h-4 mr-2 inline" />
            Proses Cetak
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <CreditCard className="w-4 h-4 mr-2 inline" />
            Proses Pembayaran
          </button>
        </div>
      </div>
    </div>
  );

  const renderComputerAccess = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Monitor className="w-5 h-5 mr-2 text-blue-600" />
          Manajemen Akses Komputer
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Pengguna *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan kartu atau input ID"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Komputer *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>PC-001 (Tersedia)</option>
              <option>PC-002 (Tersedia)</option>
              <option>PC-003 (Digunakan)</option>
              <option>PC-004 (Maintenance)</option>
              <option>PC-005 (Tersedia)</option>
              <option>PC-006 (Tersedia)</option>
              <option>PC-007 (Digunakan)</option>
              <option>PC-008 (Tersedia)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Mulai</label>
            <input
              type="time"
              defaultValue={new Date().toTimeString().slice(0, 5)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Penggunaan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>30 Menit</option>
              <option>1 Jam</option>
              <option>2 Jam</option>
              <option>3 Jam</option>
              <option>4 Jam</option>
              <option>Seharian</option>
              <option>Custom</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tujuan Penggunaan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Mengerjakan Tugas</option>
              <option>Penelitian Online</option>
              <option>Akses E-Learning</option>
              <option>Browsing Internet</option>
              <option>Mengetik Dokumen</option>
              <option>Presentasi</option>
              <option>Multimedia Editing</option>
              <option>Programming</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Software yang Dibutuhkan</label>
            <div className="space-y-2">
              {[
                'Microsoft Office',
                'Adobe Creative Suite',
                'Web Browser',
                'Programming IDE',
                'Statistical Software',
                'CAD Software',
                'Video Editor',
                'Audio Editor'
              ].map((software) => (
                <label key={software} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{software}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level Akses Internet</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Full Access</option>
              <option>Educational Sites Only</option>
              <option>Restricted Access</option>
              <option>No Internet</option>
              <option>Custom Filter</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biaya Penggunaan (Rp/jam)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="5000"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Pembayaran</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Belum Dibayar</option>
              <option>Lunas</option>
              <option>Gratis</option>
              <option>Pending</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Penggunaan</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan khusus penggunaan komputer"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Monitor className="w-4 h-4 mr-2 inline" />
            Assign Komputer
          </button>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <Clock className="w-4 h-4 mr-2 inline" />
            End Session
          </button>
        </div>
      </div>
    </div>
  );

  const renderWifiAccess = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Wifi className="w-5 h-5 mr-2 text-blue-600" />
          Manajemen Akses WiFi
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Pengguna *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan kartu atau input ID"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SSID Network *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>LIBRARY-STUDENT</option>
              <option>LIBRARY-TEACHER</option>
              <option>LIBRARY-GUEST</option>
              <option>LIBRARY-STAFF</option>
              <option>LIBRARY-RESEARCH</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username WiFi</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="Auto-generated"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password WiFi</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Auto-generated"
                readOnly
              />
              <button className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Akses</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>1 Jam</option>
              <option>2 Jam</option>
              <option>4 Jam</option>
              <option>8 Jam</option>
              <option>1 Hari</option>
              <option>1 Minggu</option>
              <option>1 Bulan</option>
              <option>Unlimited</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bandwidth Limit</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Unlimited</option>
              <option>1 Mbps</option>
              <option>2 Mbps</option>
              <option>5 Mbps</option>
              <option>10 Mbps</option>
              <option>Custom</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Filter</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Educational Only</option>
              <option>Safe Browsing</option>
              <option>Standard Filter</option>
              <option>Minimal Filter</option>
              <option>No Filter</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Device Limit</label>
            <input
              type="number"
              defaultValue="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="5"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Blocked Websites/Categories</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Daftar website atau kategori yang diblokir (satu per baris)"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Wifi className="w-4 h-4 mr-2 inline" />
            Generate Akses
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <QrCode className="w-4 h-4 mr-2 inline" />
            QR Code WiFi
          </button>
        </div>
      </div>
    </div>
  );

  const renderDigitalCards = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
          Kartu Digital & Mobile Access
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Anggota *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ID anggota perpustakaan"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kartu Digital *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Kartu Anggota Standar</option>
              <option>Kartu Anggota Premium</option>
              <option>Kartu Tamu Sementara</option>
              <option>Kartu Akses Khusus</option>
              <option>Kartu Peneliti</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Static QR (Permanent)</option>
              <option>Dynamic QR (Updateable)</option>
              <option>Time-limited QR</option>
              <option>One-time QR</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Masa Berlaku</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fitur Mobile App</label>
            <div className="space-y-2">
              {[
                'OPAC Search',
                'Digital Library',
                'Loan History',
                'Reservations',
                'Notifications',
                'QR Scanner',
                'Offline Reading',
                'Social Features'
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Push Notifications</label>
            <div className="space-y-2">
              {[
                'Due Date Reminders',
                'New Books Alert',
                'Event Notifications',
                'System Maintenance',
                'Overdue Notices',
                'Reservation Ready'
              ].map((notification) => (
                <label key={notification} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{notification}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Device Registration</label>
            <input
              type="number"
              defaultValue="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="10"
            />
            <p className="text-xs text-gray-500 mt-1">Maksimal device yang bisa didaftarkan</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Security Level</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Basic</option>
              <option>Standard</option>
              <option>High Security</option>
              <option>Biometric Required</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Kartu Digital</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan khusus untuk kartu digital ini"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Smartphone className="w-4 h-4 mr-2 inline" />
            Generate Kartu
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4 mr-2 inline" />
            Download QR
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
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pengunjung</h2>
            <p className="text-sm text-gray-600">Kelola monitoring, aktivitas, dan layanan untuk pengunjung perpustakaan</p>
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
        {activeTab === 'visitor-monitoring' && renderVisitorMonitoring()}
        {activeTab === 'visitor-location' && renderVisitorLocation()}
        {activeTab === 'visitor-activity' && renderVisitorActivity()}
        {activeTab === 'visitor-feedback' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              Feedback & Evaluasi Pengunjung
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Pengunjung</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="ID atau nama pengunjung" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating Keseluruhan *</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>⭐⭐⭐⭐⭐ Sangat Puas</option>
                  <option>⭐⭐⭐⭐ Puas</option>
                  <option>⭐⭐⭐ Cukup</option>
                  <option>⭐⭐ Kurang Puas</option>
                  <option>⭐ Tidak Puas</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Komentar & Saran</label>
                <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Masukan dan saran untuk perbaikan layanan" />
              </div>
            </div>
            <div className="mt-6">
              <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                <Star className="w-4 h-4 mr-2 inline" />
                Simpan Feedback
              </button>
            </div>
          </div>
        )}
        {activeTab === 'print-services' && renderPrintServices()}
        {activeTab === 'computer-access' && renderComputerAccess()}
        {activeTab === 'wifi-access' && renderWifiAccess()}
        {activeTab === 'digital-cards' && renderDigitalCards()}
      </div>
    </div>
  );
}

export default VisitorForm;