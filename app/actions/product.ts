"use server";

import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
};

// 1. Ambil semua produk (dengan filter opsional)
export async function getProducts(options?: {
  search?: string;
  category?: string;
  onlyAvailable?: boolean;
}) {
  try {
    const where: any = {};

    if (options?.onlyAvailable) {
      where.isAvailable = true;
    }

    if (options?.category && options.category !== "Semua") {
      where.category = options.category;
    }

    if (options?.search) {
      where.OR = [
        { title: { contains: options.search } },
        { description: { contains: options.search } },
      ];
    }

    return await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// 2. Ambil detail produk berdasarkan slug
export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return null;
  }
}

// 3. Create / Tambah Produk Baru
export async function createProduct(formData: unknown): Promise<ActionResponse> {
  const validated = productSchema.safeParse(formData);

  if (!validated.success) {
    const errorDetails = Object.values(validated.error.flatten().fieldErrors)
      .flat()
      .join(". ");
    return {
      success: false,
      message: errorDetails || "Validasi form gagal. Mohon periksa isian form Anda.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { title, description, price, category, imageUrl, isAvailable } = validated.data;
  const baseSlug = slugify(title);
  let finalSlug = baseSlug;
  let count = 1;

  // Cek duplikasi slug
  while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${baseSlug}-${count}`;
    count++;
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        title,
        slug: finalSlug,
        description,
        price,
        category,
        imageUrl,
        isAvailable,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Produk berhasil ditambahkan",
      data: newProduct,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menyimpan produk ke database",
    };
  }
}

// 4. Update / Edit Produk
export async function updateProduct(id: string, formData: unknown): Promise<ActionResponse> {
  const validated = productSchema.safeParse(formData);

  if (!validated.success) {
    const errorDetails = Object.values(validated.error.flatten().fieldErrors)
      .flat()
      .join(". ");
    return {
      success: false,
      message: errorDetails || "Validasi form gagal",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { title, description, price, category, imageUrl, isAvailable } = validated.data;

  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: "Produk tidak ditemukan" };
    }

    let finalSlug = existing.slug;
    if (existing.title !== title) {
      const baseSlug = slugify(title);
      finalSlug = baseSlug;
      let count = 1;
      while (
        await prisma.product.findFirst({
          where: { slug: finalSlug, NOT: { id } },
        })
      ) {
        finalSlug = `${baseSlug}-${count}`;
        count++;
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title,
        slug: finalSlug,
        description,
        price,
        category,
        imageUrl,
        isAvailable,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/product/${finalSlug}`);

    return {
      success: true,
      message: "Produk berhasil diperbarui",
      data: updated,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal mengupdate produk",
    };
  }
}

// 5. Delete / Hapus Produk
export async function deleteProduct(id: string): Promise<ActionResponse> {
  try {
    const deleted = await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/product/${deleted.slug}`);

    return { success: true, message: "Produk berhasil dihapus" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menghapus produk",
    };
  }
}

// 6. Toggle Ketersediaan (Cepat dari Admin Table)
export async function toggleProductAvailability(id: string, currentStatus: boolean): Promise<ActionResponse> {
  try {
    await prisma.product.update({
      where: { id },
      data: { isAvailable: !currentStatus },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Status ketersediaan diubah" };
  } catch (error: any) {
    return { success: false, message: "Gagal mengubah status produk" };
  }
}
