import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    process.env.NODE_ENV === 'production' &&
      obfuscatorPlugin({
        options: {
          compact: true,
          controlFlowFlattening: false,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: false,
          deadCodeInjectionThreshold: 0.4,
          disableConsoleOutput: false,
          stringArray: true,
          stringArrayThreshold: 0.75,
          rotateStringArray: true,
          stringArrayEncoding: ['rc4'],
          selfDefending: true,
          debugProtection: true,
          splitStrings: false,
          splitStringsChunkLength: 8,
        },
        include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
        exclude: ['src/router/**', 'src/pages/**/*.route.*', '**/import*', '**/require*'],
      }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    cssCodeSplit: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
});
