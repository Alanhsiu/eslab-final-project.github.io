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
        destination: "http://192.168.0.14:5328/:path*", // Proxy to Backend
      },
    ];
  },
};
