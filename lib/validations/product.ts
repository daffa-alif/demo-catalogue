import { z } from "zod";

export const productSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul produk wajib diisi"),
  description: z.string().min(1, "Deskripsi produk wajib diisi"),
  price: z.coerce.number().min(0, "Harga tidak boleh bernilai negatif"),
  category: z.string().min(1, "Kategori wajib dipilih atau diisi"),
  imageUrl: z.string().min(1, "Gambar produk wajib diisi"),
  isAvailable: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;
