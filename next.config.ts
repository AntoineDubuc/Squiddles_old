import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@openai/agents', '@aws-sdk/client-bedrock-runtime']
};

export default nextConfig;