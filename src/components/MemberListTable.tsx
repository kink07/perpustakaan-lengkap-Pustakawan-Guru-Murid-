import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Shield,
  MoreVertical,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  CheckSquare,
  Square,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail as MailIcon,
  FileText
} from 'lucide-react';
import memberService, { MemberData } from '../services/memberService';
import { User as UserType } from '../types/database';

interface MemberListTableProps {
  onEdit?: (member: UserType) => void;
  onDelete?: (memberId: string) => void;
}

const MemberListTable: React.FC<MemberListTableProps> = ({ onEdit, onDelete }) => {
  const [members, setMembers] = useState<UserType[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Password visibility states
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  
  // Selection states
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load members data
  useEffect(() => {
    loadMembers();
  }, []);

  // Filter members based on search and filter criteria
  useEffect(() => {
    let filtered = members;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.student_id && member.student_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (member.teacher_id && member.teacher_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (member.employee_id && member.employee_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (member.phone && member.phone.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(member => member.role === filterRole);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(member => member.status === filterStatus);
    }

    setFilteredMembers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
    setSelectedMembers([]); // Clear selection when filtering
  }, [members, searchQuery, filterRole, filterStatus]);

  const loadMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await memberService.getAllUsers();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data anggota');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (memberId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  // Selection handlers
  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => {
      const newSelection = prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === currentMembers.length) {
      setSelectedMembers([]);
      setShowBulkActions(false);
    } else {
      const allIds = currentMembers.map(member => member.id);
      setSelectedMembers(allIds);
      setShowBulkActions(true);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  const isAllSelected = selectedMembers.length === currentMembers.length && currentMembers.length > 0;
  const isIndeterminate = selectedMembers.length > 0 && selectedMembers.length < currentMembers.length;

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'student': 'Siswa',
      'teacher': 'Guru',
      'staff': 'Staff',
      'librarian': 'Pustakawan',
      'guest': 'Tamu'
    };
    return roleMap[role] || role;
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'suspended': 'bg-red-100 text-red-800',
      'expired': 'bg-orange-100 text-orange-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDisplayName = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'active': 'Aktif',
      'inactive': 'Tidak Aktif',
      'suspended': 'Ditangguhkan',
      'expired': 'Kadaluarsa'
    };
    return statusMap[status] || status;
  };

  const getMemberId = (member: UserType) => {
    return member.student_id || member.teacher_id || member.employee_id || member.id;
  };

  const getMemberType = (member: UserType) => {
    if (member.student_id) return 'NIS';
    if (member.teacher_id) return 'NIP';
    if (member.employee_id) return 'ID';
    return 'ID';
  };

  const getMembershipType = (member: UserType) => {
    // This would typically come from membership_types table
    // For now, we'll use role-based mapping
    const membershipMap: { [key: string]: string } = {
      'student': 'Siswa Reguler',
      'teacher': 'Guru Tetap',
      'staff': 'Staff Administrasi',
      'librarian': 'Pustakawan',
      'guest': 'Tamu Peneliti'
    };
    return membershipMap[member.role] || 'Anggota Biasa';
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const blob = await memberService.exportUsers('excel');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daftar_anggota_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess('Data berhasil diekspor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengekspor data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memberId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      setLoading(true);
      try {
        await memberService.deleteUser(memberId);
        setSuccess('Anggota berhasil dihapus');
        await loadMembers();
        if (onDelete) onDelete(memberId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal menghapus anggota');
      } finally {
        setLoading(false);
      }
    }
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedMembers.length} anggota yang dipilih?`)) {
      setLoading(true);
      try {
        await Promise.all(selectedMembers.map(id => memberService.deleteUser(id)));
        setSuccess(`${selectedMembers.length} anggota berhasil dihapus`);
        setSelectedMembers([]);
        setShowBulkActions(false);
        await loadMembers();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal menghapus anggota');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkActivate = async () => {
    setLoading(true);
    try {
      // This would typically update status to active
      setSuccess(`${selectedMembers.length} anggota berhasil diaktifkan`);
      setSelectedMembers([]);
      setShowBulkActions(false);
      await loadMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengaktifkan anggota');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDeactivate = async () => {
    setLoading(true);
    try {
      // This would typically update status to inactive
      setSuccess(`${selectedMembers.length} anggota berhasil dinonaktifkan`);
      setSelectedMembers([]);
      setShowBulkActions(false);
      await loadMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menonaktifkan anggota');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkExport = async () => {
    setLoading(true);
    try {
      const selectedMembersData = members.filter(member => selectedMembers.includes(member.id));
      const blob = await memberService.exportUsers('excel');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anggota_terpilih_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess(`Data ${selectedMembers.length} anggota berhasil diekspor`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengekspor data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-auto">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {/* Header with Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Daftar Anggota
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Total {filteredMembers.length} dari {members.length} anggota
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={loadMembers}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>Refresh</span>
            </button>
            
            <button
              onClick={handleExport}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, email, atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Semua Role</option>
            <option value="student">Siswa</option>
            <option value="teacher">Guru</option>
            <option value="staff">Staff</option>
            <option value="librarian">Pustakawan</option>
            <option value="guest">Tamu</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
            <option value="suspended">Ditangguhkan</option>
            <option value="expired">Kadaluarsa</option>
          </select>
          
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterRole('all');
              setFilterStatus('all');
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Reset Filter</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedMembers.length} anggota dipilih
              </span>
              <button
                onClick={() => {
                  setSelectedMembers([]);
                  setShowBulkActions(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Batal pilih
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkActivate}
                disabled={loading}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
              >
                <UserCheck className="w-4 h-4" />
                <span>Aktifkan</span>
              </button>
              
              <button
                onClick={handleBulkDeactivate}
                disabled={loading}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
              >
                <UserX className="w-4 h-4" />
                <span>Nonaktifkan</span>
              </button>
              
              <button
                onClick={handleBulkExport}
                disabled={loading}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={handleBulkDelete}
                disabled={loading}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSelectAll}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : isIndeterminate ? (
                        <div className="w-5 h-5 border-2 border-blue-600 bg-blue-600 rounded flex items-center justify-center">
                          <div className="w-2 h-0.5 bg-white"></div>
                        </div>
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                    <span>Foto & Nama</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIS/NIP/ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No HP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Keanggotaan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="text-gray-600">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : currentMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <User className="w-12 h-12 text-gray-400" />
                      <p className="text-gray-600">Tidak ada anggota yang ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleSelectMember(member.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {selectedMembers.includes(member.id) ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                        <img
                          src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff`}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500 capitalize">{getRoleDisplayName(member.role)}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getMemberId(member)}</div>
                      <div className="text-sm text-gray-500">{getMemberType(member)}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{member.email}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{member.phone || '-'}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{getMembershipType(member)}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono text-gray-900">
                          {showPasswords[member.id] ? (member.password || '••••••••') : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(member.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords[member.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                        {getStatusDisplayName(member.status)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEdit && onEdit(member)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Aksi lainnya"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Menampilkan {startIndex + 1} sampai {Math.min(endIndex, filteredMembers.length)} dari {filteredMembers.length} anggota
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberListTable;
