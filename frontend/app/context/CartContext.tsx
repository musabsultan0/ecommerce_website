"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import type { CartItem } from "@/app/types/product";

const STORAGE_KEY = "shopease_cart";

interface CartContextValue {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  increaseQty: (productId: number, color: string, size?: string) => void;
  decreaseQty: (productId: number, color: string, size?: string) => void;
  removeFromCart: (productId: number, color: string, size?: string) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// A cart line is uniquely identified by product + color + size, since the
// same product can be added in more than one variant combination.
function lineKey(productId: number, color: string, size?: string) {
  return `${productId}::${color}::${size ?? ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load persisted cart on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Corrupt or inaccessible storage — start with an empty cart.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist on every change, once hydrated (avoids clobbering storage
  // with an empty array before the initial read completes).
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or unavailable — cart still works for this session.
    }
  }, [items, isHydrated]);

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const key = lineKey(item.productId, item.color, item.size);
        const existing = prev.find(
          (i) => lineKey(i.productId, i.color, i.size) === key
        );
        if (existing) {
          const nextQty = Math.min(existing.quantity + quantity, item.stock);
          return prev.map((i) =>
            lineKey(i.productId, i.color, i.size) === key
              ? { ...i, quantity: nextQty }
              : i
          );
        }
        return [...prev, { ...item, quantity: Math.min(quantity, item.stock) }];
      });
    },
    []
  );

  const increaseQty = useCallback((productId: number, color: string, size?: string) => {
    setItems((prev) =>
      prev.map((i) =>
        lineKey(i.productId, i.color, i.size) === lineKey(productId, color, size)
          ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
          : i
      )
    );
  }, []);

  const decreaseQty = useCallback((productId: number, color: string, size?: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          lineKey(i.productId, i.color, i.size) === lineKey(productId, color, size)
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId: number, color: string, size?: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => lineKey(i.productId, i.color, i.size) !== lineKey(productId, color, size)
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    itemCount,
    total,
    isHydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
