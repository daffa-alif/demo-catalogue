"use client";

import { useState, useEffect } from "react";
import type { Product } from "@prisma/client";
import { createProduct, updateProduct } from "@/app/actions/product";
import { ProductFormValues } from "@/lib/validations/product";
import { X, Loader2 } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export default function AdminProductDialog({ isOpen, onClose, productToEdit }: DialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState<ProductFormValues>({
    title: "",
    category: "POS & Kasir Retail",
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&auto=format&fit=crop&q=80",
    description: "",
    isAvailable: true,
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title,
        category: productToEdit.category,
        price: productToEdit.price,
        imageUrl: productToEdit.imageUrl,
        description: productToEdit.description,
        isAvailable: productToEdit.isAvailable,
      });
    } else {
      setFormData({
        title: "",
        category: "POS & Kasir Retail",
        price: 0,
        imageUrl: "https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&auto=format&fit=crop&q=80",
        description: "",
        isAvailable: true,
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = productToEdit
        ? await updateProduct(productToEdit.id, formData)
        : await createProduct(formData);

      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || "Terjadi kesalahan saat menyimpan produk");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghubungi server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-zinc-200 sm:p-8">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <h2 className="text-xl font-bold text-zinc-900">
            {productToEdit ? "Edit Data Produk" : "Tambah Produk Baru"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase">
              Nama Produk
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 w-full rounded-xl border border-zinc-300 p-2.5 text-sm focus:border-zinc-900 focus:outline-none"
              placeholder="Contoh: Jam Tangan Analog Pria"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase">
                Kategori Software / Aplikasi
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-zinc-300 p-2.5 text-sm focus:border-zinc-900 focus:outline-none bg-white"
              >
                <option value="POS & Kasir Retail">POS & Kasir Retail</option>
                <option value="POS & Kasir Resto / Cafe">POS & Kasir Resto / Cafe</option>
                <option value="Pencatatan Penjualan & Akuntansi">Pencatatan Penjualan & Akuntansi</option>
                <option value="Manajemen Inventori & Gudang">Manajemen Inventori & Gudang</option>
                <option value="HRIS & Presensi Karyawan">HRIS & Presensi Karyawan</option>
                <option value="CRM & Otomasi Bisnis">CRM & Otomasi Bisnis</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase">
                Harga (IDR)
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-zinc-300 p-2.5 text-sm focus:border-zinc-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase">
              URL Gambar Produk
            </label>
            <input
              type="text"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="mt-1 w-full rounded-xl border border-zinc-300 p-2.5 text-sm focus:border-zinc-900 focus:outline-none"
              placeholder="https://... atau /uploads/gambar.jpg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase">
              Deskripsi Produk
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-zinc-300 p-2.5 text-sm focus:border-zinc-900 focus:outline-none"
              placeholder="Tuliskan spesifikasi dan fitur unggulan..."
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
            />
            <label htmlFor="isAvailable" className="text-sm font-medium text-zinc-700">
              Tandai sebagai stok tersedia (Ready Stock)
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {productToEdit ? "Simpan Perubahan" : "Buat Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
