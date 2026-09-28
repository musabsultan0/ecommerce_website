/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Lets product images load from any website (your own image URLs).
    unoptimized: true,
  },
};

module.exports = nextConfig;