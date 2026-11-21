import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH=/portfolio when deploying to a project repo
// (https://<user>.github.io/portfolio). Leave empty for <user>.github.io.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  reactStrictMode: true,
};

export default nextConfig;
