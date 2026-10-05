/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'assets.aceternity.com'],
  },
  transpilePackages: ['@supabase/supabase-js'],
};

export default nextConfig;
