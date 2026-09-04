"use client";

import { useState, useEffect } from "react";
import type { Product } from "@prisma/client";
import { getProducts, deleteProduct, toggleProductAvailability } from "@/app/actions/product";
import { getCurrentUser, loginUser, registerUser, logoutUser, SessionUser } from "@/app/actions/auth";
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
  Sparkles,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Form State
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [submittingAuth, setSubmittingAuth] = useState(false);
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

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      loadProducts();
    }
  }, [currentUser]);

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
    await logoutUser();
    setCurrentUser(null);
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

  const fillAdminCredentials = () => {
    setLoginForm({ username: "admin", password: "admin123" });
    setActiveTab("login");
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

  // 2. Jika Belum Login: Tampilkan Form Login / Register Autentikasi Pengguna
  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-b from-blue-50 to-white px-8 pt-8 pb-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md mb-3">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Admin Portal</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Silakan login untuk mengelola katalog produk elektronik
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-zinc-200 px-8">
            <button
              onClick={() => {
                setActiveTab("login");
                setAuthError("");
                setAuthSuccess("");
              }}
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
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
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
                activeTab === "register"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <UserPlus className="h-4 w-4" /> Daftar User Baru
            </button>
          </div>

          <div className="p-8">
            {/* Box Petunjuk Khusus Admin */}
            <div className="rounded-2xl bg-amber-50 p-3.5 border border-amber-200 text-xs text-amber-900 mb-6 flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Kondisi Khusus Akun Admin:</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  User: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">admin</code> | 
                  Pass: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">admin123</code>
                </p>
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 underline hover:text-amber-950"
                >
                  <Sparkles className="h-3 w-3" /> Isi Cepat Akun Admin
                </button>
              </div>
            </div>

            {authError && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 border border-emerald-200">
                {authSuccess}
              </div>
            )}

            {activeTab === "login" ? (
              /* TAB LOGIN */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, username: e.target.value })
                    }
                    placeholder="admin atau username Anda"
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
                    Email (Opsional)
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
            Halo <strong>{currentUser.name}</strong>, Anda saat ini masuk dengan hak akses{" "}
            <span className="font-semibold text-zinc-800">Pengguna Biasa (USER)</span>.
            Dashboard ini dikhususkan untuk akun dengan hak Administrator.
          </p>

          <div className="mt-6 rounded-2xl bg-blue-50 p-4 border border-blue-200 text-xs text-blue-900 text-left">
            <p className="font-bold">Ingin Menguji Dashboard Admin?</p>
            <p className="text-[11px] mt-1 text-blue-800">
              Silakan logout lalu masuk dengan akun khusus:
              <br />
              Username: <code className="font-bold">admin</code> | Password:{" "}
              <code className="font-bold">admin123</code>
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={handleLogout}
              className="w-full rounded-xl bg-zinc-900 py-3 text-xs font-bold text-white hover:bg-zinc-800 transition"
            >
              Keluar & Masuk Sebagai Admin
            </button>
            <Link
              href="/katalog"
              className="w-full rounded-xl border border-zinc-300 py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
            >
              Kembali Belanja di Katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Jika Login sebagai ADMIN: Tampilkan Dashboard Pengelolaan Produk Lengkap
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header Admin */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-zinc-900">
                Dashboard Katalog Aplikasi & POS Kasir
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                Super Admin
              </span>
            </div>
            <p className="text-sm text-zinc-500 mt-1">
              Selamat datang, <strong>{currentUser.name}</strong>. Kelola daftar aplikasi, lisensi,
              harga, dan ketersediaan software.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/katalog"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs"
            >
              Lihat Katalog Publik
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={() => {
                setSelectedProduct(null);
                setIsDialogOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              Tambah Produk
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </button>
          </div>
        </div>

        {/* Tabel Data Produk */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xs">
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
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
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
                            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-blue-600"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="rounded-lg p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600"
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
                      {loadingProducts ? "Memuat data produk..." : "Belum ada data produk elektronik."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Dialog Form Tambah / Edit */}
      <AdminProductDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedProduct(null);
          loadProducts();
        }}
        productToEdit={selectedProduct}
      />
    </div>
  );
}
