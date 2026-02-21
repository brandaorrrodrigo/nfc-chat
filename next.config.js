const path = require('path');
const fs = require('fs');

// Monkey-patch fs.scandir/readdirSync para ignorar pastas de rede do Windows
// Fix Windows EPERM on junction folders during Next.js build
// Only suppress EPERM for paths under C:\Users that are outside the project
const _projectDir = __dirname.replace(/\\/g, '/').toLowerCase();
function shouldSuppressEperm(p) {
  if (typeof p !== 'string') return false;
  const norm = p.replace(/\\/g, '/').toLowerCase();
  if (norm.startsWith(_projectDir)) return false;
  return /^[a-z]:\/users\//i.test(norm);
}
const _origReaddirSync = fs.readdirSync;
fs.readdirSync = function(p, ...args) {
  try {
    return _origReaddirSync.call(this, p, ...args);
  } catch (e) {
    if ((e.code === 'EPERM' || e.code === 'EACCES') && shouldSuppressEperm(p)) return [];
    throw e;
  }
};
const _origReaddir = fs.readdir;
fs.readdir = function(p, ...args) {
  const cb = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null;
  const wrappedArgs = cb ? [...args.slice(0, -1), function(err, files) {
    if (err && (err.code === 'EPERM' || err.code === 'EACCES') && shouldSuppressEperm(p)) return cb(null, []);
    cb(err, files);
  }] : args;
  return _origReaddir.call(this, p, ...wrappedArgs);
};

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
      'C:\\Users\\NFC\\**',
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
    // Restringir resolução de módulos ao diretório do projeto
    config.resolve = {
      ...config.resolve,
      modules: [path.join(__dirname, 'node_modules'), 'node_modules'],
    }
    config.resolveLoader = {
      ...config.resolveLoader,
      modules: [path.join(__dirname, 'node_modules'), 'node_modules'],
    }
    // Excluir pastas Windows problemáticas do snapshot
    if (config.snapshot) {
      config.snapshot.managedPaths = config.snapshot.managedPaths || []
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
