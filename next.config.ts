import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This is to allow the Next.js dev server to accept requests from the Firebase Studio environment.
    allowedDevOrigins: ["*.cluster-duylic2g3fbzerqpzxxbw6helm.cloudworkstations.dev"],
  },
};

export default nextConfig;
