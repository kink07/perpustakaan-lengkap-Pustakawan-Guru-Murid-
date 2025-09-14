// Database service functions
// Supabase integration

import { supabase, TABLES } from '../config/supabase';
import { 
  User, Book, BorrowRecord, Reservation, Activity, Notification, LibraryStats, CategoryStats, CirculationTrend,
  StudentFavorite, ReadingHistory, DigitalContent, DigitalContentProgress, CurriculumBook, TeachingMaterial,
  Class, ClassAssignment, AssignmentSubmission, NotificationSettings, ExtendedReservation,
  CatalogBook, BookLabel, ImportExportLog, ExcelBookData,
  CirculationRecord, ActiveBorrowing, Visitor, InventoryItem, Report, LibrarySetting
} from '../types/database';

// Database service functions using Supabase
export const databaseService = {
  // User operations
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return data as User[];
  },

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
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
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
    
    return data as User;
  },

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    // This function is now handled by signUp for authentication
    // For creating users without auth, use direct database insert
    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as User;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    console.log('Database updateUser called with:', { id, updates });
    
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Database updateUser error:', error);
      throw new Error(error.message);
    }
    
    console.log('Database updateUser success:', data);
    return data as User;
  },

  async uploadProfileImage(userId: string, file: File): Promise<string> {
    console.log('Uploading profile image for user:', userId);
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `profile.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Replace existing file
        });
      
      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      
      console.log('Profile image uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload profile image error:', error);
      // Fallback: return data URL if upload fails
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  },

  async uploadBookCover(bookId: string, file: File): Promise<string> {
    console.log('Uploading book cover for book:', bookId);
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `cover.${fileExt}`;
      const filePath = `${bookId}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('book-covers')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Replace existing file
        });
      
      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('book-covers')
        .getPublicUrl(filePath);
      
      console.log('Book cover uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload book cover error:', error);
      // Fallback: return data URL if upload fails
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  },

  async uploadBookDigitalFile(bookId: string, file: File): Promise<string> {
    console.log('Uploading digital file for book:', bookId);
    
    try {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `${bookId}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('book-digital-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false // Don't replace, keep multiple files
        });
      
      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('book-digital-files')
        .getPublicUrl(filePath);
      
      console.log('Digital file uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload digital file error:', error);
      throw error;
    }
  },

  async deleteBookCover(bookId: string): Promise<boolean> {
    try {
      // List files in the book's folder
      const { data: files, error: listError } = await supabase.storage
        .from('book-covers')
        .list(bookId);
      
      if (listError) {
        console.error('Error listing cover files:', listError);
        return false;
      }
      
      // Delete all cover files for this book
      if (files && files.length > 0) {
        const filePaths = files.map(file => `${bookId}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from('book-covers')
          .remove(filePaths);
        
        if (deleteError) {
          console.error('Error deleting cover files:', deleteError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Delete book cover error:', error);
      return false;
    }
  },

  async deleteBookDigitalFile(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('book-digital-files')
        .remove([filePath]);
      
      if (error) {
        console.error('Error deleting digital file:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Delete digital file error:', error);
      return false;
    }
  },

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
  },

  // Book operations
  async getBooks(): Promise<Book[]> {
    try {
      const { data, error } = await supabase
        .from('catalog_books')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching books:', error);
        // Return empty array if table doesn't exist or has no data
        return [];
      }
      
      return data as Book[] || [];
    } catch (error) {
      console.error('Error in getBooks:', error);
      return [];
    }
  },

  // Convert Book to BookData format for compatibility
  convertBookToBookData(book: Book): any {
    return {
      id: book.id,
      title: book.title,
      subtitle: book.subtitle || '',
      author: book.author,
      coAuthor: book.co_author || '',
      editor: book.editor || '',
      translator: book.translator || '',
      illustrator: book.illustrator || '',
      category: book.category,
      publisher: book.publisher,
      publicationPlace: book.publication_place,
      publicationYear: book.publication_year,
      edition: book.edition || '',
      isbn: book.isbn || '',
      issn: book.issn || '',
      callNumber: book.call_number,
      deweyNumber: book.dewey_number,
      pages: book.pages,
      dimensions: book.dimensions,
      language: book.language,
      series: book.series || '',
      volume: book.volume || '',
      notes: book.notes || '',
      subjects: book.subjects || [],
      physicalDescription: book.physical_description || '',
      contentType: book.content_type || '',
      mediaType: book.media_type || '',
      carrierType: book.carrier_type || '',
      location: book.location,
      copyNumber: book.copy_number || 1,
      barcode: book.barcode || '',
      price: book.price || '',
      source: book.source || '',
      acquisitionDate: book.acquisition_date || '',
      condition: book.condition || '',
      status: book.status === 'available' ? 'Tersedia' : 
              book.status === 'borrowed' ? 'Dipinjam' :
              book.status === 'maintenance' ? 'Perawatan' : 'Hilang',
      abstract: book.abstract || '',
      cover: book.cover,
      digitalFiles: book.digital_files || []
    };
  },

  async getBookById(id: string): Promise<Book | null> {
    const { data, error } = await supabase
      .from('catalog_books')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching book:', error);
      return null;
    }
    
    return data as Book;
  },

  async createBook(book: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Promise<Book> {
    const { data, error } = await supabase
      .from('catalog_books')
      .insert([{
        ...book,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as Book;
  },

  async updateBook(id: string, updates: Partial<Book>): Promise<Book> {
    const { data, error } = await supabase
      .from('catalog_books')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as Book;
  },

  async deleteBook(id: string): Promise<void> {
    const { error } = await supabase
      .from('catalog_books')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
  },

  // Borrow operations
  async getBorrowRecords(): Promise<BorrowRecord[]> {
    const { data, error } = await supabase
      .from('borrow_records')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching borrow records:', error);
      return [];
    }
    
    return data as BorrowRecord[];
  },

  async getBorrowRecordsByUser(userId: string): Promise<BorrowRecord[]> {
    const { data, error } = await supabase
      .from('borrow_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user borrow records:', error);
      return [];
    }
    
    return data as BorrowRecord[];
  },

  async createBorrowRecord(record: Omit<BorrowRecord, 'id' | 'created_at' | 'updated_at'>): Promise<BorrowRecord> {
    const { data, error } = await supabase
      .from('borrow_records')
      .insert([{
        ...record,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as BorrowRecord;
  },

  async updateBorrowRecord(id: string, updates: Partial<BorrowRecord>): Promise<BorrowRecord> {
    const { data, error } = await supabase
      .from('borrow_records')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as BorrowRecord;
  },

  // Reservation operations
  async getReservations(): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
    
    return data as Reservation[];
  },

  async getReservationsByUser(userId: string): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user reservations:', error);
      return [];
    }
    
    return data as Reservation[];
  },

  async createReservation(reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>): Promise<Reservation> {
    const { data, error } = await supabase
      .from('reservations')
      .insert([{
        ...reservation,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as Reservation;
  },

  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation> {
    const { data, error } = await supabase
      .from('reservations')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as Reservation;
  },

  async deleteReservation(id: string): Promise<void> {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
  },

  // Activity operations
  async getActivities(): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
    
    return data as Activity[];
  },

  async getActivitiesByUser(userId: string): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }
    
    return data as Activity[];
  },

  async createActivity(activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> {
    const { data, error } = await supabase
      .from('activities')
      .insert([{
        ...activity,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as Activity;
  },

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    return data as Notification[];
  },

  async markNotificationAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
  },

  // Statistics operations
  async getLibraryStats(): Promise<LibraryStats> {
    try {
      // Get books count by status
      const { data: booksData, error: booksError } = await supabase
        .from('catalog_books')
        .select('status');
      
      if (booksError) throw booksError;

      const totalBooks = booksData.length;
      const availableBooks = booksData.filter(book => book.status === 'available').length;
      const borrowedBooks = booksData.filter(book => book.status === 'borrowed').length;
      const maintenanceBooks = booksData.filter(book => book.status === 'maintenance').length;
      const lostBooks = booksData.filter(book => book.status === 'lost').length;

      // Get users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;

      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's borrows
      const { count: totalBorrowsToday, error: borrowsTodayError } = await supabase
        .from('borrow_records')
        .select('*', { count: 'exact', head: true })
        .gte('borrow_date', today);
      
      if (borrowsTodayError) throw borrowsTodayError;

      // Get this month's data
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthStart = thisMonth.toISOString();

      const { count: totalBorrowsThisMonth, error: borrowsMonthError } = await supabase
        .from('borrow_records')
        .select('*', { count: 'exact', head: true })
        .gte('borrow_date', thisMonthStart);
      
      if (borrowsMonthError) throw borrowsMonthError;

      const { count: newUsersThisMonth, error: newUsersMonthError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonthStart);
      
      if (newUsersMonthError) throw newUsersMonthError;

      const { count: newBooksThisMonth, error: newBooksMonthError } = await supabase
        .from('catalog_books')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonthStart);
      
      if (newBooksMonthError) throw newBooksMonthError;

      return {
        total_books: totalBooks,
        available_books: availableBooks,
        borrowed_books: borrowedBooks,
        maintenance_books: maintenanceBooks,
        lost_books: lostBooks,
        total_users: totalUsers || 0,
        active_users: totalUsers || 0, // For now, same as total users
        total_borrows_today: totalBorrowsToday || 0,
        total_visitors_today: 0, // This would need visitor tracking
        total_borrows_this_month: totalBorrowsThisMonth || 0,
        new_users_this_month: newUsersThisMonth || 0,
        new_books_this_month: newBooksThisMonth || 0,
        average_rating: 0, // This would need rating system
      };
    } catch (error) {
      console.error('Error fetching library stats:', error);
      return {
        total_books: 0,
        available_books: 0,
        borrowed_books: 0,
        maintenance_books: 0,
        lost_books: 0,
        total_users: 0,
        active_users: 0,
        total_borrows_today: 0,
        total_visitors_today: 0,
        total_borrows_this_month: 0,
        new_users_this_month: 0,
        new_books_this_month: 0,
        average_rating: 0,
      };
    }
  },

  async getCategoryStats(): Promise<CategoryStats[]> {
    try {
      const { data, error } = await supabase
        .from('catalog_books')
        .select('category');
      
      if (error) throw error;

      const categoryCounts: { [key: string]: number } = {};
      data.forEach(book => {
        categoryCounts[book.category] = (categoryCounts[book.category] || 0) + 1;
      });

      const total = data.length;
      const categoryStats: CategoryStats[] = Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }));

      return categoryStats.sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error fetching category stats:', error);
      return [];
    }
  },

  async getCirculationTrends(days: number = 7): Promise<CirculationTrend[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const { data: borrowsData, error: borrowsError } = await supabase
        .from('borrow_records')
        .select('borrow_date, return_date')
        .gte('borrow_date', startDate.toISOString().split('T')[0])
        .lte('borrow_date', endDate.toISOString().split('T')[0]);
      
      if (borrowsError) throw borrowsError;

      // Group by date
      const trends: { [key: string]: { borrows: number; returns: number } } = {};
      
      borrowsData.forEach(record => {
        const borrowDate = record.borrow_date.split('T')[0];
        if (!trends[borrowDate]) {
          trends[borrowDate] = { borrows: 0, returns: 0 };
        }
        trends[borrowDate].borrows++;
        
        if (record.return_date) {
          const returnDate = record.return_date.split('T')[0];
          if (!trends[returnDate]) {
            trends[returnDate] = { borrows: 0, returns: 0 };
          }
          trends[returnDate].returns++;
        }
      });

      // Convert to array and fill missing dates
      const result: CirculationTrend[] = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        result.unshift({
          date: dateStr,
          borrows: trends[dateStr]?.borrows || 0,
          returns: trends[dateStr]?.returns || 0
        });
      }

      return result;
    } catch (error) {
      console.error('Error fetching circulation trends:', error);
      return [];
    }
  },

  // Authentication operations
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      console.log('Attempting to sign in with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase auth error:', error);
        return { user: null, error: error.message };
      }

      if (data.user) {
        console.log('Auth successful, user ID:', data.user.id);
        console.log('User data:', data.user);
        
        // Get user profile from database to get correct role
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userError) {
          console.error('Error fetching user profile:', userError);
          // Return error if user not found in database
          return { user: null, error: 'Profil pengguna tidak ditemukan. Silakan hubungi administrator.' };
        }
        
        console.log('User profile from database:', userData);
        return { user: userData as User, error: null };
      }

      console.log('No user data returned');
      return { user: null, error: 'Login gagal' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: 'Terjadi kesalahan saat login' };
    }
  },

  async signUp(email: string, password: string, userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<{ user: User | null; error: string | null }> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (authData.user) {
        // Create user profile in users table
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: userData.email,
            role: userData.role,
            name: userData.name,
            position: userData.position,
            employee_id: userData.employee_id,
            subject: userData.subject,
            teacher_id: userData.teacher_id,
            class: userData.class,
            student_id: userData.student_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (profileError) {
          return { user: null, error: 'Gagal membuat profil pengguna' };
        }

        return { user: userProfile as User, error: null };
      }

      return { user: null, error: 'Registrasi gagal' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: 'Terjadi kesalahan saat registrasi' };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: 'Terjadi kesalahan saat logout' };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        return null;
      }

      // Get user profile from database to get correct role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user profile:', userError);
        // Return null if user not found in database
        return null;
      }

      return userData as User;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Student-specific functions
  async getStudentFavorites(userId: string): Promise<StudentFavorite[]> {
    const { data, error } = await supabase
      .from(TABLES.STUDENT_FAVORITES)
      .select(`
        *,
        book:catalog_books(*)
      `)
      .eq('user_id', userId)
      .order('date_added', { ascending: false });
    
    if (error) {
      console.error('Error fetching student favorites:', error);
      return [];
    }
    
    return data || [];
  },

  async addStudentFavorite(userId: string, bookId: string, data: Partial<StudentFavorite>): Promise<StudentFavorite | null> {
    try {
      // 1) Cek apakah buku ada di catalog_books
      const { data: book, error: bookErr } = await supabase
        .from('catalog_books')
        .select('id')
        .eq('id', bookId)
        .maybeSingle();

      if (bookErr) {
        console.error('Error checking book existence:', bookErr);
        return null;
      }
      if (!book) {
        console.error('Book not found:', bookId);
        return null;
      }

      // 2) Cek apakah favorite sudah ada untuk user ini
      const { data: existing, error: existErr } = await supabase
        .from(TABLES.STUDENT_FAVORITES)
        .select('id')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .maybeSingle();

      if (existErr) {
        console.error('Error checking existing favorite:', existErr);
        // Lanjutkan mencoba insert, tapi laporkan error
      }
      if (existing) {
        console.log('Favorite already exists, returning existing record');
        return existing as StudentFavorite;
      }

      // 3) Insert favorite
      const { data: result, error } = await supabase
        .from(TABLES.STUDENT_FAVORITES)
        .insert({
          user_id: userId,
          book_id: bookId,
          personal_rating: data.personal_rating || 5,
          notes: data.notes,
          tags: data.tags || [],
          read_count: 0
        })
        .select(`
          *,
          book:catalog_books(*)
        `)
        .single();
      
      if (error) {
        console.error('Error adding student favorite:', error);
        // Postgres FK violation code 23503
        if (error.code === '23503') {
          console.error('Foreign key constraint violation - book not found in catalog_books');
        } else if (error.code === '23505' || error.status === 409) {
          console.error('Duplicate entry - favorite already exists');
        } else {
          console.error('Unknown error adding favorite:', error);
        }
        return null;
      }
      
      return result;
    } catch (e) {
      console.error('Unhandled error in addStudentFavorite:', e);
      return null;
    }
  },

  async removeStudentFavorite(userId: string, bookId: string): Promise<boolean> {
    const { error } = await supabase
      .from(TABLES.STUDENT_FAVORITES)
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId);
    
    if (error) {
      console.error('Error removing student favorite:', error);
      return false;
    }
    
    return true;
  },

  async toggleStudentFavorite(userId: string, bookId: string, data: Partial<StudentFavorite>): Promise<{ data: any; removed: boolean } | null> {
    try {
      // Cek apakah favorite sudah ada
      const { data: existing, error: existErr } = await supabase
        .from(TABLES.STUDENT_FAVORITES)
        .select('id')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .maybeSingle();

      if (existErr) {
        console.error('Error checking existing favorite for toggle:', existErr);
      }

      if (existing) {
        // Hapus favorite
        const { error } = await supabase
          .from(TABLES.STUDENT_FAVORITES)
          .delete()
          .eq('id', existing.id);

        if (error) {
          console.error('Error deleting favorite:', error);
          return null;
        }
        console.log('Favorite removed successfully');
        return { data: { removed: true }, removed: true };
      } else {
        // Tambah favorite (gunakan addStudentFavorite untuk konsistensi)
        const result = await this.addStudentFavorite(userId, bookId, data);
        if (result) {
          console.log('Favorite added successfully');
          return { data: result, removed: false };
        }
        return null;
      }
    } catch (e) {
      console.error('Unhandled error in toggleStudentFavorite:', e);
      return null;
    }
  },

  async getStudentReadingHistory(userId: string): Promise<ReadingHistory[]> {
    const { data, error } = await supabase
      .from('reading_history')
      .select(`
        *,
        book:catalog_books(*)
      `)
      .eq('user_id', userId)
      .order('borrow_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching reading history:', error);
      return [];
    }
    
    return data || [];
  },

  async addReadingHistory(userId: string, data: Partial<ReadingHistory>): Promise<ReadingHistory | null> {
    const { data: result, error } = await supabase
      .from('reading_history')
      .insert({
        user_id: userId,
        book_id: data.book_id!,
        borrow_date: data.borrow_date!,
        return_date: data.return_date!,
        rating: data.rating || 5,
        review: data.review,
        reading_time: data.reading_time || 0,
        completion_status: data.completion_status || 'completed'
      })
      .select(`
        *,
        book:catalog_books(*)
      `)
      .single();
    
    if (error) {
      console.error('Error adding reading history:', error);
      return null;
    }
    
    return result;
  },

  async getStudentReservations(userId: string): Promise<ExtendedReservation[]> {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        book:catalog_books(*)
      `)
      .eq('user_id', userId)
      .order('reservation_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching student reservations:', error);
      return [];
    }
    
    return data || [];
  },

  async createStudentReservation(userId: string, data: Partial<ExtendedReservation>): Promise<ExtendedReservation | null> {
    const { data: result, error } = await supabase
      .from('reservations')
      .insert({
        user_id: userId,
        book_id: data.book_id!,
        reservation_date: data.reservation_date || new Date().toISOString(),
        status: 'pending',
        notes: data.notes,
        notification_email: data.notification_email || true,
        notification_sms: data.notification_sms || false,
        notification_whatsapp: data.notification_whatsapp || false,
        priority: data.priority || 1,
        estimated_ready_date: data.estimated_ready_date
      })
      .select(`
        *,
        book:catalog_books(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating student reservation:', error);
      return null;
    }
    
    return result;
  },

  async getDigitalContent(): Promise<DigitalContent[]> {
    const { data, error } = await supabase
      .from('digital_content')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching digital content:', error);
      return [];
    }
    
    return data || [];
  },

  async getDigitalContentProgress(userId: string): Promise<DigitalContentProgress[]> {
    const { data, error } = await supabase
      .from('digital_content_progress')
      .select(`
        *,
        content:digital_content(*)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching digital content progress:', error);
      return [];
    }
    
    return data || [];
  },

  async updateDigitalContentProgress(userId: string, contentId: string, progress: Partial<DigitalContentProgress>): Promise<DigitalContentProgress | null> {
    const { data: result, error } = await supabase
      .from('digital_content_progress')
      .upsert({
        user_id: userId,
        content_id: contentId,
        progress_percentage: progress.progress_percentage || 0,
        last_position: progress.last_position || 0,
        completed_at: progress.completed_at
      })
      .select(`
        *,
        content:digital_content(*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating digital content progress:', error);
      return null;
    }
    
    return result;
  },

  // Teacher-specific functions
  async getCurriculumBooks(teacherId: string): Promise<CurriculumBook[]> {
    const { data, error } = await supabase
      .from('curriculum_books')
      .select(`
        *,
        book:catalog_books(*)
      `)
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching curriculum books:', error);
      return [];
    }
    
    return data || [];
  },

  async createCurriculumBook(teacherId: string, data: Partial<CurriculumBook>): Promise<CurriculumBook | null> {
    const { data: result, error } = await supabase
      .from('curriculum_books')
      .insert({
        teacher_id: teacherId,
        book_id: data.book_id!,
        subject: data.subject!,
        grade: data.grade!,
        chapter: data.chapter,
        learning_objectives: data.learning_objectives || [],
        difficulty: data.difficulty || 'intermediate',
        estimated_reading_time: data.estimated_reading_time || 0,
        assigned_classes: data.assigned_classes || [],
        completion_rate: 0,
        student_feedback: 0.0,
        digital_formats: data.digital_formats || [],
        supplementary_materials: data.supplementary_materials || [],
        status: 'active'
      })
      .select(`
        *,
        book:catalog_books(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating curriculum book:', error);
      return null;
    }
    
    return result;
  },

  async getTeachingMaterials(teacherId: string): Promise<TeachingMaterial[]> {
    const { data, error } = await supabase
      .from('teaching_materials')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching teaching materials:', error);
      return [];
    }
    
    return data || [];
  },

  async createTeachingMaterial(teacherId: string, data: Partial<TeachingMaterial>): Promise<TeachingMaterial | null> {
    const { data: result, error } = await supabase
      .from('teaching_materials')
      .insert({
        teacher_id: teacherId,
        title: data.title!,
        subject: data.subject!,
        grade: data.grade,
        material_type: data.material_type!,
        content: data.content,
        file_path: data.file_path,
        file_type: data.file_type,
        file_size: data.file_size,
        tags: data.tags || [],
        is_public: data.is_public || false,
        download_count: 0,
        view_count: 0
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating teaching material:', error);
      return null;
    }
    
    return result;
  },

  async getClasses(teacherId?: string): Promise<Class[]> {
    let query = supabase
      .from('classes')
      .select(`
        *,
        teacher:users(*)
      `)
      .eq('is_active', true)
      .order('class_name', { ascending: true });
    
    if (teacherId) {
      query = query.eq('teacher_id', teacherId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
    
    return data || [];
  },

  async getClassAssignments(teacherId: string): Promise<ClassAssignment[]> {
    const { data, error } = await supabase
      .from('class_assignments')
      .select(`
        *,
        book:catalog_books(*)
      `)
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching class assignments:', error);
      return [];
    }
    
    return data || [];
  },

  async createClassAssignment(teacherId: string, data: Partial<ClassAssignment>): Promise<ClassAssignment | null> {
    const { data: result, error } = await supabase
      .from('class_assignments')
      .insert({
        teacher_id: teacherId,
        book_id: data.book_id!,
        class_name: data.class_name!,
        assignment_title: data.assignment_title!,
        instructions: data.instructions,
        due_date: data.due_date,
        assessment_type: data.assessment_type,
        points: data.points || 0,
        status: 'active'
      })
      .select(`
        *,
        book:catalog_books(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating class assignment:', error);
      return null;
    }
    
    return result;
  },

  async getAssignmentSubmissions(assignmentId: string): Promise<AssignmentSubmission[]> {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .select(`
        *,
        assignment:class_assignments(*),
        student:users(*)
      `)
      .eq('assignment_id', assignmentId)
      .order('submitted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching assignment submissions:', error);
      return [];
    }
    
    return data || [];
  },

  async submitAssignment(assignmentId: string, studentId: string, data: Partial<AssignmentSubmission>): Promise<AssignmentSubmission | null> {
    const { data: result, error } = await supabase
      .from('assignment_submissions')
      .insert({
        assignment_id: assignmentId,
        student_id: studentId,
        submission_text: data.submission_text,
        file_path: data.file_path,
        status: 'submitted'
      })
      .select(`
        *,
        assignment:class_assignments(*),
        student:users(*)
      `)
      .single();
    
    if (error) {
      console.error('Error submitting assignment:', error);
      return null;
    }
    
    return result;
  },

  // Notification settings
  async getNotificationSettings(userId: string): Promise<NotificationSettings | null> {
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching notification settings:', error);
      return null;
    }
    
    return data;
  },

  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings | null> {
    const { data: result, error } = await supabase
      .from('notification_settings')
      .upsert({
        user_id: userId,
        ...settings
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating notification settings:', error);
      return null;
    }
    
    return result;
  },

  // =====================================================
  // BOOKMARK FUNCTIONS
  // =====================================================

  async getUserBookmarks(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from(TABLES.BOOKMARKS)
      .select(`
        *,
        book:catalog_books(*)
      `)
      .eq('user_id', userId)
      .order('date_added', { ascending: false });
    
    if (error) {
      console.error('Error fetching user bookmarks:', error);
      return [];
    }
    
    return data || [];
  },

  async addBookmark(userId: string, bookId: string, bookmarkData: {
    notes?: string;
    tags?: string[];
  }): Promise<any | null> {
    try {
      // 1) Cek apakah buku ada di catalog_books
      const { data: book, error: bookErr } = await supabase
        .from('catalog_books')
        .select('id')
        .eq('id', bookId)
        .maybeSingle();

      if (bookErr) {
        console.error('Error checking book existence for bookmark:', bookErr);
        return null;
      }
      if (!book) {
        console.error('Book not found for bookmark:', bookId);
        return null;
      }

      // 2) Cek apakah bookmark sudah ada untuk user ini
      const { data: existing, error: existErr } = await supabase
        .from(TABLES.BOOKMARKS)
        .select('id')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .maybeSingle();

      if (existErr) {
        console.error('Error checking existing bookmark:', existErr);
        // Lanjutkan mencoba insert, tapi laporkan error
      }
      if (existing) {
        console.log('Bookmark already exists, returning existing record');
        return existing;
      }

      // 3) Insert bookmark
      const { data, error } = await supabase
        .from(TABLES.BOOKMARKS)
        .insert({
          user_id: userId,
          book_id: bookId,
          notes: bookmarkData.notes || '',
          tags: bookmarkData.tags || []
        })
        .select(`
          *,
          book:catalog_books(*)
        `)
        .single();
      
      if (error) {
        console.error('Error adding bookmark:', error);
        // Postgres FK violation code 23503
        if (error.code === '23503') {
          console.error('Foreign key constraint violation - book not found in catalog_books');
        } else if (error.code === '23505' || error.status === 409) {
          console.error('Duplicate entry - bookmark already exists');
        } else {
          console.error('Unknown error adding bookmark:', error);
        }
        return null;
      }
      
      return data;
    } catch (e) {
      console.error('Unhandled error in addBookmark:', e);
      return null;
    }
  },

  async removeBookmark(userId: string, bookId: string): Promise<boolean> {
    const { error } = await supabase
      .from(TABLES.BOOKMARKS)
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId);
    
    if (error) {
      console.error('Error removing bookmark:', error);
      return false;
    }
    
    return true;
  },

  async toggleBookmark(userId: string, bookId: string, bookmarkData: {
    notes?: string;
    tags?: string[];
  }): Promise<{ data: any; removed: boolean } | null> {
    try {
      // Cek apakah bookmark sudah ada
      const { data: existing, error: existErr } = await supabase
        .from(TABLES.BOOKMARKS)
        .select('id')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .maybeSingle();

      if (existErr) {
        console.error('Error checking existing bookmark for toggle:', existErr);
      }

      if (existing) {
        // Hapus bookmark
        const { error } = await supabase
          .from(TABLES.BOOKMARKS)
          .delete()
          .eq('id', existing.id);

        if (error) {
          console.error('Error deleting bookmark:', error);
          return null;
        }
        console.log('Bookmark removed successfully');
        return { data: { removed: true }, removed: true };
      } else {
        // Tambah bookmark (gunakan addBookmark untuk konsistensi)
        const result = await this.addBookmark(userId, bookId, bookmarkData);
        if (result) {
          console.log('Bookmark added successfully');
          return { data: result, removed: false };
        }
        return null;
      }
    } catch (e) {
      console.error('Unhandled error in toggleBookmark:', e);
      return null;
    }
  },

  async updateBookmark(userId: string, bookmarkId: number, bookmarkData: {
    notes?: string;
    tags?: string[];
  }): Promise<any | null> {
    const { data, error } = await supabase
      .from(TABLES.BOOKMARKS)
      .update(bookmarkData)
      .eq('id', bookmarkId)
      .eq('user_id', userId)
      .select(`
        *,
        book:catalog_books(*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating bookmark:', error);
      return null;
    }
    
    return data;
  },

  // =====================================================
  // SHARE FUNCTIONS
  // =====================================================

  async getUserSharedBooks(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('shared_books')
      .select(`
        *,
        book:catalog_books(*)
      `)
      .eq('user_id', userId)
      .order('date_shared', { ascending: false });
    
    if (error) {
      console.error('Error fetching user shared books:', error);
      return [];
    }
    
    return data || [];
  },

  async shareBook(userId: string, bookId: string, shareData: {
    shared_with: string[];
    share_message?: string;
  }): Promise<any | null> {
    const shareLink = `${window.location.origin}/book/${bookId}?shared=true`;
    
    const { data, error } = await supabase
      .from('shared_books')
      .insert({
        user_id: userId,
        book_id: bookId,
        shared_with: shareData.shared_with,
        share_message: shareData.share_message || '',
        share_link: shareLink
      })
      .select(`
        *,
        book:catalog_books(*)
      `)
      .single();
    
    if (error) {
      console.error('Error sharing book:', error);
      return null;
    }
    
    return data;
  },

  async removeSharedBook(userId: string, sharedBookId: number): Promise<boolean> {
    const { error } = await supabase
      .from('shared_books')
      .delete()
      .eq('id', sharedBookId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error removing shared book:', error);
      return false;
    }
    
    return true;
  },

  async trackShareActivity(sharedBookId: number, recipientEmail: string, action: 'viewed' | 'clicked'): Promise<boolean> {
    const updateData: any = {};
    if (action === 'viewed') {
      updateData.viewed_at = new Date().toISOString();
    } else if (action === 'clicked') {
      updateData.clicked_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('share_activity')
      .upsert({
        shared_book_id: sharedBookId,
        recipient_email: recipientEmail,
        ...updateData
      });
    
    if (error) {
      console.error('Error tracking share activity:', error);
      return false;
    }
    
    return true;
  },

  // =====================================================
  // COLLECTION MANAGEMENT FUNCTIONS
  // =====================================================

  // CATALOGING FUNCTIONS
  async getCatalogBooks(): Promise<CatalogBook[]> {
    const { data, error } = await supabase
      .from('catalog_books')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching catalog books:', error);
      return [];
    }
    
    return data || [];
  },

  async getCatalogBookById(id: string): Promise<CatalogBook | null> {
    const { data, error } = await supabase
      .from('catalog_books')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching catalog book:', error);
      return null;
    }
    
    return data;
  },

  async createCatalogBook(bookData: Partial<CatalogBook>): Promise<CatalogBook | null> {
    const { data, error } = await supabase
      .from('catalog_books')
      .insert(bookData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating catalog book:', error);
      return null;
    }
    
    return data;
  },

  async updateCatalogBook(id: string, bookData: Partial<CatalogBook>): Promise<CatalogBook | null> {
    const { data, error } = await supabase
      .from('catalog_books')
      .update(bookData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating catalog book:', error);
      return null;
    }
    
    return data;
  },

  async deleteCatalogBook(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('catalog_books')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting catalog book:', error);
      return false;
    }
    
    return true;
  },

  async updateBookStatus(bookId: string, newStatus: string, reason?: string, changedBy?: string): Promise<boolean> {
    try {
      // Get current status
      const { data: currentBook } = await supabase
        .from('catalog_books')
        .select('status')
        .eq('id', bookId)
        .single();

      // Update book status
      const { error: updateError } = await supabase
        .from('catalog_books')
        .update({ status: newStatus })
        .eq('id', bookId);

      if (updateError) {
        console.error('Error updating book status:', updateError);
        return false;
      }

      // Record status change history
      const { error: historyError } = await supabase
        .from('book_status_history')
        .insert({
          book_id: bookId,
          old_status: currentBook?.status,
          new_status: newStatus,
          reason: reason,
          changed_by: changedBy
        });

      if (historyError) {
        console.error('Error recording status history:', historyError);
      }

      return true;
    } catch (error) {
      console.error('Error updating book status:', error);
      return false;
    }
  },

  // BOOK LABELS FUNCTIONS
  async getBookLabels(): Promise<BookLabel[]> {
    const { data, error } = await supabase
      .from('book_labels')
      .select(`
        *,
        book:catalog_books(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching book labels:', error);
      return [];
    }
    
    return data || [];
  },

  async getBookLabelByBookId(bookId: string): Promise<BookLabel | null> {
    const { data, error } = await supabase
      .from('book_labels')
      .select(`
        *,
        book:catalog_books(*)
      `)
      .eq('book_id', bookId)
      .single();
    
    if (error) {
      console.error('Error fetching book label:', error);
      return null;
    }
    
    return data;
  },

  async createBookLabel(bookId: string, labelData: Partial<BookLabel>): Promise<BookLabel | null> {
    const { data, error } = await supabase
      .from('book_labels')
      .insert({
        book_id: bookId,
        barcode: labelData.barcode || await this.generateBarcode(),
        ...labelData
      })
      .select(`
        *,
        book:catalog_books(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating book label:', error);
      return null;
    }
    
    return data;
  },

  async updateBookLabel(id: string, labelData: Partial<BookLabel>): Promise<BookLabel | null> {
    const { data, error } = await supabase
      .from('book_labels')
      .update(labelData)
      .eq('id', id)
      .select(`
        *,
        book:catalog_books(*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating book label:', error);
      return null;
    }
    
    return data;
  },

  async deleteBookLabel(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('book_labels')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting book label:', error);
      return false;
    }
    
    return true;
  },

  async generateBarcode(): Promise<string> {
    // Generate barcode dengan format: LIB + timestamp + random 4 digit
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `LIB${timestamp}${random}`;
  },

  async printBookLabel(labelId: string): Promise<boolean> {
    // Get current print count first
    const { data: currentLabel } = await supabase
      .from('book_labels')
      .select('print_count')
      .eq('id', labelId)
      .single();

    const { error } = await supabase
      .from('book_labels')
      .update({
        print_count: (currentLabel?.print_count || 0) + 1,
        last_printed_at: new Date().toISOString()
      })
      .eq('id', labelId);
    
    if (error) {
      console.error('Error updating print count:', error);
      return false;
    }
    
    return true;
  },

  // IMPORT/EXPORT FUNCTIONS
  async getImportExportLogs(): Promise<ImportExportLog[]> {
    const { data, error } = await supabase
      .from('import_export_logs')
      .select(`
        *,
        user:users(*)
      `)
      .order('performed_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching import/export logs:', error);
      return [];
    }
    
    return data || [];
  },

  async logImportExport(operation: ImportExportLog): Promise<boolean> {
    const { error } = await supabase
      .from('import_export_logs')
      .insert(operation);
    
    if (error) {
      console.error('Error logging import/export:', error);
      return false;
    }
    
    return true;
  },

  // EXCEL IMPORT/EXPORT FUNCTIONS
  async importBooksFromExcel(booksData: ExcelBookData[], performedBy: string): Promise<{ success: number; errors: any[] }> {
    let successCount = 0;
    const errors: any[] = [];

    try {
      for (const bookData of booksData) {
        try {
          // Map Excel data to database format
          const mappedData: Partial<CatalogBook> = {
            title: bookData.title,
            author: bookData.author,
            isbn: bookData.isbn,
            publisher: bookData.publisher,
            publication_year: bookData.publication_year,
            category: bookData.category,
            subcategory: bookData.subcategory,
            language: bookData.language || 'Indonesia',
            pages: bookData.pages,
            description: bookData.description,
            status: (bookData.status as any) || 'available',
            location: bookData.location,
            acquisition_date: bookData.acquisition_date,
            acquisition_method: bookData.acquisition_method,
            price: bookData.price,
            notes: bookData.notes,
            created_by: performedBy
          };

          // Create catalog book
          const createdBook = await this.createCatalogBook(mappedData);
          
          if (createdBook) {
            // Create book label automatically
            await this.createBookLabel(createdBook.id, {
              label_template: 'standard',
              label_size: 'medium',
              barcode_size: 'medium',
              created_by: performedBy
            });
            
            successCount++;
          }
        } catch (error) {
          errors.push({
            book: bookData,
            error: error
          });
        }
      }

      // Log import operation
      await this.logImportExport({
        id: '', // Will be generated by database
        operation_type: 'import',
        file_name: 'excel_import.xlsx',
        file_type: 'xlsx',
        records_count: booksData.length,
        success_count: successCount,
        error_count: errors.length,
        error_details: errors,
        performed_by: performedBy,
        performed_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error importing books from Excel:', error);
    }

    return { success: successCount, errors };
  },

  async exportBooksToExcel(): Promise<ExcelBookData[]> {
    const books = await this.getCatalogBooks();
    
    return books.map(book => ({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publication_year: book.publication_year,
      category: book.category,
      subcategory: book.subcategory,
      language: book.language,
      pages: book.pages,
      description: book.description,
      status: book.status,
      location: book.location,
      acquisition_date: book.acquisition_date,
      acquisition_method: book.acquisition_method,
      price: book.price,
      notes: book.notes
    }));
  },

  // SEARCH AND FILTER FUNCTIONS
  async searchCatalogBooks(query: string, filters?: {
    category?: string;
    status?: string;
    author?: string;
  }): Promise<CatalogBook[]> {
    let queryBuilder = supabase
      .from('catalog_books')
      .select('*');

    // Text search
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,author.ilike.%${query}%,isbn.ilike.%${query}%`);
    }

    // Apply filters
    if (filters?.category) {
      queryBuilder = queryBuilder.eq('category', filters.category);
    }
    if (filters?.status) {
      queryBuilder = queryBuilder.eq('status', filters.status);
    }
    if (filters?.author) {
      queryBuilder = queryBuilder.ilike('author', `%${filters.author}%`);
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error searching catalog books:', error);
      return [];
    }
    
    return data || [];
  },

  // Visitor operations
  async getVisitorStats(): Promise<any> {
    try {
      // Get today's visitors
      const today = new Date().toISOString().split('T')[0];
      const { data: todayVisitors, error: todayError } = await supabase
        .from('visitors')
        .select('*')
        .gte('visit_date', today)
        .lt('visit_date', new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (todayError) {
        console.error('Error fetching today visitors:', todayError);
      }

      // Get this week's visitors
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: weekVisitors, error: weekError } = await supabase
        .from('visitors')
        .select('*')
        .gte('visit_date', weekAgo.toISOString().split('T')[0]);

      if (weekError) {
        console.error('Error fetching week visitors:', weekError);
      }

      // Get this month's visitors
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const { data: monthVisitors, error: monthError } = await supabase
        .from('visitors')
        .select('*')
        .gte('visit_date', monthAgo.toISOString().split('T')[0]);

      if (monthError) {
        console.error('Error fetching month visitors:', monthError);
      }

      // Get total visitors
      const { data: totalVisitors, error: totalError } = await supabase
        .from('visitors')
        .select('*');

      if (totalError) {
        console.error('Error fetching total visitors:', totalError);
      }

      return {
        todayVisitors: todayVisitors?.length || 0,
        weekVisitors: weekVisitors?.length || 0,
        monthVisitors: monthVisitors?.length || 0,
        totalVisitors: totalVisitors?.length || 0,
        activeVisitors: todayVisitors?.filter(v => !v.check_out_time)?.length || 0
      };
    } catch (error) {
      console.error('Error getting visitor stats:', error);
      return {
        todayVisitors: 0,
        weekVisitors: 0,
        monthVisitors: 0,
        totalVisitors: 0,
        activeVisitors: 0
      };
    }
  },


  // =====================================================
  // CIRCULATION MANAGEMENT FUNCTIONS
  // =====================================================

  async getCirculationRecords(): Promise<CirculationRecord[]> {
    const { data, error } = await supabase
      .from('circulation_records')
      .select(`
        *,
        book:catalog_books(*),
        user:users(*),
        processed_by_user:users!processed_by(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching circulation records:', error);
      return [];
    }
    
    return data as CirculationRecord[];
  },

  async getCirculationRecordById(id: string): Promise<CirculationRecord | null> {
    const { data, error } = await supabase
      .from('circulation_records')
      .select(`
        *,
        book:catalog_books(*),
        user:users(*),
        processed_by_user:users!processed_by(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching circulation record:', error);
      return null;
    }
    
    return data as CirculationRecord;
  },

  async createCirculationRecord(recordData: Partial<CirculationRecord>): Promise<CirculationRecord | null> {
    const { data, error } = await supabase
      .from('circulation_records')
      .insert(recordData)
      .select(`
        *,
        book:catalog_books(*),
        user:users(*),
        processed_by_user:users!processed_by(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating circulation record:', error);
      return null;
    }
    
    return data as CirculationRecord;
  },

  async updateCirculationRecord(id: string, recordData: Partial<CirculationRecord>): Promise<CirculationRecord | null> {
    const { data, error } = await supabase
      .from('circulation_records')
      .update(recordData)
      .eq('id', id)
      .select(`
        *,
        book:catalog_books(*),
        user:users(*),
        processed_by_user:users!processed_by(*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating circulation record:', error);
      return null;
    }
    
    return data as CirculationRecord;
  },

  async deleteCirculationRecord(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('circulation_records')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting circulation record:', error);
      return false;
    }
    
    return true;
  },

  // =====================================================
  // ACTIVE BORROWINGS FUNCTIONS
  // =====================================================

  async getActiveBorrowings(): Promise<ActiveBorrowing[]> {
    const { data, error } = await supabase
      .from('active_borrowings')
      .select(`
        *,
        book:catalog_books(*),
        user:users(*)
      `)
      .order('borrow_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching active borrowings:', error);
      return [];
    }
    
    return data as ActiveBorrowing[];
  },

  async getActiveBorrowingsByUser(userId: string): Promise<ActiveBorrowing[]> {
    const { data, error } = await supabase
      .from('active_borrowings')
      .select(`
        *,
        book:catalog_books(*),
        user:users(*)
      `)
      .eq('user_id', userId)
      .order('borrow_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching user active borrowings:', error);
      return [];
    }
    
    return data as ActiveBorrowing[];
  },

  async getOverdueBorrowings(): Promise<ActiveBorrowing[]> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('active_borrowings')
      .select(`
        *,
        book:catalog_books(*),
        user:users(*)
      `)
      .lt('due_date', today)
      .eq('status', 'active')
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching overdue borrowings:', error);
      return [];
    }
    
    return data as ActiveBorrowing[];
  },

  async createActiveBorrowing(borrowingData: Partial<ActiveBorrowing>): Promise<ActiveBorrowing | null> {
    const { data, error } = await supabase
      .from('active_borrowings')
      .insert(borrowingData)
      .select(`
        *,
        book:catalog_books(*),
        user:users(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating active borrowing:', error);
      return null;
    }
    
    return data as ActiveBorrowing;
  },

  async updateActiveBorrowing(id: string, borrowingData: Partial<ActiveBorrowing>): Promise<ActiveBorrowing | null> {
    const { data, error } = await supabase
      .from('active_borrowings')
      .update(borrowingData)
      .eq('id', id)
      .select(`
        *,
        book:catalog_books(*),
        user:users(*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating active borrowing:', error);
      return null;
    }
    
    return data as ActiveBorrowing;
  },

  async deleteActiveBorrowing(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('active_borrowings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting active borrowing:', error);
      return false;
    }
    
    return true;
  },

  // =====================================================
  // VISITOR MANAGEMENT FUNCTIONS
  // =====================================================

  async getVisitors(): Promise<Visitor[]> {
    const { data, error } = await supabase
      .from('visitors')
      .select(`
        *,
        registered_by_user:users!registered_by(*)
      `)
      .order('visit_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching visitors:', error);
      return [];
    }
    
    return data as Visitor[];
  },

  async getVisitorsByDate(date: string): Promise<Visitor[]> {
    const { data, error } = await supabase
      .from('visitors')
      .select(`
        *,
        registered_by_user:users!registered_by(*)
      `)
      .eq('visit_date', date)
      .order('check_in_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching visitors by date:', error);
      return [];
    }
    
    return data as Visitor[];
  },

  async getVisitorById(id: string): Promise<Visitor | null> {
    const { data, error } = await supabase
      .from('visitors')
      .select(`
        *,
        registered_by_user:users!registered_by(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching visitor:', error);
      return null;
    }
    
    return data as Visitor;
  },

  async createVisitor(visitorData: Partial<Visitor>): Promise<Visitor | null> {
    const { data, error } = await supabase
      .from('visitors')
      .insert(visitorData)
      .select(`
        *,
        registered_by_user:users!registered_by(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating visitor:', error);
      return null;
    }
    
    return data as Visitor;
  },

  async updateVisitor(id: string, visitorData: Partial<Visitor>): Promise<Visitor | null> {
    const { data, error } = await supabase
      .from('visitors')
      .update(visitorData)
      .eq('id', id)
      .select(`
        *,
        registered_by_user:users!registered_by(*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating visitor:', error);
      return null;
    }
    
    return data as Visitor;
  },

  async deleteVisitor(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('visitors')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting visitor:', error);
      return false;
    }
    
    return true;
  },

  // =====================================================
  // INVENTORY MANAGEMENT FUNCTIONS
  // =====================================================

  async getInventoryItems(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory_items')
      .select(`
        *,
        book:catalog_books(*),
        created_by_user:users!created_by(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching inventory items:', error);
      return [];
    }
    
    return data as InventoryItem[];
  },

  async getInventoryItemsByType(itemType: string): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory_items')
      .select(`
        *,
        book:catalog_books(*),
        created_by_user:users!created_by(*)
      `)
      .eq('item_type', itemType)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching inventory items by type:', error);
      return [];
    }
    
    return data as InventoryItem[];
  },

  async getInventoryItemById(id: string): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from('inventory_items')
      .select(`
        *,
        book:catalog_books(*),
        created_by_user:users!created_by(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching inventory item:', error);
      return null;
    }
    
    return data as InventoryItem;
  },

  async createInventoryItem(itemData: Partial<InventoryItem>): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert(itemData)
      .select(`
        *,
        book:catalog_books(*),
        created_by_user:users!created_by(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating inventory item:', error);
      return null;
    }
    
    return data as InventoryItem;
  },

  async updateInventoryItem(id: string, itemData: Partial<InventoryItem>): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from('inventory_items')
      .update(itemData)
      .eq('id', id)
      .select(`
        *,
        book:catalog_books(*),
        created_by_user:users!created_by(*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating inventory item:', error);
      return null;
    }
    
    return data as InventoryItem;
  },

  async deleteInventoryItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting inventory item:', error);
      return false;
    }
    
    return true;
  },

  // =====================================================
  // REPORTS FUNCTIONS
  // =====================================================

  async getReports(): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        user:users(*)
      `)
      .order('generated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
    
    return data as Report[];
  },

  async getReportById(id: string): Promise<Report | null> {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        user:users(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching report:', error);
      return null;
    }
    
    return data as Report;
  },

  async createReport(reportData: Partial<Report>): Promise<Report | null> {
    const { data, error } = await supabase
      .from('reports')
      .insert(reportData)
      .select(`
        *,
        user:users(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating report:', error);
      return null;
    }
    
    return data as Report;
  },

  async updateReport(id: string, reportData: Partial<Report>): Promise<Report | null> {
    const { data, error } = await supabase
      .from('reports')
      .update(reportData)
      .eq('id', id)
      .select(`
        *,
        user:users(*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating report:', error);
      return null;
    }
    
    return data as Report;
  },

  async deleteReport(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting report:', error);
      return false;
    }
    
    return true;
  },

  // =====================================================
  // LIBRARY SETTINGS FUNCTIONS
  // =====================================================

  async getLibrarySettings(): Promise<LibrarySetting[]> {
    const { data, error } = await supabase
      .from('library_settings')
      .select(`
        *,
        updated_by_user:users!updated_by(*)
      `)
      .order('category', { ascending: true });
    
    if (error) {
      console.error('Error fetching library settings:', error);
      return [];
    }
    
    return data as LibrarySetting[];
  },

  async getLibrarySettingsByCategory(category: string): Promise<LibrarySetting[]> {
    const { data, error } = await supabase
      .from('library_settings')
      .select(`
        *,
        updated_by_user:users!updated_by(*)
      `)
      .eq('category', category)
      .order('setting_key', { ascending: true });
    
    if (error) {
      console.error('Error fetching library settings by category:', error);
      return [];
    }
    
    return data as LibrarySetting[];
  },

  async getLibrarySettingByKey(settingKey: string): Promise<LibrarySetting | null> {
    const { data, error } = await supabase
      .from('library_settings')
      .select(`
        *,
        updated_by_user:users!updated_by(*)
      `)
      .eq('setting_key', settingKey)
      .single();
    
    if (error) {
      console.error('Error fetching library setting:', error);
      return null;
    }
    
    return data as LibrarySetting;
  },

  async createLibrarySetting(settingData: Partial<LibrarySetting>): Promise<LibrarySetting | null> {
    const { data, error } = await supabase
      .from('library_settings')
      .insert(settingData)
      .select(`
        *,
        updated_by_user:users!updated_by(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating library setting:', error);
      return null;
    }
    
    return data as LibrarySetting;
  },

  async updateLibrarySetting(id: string, settingData: Partial<LibrarySetting>): Promise<LibrarySetting | null> {
    const { data, error } = await supabase
      .from('library_settings')
      .update(settingData)
      .eq('id', id)
      .select(`
        *,
        updated_by_user:users!updated_by(*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating library setting:', error);
      return null;
    }
    
    return data as LibrarySetting;
  },

  async deleteLibrarySetting(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('library_settings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting library setting:', error);
      return false;
    }
    
    return true;
  },

  // =====================================================
  // UTILITY FUNCTIONS FOR NEW FEATURES
  // =====================================================

  async getTotalVisitorsToday(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .eq('visit_date', today);
    
    if (error) {
      console.error('Error getting total visitors today:', error);
      return 0;
    }
    
    return count || 0;
  },

  async getTotalActiveBorrowings(): Promise<number> {
    const { count, error } = await supabase
      .from('active_borrowings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    if (error) {
      console.error('Error getting total active borrowings:', error);
      return 0;
    }
    
    return count || 0;
  },

  async getTotalOverdueBorrowings(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabase
      .from('active_borrowings')
      .select('*', { count: 'exact', head: true })
      .lt('due_date', today)
      .eq('status', 'active');
    
    if (error) {
      console.error('Error getting total overdue borrowings:', error);
      return 0;
    }
    
    return count || 0;
  },

  async getTotalInventoryItems(): Promise<number> {
    const { count, error } = await supabase
      .from('inventory_items')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error getting total inventory items:', error);
      return 0;
    }
    
    return count || 0;
  },
};
