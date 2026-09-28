import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/app/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {product.discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded bg-[#388E3C] px-1.5 py-0.5 text-[11px] font-bold text-white">
            {product.discountPercent}% OFF
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {product.brand}
        </span>
        <h3 className="line-clamp-2 text-sm font-medium text-[#212121]">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-0.5 rounded bg-[#388E3C] px-1.5 py-0.5 text-[11px] font-semibold text-white">
            {product.rating.toFixed(1)}
            <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09L5.4 11.545.522 6.91l6.6-.955L10 0l2.878 5.955 6.6.955-4.878 4.635 1.278 6.545z" />
            </svg>
          </span>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-[#212121]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
