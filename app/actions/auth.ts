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
    if (!sessionCookie) return null;

    return JSON.parse(sessionCookie) as SessionUser;
  } catch {
    return null;
  }
}

// 1. Login User (Username & Password)
export async function loginUser(formData: {
  username: string;
  password: string;
}): Promise<AuthResponse> {
  const username = formData.username.trim().toLowerCase();
  const password = formData.password;

  if (!username || !password) {
    return { success: false, message: "Username dan password wajib diisi." };
  }

  // Login Pengguna melalui Database
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !user.password || user.password !== password) {
      return {
        success: false,
        message: "Username atau password salah. Coba lagi.",
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
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return {
        success: false,
        message: "Username sudah digunakan. Silakan pilih username lain.",
      };
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
    return {
      success: true,
      message: "Akun berhasil didaftarkan!",
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
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/profile");
  return { success: true };
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

