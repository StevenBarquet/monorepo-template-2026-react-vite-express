# Monorepo Template 2026

Template base para arrancar proyectos: monorepo con **npm workspaces** sobre **Node 26**.

- **Frontend** (`apps/frontend`): Vite + React 19 + TypeScript, Ant Design, Zustand, SCSS Modules, react-router. Cliente tRPC + React Query (pendiente, ver Fase 4).
- **Backend** (`apps/backend`): tRPC + Express (pendiente de armar).
- **Shared** (`apps/shared`): workspace de código compartido entre BE y FE (pendiente).
- **Generators** (`generators/`): scaffolding con [plop](https://plopjs.com/).

## Scripts

```bash
npm install          # instala todos los workspaces + git hooks

npm run front        # levanta el frontend (Vite dev server)
npm run front-build  # build de producción del frontend
npm run back         # levanta el backend (aún stub)

# Generadores (plop)
npm run generate-comp    # componente
npm run generate-page    # página + ruta
npm run generate-store   # store de Zustand
npm run generate-form    # hook de formulario (ver nota abajo)
```

## Generadores de frontend

Los generadores viven en `generators/frontend/` y se ejecutan con los scripts
`generate-*` de la raíz.

- **component** — crea un componente (con o sin estilos/props) en la ruta indicada.
- **page** — crea una página + su container + estilos, y registra la ruta
  automáticamente en `src/Router/AppRoutes.tsx`.
- **store** — crea un store de Zustand (con o sin `persist`) en `src/store/`.
- **hook** — crea un hook genérico.

> **Rutas en `component` y `hook`:** cuando el generador pida el *path*, pega la
> **ruta ABSOLUTA** del folder destino (en VSCode: clic derecho sobre la carpeta →
> *Copy Path*). Si pegas una ruta relativa, plop la resuelve respecto al plopfile y
> el archivo cae en el lugar equivocado. El generador de `page` no necesita esto
> (escribe siempre en `src/pages/`).

### Agrupación de páginas

Por defecto el template **NO agrupa** las páginas: viven planas en `src/pages/`.
La agrupación por sección (`Landing/`, `Admin/`, `User/`, `Auth/`) solo tiene
sentido cuando la app crece mucho. En `generators/frontend/plopfile-page.js` se
deja comentada la variante con agrupación por si se necesita adoptarla más adelante.

## Notas / pendientes

> **Generador de formularios (Formik):** `generate-form` (`plopfile-form.js` +
> `others/form.ts.hbs`) todavía está adaptado del proyecto anterior y usa
> `zod-formik-adapter`. Las dependencias de forms (`formik`, `zod`,
> `zod-formik-adapter`) aún **no** están instaladas en el frontend. Este generador
> se dejará pendiente y se adaptará cuando se agregue el stack de formularios al
> template.
