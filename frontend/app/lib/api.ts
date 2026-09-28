import type { Product } from "@/app/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ApiError extends Error {}

export async function fetchProducts(category?: string): Promise<Product[]> {
  const url = category && category !== "All"
    ? `${API_URL}/api/products?category=${encodeURIComponent(category)}`
    : `${API_URL}/api/products`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new ApiError(`Failed to load products (status ${res.status})`);
  }
  return res.json();
}

export async function fetchProductById(id: string | number): Promise<Product | null> {
  const res = await fetch(`${API_URL}/api/products/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ApiError(`Failed to load product (status ${res.status})`);
  }
  return res.json();
}
