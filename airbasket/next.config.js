/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};
module.exports = {
  ...nextConfig,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://f8ef-140-112-248-7.ngrok-free.app/:path*", // Proxy to Backend
      },
    ];
  },
};
