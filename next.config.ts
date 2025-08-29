import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      mongoose: require.resolve('mongoose'), // اطمینان از نسخه node
    };
    return config;
  },
  images: {
    unoptimized: true,
    domains: ['placehold.co'],
  },
  // ✅ اینجا کلید جدید
  serverExternalPackages: ['mongoose'],
};

export default nextConfig;
