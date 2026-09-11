"use client";

import { useState, useEffect } from "react";
import QrisModal from "@/components/QrisModal";
import { formatRupiah } from "@/lib/utils";
import { getCurrentUser, SessionUser } from "@/app/actions/auth";
import { QrCode, MessageCircle, ShieldCheck, Zap, Laptop, Lock } from "lucide-react";

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
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      setCurrentUser(user);
    }
    loadUser();
  }, []);

  const waMessage = encodeURIComponent(
    `Halo Tim BizApps, saya tertarik dengan aplikasi "${product.title}" seharga ${formatRupiah(product.price)}. Bisa minta informasi demo atau jadwal konsultasi implementasinya?`
  );

  return (
    <div className="mt-8 pt-6 border-t border-zinc-100 space-y-3">
      {/* Buyer Verification Status Banner */}
      {currentUser ? (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs text-emerald-900 shadow-2xs">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <div className="leading-tight">
            <span>Pembeli Terverifikasi: </span>
            <strong>{currentUser.name}</strong>{" "}
            <span className="text-emerald-700">({currentUser.email || `@${currentUser.username}`})</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 px-3.5 py-2.5 text-xs text-indigo-900 shadow-2xs">
          <Lock className="h-4 w-4 text-indigo-600 shrink-0" />
          <div className="leading-tight">
            <span className="font-semibold">Perlindungan Pembelian: </span>
            <span className="text-indigo-800">
              Verifikasi akun pembeli otomatis saat checkout untuk penerbitan lisensi seumur hidup.
            </span>
          </div>
        </div>
      )}

      {/* Tombol QRIS Beli Lisensi */}
      <button
        type="button"
        onClick={() => setIsQrisOpen(true)}
        disabled={!product.isAvailable}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 px-6 py-4 text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
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
          id: product.id,
          title: product.title,
          price: product.price,
        }}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}
