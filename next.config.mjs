/** @type {import('next').NextConfig} */
const nextConfig = {
  // This allows the build to finish even if there are linting errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // If you are using TypeScript, you can also add this to skip type errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;