import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    // Vite resuelve los `paths` del tsconfig de forma nativa (antes vite-tsconfig-paths).
    tsconfigPaths: true,
  },
  css: {
    modules: {
      // Mantiene los nombres de clase tal cual (sin hash). Ver claude.md > className Usage.
      generateScopedName: (name) => name,
    },
    preprocessorOptions: {
      scss: {
        // Permite `@use 'variables'` sin rutas absolutas desde cualquier .scss.
        loadPaths: [path.resolve(__dirname, 'src/styles')],
        // Silencia los deprecation warnings que provienen de dependencias (node_modules),
        // p. ej. sweetalert2-custom-theme, cuyo código no controlamos.
        quietDeps: true,
      },
    },
  },
});
