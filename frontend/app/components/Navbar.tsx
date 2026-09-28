
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const { itemCount } = useCart();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");

  // Keep the search input synchronized with the URL
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Handle search submission
  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = search.trim();

    if (value) {
      router.push(
        `/?search=${encodeURIComponent(value)}#products`
      );
    } else {
      router.push("/#products");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-[#2874F0] shadow-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:gap-8 sm:px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex flex-col leading-none shrink-0"
        >
          <span className="text-xl font-bold italic text-white sm:text-2xl">
            ShopEase
          </span>

          <span className="hidden text-[11px] font-medium italic text-[#F9C616] sm:block">
            Everyday Essentials
          </span>
        </Link>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearch}
          className="relative hidden flex-1 sm:block"
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full rounded-sm bg-white px-4 py-2 pr-12 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-300"
            aria-label="Search products"
          />

          <button
            type="submit"
            aria-label="Search"
            className="absolute right-0 top-0 flex h-full items-center justify-center px-4 text-[#2874F0] hover:bg-blue-50"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.607 0 7.5 7.5 0 0010.607 0z"
              />
            </svg>
          </button>
        </form>

        {/* Cart */}
        <Link
          href="/cart"
          className="ml-auto flex items-center gap-2 rounded-sm bg-white px-4 py-2 text-sm font-semibold text-[#2874F0] shadow-sm transition hover:bg-gray-50 shrink-0"
        >
          <span className="relative">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.693 2.615-7.152.088-.35-.128-.699-.483-.699H5.106M7.5 14.25L5.106 5.106M9.75 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm9 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>

            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF6161] px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </span>

          <span className="hidden sm:inline">Cart</span>
        </Link>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 sm:hidden">
        <form
          onSubmit={handleSearch}
          className="relative"
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full rounded-sm bg-white px-4 py-2 pr-12 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-300"
            aria-label="Search products"
          />

          <button
            type="submit"
            aria-label="Search"
            className="absolute right-0 top-0 flex h-full items-center justify-center px-4 text-[#2874F0]"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.607 0 7.5 7.5 0 0010.607 0z"
              />
            </svg>
          </button>
        </form>
      </div>
    </header>
  );
}