/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['localhost', 'images.unsplash.com'],
  },
};

export default nextConfig;
