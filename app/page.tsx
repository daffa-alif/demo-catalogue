import Link from "next/link";
import { getProducts } from "@/app/actions/product";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  QrCode,
  ArrowRight,
  Sparkles,
  Code2,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-white via-zinc-50/50 to-zinc-100/60 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-indigo-800 shadow-xs mb-6">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Katalog Aplikasi Bisnis, POS Kasir & Pembukuan Siap Pakai
            </div>

            <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
              Software Andal, <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Bisnis Tumbuh Otomatis
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed">
              Tingkatkan omset dan efisiensi operasional dengan sistem kasir (POS), pembukuan
              penjualan real-time, manajemen stok gudang, dan absensi HRIS. Lisensi seumur hidup
              tanpa biaya langganan bulanan.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition"
              >
                <AppWindow className="h-4 w-4" />
                Jelajahi Katalog Aplikasi
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-300 bg-white px-6 py-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs transition"
              >
                <ShieldCheck className="h-4 w-4 text-zinc-500" />
                Kelola Produk (Admin)
              </Link>
            </div>

            {/* Badges Kepercayaan */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-zinc-500">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Lisensi Seumur Hidup (No Monthly Fee)
              </span>
              <span className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-indigo-600" /> Aktivasi Instan via QRIS
              </span>
              <span className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-600" /> Termasuk Panduan & Dukungan Teknis
              </span>
            </div>
          </div>
        </section>

        {/* KATEGORI SOFTWARE */}
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

        {/* FEATURED APPS SHOWCASE */}
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

        {/* VALUE BANNER */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-900 p-8 sm:p-14 text-white shadow-xl">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm mb-4">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Siap Pasang & Mudah Digunakan
              </div>
              <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
                Mulai Transaksi & Catat Penjualan Lebih Rapi
              </h2>
              <p className="mt-3 text-sm sm:text-base text-indigo-100 leading-relaxed">
                Tinggalkan pencatatan manual di kertas atau Excel yang rawan selisih. Dapatkan
                software kasir dan pembukuan resmi dengan aktivasi instan via QRIS.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/katalog"
                  className="rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-900 hover:bg-indigo-50 shadow-md transition"
                >
                  Pilih Aplikasi Usaha Anda
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
