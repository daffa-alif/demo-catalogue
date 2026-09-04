"use client";

import { useState, useMemo } from "react";
import type { Product } from "@prisma/client";
import ProductCard from "@/components/ProductCard";
import { Search, Sparkles } from "lucide-react";

export default function CatalogSection({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchSearch =
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "Semua" || product.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [initialProducts, search, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-zinc-50 p-4 border border-zinc-200">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari nama barang atau deskripsi produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["Semua", ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Katalog */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h4 className="text-base font-semibold text-zinc-800">Tidak ada produk ditemukan</h4>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm">
            Coba ganti kata kunci pencarian atau ubah kategori pilihan Anda.
          </p>
        </div>
      )}
    </div>
  );
}
