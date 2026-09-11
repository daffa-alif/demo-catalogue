import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const VERCEL_CANONICAL_ORIGIN = "https://demo-catalogue-eta.vercel.app";

function getCleanOrigin(request: Request): string {
  try {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

    if (forwardedHost) {
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

  if (process.env.NODE_ENV === "production" || process.env.VERCEL_URL) {
    return VERCEL_CANONICAL_ORIGIN;
  }

  return "http://localhost:3000";
}

function clearAllAuthCookies(cookieStore: any, response: NextResponse) {
  const isProd = process.env.NODE_ENV === "production";

  // 1. Bersihkan cookie user_session
  response.cookies.set("user_session", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
  });

  try {
    cookieStore.set("user_session", "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
    });
  } catch {}

  // 2. Bersihkan seluruh cookie auth Supabase & sesi lainnya (sb-*)
  try {
    const allCookies = cookieStore.getAll();
    for (const c of allCookies) {
      if (
        c.name.startsWith("sb-") ||
        c.name.includes("auth-token") ||
        c.name.includes("session") ||
        c.name.includes("user")
      ) {
        response.cookies.set(c.name, "", {
          path: "/",
          maxAge: 0,
          expires: new Date(0),
          secure: isProd,
          sameSite: "lax",
        });
        try {
          cookieStore.set(c.name, "", {
            path: "/",
            maxAge: 0,
            expires: new Date(0),
            secure: isProd,
            sameSite: "lax",
          });
        } catch {}
      }
    }
  } catch {}

  // 3. Pasang header Clear-Site-Data agar browser memusnahkan cookie & storage client
  response.headers.set("Clear-Site-Data", '"cookies", "storage"');
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
}

export async function POST(request: Request) {
  const cookieStore = await cookies();

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/profile");
  revalidatePath("/katalog");
  revalidatePath("/login");

  const response = NextResponse.json({ success: true, message: "Logged out" });
  clearAllAuthCookies(cookieStore, response);

  return response;
}

export async function GET(request: Request) {
  const origin = getCleanOrigin(request);
  const cookieStore = await cookies();

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/profile");
  revalidatePath("/katalog");
  revalidatePath("/login");

  // Arahkan ke halaman login dengan parameter logout=success agar user siap ganti akun
  let redirectUrl: URL;
  try {
    redirectUrl = new URL("/login?logout=success", origin);
  } catch {
    redirectUrl = new URL("/login?logout=success", VERCEL_CANONICAL_ORIGIN);
  }

  const response = NextResponse.redirect(redirectUrl);
  clearAllAuthCookies(cookieStore, response);

  return response;
}
