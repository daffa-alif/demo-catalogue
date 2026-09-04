"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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

    // Batasi ukuran file (maksimal 4MB untuk serverless payload)
    if (file.size > 4 * 1024 * 1024) {
      return { success: false, message: "Ukuran file terlalu besar (maksimal 4MB)." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // 1. Jika Supabase Storage terkonfigurasi, coba upload ke Bucket 'products'
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.storage
          .from("products")
          .upload(safeName, buffer, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });

        if (!error) {
          const { data } = supabase.storage.from("products").getPublicUrl(safeName);
          return {
            success: true,
            url: data.publicUrl,
          };
        } else {
          console.warn("Supabase Storage fallback to Base64:", error.message);
        }
      } catch (sbErr) {
        console.warn("Supabase Storage error, using fallback:", sbErr);
      }
    }

    // 2. Fallback Universal (Base64 Data URI)
    // Berjalan aman di Vercel Serverless & lokal tanpa error read-only filesystem (ENOENT mkdir)
    const mimeType = file.type || "image/jpeg";
    const base64Data = buffer.toString("base64");
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    return {
      success: true,
      url: dataUri,
    };
  } catch (err: any) {
    console.error("Upload error:", err);
    return {
      success: false,
      message: err.message || "Terjadi kesalahan saat memproses gambar.",
    };
  }
}
