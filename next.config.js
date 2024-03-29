/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  images: {
    remotePatterns:[
      {
        protocol:'https',
        hostname:'firebasestorage.googleapis.com'
      },
      {
        protocol:'https',
        hostname:'cryptoicons.org'
      },
      {
        protocol:'https',
        hostname:'coinicons-api.vercel.app'
      }
    ],
  },
}
