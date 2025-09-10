import React, { useState } from 'react';
import { 
  Wrench, 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  Settings, 
  Eye,
  Save,
  Upload,
  Download,
  Calendar,
  User,
  FileText,
  Shield,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Zap,
  Bug,
  Scissors,
  Paintbrush,
  Archive,
  Clock,
  Target,
  Activity
} from 'lucide-react';

function MaintenanceForm() {
  const [activeTab, setActiveTab] = useState('preventive-care');
  const [maintenanceData, setMaintenanceData] = useState({
    itemBarcode: '',
    maintenanceDate: new Date().toISOString().split('T')[0],
    technician: '',
    maintenanceType: '',
    urgency: 'normal',
    estimatedCost: '',
    notes: ''
  });

  const tabs = [
    { id: 'preventive-care', label: 'Perawatan Preventif', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'conservation-treatment', label: 'Perawatan Konservasi', icon: <Wrench className="w-4 h-4" /> },
    { id: 'disaster-response', label: 'Respons Bencana', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'microfilm-preservation', label: 'Mikrofilm Preservasi', icon: <Camera className="w-4 h-4" /> },
    { id: 'equipment-maintenance', label: 'Perawatan Peralatan', icon: <Settings className="w-4 h-4" /> },
    { id: 'condition-surveys', label: 'Survei Kondisi', icon: <Eye className="w-4 h-4" /> }
  ];

  const renderPreventiveCare = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Jadwal Perawatan Preventif</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Area/Lokasi *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Seluruh Perpustakaan</option>
              <option>Lantai 1</option>
              <option>Lantai 2</option>
              <option>Ruang Referensi</option>
              <option>Ruang Koleksi Khusus</option>
              <option>Ruang Baca</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Perawatan *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Pembersihan Rutin</option>
              <option>Kontrol Kelembaban</option>
              <option>Kontrol Suhu</option>
              <option>Pest Control</option>
              <option>Pembersihan Rak</option>
              <option>Perawatan Buku</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Perawatan *</label>
            <input
              type="date"
              value={maintenanceData.maintenanceDate}
              onChange={(e) => setMaintenanceData(prev => ({...prev, maintenanceDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Penanggung Jawab</label>
            <input
              type="text"
              value={maintenanceData.technician}
              onChange={(e) => setMaintenanceData(prev => ({...prev, technician: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama petugas"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frekuensi</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Harian</option>
              <option>Mingguan</option>
              <option>Bulanan</option>
              <option>Triwulanan</option>
              <option>Semesteran</option>
              <option>Tahunan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Dijadwalkan</option>
              <option>Sedang Berlangsung</option>
              <option>Selesai</option>
              <option>Ditunda</option>
              <option>Dibatalkan</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Checklist Perawatan</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Pembersihan debu pada buku',
                'Pengecekan kelembaban ruangan',
                'Kontrol suhu ruangan',
                'Inspeksi hama dan serangga',
                'Pembersihan rak dan lemari',
                'Pengecekan sistem ventilasi',
                'Kontrol pencahayaan',
                'Inspeksi kebocoran air'
              ].map((item) => (
                <label key={item} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Perawatan</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Detail kegiatan perawatan yang dilakukan"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <CheckCircle className="w-4 h-4 mr-2 inline" />
            Simpan Perawatan
          </button>
        </div>
      </div>
    </div>
  );

  const renderConservationTreatment = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Perawatan Konservasi</h4>
        
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kerusakan *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Halaman Robek</option>
              <option>Sampul Rusak</option>
              <option>Binding Lepas</option>
              <option>Noda/Kotor</option>
              <option>Kertas Rapuh</option>
              <option>Tinta Pudar</option>
              <option>Serangan Serangga</option>
              <option>Jamur/Kelembaban</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Kerusakan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Ringan</option>
              <option>Sedang</option>
              <option>Berat</option>
              <option>Sangat Berat</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Perawatan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Pembersihan Kering</option>
              <option>Pembersihan Basah</option>
              <option>Perbaikan Binding</option>
              <option>Laminasi</option>
              <option>Deacidification</option>
              <option>Fumigasi</option>
              <option>Digitalisasi Darurat</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Biaya</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Waktu (hari)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="1"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Kerusakan</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi detail kerusakan yang ditemukan"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rencana Perawatan</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Langkah-langkah perawatan yang akan dilakukan"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <Wrench className="w-4 h-4 mr-2 inline" />
            Mulai Perawatan
          </button>
        </div>
      </div>
    </div>
  );

  const renderDisasterResponse = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Respons Bencana
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Bencana *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Kebanjiran</option>
              <option>Kebakaran</option>
              <option>Gempa Bumi</option>
              <option>Kebocoran Pipa</option>
              <option>Kerusakan AC</option>
              <option>Serangan Hama</option>
              <option>Vandalisme</option>
              <option>Lainnya</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kejadian *</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Area Terdampak</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Lantai 1, Rak A-C"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Kerusakan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Ringan</option>
              <option>Sedang</option>
              <option>Berat</option>
              <option>Total</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Item Terdampak</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
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
              placeholder="Deskripsi detail kejadian dan kerusakan yang terjadi"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tindakan Darurat yang Diambil</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Langkah-langkah darurat yang sudah dilakukan"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <AlertCircle className="w-4 h-4 mr-2 inline" />
            Laporkan Bencana
          </button>
        </div>
      </div>
    </div>
  );

  const renderMicrofilmPreservation = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Mikrofilm Preservasi</h4>
        
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Media *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Mikrofilm 16mm</option>
              <option>Mikrofilm 35mm</option>
              <option>Mikrofiche</option>
              <option>Aperture Card</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mikrofilming</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operator</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama operator"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kualitas Gambar</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Poor</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reduction Ratio</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="24:1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Frame</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Penyimpanan</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ruang Mikrofilm, Kabinet A"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Teknis</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan teknis proses mikrofilming"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Camera className="w-4 h-4 mr-2 inline" />
            Simpan Record Mikrofilm
          </button>
        </div>
      </div>
    </div>
  );

  const renderEquipmentMaintenance = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Perawatan Peralatan</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Peralatan *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Komputer/Laptop</option>
              <option>Printer</option>
              <option>Scanner</option>
              <option>Proyektor</option>
              <option>AC/Pendingin</option>
              <option>CCTV</option>
              <option>Sistem Keamanan</option>
              <option>Peralatan Audio</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode/Serial Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Serial number peralatan"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Perawatan</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teknisi</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama teknisi"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Perawatan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Perawatan Rutin</option>
              <option>Perbaikan</option>
              <option>Upgrade</option>
              <option>Kalibrasi</option>
              <option>Pembersihan</option>
              <option>Penggantian Parts</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Peralatan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Normal</option>
              <option>Perlu Perhatian</option>
              <option>Rusak Ringan</option>
              <option>Rusak Berat</option>
              <option>Tidak Berfungsi</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kegiatan Perawatan</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Detail kegiatan perawatan yang dilakukan"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Settings className="w-4 h-4 mr-2 inline" />
            Simpan Perawatan
          </button>
        </div>
      </div>
    </div>
  );

  const renderConditionSurveys = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Survei Kondisi Koleksi</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Survei *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Survei Kondisi Q1 2024"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Survei *</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Surveyor</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama surveyor"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Sampling</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Random Sampling</option>
              <option>Systematic Sampling</option>
              <option>Stratified Sampling</option>
              <option>Complete Survey</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran Sample (%)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="10"
              min="1"
              max="100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Area Survei</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Seluruh Koleksi</option>
              <option>Koleksi Umum</option>
              <option>Koleksi Referensi</option>
              <option>Koleksi Khusus</option>
              <option>Terbitan Berkala</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tujuan Survei</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tujuan dan ruang lingkup survei kondisi"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Eye className="w-4 h-4 mr-2 inline" />
            Mulai Survei
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
            <Wrench className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Perawatan & Perbaikan</h2>
            <p className="text-sm text-gray-600">Kelola perawatan dan konservasi koleksi perpustakaan</p>
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
        {activeTab === 'preventive-care' && renderPreventiveCare()}
        {activeTab === 'conservation-treatment' && renderConservationTreatment()}
        {activeTab === 'disaster-response' && renderDisasterResponse()}
        {activeTab === 'microfilm-preservation' && renderMicrofilmPreservation()}
        {activeTab === 'equipment-maintenance' && renderEquipmentMaintenance()}
        {activeTab === 'condition-surveys' && renderConditionSurveys()}
      </div>
    </div>
  );
}

export default MaintenanceForm;