import type { Server } from "node:http";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

// 2. Listener de WS adjuntado permanentemente a la instancia wss, maneja lo que sucede con los clientes conectados
wss.on("connection", (ws, req) => {
  console.log(`[WS] Client connected from ${req.socket.remoteAddress}`);
  ws.on("close", () => console.log(`[WS] Client disconnected`));
});

// 1. Primero, integra los handlers de ws en la app de express para manejar la conexión inicial
export function attachWebSocket(server: Server) {
  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
    else {
      socket.destroy();
    }
  });
}

export { wss };
