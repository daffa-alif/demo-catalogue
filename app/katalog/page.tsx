import { getProducts } from "@/app/actions/product";
import CatalogSection from "@/components/CatalogSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppWindow } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Aplikasi Bisnis & POS Kasir | BizApps",
  description:
    "Koleksi aplikasi Point of Sale (POS), software pencatatan penjualan, inventori gudang, dan sistem kasir siap pakai dengan lisensi seumur hidup.",
};

export const dynamic = "force-dynamic";

export default async function KatalogPage() {
  const products = await getProducts();

  const categories = [
    "POS & Kasir Retail",
    "POS & Kasir Resto / Cafe",
    "Pencatatan Penjualan & Akuntansi",
    "Manajemen Inventori & Gudang",
    "HRIS & Presensi Karyawan",
    "CRM & Otomasi Bisnis",
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Katalog */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200 mb-2">
              <AppWindow className="h-3.5 w-3.5" />
              Katalog Software Bisnis
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              Koleksi Aplikasi & Sistem Kasir
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Tersedia {products.length} pilihan perangkat lunak siap pakai. Lisensi resmi, garansi
              bug, dan kemudahan pembayaran via QRIS.
            </p>
          </div>
        </div>

        {/* Search & Grid Katalog */}
        <CatalogSection initialProducts={products} categories={categories} />
      </main>

      <Footer />
    </div>
  );
}
