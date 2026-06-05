/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // next-sanity / Sanity Studio ships some packages that benefit from transpilation.
  experimental: {
    // Keep server bundles lean; harmless if unused.
  },
};

export default nextConfig;
