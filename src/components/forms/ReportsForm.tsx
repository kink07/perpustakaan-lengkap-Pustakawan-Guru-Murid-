import React, { useState } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Book, 
  Users, 
  TrendingUp,
  Save,
  Download,
  Upload,
  Calendar,
  Filter,
  Eye,
  FileText,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Clock,
  DollarSign,
  Printer,
  Mail,
  Share2,
  Settings,
  Database,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  Camera,
  Scan,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react';

function ReportsForm() {
  const [activeTab, setActiveTab] = useState('circulation-reports');
  const [reportData, setReportData] = useState({
    reportType: '',
    startDate: '',
    endDate: '',
    format: 'pdf',
    groupBy: 'daily',
    includeCharts: true,
    emailRecipients: '',
    scheduledReport: false
  });

  const tabs = [
    { id: 'circulation-reports', label: 'Laporan Sirkulasi', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'collection-reports', label: 'Laporan Koleksi', icon: <Book className="w-4 h-4" /> },
    { id: 'user-reports', label: 'Laporan Pengguna', icon: <Users className="w-4 h-4" /> },
    { id: 'financial-reports', label: 'Laporan Keuangan', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'statistical-reports', label: 'Laporan Statistik', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const renderCirculationReports = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          Laporan Sirkulasi
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Laporan *</label>
            <select
              value={reportData.reportType}
              onChange={(e) => setReportData(prev => ({...prev, reportType: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Jenis Laporan</option>
              <option>Laporan Peminjaman Harian</option>
              <option>Laporan Pengembalian</option>
              <option>Laporan Keterlambatan</option>
              <option>Laporan Reservasi</option>
              <option>Laporan Perpanjangan</option>
              <option>Laporan Denda</option>
              <option>Laporan Buku Populer</option>
              <option>Laporan Aktivitas Pengguna</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Periode Laporan *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Hari Ini</option>
              <option>Kemarin</option>
              <option>Minggu Ini</option>
              <option>Minggu Lalu</option>
              <option>Bulan Ini</option>
              <option>Bulan Lalu</option>
              <option>3 Bulan Terakhir</option>
              <option>6 Bulan Terakhir</option>
              <option>1 Tahun Terakhir</option>
              <option>Custom Range</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
            <input
              type="date"
              value={reportData.startDate}
              onChange={(e) => setReportData(prev => ({...prev, startDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
            <input
              type="date"
              value={reportData.endDate}
              onChange={(e) => setReportData(prev => ({...prev, endDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Jenis Pengguna</label>
            <div className="space-y-2">
              {['Siswa', 'Guru', 'Staff', 'Tamu', 'Alumni'].map((userType) => (
                <label key={userType} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{userType}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Kategori Buku</label>
            <div className="space-y-2">
              {['Semua Kategori', '000-Komputer', '100-Filsafat', '200-Agama', '300-Sosial', '400-Bahasa', '500-Sains', '600-Teknologi', '700-Seni', '800-Sastra', '900-Sejarah'].map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked={category === 'Semua Kategori'} />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grouping Data</label>
            <select
              value={reportData.groupBy}
              onChange={(e) => setReportData(prev => ({...prev, groupBy: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Per Hari</option>
              <option value="weekly">Per Minggu</option>
              <option value="monthly">Per Bulan</option>
              <option value="category">Per Kategori</option>
              <option value="user_type">Per Jenis Pengguna</option>
              <option value="location">Per Lokasi</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format Output *</label>
            <select
              value={reportData.format}
              onChange={(e) => setReportData(prev => ({...prev, format: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF Report</option>
              <option value="excel">Excel Spreadsheet</option>
              <option value="csv">CSV Data</option>
              <option value="powerpoint">PowerPoint Presentation</option>
              <option value="html">HTML Report</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Komponen Laporan</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Summary Statistics',
                'Detailed Transactions',
                'Charts & Graphs',
                'Top 10 Lists',
                'Trend Analysis',
                'Comparative Data',
                'User Demographics',
                'Collection Usage'
              ].map((component) => (
                <label key={component} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{component}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <BarChart3 className="w-4 h-4 mr-2 inline" />
            Generate Laporan
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4 mr-2 inline" />
            Download
          </button>
        </div>
      </div>
    </div>
  );

  const renderCollectionReports = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Book className="w-5 h-5 mr-2 text-blue-600" />
          Laporan Koleksi
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Laporan Koleksi *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Inventaris Koleksi Lengkap</option>
              <option>Koleksi Baru</option>
              <option>Koleksi Populer</option>
              <option>Koleksi Tidak Aktif</option>
              <option>Kondisi Koleksi</option>
              <option>Koleksi Hilang/Rusak</option>
              <option>Statistik per Kategori</option>
              <option>Analisis Penggunaan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori DDC</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Semua Kategori</option>
              <option>000 - Ilmu Komputer</option>
              <option>100 - Filsafat</option>
              <option>200 - Agama</option>
              <option>300 - Ilmu Sosial</option>
              <option>400 - Bahasa</option>
              <option>500 - Sains</option>
              <option>600 - Teknologi</option>
              <option>700 - Seni</option>
              <option>800 - Sastra</option>
              <option>900 - Sejarah</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Koleksi</label>
            <div className="space-y-2">
              {['Tersedia', 'Dipinjam', 'Perawatan', 'Hilang', 'Rusak'].map((status) => (
                <label key={status} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi/Rak</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Semua Lokasi</option>
              <option>Lantai 1</option>
              <option>Lantai 2</option>
              <option>Ruang Referensi</option>
              <option>Koleksi Khusus</option>
              <option>Ruang Baca</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Publikasi</label>
            <div className="flex space-x-2">
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Dari tahun"
                min="1900"
                max="2030"
              />
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Sampai tahun"
                min="1900"
                max="2030"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Penerbit</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Filter berdasarkan penerbit"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Semua Bahasa</option>
              <option>Indonesia</option>
              <option>Inggris</option>
              <option>Arab</option>
              <option>Jawa</option>
              <option>Sunda</option>
              <option>Lainnya</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sorting/Urutan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Berdasarkan Judul</option>
              <option>Berdasarkan Pengarang</option>
              <option>Berdasarkan Tahun Terbit</option>
              <option>Berdasarkan Kategori</option>
              <option>Berdasarkan Popularitas</option>
              <option>Berdasarkan Tanggal Input</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Metrik yang Disertakan</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Total Peminjaman',
                'Rata-rata Peminjaman/Hari',
                'Tingkat Keterlambatan',
                'Durasi Rata-rata Peminjaman',
                'Top 10 Buku Populer',
                'Pengguna Paling Aktif',
                'Trend Bulanan',
                'Perbandingan Periode'
              ].map((metric) => (
                <label key={metric} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{metric}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FileText className="w-4 h-4 mr-2 inline" />
            Generate Laporan
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Mail className="w-4 h-4 mr-2 inline" />
            Email Laporan
          </button>
        </div>
      </div>
    </div>
  );

  const renderUserReports = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          Laporan Pengguna
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Laporan Pengguna *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Daftar Anggota Aktif</option>
              <option>Registrasi Pengguna Baru</option>
              <option>Aktivitas Pengguna</option>
              <option>Top Borrowers</option>
              <option>Pengguna Tidak Aktif</option>
              <option>Keanggotaan Expired</option>
              <option>Statistik Demografis</option>
              <option>Pelanggaran & Sanksi</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Keanggotaan</label>
            <div className="space-y-2">
              {['Siswa', 'Guru', 'Staff', 'Pustakawan', 'Tamu', 'Alumni'].map((membership) => (
                <label key={membership} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{membership}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Keanggotaan</label>
            <div className="space-y-2">
              {['Aktif', 'Tidak Aktif', 'Suspended', 'Expired', 'Pending'].map((status) => (
                <label key={status} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kelas/Departemen</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Semua Kelas</option>
              <option>Kelas X</option>
              <option>Kelas XI</option>
              <option>Kelas XII</option>
              <option>Guru Matematika</option>
              <option>Guru IPA</option>
              <option>Guru IPS</option>
              <option>Guru Bahasa</option>
              <option>Staff Administrasi</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rentang Umur</label>
            <div className="flex space-x-2">
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Dari umur"
                min="10"
                max="100"
              />
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Sampai umur"
                min="10"
                max="100"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Semua</option>
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aktivitas Minimum</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Semua Pengguna</option>
              <option>Min 1 Peminjaman</option>
              <option>Min 5 Peminjaman</option>
              <option>Min 10 Peminjaman</option>
              <option>Pengguna Aktif (30 hari)</option>
              <option>Pengguna Sangat Aktif</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Include Privacy Data</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Anonymized Data</option>
              <option>Partial Personal Info</option>
              <option>Full Personal Info</option>
              <option>Statistical Only</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Data yang Disertakan</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Informasi Dasar',
                'Kontak Details',
                'Riwayat Peminjaman',
                'Statistik Aktivitas',
                'Preferensi Bacaan',
                'Feedback & Rating',
                'Pelanggaran',
                'Financial Records'
              ].map((data) => (
                <label key={data} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{data}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Users className="w-4 h-4 mr-2 inline" />
            Generate Laporan
          </button>
        </div>
      </div>
    </div>
  );

  const renderFinancialReports = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Laporan Keuangan
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Laporan Keuangan *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Laporan Pendapatan</option>
              <option>Laporan Pengeluaran</option>
              <option>Laporan Denda</option>
              <option>Laporan Biaya Layanan</option>
              <option>Laporan Anggaran</option>
              <option>Cash Flow</option>
              <option>Profit & Loss</option>
              <option>Budget vs Actual</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Transaksi</label>
            <div className="space-y-2">
              {[
                'Denda Keterlambatan',
                'Biaya Fotokopi',
                'Biaya Print',
                'Biaya Keanggotaan',
                'Biaya Penggantian',
                'Biaya Layanan',
                'Pendapatan Lainnya'
              ].map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
            <div className="space-y-2">
              {['Tunai', 'Transfer Bank', 'E-Wallet', 'Kartu Debit', 'Cicilan'].map((method) => (
                <label key={method} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Pembayaran</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Semua Status</option>
              <option>Lunas</option>
              <option>Belum Dibayar</option>
              <option>Sebagian</option>
              <option>Overdue</option>
              <option>Dibebaskan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mata Uang</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>IDR (Rupiah)</option>
              <option>USD (Dollar)</option>
              <option>EUR (Euro)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Include Tax/PPN</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Exclude Tax</option>
              <option>Include Tax (11%)</option>
              <option>Tax Only</option>
              <option>Both (Separate)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Breakdown Level</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Summary Only</option>
              <option>Monthly Breakdown</option>
              <option>Weekly Breakdown</option>
              <option>Daily Breakdown</option>
              <option>Transaction Level</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comparison Period</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>No Comparison</option>
              <option>Previous Period</option>
              <option>Same Period Last Year</option>
              <option>Budget Comparison</option>
              <option>Target Comparison</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Laporan</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan atau konteks khusus untuk laporan keuangan"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <DollarSign className="w-4 h-4 mr-2 inline" />
            Generate Laporan Keuangan
          </button>
        </div>
      </div>
    </div>
  );

  const renderStatisticalReports = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Laporan Statistik & Analitik
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Analisis *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Trend Analysis</option>
              <option>Usage Patterns</option>
              <option>Peak Hours Analysis</option>
              <option>Seasonal Trends</option>
              <option>Correlation Analysis</option>
              <option>Predictive Analytics</option>
              <option>Performance Metrics</option>
              <option>Comparative Analysis</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Sources</label>
            <div className="space-y-2">
              {[
                'Circulation Data',
                'User Activity',
                'Collection Usage',
                'Visitor Logs',
                'Digital Access',
                'Financial Data',
                'Feedback Data',
                'System Logs'
              ].map((source) => (
                <label key={source} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{source}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Types</label>
            <div className="space-y-2">
              {[
                'Line Charts (Trends)',
                'Bar Charts (Comparisons)',
                'Pie Charts (Distributions)',
                'Heat Maps (Patterns)',
                'Scatter Plots (Correlations)',
                'Histograms (Frequencies)'
              ].map((chart) => (
                <label key={chart} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{chart}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statistical Measures</label>
            <div className="space-y-2">
              {[
                'Mean (Rata-rata)',
                'Median',
                'Mode',
                'Standard Deviation',
                'Percentiles',
                'Growth Rate',
                'Correlation Coefficient',
                'Confidence Intervals'
              ].map((measure) => (
                <label key={measure} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{measure}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Granularity Level</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Hourly</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Level</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>90%</option>
              <option>95%</option>
              <option>99%</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forecasting Period</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>No Forecasting</option>
              <option>1 Month Ahead</option>
              <option>3 Months Ahead</option>
              <option>6 Months Ahead</option>
              <option>1 Year Ahead</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Interactive Dashboard</option>
              <option>PDF Report</option>
              <option>Excel with Charts</option>
              <option>PowerBI File</option>
              <option>Tableau Workbook</option>
              <option>Raw Data (CSV)</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Objectives</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Jelaskan tujuan analisis dan insight yang diharapkan"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <TrendingUp className="w-4 h-4 mr-2 inline" />
            Generate Analisis
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
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Laporan</h2>
            <p className="text-sm text-gray-600">Generate dan kelola berbagai jenis laporan perpustakaan</p>
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
        {activeTab === 'circulation-reports' && renderCirculationReports()}
        {activeTab === 'collection-reports' && renderCollectionReports()}
        {activeTab === 'user-reports' && renderUserReports()}
        {activeTab === 'financial-reports' && renderFinancialReports()}
        {activeTab === 'statistical-reports' && renderStatisticalReports()}
      </div>
    </div>
  );
}

export default ReportsForm;