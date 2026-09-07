import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/app/actions/auth";
import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore if called from a Server Component context
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const authUser = data.user;
      const email = (authUser.email || "").toLowerCase().trim();
      const fullName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        (email ? email.split("@")[0] : "Pengguna");

      // Super Admin Rule: email venlisiaputri21@gmail.com = ADMIN, yang lain = USER
      const isAdmin = email === "venlisiaputri21@gmail.com";
      const role: "ADMIN" | "USER" = isAdmin ? "ADMIN" : "USER";

      // Cari user yang sudah ada berdasarkan email atau username
      let dbUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { username: email }],
        },
      });

      if (!dbUser) {
        // Buat user baru di database Prisma
        dbUser = await prisma.user.create({
          data: {
            username: email || `user_${Date.now()}`,
            name: fullName,
            email: email || null,
            password: "", // User OAuth tidak memerlukan password lokal
            role: role,
          },
        });
      } else {
        // Update role dan data profil jika ada perubahan
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            role: role,
            name: fullName || dbUser.name,
            email: email || dbUser.email,
          },
        });
      }

      // Siapkan session cookie user_session
      const sessionUser: SessionUser = {
        id: dbUser.id,
        username: dbUser.username,
        name: dbUser.name,
        email: dbUser.email || email,
        role: role,
      };

      cookieStore.set("user_session", JSON.stringify(sessionUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 hari
        path: "/",
      });

      // Arahkan ke dashboard admin jika role ADMIN, atau ke katalog jika USER
      if (role === "ADMIN") {
        return NextResponse.redirect(`${origin}/admin`);
      }
      return NextResponse.redirect(`${origin}/katalog`);
    } else {
      console.error("Supabase OAuth exchange error:", error);
    }
  }

  // Jika otentikasi gagal atau tidak ada kode
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
