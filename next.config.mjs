/** @type {import('next').NextConfig} */
const nextConfig = {
  // The App Router root layout loads all four Google Fonts through one link.
  // Keep font loading at runtime rather than making an offline build fetch CSS.
  optimizeFonts: false,
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};
export default (phase) => ({ ...nextConfig, distDir: phase === 'phase-development-server' ? '.next-dev' : '.next' });
