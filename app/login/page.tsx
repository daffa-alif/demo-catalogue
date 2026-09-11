"use client";

import { useState, useEffect, Suspense } from "react";
import { loginUser, registerUser } from "@/app/actions/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppWindow, ShieldCheck, UserPlus, LogIn, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const redirect = searchParams.get("redirect");
    const error = searchParams.get("error");
    const reason = searchParams.get("reason");

    if (redirect) {
      setRedirectUrl(redirect);
    }
    if (error === "oauth_failed") {
      if (reason) {
        setErrorMsg(
          `Autentikasi Google gagal atau dibatalkan (${decodeURIComponent(reason)}). Silakan login atau daftar akun resmi di bawah ini.`
        );
      } else {
        setErrorMsg(
          "Autentikasi Google belum dapat diselesaikan. Anda dapat langsung masuk atau mendaftar menggunakan formulir akun di bawah ini."
        );
      }
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg("");
    try {
      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : "https://demo-catalogue-eta.vercel.app";

      const callbackUrl = new URL("/auth/callback", origin);
      if (redirectUrl) {
        callbackUrl.searchParams.set("next", redirectUrl);
      }

      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghubungkan dengan Google.");
      setGoogleLoading(false);
    }
  };

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
          if (redirectUrl) {
            router.push(redirectUrl);
          } else if (res.user?.role === "ADMIN") {
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
        setSuccessMsg("Akun pembeli resmi berhasil didaftarkan! Mengalihkan...");
        setTimeout(() => {
          if (redirectUrl) {
            router.push(redirectUrl);
          } else {
            router.push("/katalog");
          }
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
              Portal Autentikasi Pelanggan & Verifikasi Lisensi
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 pt-4">
            {/* Buyer Purpose Banner */}
            <div className="mb-5 rounded-2xl bg-indigo-50/80 border border-indigo-100 p-3.5 text-xs text-indigo-950">
              <div className="font-bold flex items-center gap-1.5 text-indigo-900 mb-1">
                <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                Tujuan Verifikasi Akun Pembeli
              </div>
              <p className="text-[11.5px] text-indigo-800 leading-relaxed">
                Akun Anda digunakan untuk memverifikasi keabsahan transaksi, menerbitkan kunci
                lisensi resmi seumur hidup, dan mengakses master file aplikasi kapan pun di profil
                Anda.
              </p>
            </div>

            {/* Tombol Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
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
              <span>Lanjutkan dengan Google</span>
            </button>

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
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "login"
                    ? "border-indigo-600 text-indigo-600"
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
                className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "register"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <UserPlus className="h-4 w-4" /> Daftar Akun Baru
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMsg}</div>
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
                    Email atau Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                    placeholder="email@anda.com atau username"
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-indigo-600 focus:outline-none"
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
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
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
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-indigo-600 focus:outline-none"
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
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase">
                    Email Pembeli (Untuk Sertifikat Lisensi)
                  </label>
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                    placeholder="email@anda.com"
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-indigo-600 focus:outline-none"
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
                    className="mt-1 w-full rounded-xl border border-zinc-300 p-3 text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  Daftar Akun Baru & Klaim Lisensi
                </button>
                <p className="text-center text-[11px] text-zinc-400 mt-1">
                  *Pendaftaran gratis. Akun otomatis aktif untuk verifikasi seluruh transaksi software.
                </p>
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}

