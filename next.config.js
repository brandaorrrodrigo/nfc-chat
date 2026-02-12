const path = require('path');

/** @type {import('next').NextConfig} */
// BUILD MARKER: 2026-02-12 - outputFileTracingRoot fix for Windows + MediaPipe pipeline
const nextConfig = {
  reactStrictMode: true,

  // Fix: limitar file tracing ao diretório do projeto (evita scan de pastas do Windows)
  outputFileTracingRoot: path.join(__dirname),

  outputFileTracingExcludes: {
    '*': [
      '**/Ambiente de Impressão/**',
      '**/Ambiente de Rede/**',
      '**/AppData/**',
      'C:\\Users\\NFC\\Ambiente*',
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ FIX: Excluir pastas de rede do Windows do build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/Ambiente de Impressão/**',
          '**/Ambiente de Rede/**',
          '**/AppData/**',
        ],
      }
    }
    return config
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
