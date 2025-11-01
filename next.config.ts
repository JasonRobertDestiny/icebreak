import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    DEEPSEEK_API_BASE: 'https://newapi.deepwisdom.ai/v1',
    DEEPSEEK_MODEL: 'deepseek-chat'
  }
};

export default nextConfig;
