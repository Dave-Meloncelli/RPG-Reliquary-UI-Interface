import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.AGENT_MAX_CONCURRENT': JSON.stringify(env.AGENT_MAX_CONCURRENT),
        'process.env.AGENT_DEBUG': JSON.stringify(env.AGENT_DEBUG),
        'process.env.AGENT_TIMEOUT_MS': JSON.stringify(env.AGENT_TIMEOUT_MS),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
