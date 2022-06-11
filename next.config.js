/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['zzmdfwuekwjsudglcuxe.supabase.co']
  },
  redirects: [
    {
      source: '/',
      destination: '/admin',
      permanent: true
    }
  ]
}

module.exports = nextConfig
