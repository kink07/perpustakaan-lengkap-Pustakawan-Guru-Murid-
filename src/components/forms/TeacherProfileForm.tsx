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
  Award,
  Clock,
  Eye,
  EyeOff,
  Settings,
  Bell,
  Key,
  Shield,
  FileText,
  Users,
  BarChart3,
  Target,
  TrendingUp,
  Star,
  CheckCircle
} from 'lucide-react';
import { databaseService } from '../../services/database';

function TeacherProfileForm() {
  const [activeTab, setActiveTab] = useState('personal-info');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Dr. Siti Nurhaliza, S.Pd',
    teacherId: 'T2024001',
    nip: '196505151990032001',
    subject: 'Matematika',
    email: 'siti.nurhaliza@sman1jakarta.sch.id',
    phone: '081234567890',
    address: 'Jl. Guru No. 456, Jakarta Pusat',
    birthDate: '1965-05-15',
    gender: 'female',
    education: 'S2 Pendidikan Matematika',
    university: 'Universitas Negeri Jakarta',
    graduationYear: '1995',
    teachingExperience: '29',
    specialization: ['Aljabar', 'Geometri', 'Statistika'],
    classes: ['X IPA 1', 'X IPA 2', 'XI IPA 1'],
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'personal-info', label: 'Informasi Pribadi', icon: <User className="w-4 h-4" /> },
    { id: 'professional-info', label: 'Informasi Profesional', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'teaching-load', label: 'Beban Mengajar', icon: <Book className="w-4 h-4" /> },
    { id: 'achievements', label: 'Prestasi & Sertifikasi', icon: <Award className="w-4 h-4" /> },
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
                src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150"
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
              <p className="text-gray-600">Guru {profileData.subject} • NIP: {profileData.nip}</p>
              <p className="text-sm text-gray-500">Pengalaman mengajar: {profileData.teachingExperience} tahun</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">NIP</label>
            <input
              type="text"
              value={profileData.nip}
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

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Informasi Profesional</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mata Pelajaran</label>
            <input
              type="text"
              value={profileData.subject}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pengalaman Mengajar</label>
            <input
              type="text"
              value={`${profileData.teachingExperience} tahun`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pendidikan Terakhir</label>
            <input
              type="text"
              value={profileData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              readOnly={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Universitas</label>
            <input
              type="text"
              value={profileData.university}
              onChange={(e) => handleInputChange('university', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              readOnly={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Lulus</label>
            <input
              type="text"
              value={profileData.graduationYear}
              onChange={(e) => handleInputChange('graduationYear', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              readOnly={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Kepegawaian</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={!isEditing}>
              <option>PNS</option>
              <option>PPPK</option>
              <option>Honorer</option>
              <option>Kontrak</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Spesialisasi/Keahlian</label>
            <div className="flex flex-wrap gap-2">
              {profileData.specialization.map((spec, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeachingLoad = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Beban Mengajar Saat Ini</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Jam Mengajar/Minggu</label>
            <input
              type="number"
              value="24"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Kelas Diampu</label>
            <input
              type="number"
              value={profileData.classes.length}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
        </div>
        
        <div>
          <h5 className="font-semibold text-gray-900 mb-3">Kelas yang Diampu</h5>
          <div className="space-y-3">
            {profileData.classes.map((className, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{className}</p>
                  <p className="text-sm text-gray-600">32 siswa • 6 jam/minggu</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">85% completion rate</p>
                  <p className="text-xs text-gray-500">Rata-rata nilai: 82</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Jadwal Mengajar</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hari</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Jam</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Kelas</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Materi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { day: 'Senin', time: '07:00-08:30', class: 'X IPA 1', topic: 'Fungsi Linear' },
                { day: 'Senin', time: '08:30-10:00', class: 'X IPA 2', topic: 'Fungsi Linear' },
                { day: 'Selasa', time: '07:00-08:30', class: 'XI IPA 1', topic: 'Trigonometri' },
                { day: 'Rabu', time: '10:15-11:45', class: 'X IPA 1', topic: 'Persamaan Kuadrat' },
                { day: 'Kamis', time: '07:00-08:30', class: 'XI IPA 1', topic: 'Limit Fungsi' },
                { day: 'Jumat', time: '07:00-08:30', class: 'X IPA 2', topic: 'Sistem Persamaan' }
              ].map((schedule, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">{schedule.day}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{schedule.time}</td>
                  <td className="px-4 py-2 text-sm text-blue-600 font-medium">{schedule.class}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{schedule.topic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <Award className="w-12 h-12 text-yellow-600 mb-4" />
          <h4 className="font-bold text-yellow-900 mb-2">Guru Berprestasi</h4>
          <p className="text-sm text-yellow-700 mb-3">Juara 1 Guru Berprestasi Tingkat Provinsi DKI Jakarta</p>
          <div className="text-xs text-yellow-600">2023</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <Star className="w-12 h-12 text-blue-600 mb-4" />
          <h4 className="font-bold text-blue-900 mb-2">Sertifikasi Pendidik</h4>
          <p className="text-sm text-blue-700 mb-3">Sertifikat Pendidik Profesional Matematika</p>
          <div className="text-xs text-blue-600">Valid hingga 2025</div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Sertifikasi & Pelatihan</h4>
        
        <div className="space-y-4">
          {[
            {
              title: "Sertifikasi Google for Education",
              issuer: "Google",
              date: "2023-08-15",
              status: "Aktif"
            },
            {
              title: "Pelatihan Kurikulum Merdeka",
              issuer: "Kemendikbud",
              date: "2023-06-20",
              status: "Selesai"
            },
            {
              title: "Workshop Pembelajaran Digital",
              issuer: "SEAMOLEC",
              date: "2023-04-10",
              status: "Selesai"
            }
          ].map((cert, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900">{cert.title}</h5>
                <p className="text-sm text-gray-600">{cert.issuer}</p>
                <p className="text-xs text-gray-500">{new Date(cert.date).toLocaleDateString('id-ID')}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                cert.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {cert.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistik Mengajar</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">156</div>
            <div className="text-sm text-blue-700">Total Siswa</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">89</div>
            <div className="text-sm text-green-700">Materi Dibuat</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">4.8</div>
            <div className="text-sm text-purple-700">Rating Mengajar</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-2">95%</div>
            <div className="text-sm text-orange-700">Tingkat Kelulusan</div>
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
            { id: 'assignment_submissions', label: 'Notifikasi Pengumpulan Tugas', checked: true },
            { id: 'student_questions', label: 'Pertanyaan dari Siswa', checked: true },
            { id: 'system_updates', label: 'Update Sistem', checked: false },
            { id: 'new_materials', label: 'Materi Baru dari Kolega', checked: true },
            { id: 'class_performance', label: 'Laporan Performa Kelas', checked: true },
            { id: 'parent_communications', label: 'Komunikasi Orang Tua', checked: false }
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
            <p className="text-sm text-gray-600">Kelola informasi profesional dan pengaturan akun</p>
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
        {activeTab === 'professional-info' && renderProfessionalInfo()}
        {activeTab === 'teaching-load' && renderTeachingLoad()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'account-settings' && renderAccountSettings()}
      </div>
    </div>
  );
}

export default TeacherProfileForm;