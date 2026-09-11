"use client";

import { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/utils";
import { createOrder } from "@/app/actions/order";
import { getCurrentUser, loginUser, registerUser, SessionUser } from "@/app/actions/auth";
import {
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  QrCode,
  Smartphone,
  Copy,
  Check,
  ArrowRight,
  UserCheck,
  LogIn,
  UserPlus,
  Loader2,
  Lock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface QrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id?: string;
    title: string;
    price: number;
  };
  onAuthSuccess?: (user: SessionUser) => void;
}

export default function QrisModal({ isOpen, onClose, product, onAuthSuccess }: QrisModalProps) {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Modal In-Place Auth State
  const [authTab, setActiveTab] = useState<"login" | "register">("login");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // Payment state
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 menit
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdOrder, setCreatedOrder] = useState<{
    orderNumber: string;
    licenseKey: string;
  } | null>(null);

  // Generate fallback transaction ID
  const [trxId] = useState(() => `TRX-${Math.floor(100000 + Math.random() * 900000)}`);

  // Check auth whenever modal opens
  useEffect(() => {
    if (!isOpen) return;

    async function checkAuth() {
      setAuthChecking(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
      setAuthChecking(false);
    }

    checkAuth();
  }, [isOpen]);

  // Timer countdown (only runs when user is verified and modal open)
  useEffect(() => {
    if (!isOpen || isPaid || !currentUser) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPaid, currentUser]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Handle in-modal Login
  const handleModalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const res = await loginUser(loginForm);
      if (res.success && res.user) {
        setAuthSuccess("Verifikasi berhasil! Menyiapkan kode QRIS...");
        setCurrentUser(res.user);
        if (onAuthSuccess) onAuthSuccess(res.user);
      } else {
        setAuthError(res.message);
      }
    } catch (err: any) {
      setAuthError(err.message || "Gagal melakukan verifikasi akun.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle in-modal Register
  const handleModalRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const res = await registerUser(registerForm);
      if (res.success && res.user) {
        setAuthSuccess("Akun pembeli terverifikasi! Menyiapkan kode QRIS...");
        setCurrentUser(res.user);
        if (onAuthSuccess) onAuthSuccess(res.user);
      } else {
        setAuthError(res.message);
      }
    } catch (err: any) {
      setAuthError(err.message || "Gagal mendaftarkan akun pembeli.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSimulatePayment = async () => {
    setIsVerifying(true);
    setErrorMessage("");

    try {
      if (!product.id) {
        throw new Error("ID produk tidak valid.");
      }

      const res = await createOrder({
        productId: product.id,
        totalAmount: product.price,
        paymentMethod: "QRIS",
      });

      if (!res.success) {
        setErrorMessage(res.message);
        setIsVerifying(false);
        return;
      }

      if (res.order) {
        setCreatedOrder({
          orderNumber: res.order.orderNumber,
          licenseKey: res.order.licenseKey,
        });
      }

      setIsPaid(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memproses transaksi.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(String(product.price));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dummyQrisUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=00020101021226580016ID.CO.QRIS.WWW011893600918000000000002150000000000000005204581253033605802ID5912ELECTROSTORE6007JAKARTA61051234062070703A016304`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-zinc-200 overflow-hidden my-8">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-base flex items-center gap-1.5">
                <span>Checkout Lisensi Software</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-medium">
                  RESMI & AMAN
                </span>
              </div>
              <p className="text-xs text-indigo-100">
                {currentUser ? "Pembayaran QRIS & Aktivasi Otomatis" : "Verifikasi Akun Pembeli"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* 1. Loading Auth State */}
          {authChecking ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
              <p className="text-sm font-medium text-zinc-600">
                Memeriksa verifikasi akun pembeli...
              </p>
            </div>
          ) : !currentUser ? (
            /* 2. Step 1: Buyer Authentication Required */
            <div>
              {/* Product mini header */}
              <div className="rounded-2xl bg-zinc-50 p-3.5 border border-zinc-200 mb-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Aplikasi yang Dipesan
                  </span>
                  <span className="text-xs font-bold text-zinc-900 line-clamp-1">
                    {product.title}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-indigo-600">
                    {formatRupiah(product.price)}
                  </span>
                </div>
              </div>

              {/* Explanatory Notice: Mengapa Butuh Auth */}
              <div className="rounded-2xl bg-indigo-50/80 border border-indigo-100 p-4 mb-5 text-xs text-indigo-950">
                <div className="flex items-center gap-2 font-bold text-indigo-900 mb-1">
                  <Lock className="h-4 w-4 text-indigo-600 shrink-0" />
                  Verifikasi Akun Pembeli Diperlukan
                </div>
                <p className="text-indigo-800 text-[11.5px] leading-relaxed">
                  Sesuai kebijakan keamanan BizApps, setiap transaksi wajib diverifikasi ke akun
                  pembeli. Kunci lisensi resmi seumur hidup dan master file aplikasi akan otomatis
                  ditautkan ke profil Anda.
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex border-b border-zinc-200 mb-5">
                <button
                  onClick={() => {
                    setActiveTab("login");
                    setAuthError("");
                    setAuthSuccess("");
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                    authTab === "login"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <LogIn className="h-3.5 w-3.5" /> Masuk Akun
                </button>
                <button
                  onClick={() => {
                    setActiveTab("register");
                    setAuthError("");
                    setAuthSuccess("");
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                    authTab === "register"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <UserPlus className="h-3.5 w-3.5" /> Daftar Akun Baru (30 Detik)
                </button>
              </div>

              {/* Error & Success Messages */}
              {authError && (
                <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                  {authError}
                </div>
              )}

              {authSuccess && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 border border-emerald-200 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {authTab === "login" ? (
                /* Tab Login Form */
                <form onSubmit={handleModalLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase">
                      Email atau Username
                    </label>
                    <input
                      type="text"
                      required
                      value={loginForm.username}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, username: e.target.value })
                      }
                      placeholder="email@anda.com atau username"
                      className="mt-1 w-full rounded-xl border border-zinc-300 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="mt-1 w-full rounded-xl border border-zinc-300 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
                  >
                    {authSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                    Verifikasi & Lanjut Pembayaran
                  </button>
                </form>
              ) : (
                /* Tab Register Form */
                <form onSubmit={handleModalRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase">
                      Nama Lengkap Anda
                    </label>
                    <input
                      type="text"
                      required
                      value={registerForm.name}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, name: e.target.value })
                      }
                      placeholder="Contoh: Budi Pratama"
                      className="mt-1 w-full rounded-xl border border-zinc-300 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase">
                      Username Unik
                    </label>
                    <input
                      type="text"
                      required
                      value={registerForm.username}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, username: e.target.value })
                      }
                      placeholder="Contoh: budipratama"
                      className="mt-1 w-full rounded-xl border border-zinc-300 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase">
                      Email Pembeli (Untuk Bukti Lisensi)
                    </label>
                    <input
                      type="email"
                      required
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, email: e.target.value })
                      }
                      placeholder="email@anda.com"
                      className="mt-1 w-full rounded-xl border border-zinc-300 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase">
                      Password Akun
                    </label>
                    <input
                      type="password"
                      required
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, password: e.target.value })
                      }
                      placeholder="Minimal 5 karakter"
                      className="mt-1 w-full rounded-xl border border-zinc-300 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
                  >
                    {authSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    Daftar Cepat & Lanjut QRIS
                  </button>
                </form>
              )}
            </div>
          ) : !isPaid ? (
            /* 3. Step 2: QRIS Payment with Verified Buyer Badge */
            <>
              {/* Verified Buyer Identity Banner */}
              <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>Pembeli Terverifikasi</span>
                      <span className="text-[10px] bg-emerald-200/70 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                        Aktif
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      {currentUser.name} ({currentUser.email || `@${currentUser.username}`})
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-1 rounded-lg border border-emerald-200 shrink-0">
                  Lisensi Ditautkan
                </span>
              </div>

              {/* Product & Price Summary */}
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-200/80 mb-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                      Barang yang Dipesan
                    </span>
                    <h4 className="text-sm font-bold text-zinc-900 line-clamp-1 mt-0.5">
                      {product.title}
                    </h4>
                    <span className="text-xs text-zinc-500 mt-0.5 block">Kode: {trxId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                      Total Tagihan
                    </span>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span className="text-lg font-black text-red-600">
                        {formatRupiah(product.price)}
                      </span>
                      <button
                        onClick={handleCopyAmount}
                        title="Salin Nominal"
                        className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="mt-3.5 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-amber-500" /> Sisa Waktu Pembayaran
                  </span>
                  <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {formattedTime}
                  </span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative rounded-2xl border-2 border-dashed border-zinc-300 p-4 bg-white shadow-sm flex flex-col items-center">
                  <div className="text-[11px] font-bold text-zinc-700 mb-2 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Merchant: BizApps Software Official
                  </div>

                  {/* QR Image Dummy */}
                  <div className="relative aspect-square w-48 h-48 bg-zinc-50 rounded-xl overflow-hidden border border-zinc-200 flex items-center justify-center">
                    <img
                      src={dummyQrisUrl}
                      alt="Dummy QRIS Payment"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium">
                    <span>NMID: ID1020268841029</span>
                    <span>•</span>
                    <span>A01</span>
                  </div>
                </div>

                {/* E-Wallet & Bank Badges */}
                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-semibold text-zinc-600">
                  <span className="bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
                    BCA Mobile
                  </span>
                  <span className="bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
                    Mandiri Livin
                  </span>
                  <span className="bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
                    GoPay
                  </span>
                  <span className="bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
                    OVO
                  </span>
                  <span className="bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
                    DANA
                  </span>
                  <span className="bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
                    ShopeePay
                  </span>
                </div>
              </div>

              {/* Steps Guide */}
              <div className="mt-5 rounded-xl bg-blue-50/60 p-3.5 border border-blue-100 text-xs text-blue-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  Cara Bayar:
                </div>
                <ol className="list-decimal list-inside space-y-1 text-blue-800 text-[11px] leading-relaxed">
                  <li>Buka aplikasi m-Banking atau e-Wallet pilihan Anda.</li>
                  <li>Scan QR Code di atas menggunakan fitur Pay / Scan QRIS.</li>
                  <li>Periksa nama penerima (BizApps) dan total nominal pembayaran.</li>
                  <li>Selesaikan pembayaran dan klik tombol verifikasi di bawah.</li>
                </ol>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 rounded-xl bg-red-50 p-3.5 border border-red-200 text-xs text-red-700">
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              )}

              {/* Action Button: Simulate Payment */}
              <div className="mt-5">
                <button
                  onClick={handleSimulatePayment}
                  disabled={isVerifying}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 active:scale-[0.99] transition disabled:opacity-60 cursor-pointer"
                >
                  {isVerifying ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Menerbitkan Lisensi ke Akun Anda...
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Simulasi: Saya Sudah Bayar
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-zinc-400 mt-2">
                  *Setelah konfirmasi, lisensi seumur hidup otomatis aktif di profil akun Anda.
                </p>
              </div>
            </>
          ) : (
            /* 4. Success State */
            <div className="py-6 text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-900">Pembayaran Berhasil!</h3>
              <p className="text-xs text-zinc-600 mt-1 max-w-sm">
                Transaksi Anda sebesar <strong>{formatRupiah(product.price)}</strong> telah kami
                terima. Lisensi resmi telah berhasil diterbitkan untuk akun Anda.
              </p>

              <div className="mt-5 w-full rounded-2xl bg-zinc-50 p-4 border border-zinc-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Pemilik Lisensi:</span>
                  <span className="font-bold text-zinc-900">
                    {currentUser?.name} ({currentUser?.email || `@${currentUser?.username}`})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">ID Pesanan:</span>
                  <span className="font-mono font-bold text-zinc-800">
                    {createdOrder?.orderNumber || trxId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Metode Bayar:</span>
                  <span className="font-semibold text-zinc-800">QRIS Real-Time</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status:</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    LUNAS / AKTIF RESMI
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
                  <span className="text-zinc-500 font-semibold">Kunci Lisensi:</span>
                  <div className="flex items-center gap-1.5">
                    <code className="font-mono font-bold text-indigo-700 select-all">
                      {createdOrder?.licenseKey || "LIC-BZ89-4910-2026-PRO"}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          createdOrder?.licenseKey || "LIC-BZ89-4910-2026-PRO"
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      title="Salin Kunci Lisensi"
                      className="text-zinc-400 hover:text-indigo-600 p-1 cursor-pointer"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 italic mt-1">
                  *Kunci lisensi resmi dan installer software dapat diunduh kapan saja di halaman profil akun Anda.
                </p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row w-full gap-3">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-700 shadow-md transition"
                >
                  <span>Buka Profil & Unduh Aplikasi</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => {
                    setIsPaid(false);
                    onClose();
                  }}
                  className="flex-1 rounded-xl border border-zinc-300 bg-white py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
