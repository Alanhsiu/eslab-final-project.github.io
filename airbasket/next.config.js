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
        destination: "https://mighty-numbers-bet.tunnelapp.dev/:path*", // Proxy to Backend
      },
    ];
  },
};
