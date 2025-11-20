
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as fs from 'fs';
import * as path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'copy-manifest',
        closeBundle() {
          try {
              if (fs.existsSync('manifest.json')) {
                  if (!fs.existsSync('dist')) {
                      fs.mkdirSync('dist');
                  }
                  fs.copyFileSync('manifest.json', 'dist/manifest.json');
                  console.log('✓ manifest.json copied to dist');
              } else {
                  console.warn('! manifest.json not found in root');
              }
          } catch (e) {
              console.error('Error copying manifest:', e);
          }
        }
      }
    ],
    define: {
      // Defines process.env.API_KEY so it is available in the client-side code
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: 'index.html',
        },
      },
    },
  };
});
