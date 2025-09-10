import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  BarChart3, 
  FileText,
  Save,
  RefreshCw,
  Download,
  Upload,
  Scan,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Archive,
  Clock,
  User,
  Tag
} from 'lucide-react';

interface InventoryItem {
  id: string;
  barcode: string;
  title: string;
  author: string;
  callNumber: string;
  location: string;
  condition: string;
  status: string;
  lastChecked: string;
  checkedBy: string;
  notes: string;
}

function InventoryForm() {
  const [activeTab, setActiveTab] = useState('physical-inventory');
  const [inventoryData, setInventoryData] = useState({
    inventoryDate: new Date().toISOString().split('T')[0],
    inventoryType: 'full',
    location: '',
    responsible: '',
    notes: ''
  });
  const [scannedItems, setScannedItems] = useState<InventoryItem[]>([]);
  const [currentBarcode, setCurrentBarcode] = useState('');

  const tabs = [
    { id: 'physical-inventory', label: 'Inventarisasi Fisik', icon: <Archive className="w-4 h-4" /> },
    { id: 'collection-statistics', label: 'Statistik Koleksi', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'location-management', label: 'Manajemen Lokasi', icon: <MapPin className="w-4 h-4" /> },
    { id: 'condition-assessment', label: 'Penilaian Kondisi', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'missing-items', label: 'Item Hilang', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'inventory-reports', label: 'Laporan Inventarisasi', icon: <FileText className="w-4 h-4" /> }
  ];

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentBarcode.trim()) {
      // Simulate finding item by barcode
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        barcode: currentBarcode,
        title: `Buku dengan barcode ${currentBarcode}`,
        author: 'Pengarang Contoh',
        callNumber: '000.00 ABC a',
        location: 'Rak A-1',
        condition: 'Baik',
        status: 'Tersedia',
        lastChecked: new Date().toISOString().split('T')[0],
        checkedBy: 'Pustakawan',
        notes: ''
      };
      setScannedItems([...scannedItems, newItem]);
      setCurrentBarcode('');
    }
  };

  const renderPhysicalInventory = () => (
    <div className="space-y-6">
      {/* Inventory Setup */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2 text-blue-600" />
          Setup Inventarisasi Fisik
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Inventarisasi *
            </label>
            <input
              type="date"
              value={inventoryData.inventoryDate}
              onChange={(e) => setInventoryData(prev => ({...prev, inventoryDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Inventarisasi *
            </label>
            <select
              value={inventoryData.inventoryType}
              onChange={(e) => setInventoryData(prev => ({...prev, inventoryType: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="full">Inventarisasi Penuh</option>
              <option value="partial">Inventarisasi Sebagian</option>
              <option value="spot-check">Spot Check</option>
              <option value="annual">Inventarisasi Tahunan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi/Area
            </label>
            <input
              type="text"
              value={inventoryData.location}
              onChange={(e) => setInventoryData(prev => ({...prev, location: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Lantai 1, Rak A-C"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Penanggung Jawab *
            </label>
            <input
              type="text"
              value={inventoryData.responsible}
              onChange={(e) => setInventoryData(prev => ({...prev, responsible: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama pustakawan"
              required
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catatan Inventarisasi
          </label>
          <textarea
            value={inventoryData.notes}
            onChange={(e) => setInventoryData(prev => ({...prev, notes: e.target.value}))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Catatan khusus untuk inventarisasi ini"
          />
        </div>
      </div>

      {/* Barcode Scanner */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Scan className="w-5 h-5 mr-2 text-blue-600" />
          Scanner Barcode
        </h4>
        
        <form onSubmit={handleBarcodeSubmit} className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={currentBarcode}
              onChange={(e) => setCurrentBarcode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-mono"
              placeholder="Scan atau ketik barcode..."
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah</span>
          </button>
        </form>
      </div>

      {/* Scanned Items */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Item yang Telah Discan ({scannedItems.length})
            </h4>
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <Download className="w-4 h-4 mr-2 inline" />
                Export
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Save className="w-4 h-4 mr-2 inline" />
                Simpan Inventarisasi
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barcode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Panggil</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kondisi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scannedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-blue-600">{item.barcode}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.title}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.callNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.location}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCollectionStatistics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Koleksi</p>
              <p className="text-2xl font-bold text-blue-900">15,847</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Tersedia</p>
              <p className="text-2xl font-bold text-green-900">12,456</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Dipinjam</p>
              <p className="text-2xl font-bold text-orange-900">2,891</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Hilang/Rusak</p>
              <p className="text-2xl font-bold text-red-900">500</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Detailed Statistics Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Filter Statistik</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Bulan Ini</option>
              <option>3 Bulan Terakhir</option>
              <option>6 Bulan Terakhir</option>
              <option>1 Tahun Terakhir</option>
              <option>Custom</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Semua Lokasi</option>
              <option>Lantai 1</option>
              <option>Lantai 2</option>
              <option>Ruang Referensi</option>
              <option>Ruang Koleksi Khusus</option>
            </select>
          </div>
        </div>
        
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <BarChart3 className="w-4 h-4 mr-2 inline" />
          Generate Laporan
        </button>
      </div>
    </div>
  );

  const renderLocationManagement = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Tambah Lokasi Baru</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Lokasi *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="A-1, B-2, dll."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lokasi *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Rak Buku Umum"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lantai</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Lantai 1</option>
              <option>Lantai 2</option>
              <option>Lantai 3</option>
              <option>Basement</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Jumlah maksimal buku"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi lokasi dan jenis koleksi yang disimpan"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Save className="w-4 h-4 mr-2 inline" />
            Simpan Lokasi
          </button>
        </div>
      </div>
    </div>
  );

  const renderConditionAssessment = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Penilaian Kondisi Koleksi</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Item *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan atau ketik barcode"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Penilaian *</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kondisi Fisik *</label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {['Sangat Baik', 'Baik', 'Cukup', 'Rusak Ringan', 'Rusak Berat'].map((condition) => (
                <label key={condition} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="radio" name="condition" value={condition} className="text-blue-600" />
                  <span className="text-sm">{condition}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kerusakan yang Ditemukan</label>
              <div className="space-y-2">
                {['Halaman Robek', 'Sampul Rusak', 'Tulisan Hilang', 'Noda/Kotor', 'Halaman Lepas', 'Lainnya'].map((damage) => (
                  <label key={damage} className="flex items-center space-x-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm">{damage}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tindakan yang Diperlukan</label>
              <div className="space-y-2">
                {['Perbaikan Ringan', 'Perbaikan Berat', 'Penggantian', 'Digitalisasi Darurat', 'Pemusnahan', 'Tidak Ada'].map((action) => (
                  <label key={action} className="flex items-center space-x-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm">{action}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Detail</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi detail kondisi dan kerusakan yang ditemukan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Kondisi</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload foto kondisi buku</p>
              <input type="file" multiple accept="image/*" className="hidden" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4 mr-2 inline" />
            Simpan Penilaian
          </button>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );

  const renderMissingItems = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Laporan Item Hilang
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Item *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan atau ketik barcode"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Hilang *</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Terakhir Diketahui</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Rak A-1, Lantai 1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pelapor</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama pelapor"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Kejadian</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Jelaskan bagaimana item tersebut hilang atau kapan terakhir kali dilihat"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <AlertCircle className="w-4 h-4 mr-2 inline" />
            Laporkan Item Hilang
          </button>
        </div>
      </div>
    </div>
  );

  const renderInventoryReports = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Generate Laporan Inventarisasi</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Laporan *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Laporan Inventarisasi Lengkap</option>
              <option>Laporan Item Hilang</option>
              <option>Laporan Kondisi Koleksi</option>
              <option>Laporan Statistik Lokasi</option>
              <option>Laporan Perbandingan Periode</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format Output *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>PDF</option>
              <option>Excel (XLSX)</option>
              <option>CSV</option>
              <option>Word (DOCX)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Periode Dari</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Periode Sampai</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2 inline" />
            Generate & Download
          </button>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4 mr-2 inline" />
            Preview
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Inventarisasi</h2>
              <p className="text-sm text-gray-600">Kelola inventarisasi dan kondisi koleksi perpustakaan</p>
            </div>
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
        {activeTab === 'physical-inventory' && renderPhysicalInventory()}
        {activeTab === 'collection-statistics' && renderCollectionStatistics()}
        {activeTab === 'location-management' && renderLocationManagement()}
        {activeTab === 'condition-assessment' && renderConditionAssessment()}
        {activeTab === 'missing-items' && renderMissingItems()}
        {activeTab === 'inventory-reports' && renderInventoryReports()}
      </div>
    </div>
  );
}

export default InventoryForm;