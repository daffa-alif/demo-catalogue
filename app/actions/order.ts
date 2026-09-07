"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";

export type CreateOrderResponse = {
  success: boolean;
  message: string;
  order?: {
    id: string;
    orderNumber: string;
    licenseKey: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
  };
};

// 1. Buat Pesanan Baru saat Pembayaran Berhasil
export async function createOrder(data: {
  productId: string;
  totalAmount: number;
  paymentMethod?: string;
}): Promise<CreateOrderResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Silakan login terlebih dahulu untuk menyimpan lisensi aplikasi ke profil Anda.",
      };
    }

    // Pastikan produk ada di database
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      return {
        success: false,
        message: "Produk aplikasi tidak ditemukan.",
      };
    }

    // Buat nomor invoice unik & kunci lisensi
    const orderNumber = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomHex1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomHex2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const licenseKey = `LIC-${randomHex1}-${randomHex2}-2026-PRO`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        licenseKey,
        totalAmount: data.totalAmount || product.price,
        status: "PAID",
        paymentMethod: data.paymentMethod || "QRIS",
        userId: user.id,
        productId: product.id,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/admin");
    revalidatePath("/katalog");

    return {
      success: true,
      message: "Pembayaran QRIS berhasil! Lisensi aplikasi aktif seumur hidup.",
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        licenseKey: newOrder.licenseKey,
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
        createdAt: newOrder.createdAt,
      },
    };
  } catch (error: any) {
    console.error("Gagal membuat order:", error);
    return {
      success: false,
      message: error.message || "Gagal memproses transaksi pesanan.",
    };
  }
}

// 2. Ambil Riwayat Pembelian Pengguna yang Sedang Login
export async function getUserOrders() {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    return await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Gagal mengambil riwayat pesanan user:", error);
    return [];
  }
}

// 3. Ambil Metrik Aktivitas & Transaksi Penjualan untuk Admin
export async function getAdminActivityStats() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return null;

    const [totalOrders, revenueAggregate, totalUsers, totalProducts, recentOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: { totalAmount: true },
        }),
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.findMany({
          take: 8,
          include: {
            product: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

    return {
      totalOrders,
      totalRevenue: revenueAggregate._sum.totalAmount || 0,
      totalUsers,
      totalProducts,
      recentOrders,
    };
  } catch (error) {
    console.error("Gagal mengambil metrik admin:", error);
    return null;
  }
}
