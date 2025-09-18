/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'payment.basculeuw.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
