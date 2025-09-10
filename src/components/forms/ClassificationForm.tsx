import React, { useState } from 'react';
import { 
  Folder, 
  Tag, 
  FileText, 
  Database, 
  Copy, 
  Bookmark,
  Save,
  Plus,
  Edit,
  Trash2,
  Search,
  Grid,
  List,
  Book,
  Hash,
  Link,
  Target,
  BookOpen,
  Archive
} from 'lucide-react';

function ClassificationForm() {
  const [activeTab, setActiveTab] = useState('classification-systems');
  const [newClassification, setNewClassification] = useState({
    code: '',
    label: '',
    description: '',
    parentCode: '',
    level: '1'
  });

  const tabs = [
    { id: 'classification-systems', label: 'Sistem Klasifikasi', icon: <Grid className="w-4 h-4" /> },
    { id: 'subject-indexing', label: 'Pengindeksan Subjek', icon: <Tag className="w-4 h-4" /> },
    { id: 'call-number-management', label: 'Manajemen Nomor Panggil', icon: <FileText className="w-4 h-4" /> },
    { id: 'authority-files', label: 'File Otoritas', icon: <Database className="w-4 h-4" /> },
    { id: 'cross-references', label: 'Rujukan Silang', icon: <Copy className="w-4 h-4" /> },
    { id: 'thesaurus-management', label: 'Manajemen Tesaurus', icon: <Bookmark className="w-4 h-4" /> }
  ];

  const renderClassificationSystems = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Tambah Klasifikasi Baru</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Klasifikasi *</label>
            <input
              type="text"
              value={newClassification.code}
              onChange={(e) => setNewClassification(prev => ({...prev, code: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="000.00"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Label/Nama *</label>
            <input
              type="text"
              value={newClassification.label}
              onChange={(e) => setNewClassification(prev => ({...prev, label: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama klasifikasi"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Parent</label>
            <input
              type="text"
              value={newClassification.parentCode}
              onChange={(e) => setNewClassification(prev => ({...prev, parentCode: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="000 (untuk sub-klasifikasi)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level Hierarki</label>
            <select
              value={newClassification.level}
              onChange={(e) => setNewClassification(prev => ({...prev, level: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Level 1 (Kelas Utama)</option>
              <option value="2">Level 2 (Divisi)</option>
              <option value="3">Level 3 (Seksi)</option>
              <option value="4">Level 4 (Sub-seksi)</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              value={newClassification.description}
              onChange={(e) => setNewClassification(prev => ({...prev, description: e.target.value}))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi detail klasifikasi ini"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4 mr-2 inline" />
            Simpan Klasifikasi
          </button>
        </div>
      </div>
    </div>
  );

  const renderSubjectIndexing = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Pengindeksan Subjek</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Buku *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan atau ketik barcode"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subjek Utama *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Subjek utama buku"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subjek Tambahan</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Subjek sekunder (pisahkan dengan koma)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kata Kunci</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Kata kunci untuk pencarian"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topik Geografis</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Lokasi geografis yang dibahas"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Periode Waktu</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Periode waktu yang dibahas"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Pengindeksan</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan tambahan untuk pengindeksan"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Tag className="w-4 h-4 mr-2 inline" />
            Simpan Indeks
          </button>
        </div>
      </div>
    </div>
  );

  const renderCallNumberManagement = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Manajemen Nomor Panggil</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Buku *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan atau ketik barcode"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Dewey *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="000.00"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Pengarang *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ABC"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Judul</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="a"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Terbit</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="2024"
              min="1900"
              max="2030"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Eksemplar</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="1"
              min="1"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Panggil Lengkap</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-lg"
                placeholder="000.00 ABC a"
                readOnly
              />
              <button
                type="button"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Hash className="w-4 h-4 mr-2 inline" />
                Generate
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4 mr-2 inline" />
            Simpan Nomor Panggil
          </button>
        </div>
      </div>
    </div>
  );

  const renderAuthorityFiles = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">File Otoritas</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Otoritas *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Nama Pengarang</option>
              <option>Nama Korporasi</option>
              <option>Judul Seragam</option>
              <option>Subjek Topik</option>
              <option>Nama Geografis</option>
              <option>Nama Konferensi</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bentuk Otoritas *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Bentuk yang diotorisasi"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bentuk Alternatif</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Bentuk lain yang mungkin digunakan"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sumber Otoritas</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Library of Congress</option>
              <option>Perpustakaan Nasional RI</option>
              <option>OCLC WorldCat</option>
              <option>Lokal</option>
              <option>Lainnya</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Otoritas</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan tambahan tentang otoritas ini"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Database className="w-4 h-4 mr-2 inline" />
            Simpan File Otoritas
          </button>
        </div>
      </div>
    </div>
  );

  const renderCrossReferences = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Rujukan Silang</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Rujukan *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>See (Lihat)</option>
              <option>See Also (Lihat Juga)</option>
              <option>Used For (Digunakan Untuk)</option>
              <option>Broader Term (Istilah Lebih Luas)</option>
              <option>Narrower Term (Istilah Lebih Sempit)</option>
              <option>Related Term (Istilah Terkait)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Istilah Asal *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Istilah yang dirujuk"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Istilah Tujuan *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Istilah yang menjadi rujukan"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Klasifikasi</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="000.00"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Rujukan</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Penjelasan tentang hubungan antar istilah"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Link className="w-4 h-4 mr-2 inline" />
            Simpan Rujukan
          </button>
        </div>
      </div>
    </div>
  );

  const renderThesaurusManagement = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Manajemen Tesaurus</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Istilah Preferred *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Istilah yang digunakan"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Istilah Non-Preferred</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Sinonim atau varian istilah"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Broader Term (BT)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Istilah yang lebih luas"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Narrower Term (NT)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Istilah yang lebih sempit"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Related Term (RT)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Istilah terkait"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scope Note</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan ruang lingkup"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Definisi</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Definisi lengkap istilah"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Bookmark className="w-4 h-4 mr-2 inline" />
            Simpan ke Tesaurus
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
            <Folder className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Klasifikasi & Indeks</h2>
            <p className="text-sm text-gray-600">Kelola sistem klasifikasi dan pengindeksan koleksi</p>
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
        {activeTab === 'classification-systems' && renderClassificationSystems()}
        {activeTab === 'subject-indexing' && renderSubjectIndexing()}
        {activeTab === 'call-number-management' && renderCallNumberManagement()}
        {activeTab === 'authority-files' && renderAuthorityFiles()}
        {activeTab === 'cross-references' && renderCrossReferences()}
        {activeTab === 'thesaurus-management' && renderThesaurusManagement()}
      </div>
    </div>
  );
}

export default ClassificationForm;