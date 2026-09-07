import Link from "next/link";
import { redirect } from "next/navigation";
import { getProducts } from "@/app/actions/product";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoRequestForm from "@/components/DemoRequestForm";
import {
  AppWindow,
  ShoppingCart,
  UtensilsCrossed,
  ReceiptText,
  Boxes,
  Users,
  MessageSquareShare,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
  Lock,
  Headphones,
  FileText,
  Layers,
  Database,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage(props: {
  searchParams?: Promise<{ code?: string }>;
}) {
  const searchParams = await props.searchParams;
  if (searchParams?.code) {
    redirect(`/auth/callback?code=${searchParams.code}`);
  }

  const allProducts = await getProducts();
  const featuredProducts = allProducts.slice(0, 4);

  const categories = [
    {
      name: "POS & Kasir Retail",
      icon: ShoppingCart,
      desc: "Minimarket, Toko Grosir, Distro, & Apotek",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      name: "POS & Kasir Resto / Cafe",
      icon: UtensilsCrossed,
      desc: "Order Meja, Kitchen Display, & Manajemen Resep",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      name: "Pencatatan Penjualan & Akuntansi",
      icon: ReceiptText,
      desc: "Laporan Laba Rugi, Faktur Invoice, & Kas UMKM",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      name: "Manajemen Inventori & Gudang",
      icon: Boxes,
      desc: "Stok Multi-Cabang, Expired Date, & Scan Barcode",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      name: "HRIS & Presensi Karyawan",
      icon: Users,
      desc: "Absensi Radius GPS, Hitung Gaji, & Slip WA",
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      name: "CRM & Otomasi Bisnis",
      icon: MessageSquareShare,
      desc: "WhatsApp Broadcast, Pipeline Sales, & Follow-up",
      color: "bg-cyan-50 text-cyan-600 border-cyan-100",
    },
  ];

  const enterpriseFeatures = [
    {
      icon: Building2,
      title: "Multi-Cabang & Multi-Gudang Terpusat",
      desc: "Pantau penjualan, stok, dan kinerja setiap cabang dari satu dashboard pusat secara real-time.",
    },
    {
      icon: Zap,
      title: "Integrasi API & Middleware",
      desc: "Hubungkan sistem kasir dengan marketplace, ERP, atau software akuntansi yang sudah Anda pakai.",
    },
    {
      icon: Lock,
      title: "Keamanan Data Tingkat Enterprise",
      desc: "Enkripsi data, backup cloud otomatis, dan kontrol akses berbasis peran (role-based access) untuk setiap staf.",
    },
    {
      icon: Users,
      title: "Dedicated Account Manager",
      desc: "Satu kontak khusus yang memahami kebutuhan bisnis Anda, dari implementasi awal hingga pengembangan lanjutan.",
    },
    {
      icon: Headphones,
      title: "SLA & Prioritas Dukungan Teknis",
      desc: "Waktu respon terjamin dengan jalur eskalasi prioritas untuk menjaga operasional toko tetap lancar.",
    },
    {
      icon: Layers,
      title: "Pelatihan Tim & Onboarding",
      desc: "Sesi pelatihan komprehensif untuk kasir, staf gudang, dan admin agar tim siap pakai sejak hari pertama.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* ==================== 1. HERO SECTION ==================== */}
        <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-white via-zinc-50/50 to-zinc-100/60 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-indigo-800 shadow-xs mb-6">
              <Building2 className="h-3.5 w-3.5 text-indigo-600" />
              Dipercaya 500+ Perusahaan Ritel, F&B & Distribusi di Indonesia
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
              Satu Sistem untuk <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Seluruh Operasional Bisnis Anda
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed">
              Satukan kasir (POS), pembukuan, stok multi-cabang, dan absensi karyawan dalam satu
              platform yang bisa dipantau dari mana saja. Dirancang untuk bisnis yang sedang
              berkembang dari satu toko menjadi jaringan multi-cabang — dengan lisensi seumur
              hidup tanpa biaya langganan bulanan.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition"
              >
                <Calendar className="h-4 w-4" />
                Jadwalkan Demo Gratis
              </Link>
              <Link
                href="/katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-300 bg-white px-6 py-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs transition"
              >
                Lihat Katalog Aplikasi
                <ArrowRight className="h-4 w-4 text-zinc-500" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-zinc-500">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Lisensi Seumur Hidup (No Monthly Fee)
              </span>
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-600" />
                Keamanan Data Tingkat Enterprise
              </span>
              <span className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-blue-600" />
                Dedicated Support & Onboarding Tim
              </span>
            </div>

            {/* Client Trust Strip */}
            <div className="mt-14 border-t border-zinc-200 pt-8">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                Digunakan oleh tim operasional di berbagai skala bisnis
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-zinc-400 font-bold text-sm sm:text-base">
                <span className="hover:text-zinc-600 transition">PT Sumber Makmur Retail</span>
                <span className="hover:text-zinc-600 transition">Kedai Nusantara Group</span>
                <span className="hover:text-zinc-600 transition">Toko Baru Distribusi</span>
                <span className="hover:text-zinc-600 transition">Warung Sinergi Jaya</span>
                <span className="hidden sm:inline hover:text-zinc-600 transition">Griya Farma Apotek</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 2. PAIN POINTS SECTION ==================== */}
        <section className="border-b border-zinc-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-extrabold text-zinc-900 leading-tight">
                  Sistem yang tumbuh bersama bisnis Anda — bukan yang menghambatnya
                </h2>
                <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
                  Banyak bisnis yang berkembang pesat justru tertahan bukan karena permintaan
                  pasar yang kurang, tapi karena operasional belakang layar yang masih manual
                  dan terpisah-pisah antar cabang atau tim.
                </p>
                <Link
                  href="/#enterprise"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
                >
                  Pelajari solusi enterprise kami
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="rounded-3xl border border-zinc-200 p-6 bg-zinc-50/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3.5 font-bold text-sm text-zinc-900">
                    Pencatatan manual rawan selisih
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                    Excel dan buku kas terpisah antar kasir membuat rekonsiliasi lambat dan rentan kesalahan manusia.
                  </p>
                </div>

                <div className="rounded-3xl border border-zinc-200 p-6 bg-zinc-50/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                    <Boxes className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3.5 font-bold text-sm text-zinc-900">
                    Stok antar cabang tidak sinkron
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                    Data gudang dan cabang tidak real-time, mengakibatkan kehabisan stok mendadak atau stok menumpuk.
                  </p>
                </div>

                <div className="rounded-3xl border border-zinc-200 p-6 bg-zinc-50/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3.5 font-bold text-sm text-zinc-900">
                    Laporan keuangan terlambat
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                    Keputusan ekspansi terhambat karena laporan laba rugi bulanan baru siap di minggu kedua bulan berikutnya.
                  </p>
                </div>

                <div className="rounded-3xl border border-zinc-200 p-6 bg-zinc-50/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3.5 font-bold text-sm text-zinc-900">
                    Tim sulit dipantau terpusat
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                    Absensi, pergantian shift, dan kinerja staf di banyak cabang sulit diawasi dari kantor manajemen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 3. KATEGORI SOFTWARE ==================== */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Solusi Terpadu
            </span>
            <h2 className="mt-1 text-3xl font-extrabold text-zinc-900">
              Kategori Aplikasi Sesuai Jenis Usaha Anda
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Dari usaha toko kelontong, resto kafe, apotek, bengkel hingga bisnis berskala multi-cabang.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href="/katalog"
                  className="group relative flex items-start gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${cat.color} transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{cat.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                      Lihat Aplikasi <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ==================== 4. STATS BAND (DARK SECTION) ==================== */}
        <section className="bg-zinc-900 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-white">500+</div>
                <p className="mt-1.5 text-xs font-semibold text-zinc-400">
                  Bisnis Menggunakan BizApps
                </p>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-white">1.200+</div>
                <p className="mt-1.5 text-xs font-semibold text-zinc-400">
                  Cabang & Outlet Terhubung
                </p>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-white">99.9%</div>
                <p className="mt-1.5 text-xs font-semibold text-zinc-400">Uptime Sistem</p>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-white">24/7</div>
                <p className="mt-1.5 text-xs font-semibold text-zinc-400">Dukungan Teknis</p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 5. ENTERPRISE FEATURES SECTION ==================== */}
        <section id="enterprise" className="border-b border-zinc-200 bg-zinc-50 py-16 scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Solusi Enterprise
              </span>
              <h2 className="mt-1 text-3xl font-extrabold text-zinc-900">
                Dibangun untuk Skala Bisnis yang Lebih Besar
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Bukan sekadar aplikasi kasir — tapi fondasi operasional untuk bisnis dengan banyak cabang, tim, dan kompleksitas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enterpriseFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="rounded-3xl bg-white border border-zinc-200 p-6 shadow-xs hover:border-indigo-200 transition"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-bold text-base text-zinc-900">{feat.title}</h3>
                    <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== 6. FEATURED APPS SHOWCASE ==================== */}
        <section className="border-t border-zinc-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Aplikasi Terlaris
                </span>
                <h2 className="mt-1 text-3xl font-extrabold text-zinc-900">
                  Software Paling Banyak Digunakan Pemilik Bisnis
                </h2>
              </div>
              <Link
                href="/katalog"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
              >
                Lihat Semua ({allProducts.length} Aplikasi)
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-8 py-3.5 text-sm font-bold text-white hover:bg-zinc-800 shadow-sm transition"
              >
                Buka Katalog Lengkap Seluruh Aplikasi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== 7. TESTIMONIALS ==================== */}
        <section className="border-t border-zinc-200 bg-zinc-50/70 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Testimoni Pengguna
              </span>
              <h2 className="mt-1 text-3xl font-extrabold text-zinc-900">
                Dipercaya Tim Operasional & Manajemen Bisnis
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Cerita nyata dari pemilik bisnis yang beralih ke sistem terpusat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="rounded-3xl bg-white border border-zinc-200 p-6 flex flex-col shadow-xs">
                <span className="text-4xl text-indigo-300 font-serif leading-none">“</span>
                <p className="mt-2 text-sm text-zinc-700 leading-relaxed flex-1">
                  Sejak pakai BizApps, laporan penjualan dari 8 cabang kami bisa dipantau secara real-time dari satu dashboard pusat, tanpa perlu menunggu rekap manual.
                </p>
                <div className="mt-5 pt-5 border-t border-zinc-100 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                    BS
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Budi Santoso</p>
                    <p className="text-xs text-zinc-500">Direktur Operasional, PT Sumber Makmur</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="rounded-3xl bg-white border border-zinc-200 p-6 flex flex-col shadow-xs">
                <span className="text-4xl text-indigo-300 font-serif leading-none">“</span>
                <p className="mt-2 text-sm text-zinc-700 leading-relaxed flex-1">
                  Tim support-nya responsif. Proses onboarding untuk 40 karyawan di 3 cabang selesai dalam waktu kurang dari seminggu, lengkap dengan pelatihan.
                </p>
                <div className="mt-5 pt-5 border-t border-zinc-100 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
                    RW
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Rina Wijaya</p>
                    <p className="text-xs text-zinc-500">HR Manager, Kedai Nusantara Group</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="rounded-3xl bg-white border border-zinc-200 p-6 flex flex-col shadow-xs">
                <span className="text-4xl text-indigo-300 font-serif leading-none">“</span>
                <p className="mt-2 text-sm text-zinc-700 leading-relaxed flex-1">
                  Investasi lisensi lifetime jauh lebih hemat dibanding sistem berlangganan bulanan yang kami pakai sebelumnya, dengan fitur yang justru lebih lengkap.
                </p>
                <div className="mt-5 pt-5 border-t border-zinc-100 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                    AF
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Ahmad Fauzi</p>
                    <p className="text-xs text-zinc-500">CFO, Toko Baru Distribusi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 8. DEMO REQUEST & ACTION SECTION ==================== */}
        <section id="demo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 scroll-mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-blue-900 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Left Pitch */}
              <div className="relative z-10 lg:col-span-2 p-8 sm:p-12 flex flex-col justify-center text-white">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm mb-4 w-fit">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Demo Gratis, Tanpa Komitmen
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Lihat Langsung Bagaimana BizApps Bekerja untuk Bisnis Anda
                </h2>
                <p className="mt-3 text-sm sm:text-base text-indigo-100 leading-relaxed">
                  Tim kami akan menyesuaikan demo dengan skala dan jenis usaha Anda — dari satu
                  outlet hingga jaringan multi-cabang. Aktivasi instan via QRIS setelah Anda siap.
                </p>
                <div className="mt-8 space-y-3 text-sm text-indigo-100">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Konsultasi kebutuhan bersama tim sales</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Simulasi harga sesuai jumlah cabang</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Rencana onboarding & pelatihan tim</span>
                  </div>
                </div>
              </div>

              {/* Right Form */}
              <div className="relative z-10 lg:col-span-3 bg-white p-8 sm:p-12">
                <DemoRequestForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
