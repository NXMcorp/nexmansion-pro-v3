/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
    ],
    unoptimized: true,
  },
  experimental: {
    // better-sqlite3 and bcryptjs contain native bindings and must stay external
    // to the server bundle for Vercel serverless compatibility
    serverComponentsExternalPackages: ["better-sqlite3", "bcryptjs"],
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Frame-Options", value: "ALLOWALL" },
        { key: "Content-Security-Policy", value: "frame-ancestors * 'self' 'unsafe-inline' 'unsafe-eval' https: http: data: blob:;" },
      ],
    },
  ],
};
export default nextConfig;
