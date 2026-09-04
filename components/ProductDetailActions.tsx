"use client";

import { useState } from "react";
import QrisModal from "@/components/QrisModal";
import { formatRupiah } from "@/lib/utils";
import { QrCode, MessageCircle, ShieldCheck, Zap, Laptop } from "lucide-react";

interface ActionsProps {
  product: {
    id: string;
    title: string;
    price: number;
    isAvailable: boolean;
  };
}

export default function ProductDetailActions({ product }: ActionsProps) {
  const [isQrisOpen, setIsQrisOpen] = useState(false);

  const waMessage = encodeURIComponent(
    `Halo Tim BizApps, saya tertarik dengan aplikasi "${product.title}" seharga ${formatRupiah(product.price)}. Bisa minta informasi demo atau jadwal konsultasi implementasinya?`
  );

  return (
    <div className="mt-8 pt-6 border-t border-zinc-100 space-y-3">
      {/* Tombol QRIS Beli Lisensi */}
      <button
        type="button"
        onClick={() => setIsQrisOpen(true)}
        disabled={!product.isAvailable}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 px-6 py-4 text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 disabled:pointer-events-none"
      >
        <QrCode className="h-5 w-5" />
        Beli Lisensi Sekarang via QRIS (Aktivasi Otomatis)
      </button>

      {/* Tombol WhatsApp Live Demo */}
      <a
        href={`https://wa.me/6281234567890?text=${waMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs transition"
      >
        <MessageCircle className="h-4 w-4 text-emerald-600" />
        Konsultasi & Minta Link Live Demo via WhatsApp
      </a>

      {/* Garansi & Keunggulan Software */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-zinc-400 font-medium">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Lisensi Seumur Hidup
        </span>
        <span className="flex items-center gap-1">
          <Zap className="h-3.5 w-3.5 text-indigo-600" /> Garansi Bug & Free Update
        </span>
        <span className="flex items-center gap-1">
          <Laptop className="h-3.5 w-3.5 text-blue-600" /> Panduan Instalasi Lengkap
        </span>
      </div>

      {/* QRIS Modal */}
      <QrisModal
        isOpen={isQrisOpen}
        onClose={() => setIsQrisOpen(false)}
        product={{
          title: product.title,
          price: product.price,
        }}
      />
    </div>
  );
}
