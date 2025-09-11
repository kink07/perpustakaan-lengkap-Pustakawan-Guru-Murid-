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
} as const;

// Database functions (will be implemented when Supabase is set up)
export const FUNCTIONS = {
  GET_LIBRARY_STATS: 'get_library_stats',
  GET_CATEGORY_STATS: 'get_category_stats',
  GET_CIRCULATION_TRENDS: 'get_circulation_trends',
  GET_RECENT_ACTIVITIES: 'get_recent_activities',
  GET_USER_NOTIFICATIONS: 'get_user_notifications',
} as const;

