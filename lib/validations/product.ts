import { z } from "zod";

export const productSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Judul produk minimal 3 karakter"),
  description: z.string().min(8, "Deskripsi minimal 8 karakter"),
  price: z.coerce.number().positive("Harga harus bernilai positif"),
  category: z.string().min(2, "Kategori harus dipilih atau diisi"),
  imageUrl: z
    .string()
    .min(1, "Gambar produk wajib diisi")
    .refine(
      (val) =>
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("/") ||
        val.startsWith("data:image/"),
      {
        message: "Format URL gambar atau berkas unggahan tidak valid",
      }
    ),
  isAvailable: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;
