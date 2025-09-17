# Setup Database untuk Manajemen Anggota

## Langkah-langkah Setup Database

### 1. Login ke Supabase Dashboard
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Login dengan akun Anda
3. Pilih project perpustakaan Anda

### 2. Jalankan SQL Script
1. Buka **SQL Editor** di dashboard Supabase
2. Copy dan paste seluruh isi file `src/services/rlsPolicies.sql`
3. Klik **Run** untuk menjalankan script

### 3. Verifikasi Tabel
Pastikan tabel-tabel berikut telah dibuat:
- `users`
- `membership_types`
- `user_access_control`
- `activities`
- `notifications`
- `books`
- `borrow_records`
- `reservations`
- `catalog_books`
- `circulation_records`
- `active_borrowings`
- `visitors`
- `shared_books`
- `share_requests`
- `student_favorites`
- `bookmarks`
- `inventory_items`
- `reports`
- `library_settings`

### 4. Verifikasi RLS Policies
1. Buka **Authentication** > **Policies**
2. Pastikan semua tabel memiliki RLS enabled
3. Verifikasi policies telah dibuat dengan benar

### 5. Test Data
Jalankan query berikut untuk memastikan setup berhasil:

```sql
-- Test insert membership type
INSERT INTO membership_types (name, description, validity_months, membership_fee, borrow_limit) 
VALUES ('Siswa Reguler', 'Keanggotaan untuk siswa reguler', 12, 0, 5);

-- Test insert user
INSERT INTO users (name, email, role, student_id, phone, status) 
VALUES ('Test User', 'test@example.com', 'student', 'TEST001', '081234567890', 'active');

-- Test RLS - user should only see their own data
SELECT * FROM users WHERE id = auth.uid();
```

### 6. Konfigurasi Environment
Pastikan file `.env` atau environment variables sudah dikonfigurasi:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 7. Test Aplikasi
1. Jalankan aplikasi dengan `npm run dev`
2. Buka browser ke `http://localhost:3000`
3. Navigasi ke menu "Manajemen Pengguna"
4. Test semua fitur:
   - Registrasi pengguna baru
   - Update profil pengguna
   - Manajemen keanggotaan
   - Cetak kartu anggota
   - Kontrol akses
   - Statistik pengguna

## Troubleshooting

### Error: "relation does not exist"
- Pastikan script SQL telah dijalankan dengan benar
- Periksa nama tabel di database

### Error: "permission denied"
- Pastikan RLS policies telah dibuat
- Periksa role pengguna yang login

### Error: "invalid input syntax"
- Periksa format data yang diinput
- Pastikan tipe data sesuai dengan schema

### Error: "duplicate key value"
- Periksa constraint unique di database
- Pastikan tidak ada duplikasi data

## Monitoring

### Database Performance
- Monitor query performance di Supabase Dashboard
- Periksa slow queries dan optimize jika perlu

### Security
- Review RLS policies secara berkala
- Monitor failed login attempts
- Audit user activities

### Backup
- Setup automatic backup di Supabase
- Test restore procedure secara berkala

## Maintenance

### Regular Tasks
- Update RLS policies jika ada perubahan requirement
- Monitor database size dan performance
- Review dan cleanup old data
- Update dependencies secara berkala

### Security Updates
- Update Supabase client library
- Review dan update RLS policies
- Monitor security advisories

## Support

Jika mengalami masalah:
1. Periksa Supabase Dashboard untuk error logs
2. Review browser console untuk error frontend
3. Periksa network tab untuk failed requests
4. Hubungi tim development jika masalah berlanjut




