import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  
  resolve: {
    alias: {
      '@node_modules': '../../node_modules',
      '@src': './src',
      "@shared": "../shared"
    },
  },
  css: {
    modules: {
      // Esta es la configuración clave para personalizar cómo se generan los identificadores locales
      generateScopedName: (name) => {
        return name;
      },
    },
    preprocessorOptions: {
      scss: {
        // Configuración para incluir rutas. Esto es equivalente al `includePaths` en tu configuración de Next.js.
        includePaths: [path.resolve(__dirname, 'src/styles')],
        api: 'legacy',
      },
    },
  },
});
