"use client";

import { useState } from "react";
import { loginUser, registerUser } from "@/app/actions/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppWindow, ShieldCheck, UserPlus, LogIn, KeyRound, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Login form state
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await loginUser(loginData);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          if (res.user?.role === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/katalog");
          }
          router.refresh();
        }, 600);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await registerUser(registerData);
      if (res.success) {
        setSuccessMsg("Akun berhasil didaftarkan! Mengalihkan ke katalog...");
        setTimeout(() => {
          router.push("/katalog");
          router.refresh();
        }, 800);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mendaftarkan akun.");
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setLoginData({ username: "admin", password: "admin123" });
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between text-zinc-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
          {/* Header Card */}
          <div className="bg-gradient-to-b from-indigo-50 to-white px-8 pt-8 pb-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md mb-3">
              <AppWindow className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900">
              Biz<span className="text-indigo-600">Apps</span> ID
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Portal Autentikasi Pelanggan & Administrator
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-zinc-200 px-8">
            <button
              onClick={() => {
                setActiveTab("login");
                setErrorMsg("");
                setSuccessMsg("");
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
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
                activeTab === "register"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <UserPlus className="h-4 w-4" /> Daftar Pengguna Baru
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Quick Demo Credentials Banner */}
            <div className="rounded-2xl bg-amber-50/80 p-3.5 border border-amber-200/80 text-xs text-amber-900 mb-6 flex items-start gap-2.5">
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

            {errorMsg && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 border border-emerald-200">
                {successMsg}
              </div>
            )}

            {activeTab === "login" ? (
              /* FORM LOGIN */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                    placeholder="Contoh: admin atau budi"
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
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  Masuk Sekarang
                </button>
              </form>
            ) : (
              /* FORM REGISTER */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    placeholder="Nama Lengkap Anda"
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
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, username: e.target.value })
                    }
                    placeholder="Username unik"
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
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
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, password: e.target.value })
                    }
                    placeholder="Minimal 5 karakter"
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  Daftar Akun Baru
                </button>
              </form>
            )}

            <div className="mt-6 text-center border-t border-zinc-100 pt-4">
              <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-900 transition">
                &larr; Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
