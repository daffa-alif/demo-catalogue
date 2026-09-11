"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type SessionUser = {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: "ADMIN" | "USER";
};

export type AuthResponse = {
  success: boolean;
  message: string;
  user?: SessionUser;
};

// Ambil sesi user saat ini dari cookie
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session")?.value;
    if (
      !sessionCookie ||
      !sessionCookie.trim() ||
      sessionCookie === "undefined" ||
      sessionCookie === "null" ||
      sessionCookie === '""'
    ) {
      return null;
    }

    const parsed = JSON.parse(sessionCookie) as SessionUser;
    if (!parsed || !parsed.id) return null;

    return parsed;
  } catch {
    return null;
  }
}

// 1. Login User (Username atau Email & Password)
export async function loginUser(formData: {
  username: string;
  password: string;
}): Promise<AuthResponse> {
  const identifier = formData.username.trim();
  const password = formData.password;

  if (!identifier || !password) {
    return { success: false, message: "Email/Username dan password wajib diisi." };
  }

  // Login Pengguna melalui Database: Mendukung pencarian via username ATAU email
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: identifier, mode: "insensitive" } },
          { email: { equals: identifier, mode: "insensitive" } },
        ],
      },
    });

    if (!user || !user.password || user.password !== password) {
      return {
        success: false,
        message: "Email/Username atau password salah. Silakan coba lagi.",
      };
    }

    // Email venlisiaputri21@gmail.com selalu SUPER ADMIN
    const isAdmin =
      user.role === "ADMIN" ||
      user.email?.toLowerCase().trim() === "venlisiaputri21@gmail.com";
    const role: "ADMIN" | "USER" = isAdmin ? "ADMIN" : "USER";

    const sessionUser: SessionUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email || undefined,
      role: role,
    };

    const cookieStore = await cookies();
    cookieStore.set("user_session", JSON.stringify(sessionUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/profile");
    revalidatePath("/katalog");
    return {
      success: true,
      message: `Login berhasil! Selamat datang, ${user.name}`,
      user: sessionUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Terjadi kendala pada server saat login.",
    };
  }
}

// 2. Registrasi Pengguna Baru (Role otomatis "USER")
export async function registerUser(formData: {
  username: string;
  name: string;
  email?: string;
  password: string;
}): Promise<AuthResponse> {
  const username = formData.username.trim().toLowerCase();
  const name = formData.name.trim();
  const password = formData.password;
  const email = formData.email?.trim();

  if (!username || !name || !password) {
    return { success: false, message: "Semua kolom bertanda wajib harus diisi." };
  }

  if (username === "admin") {
    return {
      success: false,
      message: "Username 'admin' telah dicadangkan untuk Administrator.",
    };
  }

  if (username.length < 3) {
    return { success: false, message: "Username minimal 3 karakter." };
  }

  if (password.length < 5) {
    return { success: false, message: "Password minimal 5 karakter." };
  }

  try {
    const existing = await prisma.user.findFirst({
      where: {
        username: { equals: username, mode: "insensitive" },
      },
    });

    if (existing) {
      return {
        success: false,
        message: "Username sudah digunakan. Silakan pilih username lain.",
      };
    }

    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: { equals: email, mode: "insensitive" },
        },
      });

      if (existingEmail) {
        return {
          success: false,
          message: "Email ini sudah terdaftar. Silakan login langsung menggunakan email Anda.",
        };
      }
    }

    const isAdmin = email?.toLowerCase().trim() === "venlisiaputri21@gmail.com";
    const role: "ADMIN" | "USER" = isAdmin ? "ADMIN" : "USER";

    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        email: email || null,
        password,
        role: role,
      },
    });

    const sessionUser: SessionUser = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email || undefined,
      role: role,
    };

    // Auto login setelah registrasi
    const cookieStore = await cookies();
    cookieStore.set("user_session", JSON.stringify(sessionUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/profile");
    revalidatePath("/katalog");
    return {
      success: true,
      message: "Akun pembeli resmi berhasil didaftarkan!",
      user: sessionUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal mendaftarkan akun baru.",
    };
  }
}

// 3. Logout User
export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();

    // 1. Bersihkan cookie user_session dengan atribut yang sama persis
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

    // 2. Hapus semua cookie auth Supabase jika ada (sb-*)
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
          cookieStore.delete({
            name: c.name,
            path: "/",
          });
        }
      }
    } catch {
      // Ignore
    }

    // 3. Bersihkan seluruh router cache Next.js dari layout root
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/profile");
    revalidatePath("/katalog");

    return { success: true };
  } catch (error) {
    console.error("Gagal logout:", error);
    return { success: false };
  }
}

export type UserProfile = {
  id: string;
  username: string;
  name: string;
  email: string | null;
  role: "ADMIN" | "USER";
  createdAt: Date;
  accountAgeText: string;
  joinedDateText: string;
};

// 4. Ambil Profil Pengguna Lengkap dengan Masa Aktif Akun
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const session = await getCurrentUser();
    if (!session) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) return null;

    // Hitung lama akun aktif
    const now = new Date();
    const created = new Date(user.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    let accountAgeText = "";
    if (diffDays >= 365) {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      accountAgeText = `${years} tahun ${remainingMonths > 0 ? remainingMonths + " bulan" : ""}`.trim();
    } else if (diffDays >= 30) {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      accountAgeText = `${months} bulan ${remainingDays > 0 ? remainingDays + " hari" : ""}`.trim();
    } else if (diffDays >= 7) {
      const weeks = Math.floor(diffDays / 7);
      accountAgeText = `${weeks} minggu`;
    } else if (diffDays >= 1) {
      accountAgeText = `${diffDays} hari`;
    } else if (diffHours >= 1) {
      accountAgeText = `${diffHours} jam`;
    } else {
      accountAgeText = "Baru saja bergabung (Hari ini)";
    }

    const joinedDateText = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(created);

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: (user.role as "ADMIN" | "USER") || "USER",
      createdAt: user.createdAt,
      accountAgeText,
      joinedDateText,
    };
  } catch (error) {
    console.error("Gagal mengambil profil user:", error);
    return null;
  }
}

