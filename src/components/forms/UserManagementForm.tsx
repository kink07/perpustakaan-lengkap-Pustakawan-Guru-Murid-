import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  User, 
  Settings, 
  BarChart3,
  Save,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Shield,
  Key,
  Clock,
  Award,
  Target,
  Activity,
  TrendingUp,
  FileText,
  Camera,
  CreditCard,
  Smartphone,
  Globe,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Printer,
  Book
} from 'lucide-react';
import MemberCardModal from '../MemberCardModal';

function UserManagementForm() {
  const [activeTab, setActiveTab] = useState('user-registration');
  const [userData, setUserData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    gender: '',
    class: '',
    department: '',
    membershipType: 'student',
    password: '',
    confirmPassword: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedMembersData, setSelectedMembersData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample members data for all statuses
  const sampleMembers = [
    {
      id: 1,
      name: 'Ahmad Rizki Pratama',
      studentId: '2024001',
      role: 'student',
      class: 'XII IPA 1',
      status: 'Aktif',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      memberSince: '2023-07-01',
      validUntil: '2024-06-30'
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      studentId: '2024002',
      role: 'student',
      class: 'XI IPA 2',
      status: 'Aktif',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
      memberSince: '2023-07-01',
      validUntil: '2024-06-30'
    },
    {
      id: 3,
      name: 'Budi Santoso',
      studentId: '2024003',
      role: 'student',
      class: 'X IPS 1',
      status: 'Aktif',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      memberSince: '2023-07-01',
      validUntil: '2024-06-30'
    },
    {
      id: 4,
      name: 'Dr. Siti Nurhaliza, S.Pd',
      teacherId: 'T2024001',
      role: 'teacher',
      subject: 'Matematika',
      status: 'Aktif',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
      memberSince: '2020-01-01',
      validUntil: '2025-12-31'
    },
    {
      id: 5,
      name: 'Prof. Dr. Ahmad Susanto',
      teacherId: 'T2024002',
      role: 'teacher',
      subject: 'Fisika',
      status: 'Aktif',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      memberSince: '2018-08-01',
      validUntil: '2025-12-31'
    },
    {
      id: 6,
      name: 'Drs. Bambang Sutrisno',
      employeeId: 'L2024001',
      role: 'librarian',
      position: 'Kepala Perpustakaan',
      status: 'Aktif',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      memberSince: '2015-01-01',
      validUntil: '2025-12-31'
    },
    {
      id: 7,
      name: 'Dewi Sartika, S.I.Pust',
      employeeId: 'L2024002',
      role: 'librarian',
      position: 'Pustakawan',
      status: 'Aktif',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
      memberSince: '2019-03-01',
      validUntil: '2025-12-31'
    },
    {
      id: 8,
      name: 'Andi Wijaya',
      employeeId: 'S2024001',
      role: 'staff',
      position: 'Staff Administrasi',
      status: 'Aktif',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      memberSince: '2021-09-01',
      validUntil: '2025-12-31'
    },
    {
      id: 9,
      name: 'Maya Sari',
      employeeId: 'S2024002',
      role: 'staff',
      position: 'Staff IT',
      status: 'Aktif',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
      memberSince: '2022-02-01',
      validUntil: '2025-12-31'
    }
  ];

  const tabs = [
    { id: 'user-registration', label: 'Registrasi Pengguna', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'user-profiles', label: 'Profil Pengguna', icon: <User className="w-4 h-4" /> },
    { id: 'membership-management', label: 'Manajemen Keanggotaan', icon: <Users className="w-4 h-4" /> },
    { id: 'member-cards', label: 'Kartu Anggota', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'access-control', label: 'Kontrol Akses', icon: <Settings className="w-4 h-4" /> },
    { id: 'user-statistics', label: 'Statistik Pengguna', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const filteredMembers = sampleMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (member.studentId && member.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (member.teacherId && member.teacherId.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (member.employeeId && member.employeeId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'siswa' && member.role === 'student') ||
                         (filterStatus === 'guru' && member.role === 'teacher') ||
                         (filterStatus === 'pustakawan' && member.role === 'librarian') ||
                         (filterStatus === 'staff' && member.role === 'staff');
    
    return matchesSearch && matchesFilter;
  });

  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev => {
      const newSelection = prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId];
      
      // Update selected members data
      const newSelectedData = sampleMembers.filter(member => newSelection.includes(member.id));
      setSelectedMembersData(newSelectedData);
      
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
      setSelectedMembersData([]);
    } else {
      const allIds = filteredMembers.map(member => member.id);
      setSelectedMembers(allIds);
      setSelectedMembersData(filteredMembers);
    }
  };

  const handleDirectPrint = () => {
    if (selectedMembers.length === 0) {
      alert('Pilih anggota terlebih dahulu');
      return;
    }
    window.print();
  };

  const handlePrint = () => {
    if (selectedMembers.length === 0) {
      alert('Pilih anggota terlebih dahulu');
      return;
    }
    
    // Jika tidak dalam preview mode, masuk ke preview mode dulu
    if (!previewMode) {
      setPreviewMode(true);
      // Tunggu sebentar untuk render, lalu print
      setTimeout(() => {
        window.print();
      }, 100);
    } else {
      window.print();
    }
  };

  const handleDownloadPDF = () => {
    if (selectedMembers.length === 0) {
      alert('Pilih anggota terlebih dahulu');
      return;
    }
    
    // Jika tidak dalam preview mode, masuk ke preview mode dulu
    if (!previewMode) {
      setPreviewMode(true);
      setTimeout(() => {
        generatePDF();
      }, 100);
    } else {
      generatePDF();
    }
  };
  
  const generatePDF = () => {
    // Simulasi generate PDF
    const memberNames = selectedMembersData.map(m => m.name).join(', ');
    alert(`PDF kartu anggota untuk ${memberNames} sedang diproses...`);
  };

  const generateBarcodeStripes = () => {
    const stripes = [];
    for (let i = 0; i < 30; i++) {
      stripes.push({
        width: Math.random() > 0.5 ? 2 : 3,
        isBlack: Math.random() > 0.5
      });
    }
    return stripes;
  };

  const renderUserRegistration = () => (
    <div className="space-y-6">
      {/* Bulk Import/Export Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Bulk Import & Export Pengguna
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Import Pengguna dari Excel</h5>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-700 mb-2">Upload file Excel (.xlsx)</p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  id="bulk-import-file"
                />
                <label
                  htmlFor="bulk-import-file"
                  className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Pilih File Excel
                </label>
              </div>
              
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Upload className="w-4 h-4 mr-2 inline" />
                Import Pengguna
              </button>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Download & Template</h5>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Download className="w-4 h-4 mr-2 inline" />
                Download Template Excel
              </button>
              
              <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <Download className="w-4 h-4 mr-2 inline" />
                Export Data Pengguna
              </button>
              
              <button className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <FileText className="w-4 h-4 mr-2 inline" />
                Lihat Pedoman Format
              </button>
            </div>
          </div>
        </div>
        
        {/* Format Guidelines */}
        <div className="mt-6 bg-white border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-gray-900 mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-blue-600" />
            Pedoman Format Excel untuk Bulk Import
          </h5>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Kolom</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Field</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Format/Contoh</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Wajib</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-mono">A</td>
                  <td className="border border-gray-300 px-3 py-2">Nama Lengkap</td>
                  <td className="border border-gray-300 px-3 py-2">Ahmad Rizki Pratama</td>
                  <td className="border border-gray-300 px-3 py-2 text-red-600">Ya</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-mono">B</td>
                  <td className="border border-gray-300 px-3 py-2">NIS/NIP/ID</td>
                  <td className="border border-gray-300 px-3 py-2">2024001</td>
                  <td className="border border-gray-300 px-3 py-2 text-red-600">Ya</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-mono">C</td>
                  <td className="border border-gray-300 px-3 py-2">Email</td>
                  <td className="border border-gray-300 px-3 py-2">ahmad.rizki@student.sman1jakarta.sch.id</td>
                  <td className="border border-gray-300 px-3 py-2 text-red-600">Ya</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-mono">D</td>
                  <td className="border border-gray-300 px-3 py-2">Nomor Telepon</td>
                  <td className="border border-gray-300 px-3 py-2">081234567890</td>
                  <td className="border border-gray-300 px-3 py-2 text-red-600">Ya</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-mono">E</td>
                  <td className="border border-gray-300 px-3 py-2">Tanggal Lahir</td>
                  <td className="border border-gray-300 px-3 py-2">15/05/2006 (DD/MM/YYYY)</td>
                  <td className="border border-gray-300 px-3 py-2 text-red-600">Ya</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-mono">F</td>
                  <td className="border border-gray-300 px-3 py-2">Jenis Kelamin</td>
                  <td className="border border-gray-300 px-3 py-2">L (Laki-laki) / P (Perempuan)</td>
                  <td className="border border-gray-300 px-3 py-2 text-red-600">Ya</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-mono">G</td>
                  <td className="border border-gray-300 px-3 py-2">Jenis Keanggotaan</td>
                  <td className="border border-gray-300 px-3 py-2">student/teacher/staff/librarian/guest</td>
                  <td className="border border-gray-300 px-3 py-2 text-red-600">Ya</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-mono">H</td>
                  <td className="border border-gray-300 px-3 py-2">Kelas/Departemen</td>
                  <td className="border border-gray-300 px-3 py-2">XII IPA 1 / Matematika</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-600">Tidak</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-mono">I</td>
                  <td className="border border-gray-300 px-3 py-2">Alamat</td>
                  <td className="border border-gray-300 px-3 py-2">Jl. Pendidikan No. 123, Jakarta</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-600">Tidak</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-mono">J</td>
                  <td className="border border-gray-300 px-3 py-2">Kontak Darurat</td>
                  <td className="border border-gray-300 px-3 py-2">Budi Pratama (Ayah)</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-600">Tidak</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-mono">K</td>
                  <td className="border border-gray-300 px-3 py-2">Telepon Darurat</td>
                  <td className="border border-gray-300 px-3 py-2">081234567891</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-600">Tidak</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p className="font-medium">Catatan Penting:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Baris pertama (header) harus berisi nama kolom sesuai tabel di atas</li>
              <li>Data dimulai dari baris kedua</li>
              <li>Jenis Kelamin: gunakan "L" untuk Laki-laki, "P" untuk Perempuan</li>
              <li>Tanggal Lahir: format DD/MM/YYYY (contoh: 15/05/2006)</li>
              <li>Jenis Keanggotaan: student, teacher, staff, librarian, atau guest</li>
              <li>Password akan di-generate otomatis dan dikirim via email</li>
              <li>Maksimal 500 pengguna per file import</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
          Registrasi Pengguna Baru
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
            <input
              type="text"
              value={userData.fullName}
              onChange={(e) => setUserData(prev => ({...prev, fullName: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama lengkap sesuai identitas"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NIS/NIP/ID *</label>
            <input
              type="text"
              value={userData.studentId}
              onChange={(e) => setUserData(prev => ({...prev, studentId: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nomor identitas"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData(prev => ({...prev, email: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="email@domain.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon *</label>
            <input
              type="tel"
              value={userData.phone}
              onChange={(e) => setUserData(prev => ({...prev, phone: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir *</label>
            <input
              type="date"
              value={userData.birthDate}
              onChange={(e) => setUserData(prev => ({...prev, birthDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin *</label>
            <select
              value={userData.gender}
              onChange={(e) => setUserData(prev => ({...prev, gender: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Keanggotaan *</label>
            <select
              value={userData.membershipType}
              onChange={(e) => setUserData(prev => ({...prev, membershipType: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="student">Siswa</option>
              <option value="teacher">Guru</option>
              <option value="staff">Staff</option>
              <option value="librarian">Pustakawan</option>
              <option value="guest">Tamu</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kelas/Departemen</label>
            <input
              type="text"
              value={userData.class}
              onChange={(e) => setUserData(prev => ({...prev, class: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="XII IPA 1 / Matematika"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={userData.password}
                onChange={(e) => setUserData(prev => ({...prev, password: e.target.value}))}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Minimal 8 karakter"
                required
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password *</label>
            <input
              type="password"
              value={userData.confirmPassword}
              onChange={(e) => setUserData(prev => ({...prev, confirmPassword: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ulangi password"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
            <textarea
              value={userData.address}
              onChange={(e) => setUserData(prev => ({...prev, address: e.target.value}))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Alamat lengkap tempat tinggal"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kontak Darurat</label>
            <input
              type="text"
              value={userData.emergencyContact}
              onChange={(e) => setUserData(prev => ({...prev, emergencyContact: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama kontak darurat"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telepon Darurat</label>
            <input
              type="tel"
              value={userData.emergencyPhone}
              onChange={(e) => setUserData(prev => ({...prev, emergencyPhone: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="08xxxxxxxxxx"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Foto Profil</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Klik untuk upload foto atau drag & drop</p>
              <input type="file" accept="image/*" className="hidden" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserCheck className="w-4 h-4 mr-2 inline" />
            Daftarkan Pengguna
          </button>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );

  const renderUserProfiles = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Kelola Profil Pengguna
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari Pengguna *</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nama, NIS, atau email"
                required
              />
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Akun</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Aktif</option>
              <option>Tidak Aktif</option>
              <option>Suspended</option>
              <option>Pending Approval</option>
              <option>Expired</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="email@domain.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Telepon</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="08xxxxxxxxxx"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batas Peminjaman</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="5"
              min="1"
              max="20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Peminjaman (hari)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="7"
              min="1"
              max="90"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kadaluarsa</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level Akses</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Basic - Koleksi Umum</option>
              <option>Standard - Koleksi + Referensi</option>
              <option>Premium - Semua Koleksi</option>
              <option>Staff - Akses Administratif</option>
              <option>Admin - Full Access</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Profil</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan khusus tentang pengguna ini"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4 mr-2 inline" />
            Simpan Profil
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <CreditCard className="w-4 h-4 mr-2 inline" />
            Cetak Kartu Anggota
          </button>
        </div>
      </div>
    </div>
  );

  const renderMembershipManagement = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          Manajemen Keanggotaan
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Keanggotaan *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Siswa Reguler</option>
              <option>Siswa Olimpiade</option>
              <option>Guru Tetap</option>
              <option>Guru Honorer</option>
              <option>Staff Administrasi</option>
              <option>Pustakawan</option>
              <option>Tamu Peneliti</option>
              <option>Alumni</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Masa Berlaku (bulan)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="12"
              min="1"
              max="60"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biaya Keanggotaan (Rp)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Jaminan (Rp)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batas Peminjaman</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="5"
              min="1"
              max="20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batas Reservasi</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="3"
              min="1"
              max="10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Akses Digital</label>
            <div className="space-y-2">
              {['E-Book', 'Database Online', 'Video Learning', 'Audio Book', 'Jurnal Digital'].map((access) => (
                <label key={access} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{access}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hak Istimewa</label>
            <div className="space-y-2">
              {['Perpanjangan Otomatis', 'Peminjaman Jangka Panjang', 'Akses Koleksi Khusus', 'Prioritas Reservasi', 'Bebas Denda'].map((privilege) => (
                <label key={privilege} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{privilege}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Syarat & Ketentuan Keanggotaan</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Syarat dan ketentuan khusus untuk jenis keanggotaan ini"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Users className="w-4 h-4 mr-2 inline" />
            Simpan Keanggotaan
          </button>
        </div>
      </div>
    </div>
  );

  const renderMemberCard = (member) => {
    const barcodePattern = generateBarcodeStripes();
    
    return (
      <div className="member-card" style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #ffffff 50%, #dc2626 100%)',
        border: '2px solid #dc2626'
      }}>
        <div className="member-card-header">
          <div className="flex items-center space-x-2">
            <Book className="w-6 h-6 text-red-800" />
            <div>
              <p className="text-xs font-bold text-red-800">Perpustakaan SDN</p>
              <p className="text-xs text-red-700">Pejaten Timur 11 Pagi</p>
            </div>
          </div>
          
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            member.role === 'student' ? 'status-siswa' : 
            member.role === 'teacher' ? 'status-guru' : 
            member.role === 'librarian' ? 'status-pustakawan' : 'status-staff'
          }`}>
            {member.role === 'student' ? 'SISWA' : 
             member.role === 'teacher' ? 'GURU' : 
             member.role === 'librarian' ? 'PUSTAKAWAN' : 'STAFF'}
          </span>
        </div>
        
        <div className="member-card-body">
          <img
            src={member.avatar}
            alt={member.name}
            className="member-photo"
          />
          <div className="member-info">
            <h3>{member.name}</h3>
            <p className="text-red-800">
              {member.role === 'student' ? member.class : 
               member.role === 'teacher' ? member.subject : 
               member.position}
            </p>
            <p className="text-red-700 text-xs">ID: {member.studentId || member.teacherId || member.employeeId}</p>
          </div>
        </div>
        
        <div className="member-barcode text-center mt-2">
          <div className="flex justify-center items-center bg-white rounded px-2 py-1 mx-4">
            <div className="flex items-end h-8">
              {barcodePattern.map((stripe, index) => (
                <div
                  key={index}
                  className={`${stripe.isBlack ? 'bg-black' : 'bg-white'}`}
                  style={{ width: `${stripe.width}px`, height: '100%' }}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-red-800 mt-1 font-mono">{member.studentId || member.teacherId || member.employeeId}</p>
        </div>
      </div>
    );
  };

  const renderMemberCards = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg">
        {!previewMode ? (
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
              Cetak Kartu Anggota
            </h4>
            
            {/* Member Selection and Cards Display */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Pilih Anggota untuk Kartu</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari anggota..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Semua Status</option>
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru</option>
                    <option value="pustakawan">Pustakawan</option>
                    <option value="staff">Staff</option>
                  </select>
                  
                  <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedMembers.length === filteredMembers.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                  </button>
                </div>
              </div>
              
              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedMembers.includes(member.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectMember(member.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => handleSelectMember(member.id)}
                        className="text-blue-600"
                      />
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{member.status} • {member.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Tidak ada anggota yang ditemukan</p>
              </div>
            )}
            
            {/* Member Cards Display */}
            {selectedMembersData.length > 0 && (
              <div className="member-cards-print-wrapper">
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Kartu Anggota ({selectedMembersData.length} kartu)
                  </h4>
                  <div className="member-cards-print-area grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedMembersData.map((member) => (
                      <div key={member.id} className="flex justify-center">
                        {renderMemberCard(member)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            {selectedMembersData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 member-cards-print-area">
                {selectedMembersData.map((member) => (
                  <div key={member.id} className="flex justify-center">
                    {renderMemberCard(member)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada anggota yang dipilih</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setPreviewMode(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Kembali ke Pilihan
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedMembers.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedMembers.length} anggota dipilih
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDirectPrint}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Printer className="w-4 h-4 mr-2 inline" />
                  Cetak Kartu ({selectedMembers.length})
                </button>
                
                <button
                  onClick={handleDownloadPDF}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2 inline" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAccessControl = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Kontrol Akses & Izin
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User ID *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ID pengguna"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role/Peran *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Member - Anggota Biasa</option>
              <option>Premium Member - Anggota Premium</option>
              <option>Staff - Petugas</option>
              <option>Librarian - Pustakawan</option>
              <option>Admin - Administrator</option>
              <option>Super Admin - Super Administrator</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Akses Modul</label>
            <div className="space-y-2">
              {[
                'OPAC - Katalog Online',
                'Sirkulasi - Peminjaman',
                'Reservasi - Booking',
                'Riwayat - History',
                'Profil - Profile Management',
                'Dashboard - Admin Panel',
                'Laporan - Reports',
                'Pengaturan - Settings'
              ].map((module) => (
                <label key={module} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{module}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Akses Koleksi</label>
            <div className="space-y-2">
              {[
                'Koleksi Umum',
                'Koleksi Referensi',
                'Koleksi Khusus',
                'Koleksi Digital',
                'Terbitan Berkala',
                'Database Online',
                'Arsip Sekolah',
                'Multimedia'
              ].map((collection) => (
                <label key={collection} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{collection}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jam Akses</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input type="time" defaultValue="07:00" className="px-2 py-1 border border-gray-300 rounded" />
                <span className="text-sm text-gray-600">sampai</span>
                <input type="time" defaultValue="16:00" className="px-2 py-1 border border-gray-300 rounded" />
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IP Address Restriction</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="192.168.1.0/24 (satu IP per baris)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (menit)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="30"
              min="5"
              max="480"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Two-Factor Authentication</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Disabled</option>
              <option>SMS</option>
              <option>Email</option>
              <option>Authenticator App</option>
              <option>Required</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Shield className="w-4 h-4 mr-2 inline" />
            Update Akses
          </button>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <Lock className="w-4 h-4 mr-2 inline" />
            Suspend Akses
          </button>
        </div>
      </div>
    </div>
  );

  const renderUserStatistics = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Statistik & Analitik Pengguna
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Periode Analisis *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Hari Ini</option>
              <option>Minggu Ini</option>
              <option>Bulan Ini</option>
              <option>3 Bulan Terakhir</option>
              <option>6 Bulan Terakhir</option>
              <option>1 Tahun Terakhir</option>
              <option>Custom Range</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Laporan *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Aktivitas Pengguna</option>
              <option>Peminjaman per User</option>
              <option>Pengguna Aktif</option>
              <option>Registrasi Baru</option>
              <option>Keanggotaan Expired</option>
              <option>Top Borrowers</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Jenis Pengguna</label>
            <div className="space-y-2">
              {['Siswa', 'Guru', 'Staff', 'Pustakawan', 'Tamu', 'Alumni'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metrik yang Ditampilkan</label>
            <div className="space-y-2">
              {[
                'Total Registrasi',
                'Pengguna Aktif',
                'Rata-rata Peminjaman',
                'Tingkat Keterlambatan',
                'Penggunaan Digital',
                'Feedback Score'
              ].map((metric) => (
                <label key={metric} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" defaultChecked />
                  <span className="text-sm">{metric}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format Output</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Dashboard View</option>
              <option>PDF Report</option>
              <option>Excel Spreadsheet</option>
              <option>CSV Data</option>
              <option>PowerPoint Presentation</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grouping Data</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Per Hari</option>
              <option>Per Minggu</option>
              <option>Per Bulan</option>
              <option>Per Kelas</option>
              <option>Per Departemen</option>
              <option>Per Jenis Pengguna</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Tambahan</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Kriteria filter tambahan untuk analisis"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <TrendingUp className="w-4 h-4 mr-2 inline" />
            Generate Statistik
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4 mr-2 inline" />
            Export Data
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
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manajemen Pengguna</h2>
            <p className="text-sm text-gray-600">Kelola registrasi, profil, dan akses pengguna perpustakaan</p>
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
        {activeTab === 'user-registration' && renderUserRegistration()}
        {activeTab === 'user-profiles' && renderUserProfiles()}
        {activeTab === 'membership-management' && renderMembershipManagement()}
        {activeTab === 'member-cards' && renderMemberCards()}
        {activeTab === 'access-control' && renderAccessControl()}
        {activeTab === 'user-statistics' && renderUserStatistics()}
      </div>
    </div>
  );
}

export default UserManagementForm;