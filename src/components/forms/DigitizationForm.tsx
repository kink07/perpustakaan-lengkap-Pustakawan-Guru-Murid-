import React, { useState } from 'react';
import { 
  Camera, 
  Calendar, 
  Star, 
  FileText, 
  Archive, 
  Monitor, 
  CheckCircle,
  Save,
  Upload,
  Download,
  Settings,
  Image,
  Film,
  Mic,
  Video,
  Scan,
  Zap,
  Shield,
  Clock,
  Target,
  Database,
  Cloud,
  HardDrive,
  Wifi
} from 'lucide-react';

function DigitizationForm() {
  const [activeTab, setActiveTab] = useState('digitization-planning');
  const [digitizationData, setDigitizationData] = useState({
    projectName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    priority: 'normal',
    budget: '',
    responsible: '',
    notes: ''
  });

  const tabs = [
    { id: 'digitization-planning', label: 'Perencanaan Digitalisasi', icon: <Calendar className="w-4 h-4" /> },
    { id: 'scanning-imaging', label: 'Scanning & Imaging', icon: <Camera className="w-4 h-4" /> },
    { id: 'quality-standards', label: 'Standar Kualitas', icon: <Star className="w-4 h-4" /> },
    { id: 'ocr-processing', label: 'Pemrosesan OCR', icon: <FileText className="w-4 h-4" /> },
    { id: 'digital-preservation', label: 'Preservasi Digital', icon: <Archive className="w-4 h-4" /> },
    { id: 'access-delivery', label: 'Akses & Penyampaian', icon: <Monitor className="w-4 h-4" /> },
    { id: 'rights-permissions', label: 'Hak Cipta & Hak', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  const renderDigitizationPlanning = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Perencanaan Proyek Digitalisasi</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Proyek *</label>
            <input
              type="text"
              value={digitizationData.projectName}
              onChange={(e) => setDigitizationData(prev => ({...prev, projectName: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Digitalisasi Koleksi Sejarah"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Koleksi *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Buku Langka</option>
              <option>Manuskrip</option>
              <option>Foto Sejarah</option>
              <option>Dokumen Arsip</option>
              <option>Peta</option>
              <option>Terbitan Berkala</option>
              <option>Koleksi Umum</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai *</label>
            <input
              type="date"
              value={digitizationData.startDate}
              onChange={(e) => setDigitizationData(prev => ({...prev, startDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Selesai</label>
            <input
              type="date"
              value={digitizationData.endDate}
              onChange={(e) => setDigitizationData(prev => ({...prev, endDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Item</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioritas</label>
            <select
              value={digitizationData.priority}
              onChange={(e) => setDigitizationData(prev => ({...prev, priority: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Anggaran</label>
            <input
              type="number"
              value={digitizationData.budget}
              onChange={(e) => setDigitizationData(prev => ({...prev, budget: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Penanggung Jawab</label>
            <input
              type="text"
              value={digitizationData.responsible}
              onChange={(e) => setDigitizationData(prev => ({...prev, responsible: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama penanggung jawab"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tujuan Digitalisasi</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Jelaskan tujuan dan manfaat digitalisasi ini"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Calendar className="w-4 h-4 mr-2 inline" />
            Buat Proyek
          </button>
        </div>
      </div>
    </div>
  );

  const renderScanningImaging = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Scanning & Imaging</h4>
        
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Scanning *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Flatbed Scanner</option>
              <option>Book Scanner</option>
              <option>Overhead Scanner</option>
              <option>Microfilm Scanner</option>
              <option>Large Format Scanner</option>
              <option>Mobile Scanner</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resolusi (DPI) *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>300 DPI (Normal)</option>
              <option>400 DPI (High)</option>
              <option>600 DPI (Archive)</option>
              <option>800 DPI (Master)</option>
              <option>1200 DPI (Ultra High)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format Output *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>PDF/A</option>
              <option>TIFF (Uncompressed)</option>
              <option>JPEG 2000</option>
              <option>PNG</option>
              <option>PDF (Standard)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Mode</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Color (24-bit)</option>
              <option>Grayscale (8-bit)</option>
              <option>Black & White (1-bit)</option>
              <option>Auto Detect</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operator</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama operator scanning"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Scanning</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Halaman</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Scanning</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan khusus untuk proses scanning"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Camera className="w-4 h-4 mr-2 inline" />
            Mulai Scanning
          </button>
        </div>
      </div>
    </div>
  );

  const renderQualityStandards = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Standar Kualitas Digital</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File ID *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ID file digital"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Konten *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Teks</option>
              <option>Gambar</option>
              <option>Foto</option>
              <option>Peta</option>
              <option>Diagram</option>
              <option>Mixed Content</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resolusi Aktual (DPI)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran File (MB)</label>
            <input
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kualitas Visual</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Excellent</option>
              <option>Good</option>
              <option>Acceptable</option>
              <option>Poor</option>
              <option>Unacceptable</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Readability Score</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>5 - Perfect</option>
              <option>4 - Excellent</option>
              <option>3 - Good</option>
              <option>2 - Fair</option>
              <option>1 - Poor</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Accuracy</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Accurate</option>
              <option>Slightly Off</option>
              <option>Noticeably Off</option>
              <option>Poor</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Completeness</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Complete</option>
              <option>Missing Pages</option>
              <option>Partial Content</option>
              <option>Incomplete</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Kualitas</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan detail tentang kualitas hasil digitalisasi"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Star className="w-4 h-4 mr-2 inline" />
            Approve Kualitas
          </button>
        </div>
      </div>
    </div>
  );

  const renderOCRProcessing = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Pemrosesan OCR</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File Input *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Path file gambar"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Engine OCR *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Tesseract</option>
              <option>ABBYY FineReader</option>
              <option>Adobe Acrobat</option>
              <option>Google Cloud Vision</option>
              <option>Amazon Textract</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa Dokumen *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Indonesia</option>
              <option>English</option>
              <option>Jawa</option>
              <option>Sunda</option>
              <option>Arab</option>
              <option>Multi-language</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Akurasi Target (%)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="95"
              min="50"
              max="100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format Output</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Searchable PDF</option>
              <option>Plain Text</option>
              <option>Microsoft Word</option>
              <option>HTML</option>
              <option>XML</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Post-Processing</label>
            <div className="space-y-2">
              {['Spell Check', 'Grammar Check', 'Format Correction', 'Table Recognition', 'Image Extraction'].map((process) => (
                <label key={process} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{process}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality Check</label>
            <div className="space-y-2">
              {['Manual Review', 'Automated Validation', 'Accuracy Test', 'Completeness Check'].map((check) => (
                <label key={check} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{check}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan OCR</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan khusus untuk proses OCR"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <FileText className="w-4 h-4 mr-2 inline" />
            Proses OCR
          </button>
        </div>
      </div>
    </div>
  );

  const renderDigitalPreservation = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Preservasi Digital</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Digital Object ID *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="DOI atau identifier unik"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Strategi Preservasi *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Migration</option>
              <option>Emulation</option>
              <option>Encapsulation</option>
              <option>Replication</option>
              <option>Refreshing</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Storage Location *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Local Server</option>
              <option>Cloud Storage</option>
              <option>External Drive</option>
              <option>Tape Storage</option>
              <option>Distributed Storage</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Backup Copies</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="3"
              min="1"
              max="10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Checksum Algorithm</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>MD5</option>
              <option>SHA-1</option>
              <option>SHA-256</option>
              <option>SHA-512</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>5 Tahun</option>
              <option>10 Tahun</option>
              <option>25 Tahun</option>
              <option>50 Tahun</option>
              <option>Permanent</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Public</option>
              <option>Restricted</option>
              <option>Staff Only</option>
              <option>Embargoed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Migration Schedule</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Metadata Schema</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Dublin Core</option>
              <option>MODS</option>
              <option>PREMIS</option>
              <option>EAD</option>
              <option>Custom Schema</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Preservation Notes</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan preservasi dan rencana migrasi"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Archive className="w-4 h-4 mr-2 inline" />
            Simpan Preservasi
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccessDelivery = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Akses & Penyampaian</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform Akses *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Web Portal</option>
              <option>Mobile App</option>
              <option>API Access</option>
              <option>OPAC Integration</option>
              <option>Third-party Platform</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Method *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Direct Download</option>
              <option>Streaming</option>
              <option>Online Viewer</option>
              <option>Embedded Player</option>
              <option>API Endpoint</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Authentication</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Required</option>
              <option>Optional</option>
              <option>Guest Access</option>
              <option>IP Restriction</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Download Limit</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0 (unlimited)"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Watermark</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>None</option>
              <option>Text Watermark</option>
              <option>Logo Watermark</option>
              <option>Digital Signature</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">DRM Protection</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>None</option>
              <option>Basic Protection</option>
              <option>Advanced DRM</option>
              <option>Custom Protection</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Access URL</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://library.school.edu/digital/..."
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Usage Instructions</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Instruksi penggunaan untuk pengguna"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Monitor className="w-4 h-4 mr-2 inline" />
            Publikasikan
          </button>
        </div>
      </div>
    </div>
  );

  const renderRightsPermissions = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Hak Cipta & Izin</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item ID *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ID item yang akan didigitalisasi"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Hak Cipta *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Public Domain</option>
              <option>Copyright Protected</option>
              <option>Creative Commons</option>
              <option>Fair Use</option>
              <option>Unknown</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pemegang Hak Cipta</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama pemegang hak cipta"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Hak Cipta</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="2024"
              min="1900"
              max="2030"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Izin Digitalisasi</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Granted</option>
              <option>Pending</option>
              <option>Denied</option>
              <option>Not Required</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lisensi Penggunaan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Educational Use Only</option>
              <option>Research Use Only</option>
              <option>Limited Access</option>
              <option>Full Access</option>
              <option>Commercial Use</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kontak Pemegang Hak</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="email@publisher.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Izin</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Syarat & Ketentuan</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Syarat dan ketentuan penggunaan dari pemegang hak cipta"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Dokumen Izin</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload surat izin atau kontrak</p>
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <CheckCircle className="w-4 h-4 mr-2 inline" />
            Simpan Izin
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
            <Camera className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Digitalisasi Koleksi</h2>
            <p className="text-sm text-gray-600">Kelola proses digitalisasi dan preservasi digital</p>
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
        {activeTab === 'digitization-planning' && renderDigitizationPlanning()}
        {activeTab === 'scanning-imaging' && renderScanningImaging()}
        {activeTab === 'quality-standards' && renderQualityStandards()}
        {activeTab === 'ocr-processing' && renderOCRProcessing()}
        {activeTab === 'digital-preservation' && renderDigitalPreservation()}
        {activeTab === 'access-delivery' && renderAccessDelivery()}
        {activeTab === 'rights-permissions' && renderRightsPermissions()}
      </div>
    </div>
  );
}

export default DigitizationForm;