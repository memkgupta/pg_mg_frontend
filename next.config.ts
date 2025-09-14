import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images:{
    remotePatterns:[new URL("https://picsum.photos/**"),new URL('https://jgfczaj5y2.ufs.sh/f/**')]
  }
};

export default nextConfig;
