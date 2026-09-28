import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-[#1C1C4E] via-[#2874F0] to-[#1C1C4E]">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 py-14 sm:py-20 lg:px-8">
        <span className="rounded-full bg-[#F9C616] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1C1C1C]">
          New season, new picks
        </span>
        <h1 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          Discover Your Everyday Essentials
        </h1>
        <p className="max-w-lg text-sm text-blue-100 sm:text-base">
          Electronics, fashion, home and fitness — 100 handpicked products,
          honest prices, and a checkout that just works.
        </p>
        <Link
          href="#products"
          className="mt-2 inline-block rounded-sm bg-[#F9C616] px-8 py-3 text-sm font-bold text-[#1C1C1C] shadow-lg transition hover:bg-[#f0bc0c]"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
