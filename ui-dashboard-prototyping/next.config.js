const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      next: path.resolve(__dirname, "../node_modules/next"),
    };
    return config;
  },
};

module.exports = nextConfig;
