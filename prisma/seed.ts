import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database untuk Katalog Penjualan Aplikasi & Software...");

  // Hapus data produk lama
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 1. Buat User Admin Khusus (username: admin, password: admin123)
  await prisma.user.create({
    data: {
      username: "admin",
      name: "Admin BizApps",
      email: "admin@bizapps.id",
      password: "admin123",
      role: "ADMIN",
    },
  });

  // Buat User Pelanggan Biasa
  await prisma.user.create({
    data: {
      username: "budi",
      name: "Budi Pratama",
      email: "budi@gmail.com",
      password: "user123",
      role: "USER",
    },
  });

  console.log("Users berhasil dibuat (Admin: admin / admin123)");

  // 2. Buat Data Aplikasi Bisnis, POS, Kasir, dan Pembukuan
  const softwareProducts = [
    {
      title: "POS Kasir Retail Pro 2026 - Multi Cabang & Barcode",
      slug: "pos-kasir-retail-pro",
      description:
        "Aplikasi Point of Sale (POS) lengkap untuk toko retail, minimarket, distro, dan grosir. Fitur unggulan:\n• Scan barcode produk kilat & cetak struk thermal 58mm/80mm\n• Dukungan multi-cabang & sinkronisasi cloud real-time\n• Manajemen stok opname & peringatan otomatis stok menipis\n• Laporan laba kotor & omset harian otomatis\n• Dukungan metode bayar: Tunai, QRIS, Transfer Bank, Debit.\nLisensi Seumur Hidup (Lifetime) tanpa biaya langganan bulanan.",
      price: 850000,
      imageUrl:
        "https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&auto=format&fit=crop&q=80",
      category: "POS & Kasir Retail",
      isAvailable: true,
    },
    {
      title: "Smart Resto & Cafe Cashier POS - Kitchen Order Display",
      slug: "smart-resto-cafe-cashier-pos",
      description:
        "Sistem kasir cerdas khusus usaha kuliner, restoran, cafe, dan coffee shop. Fitur unggulan:\n• Manajemen denah meja (Table Layout) interaktif\n• Kitchen Order Ticket (KOT) cetak langsung ke bagian dapur & bar\n• Fitur split bill, gabung meja, dan diskon promosi berkala\n• Manajemen resep & pengurangan bahan baku otomatis (HPP Recipe)\n• Integrasi pesanan menu via scan QR meja oleh pelanggan.",
      price: 950000,
      imageUrl:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80",
      category: "POS & Kasir Resto / Cafe",
      isAvailable: true,
    },
    {
      title: "Aplikasi Pencatatan Penjualan & Laba Rugi UMKM",
      slug: "aplikasi-pencatatan-penjualan-laba-rugi",
      description:
        "Software pembukuan dan akuntansi ringkas ramah pengguna untuk pemilik bisnis UMKM. Fitur unggulan:\n• Pencatatan transaksi pemasukan dan pengeluaran harian tanpa ribet\n• Laporan Laba Rugi, Neraca Keuangan, dan Arus Kas (Cash Flow) otomatis\n• Pembuatan Invoice & Faktur Penjualan berlogo bisnis PDF rapi\n• Pengingat piutang jatuh tempo pelanggan via WhatsApp notifikasi\n• Ekspor laporan keuangan ke format Excel siap pajak.",
      price: 450000,
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      category: "Pencatatan Penjualan & Akuntansi",
      isAvailable: true,
    },
    {
      title: "Sistem Manajemen Inventori & Gudang Multi-Lokasi",
      slug: "sistem-manajemen-inventori-gudang",
      description:
        "Software manajemen pergudangan (WMS) untuk tracking pergerakan barang secara akurat. Fitur unggulan:\n• Pelacakan barang masuk, barang keluar, dan transfer antar gudang\n• Pencatatan Batch Number & Tanggal Kedaluwarsa (Expired Date)\n• Cetak label barcode custom & QR tracking palet\n• Rekonsiliasi stok opname cepat dengan mobile scanner\n• Hak akses bertingkat untuk staff gudang, kepala logistik, dan owner.",
      price: 1350000,
      imageUrl:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
      category: "Manajemen Inventori & Gudang",
      isAvailable: true,
    },
    {
      title: "Aplikasi Kasir Apotek & Klinik Farmasi BPOM Ready",
      slug: "aplikasi-kasir-apotek-klinik-farmasi",
      description:
        "Aplikasi kasir dan manajemen obat terstandarisasi untuk apotek, toko obat, dan klinik pratama. Fitur unggulan:\n• Manajemen obat golongan Narkotika, Psikotropika, Prekursor, & Obat Bebas\n• Laporan berkala SIPNAP resmi Kemenkes siap ekspor\n• Pencatatan nomor batch, produsen/PBF, dan tanggal kedaluwarsa obat\n• Modul peracikan resep obat dan konversi dosis otomatis\n• Rekam riwayat pembelian obat pasien.",
      price: 1100000,
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
      category: "POS & Kasir Retail",
      isAvailable: true,
    },
    {
      title: "HRIS Presensi GPS Mobile & Payroll Gaji Karyawan",
      slug: "hris-presensi-gps-payroll-karyawan",
      description:
        "Sistem absensi karyawan berbasis titik radius GPS & foto selfie anti fake GPS. Fitur unggulan:\n• Presensi online via smartphone karyawan dengan deteksi wajah\n• Manajemen shift kerja fleksibel, izin cuti, dan pengajuan lembur\n• Kalkulasi otomatis gaji, tunjangan, potongan BPJS, dan PPh 21\n• Cetak & kirim Slip Gaji digital otomatis ke email / WhatsApp karyawan\n• Rekapitulasi kehadiran bulanan dalam satu klik.",
      price: 750000,
      imageUrl:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
      category: "HRIS & Presensi Karyawan",
      isAvailable: true,
    },
    {
      title: "Aplikasi Kasir Bengkel Motor & Mobil + Service Reminder",
      slug: "aplikasi-kasir-bengkel-servis",
      description:
        "Solusi terpadu kasir bengkel otomotif, toko sparepart, dan jasa cuci kendaraan. Fitur unggulan:\n• Pencatatan histori nomor polisi kendaraan dan odometer KM servis\n• Estimasi biaya jasa mekanik dan suku cadang dalam satu work-order (SPK)\n• Bagi hasil komisi mekanik otomatis per pekerjaan\n• Pengingat otomatis jadwal servis berkala & ganti oli ke pelanggan via WA\n• Kontrol stok onderdil dan peringatan stok kritis.",
      price: 800000,
      imageUrl:
        "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80",
      category: "POS & Kasir Retail",
      isAvailable: true,
    },
    {
      title: "CRM WhatsApp Blaster & Otomasi Follow-up Penjualan",
      slug: "crm-whatsapp-blaster-otomasi-sales",
      description:
        "Software manajemen kontak pelanggan (CRM) dan otomasi pesan broadcast WhatsApp anti-banned. Fitur unggulan:\n• Manajemen database prospek (Leads Pipeline) dari status Kontak hingga Closing\n• Pengiriman pesan broadcast pesan promo personal dengan placeholder nama\n• Auto-responder dan chatbot panduan FAQ produk 24/7\n• Tagging pelanggan (Pelanggan VIP, Prospek Panas, Pelanggan Baru)\n• Analitik rasio konversi tim sales penjualan harian.",
      price: 550000,
      imageUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80",
      category: "CRM & Otomasi Bisnis",
      isAvailable: false, // Demo habis/pre-order
    },
  ];

  for (const app of softwareProducts) {
    await prisma.product.create({ data: app });
  }

  console.log(`Seeding selesai: ${softwareProducts.length} aplikasi bisnis berhasil ditambahkan.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
