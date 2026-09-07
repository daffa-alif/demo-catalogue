"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";

export default function DemoRequestForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    branches: "1 Cabang",
    requirement: "POS & Kasir",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Halo tim sales BizApps, saya ingin menjadwalkan demo gratis untuk sistem bisnis saya.\n\nNama: ${form.name}\nPerusahaan: ${form.company || "-"}\nJumlah Cabang: ${form.branches}\nKebutuhan: ${form.requirement}`
  );

  if (submitted) {
    return (
      <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-8 sm:p-10 text-center animate-in fade-in zoom-in-95">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-black text-emerald-950">Permintaan Demo Diterima!</h3>
        <p className="mt-2 text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
          Terima kasih, <strong>{form.name}</strong>. Tim spesialis BizApps akan segera menghubungi nomor WhatsApp{" "}
          <span className="font-bold">{form.phone}</span> untuk menjadwalkan sesi demo interaktif dan simulasi fitur.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-md transition"
          >
            <MessageSquare className="h-4 w-4" />
            Chat Langsung via WhatsApp Sales
          </a>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: "",
                company: "",
                phone: "",
                branches: "1 Cabang",
                requirement: "POS & Kasir",
              });
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 bg-white px-5 py-3.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/50 transition"
          >
            Kirim Permintaan Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-1">
        <label className="text-xs font-semibold text-zinc-700 block">Nama Lengkap *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nama Anda"
          className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
        />
      </div>

      <div className="sm:col-span-1">
        <label className="text-xs font-semibold text-zinc-700 block">Nama Perusahaan / Bisnis</label>
        <input
          type="text"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="PT / CV / Toko Anda"
          className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
        />
      </div>

      <div className="sm:col-span-1">
        <label className="text-xs font-semibold text-zinc-700 block">Nomor WhatsApp *</label>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="0812-xxxx-xxxx"
          className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
        />
      </div>

      <div className="sm:col-span-1">
        <label className="text-xs font-semibold text-zinc-700 block">Jumlah Cabang</label>
        <select
          value={form.branches}
          onChange={(e) => setForm({ ...form, branches: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
        >
          <option>1 Cabang</option>
          <option>2-5 Cabang</option>
          <option>6-20 Cabang</option>
          <option>20+ Cabang</option>
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-zinc-700 block">Kebutuhan Utama</label>
        <select
          value={form.requirement}
          onChange={(e) => setForm({ ...form, requirement: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
        >
          <option>POS & Kasir Retail / Toko</option>
          <option>POS & Kasir Resto / Cafe</option>
          <option>Pembukuan & Akuntansi UMKM</option>
          <option>Manajemen Inventori & Gudang</option>
          <option>HRIS & Presensi Karyawan</option>
          <option>Paket Solusi Lengkap Multi-Cabang</option>
        </select>
      </div>

      <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 shadow-md transition cursor-pointer"
        >
          <span>Jadwalkan Demo Gratis</span>
          <ArrowRight className="h-4 w-4" />
        </button>
        <Link
          href="/katalog"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-6 py-3.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition"
        >
          Jelajahi Katalog Dulu
        </Link>
      </div>
    </form>
  );
}
