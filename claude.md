# Project Rules

> **Monorepo.** Este repo usa **npm workspaces** sobre **Node 26** y organiza el
> código en `apps/`:
> - `apps/frontend` — Vite + React (SPA client-side).
> - `apps/backend` — Express REST API + WebSocket.
> - `apps/shared` — código compartido entre BE y FE (workspace `@app/shared`).
>
> Las reglas están divididas en tres secciones. **Lee la que corresponde a lo que
> estás tocando:**
> - **[GENERAL](#general)** — aplica a todo el monorepo.
> - **[FRONTEND ONLY](#frontend-only)** — aplica solo a `apps/frontend`.
> - **[BACKEND ONLY](#backend-only)** — aplica solo a `apps/backend`.

---

# GENERAL

Reglas transversales a todo el monorepo.

## Git Policy

- NEVER commit, push, or interact with git in any way
- The user is solely responsible for all git operations
- Do not run git add, git commit, git push, git stash, or any other git command

## Monorepo Layout

```
monorepo/
├── apps/
│   ├── frontend/       # Vite + React SPA
│   ├── backend/        # Express REST API + WebSocket
│   └── shared/         # @app/shared — tipos, utils, schemas compartidos
├── generators/         # Plantillas plop (scaffolding FE y BE)
├── scripts/            # Scripts de infra (git hooks, versionado por commit)
└── package.json        # Root — workspaces + scripts orquestadores
```

- **Package manager: npm** (npm workspaces). No usar yarn/pnpm.
- **Runtime: Node 26** (`engines` en cada `package.json`).
- Scripts orquestadores viven en el `package.json` raíz (`front`, `back`,
  `generate-*`) y delegan al workspace con `npm run <script> --workspace=<app>`.
- Para agregar una dependencia a un workspace:
  `npm install <pkg> --workspace=apps/<app>` (o `-D` para devDependency).

## Shared Code (`@app/shared`)

- Código usado por **más de un** workspace (BE y FE) vive en `apps/shared`:
  tipos de dominio, constantes y utils puros.
- Regla de dependencias: si un util de `shared` necesita una librería, esa
  librería se declara en el `package.json` de **quien consume** el util. npm
  hoistea a `node_modules` raíz; no se duplica físicamente.
- Tipos exclusivos del BE van en `apps/backend/src/models/`. Solo se mueven a
  shared si el FE también los necesita.

## Scaffolding — Prefer Generators

- Para crear páginas, componentes, stores o hooks, **usa los generadores plop**
  (`npm run generate-page`, `generate-comp`, `generate-store`, `generate-hook`)
  en vez de crear los archivos a mano. Garantizan estructura, naming y boilerplate
  consistentes (y registran rutas automáticamente en el caso de `generate-page`).
- Crea archivos a mano solo cuando ningún generador cubra el caso.
- Si un generador produce algo desactualizado respecto a estas reglas, **arregla
  la plantilla** (`generators/`), no solo el archivo generado.

## Verification (before calling something done)

- Tras cambios no triviales, **verifica que compila** antes de darlo por terminado:
  - **Frontend:** `npm run front-build` (que hace `tsc && vite build`) — o al menos
    `tsc --noEmit` + levantar el dev server.
  - **Backend:** `npm run back-typecheck` (`tsc --noEmit`) + `npm run back-test`.
- Confirmar que **no hay errores ni warnings** nuevos.
- No reportar un cambio como completo sin esta verificación.

## Prefer Modern Syntax

- Al tocar configs, estilos o TS, usa siempre la **API moderna vigente** de cada
  herramienta y evita sintaxis deprecada aunque "todavía funcione". Ejemplos ya
  adoptados: `@use`/`@forward` en Sass (nunca `@import`), `moduleResolution: "bundler"`
  en TS, resolución nativa de paths en Vite (sin `vite-tsconfig-paths`).

## No Quick-Fix Hacks

- **Nunca implementes soluciones rápidas que trasladen complejidad al developer.**
  Si un problema es de tooling/config, resuélvelo en tooling/config — no ensucies
  el código fuente para "salir del paso".
- Ejemplos de lo que NO es aceptable:
  - Agregar extensiones `.js` a imports en archivos TypeScript para satisfacer ESM.
  - Workarounds manuales repetitivos que el build tool debería manejar.
  - Cambios que "funcionan" pero que rompen la ergonomía o el estándar del proyecto.
- Ante un problema de build/runtime, **arregla la configuración o cambia la
  herramienta** — nunca parches en el código fuente.

## TypeScript Conventions

- Use `type` imports where possible
- Export constants with `as const` for literal types
- Prefer union types over enums (`'A' | 'B' | 'C' | 'D'`)
- Extract constants arrays for runtime use: `const MODELS = ['gpt-4o', 'gpt-4o-mini'] as const`

## General Code Style

- Use named exports, never default exports (excepción: páginas/módulos lazy-loaded
  que requieran `export default` para `React.lazy` / dynamic import)
- No comments explaining WHAT — only WHY when non-obvious
- When a pattern (component, hook, util) repeats across unrelated places, extract
  it to the right shared location. Do not tolerate copy-paste across siblings.

## File Organization (imports)

- Imports order: Dependencies → UI Dependencies → Custom Hooks → Components → Config/Utils → Styles
- Mark import sections with comments: `// ---Dependencies`, `// ---Custom Hooks`, `// ---Components`, `// ---Config`

---

# FRONTEND ONLY

Aplica exclusivamente a `apps/frontend`.

## Stack

- Vite + React 19 (full client-side SPA, no SSR)
- Ant Design (ConfigProvider for dark theming)
- Zustand (with devtools + persist middleware) for client state
- SCSS Modules for styling
- react-router-dom for routing
- react-forge-grid (Frow, Fcol) for layouts
- TypeScript strict

> Pendiente de integrar (Fase 4): cliente **tRPC + @tanstack/react-query** para
> el data-fetching type-safe contra el backend, y **Formik + Zod**
> (`zod-formik-adapter`) para formularios.

## Project Structure

```
apps/frontend/src/
├── pages/              # Route pages (one folder per page, flat by default)
│   ├── Home/           # Landing/home page
│   │   └── HomeCont/   # Page container component
│   └── Page404/        # 404 page
├── layout/             # App shell components (Layout, loaders)
├── common/             # Generic reusable UI building blocks (design-system level)
├── providers/          # Logical wrappers (AntdProv, ScrollToTop, GlobalProviders)
├── store/              # Zustand stores (one file per domain)
├── utils/
│   ├── functions/      # Pure utility functions
│   └── hooks/          # Generic reusable hooks
├── styles/             # Global SCSS (variables, utils, theme, animations)
├── appConfig/          # App-level config (constants)
├── assets/             # Static assets (SVGs, images)
├── Router/             # Route modules (Routes.tsx + AppRoutes.tsx)
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

- **Pages son planas por defecto** (`src/pages/Home`, no `src/pages/Landing/Home`).
  Agrupar por sección (`Admin/`, `User/`, `Auth/`) solo si la app crece mucho.

## Component Conventions

### Structure

Every component follows this internal structure:

```tsx
// -----------------------CONSTS, HOOKS, STATES
// -----------------------MAIN METHODS
// -----------------------AUX METHODS
// -----------------------RENDER
```

### Naming and Files

- Component name in PascalCase matches its folder and file name
- Each component lives in its own folder: `ComponentName/ComponentName.tsx`
- SCSS module file: `ComponentName/ComponentName.module.scss`
- Auxiliary files (utils, constants, hooks) go in the same folder as the component that uses them

### Component Placement (Where does it live?)

Decide placement by asking: **who uses this component?**

| Who uses it | Where it lives | Examples |
|-------------|---------------|----------|
| Any component, context-agnostic (design-system level) | `src/common/` | `CopyButton`, `Spinner`, `DynamicIcon`, form controls |
| All pages (app shell / global visual structure) | `src/layout/` | `Layout`, `FullScreenLoading` |
| All pages (logical wrapper, non-visual) | `src/providers/` | `AntdProv`, `GlobalProviders`, `ScrollToTop` |
| A single parent component | Co-located inside the parent's folder | `HeadLabel/` inside `CollapseReusable/` |

### Co-location Rules

Components specific to a parent live inside its folder, mirroring the component tree:

```
ParentComponent/
├── ParentComponent.tsx
├── ParentComponent.module.scss
├── ChildA/
│   ├── ChildA.tsx
│   ├── ChildA.module.scss
│   ├── GrandchildX/
│   │   └── GrandchildX.tsx
│   └── GrandchildY/
│       └── GrandchildY.tsx
└── ChildB/
    └── ChildB.tsx
```

- Hooks, utils, constants that are specific to a component live in that component's folder
- If `common/` grows, group by type: `common/buttons/`, `common/forms/`, etc.

### Style Import Variable

Use `style` (singular), not `styles`:

```tsx
import style from './MyComponent.module.scss';
```

### className Usage

- The root element uses the SCSS module reference: `className={style.ComponentName}`
- All child elements use plain string classNames: `className="child-class"`
- Never reference `style.xxx` for anything other than the root element
- This works because SCSS modules have class collision names disabled in this project
- If the component has NO SCSS file, the root also uses a plain string: `className="ComponentName"`

### Explicit return types

- Explicit return types on components (`: ReactElement`)

## Styling Rules

### SCSS Module Boilerplate

Every SCSS module file MUST load variables, animations and utils via `@use`, even
if not immediately used. Usa `as *` para consumir variables/mixins sin namespace:

```scss
@use '/src/styles/variables' as *;
@use '/src/styles/animations' as *;
@use '/src/styles/utils' as *;

.ComponentName {
  // styles here
}
```

> **Sass moderno.** El proyecto usa la API moderna de Dart Sass: usa `@use` /
> `@forward`, **nunca `@import`** (deprecado). Para funciones de color usa el
> módulo `sass:color` (`@use 'sass:color'; color.mix(...)`), no las funciones
> globales `mix()` / `lighten()` / `darken()`.

### Minimize classNames in JSX

- The root element gets the component name className — that's mandatory
- For child elements, prefer targeting HTML tag specificity inside the parent scope rather than adding classNames
- Good targets: `h1`, `h2`, `header`, `footer`, `ul`, `li`, `button`, `blockquote`, `table`, `th`, `td`, `p`, `strong`, `small`
- Avoid targeting overly generic tags: `span`, `div` — these need a className
- Only add a className when the tag is too generic or when there are multiple sibling elements of the same tag that need different styles

```scss
// GOOD: targeting specific tags within component scope
.DaySummary {
  header { ... }
  ul { ... }
  li { ... }
  blockquote { ... }
}

// GOOD: className only when needed for specificity
.DaySummary {
  .badge { ... }
  .empty { ... }
}
```

### Nesting Rules

- Only 1 level of nesting depth inside the component class
- For deeper specificity, chain class names on the same level:

```scss
// GOOD
.Parent {
  .child .grandchild { ... }
}

// BAD
.Parent {
  .child {
    .grandchild { ... }
  }
}
```

### No :global Required

SCSS modules have class collision names disabled — no need for `:global` to target library classes (like Ant Design). Just write them directly:

```scss
.MyComponent {
  .ant-picker-calendar { ... }
}
```

### No Inline Styles (almost)

- Never use inline `style={{}}` for layout or design
- Acceptable inline style: dynamic values that come from JS (like `backgroundColor` from a variable/map)
- If you already have a className, all its styles go in the SCSS file

### Style Responsibility

- Each component is responsible for styling its OWN elements only
- Never style a child component's internal elements from a parent's SCSS
- You CAN control a child component's positioning/margin from the parent (e.g., margin, grid placement)

### Responsive

- Responsive design via the `onlyIn()` mixin (mob, desk, xs, sm, md, lg, xl, xxl)

## Zustand Store Conventions

- One store per domain in `src/store/`
- Always use `devtools` middleware with a descriptive name
- Define `State` interface, `initialState`, and the store interface extending State
- Always include a `reset` method
- Use the `update` pattern: `update: (data) => set((state) => ({ ...state, ...data }))`
- For stores that need persistence, use `persist` middleware wrapping the actions before `devtools`
- Derived/computed values can be functions on the store

## Form Conventions (Formik)

> Aplica cuando se integre el stack de formularios (Formik + Zod). Pendiente Fase 4.

### Custom Hook Pattern

Every form MUST be implemented through a custom hook that encapsulates all Formik logic. The component only renders — it never owns form state or submit logic.

```tsx
// useMyForm.ts
export function useMyForm() {
  const formik = useFormik({
    initialValues: { ... },
    validationSchema: toFormikValidationSchema(mySchema), // zod-formik-adapter
    onSubmit: async (values) => { ... },
  });

  return { formik };
}

// MyFormComponent.tsx
export function MyFormComponent(): ReactElement {
  const { formik } = useMyForm();
  // render using formik.values, formik.handleChange, etc.
}
```

### Rules

- The hook returns `{ formik }` (and any extra helpers if needed)
- All submit logic, validation, side effects (confirms, mutations, drawer closing) live in the hook
- The component is purely presentational — it destructures from the hook and renders
- Hook file lives in the same folder as the component: `ComponentName/useComponentNameForm.ts`

## useEffect Rules

- **Never use `useEffect` unless absolutely impossible to achieve otherwise**
- For derived state: compute it inline or use Zustand computed functions
- For subscriptions/event listeners: use dedicated hooks (`useEventListener`)
- If you think you need `useEffect`, first consider: Zustand, context, computed values, or restructuring the data flow
- Acceptable uses: third-party library integration that requires imperative setup, browser APIs with no React binding, or initial data fetching on mount

---

# BACKEND ONLY

Aplica exclusivamente a `apps/backend`.

## Stack

- Express 5 (REST API)
- WebSocket (`ws` package) integrado en el mismo servidor HTTP
- TypeScript strict
- **Dev:** `tsx` como runtime + Node `--watch` nativo para hot reload (no nodemon)
- **Producción:** transpilación a JS (`tsc` → `dist/`), se ejecuta Node puro
- `tsc-alias` para resolver path aliases (`@/*`) en el output compilado
- Vitest + supertest para tests
- `debug` package para logging con colores por namespace

## Project Structure

```
apps/backend/src/
├── index.ts                # Entrypoint: starts HTTP + WS server
├── app/
│   ├── express-app.ts      # Express setup (middlewares + route mounting)
│   ├── ws.ts               # WebSocket server setup
│   └── route-logger.ts     # Prints registered routes on boot
├── api/
│   └── index.ts            # Route registry (single source of truth)
│       ├── items/          # Example: folder-per-endpoint
│       └── ws-triggers/    # Example: endpoint that broadcasts to WS clients
├── configs/
│   ├── constants.ts        # App-wide constants
│   ├── logger.ts           # debug-based logger (app:prod, app:warn, app:error, app:Debug)
│   ├── typed-envs.ts       # Final typed export of environment variables
│   └── envs/               # Environment system (see below)
│       ├── default.ts      # Base values (PORT, etc.)
│       ├── dev.ts          # Dev overrides
│       ├── prod.ts         # Prod overrides
│       ├── secrets.ts      # Local secrets (gitignored, never in prod)
│       └── index.ts        # EnvsLoader: merge + validation
├── middlewares/
│   └── general-and-small.ts  # Morgan, Helmet, CORS, JSON parser, 404, error handler
├── models/
│   └── responses.ts        # Global backend-only types
├── database/               # Reserved: DB config, ORM, queries (empty by default)
└── 3rd-party/              # Reserved: SDK integrations, external service wrappers
```

## Routing & Endpoints

### Folder-per-endpoint

Each endpoint (or group of related sub-routes) lives in its own folder under
`api/`. The folder represents an entity, feature, or logical grouping.

```
api/
├── index.ts           # Route registry — single source of truth
├── items/
│   └── controller.ts  # Simple endpoint: all in one file
└── orders/
    ├── controller.ts  # Entry point + light logic
    ├── logic.ts       # Heavy business logic, queries, transformations
    ├── constants.ts   # Scoped constants
    └── validations.ts # Input validation
```

### Route Registry

All endpoints are registered in the `routes` array of `api/index.ts`. No routes
are mounted outside this registry. The route-logger reads from this same array
to print all endpoints on boot.

```ts
const routes = [
  { path: "/items", router: itemsRouter, file: "src/api/items/controller.ts" },
];
```

### Controller Structure

- `controller.ts` is always the entry point of an endpoint folder.
- It defines the router, attaches HTTP verb handlers, and contains light logic.
- If logic grows heavy (complex transformations, multiple queries, orchestration),
  extract it to a `logic.ts` file so the controller stays readable and
  self-explanatory.
- Possible files in an endpoint folder: `controller.ts` (required), `logic.ts`,
  `validations.ts`, `constants.ts`, `helpers.ts`, sub-route folders.

### No API Versioning

This template does not use `/api/v1/` style versioning. Routes mount directly
under `/api/`. Versioning can be added per-project if needed.

## WebSocket

- WS is mounted on the same HTTP server via the `upgrade` event.
- Current implementation is **unidirectional (server → client)** for
  notifications/broadcasts. Bidirectional (client → server messages) is
  pending — to be added as a simple template when needed.
- **HTTP trigger → WS broadcast** is the established pattern: an HTTP endpoint
  can broadcast messages to all connected WS clients.

## Environment System

The env system uses a class-based merge pattern (no Zod, no `.env` files):

1. `default.ts` — base values shared across all environments (PORT, etc.)
2. `dev.ts` — development overrides (DB URLs, frontend URL, etc.)
3. `prod.ts` — production overrides (reads from `process.env` or `secrets`)
4. `secrets.ts` — local-only secrets for development (gitignored). In production,
   inject secrets via `process.env`.
5. `index.ts` — `EnvsLoader` merges default + runtime env, **validates that no
   value is undefined or empty string**, and throws on boot if something is missing.
6. `typed-envs.ts` — final export: `TYPED_ENVS` (cast to `NonUndefined<>` for
   full type safety without optional checks downstream).

Always import from `@/configs/typed-envs` — never read `process.env` directly
in application code.

## Logger

Uses the `debug` package with colored namespaces:

```ts
import { logger } from '@/configs/logger';

logger.prod('Visible in prod and dev');
logger.debug('Visible only in dev');
logger.warn('Warning');
logger.error('Error');
```

Activated via `DEBUG=app:*` (all) or selectively (`DEBUG=app:prod`). The colored
output per namespace improves DX in development. This is the permanent logging
solution.

## Middlewares

Global middlewares live in `middlewares/`. The base set for every project:
- `morgan` — HTTP request logging (dev only — pending config)
- `helmet` — security headers
- `cors` — CORS
- `express.json()` — body parser
- 404 handler + error handler

## Testing

- **Vitest + supertest** for endpoint integration tests.
- Tests are a tool for refactoring and verifying complex endpoints — not a rigid
  TDD requirement. Write tests where they add value, not as a blanket rule.
- Test files live inside `src/` co-located with what they test (pending migration
  from current `test/` location).
- Coverage available via `npm run back-coverage` (v8 provider).

## Database

The template ships **without ORM or DB** by design. Database choice varies heavily
by project (MongoDB, PostgreSQL, SQLite, Supabase, Firebase, etc.).

- `src/database/` is reserved for DB config, models, queries, and migrations.
- Each project fills this folder with its chosen stack.

## 3rd Party Integrations

- SDKs and external service wrappers live in `src/3rd-party/`.
- If a 3rd-party integration is foundational to the entire app (e.g., GraphQL
  engine, template engine, tRPC), it may deserve its own top-level folder in
  `src/` instead.

## Path Alias

- `@/*` → `src/*` is available in tsconfig for convenience.
- Use it only to shorten deeply nested imports. Relative imports are fine for
  nearby files.

## Build

- **Dev** runs TS directly via `tsx` — no build step needed.
- **Production** transpiles to `dist/` with full type validation:
  `tsc -p tsconfig.build.json && tsc-alias -p tsconfig.build.json`
- `tsc-alias` resolves path aliases (`@/*`, `shared/*`) to relative paths in
  the compiled output.
- `tsconfig.json` — dev/typecheck config (`noEmit: true`, includes shared).
- `tsconfig.build.json` — production build config (`outDir: "dist"`).

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Hot reload via native Node `--watch` + tsx |
| `npm run build` | Full transpilation to `dist/` (tsc + tsc-alias) |
| `npm run start` | Run compiled production build from `dist/` |
| `npm run prod` | Build + start in one command |
| `npm run typecheck` | Type-check only (`tsc --noEmit`, no output) |
| `npm run test` | Run tests with Vitest |
| `npm run coverage` | Tests + coverage report (v8) |
| `npm run clean` | Remove `dist/` |
