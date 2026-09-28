"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import EmptyState from "@/app/components/EmptyState";

export default function CartPage() {
  const { items, increaseQty, decreaseQty, removeFromCart, clearCart, total, itemCount, isHydrated } = useCart();

  if (!isHydrated) {
    return <div className="py-24 text-center text-sm text-gray-400">Loading your cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <EmptyState
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Go find something you like."
          action={
            <Link
              href="/"
              className="mt-2 rounded-sm bg-[#2874F0] px-6 py-2 text-sm font-semibold text-white"
            >
              Continue Shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#212121]">
          My Cart <span className="font-normal text-gray-400">({itemCount} items)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm font-medium text-[#FF6161] hover:underline"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.color}-${item.size ?? ""}`}
              className="flex gap-4 rounded-md border border-gray-200 bg-white p-4"
            >
              <Link
                href={`/products/${item.productId}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded bg-gray-50"
              >
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              </Link>

              <div className="flex flex-1 flex-col">
                <Link
                  href={`/products/${item.productId}`}
                  className="text-sm font-medium text-[#212121] hover:text-[#2874F0]"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-xs text-gray-500">
                  Color: {item.color}
                  {item.size ? ` · Size: ${item.size}` : ""}
                </p>
                <p className="mt-1 text-base font-semibold text-[#212121]">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded border border-gray-300">
                    <button
                      onClick={() => decreaseQty(item.productId, item.color, item.size)}
                      className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-50"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.productId, item.color, item.size)}
                      disabled={item.quantity >= item.stock}
                      className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId, item.color, item.size)}
                    className="text-sm font-medium text-gray-500 hover:text-[#FF6161]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-md border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Price Details
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Price ({itemCount} items)</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-[#388E3C]">Free</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-dashed border-gray-200 pt-4 text-base font-bold text-[#212121]">
            <span>Total Amount</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <button
            className="mt-5 w-full rounded-sm bg-[#FB641B] py-3 text-sm font-bold text-white transition hover:bg-[#e1590f]"
            onClick={() => alert("This is a demo — checkout isn't wired up to real payments.")}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
