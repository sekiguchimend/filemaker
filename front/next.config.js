const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // Ensure Next.js traces files relative to the monorepo/workspace root
  outputFileTracingRoot: path.join(__dirname, '..'),
};

module.exports = nextConfig;
