"use client";

import { useState, useEffect } from "react";
import type { Product } from "@prisma/client";
import { getProducts, deleteProduct, toggleProductAvailability } from "@/app/actions/product";
import { getCurrentUser, loginUser, registerUser, logoutUser, SessionUser } from "@/app/actions/auth";
import { getAdminActivityStats } from "@/app/actions/order";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import AdminProductDialog from "@/components/AdminProductDialog";
import { formatRupiah } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  LogOut,
  LogIn,
  UserPlus,
  Loader2,
  Lock,
  TrendingUp,
  Activity,
  Layers,
  Users,
  DollarSign,
  Package,
  Home,
  LayoutGrid,
  AppWindow,
  User as UserIcon,
  Key,
  Copy,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Form State
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [submittingAuth, setSubmittingAuth] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // Product Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Admin Navigation & Activity Monitor State
  const [adminTab, setAdminTab] = useState<"activity" | "crud">("activity");
  const [activityStats, setActivityStats] = useState<{
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    totalProducts: number;
    recentOrders: any[];
  } | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const checkAuth = async () => {
    setAuthChecking(true);
    const user = await getCurrentUser();
    setCurrentUser(user);
    setAuthChecking(false);
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    const data = await getProducts();
    setProducts(data);
    setLoadingProducts(false);
  };

  const loadActivityStats = async () => {
    setLoadingStats(true);
    const data = await getAdminActivityStats();
    setActivityStats(data);
    setLoadingStats(false);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      loadProducts();
      loadActivityStats();
    }
  }, [currentUser]);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setAuthError("");
    try {
      const redirectUri =
        typeof window !== "undefined" && window.location.hostname.includes("vercel.app")
          ? `https://${window.location.host}/auth/callback`
          : `${window.location.origin}/auth/callback`;

      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          queryParams: {
            prompt: "select_account",
            access_type: "offline",
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || "Gagal menghubungkan dengan Google.");
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAuth(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const res = await loginUser(loginForm);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setAuthSuccess(res.message);
      } else {
        setAuthError(res.message);
      }
    } catch (err: any) {
      setAuthError(err.message || "Gagal masuk.");
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAuth(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const res = await registerUser(registerForm);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setAuthSuccess(res.message);
      } else {
        setAuthError(res.message);
      }
    } catch (err: any) {
      setAuthError(err.message || "Gagal mendaftarkan akun.");
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {}
      }

      try {
        const supabase = getSupabaseBrowserClient();
        await Promise.race([
          supabase.auth.signOut(),
          new Promise((resolve) => setTimeout(resolve, 500)),
        ]);
      } catch {}

      await logoutUser();
      setCurrentUser(null);
      window.location.href = "/api/auth/logout";
    } catch (err) {
      console.error("Logout error:", err);
      window.location.href = "/api/auth/logout";
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus produk "${title}"?`)) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    await toggleProductAvailability(id, current);
    loadProducts();
  };

  // 1. Loading State Awal
  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          Memeriksa hak akses admin...
        </div>
      </div>
    );
  }

  // 2. Jika Belum Login: Tampilkan Portal Login Admin
  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-b from-indigo-50 to-white px-8 pt-8 pb-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md mb-3">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Admin Portal</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Khusus pengelolaan katalog aplikasi & lisensi POS kasir
            </p>
          </div>

          <div className="p-8 pt-4">
            {/* Tombol Google Login Super Admin */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || submittingAuth}
              className="w-full flex items-center justify-center gap-3 rounded-2xl border border-zinc-300 bg-white py-3.5 px-4 text-sm font-bold text-zinc-700 shadow-xs hover:bg-zinc-50 hover:border-zinc-400 active:scale-[0.99] transition disabled:opacity-60 cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
              ) : (
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Masuk dengan Google</span>
            </button>

            {authError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 border border-emerald-200">
                {authSuccess}
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <span className="relative bg-white px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                atau akun lokal
              </span>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-zinc-200 mb-6">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setAuthError("");
                  setAuthSuccess("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === "login"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <LogIn className="h-4 w-4" /> Masuk Akun
              </button>
              <button
                onClick={() => {
                  setActiveTab("register");
                  setAuthError("");
                  setAuthSuccess("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === "register"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <UserPlus className="h-4 w-4" /> Daftar Akun
              </button>
            </div>

            {activeTab === "login" ? (
              /* TAB LOGIN */
              <form onSubmit={handleLogin} className="space-y-4">
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
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-blue-600 focus:outline-none"
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
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingAuth}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition"
                >
                  {submittingAuth ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  Masuk Sekarang
                </button>
              </form>
            ) : (
              /* TAB REGISTER */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    placeholder="Nama Lengkap"
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={registerForm.username}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, username: e.target.value })
                    }
                    placeholder="Username baru"
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, password: e.target.value })
                    }
                    placeholder="Minimal 5 karakter"
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingAuth}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition"
                >
                  {submittingAuth ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  Daftar Akun Baru
                </button>
              </form>
            )}

            <div className="mt-6 text-center border-t border-zinc-100 pt-4">
              <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-900">
                &larr; Kembali ke Beranda Katalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Jika Login sebagai USER Biasa (Bukan ADMIN)
  if (currentUser.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-8 shadow-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-4">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">Akses Ditolak</h2>
          <p className="text-xs text-zinc-500 mt-2">
            Halo <strong>{currentUser.name}</strong>, akun Anda (
            <span className="font-semibold text-zinc-700">
              {currentUser.email || currentUser.username}
            </span>
            ) saat ini masuk sebagai <span className="font-semibold text-zinc-800">Pengguna Biasa (USER)</span>.
            Dashboard ini dikhususkan untuk Administrator.
          </p>

          <div className="mt-6 rounded-2xl bg-zinc-100 p-4 border border-zinc-200 text-xs text-zinc-600 text-left">
            <p className="font-semibold text-zinc-800">Akses Terbatas</p>
            <p className="text-[11px] mt-1 text-zinc-500 leading-relaxed">
              Halaman ini hanya dapat diakses oleh akun terverifikasi dengan peran Administrator.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={handleLogout}
              className="w-full rounded-xl bg-zinc-900 py-3 text-xs font-bold text-white hover:bg-zinc-800 transition"
            >
              Keluar Akun
            </button>
            <Link
              href="/katalog"
              className="w-full rounded-xl border border-zinc-300 py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
            >
              Kembali ke Katalog Aplikasi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Jika Login sebagai ADMIN: Tampilkan Dashboard Pengelolaan Produk & Pemantauan Aktivitas
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
      {/* Top Unified Navigation Bar (User Nav + Admin Nav) */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 text-zinc-900 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-transform group-hover:scale-105">
              <AppWindow className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg leading-tight tracking-tight text-zinc-900">
                Biz<span className="text-indigo-600">Apps</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">
                Admin Console
              </span>
            </div>
          </Link>

          {/* Unified Navigation: Nav User Biasa + Nav Button Admin */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100/90 p-1 rounded-xl border border-zinc-200">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-white/60 transition"
            >
              <Home className="h-3.5 w-3.5" />
              Beranda
            </Link>
            <Link
              href="/katalog"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-white/60 transition"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Katalog Aplikasi
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-white/60 transition"
            >
              <UserIcon className="h-3.5 w-3.5" />
              Profil Saya
            </Link>
            <div className="h-4 w-px bg-zinc-300 mx-1" />
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-900 text-white shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Dashboard Admin
            </span>
          </nav>

          {/* Right Controls: Super Admin Badge & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 border border-zinc-200 rounded-xl px-3 py-1.5 bg-zinc-50">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-800">{currentUser.name}</span>
              <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-[9px] font-black text-purple-700 uppercase">
                Admin
              </span>
            </div>

            <Link
              href="/katalog"
              target="_blank"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition"
            >
              Katalog Publik
              <ExternalLink className="h-3 w-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition cursor-pointer"
              title="Keluar Sesi Admin"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Sub-Header & Tab Selector */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
                Pusat Kontrol & Pemantauan Admin
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                Live System
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Pantau aktivitas penjualan lisensi, statistik pendapatan, dan kelola katalog software POS kasir secara langsung.
            </p>
          </div>

          {/* Tab Selector & Quick Action */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex p-1 bg-zinc-200/80 rounded-2xl border border-zinc-300/60">
              <button
                onClick={() => setAdminTab("activity")}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  adminTab === "activity"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Activity className="h-3.5 w-3.5 text-indigo-600" />
                Aktivitas & Metrik
              </button>
              <button
                onClick={() => setAdminTab("crud")}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  adminTab === "crud"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Package className="h-3.5 w-3.5 text-blue-600" />
                Katalog Produk ({products.length})
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedProduct(null);
                setIsDialogOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm hover:shadow transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Produk</span>
            </button>
          </div>
        </div>

        {/* TAB 1: AKTIVITAS & METRIK PENJUALAN */}
        {adminTab === "activity" && (
          <div className="mt-8 space-y-8 animate-in fade-in duration-200">
            {/* 4 Kartu Metrik Ringkasan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Omset Penjualan */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Total Omset Penjualan
                  </span>
                  <span className="text-xl font-black text-zinc-900 mt-0.5 block">
                    {loadingStats ? "..." : formatRupiah(activityStats?.totalRevenue || 0)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                    <TrendingUp className="h-3 w-3" /> Transaksi QRIS Lunas
                  </span>
                </div>
              </div>

              {/* Lisensi Terjual */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
                  <Key className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Lisensi Terjual
                  </span>
                  <span className="text-xl font-black text-zinc-900 mt-0.5 block">
                    {loadingStats ? "..." : `${activityStats?.totalOrders || 0} Lisensi`}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">
                    Aktif dan terverifikasi
                  </span>
                </div>
              </div>

              {/* Total Pengguna */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Pengguna Terdaftar
                  </span>
                  <span className="text-xl font-black text-zinc-900 mt-0.5 block">
                    {loadingStats ? "..." : `${activityStats?.totalUsers || 0} Akun`}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">
                    Member & pembeli software
                  </span>
                </div>
              </div>

              {/* Total Produk Katalog */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shrink-0">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Software di Katalog
                  </span>
                  <span className="text-xl font-black text-zinc-900 mt-0.5 block">
                    {loadingStats ? "..." : `${activityStats?.totalProducts || 0} Aplikasi`}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">
                    POS Kasir & Bisnis
                  </span>
                </div>
              </div>
            </div>

            {/* Tabel Live Transaksi Lisensi & Aktivitas Pengguna */}
            <div className="rounded-3xl border border-zinc-200 bg-white shadow-xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-zinc-50/50">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    Aktivitas Transaksi & Penerbitan Lisensi Terkini
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Memantau setiap transaksi pembelian aplikasi, identitas pembeli, dan kode lisensi yang terbit secara real-time.
                  </p>
                </div>
                <button
                  onClick={loadActivityStats}
                  disabled={loadingStats}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition cursor-pointer self-start sm:self-auto"
                >
                  {loadingStats ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  )}
                  Muat Ulang Data
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-600">
                  <thead className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] uppercase font-bold text-zinc-600 tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Invoice / Waktu</th>
                      <th className="px-6 py-3.5">Pembeli (User)</th>
                      <th className="px-6 py-3.5">Software Aplikasi</th>
                      <th className="px-6 py-3.5">Kunci Lisensi Terbit</th>
                      <th className="px-6 py-3.5">Nominal & Metode</th>
                      <th className="px-6 py-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {loadingStats ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                          <div className="flex items-center justify-center gap-2 text-xs font-medium">
                            <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                            Memuat log transaksi...
                          </div>
                        </td>
                      </tr>
                    ) : activityStats?.recentOrders && activityStats.recentOrders.length > 0 ? (
                      activityStats.recentOrders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-zinc-50/70 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-mono font-bold text-xs text-zinc-900">
                              {order.orderNumber}
                            </div>
                            <div className="text-[11px] text-zinc-400 mt-0.5">
                              {new Intl.DateTimeFormat("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(new Date(order.createdAt))}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-semibold text-zinc-900 text-xs">
                              {order.user?.name || "Pengguna"}
                            </div>
                            <div className="text-[11px] text-zinc-400">
                              {order.user?.email || `@${order.user?.username}`}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={order.product?.imageUrl || "https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800"}
                                alt={order.product?.title || "Aplikasi"}
                                className="h-9 w-9 rounded-xl object-cover border border-zinc-200 bg-zinc-100 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-xs text-zinc-900 line-clamp-1">
                                  {order.product?.title || "Software"}
                                </div>
                                <span className="inline-block rounded px-1.5 py-0.2 text-[9px] font-bold bg-zinc-100 text-zinc-600 uppercase">
                                  {order.product?.category || "POS"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="inline-flex items-center gap-1.5 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200 font-mono text-xs font-bold text-indigo-900">
                              <Key className="h-3 w-3 text-indigo-600 shrink-0" />
                              <span className="select-all text-[11px]">{order.licenseKey}</span>
                              <button
                                onClick={() => handleCopyKey(order.licenseKey)}
                                className="text-zinc-400 hover:text-zinc-800 ml-1 transition cursor-pointer"
                                title="Salin Lisensi"
                              >
                                {copiedKey === order.licenseKey ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-bold text-xs text-zinc-900">
                              {formatRupiah(order.totalAmount)}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-semibold uppercase">
                              {order.paymentMethod || "QRIS Instan"}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                              <Check className="h-3 w-3" />
                              Lunas
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                          Belum ada transaksi lisensi yang tercatat. Transaksi baru melalui QRIS akan otomatis tampil di sini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAJEMEN KATALOG PRODUK (CRUD) */}
        {adminTab === "crud" && (
          <div className="mt-8 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-zinc-900 tracking-tight flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Daftar Katalog Software & POS Kasir
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Kelola katalog yang tersedia untuk dibeli oleh pengguna.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setIsDialogOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Tambah Software Baru
              </button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-600">
                  <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase font-semibold text-zinc-700">
                    <tr>
                      <th className="px-6 py-4">Aplikasi / Software</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Harga Lisensi</th>
                      <th className="px-6 py-4">Status Lisensi</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {products.length > 0 ? (
                      products.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.imageUrl}
                                alt={p.title}
                                className="h-12 w-12 rounded-xl object-cover border border-zinc-200 bg-zinc-100"
                              />
                              <div>
                                <div className="font-semibold text-zinc-900">{p.title}</div>
                                <div className="text-xs text-zinc-400">/{p.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-zinc-900">
                            {formatRupiah(p.price)}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggle(p.id, p.isAvailable)}
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                                p.isAvailable
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                  : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                              }`}
                            >
                              {p.isAvailable ? (
                                <>
                                  <Check className="h-3 w-3" /> Ready
                                </>
                              ) : (
                                <>
                                  <X className="h-3 w-3" /> Habis
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedProduct(p);
                                  setIsDialogOpen(true);
                                }}
                                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-blue-600 cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id, p.title)}
                                className="rounded-lg p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                          {loadingProducts ? "Memuat data produk..." : "Belum ada data produk software."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Dialog Form Tambah / Edit */}
      <AdminProductDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedProduct(null);
          loadProducts();
          loadActivityStats();
        }}
        productToEdit={selectedProduct}
      />
    </div>
  );
}
