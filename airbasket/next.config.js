/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};
module.exports = {
  ...nextConfig,
  async rewrites() {
    console.log(process.env.SERVER_URL);
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/:path*`, // Proxy to Backend
      },
    ];
  },
};
