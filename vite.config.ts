import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/apps': path.resolve(__dirname, './src/apps'),
            '@/services': path.resolve(__dirname, './src/services'),
            '@/context': path.resolve(__dirname, './src/context'),
            '@/types': path.resolve(__dirname, './src/types'),
            '@/utils': path.resolve(__dirname, './src/utils'),
        },
    },

    server: {
        port: 5173,
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
        },
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:* https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com;"
        },
    },

    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    ui: ['lucide-react'],
                },
            },
        },
    },

    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '0.0.0'),
    },

    optimizeDeps: {
        include: ['react', 'react-dom', 'lucide-react'],
    },
}); 