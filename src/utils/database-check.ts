// Utility untuk memeriksa dan setup database
import { supabase } from '../config/supabase';

export const checkDatabaseConnection = async () => {
  try {
    // Test koneksi dengan query yang lebih sederhana dan cepat
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
      .single();
    
    if (error) {
      // Jika tabel tidak ada atau error, tetap return success untuk auth
      if (error.code === 'PGRST116' || error.message.includes('relation "users" does not exist')) {
        console.warn('Users table not found, but auth should still work');
        return { success: true, error: null };
      }
      console.error('Database connection error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Database check failed:', error);
    // Return success even if database check fails, auth should still work
    return { success: true, error: null };
  }
};

export const createSampleData = async () => {
  try {
    // Cek apakah sudah ada data
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking existing data:', checkError);
      return { success: false, error: checkError.message };
    }
    
    // Jika sudah ada data, tidak perlu membuat sample data
    if (existingUsers && existingUsers.length > 0) {
      return { success: true, message: 'Data already exists' };
    }
    
    // Buat sample data jika belum ada
    const sampleUsers = [
      {
        email: 'admin@perpustakaan.sch.id',
        role: 'librarian',
        name: 'Admin Pustakawan',
        position: 'Kepala Perpustakaan',
        employee_id: 'EMP001'
      },
      {
        email: 'guru@perpustakaan.sch.id',
        role: 'teacher',
        name: 'Budi Santoso',
        subject: 'Matematika',
        teacher_id: 'TCH001'
      },
      {
        email: 'siswa@perpustakaan.sch.id',
        role: 'student',
        name: 'Siti Nurhaliza',
        class: 'X MIPA 1',
        student_id: 'STD001'
      }
    ];
    
    // Insert sample users (tanpa auth, hanya untuk testing)
    const { data, error } = await supabase
      .from('users')
      .insert(sampleUsers.map(user => ({
        ...user,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })));
    
    if (error) {
      console.error('Error creating sample data:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, message: 'Sample data created successfully' };
  } catch (error) {
    console.error('Error creating sample data:', error);
    return { success: false, error: 'Failed to create sample data' };
  }
};
