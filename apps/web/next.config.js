/** @type {import('next').NextConfig} */
const nextConfig = {
    // PWA Configuration will be added later
    reactStrictMode: true,

    // Optimize images
    images: {
        domains: [],
    },

    // Environment variables
    env: {
        API_URL: process.env.API_URL || 'http://localhost:4000',
    },

    // Headers for security
    // headers removed for static export compatibility
    output: 'export',
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
