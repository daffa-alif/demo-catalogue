import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/app/actions/auth";
import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY } from "@/lib/supabase";

const VERCEL_CANONICAL_ORIGIN = "https://demo-catalogue-eta.vercel.app";

// Ekstraksi origin yang aman dari header request Vercel/Proxy tanpa crash
function getCleanOrigin(request: Request): string {
  try {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

    if (forwardedHost) {
      // Hilangkan port atau proxy berantai (dipisahkan koma)
      const cleanHost = forwardedHost.split(",")[0].trim();
      if (cleanHost && !cleanHost.includes("localhost")) {
        return `${forwardedProto}://${cleanHost}`;
      }
    }
  } catch {}

  try {
    const parsed = new URL(request.url);
    if (parsed.origin && !parsed.origin.includes("localhost")) {
      return parsed.origin;
    }
  } catch {}

  // Fallback environment
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_URL) {
    return VERCEL_CANONICAL_ORIGIN;
  }

  return "http://localhost:3000";
}

// Helper redirect aman yang tidak pernah melempar TypeError: Invalid URL
function safeRedirect(origin: string, targetPath: string): NextResponse {
  let targetUrl: URL;
  try {
    targetUrl = new URL(targetPath, origin);
  } catch {
    try {
      targetUrl = new URL(targetPath, VERCEL_CANONICAL_ORIGIN);
    } catch {
      targetUrl = new URL("/login", VERCEL_CANONICAL_ORIGIN);
    }
  }
  return NextResponse.redirect(targetUrl);
}

export async function GET(request: Request) {
  let origin = VERCEL_CANONICAL_ORIGIN;

  try {
    origin = getCleanOrigin(request);
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const errorParam = requestUrl.searchParams.get("error");
    const errorDescription = requestUrl.searchParams.get("error_description");
    const nextParam = requestUrl.searchParams.get("next");

    // Tangani jika provider OAuth mengirim error langsung di query param
    if (errorParam) {
      console.warn("OAuth provider callback error:", errorParam, errorDescription);
      const reason = encodeURIComponent(errorDescription || errorParam);
      return safeRedirect(origin, `/login?error=oauth_failed&reason=${reason}`);
    }

    // Jika tidak ada kode otentikasi
    if (!code) {
      return safeRedirect(origin, "/login");
    }

    const cookieStore = await cookies();
    const pendingCookies: Array<{ name: string; value: string; options?: any }> = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              pendingCookies.push({ name, value, options });
              try {
                cookieStore.set(name, value, options);
              } catch {
                // Ignore jika dipanggil di konteks terbatas
              }
            });
          },
        },
      }
    );

    // Tukar code dengan session auth Supabase
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      console.error("Supabase OAuth exchange failed:", error?.message);
      const reason = encodeURIComponent(error?.message || "exchange_failed");
      return safeRedirect(origin, `/login?error=oauth_failed&reason=${reason}`);
    }

    const authUser = data.user;
    const email = (authUser.email || "").toLowerCase().trim();
    const fullName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      (email ? email.split("@")[0] : "Pengguna");

    // Super Admin Rule: email venlisiaputri21@gmail.com = ADMIN, yang lain = USER
    const isAdmin = email === "venlisiaputri21@gmail.com";
    const role: "ADMIN" | "USER" = isAdmin ? "ADMIN" : "USER";

    let finalUserId = authUser.id;
    let finalUsername = email ? email.split("@")[0] : `user_${Date.now()}`;
    let finalName = fullName;

    // Sinkronisasi dengan database Prisma (terisolasi dalam try-catch agar DB cold start/timeout tidak menyebabkan 500)
    try {
      let dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: email, mode: "insensitive" } },
            { username: { equals: email, mode: "insensitive" } },
            { username: { equals: finalUsername, mode: "insensitive" } },
          ],
        },
      });

      if (!dbUser) {
        // Cari username unik jika username default sudah terpakai
        let chosenUsername = finalUsername;
        const existingWithUsername = await prisma.user.findUnique({
          where: { username: chosenUsername },
        });
        if (existingWithUsername) {
          chosenUsername = `${chosenUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
        }

        dbUser = await prisma.user.create({
          data: {
            username: chosenUsername,
            name: fullName,
            email: email || null,
            password: "", // User OAuth tidak memerlukan password lokal
            role: role,
          },
        });
      } else {
        // Update data jika ada perubahan role atau nama
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            role: role,
            name: fullName || dbUser.name,
            email: email || dbUser.email,
          },
        });
      }

      finalUserId = dbUser.id;
      finalUsername = dbUser.username;
      finalName = dbUser.name;
    } catch (dbError) {
      console.warn("Prisma user sync warning (fallback used):", dbError);
    }

    // Siapkan session data user
    const sessionUser: SessionUser = {
      id: finalUserId,
      username: finalUsername,
      name: finalName,
      email: email || undefined,
      role: role,
    };

    // Tentukan path tujuan
    let targetPath = nextParam || (role === "ADMIN" ? "/admin" : "/katalog");
    if (!targetPath.startsWith("/")) {
      targetPath = `/${targetPath}`;
    }

    const response = safeRedirect(origin, targetPath);

    // Set cookie user_session langsung pada HttpResponse redirect
    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set("user_session", JSON.stringify(sessionUser), {
      httpOnly: true,
      secure: isProd,
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: "/",
      sameSite: "lax",
    });

    // Tempelkan seluruh cookie Supabase auth ke HttpResponse redirect
    for (const c of pendingCookies) {
      try {
        response.cookies.set(c.name, c.value, {
          ...c.options,
          path: c.options?.path || "/",
          sameSite: c.options?.sameSite || "lax",
          secure: isProd,
        });
      } catch {}
    }

    return response;
  } catch (fatalError: any) {
    // Tangani seluruh uncaught exception agar browser tidak pernah menerima HTTP 500
    console.error("Fatal uncaught error in /auth/callback:", fatalError);
    const reason = encodeURIComponent(fatalError?.message || "server_error");
    return safeRedirect(origin, `/login?error=oauth_failed&reason=${reason}`);
  }
}
