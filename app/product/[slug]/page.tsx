import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailActions from "@/components/ProductDetailActions";
import { getProductBySlug } from "@/app/actions/product";
import { formatRupiah } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, XCircle, Tag, Cpu, Shield } from "lucide-react";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produk Tidak Ditemukan | ElectroStore" };

  return {
    title: `${product.title} | ElectroStore`,
    description: product.description.slice(0, 150),
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col justify-between">
      <Navbar />

      <main className="mx-auto max-w-5xl w-full flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-6">
          <Link href="/" className="hover:text-zinc-900">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/katalog" className="hover:text-zinc-900">
            Katalog Elektronik
          </Link>
          <span>/</span>
          <span className="text-zinc-800 line-clamp-1">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 shadow-sm">
          {/* Gambar Produk */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-100 flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-zinc-800 shadow-sm backdrop-blur">
                <Tag className="h-3.5 w-3.5 text-blue-600" />
                {product.category}
              </span>
            </div>
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                <span className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white uppercase tracking-wider">
                  Stok Habis / Pre-Order
                </span>
              </div>
            )}
          </div>

          {/* Info Detail Produk */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                {product.isAvailable ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready Stock (Siap Kirim)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                    <XCircle className="h-3.5 w-3.5" /> Stok Saat Ini Kosong
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  <Shield className="h-3 w-3" /> Garansi Resmi
                </span>
              </div>

              <h1 className="mt-3 text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-snug">
                {product.title}
              </h1>

              <div className="mt-4">
                <span className="text-xs font-medium text-zinc-400 block uppercase tracking-wider">
                  Harga Resmi (Termasuk PPN)
                </span>
                <span className="text-3xl font-black text-blue-600">
                  {formatRupiah(product.price)}
                </span>
              </div>

              <div className="mt-6 border-t border-zinc-100 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-zinc-400" />
                  Spesifikasi & Deskripsi
                </h3>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Tombol QRIS & Kontak */}
            <ProductDetailActions product={product} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
