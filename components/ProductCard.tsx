import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@prisma/client";
import { ArrowRight, Tag } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-zinc-800 shadow-sm backdrop-blur">
            <Tag className="h-3 w-3 text-zinc-500" />
            {product.category}
          </span>
        </div>
        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs">
            <span className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              Habis / Terjual
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-zinc-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-100">
          <div>
            <span className="text-xs text-zinc-400 block font-medium">Harga</span>
            <span className="text-lg font-bold text-zinc-900">
              {formatRupiah(product.price)}
            </span>
          </div>
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 transition-colors"
          >
            Detail
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
