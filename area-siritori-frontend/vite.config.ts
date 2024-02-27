import generouted from '@generouted/react-router/plugin';
import react from '@vitejs/plugin-react-swc';
import AutoImport from 'unplugin-auto-import/vite';
import Unfonts from 'unplugin-fonts/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    // @ts-ignore
    generouted(),
    AutoImport({
      imports: ['react', 'react-router-dom'],
      dts: 'src/auto-imports.d.ts',
    }),
    Unfonts({
      // https://fonts.google.com/
      google: {
        families: ['Noto Sans JP', 'M PLUS 1', 'M PLUS 2', 'Murecho', 'M PLUS 1 Code'],
      },
    }),
  ],
  server: {
    proxy: {
      '/socket.io': {
        target: 'ws://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
