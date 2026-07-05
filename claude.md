# Project Rules

> **Monorepo.** Este repo usa **npm workspaces** sobre **Node 26** y organiza el
> código en `apps/`:
> - `apps/frontend` — Vite + React (SPA client-side).
> - `apps/backend` — tRPC + Express (pendiente de montar, ver Fase 4).
> - `apps/shared` — código compartido entre BE y FE (workspace `@app/shared`, pendiente).
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
│   ├── backend/        # tRPC + Express (pendiente)
│   └── shared/         # @app/shared — tipos, utils, schemas compartidos (pendiente)
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
  tipos de dominio, schemas de Zod compartidos (validar en ambos lados),
  constantes y utils puros.
- Regla de dependencias: si un util de `shared` necesita una librería, esa
  librería se declara en el `package.json` de **quien consume** el util. npm
  hoistea a `node_modules` raíz; no se duplica físicamente.
- El tipo `AppRouter` de tRPC **NO** vive en shared — vive en el backend y el
  frontend lo importa como *type-only*.

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
  correr `npm run front-build` (que hace `tsc && vite build`) — o al menos
  `tsc --noEmit` + levantar el dev server — y confirmar que **no hay errores ni
  warnings** nuevos.
- No reportar un cambio como completo sin esta verificación.

## Prefer Modern Syntax

- Al tocar configs, estilos o TS, usa siempre la **API moderna vigente** de cada
  herramienta y evita sintaxis deprecada aunque "todavía funcione". Ejemplos ya
  adoptados: `@use`/`@forward` en Sass (nunca `@import`), `moduleResolution: "bundler"`
  en TS, resolución nativa de paths en Vite (sin `vite-tsconfig-paths`).

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

> ⚠️ El backend (tRPC + Express) **aún no se ha montado** (Fase 4). Esta sección se
> completará cuando se defina la arquitectura del BE: estructura de
> routers/procedures, manejo de contexto/auth, exportación del tipo `AppRouter`,
> validación con Zod, etc. Por ahora no hay convenciones de backend que seguir.
