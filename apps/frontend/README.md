# 🎨 Frontend — Vite + React 19

> SPA sobre **Vite 8 + React 19 + TypeScript**, con Ant Design, Zustand,
> SCSS Modules y react-router. Estructura y convenciones listas, con generadores
> plop para no escribir boilerplate.

<p align="left">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white">
  <img alt="Ant Design" src="https://img.shields.io/badge/Ant%20Design-6-0170FE?logo=antdesign&logoColor=white">
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-5-000000">
</p>

> Parte del [monorepo](../../README.md). Se corre desde la raíz con `npm run front`,
> o desde esta carpeta con `npm run dev`.

---

## 📑 Tabla de contenidos

1. [Qué incluye](#-qué-incluye)
2. [Estructura](#-estructura)
3. [Uso rápido](#-uso-rápido)
4. [Convenciones](#-convenciones)
5. [Generadores (plop)](#-generadores-plop)
6. [Paths absolutos y estilos](#-paths-absolutos-y-estilos)
7. [Scripts](#-scripts)
8. [Pendientes conocidos](#-pendientes-conocidos)

---

## 🎯 Qué incluye

| Pieza             | Detalle                                                             |
| ----------------- | ------------------------------------------------------------------- |
| ⚡ Build           | **Vite 8** + `@vitejs/plugin-react` + PostCSS (autoprefixer, cssnano, preset-env) |
| 🎨 UI             | **Ant Design 6** (ConfigProvider en modo dark vía `AntdProv`)       |
| 🗃️ Estado         | **Zustand 5** (con `devtools` + `persist`)                          |
| 🧭 Ruteo          | **react-router** con rutas centralizadas en `Router/AppRoutes.tsx`  |
| 💅 Estilos        | **SCSS moderno** (`@use`/`color.mix`/`map.get`) + SCSS Modules      |
| 🧩 Design system  | Componentes comunes genéricos (modales, listas, tooltips, etc.)     |

---

## 🗂️ Estructura

```
src/
  main.tsx                # 🚪 Entrypoint: monta <App /> + estilos globales
  App.tsx                 # Compone GlobalProviders + Router
  appConfig/              # Config de la app (helmet, metadata, etc.)
  providers/
    GlobalProviders.tsx   # Agrupa router + theming (aquí irá tRPC/react-query)
    AntdProv/             # ConfigProvider de Ant Design (tema dark)
    ScrollToTop/          # Scroll al top en cada navegación
  Router/
    Router.tsx            # Router raíz
    AppRoutes.tsx         # 🧭 Registro de rutas (lo actualiza el generador `page`)
  pages/                  # Páginas (planas, sin agrupar por defecto)
    Home/  Page404/
  common/                 # 🧩 Design system: componentes reutilizables
  layout/                 # Piezas de layout (loaders, pantallas de carga)
  store/                  # Stores de Zustand (appInfo, preferences)
  styles/                 # SCSS global: variables, mixins, tema, utils
  utils/
    constants/            # Constantes (incluye frontend-envs)
    functions/            # Helpers (responsive, alerts, store, etc.)
    hooks/                # Hooks genéricos (useBoolean, useCopyToClipboard, ...)
  assets/                 # Estáticos
```

---

## ⚡ Uso rápido

```bash
# Desde la raíz del monorepo
npm run front        # dev server de Vite

# O desde apps/frontend
npm run dev
```

---

## 📐 Convenciones

- **Componentes** en su propia carpeta (`Componente/Componente.tsx` + estilos).
  El design system genérico vive en `src/common/`.
- **Páginas** planas en `src/pages/` (ver [agrupación](#agrupación-de-páginas)).
- **Stores** de Zustand en `src/store/`, uno por dominio.
- **Providers globales** se agregan dentro de `providers/GlobalProviders.tsx`.
- **Rutas** centralizadas en `Router/AppRoutes.tsx` (el generador `page` las registra solo).

> Usa los **generadores** siempre que puedas: mantienen la estructura y el estilo
> consistentes sin copiar-pegar.

---

## ⚙️ Generadores (plop)

Se corren **desde la raíz** del monorepo:

| Comando                  | Qué genera                                                        |
| ------------------------ | ----------------------------------------------------------------- |
| `npm run generate-comp`  | Un **componente** (con o sin estilos/props) en la ruta indicada.  |
| `npm run generate-page`  | Una **página** + container + estilos, y registra la ruta en `AppRoutes.tsx`. |
| `npm run generate-store` | Un **store** de Zustand (con o sin `persist`).                    |
| `npm run generate-form`  | Un **hook de formulario** (⚠️ pendiente, ver notas).              |

> **Rutas en `component` y `hook`:** cuando el generador pida el *path*, pega la
> **ruta ABSOLUTA** del folder destino (clic derecho sobre la carpeta → *Copy Path*).
> Una ruta relativa se resuelve respecto al plopfile y el archivo cae mal. `page`
> no necesita esto (escribe siempre en `src/pages/`).

### Agrupación de páginas

Por defecto el template **NO agrupa** las páginas: viven planas en `src/pages/`.
La agrupación por sección (`Landing/`, `Admin/`, `User/`, `Auth/`) solo tiene sentido
cuando la app crece mucho. En `generators/frontend/plopfile-page.js` se deja comentada
la variante con agrupación por si se necesita más adelante.

---

## 🧭 Paths absolutos y estilos

- **Paths absolutos:** importa con `src/*` en vez de `../../../` (mapeado en
  `tsconfig.json` y resuelto nativamente por Vite):
  ```ts
  import { useBoolean } from 'src/utils/hooks/useBoolean'
  ```
- **SCSS moderno:** los mixins/variables se consumen con `@use '...' as *`, así que
  la invocación no cambia (`onlyIn(lg)`, etc.). Estilos globales en `src/styles/`.

---

## 📜 Scripts

| Script            | Qué hace                                         |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Dev server de Vite.                              |
| `npm run build`   | Type check (`tsc`) + build de producción (Vite). |
| `npm run preview` | `build` + sirve el build localmente.             |
| `npm run prod`    | Alias de `preview`.                              |

> Desde la raíz del monorepo: `front`, `front-build`, `front-prod`.

---

## ⚠️ Pendientes conocidos

- [ ] **Cliente tRPC + React Query.** `GlobalProviders.tsx` está listo para recibir
      el provider cuando se conecte el backend; aún no está instalado.
- [ ] **Generador de formularios (`generate-form`).** Sigue adaptado al stack anterior
      (`zod-formik-adapter`) y las deps de forms (`formik`, `zod`, `zod-formik-adapter`)
      **no** están instaladas. Se adaptará al agregar el stack de formularios.
- [ ] **`sweetalert2`.** Decisión abierta: se queda o migra a `message`/`Modal` de AntD.
