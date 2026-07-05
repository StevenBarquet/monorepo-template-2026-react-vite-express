# 🖥️ Backend — Express 5 + WebSocket

> API REST y mensajes por WebSocket sobre **Express 5** con TypeScript. Trae envs
> tipadas, logger por entorno, estructura por rutas auto-montables y tests con Vitest.

<p align="left">
  <img alt="Node" src="https://img.shields.io/badge/Node-26.x-339933?logo=node.js&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white">
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white">
</p>

> Parte del [monorepo](../../README.md). Se corre desde la raíz con `npm run back`,
> o desde esta carpeta con `npm run dev`.

---

## 📑 Tabla de contenidos

1. [Qué incluye](#-qué-incluye)
2. [Estructura](#-estructura)
3. [Uso rápido](#-uso-rápido)
4. [WebSocket](#-websocket)
5. [Cómo agregar una ruta](#-cómo-agregar-una-ruta)
6. [Variables de entorno (envs tipadas)](#-variables-de-entorno-envs-tipadas)
7. [Logging](#-logging)
8. [Scripts](#-scripts)
9. [Pendientes conocidos](#-pendientes-conocidos)

---

## 🎯 Qué incluye

| Pieza                | Cómo lo resuelve                                                        |
| -------------------- | ---------------------------------------------------------------------- |
| 🛣️ Rutas             | Registro único auto-montable (`api/v1/index.ts`) + log de rutas al boot |
| 🔌 WebSocket         | Servidor WS (server → client) con endpoint para disparar mensajes       |
| 🔐 Envs tipadas      | Sistema de envs que **valida al arrancar** y expone `TYPED_ENVS`        |
| 🐛 Logging           | Logger basado en `debug`, con namespaces por nivel                     |
| 🛡️ Middlewares       | Morgan, Helmet, CORS y manejadores de error preconfigurados            |
| 🧪 Tests             | Vitest + supertest, con reporte de cobertura                           |

---

## 🗂️ Estructura

```
src/
  index.ts                  # 🚪 Entrypoint: arranca el servidor HTTP + WS
  app/
    express-app.ts          # Setup de Express con middlewares y rutas
    ws.ts                   # Factory del servidor WebSocket
    route-logger.ts         # Imprime las rutas registradas al arrancar
  api/v1/
    index.ts                # 🛣️ Registro de rutas (única fuente de verdad)
    health/                 # GET /api/v1/health (info del commit)
    items/                  # POST /api/v1/items (ejemplo de CRUD)
    ws-triggers/            # GET /api/v1/trigger (dispara mensajes WS)
  configs/
    typed-envs.ts           # Export final de las envs ya tipadas (TYPED_ENVS)
    logger.ts               # Logger basado en debug (namespaces con color)
    constants.ts            # Constantes globales
    envs/                   # Sistema de envs (default → dev/prod → secrets)
  middlewares/
    general-and-small.ts    # Morgan, Helmet, CORS, manejadores de error
  models/
    responses.ts            # Tipos de respuesta compartidos
  database/                 # Reservado: config de DB, ORM, queries
  3rd-party/                # Reservado: integraciones con SDKs
  test/                     # Tests (Vitest)
```

---

## ⚡ Uso rápido

```bash
# Desde la raíz del monorepo
npm run back        # dev server con hot reload

# O desde apps/backend
npm run dev
```

Por defecto el servidor asume el puerto **4000** (ajustable vía envs).

---

## 🔌 WebSocket

El frontend se conecta a `ws://localhost:<PORT>/ws`. La implementación actual es
**unidireccional** (server → client).

Para disparar mensajes WS:

```bash
# Un mensaje inmediato
curl "http://localhost:4000/api/v1/trigger"

# 5 mensajes con 100ms entre cada uno
curl "http://localhost:4000/api/v1/trigger?count=5&delay=100&message=hola"
```

---

## ➕ Cómo agregar una ruta

El flujo es mecánico:

1. Crea `src/api/v1/tu-ruta/controller.ts`.
2. Agrega una entrada al array `routes` en [`src/api/v1/index.ts`](src/api/v1/index.ts).
3. Listo — se monta automáticamente y aparece en el log de rutas al arrancar.

> Cuando se adapten los generadores de backend, este paso será un `npm run` (ver
> [Pendientes](#-pendientes-conocidos)).

---

## 🔐 Variables de entorno (envs tipadas)

En lugar de leer `process.env.LO_QUE_SEA` disperso y sin tipos, el backend centraliza
y **valida** las envs al arrancar.

```
default.ts       ─┐
dev.ts / prod.ts ─┤ (según NODE_ENV)   ┌─ valida que ninguna quede vacía/undefined
                  ├──► EnvsLoader ──────┤
secrets.ts       ─┘                     └─► TYPED_ENVS (tipado, sin `| undefined`)
```

- `configs/envs/default.ts` → valores comunes a todos los entornos.
- `configs/envs/dev.ts` / `prod.ts` → según `NODE_ENV`.
- `configs/envs/secrets.ts` → secretos **locales**, fuera de git (lo genera el
  `postinstall` del monorepo si no existe).
- `configs/envs/index.ts` → el `EnvsLoader` mezcla todo y **lanza error si alguna
  variable queda vacía**, para fallar rápido.

Uso:

```ts
import { TYPED_ENVS } from '@/configs/typed-envs'

console.log(TYPED_ENVS.PORT) // tipado, con autocompletado
```

---

## 🐛 Logging

Logger basado en [`debug`](https://www.npmjs.com/package/debug) en
[`src/configs/logger.ts`](src/configs/logger.ts). Los logs **solo se imprimen si la
variable `DEBUG` lo permite**.

```bash
DEBUG=app:*     npm run dev   # todos los logs
DEBUG=app:error ...           # solo errores
```

> En `npm run dev` ya viene `DEBUG=app:*`; en `npm run prod` se usa `DEBUG=app:prod`.

---

## 📜 Scripts

| Script              | Qué hace                                          |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Server con hot reload (Node `--watch` + tsx).     |
| `npm run build`     | Transpila a `dist/` (`tsc` + `tsc-alias`).        |
| `npm start`         | Ejecuta el build compilado.                       |
| `npm run prod`      | `build` + `start` (NODE_ENV=production).          |
| `npm test`          | Tests con Vitest.                                 |
| `npm run coverage`  | Tests + reporte de cobertura.                     |
| `npm run typecheck` | Type check sin emitir.                            |
| `npm run clean`     | Borra `dist/`.                                    |

> Desde la raíz del monorepo hay atajos: `back`, `back-build`, `back-prod`,
> `back-typecheck`, `back-test`, `back-coverage`.

---

## ⚠️ Pendientes conocidos

- [ ] **Generadores plop de BE.** `generators/backend/` viene del stack anterior
      (Apollo/GraphQL) y **no está adaptado** a la arquitectura Express actual.
      Reescribir para que generen `controller.ts` + entrada en el registro de rutas.
- [ ] **WebSocket bidireccional.** Agregar una implementación sencilla client → server
      como parte del template.
- [ ] **Error handler.** Estudiar y definir la estrategia final.
- [ ] **`models/responses.ts`.** Evaluar si el patrón se mantiene o se redefine.
- [ ] **Folder residual `src/config/`** (vacío) — se puede borrar.

---

## Requisitos

- Node.js `>= 26.0.0`
