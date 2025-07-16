import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.1",
    "localhost",
    // Agrega el origen desde la variable de entorno si existe
    ...(process.env.ALLOWED_DEV_ORIGIN ? [process.env.ALLOWED_DEV_ORIGIN] : []),
  ],
};

export default nextConfig;
