/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // This allows you to use images from placeholder sites or your backend
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com', // For images from Google
      },
    ],
    // If you want to use standard <img> tags without optimization, use this:
    unoptimized: true, 
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;