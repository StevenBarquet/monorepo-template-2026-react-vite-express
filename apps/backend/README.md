# Backend — Express REST API + WebSocket

Local server for REST APIs and WebSocket messages.

## Structure

```
src/
  index.ts                  # Entrypoint: starts HTTP + WS server
  app/
    express-app.ts          # Express setup with middlewares and routes
    ws.ts                   # WebSocket server factory
    route-logger.ts         # Prints registered routes on boot
  api/v1/
    index.ts                # Route registry (single source of truth)
    health/                 # GET /api/v1/health (commit info)
    items/                  # POST /api/v1/items (example CRUD)
    ws-triggers/            # GET /api/v1/trigger (sends WS messages)
  configs/
    typed-envs.ts           # Final typed export of environment variables
    logger.ts               # debug-based logger (colored namespaces)
    envs/                   # Environment system (default → dev/prod → secrets)
  middlewares/
    general-and-small.ts    # Morgan, Helmet, CORS, error handlers
  models/
    responses.ts            # Shared response types
  database/                 # Reserved: DB config, ORM, queries
  3rd-party/                # Reserved: SDK integrations
```

## Usage

```bash
npm run back        # dev server with hot reload
npm run back-build  # production build (tsc → dist/)
npm run back-prod   # build + start production
```

### WebSocket

The frontend connects to `ws://localhost:<PORT>/ws`. Current implementation is unidirectional (server → client).

To trigger WS messages:

```bash
# Single immediate message
curl "http://localhost:4000/api/v1/trigger"

# 5 messages with 100ms between each
curl "http://localhost:4000/api/v1/trigger?count=5&delay=100&message=hello"
```

## Adding new routes

1. Create a folder at `src/api/v1/your-route/controller.ts`
2. Add an entry to the `routes` array in `src/api/v1/index.ts`
3. Done — mounts automatically and shows up in the boot log

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Server with hot reload (Node --watch + tsx) |
| `npm run build` | Transpile to dist/ (tsc + tsc-alias) |
| `npm run start` | Run compiled build |
| `npm run prod` | Build + start |
| `npm test` | Run tests with Vitest |
| `npm run coverage` | Tests + coverage report |
| `npm run typecheck` | Type check without emitting |
| `npm run clean` | Remove dist/ |

## Pending

- [ ] ws-triggers: simplificar aún más el endpoint de ejemplo
- [ ] ws: agregar implementación bidireccional sencilla (client → server) como template
- [ ] morgan: configurar para que solo corra en desarrollo
- [ ] Error handler: estudiar y definir estrategia final
- [ ] Tests: migrar de `test/` a co-located dentro de `src/`
- [ ] responses.ts: evaluar si el patrón se mantiene o se redefine

## Requirements

- Node.js >= 26.0.0
