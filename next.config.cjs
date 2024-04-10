/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["alliancechemical.com"], // alternatively use domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "alliancechemical.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
