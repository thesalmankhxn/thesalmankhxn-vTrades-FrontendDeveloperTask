import type { NextConfig } from 'next';

/**
 * Next.js Configuration
 *
 * This configuration enables server actions, experimental features,
 * and optimizations for better performance and developer experience.
 */
const nextConfig: NextConfig = {
    // Enable server actions for form handling and data mutations
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3000', 'localhost:3001']
        },
        // Enable modern React features
        serverComponentsExternalPackages: [],
        // Optimize bundle size
        optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react']
    },

    // Image optimization settings
    images: {
        domains: ['localhost'],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
    },

    // Webpack configuration for better performance
    webpack: (config, { dev, isServer }) => {
        // Optimize bundle splitting
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            };
        }

        return config;
    },

    // Environment variables and runtime configuration
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY
    },

    // Headers for security and performance
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    }
                ]
            }
        ];
    },

    // Redirects configuration
    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true
            }
        ];
    },

    // Rewrites for API routing
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: '/api/:path*'
            }
        ];
    },

    // TypeScript configuration
    typescript: {
        // Enable type checking during build
        ignoreBuildErrors: false
    },

    // ESLint configuration
    eslint: {
        // Enable ESLint during builds
        ignoreDuringBuilds: false
    },

    // Output configuration
    output: 'standalone',

    // Trailing slash configuration
    trailingSlash: false,

    // Powered by header
    poweredByHeader: false,

    // React strict mode for better development experience
    reactStrictMode: true,

    // SWC minification for faster builds
    swcMinify: true
};

export default nextConfig;
