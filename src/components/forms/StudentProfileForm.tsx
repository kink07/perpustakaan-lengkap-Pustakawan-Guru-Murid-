import React, { useState } from 'react';
import { 
  User, 
  Edit, 
  Save, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  Book,
  Star,
  Target,
  Award,
  TrendingUp,
  Clock,
  Eye,
  EyeOff,
  Upload,
  Download,
  Settings,
  Bell,
  Shield,
  Key,
  Smartphone,
  Globe,
  Heart,
  Bookmark
} from 'lucide-react';
import { databaseService } from '../../services/database';

function StudentProfileForm() {
  const [activeTab, setActiveTab] = useState('personal-info');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Ahmad Rizki Pratama',
    studentId: '2024001',
    class: 'XII IPA 1',
    email: 'ahmad.rizki@student.sman1jakarta.sch.id',
    phone: '081234567890',
    address: 'Jl. Pendidikan No. 123, Jakarta Selatan',
    birthDate: '2006-05-15',
    gender: 'male',
    emergencyContact: 'Budi Pratama (Ayah)',
    emergencyPhone: '081234567891',
    hobbies: ['Membaca', 'Olahraga', 'Musik'],
    favoriteSubjects: ['Matematika', 'Fisika', 'Bahasa Inggris'],
    readingGoal: 20,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'personal-info', label: 'Informasi Pribadi', icon: <User className="w-4 h-4" /> },
    { id: 'academic-info', label: 'Informasi Akademik', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'reading-preferences', label: 'Preferensi Bacaan', icon: <Book className="w-4 h-4" /> },
    { id: 'achievements', label: 'Pencapaian', icon: <Award className="w-4 h-4" /> },
    { id: 'account-settings', label: 'Pengaturan Akun', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Update user data in the database
      const updatedUser = await databaseService.updateUser('current-user-id', {
        name: profileData.fullName,
        phone: profileData.phone,
        address: profileData.address,
        // Add other fields as needed
      });
      
      alert('Profil berhasil diperbarui!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Terjadi kesalahan saat memperbarui profil.');
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Informasi Pribadi</h4>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2 inline" />
            {isEditing ? 'Batal Edit' : 'Edit Profil'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex items-center space-x-6">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{profileData.fullName}</h3>
              <p className="text-gray-600">{profileData.class} • NIS: {profileData.studentId}</p>
              <p className="text-sm text-gray-500">Anggota sejak September 2023</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              readOnly={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NIS</label>
            <input
              type="text"
              value={profileData.studentId}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              readOnly={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              readOnly={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
            <input
              type="date"
              value={profileData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              readOnly={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
            <select
              value={profileData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={!isEditing}
            >
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
            <textarea
              value={profileData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              readOnly={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kontak Darurat</label>
            <input
              type="text"
              value={profileData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              readOnly={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telepon Darurat</label>
            <input
              type="tel"
              value={profileData.emergencyPhone}
              onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              readOnly={!isEditing}
            />
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2 inline" />
              Simpan Perubahan
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAcademicInfo = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Informasi Akademik</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
            <input
              type="text"
              value={profileData.class}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Ajaran</label>
            <input
              type="text"
              value="2023/2024"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wali Kelas</label>
            <input
              type="text"
              value="Dra. Siti Aminah, M.Pd"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jurusan</label>
            <input
              type="text"
              value="IPA (Ilmu Pengetahuan Alam)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mata Pelajaran Favorit</label>
            <div className="flex flex-wrap gap-2">
              {profileData.favoriteSubjects.map((subject, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReadingPreferences = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Preferensi & Target Bacaan</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Buku per Tahun</label>
            <input
              type="number"
              value={profileData.readingGoal}
              onChange={(e) => handleInputChange('readingGoal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre Favorit</label>
            <div className="space-y-2">
              {['Fiksi', 'Non-Fiksi', 'Sains', 'Sejarah', 'Biografi', 'Teknologi'].map((genre) => (
                <label key={genre} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{genre}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format Bacaan Favorit</label>
            <div className="space-y-2">
              {['Buku Fisik', 'E-Book', 'Audio Book', 'Video Pembelajaran'].map((format) => (
                <label key={format} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{format}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Baca Favorit</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Pagi (06:00 - 10:00)</option>
              <option>Siang (10:00 - 14:00)</option>
              <option>Sore (14:00 - 18:00)</option>
              <option>Malam (18:00 - 22:00)</option>
              <option>Fleksibel</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Hobi & Minat</label>
            <div className="flex flex-wrap gap-2">
              {profileData.hobbies.map((hobby, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Simpan Preferensi
          </button>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Award className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h4 className="font-bold text-yellow-900 mb-2">Pembaca Aktif</h4>
          <p className="text-sm text-yellow-700">Membaca 15+ buku tahun ini</p>
          <div className="mt-3 text-xs text-yellow-600">Diraih: 15 Jan 2024</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h4 className="font-bold text-blue-900 mb-2">Reviewer Handal</h4>
          <p className="text-sm text-blue-700">Menulis 10+ review berkualitas</p>
          <div className="mt-3 text-xs text-blue-600">Diraih: 20 Des 2023</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h4 className="font-bold text-green-900 mb-2">Target Achiever</h4>
          <p className="text-sm text-green-700">Mencapai target bacaan tahunan</p>
          <div className="mt-3 text-xs text-green-600">Progress: 75%</div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistik Bacaan</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
            <div className="text-sm text-gray-600">Buku Selesai</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">127</div>
            <div className="text-sm text-gray-600">Jam Membaca</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.2</div>
            <div className="text-sm text-gray-600">Rating Rata-rata</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">7</div>
            <div className="text-sm text-gray-600">Hari Berturut</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Keamanan Akun</h4>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Saat Ini</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={profileData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan password saat ini"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
            <input
              type="password"
              value={profileData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Minimal 8 karakter"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={profileData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ulangi password baru"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <Key className="w-4 h-4 mr-2 inline" />
            Update Password
          </button>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan Notifikasi</h4>
        
        <div className="space-y-4">
          {[
            { id: 'email_reminders', label: 'Reminder Email untuk Jatuh Tempo', checked: true },
            { id: 'sms_notifications', label: 'Notifikasi SMS', checked: false },
            { id: 'push_notifications', label: 'Push Notifications', checked: true },
            { id: 'new_books_alert', label: 'Alert Buku Baru', checked: true },
            { id: 'reservation_updates', label: 'Update Reservasi', checked: true },
            { id: 'reading_recommendations', label: 'Rekomendasi Bacaan', checked: false }
          ].map((setting) => (
            <label key={setting.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{setting.label}</span>
              <input type="checkbox" defaultChecked={setting.checked} className="text-blue-600" />
            </label>
          ))}
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Bell className="w-4 h-4 mr-2 inline" />
            Simpan Pengaturan
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
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Profil Saya</h2>
            <p className="text-sm text-gray-600">Kelola informasi pribadi dan pengaturan akun</p>
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
        {activeTab === 'personal-info' && renderPersonalInfo()}
        {activeTab === 'academic-info' && renderAcademicInfo()}
        {activeTab === 'reading-preferences' && renderReadingPreferences()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'account-settings' && renderAccountSettings()}
      </div>
    </div>
  );
}

export default StudentProfileForm;