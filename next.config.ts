import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.1",
    "localhost",
    // Agrega el origen desde la variable de entorno si existe
    ...(process.env.ALLOWED_DEV_ORIGIN ? [process.env.ALLOWED_DEV_ORIGIN] : []),
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
};

export default nextConfig;
