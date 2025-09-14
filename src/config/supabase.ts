// Supabase configuration
import { createClient } from '@supabase/supabase-js';

export const supabaseConfig = {
  url: 'https://dyjtjsriakkftokirhmk.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5anRqc3JpYWtrZnRva2lyaG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0Nzg2ODQsImV4cCI6MjA3MzA1NDY4NH0.ybtEBUYtgGjCl8e3OF4IfQ8PFnYtN8HOzokiGtkkTXw',
};

// Create Supabase client
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  BOOKS: 'books',
  BORROW_RECORDS: 'borrow_records',
  RESERVATIONS: 'reservations',
  ACTIVITIES: 'activities',
  NOTIFICATIONS: 'notifications',
  CATALOG_BOOKS: 'catalog_books',
  BOOK_LABELS: 'book_labels',
  CIRCULATION_RECORDS: 'circulation_records',
  ACTIVE_BORROWINGS: 'active_borrowings',
  VISITORS: 'visitors',
  SHARED_BOOKS: 'shared_books',
  SHARE_REQUESTS: 'share_requests',
  SHARE_HISTORY: 'share_history',
  STUDENT_FAVORITES: 'student_favorites',
  BOOKMARKS: 'bookmarks',
  INVENTORY_ITEMS: 'inventory_items',
  REPORTS: 'reports',
  LIBRARY_SETTINGS: 'library_settings',
} as const;

// Database functions (will be implemented when Supabase is set up)
export const FUNCTIONS = {
  GET_LIBRARY_STATS: 'get_library_stats',
  GET_CATEGORY_STATS: 'get_category_stats',
  GET_CIRCULATION_TRENDS: 'get_circulation_trends',
  GET_RECENT_ACTIVITIES: 'get_recent_activities',
  GET_USER_NOTIFICATIONS: 'get_user_notifications',
  // Share functions
  CREATE_BOOK_SHARE: 'create_book_share',
  REVOKE_BOOK_SHARE: 'revoke_book_share',
  REQUEST_BOOK_SHARE: 'request_book_share',
  RESPOND_TO_SHARE_REQUEST: 'respond_to_share_request',
} as const;

