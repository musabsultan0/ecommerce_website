
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  // Some image sites block pictures requested from another website.
  // Not sending a referrer makes most of them load normally.
  referrer: "no-referrer",
  title: "ShopEase — Discover Your Everyday Essentials",
  description: "A small e-commerce demo: electronics, fashion, home & fitness.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#F1F3F6] text-[#212121] antialiased">
        <CartProvider>
          <Suspense
            fallback={
              <div className="h-16 bg-[#2874F0]" />
            }
          >
            <Navbar />
          </Suspense>

          <main className="flex-1">{children}</main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}