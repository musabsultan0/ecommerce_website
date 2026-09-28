
"use client";

import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { useSearchParams } from "next/navigation";

import { fetchProducts } from "@/app/lib/api";
import type { Product } from "@/app/types/product";
import Hero from "@/app/components/Hero";
import ProductCard from "@/app/components/ProductCard";
import Loading from "@/app/components/Loading";
import ErrorState from "@/app/components/ErrorState";
import EmptyState from "@/app/components/EmptyState";

type Status = "loading" | "error" | "success";

// Only these three filters are shown on the home page.
const CATEGORIES = ["All", "Electronics", "Fashion"];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [category, setCategory] = useState("All");

  // Read search text entered in the Navbar
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const load = useCallback(() => {
    setStatus("loading");

    fetchProducts()
      .then((data) => {
        setProducts(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Filter products by category and starting characters
  const visible = useMemo(() => {
    let filteredProducts = products;

    // Existing category filter
    if (category !== "All") {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === category
      );
    }

    // New search filter: match beginning of product name
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      filteredProducts = filteredProducts.filter((p) =>
        p.name.toLowerCase().startsWith(query)
      );
    }

    return filteredProducts;
  }, [products, category, searchQuery]);

  return (
    <>
      <Hero />

      <section
        id="products"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                category === c
                  ? "border-[#2874F0] bg-[#2874F0] text-white"
                  : "border-gray-300 bg-white text-gray-600 hover:border-[#2874F0] hover:text-[#2874F0]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <h2 className="mb-4 text-lg font-bold text-[#212121]">
          {searchQuery.trim()
            ? `Search results for "${searchQuery}"`
            : category === "All"
            ? "All Products"
            : category}

          <span className="ml-2 text-sm font-normal text-gray-400">
            ({visible.length} items)
          </span>
        </h2>

        {status === "loading" && <Loading />}

        {status === "error" && (
          <ErrorState onRetry={load} />
        )}

        {status === "success" && visible.length === 0 && (
          <EmptyState
            title={
              searchQuery.trim()
                ? "No matching products found"
                : "No products in this category"
            }
            message={
              searchQuery.trim()
                ? "Try searching with the starting characters of another product name."
                : "Try a different category."
            }
          />
        )}

        {status === "success" && visible.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}