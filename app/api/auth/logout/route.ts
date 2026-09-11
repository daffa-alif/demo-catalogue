import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST() {
  const cookieStore = await cookies();

  // 1. Clear user_session
  cookieStore.set("user_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
    expires: new Date(0),
  });
  cookieStore.delete({
    name: "user_session",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  // 2. Clear any sb-* auth cookies
  try {
    const allCookies = cookieStore.getAll();
    for (const c of allCookies) {
      if (
        c.name.startsWith("sb-") ||
        c.name.includes("auth-token") ||
        c.name.includes("session")
      ) {
        cookieStore.set(c.name, "", {
          path: "/",
          maxAge: 0,
          expires: new Date(0),
        });
        cookieStore.delete({ name: c.name, path: "/" });
      }
    }
  } catch {}

  // 3. Clear Next.js layout & page cache
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/profile");
  revalidatePath("/katalog");

  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set("user_session", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cookieStore = await cookies();

  cookieStore.set("user_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
    expires: new Date(0),
  });
  cookieStore.delete({
    name: "user_session",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  try {
    const allCookies = cookieStore.getAll();
    for (const c of allCookies) {
      if (
        c.name.startsWith("sb-") ||
        c.name.includes("auth-token") ||
        c.name.includes("session")
      ) {
        cookieStore.set(c.name, "", {
          path: "/",
          maxAge: 0,
          expires: new Date(0),
        });
        cookieStore.delete({ name: c.name, path: "/" });
      }
    }
  } catch {}

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/profile");
  revalidatePath("/katalog");

  const redirectUrl = new URL("/", url.origin);
  redirectUrl.searchParams.set("logout", String(Date.now()));
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set("user_session", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}
