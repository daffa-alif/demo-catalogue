"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function uploadProductImage(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  message?: string;
}> {
  try {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return { success: false, message: "File gambar tidak ditemukan." };
    }

    // Validasi ukuran (maksimal 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, message: "Ukuran file terlalu besar (maksimal 5MB)." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // 1. Jika Supabase Storage terkonfigurasi, upload ke Bucket 'products'
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.storage
        .from("products")
        .upload(safeName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        console.error("Supabase Storage Error:", error);
        return {
          success: false,
          message: `Gagal upload ke Supabase Storage: ${error.message}`,
        };
      }

      const { data } = supabase.storage.from("products").getPublicUrl(safeName);

      return {
        success: true,
        url: data.publicUrl,
      };
    }

    // 2. Fallback Lokal: Simpan di folder public/uploads jika Supabase belum di-setup
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, safeName);
    await writeFile(filePath, buffer);

    return {
      success: true,
      url: `/uploads/${safeName}`,
    };
  } catch (err: any) {
    console.error("Upload error:", err);
    return { success: false, message: err.message || "Terjadi kesalahan saat mengunggah file." };
  }
}
