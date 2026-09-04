"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type SessionUser = {
  id: string;
  username: string;
  name: string;
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

// 1. Login User (Dengan kondisi khusus Superadmin: admin / admin123)
export async function loginUser(formData: {
  username: string;
  password: string;
}): Promise<AuthResponse> {
  const username = formData.username.trim().toLowerCase();
  const password = formData.password;

  if (!username || !password) {
    return { success: false, message: "Username dan password wajib diisi." };
  }

  // Kondisi Khusus Admin
  if (username === "admin" && password === "admin123") {
    try {
      // Pastikan admin ada di database
      let admin = await prisma.user.findUnique({ where: { username: "admin" } });
      if (!admin) {
        admin = await prisma.user.create({
          data: {
            username: "admin",
            name: "Administrator Utama",
            password: "admin123",
            role: "ADMIN",
          },
        });
      }

      const sessionUser: SessionUser = {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: "ADMIN",
      };

      const cookieStore = await cookies();
      cookieStore.set("user_session", JSON.stringify(sessionUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 hari
        path: "/",
      });

      revalidatePath("/");
      revalidatePath("/admin");
      return {
        success: true,
        message: "Selamat datang kembali, Administrator!",
        user: sessionUser,
      };
    } catch (dbError: any) {
      console.error("Admin DB login error (fallback active):", dbError);
      // Fallback superadmin jika database sedang proses inisialisasi / env var belum lengkap di Vercel
      const fallbackUser: SessionUser = {
        id: "admin-root",
        username: "admin",
        name: "Administrator Utama",
        role: "ADMIN",
      };

      try {
        const cookieStore = await cookies();
        cookieStore.set("user_session", JSON.stringify(fallbackUser), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        revalidatePath("/");
        revalidatePath("/admin");
        return {
          success: true,
          message: "Selamat datang kembali, Administrator!",
          user: fallbackUser,
        };
      } catch (cookieErr: any) {
        return {
          success: false,
          message: "Gagal membuat sesi login: " + (cookieErr.message || "Unknown error"),
        };
      }
    }
  }

  // Login Pengguna Biasa
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return {
        success: false,
        message: "Username atau password salah. Coba lagi.",
      };
    }

    const sessionUser: SessionUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: (user.role as "ADMIN" | "USER") || "USER",
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

    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        email: email || null,
        password,
        role: "USER",
      },
    });

    const sessionUser: SessionUser = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      role: "USER",
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
  return { success: true };
}
