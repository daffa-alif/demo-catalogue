import Link from "next/link";
import { AppWindow, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-zinc-900 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <AppWindow className="h-4.5 w-4.5" />
              </div>
              <span className="font-extrabold text-lg text-zinc-900">
                Biz<span className="text-indigo-600">Apps</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-zinc-500 leading-relaxed max-w-xs">
              Platform aplikasi bisnis untuk POS kasir, pembukuan, inventori, dan HRIS —
              dengan lisensi seumur hidup dan dukungan teknis penuh.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-zinc-900">Solusi Produk</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-500">
              <li>
                <Link href="/katalog" className="hover:text-indigo-600 transition">
                  POS & Kasir Retail
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-indigo-600 transition">
                  POS & Kasir Resto / Cafe
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-indigo-600 transition">
                  Pembukuan & Akuntansi
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-indigo-600 transition">
                  Inventori & Gudang
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-indigo-600 transition">
                  HRIS & Presensi GPS
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-zinc-900">Navigasi Bisnis</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-500">
              <li>
                <Link href="/#enterprise" className="hover:text-indigo-600 transition">
                  Solusi Enterprise
                </Link>
              </li>
              <li>
                <Link href="/#demo" className="hover:text-indigo-600 transition">
                  Jadwalkan Demo Gratis
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-indigo-600 transition">
                  Profil & Lisensi
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-600 transition">
                  Portal Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-zinc-900">Hubungi Tim Sales</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-500">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                <span>sales@bizapps.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                <span>0812-3456-7890 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} BizApps. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-6 text-xs font-medium text-zinc-500">
            <span className="text-zinc-400">Lisensi Lifetime • No Monthly Fee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
