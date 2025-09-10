import React, { useState } from 'react';
import { 
  Settings, 
  FileText, 
  Archive, 
  UserCheck,
  Save,
  Upload,
  Download,
  RefreshCw,
  Shield,
  Globe,
  Bell,
  Clock,
  Database,
  Wifi,
  Monitor,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Cloud,
  HardDrive,
  Server,
  Activity,
  BarChart3,
  Users,
  Book,
  Printer,
  Camera,
  Mic,
  Video,
  Image,
  FileText as File,
  Folder,
  Tag,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  X,
  Copy,
  Share2
} from 'lucide-react';

function SettingsForm() {
  const [activeTab, setActiveTab] = useState('system-settings');
  const [systemSettings, setSystemSettings] = useState({
    libraryName: 'Perpustakaan Digital SMAN 1 Jakarta',
    libraryCode: 'LIB001',
    timezone: 'Asia/Jakarta',
    language: 'id',
    currency: 'IDR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  });

  const tabs = [
    { id: 'system-settings', label: 'Pengaturan Sistem', icon: <Settings className="w-4 h-4" /> },
    { id: 'library-policies', label: 'Kebijakan Perpustakaan', icon: <FileText className="w-4 h-4" /> },
    { id: 'backup-restore', label: 'Backup & Restore', icon: <Archive className="w-4 h-4" /> },
    { id: 'user-permissions', label: 'Izin Pengguna', icon: <UserCheck className="w-4 h-4" /> }
  ];

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Konfigurasi Sistem Umum
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Perpustakaan *</label>
            <input
              type="text"
              value={systemSettings.libraryName}
              onChange={(e) => setSystemSettings(prev => ({...prev, libraryName: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Perpustakaan *</label>
            <input
              type="text"
              value={systemSettings.libraryCode}
              onChange={(e) => setSystemSettings(prev => ({...prev, libraryCode: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zona Waktu *</label>
            <select
              value={systemSettings.timezone}
              onChange={(e) => setSystemSettings(prev => ({...prev, timezone: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Asia/Jakarta">WIB (Asia/Jakarta)</option>
              <option value="Asia/Makassar">WITA (Asia/Makassar)</option>
              <option value="Asia/Jayapura">WIT (Asia/Jayapura)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa Default *</label>
            <select
              value={systemSettings.language}
              onChange={(e) => setSystemSettings(prev => ({...prev, language: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
              <option value="jv">Bahasa Jawa</option>
              <option value="su">Bahasa Sunda</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mata Uang</label>
            <select
              value={systemSettings.currency}
              onChange={(e) => setSystemSettings(prev => ({...prev, currency: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="IDR">IDR (Rupiah)</option>
              <option value="USD">USD (Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format Tanggal</label>
            <select
              value={systemSettings.dateFormat}
              onChange={(e) => setSystemSettings(prev => ({...prev, dateFormat: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format Waktu</label>
            <select
              value={systemSettings.timeFormat}
              onChange={(e) => setSystemSettings(prev => ({...prev, timeFormat: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">24 Jam (14:30)</option>
              <option value="12h">12 Jam (2:30 PM)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (menit)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="5"
              max="480"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
            <input
              type="number"
              defaultValue="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
            <div className="space-y-2">
              {[
                'Minimal 8 karakter',
                'Harus ada huruf besar',
                'Harus ada huruf kecil',
                'Harus ada angka',
                'Harus ada simbol',
                'Tidak boleh sama dengan 3 password terakhir'
              ].map((policy) => (
                <label key={policy} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{policy}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notification Settings</label>
            <div className="space-y-2">
              {[
                'Email Notifications',
                'SMS Notifications',
                'Push Notifications',
                'In-App Notifications',
                'System Alerts',
                'Maintenance Notices'
              ].map((notification) => (
                <label key={notification} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{notification}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Perpustakaan</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Alamat lengkap perpustakaan"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Perpustakaan</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="perpus@sekolah.sch.id"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telepon Perpustakaan</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="(021) 123-4567"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4 mr-2 inline" />
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );

  const renderLibraryPolicies = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Kebijakan Perpustakaan
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jam Operasional</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Senin:</span>
                <input type="time" defaultValue="07:00" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">-</span>
                <input type="time" defaultValue="16:00" className="px-2 py-1 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Selasa:</span>
                <input type="time" defaultValue="07:00" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">-</span>
                <input type="time" defaultValue="16:00" className="px-2 py-1 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Rabu:</span>
                <input type="time" defaultValue="07:00" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">-</span>
                <input type="time" defaultValue="16:00" className="px-2 py-1 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Kamis:</span>
                <input type="time" defaultValue="07:00" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">-</span>
                <input type="time" defaultValue="16:00" className="px-2 py-1 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Jumat:</span>
                <input type="time" defaultValue="07:00" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">-</span>
                <input type="time" defaultValue="16:00" className="px-2 py-1 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Sabtu:</span>
                <input type="time" defaultValue="08:00" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">-</span>
                <input type="time" defaultValue="12:00" className="px-2 py-1 border border-gray-300 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Minggu:</span>
                <span className="text-sm text-red-600">Tutup</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aturan Peminjaman</label>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Siswa:</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input type="number" defaultValue="5" className="px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Max buku" />
                  <input type="number" defaultValue="7" className="px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Hari" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Guru:</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input type="number" defaultValue="10" className="px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Max buku" />
                  <input type="number" defaultValue="30" className="px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Hari" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Staff:</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input type="number" defaultValue="8" className="px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Max buku" />
                  <input type="number" defaultValue="14" className="px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Hari" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aturan Denda</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm w-32">Denda/hari:</span>
                <input type="number" defaultValue="1000" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">Rupiah</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm w-32">Denda maksimal:</span>
                <input type="number" defaultValue="50000" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">Rupiah</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm w-32">Grace period:</span>
                <input type="number" defaultValue="1" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">Hari</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aturan Reservasi</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm w-32">Max reservasi:</span>
                <input type="number" defaultValue="3" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">Buku</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm w-32">Hold duration:</span>
                <input type="number" defaultValue="3" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">Hari</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm w-32">Auto cancel:</span>
                <input type="number" defaultValue="7" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">Hari</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aturan Perpanjangan</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm w-32">Max perpanjangan:</span>
                <input type="number" defaultValue="2" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">Kali</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm w-32">Biaya perpanjangan:</span>
                <input type="number" defaultValue="2000" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">Rupiah</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aturan Akses Digital</label>
            <div className="space-y-2">
              {[
                'Download E-Book',
                'Print Digital Content',
                'Share Content',
                'Offline Access',
                'Multiple Device Login',
                'External Database Access'
              ].map((rule) => (
                <label key={rule} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{rule}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Aturan Khusus</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Aturan khusus atau pengecualian yang berlaku di perpustakaan"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FileText className="w-4 h-4 mr-2 inline" />
            Simpan Kebijakan
          </button>
        </div>
      </div>
    </div>
  );

  const renderBackupRestore = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Archive className="w-5 h-5 mr-2 text-blue-600" />
          Backup & Restore Data
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Backup *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Full Backup (Semua Data)</option>
              <option>Incremental Backup</option>
              <option>Differential Backup</option>
              <option>Database Only</option>
              <option>Files Only</option>
              <option>Configuration Only</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frekuensi Backup Otomatis</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Harian (Recommended)</option>
              <option>Mingguan</option>
              <option>Bulanan</option>
              <option>Manual Only</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Backup Otomatis</label>
            <input
              type="time"
              defaultValue="02:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Penyimpanan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Local Server</option>
              <option>Cloud Storage (Google Drive)</option>
              <option>Cloud Storage (Dropbox)</option>
              <option>External Drive</option>
              <option>Network Storage (NAS)</option>
              <option>Multiple Locations</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Retention Policy</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Keep 7 Days</option>
              <option>Keep 30 Days</option>
              <option>Keep 90 Days</option>
              <option>Keep 1 Year</option>
              <option>Keep Forever</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compression Level</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>No Compression</option>
              <option>Low (Fast)</option>
              <option>Medium (Balanced)</option>
              <option>High (Small Size)</option>
              <option>Maximum (Slowest)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Encryption</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>No Encryption</option>
              <option>AES-128</option>
              <option>AES-256 (Recommended)</option>
              <option>Custom Key</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notification Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="admin@sekolah.sch.id"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Data yang Di-backup</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Database Utama',
                'File Digital/E-Book',
                'Foto Pengguna',
                'Log Sistem',
                'Konfigurasi',
                'Template Laporan',
                'Backup History',
                'User Preferences'
              ].map((data) => (
                <label key={data} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{data}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Archive className="w-4 h-4 mr-2 inline" />
            Backup Sekarang
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Upload className="w-4 h-4 mr-2 inline" />
            Restore Data
          </button>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4 mr-2 inline" />
            Download Backup
          </button>
        </div>
      </div>
    </div>
  );

  const renderUserPermissions = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
          Manajemen Izin Pengguna
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role/Peran *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Super Admin</option>
              <option>Admin</option>
              <option>Pustakawan Senior</option>
              <option>Pustakawan</option>
              <option>Staff Sirkulasi</option>
              <option>Staff Input Data</option>
              <option>Read Only User</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Role</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama custom untuk role ini"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Akses Modul - Manajemen Koleksi</label>
            <div className="space-y-2">
              {[
                'Kataloging (Create/Edit)',
                'Daftar Buku (View/Edit)',
                'Inventarisasi (Full Access)',
                'Pengadaan (Full Access)',
                'Perawatan (Full Access)',
                'Digitalisasi (Full Access)'
              ].map((permission) => (
                <label key={permission} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{permission}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Akses Modul - Sirkulasi</label>
            <div className="space-y-2">
              {[
                'Peminjaman (Process)',
                'Pengembalian (Process)',
                'Perpanjangan (Approve)',
                'Reservasi (Manage)',
                'Denda (Collect)',
                'Keterlambatan (Manage)'
              ].map((permission) => (
                <label key={permission} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{permission}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Akses Modul - Pengguna</label>
            <div className="space-y-2">
              {[
                'Registrasi User (Create)',
                'Edit Profil (Update)',
                'Hapus User (Delete)',
                'Reset Password',
                'Manage Membership',
                'View User Statistics'
              ].map((permission) => (
                <label key={permission} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{permission}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Akses Laporan</label>
            <div className="space-y-2">
              {[
                'View All Reports',
                'Generate Reports',
                'Export Reports',
                'Schedule Reports',
                'Financial Reports',
                'Statistical Analysis'
              ].map((permission) => (
                <label key={permission} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{permission}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Akses Pengaturan</label>
            <div className="space-y-2">
              {[
                'System Settings',
                'Library Policies',
                'Backup/Restore',
                'User Permissions',
                'Security Settings',
                'Integration Settings'
              ].map((permission) => (
                <label key={permission} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{permission}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batasan Waktu Akses</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="time" defaultValue="07:00" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm">sampai</span>
                <input type="time" defaultValue="17:00" className="px-2 py-1 border border-gray-300 rounded" />
              </div>
              <div className="space-y-1">
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input type="checkbox" className="text-blue-600" defaultChecked={day !== 'Minggu'} />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Role</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi tanggung jawab dan wewenang role ini"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserCheck className="w-4 h-4 mr-2 inline" />
            Simpan Izin
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Copy className="w-4 h-4 mr-2 inline" />
            Duplikasi Role
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
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pengaturan</h2>
            <p className="text-sm text-gray-600">Kelola konfigurasi sistem dan kebijakan perpustakaan</p>
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
        {activeTab === 'system-settings' && renderSystemSettings()}
        {activeTab === 'library-policies' && renderLibraryPolicies()}
        {activeTab === 'backup-restore' && renderBackupRestore()}
        {activeTab === 'user-permissions' && renderUserPermissions()}
      </div>
    </div>
  );
}

export default SettingsForm;