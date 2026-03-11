/** @type {import('next').NextConfig} */
const path = require("path")
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.join(__dirname, ".."),
  },
}

module.exports = nextConfig
