/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  optimizeFonts: false,
  images: {
    remotePatterns:[
      {
        protocol:'https',
        hostname:'firebasestorage.googleapis.com'
      }
    ]
  }
}
