# Estrategia — Template base monorepo 2026

> Documento vivo. Aquí registramos hallazgos, decisiones y el orden de ejecución
> para armar el template. Se va actualizando conforme avanzamos.
> **Archivo temporal** — se borra cuando el template esté terminado.

---

## ESTADO ACTUAL

**Avance global: ~50%** · Fase activa: **Fase 4 (Backend)** — siguiente. **Frontend concluido ✅**

| Fase | Estado |
|------|--------|
| 1 · Infra raíz (npm + Node 26) | ✅ Cubierta (scripts migrados a npm, `engines` en Node 26, `npm i` corre) |
| 2 · Frontend que levante | ✅ **Concluida** — levanta y buildea limpio; deps de build actualizadas y verificadas |
| 3 · Generadores FE | ✅ **Concluida** — probados end-to-end; plantillas adaptadas a Sass moderno |
| 4 · Backend tRPC + Express | ⬜ Pendiente (lo más grande) |
| 5 · `apps/shared` | ⬜ Pendiente |
| 6 · Generadores BE (→ tRPC) | ⬜ Pendiente |
| 7 · Docs y limpieza | ⬜ Pendiente |

**Notas resumidas:**
- El FE se armó limpiando un proyecto real ("Vivir Tekk"): de **431 → ~60 archivos**.
  Fuera negocio, Apollo/GraphQL, framer-motion, `common/forms` y branding. Quedó el
  esqueleto + design-system genérico.
- **Deps de build actualizadas** (vite 8, TS 6, sass 1.101, cssnano 8, preset-env 11…)
  y verificadas: `tsc` + `vite build` limpios, PostCSS aplicando (autoprefixer,
  cssnano, preset-env/nesting), dev server sin warnings.
- **Migración a Sass moderno**: `@import`→`@use`/`@forward`, `mix()`→`color.mix()`,
  `map-get`→`map.get`. Los mixins/variables se consumen con `@use '…' as *`, por lo
  que la invocación no cambió (`onlyIn(lg)`, `darkBackgroundGradient()` siguen igual).
- **Config build modernizada**: TS `moduleResolution: "bundler"` (sin `baseUrl`),
  Vite con resolución de paths nativa (se quitó `vite-tsconfig-paths`), `@fontsource`
  movido a `_index.scss`.
- **Generadores FE** probados (page/comp/store/hook): funcionan y compilan. `page`
  registra ruta en `AppRoutes.tsx`. Nota: `component`/`hook` requieren **ruta
  absoluta** (documentado en README). Sin agrupación de pages por defecto.
- **claude.md** reestructurado en 3 secciones (GENERAL / FRONTEND ONLY / BACKEND
  ONLY) + 3 reglas nuevas (usar generadores, verificar build antes de terminar,
  preferir sintaxis moderna).
- Fix histórico: `apps/backend/package.json` vacío rompía `npm i` → stub válido.
- Pendiente para Fase 4: **tRPC client + react-query** y **Formik + Zod** aún no
  instalados a propósito (se suman al conectar el BE). Decisión abierta menor:
  sweetalert2 se queda por ahora (podría migrar a AntD).

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

### Fase 2 — Frontend que levante y corra ⭐ ✅ CONCLUIDA
> Base: proyecto FE "Vivir Tekk" (admin de condominios) copiado y **limpiado**
> de 431 → ~60 archivos. Se eliminó todo el negocio, Apollo/GraphQL, framer-motion,
> common/forms, y branding. Queda el esqueleto + design-system genérico.
- [x] Vite + React 19 + TS operativo en `apps/frontend`.
- [x] `package.json` FE saneado: quitados `react-barcode`, `react-phone-input-2`,
      `@ant-design/v5-patch-for-react-19` (antd 6 ya soporta React 19); agregado
      `@vitejs/plugin-react`. Conservados AntD 6, Zustand, react-forge-grid,
      sweetalert2, react-helmet.
- [x] Estructura `src/` con convenciones de `claude.md` (pages, layout, common,
      providers, store, utils, styles, Router).
- [x] Providers base: `AntdProv` (ConfigProvider dark) + `ScrollToTop` + Router.
      **Borrados** `ApolloProv` y `AuthProvider` (dependían de GraphQL).
- [x] `npm run front` levanta sin errores y `npm run front-build` buildea limpio.
- [x] **Deps de build actualizadas y verificadas** (vite 8, TS 6, sass 1.101,
      cssnano 8, preset-env 11). PostCSS aplicando; dev server sin warnings.
- [x] **Migración a Sass moderno** (`@use`/`color.mix`/`map.get`) + config build
      modernizada (TS `bundler`, paths nativos de Vite, `@fontsource` en scss).
- [ ] **DIFERIDO a Fase 4**: agregar **tRPC client + @tanstack/react-query** y
      **Formik + Zod** (`zod-formik-adapter`) — se suman al conectar el BE.
- [ ] **Decisión abierta menor**: sweetalert2 se queda o migra a AntD `message`/`Modal`.

**Fix colateral**: `apps/backend/package.json` estaba en 0 bytes y rompía `npm i`
en toda la raíz (workspaces). Se le puso un `package.json` mínimo válido (stub
hasta Fase 4). Scripts raíz migrados de `yarn workspace` → `npm run ... --workspace`.

### Fase 3 — Generadores de frontend ✅ CONCLUIDA
- [x] Generadores plop de FE validados contra la estructura nueva
      (`addRoute.js` → `AppRoutes.tsx`, sin agrupación de pages por defecto).
- [x] Probados end-to-end: component, page, store, hook (generan y compilan).
- [x] Plantillas SCSS adaptadas a Sass moderno (`@use … as *`).
- [x] Bug corregido: `hook.ts.hbs` importaba `@builder.io/qwik` (residuo) → limpiado.
- Nota: generador de **form** (Formik) queda pendiente hasta integrar el stack de
  formularios (documentado en README). `component`/`hook` requieren ruta absoluta.

### ⚠️ Pendiente transversal — ESLint / linting
El proyecto trae `.eslintrc` (config del repo anterior) pero el linting **no se ha
revisado ni validado** con las versiones nuevas. **Se revisará cuando el BE esté
funcionando** (se configurará linting/formatting de forma consistente para todo el
monorepo — FE y BE — de una vez).

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
