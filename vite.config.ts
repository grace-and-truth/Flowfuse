import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: process.cwd(), // ensure project root is flowfuse/
    
    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'Funnelflow(1)/components'),
        '@features': path.resolve(__dirname, 'Funnelflow(1)/features'),
        '@types': path.resolve(__dirname, 'Funnelflow(1)/types.d.ts'),
        '@': path.resolve(__dirname),
      },
      extensions: ['.js', '.ts', '.tsx', '.jsx'], // helps Vite resolve TSX/TS
    },
  };
});
