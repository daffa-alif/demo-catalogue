# demo-catalogue

Katalog Aplikasi Bisnis, Sistem POS Kasir, & Pencatatan Penjualan Siap Pakai berbasis **Next.js 16 (App Router)**, **Tailwind CSS**, **Prisma ORM**, **Server Actions**, dan **Dummy QRIS Payment**.

---

## 🚀 Fitur Utama

- **Main / Landing Page Terpisah (`/`)**: Hero section, kategori aplikasi, keunggulan toko, dan showcase produk unggulan.
- **Halaman Katalog Penuh (`/katalog`)**: Pencarian produk real-time dan filter kategori multi-kriteria.
- **Detail Produk Dinamis (`/product/[slug]`)**: Spesifikasi lengkap, harga resmi IDR, dan tombol CTA WhatsApp.
- **Dummy Pembayaran QRIS**:
  - Modal pembayaran QRIS interaktif dengan nominal dinamis.
  - Hitung mundur 15 menit.
  - Simulasi verifikasi transaksi sukses dengan penerbitan nomor lisensi otomatis.
- **Autentikasi Pengguna & Hak Akses Super Admin**:
  - Dukungan autentikasi terintegrasi **Google OAuth 2.0** via Supabase Auth & login lokal.
  - **Super Administrator Resmi**:
    - Akun Administrator terverifikasi secara otomatis mendapatkan hak akses **Super Admin** berbasis server-side check.
    - Sistem login default `admin / admin123` telah dihapus secara menyeluruh untuk keamanan.
  - Proteksi dashboard admin (`/admin`) dengan fitur CRUD lengkap (Tambah, Edit, Hapus, Toggle Ketersediaan Stok/Lisensi).
- **Arsitektur Server Actions**: Mutasi data langsung dengan revalidasi cache instan (`revalidatePath`).

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS + Lucide Icons
- **Database:** PostgreSQL (Supabase) via Prisma ORM
- **Authentication & Storage:** Supabase Auth (Google OAuth 2.0) & Supabase Storage
- **Validasi:** Zod

---

## 📦 Panduan Instalasi Lokal

1. **Clone repositori**:
   ```bash
   git clone git@github.com:daffa-alif/demo-catalogue.git
   cd demo-catalogue
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Setup Environment**:
   Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Sinkronisasi Database & Generate Prisma Client**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Isi Data Awal (Seeding)**:
   ```bash
   npx tsx prisma/seed.ts
   ```

6. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🔐 Kredensial & Autentikasi

- **Super Administrator:**
  - Masuk melalui tombol **"Masuk dengan Google"** di `/login` atau `/admin` menggunakan akun Google Administrator resmi.
- **Customer Biasa:**
  - Masuk melalui Google OAuth (otomatis role USER) atau daftar akun baru melalui form registrasi lokal di `/login`.


