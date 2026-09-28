export default function Footer() {
  return (
    <footer className="mt-16 bg-[#172337] text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-2 lg:px-8">
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            About
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              ShopEase is your one-stop destination for a seamless online
              shopping experience.
            </li>
            <li>
              Discover quality products across different categories at
              affordable prices.
            </li>
            <li>
              Shop with ease, enjoy convenience, and find everything you need
              in one place.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Contact
          </h4>
          <ul className="space-y-2 text-sm">
            <li>support@shopease.com</li>
            <li>1800-123-4567</li>
            <li>Hyderabad, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ShopEase. Built for demo purposes — no real payments are processed.
      </div>
    </footer>
  );
}