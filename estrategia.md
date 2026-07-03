# Estrategia — Template base monorepo 2026

> Documento vivo. Aquí registramos hallazgos, decisiones y el orden de ejecución
> para armar el template. Se va actualizando conforme avanzamos.
> **Archivo temporal** — se borra cuando el template esté terminado.

---

## 0. Objetivo

Construir un **template base actualizado y neutro** (monorepo) para arrancar
proyectos nuevos rápido:

- **Frontend**: Vite + React con las herramientas base preferidas.
- **Backend**: tRPC + Express, muy básico.
- **Shared**: sección de código compartido (tipos, utils, schemas) entre BE y FE.
- **Generadores (plop)**: scaffolding de componentes, páginas, stores, forms, hooks
  (FE) y routers/procedures (BE).
- **Infra de monorepo**: workspaces, scripts, git hooks, versionado por commit.

---

## 1. Estado actual del repo (hallazgos)

El repo **no está vacío**: trae andamiaje raíz reutilizable, pero **las dos apps
(`apps/backend`, `apps/frontend`) tienen `package.json` de 0 bytes**.

### Reutilizable tal cual (infra de monorepo)
- `package.json` raíz — workspaces (`apps/*`) + scripts (`front`, `back`, `generate-*`).
- `scripts/preinstall/` — postinstall: instala git hook `post-commit` (según SO) y
  genera `secrets.ts` si no existe.
- `scripts/post-commit/` — genera `apps/shared/appVersion.ts` con info del último commit.
- `generators/frontend/` — generadores plop: componentes, páginas, stores, forms, hooks.
- Config base: `.prettierrc.json`, `.npmrc`, `.gitignore`.
- `backend.dockerfile` — imagen node:20-alpine (trae Prisma; se ajustará).

### ⚠️ Deuda a corregir: 3 stacks mezclados de proyectos previos
| Fuente | Stack que describe hoy | Destino |
|--------|------------------------|---------|
| `claude.md` | SPA chat AI: Supabase + OpenAI + AntD + Formik/Yup + Zustand + SCSS, branding "Vivir Tek" | Adaptar a template neutro (conservar convenciones) |
| `generators/backend/` | Apollo Server + GraphQL + Prisma | Reescribir a tRPC (fase final) |
| `generators/frontend/hooks/` | Apollo Client (`gql`, `useQuery`) | Reescribir a tRPC + React Query |
| `backend.dockerfile` | Prisma + Postgres, branding "vivir-tekk" | Simplificar (sin ORM por ahora) |

La **infra del monorepo es buena**; lo que se rehace es la **capa de datos**
(GraphQL/Apollo → tRPC) y la **limpieza de branding/stack viejo**.

---

## 2. Decisiones tomadas

| Tema | Decisión |
|------|----------|
| **Gestor de paquetes** | **npm** (npm workspaces) sobre **Node 26**. Sin migración grande: solo lo mínimo para que corra con npm (ajustar scripts `front/back/generate-*` que hoy usan `yarn workspace`). |
| **Runtime** | **Node 26.** Fijar en `engines` (`package.json`) y en el dockerfile. |
| **Backend — capa de datos** | **Sin ORM / in-memory**. tRPC + Express lo más básico, con datos mock. DB se agrega después por proyecto. |
| **Frontend — herramientas base** | Ant Design 5 · Zustand (devtools+persist) · tRPC client + @tanstack/react-query · Formik + Zod (`zod-formik-adapter`) · SCSS Modules · react-router-dom. *(El usuario pasará más contexto de sus repos FE recientes que usaremos de base.)* |
| **Generadores backend** | **Dejar para el final.** Primero FE corriendo → arquitectura BE → al final corregir generadores BE (es lo más desactualizado). |
| **`apps/shared`** | **Opción B — workspace real `@app/shared`.** `package.json` propio con `exports`, consumido como dependencia por BE/FE. Concuerda con que el post-commit ya escribe en `apps/shared/`. |
| **`claude.md`** | Adaptar, no tirar. Conservar convenciones (componentes, SCSS, stores, forms, TS). Quitar branding "Vivir Tek" y bajar Supabase/OpenAI a opcionales. Añadir sección monorepo + tRPC + shared. |

### Contexto adicional del usuario
- Tiene **repos FE recientes** (React+Vite, no monorepo) que usaremos de base para el frontend.
- El **BE es lo más desactualizado**; recibirá los cambios más grandes.
- `claude.md` viene de un repo FE decente con los constraints que le gustan; solo
  necesita ajustes (no era monorepo).

### `apps/shared` — workspace real `@app/shared` (decidido)
Sección para código compartido entre BE y FE (tipos, utils, schemas Zod, constantes),
montada como **workspace real**: `package.json` propio con `exports`, consumido como
dependencia (`"@app/shared": "*"`). Sin build step si es solo tipos + utils puros.

Regla de dependencias: *si un util necesita una librería, se declara en el
`package.json` de quien lo consume* — npm hoistea a `node_modules` raíz, no se duplica
físicamente; el `package.json` solo declara la dependencia real.

**Nota tRPC importante**: el tipo `AppRouter` **vive en el BE**, no en shared. El FE
lo importa como *type-only*. En `shared` van tipos de dominio, constantes, schemas Zod
compartidos (validar en ambos lados) y utils puros.

---

## 3. Orden de ejecución (fases)

### Fase 1 — Saneamiento mínimo de infra raíz
> Sin migración grande: solo lo indispensable para que corra con npm + Node 26.
- [ ] Ajustar scripts `front/back/generate-*` que usan `yarn workspace` → equivalente npm.
- [ ] Fijar Node 26 en `engines` (raíz) y confirmar `.npmrc`.
- [ ] Confirmar que postinstall (git hooks + secrets) funciona con npm.
- [ ] Decidir destino de `secrets.ts` (hoy apunta a `apps/backend/src/config/envs/`).

### Fase 2 — Frontend que levante y corra ⭐ (prioridad)
- [ ] Scaffold Vite + React + TS en `apps/frontend` (base: repos FE recientes del usuario).
- [ ] `package.json` del FE con herramientas base: AntD 5, Zustand, tRPC client +
      react-query, Formik + Zod, SCSS Modules, react-router-dom.
- [ ] Estructura `src/` según convenciones de `claude.md` (pages, layout, common,
      providers, store, utils, styles).
- [ ] Providers base (AntD ConfigProvider, router, react-query/tRPC client).
- [ ] Verificar: `npm run front` levanta sin errores.

### Fase 3 — Generadores de frontend
- [ ] Validar/ajustar generadores plop de FE contra la estructura nueva
      (rutas de `addRoute.js`, paths de `pages/`, `store/`, etc.).
- [ ] Probar cada generador: component, page, store, form, hook.

### Fase 4 — Arquitectura del backend (tRPC + Express)
- [ ] Scaffold `apps/backend`: Express + tRPC adapter, TS, tsx para dev.
- [ ] `package.json` del BE.
- [ ] Estructura de routers/procedures (in-memory / mock).
- [ ] Exportar `AppRouter` (type) para consumo del FE.
- [ ] Conectar cliente tRPC del FE al BE (end-to-end type-safe funcionando).
- [ ] Simplificar `backend.dockerfile` (quitar Prisma por ahora).

### Fase 5 — `apps/shared` (workspace real `@app/shared`)
- [ ] Montar workspace `@app/shared`: `package.json` + `exports` + `tsconfig`.
- [ ] Poblar con tipos de dominio, schemas Zod, utils, constantes.
- [ ] Cablear paths/exports en BE y FE.
- [ ] Reubicar `appVersion.ts` (hoy el post-commit lo escribe en `apps/shared/`).

### Fase 6 — Generadores de backend (reescritura a tRPC)
- [ ] Reescribir generadores plop de BE: GraphQL/Apollo → routers/procedures tRPC.
- [ ] Reescribir hooks FE generados: Apollo Client → tRPC + react-query.
- [ ] Probar generación end-to-end (BE procedure + FE hook).

### Fase 7 — Documentación y limpieza final
- [ ] Adaptar `claude.md` a template neutro (ver §2).
- [ ] `README.md` del template (cómo arrancar, scripts, generadores).
- [ ] Limpiar branding "Vivir Tek"/"vivir-tekk" en todo el repo.
- [ ] Borrar este `estrategia.md`.

---

## 4. Notas / preguntas abiertas
- Confirmar dev runner del BE (tsx vs ts-node-dev) al llegar a Fase 4.
- ¿Puerto del BE? El dockerfile asume 4000.
- Dockerfile: subir base de `node:20-alpine` → `node:26-alpine` (Fase 4).
- El usuario pasará más contexto y repos FE base antes/durante Fase 2.
