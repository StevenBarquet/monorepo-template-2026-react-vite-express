import type { Server } from "node:http";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

// 2. WS listener permanently attached to the wss instance, it handles what happens with the connected clients
wss.on("connection", (ws, req) => {
  console.log(`[WS] Client connected from ${req.socket.remoteAddress}`);
  ws.on("close", () => console.log(`[WS] Client disconnected`));
});

// 1. First, merge ws handlers into the express app to handle initial connection
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
