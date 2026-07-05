// eslint.config.mjs — Config global del monorepo (raíz).
//
// ESLint 10 (flat config). Un solo archivo cubre FE, BE y shared:
// ESLint busca el config más cercano subiendo por el árbol de carpetas;
// como solo hay uno en la raíz, aplica a todas las apps.
//
// Filosofía (separación estricta de responsabilidades):
//   - ESLint   -> caza ERRORES potenciales (como TypeScript). NO formatea.
//   - Prettier -> formatea (comillas, comas, indentación) vía .prettierrc.json.
// El bloque `prettier` (eslint-config-prettier) al final SOLO apaga las reglas
// de formato de ESLint para que no choquen con Prettier. No añade reglas.
//
// Nota monorepo: las reglas se aplican por `files`, NO globalmente. Las reglas
// de React solo cargan en apps/frontend; el backend corre tan ligero como un
// repo Node dedicado. Solo la base de TypeScript es común a todo.

import js from '@eslint/js' //                        GLOBAL · reglas base de JS
import prettier from 'eslint-config-prettier' //       GLOBAL · apaga formato (Prettier)
import reactHooks from 'eslint-plugin-react-hooks' //  FE     · reglas de hooks de React
import reactRefresh from 'eslint-plugin-react-refresh' // FE  · HMR seguro (Vite)
import tseslint from 'typescript-eslint' //            GLOBAL · base TypeScript caza-bugs

export default tseslint.config(
  // 1. Ignores globales. El `**/` es CLAVE en monorepo: atrapa el dist/coverage
  //    de cada app (apps/frontend/dist, apps/backend/dist, ...), no solo la raíz.
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/config/**',
      'scripts/**', // scripts de infra (postinstall, post-commit) — no se lintan
      '**/*.js', // JS suelto de config antiguo; el código fuente es .ts/.tsx
    ],
  },

  // 2. Base para TODO el TypeScript del monorepo (FE + BE + shared).
  //    `recommended` = errores casi seguros, poco ruido. Es la base moderna
  //    caza-bugs. (Para más rigor: tseslint.configs.strict.)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 2b. GLOBAL · Ajustes a reglas de la base TS (FE + BE + shared).
  {
    rules: {
      // Permite vars/args/catch sin usar SI empiezan con "_" (patrón underscore).
      // Útil para params requeridos por firma pero no usados: (_req, res, _next).
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },

  // 3. SOLO Frontend (React 19). Reglas de hooks + react-refresh (Vite/HMR).
  //    Estas reglas NO existen para el backend: no lo entorpecen.
  {
    files: ['apps/frontend/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // 4. SOLO Backend (Node/Express). Aquí van reglas específicas de servidor
  //    cuando las necesites (por ahora hereda la base TS de arriba).
  {
    files: ['apps/backend/**/*.ts'],
    rules: {},
  },

  // 5. Prettier al FINAL: apaga las reglas de formato de ESLint para que no
  //    peleen con Prettier. Debe ir de último para ganar el override.
  prettier,
)
