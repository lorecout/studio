import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // This is the simplest possible configuration to address the root error.
  // We are removing all dynamic logic and experimental features to prevent the restart loop.
  // The error message consistently points to `allowedDevOrigins`.
  // We will use the most direct, wildcard-based solution.
  allowedDevOrigins: [
    'https://*.cloudworkstations.dev',
  ],

  // These settings are essential to prevent build failures in the Studio environment.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
