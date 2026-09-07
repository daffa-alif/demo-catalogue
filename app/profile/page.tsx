"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getUserProfile, logoutUser, UserProfile } from "@/app/actions/auth";
import { getUserOrders } from "@/app/actions/order";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { formatRupiah } from "@/lib/utils";
import {
  User as UserIcon,
  ShieldCheck,
  Calendar,
  Clock,
  Package,
  Key,
  Copy,
  Check,
  Download,
  ExternalLink,
  LogOut,
  Loader2,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileCode2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [profileData, ordersData] = await Promise.all([
        getUserProfile(),
        getUserOrders(),
      ]);

      if (!profileData) {
        // Belum login, arahkan ke login
        router.push("/login");
        return;
      }

      setProfile(profileData);
      setOrders(ordersData);
      setLoading(false);
    }

    loadData();
  }, [router]);

  const handleCopy = (licenseKey: string) => {
    navigator.clipboard.writeText(licenseKey);
    setCopiedKey(licenseKey);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    await logoutUser();
    window.location.href = "/";
  };

  const handleDownload = (productTitle: string) => {
    setDownloadNotice(`Paket installer dan source code untuk "${productTitle}" siap diunduh. Lisensi Anda telah aktif.`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col justify-between text-zinc-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            Memuat profil akun Anda...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between text-zinc-900">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Notifikasi Download */}
        {downloadNotice && (
          <div className="mb-6 rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-sm text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{downloadNotice}</span>
            </div>
            <button
              onClick={() => setDownloadNotice(null)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 ml-4"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Kartu Profil Utama */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-zinc-100">
            {/* User Avatar & Identity */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-2xl shadow-md">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                    {profile.name}
                  </h1>
                  {profile.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Super Administrator
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Pelanggan Terverifikasi
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {profile.email || `@${profile.username}`}
                </p>
              </div>
            </div>

            {/* Aksi Sesi / Logout */}
            <div className="flex items-center gap-3">
              {profile.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition shadow-xs"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Buka Dashboard Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition"
              >
                <LogOut className="h-4 w-4" />
                Keluar Akun
              </button>
            </div>
          </div>

          {/* Kartu Informasi Akun & Lama Aktif */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="rounded-2xl bg-zinc-50/70 p-4 border border-zinc-100 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Lama Akun Aktif
                </span>
                <span className="text-sm font-bold text-zinc-900 mt-0.5 block">
                  {profile.accountAgeText}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-50/70 p-4 border border-zinc-100 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Tanggal Bergabung
                </span>
                <span className="text-sm font-bold text-zinc-900 mt-0.5 block">
                  {profile.joinedDateText}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-50/70 p-4 border border-zinc-100 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Aplikasi Dimiliki
                </span>
                <span className="text-sm font-bold text-zinc-900 mt-0.5 block">
                  {orders.length} Software Aktif
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian Riwayat Software & Lisensi yang Dibeli */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">
                Software & Lisensi Resmi Saya
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Daftar aplikasi bisnis yang telah Anda beli lengkap dengan lisensi aktif
              </p>
            </div>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              Katalog Lengkap <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs hover:border-zinc-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Info Produk */}
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={order.product?.imageUrl || "https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800"}
                      alt={order.product?.title || "Aplikasi"}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-zinc-200 shrink-0 bg-zinc-100"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">
                          {order.product?.category || "Software"}
                        </span>
                        <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          {order.status === "PAID" ? "LUNAS / AKTIF" : order.status}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {order.orderNumber}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-zinc-900 mt-1">
                        {order.product?.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1 flex-wrap">
                        <span>
                          Dibeli:{" "}
                          <strong>
                            {new Intl.DateTimeFormat("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(order.createdAt))}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Biaya: <strong className="text-zinc-900">{formatRupiah(order.totalAmount)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Kunci Lisensi & Tombol Aksi */}
                  <div className="flex flex-col sm:items-end gap-3 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-zinc-100">
                    <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-200 w-full sm:w-auto">
                      <Key className="h-4 w-4 text-indigo-600 shrink-0" />
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                          Kunci Lisensi Resmi
                        </span>
                        <code className="text-xs font-mono font-black text-indigo-900 tracking-wide select-all">
                          {order.licenseKey}
                        </code>
                      </div>
                      <button
                        onClick={() => handleCopy(order.licenseKey)}
                        title="Salin Kunci Lisensi"
                        className="ml-2 p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-white rounded-lg transition"
                      >
                        {copiedKey === order.licenseKey ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleDownload(order.product?.title || "Aplikasi")}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs transition"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Unduh File
                      </button>

                      <Link
                        href={`/product/${order.product?.slug}`}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs transition"
                      >
                        <FileCode2 className="h-3.5 w-3.5 text-zinc-400" />
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Belum Ada Pembelian Software</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Anda belum memiliki lisensi aplikasi bisnis. Beli aplikasi kasir POS atau pencatatan penjualan sekarang dengan pembayaran instan QRIS.
              </p>
              <div className="mt-6">
                <Link
                  href="/katalog"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-700 shadow-md transition"
                >
                  <Package className="h-4 w-4" />
                  Jelajahi Katalog Aplikasi
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
