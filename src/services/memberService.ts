// Member Management Service
// Comprehensive CRUD operations for library members

import { supabase, TABLES } from '../config/supabase';
import { User } from '../types/database';

export interface MemberData {
  id?: string;
  fullName: string;
  studentId?: string;
  teacherId?: string;
  employeeId?: string;
  email: string;
  phone: string;
  address?: string;
  birthDate: string;
  gender: 'male' | 'female';
  class?: string;
  department?: string;
  membershipType: 'student' | 'teacher' | 'staff' | 'librarian' | 'guest';
  password?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  avatar?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'expired';
  membershipExpiry?: string;
  borrowLimit?: number;
  borrowDuration?: number;
  accessLevel?: 'basic' | 'standard' | 'premium' | 'staff' | 'admin';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MembershipType {
  id: string;
  name: string;
  description?: string;
  validityMonths: number;
  membershipFee: number;
  depositAmount: number;
  borrowLimit: number;
  reservationLimit: number;
  digitalAccess: string[];
  privileges: string[];
  termsAndConditions?: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccessControl {
  userId: string;
  role: string;
  moduleAccess: string[];
  collectionAccess: string[];
  accessHours: {
    start: string;
    end: string;
    days: string[];
  };
  ipRestrictions?: string[];
  sessionTimeout: number;
  twoFactorAuth: 'disabled' | 'sms' | 'email' | 'authenticator' | 'required';
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newRegistrations: number;
  expiredMemberships: number;
  usersByType: Record<string, number>;
  usersByStatus: Record<string, number>;
  averageBorrows: number;
  topBorrowers: Array<{
    userId: string;
    userName: string;
    borrowCount: number;
  }>;
}

export const memberService = {
  // =====================================================
  // USER REGISTRATION & MANAGEMENT
  // =====================================================

  async registerUser(memberData: MemberData): Promise<User> {
    try {
      // Validate required fields
      if (!memberData.fullName || !memberData.email || !memberData.phone) {
        throw new Error('Nama lengkap, email, dan nomor telepon wajib diisi');
      }

      // Check if email already exists
      const existingUser = await this.getUserByEmail(memberData.email);
      if (existingUser) {
        throw new Error('Email sudah terdaftar');
      }

      // Check if ID already exists
      const idField = memberData.membershipType === 'student' ? 'studentId' :
                     memberData.membershipType === 'teacher' ? 'teacherId' : 'employeeId';
      const idValue = memberData[idField];
      
      if (idValue) {
        const existingId = await this.getUserByIdentifier(idValue, memberData.membershipType);
        if (existingId) {
          throw new Error(`${idField} sudah terdaftar`);
        }
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: memberData.email,
        password: memberData.password || this.generatePassword(),
        options: {
          data: {
            full_name: memberData.fullName,
            membership_type: memberData.membershipType,
            phone: memberData.phone
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Gagal membuat akun pengguna');
      }

      // Create user profile in database
      const userProfile = {
        id: authData.user.id,
        name: memberData.fullName,
        email: memberData.email,
        role: memberData.membershipType,
        avatar: memberData.avatar,
        student_id: memberData.studentId,
        teacher_id: memberData.teacherId,
        employee_id: memberData.employeeId,
        phone: memberData.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert([userProfile])
        .select()
        .single();

      if (error) {
        // If profile creation fails, clean up auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error(error.message);
      }

      // Log activity
      await this.logActivity(authData.user.id, 'register', 'User registered successfully');

      return data as User;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  async bulkImportUsers(usersData: MemberData[]): Promise<{ success: number; errors: any[] }> {
    const results = { success: 0, errors: [] };

    for (const userData of usersData) {
      try {
        await this.registerUser(userData);
        results.success++;
      } catch (error) {
        results.errors.push({
          user: userData.fullName,
          error: error.message
        });
      }
    }

    return results;
  },

  async exportUsers(format: 'excel' | 'csv' = 'excel'): Promise<Blob> {
    const users = await this.getAllUsers();
    
    if (format === 'excel') {
      return this.generateExcelFile(users);
    } else {
      return this.generateCSVFile(users);
    }
  },

  // =====================================================
  // USER PROFILE MANAGEMENT
  // =====================================================

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error(error.message);
    }

    return data as User[];
  },

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data as User;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }

    return data as User;
  },

  async getUserByIdentifier(identifier: string, type: string): Promise<User | null> {
    const field = type === 'student' ? 'student_id' :
                 type === 'teacher' ? 'teacher_id' : 'employee_id';

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq(field, identifier)
      .single();

    if (error) {
      return null;
    }

    return data as User;
  },

  async updateUserProfile(id: string, updates: Partial<MemberData>): Promise<User> {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw new Error(error.message);
    }

    // Log activity
    await this.logActivity(id, 'profile_update', 'User profile updated');

    return data as User;
  },

  async updateUserStatus(id: string, status: string): Promise<User> {
    return this.updateUserProfile(id, { status: status as any });
  },

  async updateUserAccessLevel(id: string, accessLevel: string): Promise<User> {
    return this.updateUserProfile(id, { accessLevel: accessLevel as any });
  },

  async updateUserBorrowLimits(id: string, borrowLimit: number, borrowDuration: number): Promise<User> {
    return this.updateUserProfile(id, { borrowLimit, borrowDuration });
  },

  // =====================================================
  // MEMBERSHIP MANAGEMENT
  // =====================================================

  async createMembershipType(membershipData: Omit<MembershipType, 'id' | 'created_at' | 'updated_at'>): Promise<MembershipType> {
    const { data, error } = await supabase
      .from('membership_types')
      .insert([{
        ...membershipData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating membership type:', error);
      throw new Error(error.message);
    }

    return data as MembershipType;
  },

  async getMembershipTypes(): Promise<MembershipType[]> {
    const { data, error } = await supabase
      .from('membership_types')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching membership types:', error);
      throw new Error(error.message);
    }

    return data as MembershipType[];
  },

  async updateMembershipType(id: string, updates: Partial<MembershipType>): Promise<MembershipType> {
    const { data, error } = await supabase
      .from('membership_types')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating membership type:', error);
      throw new Error(error.message);
    }

    return data as MembershipType;
  },

  async assignMembershipType(userId: string, membershipTypeId: string): Promise<User> {
    const membershipType = await this.getMembershipTypeById(membershipTypeId);
    if (!membershipType) {
      throw new Error('Membership type not found');
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + membershipType.validityMonths);

    return this.updateUserProfile(userId, {
      membershipType: membershipType.name.toLowerCase().replace(/\s+/g, '_') as any,
      membershipExpiry: expiryDate.toISOString(),
      borrowLimit: membershipType.borrowLimit,
      borrowDuration: 7 // Default 7 days
    });
  },

  async getMembershipTypeById(id: string): Promise<MembershipType | null> {
    const { data, error } = await supabase
      .from('membership_types')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data as MembershipType;
  },

  // =====================================================
  // ACCESS CONTROL
  // =====================================================

  async setAccessControl(accessControl: AccessControl): Promise<void> {
    const { error } = await supabase
      .from('user_access_control')
      .upsert([{
        user_id: accessControl.userId,
        role: accessControl.role,
        module_access: accessControl.moduleAccess,
        collection_access: accessControl.collectionAccess,
        access_hours: accessControl.accessHours,
        ip_restrictions: accessControl.ipRestrictions,
        session_timeout: accessControl.sessionTimeout,
        two_factor_auth: accessControl.twoFactorAuth,
        updated_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error setting access control:', error);
      throw new Error(error.message);
    }
  },

  async getAccessControl(userId: string): Promise<AccessControl | null> {
    const { data, error } = await supabase
      .from('user_access_control')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return null;
    }

    return data as AccessControl;
  },

  async suspendUserAccess(userId: string, reason?: string): Promise<void> {
    await this.updateUserStatus(userId, 'suspended');
    await this.logActivity(userId, 'access_suspended', `User access suspended: ${reason || 'No reason provided'}`);
  },

  async restoreUserAccess(userId: string): Promise<void> {
    await this.updateUserStatus(userId, 'active');
    await this.logActivity(userId, 'access_restored', 'User access restored');
  },

  // =====================================================
  // USER STATISTICS
  // =====================================================

  async getUserStatistics(period: string = 'month'): Promise<UserStatistics> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from(TABLES.USERS)
      .select('*');

    if (usersError) {
      throw new Error(usersError.message);
    }

    // Get new registrations in period
    const { data: newUsers, error: newUsersError } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (newUsersError) {
      throw new Error(newUsersError.message);
    }

    // Get borrow records for statistics
    const { data: borrowRecords, error: borrowError } = await supabase
      .from(TABLES.BORROW_RECORDS)
      .select('user_id, created_at');

    if (borrowError) {
      throw new Error(borrowError.message);
    }

    // Calculate statistics
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const newRegistrations = newUsers.length;
    const expiredMemberships = users.filter(u => 
      u.membership_expiry && new Date(u.membership_expiry) < now
    ).length;

    // Users by type
    const usersByType = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Users by status
    const usersByStatus = users.reduce((acc, user) => {
      acc[user.status || 'active'] = (acc[user.status || 'active'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top borrowers
    const borrowCounts = borrowRecords.reduce((acc, record) => {
      acc[record.user_id] = (acc[record.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topBorrowers = Object.entries(borrowCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([userId, count]) => {
        const user = users.find(u => u.id === userId);
        return {
          userId,
          userName: user?.name || 'Unknown',
          borrowCount: count
        };
      });

    const averageBorrows = borrowRecords.length / totalUsers || 0;

    return {
      totalUsers,
      activeUsers,
      newRegistrations,
      expiredMemberships,
      usersByType,
      usersByStatus,
      averageBorrows,
      topBorrowers
    };
  },

  // =====================================================
  // UTILITY FUNCTIONS
  // =====================================================

  generatePassword(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  },

  async logActivity(userId: string, type: string, description: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.ACTIVITIES)
      .insert([{
        user_id: userId,
        type,
        description,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error logging activity:', error);
    }
  },

  generateExcelFile(users: User[]): Blob {
    // This would typically use a library like xlsx
    // For now, return a simple CSV-like structure
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Created At'];
    const rows = users.map(user => [
      user.id,
      user.name,
      user.email,
      user.role,
      user.status || 'active',
      user.created_at
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return new Blob([csvContent], { type: 'text/csv' });
  },

  generateCSVFile(users: User[]): Blob {
    return this.generateExcelFile(users);
  },

  // =====================================================
  // DELETE USER
  // =====================================================

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.USERS)
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      throw new Error(error.message);
    }
  },

  // =====================================================
  // SEARCH AND FILTER
  // =====================================================

  async searchUsers(query: string, filters?: {
    role?: string;
    status?: string;
    membershipType?: string;
  }): Promise<User[]> {
    let queryBuilder = supabase
      .from(TABLES.USERS)
      .select('*');

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,email.ilike.%${query}%,student_id.ilike.%${query}%,teacher_id.ilike.%${query}%,employee_id.ilike.%${query}%`);
    }

    if (filters?.role) {
      queryBuilder = queryBuilder.eq('role', filters.role);
    }

    if (filters?.status) {
      queryBuilder = queryBuilder.eq('status', filters.status);
    }

    if (filters?.membershipType) {
      queryBuilder = queryBuilder.eq('membership_type', filters.membershipType);
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching users:', error);
      throw new Error(error.message);
    }

    return data as User[];
  }
};

export default memberService;


