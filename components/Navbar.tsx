"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentUser, logoutUser, SessionUser } from "@/app/actions/auth";
import { AppWindow, ShieldCheck, LogOut, User as UserIcon, LayoutGrid, Home } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);

  const fetchSession = async () => {
    const session = await getCurrentUser();
    setUser(session);
  };

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-zinc-900 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <AppWindow className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg leading-tight tracking-tight text-zinc-900">
              Biz<span className="text-indigo-600">Apps</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">
              Katalog Aplikasi & POS Kasir
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 p-1 rounded-xl border border-zinc-200/80">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              pathname === "/"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            Beranda
          </Link>
          <Link
            href="/katalog"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              pathname.startsWith("/katalog")
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Katalog Aplikasi
          </Link>
        </nav>

        {/* Right Nav / Auth Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-zinc-900">{user.name}</span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Dashboard Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                title="Keluar"
                className="rounded-xl border border-zinc-200 p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs transition"
              >
                <UserIcon className="h-3.5 w-3.5 text-zinc-500" />
                Masuk / Daftar
              </Link>
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shadow-xs transition"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Admin
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
