/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'assets.aceternity.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'http', hostname: 'localhost' }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  transpilePackages: ['@supabase/supabase-js'],
};

export default nextConfig;
