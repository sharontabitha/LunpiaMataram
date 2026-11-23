# Lunpia Mataram Pandanaran - Website Katalog & Pemesanan Online

Website katalog kuliner modern dan interaktif untuk **Lunpia Mataram Pandanaran**, terinspirasi dari resep warisan Semarang sejak 1988.

---

## ✨ Fitur Utama

### 1. Halaman Pengunjung / User Umum
- **Desain Autentik & Elegan**: Mengikuti tata letak dan palet warna warisan Semarang (hijau tua gelap `#143826`, emas/kuning `#dfa62c`, terracotta `#b83b26`, dan krem `#FAF7F0`).
- **Hero Banner Warisan**: Dilengkapi badge "SEJAK 1988 · RESEP WARISAN SEMARANG", tipografi serif bergaya klasik, dan foto sajian lunpia besek.
- **Katalog Menu Interaktif**:
  - Filter kategori (*Semua Menu*, *Satuan*, *Paket Besek*).
  - Kolom pencarian realtime (*Cari menu favorit...*).
  - Pilihan penyajian (*Basah* / *Goreng* / *Campur*).
  - Status stok dinamis (*Tersedia* atau *Stok Habis / Belum Tersedia*).
- **Keranjang Belanja (Cart) Slide-Over**:
  - Ringkasan item, varian penyajian, dan jumlah pesanan (+/-).
  - Total harga otomatis.
  - Form data pemesan (Nama, No WhatsApp, Metode Pengambilan Toko/Delivery, Catatan Tambahan).
  - **Direct ke WhatsApp (081901661459)** dengan format pesan rapi:
    ```
    Halo Lunpia Mataram Pandanaran,
    Saya *Budi Santoso* ingin memesan:

    📋 *Rincian Pesanan:*
    1. *Lunpia Original* (Goreng)
       2x @ Rp 18.000 = *Rp 36.000*

    💰 *Total Harga:* *Rp 36.000*
    📍 *Metode:* Ambil di Toko
    ...
    ```
  - Efek selebrasi konfeti saat pesanan dikirim!
- **Halaman & Bagian Lokasi**:
  - Alamat lengkap: *Jl. Pandanaran No.29A, Randusari, Kec. Semarang Sel., Kota Semarang, Jawa Tengah 50244*.
  - Link Google Maps: [https://maps.app.goo.gl/jZQnXTnf7QqiUVQR9](https://maps.app.goo.gl/jZQnXTnf7QqiUVQR9).
  - Peta Google Maps interaktif (embedded iframe).
- **Footer Lengkap & Kontak**:
  - Telepon: `(024) 8451001`
  - WhatsApp: `081901661459`
  - Gojek / GoFood: [Link Restoran GoFood](https://gofood.co.id/jakarta/restaurant/37081343-6ea5-4e23-bcc1-09c41eaaac86?as=gmaps)
  - Jam Operasional: `08.00 - 21.00 WIB`

---

### 2. Panel Admin Tersembunyi
- **Akses Login Tersembunyi**:
  - Ikon gembok kecil di sudut kanan atas navbar.
  - Tautan *"Kelola Website (Admin)"* di bar bawah footer.
- **Kredensial Default**:
  - Username: `admin`
  - Password: `admin123`
- **Kapabilitas Dashboard Admin**:
  1. **Kelola Menu (CRUD)**: Tambah menu baru, ubah harga, ganti foto, ubah deskripsi, atur varian penyajian, dan toggle status ketersediaan stok (Tersedia / Habis).
  2. **Header & Hero**: Mengubah tagline, judul utama, deskripsi hero, foto banner, dan jam buka.
  3. **Tentang Kami**: Mengubah judul narasi, kisah sejarah resep warisan, quote filosofi, dan foto dokumentasi.
  4. **Footer & Kontak**: Mengubah nomor telepon toko `(024) 8451001`, nomor WhatsApp `081901661459`, link GoFood, jam buka `08.00 - 21.00`, alamat lengkap, dan link peta.
  5. **Log Pesanan**: Melihat daftar pesanan pelanggan yang masuk dari keranjang secara realtime lengkap dengan status (Menunggu, Diproses, Selesai).
  6. **Pengaturan Supabase**: Mengatur Project URL dan Anon API Key dengan tombol *Salin Schema SQL* siap pakai.

---

### 3. Backend Supabase & Offline-First Dual Mode
Website ini dirancang secara tangguh:
- Jika Supabase URL dan Anon Key sudah dimasukkan, data langsung sinkron secara realtime ke database cloud Supabase.
- Jika Supabase belum dikonfigurasi, website tetap **100% berfungsi normal** menggunakan penyimpanan lokal (LocalStorage/IndexedDB) sehingga Anda tidak perlu khawatir website error atau kosong!

Untuk menghubungkan ke Supabase:
1. Buka dashboard di [supabase.com](https://supabase.com).
2. Masuk ke **SQL Editor** & jalankan skrip di file `supabase_schema.sql`.
3. Buka tab **Supabase Backend** di panel Admin website, lalu masukkan **Project URL** dan **Anon Key**.

---

## 🚀 Cara Menjalankan Project

1. Pastikan Node.js sudah terpasang.
2. Buka terminal di folder project:
   ```bash
   npm run dev
   ```
3. Buka browser di [http://localhost:3000](http://localhost:3000).
