/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer', 'pg', 'ioredis'],
  },
};

export default nextConfig;
