import React, { useState } from 'react';
import { 
  ShoppingCart, 
  CheckCircle, 
  Users, 
  Package, 
  BarChart3, 
  Calendar,
  Monitor,
  Save,
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  Upload,
  DollarSign,
  Truck,
  FileText,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';

function AcquisitionForm() {
  const [activeTab, setActiveTab] = useState('selection-policy');
  const [orderData, setOrderData] = useState({
    orderDate: new Date().toISOString().split('T')[0],
    vendor: '',
    orderType: 'purchase',
    priority: 'normal',
    budget: '',
    expectedDelivery: '',
    notes: ''
  });

  const tabs = [
    { id: 'selection-policy', label: 'Kebijakan Seleksi', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'ordering-process', label: 'Proses Pemesanan', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'vendor-relations', label: 'Hubungan Vendor', icon: <Users className="w-4 h-4" /> },
    { id: 'receiving-processing', label: 'Penerimaan & Pemrosesan', icon: <Package className="w-4 h-4" /> },
    { id: 'budget-management', label: 'Manajemen Anggaran', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'serials-management', label: 'Manajemen Terbitan Berkala', icon: <Calendar className="w-4 h-4" /> },
    { id: 'electronic-resources', label: 'Sumber Daya Elektronik', icon: <Monitor className="w-4 h-4" /> }
  ];

  const renderSelectionPolicy = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Kebijakan Seleksi Koleksi</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Subjek *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>000 - Ilmu Komputer & Informasi</option>
              <option>100 - Filsafat & Psikologi</option>
              <option>200 - Agama</option>
              <option>300 - Ilmu Sosial</option>
              <option>400 - Bahasa</option>
              <option>500 - Sains Murni</option>
              <option>600 - Teknologi</option>
              <option>700 - Seni & Rekreasi</option>
              <option>800 - Sastra</option>
              <option>900 - Sejarah & Geografi</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level Prioritas *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="essential">Essential (Wajib)</option>
              <option value="important">Important (Penting)</option>
              <option value="useful">Useful (Berguna)</option>
              <option value="optional">Optional (Opsional)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Pengguna</label>
            <div className="space-y-2">
              {['Siswa Kelas X', 'Siswa Kelas XI', 'Siswa Kelas XII', 'Guru', 'Staf', 'Umum'].map((target) => (
                <label key={target} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{target}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kriteria Seleksi</label>
            <div className="space-y-2">
              {['Relevansi Kurikulum', 'Kualitas Konten', 'Reputasi Penerbit', 'Harga Terjangkau', 'Ketersediaan Digital', 'Bahasa Indonesia'].map((criteria) => (
                <label key={criteria} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{criteria}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Justifikasi Seleksi</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Alasan mengapa koleksi ini diperlukan"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <CheckCircle className="w-4 h-4 mr-2 inline" />
            Approve Seleksi
          </button>
        </div>
      </div>
    </div>
  );

  const renderOrderingProcess = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Form Pemesanan</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor PO *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="PO-2024-001"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pemesanan *</label>
            <input
              type="date"
              value={orderData.orderDate}
              onChange={(e) => setOrderData(prev => ({...prev, orderDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vendor/Supplier *</label>
            <select
              value={orderData.vendor}
              onChange={(e) => setOrderData(prev => ({...prev, vendor: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Vendor</option>
              <option>PT Gramedia</option>
              <option>PT Erlangga</option>
              <option>Toko Buku Gunung Agung</option>
              <option>CV Pustaka Setia</option>
              <option>Vendor Lainnya</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Pemesanan</label>
            <select
              value={orderData.orderType}
              onChange={(e) => setOrderData(prev => ({...prev, orderType: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="purchase">Pembelian</option>
              <option value="donation">Hibah</option>
              <option value="exchange">Tukar Menukar</option>
              <option value="subscription">Langganan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioritas</label>
            <select
              value={orderData.priority}
              onChange={(e) => setOrderData(prev => ({...prev, priority: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Anggaran</label>
            <input
              type="number"
              value={orderData.budget}
              onChange={(e) => setOrderData(prev => ({...prev, budget: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Pengiriman</label>
            <input
              type="date"
              value={orderData.expectedDelivery}
              onChange={(e) => setOrderData(prev => ({...prev, expectedDelivery: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Transfer Bank</option>
              <option>Cek</option>
              <option>Tunai</option>
              <option>Kredit</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Pemesanan</label>
            <textarea
              value={orderData.notes}
              onChange={(e) => setOrderData(prev => ({...prev, notes: e.target.value}))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Instruksi khusus atau catatan untuk vendor"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ShoppingCart className="w-4 h-4 mr-2 inline" />
            Buat Pesanan
          </button>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4 mr-2 inline" />
            Simpan Draft
          </button>
        </div>
      </div>
    </div>
  );

  const renderVendorRelations = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Informasi Vendor</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Vendor *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama perusahaan vendor"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Vendor *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Penerbit</option>
              <option>Distributor</option>
              <option>Toko Buku</option>
              <option>Agen</option>
              <option>Online Store</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kontak Person</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama kontak utama"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="email@vendor.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="(021) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://vendor.com"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Alamat lengkap vendor"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Diskon (%)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
              max="100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Termin Pembayaran</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Cash on Delivery</option>
              <option>Net 30</option>
              <option>Net 60</option>
              <option>Net 90</option>
              <option>Advance Payment</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Users className="w-4 h-4 mr-2 inline" />
            Simpan Vendor
          </button>
        </div>
      </div>
    </div>
  );

  const renderReceivingProcessing = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Penerimaan Barang</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor PO *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="PO-2024-001"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Penerimaan *</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Invoice</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="INV-2024-001"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kondisi Penerimaan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Baik - Sesuai Pesanan</option>
              <option>Baik - Ada Perbedaan</option>
              <option>Rusak - Sebagian</option>
              <option>Rusak - Seluruhnya</option>
              <option>Tidak Lengkap</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Diterima</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Dipesan</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Penerima</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama staff yang menerima"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Pemrosesan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Diterima - Belum Diproses</option>
              <option>Sedang Diproses</option>
              <option>Selesai Diproses</option>
              <option>Siap Katalog</option>
              <option>Siap Edar</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Penerimaan</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan kondisi barang, perbedaan dengan pesanan, dll."
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Package className="w-4 h-4 mr-2 inline" />
            Konfirmasi Penerimaan
          </button>
        </div>
      </div>
    </div>
  );

  const renderBudgetManagement = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Manajemen Anggaran</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Anggaran *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Anggaran *</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Anggaran Buku Teks</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Anggaran Referensi</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Anggaran Digital</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Anggaran Perawatan</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <BarChart3 className="w-4 h-4 mr-2 inline" />
            Simpan Anggaran
          </button>
        </div>
      </div>
    </div>
  );

  const renderSerialsManagement = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Terbitan Berkala</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Judul Terbitan *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama majalah/jurnal"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ISSN</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0000-0000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frekuensi Terbit *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Harian</option>
              <option>Mingguan</option>
              <option>Dwi Mingguan</option>
              <option>Bulanan</option>
              <option>Dwi Bulanan</option>
              <option>Triwulanan</option>
              <option>Semesteran</option>
              <option>Tahunan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mulai Langganan</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Berakhir Langganan</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biaya Langganan/Tahun</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Calendar className="w-4 h-4 mr-2 inline" />
            Simpan Langganan
          </button>
        </div>
      </div>
    </div>
  );

  const renderElectronicResources = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Sumber Daya Elektronik</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Resource *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama database/platform"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Resource *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>E-Book Platform</option>
              <option>Database Jurnal</option>
              <option>Video Learning</option>
              <option>Audio Book</option>
              <option>Digital Archive</option>
              <option>Online Course</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Akses</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://platform.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Username akses"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Password akses"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah User Concurrent</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mulai Langganan</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Berakhir Langganan</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Konten</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi jenis konten yang tersedia"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Monitor className="w-4 h-4 mr-2 inline" />
            Simpan Resource
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
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pengadaan</h2>
            <p className="text-sm text-gray-600">Kelola proses pengadaan dan pembelian koleksi</p>
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
        {activeTab === 'selection-policy' && renderSelectionPolicy()}
        {activeTab === 'ordering-process' && renderOrderingProcess()}
        {activeTab === 'vendor-relations' && renderVendorRelations()}
        {activeTab === 'receiving-processing' && renderReceivingProcessing()}
        {activeTab === 'budget-management' && renderBudgetManagement()}
        {activeTab === 'serials-management' && renderSerialsManagement()}
        {activeTab === 'electronic-resources' && renderElectronicResources()}
      </div>
    </div>
  );
}

export default AcquisitionForm;