import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // Security headers for dev server
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false, // Security: Disable source maps in production
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Security: Remove console.logs
          drop_debugger: true,
          passes: 2
        },
        format: {
          comments: false // Security: Remove comments
        }
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Group tsparticles into a separate chunk for caching
              if (id.includes('tsparticles')) {
                return 'vendor-tsparticles';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    optimizeDeps: {
      include: [
        '@tsparticles/engine',
        '@tsparticles/slim'
      ],
      exclude: ['@google/genai'] // Exclude server-side deps
    }
  };
});
