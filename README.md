# 🏗️ Monorepo Template — Vite/React + Node/Express

> Template base **limpio y actualizado** para arrancar proyectos full-stack en un
> monorepo con **npm workspaces** sobre **Node 26**.
>
> La idea es la de siempre: clonas, `npm install`, y ya tienes frontend, backend,
> código compartido, generadores de código y todo el tooling (TypeScript, ESLint,
> Prettier, git hooks) resueltos y funcionando.

<p align="left">
  <img alt="Node" src="https://img.shields.io/badge/Node-26.x-339933?logo=node.js&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white">
  <img alt="ESLint" src="https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white">
  <img alt="Prettier" src="https://img.shields.io/badge/Prettier-enabled-F7B93E?logo=prettier&logoColor=black">
</p>

---

## 📑 Tabla de contenidos

1. [¿Qué resuelve este template?](#-qué-resuelve-este-template)
2. [Estructura del monorepo](#-estructura-del-monorepo)
3. [Requisitos previos](#-requisitos-previos)
4. [Instalación (setup)](#-instalación-setup)
5. [Scripts de npm](#-scripts-de-npm)
6. [Generadores de código (plop)](#-generadores-de-código-plop)
7. [Tooling compartido (ESLint / Prettier / TS)](#-tooling-compartido-eslint--prettier--ts)
8. [Git hooks y versionado](#-git-hooks-y-versionado)
9. [Notas y pendientes conocidos](#-notas-y-pendientes-conocidos)

---

## 🎯 ¿Qué resuelve este template?

Este repo ya trae **preconfigurado y funcionando**:

| Necesidad                       | Cómo lo resuelve el template                                                    |
| ------------------------------- | ------------------------------------------------------------------------------- |
| 📦 Monorepo listo               | **npm workspaces** (`apps/*`): frontend, backend y shared con un solo `install` |
| 🎨 Frontend moderno             | **Vite 8 + React 19 + TS 6**, Ant Design, Zustand, SCSS Modules, react-router   |
| 🖥️ Backend listo                | **Express 5 + WebSocket** con TS, envs tipadas, logger y estructura por rutas   |
| 🔗 Código compartido            | Workspace **`@app/shared`** para tipos, utils y constantes entre BE y FE        |
| ⚙️ Scaffolding                  | **Generadores plop** para componentes, páginas, stores, hooks y forms (FE)      |
| 🧹 Código consistente           | **ESLint 10** (flat config, un solo archivo raíz) + **Prettier**                |
| 💻 Editor listo                 | **`.vscode/settings.json`** con format-on-save y autofix de ESLint              |
| 🏷️ Versionado automático        | **Git hook** de `post-commit` que guarda info del último commit en `shared/`    |

> **Filosofía:** es un punto de partida, no un framework. Borra lo que no uses,
> renombra lo de ejemplo y empieza a construir.

---

## 🗂️ Estructura del monorepo

```
.
├── apps/
│   ├── frontend/         # 🎨 Vite + React 19 + TS. Ver apps/frontend/README.md
│   ├── backend/          # 🖥️ Express 5 + WebSocket. Ver apps/backend/README.md
│   └── shared/           # 🔗 Workspace @app/shared (tipos, utils, constantes)
│
├── generators/
│   ├── frontend/         # Generadores plop del FE (comp, page, store, hook, form)
│   └── backend/          # Generadores plop del BE (⚠️ pendiente, ver notas)
│
├── scripts/
│   ├── preinstall/       # postinstall: instala git hooks + genera secrets
│   ├── post-commit/      # genera appVersion en apps/shared tras cada commit
│   └── utils/
│
├── eslint.config.mjs     # ESLint 10 (flat config) — GLOBAL para todas las apps
├── .prettierrc.json      # Reglas de Prettier (única fuente de verdad)
├── .prettierignore       # Qué NO formatea Prettier
├── .npmrc                # engine-strict, etc.
├── backend.dockerfile    # Imagen del backend (⚠️ revisar versión, ver notas)
└── package.json          # Workspaces + scripts raíz
```

---

## ✅ Requisitos previos

- **Node.js `26.x`** — fijado en `engines`. Si usas [`nvm`](https://github.com/nvm-sh/nvm):
  ```bash
  nvm install 26
  nvm use 26
  ```
- **npm** (viene con Node).
- **VS Code** con las extensiones **ESLint** y **Prettier** (recomendado, para
  aprovechar el `.vscode/settings.json`).

---

## 🚀 Instalación (setup)

```bash
# 1. Clona el template
git clone <url-del-repo> mi-nuevo-proyecto
cd mi-nuevo-proyecto

# 2. Instala TODOS los workspaces de una
#    El "postinstall" instala los git hooks y crea el secrets si no existe.
npm install
```

Durante `npm install`, el script `postinstall` ([`scripts/preinstall/index.mjs`](scripts/preinstall/index.mjs)):

1. Instala el **hook de `post-commit`** correcto según tu SO en `.git/hooks/`.
2. Genera el archivo de **secrets** del backend **si no existe** (está en
   `.gitignore`, no se sube al repo).

---

## 📜 Scripts de npm

Todos se corren desde la **raíz** del monorepo:

| Comando                  | Qué hace                                                       |
| ------------------------ | -------------------------------------------------------------- |
| `npm run front`          | Levanta el **frontend** (Vite dev server).                     |
| `npm run front-build`    | Build de producción del frontend.                              |
| `npm run front-prod`     | Build + preview del frontend.                                  |
| `npm run back`           | Levanta el **backend** (Express + WS, hot reload).             |
| `npm run back-build`     | Build de producción del backend.                               |
| `npm run back-prod`      | Build + start del backend.                                     |
| `npm run back-typecheck` | Type check del backend (sin emitir).                           |
| `npm run back-test`      | Tests del backend (Vitest).                                    |
| `npm run back-coverage`  | Tests + reporte de cobertura del backend.                      |

> Bajo el capó usan `npm run <script> --workspace=<app>`. Cada app tiene su propio
> `package.json` con sus scripts; los de arriba son atajos desde la raíz.

### Lint y formato (todo el monorepo)

```bash
npx eslint .           # reporta problemas en FE + BE + shared
npx eslint . --fix     # + autofix de lo arreglable
npx prettier --write . # formatea según .prettierrc.json
```

---

## ⚙️ Generadores de código (plop)

Scaffolding con [plop](https://plopjs.com/). Los del **frontend** viven en
`generators/frontend/` y se corren desde la raíz:

| Comando                 | Qué genera                                                          |
| ----------------------- | ------------------------------------------------------------------- |
| `npm run generate-comp` | Un **componente** (con o sin estilos/props) en la ruta indicada.    |
| `npm run generate-page` | Una **página** + container + estilos, y registra la ruta en `AppRoutes.tsx`. |
| `npm run generate-store`| Un **store** de Zustand (con o sin `persist`) en `src/store/`.      |
| `npm run generate-form` | Un **hook de formulario** (⚠️ pendiente, ver notas).                |

> **Rutas en `component` y `hook`:** cuando el generador pida el *path*, pega la
> **ruta ABSOLUTA** del folder destino (en VSCode: clic derecho sobre la carpeta →
> *Copy Path*). Si pegas una ruta relativa, plop la resuelve respecto al plopfile y
> el archivo cae en el lugar equivocado. `page` no necesita esto (escribe siempre
> en `src/pages/`).

Más detalle de convenciones del frontend en [`apps/frontend/README.md`](apps/frontend/README.md).

---

## 🧹 Tooling compartido (ESLint / Prettier / TS)

El linting y el formateo son **globales para todo el monorepo** — un solo archivo
de config en la raíz cubre FE, BE y shared.

### ESLint — [`eslint.config.mjs`](eslint.config.mjs)

- **Flat config** (ESLint 10). No hay `.eslintrc` ni `.eslintignore`; los ignores
  van dentro del propio archivo.
- Base **`typescript-eslint` recommended** para todo el TS (caza errores, no formatea).
- Reglas de **React** (`react-hooks`, `react-refresh`) aplicadas **solo** a
  `apps/frontend/**` — el backend no las carga.
- **`no-unused-vars`** configurado con patrón underscore: `_req`, `_next`, `_e`, etc.
  no marcan error.
- **`eslint-config-prettier`** al final: apaga las reglas de formato de ESLint para
  que **no peleen con Prettier**.

> **Filosofía:** ESLint caza *errores* (como TypeScript); Prettier *formatea*. Cada
> uno en su carril, sin pisarse.

### Prettier — [`.prettierrc.json`](.prettierrc.json)

Comillas simples, sin punto y coma, `trailingComma: all`, `tabWidth: 2`,
`endOfLine: lf`. Un único archivo de config en la raíz.

### VS Code — [`.vscode/settings.json`](.vscode/settings.json)

Este archivo **se versiona** (para que la DX sea igual en cualquier clon):

- **Format-on-save** con Prettier + **autofix de ESLint** al guardar (js/ts/jsx/tsx).
- Requiere las extensiones `esbenp.prettier-vscode` y `dbaeumer.vscode-eslint`.

#### Requisitos para que funcione en otra PC

1. **Node 26 activo** al abrir VSCode. La extensión de ESLint usa el `node` del PATH
   y ESLint 10 exige Node ≥ 22. Usa el [`.nvmrc`](.nvmrc): `nvm use` **antes** de
   abrir el editor (o ten Node 26 como default global).
2. **`prettier` instalado** (`npm install` lo trae). La extensión moderna
   (`esbenp` v10+) **no lo trae embebido**: sin el paquete en `node_modules`, el
   format-on-save falla **en silencio**.

#### Si al guardar no formatea/lintea (debug rápido)

- **Recarga la ventana:** `Ctrl/Cmd+Shift+P` → *Developer: Reload Window*.
- **Verifica por CLI** que la config está bien (aísla el problema al editor):
  ```bash
  npx eslint .            # ¿ESLint funciona fuera de VSCode?
  npx prettier --check .  # ¿Prettier lee el .prettierrc.json?
  ```
  Si el CLI funciona pero el editor no → es la integración VSCode (Node en PATH,
  extensión sin `prettier` local, o falta recargar). Revisa `Output › ESLint` y
  `Output › Prettier` en VSCode.

---

## 🔗 Git hooks y versionado

El hook de **`post-commit`** (instalado por el `postinstall`) corre tras cada commit
y regenera un archivo `appVersion` en `apps/shared/` con hash, mensaje, fecha, autor
y rama del último commit — útil para exponer un endpoint de versión (el backend ya
tiene un `GET /api/v1/health` que lo consume).

---

## ⚠️ Notas y pendientes conocidos

- **Generadores de backend pendientes.** `generators/backend/` viene del proyecto
  anterior (Apollo/GraphQL) y **aún no está adaptado** al backend Express actual.
  No lo uses tal cual todavía.
- **Generador de formularios (`generate-form`) pendiente.** Sigue adaptado al stack
  anterior (`zod-formik-adapter`) y las deps de forms no están instaladas en el FE.
  Ver [`apps/frontend/README.md`](apps/frontend/README.md).
- **`backend.dockerfile`** puede necesitar ajuste de versión de imagen base para
  alinearse con Node 26. Revísalo antes de contenerizar.
- **Valores de ejemplo por todos lados.** Renombra los placeholders (nombres de app,
  secrets de ejemplo, etc.) a lo que tu proyecto necesite.
- **Pendientes específicos del backend** (WebSocket bidireccional, error handler,
  etc.) están listados en [`apps/backend/README.md`](apps/backend/README.md).

---

<p align="center"><sub>Monorepo template · Vite/React + Node/Express · mantenlo limpio 🧼</sub></p>
