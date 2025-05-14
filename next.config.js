// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // para evitar conflictos en dev
});

module.exports = withPWA({
  // Tu configuración Next.js (opcional)
  reactStrictMode: true,
  swcMinify: true,
});
