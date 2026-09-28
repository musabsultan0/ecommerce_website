"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchProductById, fetchProducts } from "@/app/lib/api";
import type { Product } from "@/app/types/product";
import { useCart } from "@/app/context/CartContext";
import Loading from "@/app/components/Loading";
import ErrorState from "@/app/components/ErrorState";
import ProductCard from "@/app/components/ProductCard";

type Status = "loading" | "error" | "success" | "not-found";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [related, setRelated] = useState<Product[]>([]);

  const load = useCallback(() => {
    setStatus("loading");
    setAdded(false);
    fetchProductById(params.id)
      .then((data) => {
        if (!data) {
          setStatus("not-found");
          return;
        }
        setProduct(data);
        setActiveImage(0);
        setQuantity(1);
        setSelectedSize(data.sizes && data.sizes.length > 0 ? data.sizes[0] : undefined);
        setStatus("success");

        if (data.relatedIds?.length) {
          fetchProducts()
            .then((all) => {
              const map = new Map(all.map((p) => [p.id, p]));
              setRelated(data.relatedIds.map((id) => map.get(id)).filter(Boolean) as Product[]);
            })
            .catch(() => setRelated([]));
        }
      })
      .catch(() => setStatus("error"));
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") return <Loading label="Loading product..." />;
  if (status === "error") return <ErrorState onRetry={load} />;
  if (status === "not-found" || !product) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-lg font-semibold text-[#212121]">Product not found</p>
        <p className="mt-1 text-sm text-gray-500">
          This product may have been removed or the link is incorrect.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-sm bg-[#2874F0] px-6 py-2 text-sm font-semibold text-white"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        color: product.color,
        size: selectedSize,
        stock: product.stock,
      },
      quantity
    );
    setAdded(true);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <nav className="mb-4 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#2874F0]">Home</Link>
        <span className="mx-1">/</span>
        <span>{product.category}</span>
        <span className="mx-1">/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Images */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 flex gap-3">
            <div className="hidden flex-col gap-2 sm:flex">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded border-2 ${
                    activeImage === i ? "border-[#2874F0]" : "border-gray-200"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
            <div className="relative aspect-square flex-1 overflow-hidden rounded-md border border-gray-200 bg-white">
              <Image
                src={product.images[activeImage] ?? product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-7">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {product.brand}
          </span>
          <h1 className="mt-1 text-xl font-semibold text-[#212121] sm:text-2xl">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded bg-[#388E3C] px-2 py-0.5 text-xs font-semibold text-white">
              {product.rating.toFixed(1)}
              <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09L5.4 11.545.522 6.91l6.6-.955L10 0l2.878 5.955 6.6.955-4.878 4.635 1.278 6.545z" />
              </svg>
            </span>
            <span className="text-sm text-gray-500">{product.reviewCount} ratings</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#212121]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-base text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-base font-semibold text-[#388E3C]">
                  {product.discountPercent}% off
                </span>
              </>
            )}
          </div>

          {/* Color — informational, since every product here is its own distinct item */}
          {product.color && (
            <div className="mt-6">
              <p className="mb-2 text-sm text-gray-600">
                Color: <span className="font-medium text-[#212121]">{product.color}</span>
              </p>
              <div
                className="h-9 w-9 rounded-full border-2 border-gray-200"
                style={{ backgroundColor: product.colorHex }}
              />
            </div>
          )}

          {/* Sizes — only for apparel/footwear templates */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm text-gray-600">Size:</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[3rem] rounded border px-3 py-1.5 text-sm font-medium transition ${
                      selectedSize === s
                        ? "border-[#2874F0] bg-[#2874F0]/5 text-[#2874F0]"
                        : "border-gray-300 text-gray-700 hover:border-gray-500"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <p className="mb-2 text-sm text-gray-600">Quantity:</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded border border-gray-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-lg text-gray-600 hover:bg-gray-50"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-lg text-gray-600 hover:bg-gray-50"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-400">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 rounded-sm bg-[#F9C616] px-6 py-3 text-sm font-bold text-[#1C1C1C] shadow transition hover:bg-[#f0bc0c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {added ? "Added ✓ — Add More" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 rounded-sm bg-[#FB641B] px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-[#e1590f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>
          {added && (
            <p className="mt-2 text-sm text-[#388E3C]">
              Added to cart. <Link href="/cart" className="font-semibold underline">View cart</Link>
            </p>
          )}

          {/* Description */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="mb-2 text-base font-semibold text-[#212121]">Description</h2>
            <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="mb-3 text-base font-semibold text-[#212121]">Specifications</h2>
              <dl className="divide-y divide-gray-100 text-sm">
                {product.specifications.map((s) => (
                  <div key={s.label} className="grid grid-cols-3 gap-4 py-2">
                    <dt className="text-gray-500">{s.label}</dt>
                    <dd className="col-span-2 text-[#212121]">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="mb-3 text-base font-semibold text-[#212121]">
              Ratings & Reviews
            </h2>
            <div className="space-y-4">
              {product.reviews.map((r) => (
                <div key={r.id} className="rounded border border-gray-100 p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded bg-[#388E3C] px-1.5 py-0.5 text-[11px] font-semibold text-white">
                      {r.rating}
                      <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09L5.4 11.545.522 6.91l6.6-.955L10 0l2.878 5.955 6.6.955-4.878 4.635 1.278 6.545z" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-[#212121]">{r.title}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{r.comment}</p>
                  <p className="mt-1 text-xs text-gray-400">{r.author} · {r.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="mb-4 text-lg font-bold text-[#212121]">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
