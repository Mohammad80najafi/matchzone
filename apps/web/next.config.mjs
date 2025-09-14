/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverActions: { bodySizeLimit: "1mb" },
  },
  reactStrictMode: true,
};
export default config;
