# Express Helper

Local server for mocking REST APIs and WebSocket messages. Built to debug frontends without depending on the real backend.

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
    gen-avails-prev/        # POST /api/v1/generateAvails/preview
    ws-triggers/            # GET /api/v1/trigger (sends WS messages)
  configs/
    env.ts                  # Environment variables validated with Zod
  middlewares/
    general-and-small.ts    # Morgan, Helmet, CORS, error handlers
  models/
    responses.ts            # Shared response types
```

## Usage

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3000` (or the port set in `.env`) and prints all available routes with verb, URL, and file on boot.

### WebSocket

The frontend connects to `ws://localhost:<PORT>/ws`. The connection is unidirectional (server -> client).

To trigger WS messages to the frontend:

```bash
# Single immediate message
curl "http://localhost:3000/api/v1/trigger"

# 10 messages with 50ms between each
curl "http://localhost:3000/api/v1/trigger?count=10&delay=50"

# With options
curl "http://localhost:3000/api/v1/trigger?prelim=true&licensee=STAR+&action=new_avail"
```

Available query params for `/trigger`:
- `count` — number of messages (default: 1)
- `delay` — ms between messages (default: 0)
- `prelim` — true/false (default: false)
- `licensee` — Disney+, STAR+, Hotstar, ESPN+, General (default: Disney+)
- `action` — new_avail, publish, reject, schedule (default: new_avail)

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to dist/ |
| `npm start` | Run the compiled build |
| `npm test` | Run tests with Vitest |
| `npm run typecheck` | Type check without compiling |
| `npm run lint` | Lint + autofix with ESLint |

## Main dependencies

| Package | Purpose |
|---------|---------|
| express 5 | HTTP framework |
| ws | WebSocket server |
| zod | Env var validation |
| helmet | Security headers |
| cors | Enable CORS |
| morgan | HTTP request logging |

## Adding new routes

1. Create a folder at `src/api/v1/your-route/controller.ts`
2. Add an entry to the `routes` array in `src/api/v1/index.ts`
3. Done — it mounts automatically and shows up in the boot log

## Requirements

- Node.js >= 24.0.0
