# Panduan Testing Manajemen Anggota

## Overview
Panduan lengkap untuk testing semua fitur manajemen anggota yang telah diimplementasikan.

## Prerequisites
- Aplikasi sudah berjalan di `http://localhost:3000`
- Database Supabase sudah dikonfigurasi
- RLS policies sudah dijalankan

## Test Cases

### 1. Registrasi Pengguna (User Registration)

#### Test Case 1.1: Registrasi Pengguna Baru
**Steps:**
1. Buka aplikasi dan navigasi ke "Manajemen Pengguna"
2. Pastikan tab "Registrasi Pengguna" aktif
3. Isi form dengan data berikut:
   - Nama Lengkap: "Ahmad Rizki Pratama"
   - NIS/NIP/ID: "2024001"
   - Email: "ahmad.rizki@student.sman1jakarta.sch.id"
   - Nomor Telepon: "081234567890"
   - Tanggal Lahir: "15/05/2006"
   - Jenis Kelamin: "Laki-laki"
   - Jenis Keanggotaan: "Siswa"
   - Kelas/Departemen: "XII IPA 1"
   - Password: "password123"
   - Konfirmasi Password: "password123"
4. Klik "Daftarkan Pengguna"

**Expected Result:**
- ✅ Success message muncul
- ✅ Form ter-reset
- ✅ Data pengguna tersimpan di database
- ✅ User dapat login dengan email dan password

#### Test Case 1.2: Validasi Email Duplikat
**Steps:**
1. Coba daftarkan pengguna dengan email yang sudah ada
2. Klik "Daftarkan Pengguna"

**Expected Result:**
- ❌ Error message: "Email sudah terdaftar"
- ❌ Form tidak ter-submit

#### Test Case 1.3: Validasi Password Mismatch
**Steps:**
1. Isi password dengan "password123"
2. Isi konfirmasi password dengan "password456"
3. Klik "Daftarkan Pengguna"

**Expected Result:**
- ❌ Error message: "Password dan konfirmasi password tidak sama"
- ❌ Form tidak ter-submit

#### Test Case 1.4: Export Template Excel
**Steps:**
1. Klik tombol "Download Template Excel"
2. Periksa file yang didownload

**Expected Result:**
- ✅ File Excel terdownload
- ✅ Template berisi kolom yang benar
- ✅ Format sesuai dengan pedoman

#### Test Case 1.5: Export Data Pengguna
**Steps:**
1. Klik tombol "Export Data Pengguna"
2. Pilih format CSV
3. Periksa file yang didownload

**Expected Result:**
- ✅ File CSV terdownload
- ✅ Data pengguna tersimpan dengan benar
- ✅ Format sesuai dengan template

### 2. Profil Pengguna (User Profile)

#### Test Case 2.1: Pencarian Pengguna
**Steps:**
1. Buka tab "Profil Pengguna"
2. Masukkan nama pengguna di field pencarian
3. Klik tombol search

**Expected Result:**
- ✅ Pengguna ditemukan dan ditampilkan
- ✅ Data profil ter-load dengan benar

#### Test Case 2.2: Update Profil Pengguna
**Steps:**
1. Pilih pengguna dari hasil pencarian
2. Update email menjadi "newemail@example.com"
3. Update nomor telepon menjadi "081234567891"
4. Update status menjadi "Suspended"
5. Klik "Simpan Profil"

**Expected Result:**
- ✅ Success message muncul
- ✅ Data ter-update di database
- ✅ Perubahan ter-reflect di UI

#### Test Case 2.3: Update Batas Peminjaman
**Steps:**
1. Pilih pengguna
2. Update "Batas Peminjaman" menjadi 10
3. Update "Durasi Peminjaman" menjadi 14 hari
4. Klik "Simpan Profil"

**Expected Result:**
- ✅ Data ter-update dengan benar
- ✅ Perubahan tersimpan di database

### 3. Manajemen Keanggotaan (Membership Management)

#### Test Case 3.1: Buat Jenis Keanggotaan Baru
**Steps:**
1. Buka tab "Manajemen Keanggotaan"
2. Isi form dengan data:
   - Jenis Keanggotaan: "Siswa Olimpiade"
   - Masa Berlaku: 24 bulan
   - Biaya Keanggotaan: 50000
   - Deposit Jaminan: 100000
   - Batas Peminjaman: 10
   - Batas Reservasi: 5
3. Pilih akses digital: "E-Book", "Database Online"
4. Pilih hak istimewa: "Perpanjangan Otomatis", "Bebas Denda"
5. Klik "Simpan Keanggotaan"

**Expected Result:**
- ✅ Jenis keanggotaan tersimpan
- ✅ Data tersimpan di tabel membership_types
- ✅ Success message muncul

#### Test Case 3.2: Assign Keanggotaan ke Pengguna
**Steps:**
1. Pilih pengguna dari tab "Profil Pengguna"
2. Assign jenis keanggotaan "Siswa Olimpiade"
3. Klik "Simpan Profil"

**Expected Result:**
- ✅ Keanggotaan ter-assign
- ✅ Tanggal kadaluarsa ter-update
- ✅ Batas peminjaman ter-update

### 4. Kartu Anggota (Member Card)

#### Test Case 4.1: Pilih Anggota untuk Kartu
**Steps:**
1. Buka tab "Kartu Anggota"
2. Pilih beberapa anggota dengan checkbox
3. Periksa preview kartu

**Expected Result:**
- ✅ Anggota terpilih ditampilkan
- ✅ Preview kartu muncul dengan benar
- ✅ Data anggota ter-display dengan benar

#### Test Case 4.2: Cetak Kartu Anggota
**Steps:**
1. Pilih anggota untuk kartu
2. Klik "Cetak Kartu"
3. Periksa hasil print

**Expected Result:**
- ✅ Dialog print muncul
- ✅ Kartu ter-cetak dengan format yang benar
- ✅ Barcode ter-generate dengan benar

#### Test Case 4.3: Download PDF Kartu
**Steps:**
1. Pilih anggota untuk kartu
2. Klik "Download PDF"
3. Periksa file PDF yang didownload

**Expected Result:**
- ✅ File PDF terdownload
- ✅ Kartu ter-render dengan benar
- ✅ Format sesuai dengan template

### 5. Kontrol Akses (Access Control)

#### Test Case 5.1: Set Access Control
**Steps:**
1. Buka tab "Kontrol Akses"
2. Pilih User ID dari dropdown
3. Set role menjadi "Premium Member"
4. Pilih akses modul: "OPAC", "Sirkulasi", "Reservasi"
5. Pilih akses koleksi: "Koleksi Umum", "Koleksi Referensi"
6. Set jam akses: 07:00 - 18:00
7. Pilih hari: Senin - Jumat
8. Set session timeout: 60 menit
9. Klik "Update Akses"

**Expected Result:**
- ✅ Access control tersimpan
- ✅ Data tersimpan di tabel user_access_control
- ✅ Success message muncul

#### Test Case 5.2: Suspend User Access
**Steps:**
1. Pilih pengguna
2. Klik "Suspend Akses"
3. Masukkan alasan: "Pelanggaran aturan"
4. Konfirmasi suspend

**Expected Result:**
- ✅ Status pengguna berubah menjadi "Suspended"
- ✅ Pengguna tidak dapat login
- ✅ Activity log tercatat

#### Test Case 5.3: Restore User Access
**Steps:**
1. Pilih pengguna yang di-suspend
2. Klik "Restore Akses"
3. Konfirmasi restore

**Expected Result:**
- ✅ Status pengguna berubah menjadi "Active"
- ✅ Pengguna dapat login kembali
- ✅ Activity log tercatat

### 6. Statistik Pengguna (User Statistics)

#### Test Case 6.1: View Statistics Dashboard
**Steps:**
1. Buka tab "Statistik Pengguna"
2. Periksa statistik overview

**Expected Result:**
- ✅ Total pengguna ditampilkan
- ✅ Pengguna aktif ditampilkan
- ✅ Registrasi baru ditampilkan
- ✅ Keanggotaan expired ditampilkan

#### Test Case 6.2: Generate Statistics Report
**Steps:**
1. Pilih periode: "Bulan Ini"
2. Pilih jenis laporan: "Aktivitas Pengguna"
3. Pilih format output: "PDF Report"
4. Klik "Generate Statistik"

**Expected Result:**
- ✅ Laporan ter-generate
- ✅ Data statistik akurat
- ✅ Format sesuai dengan pilihan

#### Test Case 6.3: Export Statistics Data
**Steps:**
1. Pilih periode dan filter
2. Klik "Export Data"
3. Pilih format Excel
4. Periksa file yang didownload

**Expected Result:**
- ✅ File Excel terdownload
- ✅ Data statistik tersimpan dengan benar
- ✅ Format sesuai dengan template

## Performance Testing

### Load Testing
1. **Bulk Import**: Test import 100+ pengguna sekaligus
2. **Search Performance**: Test pencarian dengan 1000+ pengguna
3. **Statistics Generation**: Test generate statistik dengan data besar

### Stress Testing
1. **Concurrent Users**: Test dengan multiple users mengakses bersamaan
2. **Database Load**: Test dengan operasi database yang intensif
3. **Memory Usage**: Monitor memory usage selama operasi

## Security Testing

### Authentication Testing
1. **Login Security**: Test dengan password yang salah
2. **Session Management**: Test session timeout
3. **Role-based Access**: Test akses berdasarkan role

### Data Security Testing
1. **RLS Policies**: Test bahwa user hanya dapat akses data sendiri
2. **Input Validation**: Test dengan input yang malicious
3. **SQL Injection**: Test dengan input yang berbahaya

## Browser Compatibility Testing

### Desktop Browsers
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Mobile Browsers
- ✅ Chrome Mobile
- ✅ Safari Mobile
- ✅ Firefox Mobile

## Error Handling Testing

### Network Errors
1. **Offline Mode**: Test ketika internet terputus
2. **Slow Connection**: Test dengan koneksi lambat
3. **Server Error**: Test ketika server error

### Data Validation Errors
1. **Invalid Input**: Test dengan input yang tidak valid
2. **Missing Required Fields**: Test dengan field yang kosong
3. **Data Type Mismatch**: Test dengan tipe data yang salah

## Regression Testing

### After Each Update
1. **Smoke Test**: Test semua fitur utama
2. **Integration Test**: Test integrasi antar fitur
3. **Performance Test**: Test performa aplikasi

### Before Production Release
1. **Full Test Suite**: Jalankan semua test cases
2. **User Acceptance Test**: Test dengan user real
3. **Security Audit**: Audit keamanan aplikasi

## Test Data Management

### Test Data Setup
```sql
-- Insert test users
INSERT INTO users (name, email, role, student_id, phone, status) VALUES
('Test Student 1', 'student1@test.com', 'student', 'TEST001', '081234567890', 'active'),
('Test Teacher 1', 'teacher1@test.com', 'teacher', 'T001', '081234567891', 'active'),
('Test Librarian 1', 'librarian1@test.com', 'librarian', 'L001', '081234567892', 'active');

-- Insert test membership types
INSERT INTO membership_types (name, description, validity_months, membership_fee, borrow_limit) VALUES
('Test Membership', 'Test membership type', 12, 0, 5);
```

### Test Data Cleanup
```sql
-- Cleanup test data
DELETE FROM users WHERE email LIKE '%@test.com';
DELETE FROM membership_types WHERE name = 'Test Membership';
```

## Reporting

### Test Results Template
```
Test Date: [DATE]
Tester: [NAME]
Environment: [ENVIRONMENT]
Browser: [BROWSER]

Test Results:
- Total Test Cases: [NUMBER]
- Passed: [NUMBER]
- Failed: [NUMBER]
- Skipped: [NUMBER]

Failed Test Cases:
1. [TEST CASE NAME] - [REASON]
2. [TEST CASE NAME] - [REASON]

Issues Found:
1. [ISSUE DESCRIPTION]
2. [ISSUE DESCRIPTION]

Recommendations:
1. [RECOMMENDATION]
2. [RECOMMENDATION]
```

## Continuous Testing

### Automated Testing
- Setup CI/CD pipeline dengan automated tests
- Run tests pada setiap commit
- Generate test reports otomatis

### Manual Testing
- Weekly manual testing untuk fitur baru
- Monthly regression testing
- Quarterly security testing

## Conclusion

Testing yang komprehensif memastikan bahwa semua fitur manajemen anggota berfungsi dengan benar, aman, dan performant. Lakukan testing secara berkala dan dokumentasikan hasilnya untuk referensi masa depan.




