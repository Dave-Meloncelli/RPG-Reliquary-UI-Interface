import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }: { mode: string }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Remove API key exposure from frontend
      // API keys should only be handled on the backend
      define: {
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.BACKEND_URL': JSON.stringify(env.BACKEND_URL || 'http://localhost:8000'),
      },
      resolve: {
        alias: {
          '@': resolve(__dirname, '.'),
        }
      },
      server: {
        port: 5173,
        proxy: {
          '/api': {
            target: env.BACKEND_URL || 'http://localhost:8000',
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/api/, ''),
          }
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: mode === 'development',
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              ui: ['@google/genai'],
            }
          }
        }
      }
    };
});
