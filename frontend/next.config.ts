/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      // 本番環境のURLパターンも必要に応じて追加
    ],
  },
};

module.exports = nextConfig;
