// Database types for Supabase integration

export interface User {
  id: string;
  username?: string;
  email: string;
  role: 'librarian' | 'teacher' | 'student';
  name: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  
  // Librarian specific fields
  position?: string;
  employee_id?: string;
  
  // Teacher specific fields
  subject?: string;
  teacher_id?: string;
  
  // Student specific fields
  class?: string;
  student_id?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  co_author?: string;
  editor?: string;
  translator?: string;
  illustrator?: string;
  category: string;
  publisher: string;
  publication_place: string;
  publication_year: string;
  edition?: string;
  isbn?: string;
  issn?: string;
  call_number: string;
  dewey_number: string;
  pages: string;
  dimensions: string;
  language: string;
  series?: string;
  volume?: string;
  notes?: string;
  subjects: string[];
  physical_description: string;
  content_type: string;
  media_type: string;
  carrier_type: string;
  location: string;
  copy_number: number;
  barcode: string;
  price: string;
  source: string;
  acquisition_date: string;
  condition: string;
  status: 'available' | 'borrowed' | 'maintenance' | 'lost' | 'damaged';
  abstract?: string;
  cover?: string;
  digital_files?: string[];
  created_at: string;
  updated_at: string;
}

export interface BorrowRecord {
  id: string;
  user_id: string;
  book_id: string;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: 'active' | 'returned' | 'overdue' | 'lost';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  book_id: string;
  reservation_date: string;
  status: 'pending' | 'fulfilled' | 'cancelled' | 'expired';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  type: 'borrow' | 'return' | 'reserve' | 'cancel' | 'register' | 'login' | 'logout';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
}

export interface LibraryStats {
  total_books: number;
  available_books: number;
  borrowed_books: number;
  maintenance_books: number;
  lost_books: number;
  total_users: number;
  active_users: number;
  total_borrows_today: number;
  total_visitors_today: number;
  total_borrows_this_month: number;
  new_users_this_month: number;
  new_books_this_month: number;
  average_rating: number;
}

export interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
}

export interface CirculationTrend {
  date: string;
  borrows: number;
  returns: number;
}

// Student-specific types
export interface StudentFavorite {
  id: string;
  user_id: string;
  book_id: string;
  personal_rating: number;
  notes?: string;
  tags: string[];
  date_added: string;
  read_count: number;
  created_at: string;
  updated_at: string;
  book?: Book; // Join dengan books
}

export interface Bookmark {
  id: string;
  user_id: string;
  book_id: string;
  notes?: string;
  tags: string[];
  date_added: string;
  created_at: string;
  updated_at: string;
  book?: Book; // Join dengan books
}

export interface ReadingHistory {
  id: string;
  user_id: string;
  book_id: string;
  borrow_date: string;
  return_date: string;
  rating: number;
  review?: string;
  reading_time: number; // in hours
  completion_status: 'completed' | 'partial' | 'not_started';
  created_at: string;
  updated_at: string;
  book?: Book; // Joined data
}

export interface DigitalContent {
  id: string;
  title: string;
  description?: string;
  content_type: 'ebook' | 'video' | 'audio' | 'document' | 'interactive';
  file_path?: string;
  file_size?: number;
  duration?: number; // in minutes for video/audio
  category: string;
  tags: string[];
  is_public: boolean;
  download_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface DigitalContentProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_percentage: number;
  last_position: number; // for video/audio, last position in seconds
  completed_at?: string;
  created_at: string;
  updated_at: string;
  content?: DigitalContent; // Joined data
}

// Teacher-specific types
export interface CurriculumBook {
  id: string;
  book_id: string;
  teacher_id: string;
  subject: string;
  grade: string;
  chapter?: string;
  learning_objectives: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_reading_time: number; // in minutes
  assigned_classes: string[];
  completion_rate: number;
  student_feedback: number;
  digital_formats: string[];
  supplementary_materials: string[];
  last_assigned?: string;
  status: 'active' | 'archived' | 'under_review';
  created_at: string;
  updated_at: string;
  book?: Book; // Joined data
}

export interface TeachingMaterial {
  id: string;
  teacher_id: string;
  title: string;
  subject: string;
  grade?: string;
  material_type: 'lesson_plan' | 'worksheet' | 'presentation' | 'video' | 'assessment';
  content?: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  tags: string[];
  is_public: boolean;
  download_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  class_name: string;
  grade: string;
  subject?: string;
  teacher_id?: string;
  student_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  teacher?: User; // Joined data
}

export interface ClassStudent {
  id: string;
  class_id: string;
  student_id: string;
  enrolled_at: string;
  class?: Class; // Joined data
  student?: User; // Joined data
}

export interface ClassAssignment {
  id: string;
  teacher_id: string;
  book_id: string;
  class_name: string;
  assignment_title: string;
  instructions?: string;
  due_date?: string;
  assessment_type?: string;
  points: number;
  status: 'active' | 'completed' | 'overdue';
  created_at: string;
  updated_at: string;
  book?: Book; // Joined data
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  submission_text?: string;
  file_path?: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
  created_at: string;
  updated_at: string;
  assignment?: ClassAssignment; // Joined data
  student?: User; // Joined data
}

// Notification settings
export interface NotificationSettings {
  id: string;
  user_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  in_app_notifications: boolean;
  system_alerts: boolean;
  maintenance_notices: boolean;
  // Student specific
  email_reminders: boolean;
  new_books_alert: boolean;
  reservation_updates: boolean;
  reading_recommendations: boolean;
  // Teacher specific
  assignment_submissions: boolean;
  student_questions: boolean;
  system_updates: boolean;
  new_materials: boolean;
  class_performance: boolean;
  parent_communications: boolean;
  created_at: string;
  updated_at: string;
}

// Extended Reservation with notification settings
export interface ExtendedReservation extends Reservation {
  notification_email: boolean;
  notification_sms: boolean;
  notification_whatsapp: boolean;
  priority: number;
  estimated_ready_date?: string;
  book?: Book; // Joined data
}

// =====================================================
// COLLECTION MANAGEMENT TYPES
// =====================================================

export interface CatalogBook {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  coAuthor?: string;
  editor?: string;
  translator?: string;
  illustrator?: string;
  category?: string;
  subcategory?: string;
  publisher?: string;
  publicationPlace?: string;
  publication_year?: number;
  edition?: string;
  isbn?: string;
  issn?: string;
  series?: string;
  volume?: string;
  language?: string;
  pages?: number;
  dimensions?: string;
  abstract?: string;
  description?: string;
  subjects?: string[]; // Array of subject strings
  cover?: string; // URL cover image
  cover_image_url?: string; // Keep for backward compatibility
  digital_files?: string[]; // Array of digital file URLs
  status: 'available' | 'borrowed' | 'reserved' | 'damaged' | 'lost';
  location?: string;
  copyNumber?: number;
  barcode?: string;
  price?: number;
  source?: string;
  acquisition_date?: string;
  acquisition_method?: string;
  condition?: string;
  physicalDescription?: string;
  deweyNumber?: string;
  callNumber?: string;
  contentType?: string;
  mediaType?: string;
  carrierType?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BookLabel {
  id: string;
  book_id: string;
  barcode: string;
  label_template?: string;
  label_size?: 'small' | 'medium' | 'large';
  barcode_size?: 'small' | 'medium' | 'large';
  print_count?: number;
  last_printed_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  book?: CatalogBook; // Join dengan catalog_books
}

export interface BookStatusHistory {
  id: string;
  book_id: string;
  old_status?: string;
  new_status: string;
  changed_by?: string;
  reason?: string;
  changed_at: string;
  book?: CatalogBook; // Join dengan catalog_books
  user?: User; // Join dengan users
}

export interface ImportExportLog {
  id: string;
  operation_type: 'import' | 'export';
  file_name: string;
  file_type: string;
  records_count?: number;
  success_count?: number;
  error_count?: number;
  error_details?: any;
  performed_by?: string;
  performed_at: string;
  user?: User; // Join dengan users
}

// =====================================================
// CIRCULATION & BORROWING TYPES
// =====================================================

export interface CirculationRecord {
  id: string;
  book_id: string;
  user_id: string;
  operation_type: 'borrow' | 'return' | 'renew' | 'reserve' | 'cancel_reservation';
  borrow_date?: string;
  due_date?: string;
  return_date?: string;
  renewal_count?: number;
  fine_amount?: number;
  status: 'active' | 'returned' | 'overdue' | 'lost' | 'damaged';
  notes?: string;
  processed_by?: string;
  created_at: string;
  updated_at: string;
  book?: CatalogBook; // Join dengan catalog_books
  user?: User; // Join dengan users
  processed_by_user?: User; // Join dengan users (processed_by)
}

export interface ActiveBorrowing {
  id: string;
  book_id: string;
  user_id: string;
  borrow_date: string;
  due_date: string;
  renewal_count: number;
  fine_amount: number;
  status: 'active' | 'overdue';
  notes?: string;
  created_at: string;
  updated_at: string;
  book?: CatalogBook; // Join dengan catalog_books
  user?: User; // Join dengan users
}

// =====================================================
// SHARED BOOKS TYPES
// =====================================================

export interface SharedBook {
  id: string;
  book_id: string;
  shared_by: string;
  shared_with: string;
  share_type: 'read' | 'borrow' | 'download' | 'view_only';
  permission_level: 'view' | 'download' | 'full_access';
  status: 'active' | 'expired' | 'revoked' | 'pending';
  is_public: boolean;
  expires_at?: string;
  access_count: number;
  last_accessed_at?: string;
  notes?: string;
  access_notes?: string;
  created_at: string;
  updated_at: string;
  book?: CatalogBook; // Join dengan catalog_books
  shared_by_user?: User; // Join dengan users (shared_by)
  shared_with_user?: User; // Join dengan users (shared_with)
}

export interface ShareRequest {
  id: string;
  book_id: string;
  requester_id: string;
  owner_id: string;
  request_type: 'read' | 'borrow' | 'download' | 'view_only';
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  response_message?: string;
  expires_at: string;
  responded_at?: string;
  responded_by?: string;
  created_at: string;
  updated_at: string;
  book?: CatalogBook; // Join dengan catalog_books
  requester?: User; // Join dengan users (requester_id)
  owner?: User; // Join dengan users (owner_id)
  responder?: User; // Join dengan users (responded_by)
}

export interface ShareHistory {
  id: string;
  shared_book_id: string;
  action: 'created' | 'accessed' | 'downloaded' | 'expired' | 'revoked' | 'updated';
  performed_by: string;
  details?: Record<string, any>; // JSON details
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  shared_book?: SharedBook; // Join dengan shared_books
  performer?: User; // Join dengan users (performed_by)
}

// =====================================================
// VISITOR MANAGEMENT TYPES
// =====================================================

export interface Visitor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  institution?: string;
  purpose: 'study' | 'research' | 'borrow' | 'return' | 'other';
  visit_date: string;
  check_in_time: string;
  check_out_time?: string;
  duration_minutes?: number;
  notes?: string;
  registered_by?: string;
  created_at: string;
  updated_at: string;
  registered_by_user?: User; // Join dengan users
}

// =====================================================
// INVENTORY MANAGEMENT TYPES
// =====================================================

export interface InventoryItem {
  id: string;
  book_id: string;
  item_type: 'book' | 'equipment' | 'furniture' | 'other';
  item_name: string;
  description?: string;
  location: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  status: 'available' | 'in_use' | 'maintenance' | 'lost' | 'disposed';
  acquisition_date?: string;
  acquisition_cost?: number;
  supplier?: string;
  warranty_expiry?: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  book?: CatalogBook; // Join dengan catalog_books (jika item_type = 'book')
  created_by_user?: User; // Join dengan users
}

// =====================================================
// REPORTS TYPES
// =====================================================

export interface Report {
  id: string;
  report_type: 'circulation' | 'inventory' | 'user_activity' | 'financial' | 'custom';
  title: string;
  description?: string;
  parameters: any; // JSON object untuk parameter laporan
  generated_by: string;
  generated_at: string;
  file_path?: string;
  file_format: 'pdf' | 'excel' | 'csv';
  status: 'generating' | 'completed' | 'failed';
  error_message?: string;
  user?: User; // Join dengan users
}

// =====================================================
// SETTINGS TYPES
// =====================================================

export interface LibrarySetting {
  id: string;
  setting_key: string;
  setting_value: any; // JSON value
  setting_type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  category: 'general' | 'circulation' | 'notification' | 'security' | 'backup' | 'integration';
  description?: string;
  is_public: boolean; // Apakah setting bisa diakses oleh user biasa
  updated_by?: string;
  created_at: string;
  updated_at: string;
  updated_by_user?: User; // Join dengan users
}

// =====================================================
// EXCEL IMPORT/EXPORT TYPES
// =====================================================

export interface ExcelBookData {
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  category?: string;
  subcategory?: string;
  language?: string;
  pages?: number;
  description?: string;
  status?: string;
  location?: string;
  acquisition_date?: string;
  acquisition_method?: string;
  price?: number;
  notes?: string;
}

export interface ExcelMapping {
  title: string; // Column A
  author: string; // Column B
  isbn?: string;
  publisher?: string;
  publication_year?: string;
  category?: string;
  subcategory?: string;
  language?: string;
  pages?: string;
  description?: string;
  status?: string;
  location?: string;
  acquisition_date?: string;
  acquisition_method?: string;
  price?: string;
  notes?: string;
}
