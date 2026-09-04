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
- **Autentikasi Pengguna & Hak Akses Admin**:
  - Portal Login & Register untuk pengguna umum / customer (`/login`).
  - **Akses Khusus Admin**:
    - **Username:** `admin`
    - **Password:** `admin123`
  - Proteksi dashboard admin (`/admin`) dengan fitur CRUD lengkap (Tambah, Edit, Hapus, Toggle Ketersediaan Stok/Lisensi).
- **Arsitektur Server Actions**: Mutasi data langsung dengan revalidasi cache instan (`revalidatePath`).

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS + Lucide Icons
- **Database:** SQLite (Lokal) via Prisma ORM (Siap migrasi ke PostgreSQL/Supabase)
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

## 🔐 Kredensial Pengujian

- **Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)
  - **Username:** `admin`
  - **Password:** `admin123`
- **Customer Biasa:**
  - Dapat langsung daftar akun baru di halaman [http://localhost:3000/login](http://localhost:3000/login).
