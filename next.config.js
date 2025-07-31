/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  basePath: "/shopping-cart-nextjs-qraphql",
  assetPrefix: "/shopping-cart-nextjs-qraphql/",
};

export default nextConfig;
