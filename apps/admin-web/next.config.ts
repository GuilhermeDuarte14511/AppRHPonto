import type { NextConfig } from 'next';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const appDirectory = dirname(currentFile);
const workspaceDirectory = resolve(appDirectory, '..', '..');
const workspaceEnvPath = resolve(workspaceDirectory, '.env.local');

if (existsSync(workspaceEnvPath)) {
  const envContent = readFileSync(workspaceEnvPath, 'utf8');

  for (const line of envContent.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#') || !trimmedLine.includes('=')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');
    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  transpilePackages: [
    '@rh-ponto/api-client',
    '@rh-ponto/audit',
    '@rh-ponto/auth',
    '@rh-ponto/config',
    '@rh-ponto/core',
    '@rh-ponto/employees',
    '@rh-ponto/firebase',
    '@rh-ponto/justifications',
    '@rh-ponto/time-records',
    '@rh-ponto/ui',
    '@rh-ponto/validations',
  ],
};

export default nextConfig;
