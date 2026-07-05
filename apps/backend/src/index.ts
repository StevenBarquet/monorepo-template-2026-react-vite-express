import { app } from "./app/express-app";
import { attachWebSocket } from "./app/ws";
import { printRoutes } from "./app/route-logger";
import { TYPED_ENVS } from "./configs/typed-envs";
import { logger } from "./configs/logger";

// Configuración de la app de Express
const port = TYPED_ENVS.PORT || 4000;
const server = app.listen(port, () => {
  logger.prod('Logs visible solo en en prod y dev\n')
  logger.prod({ TYPED_ENVS });
  logger.prod('...Envs cargadas correctamente \n\n');
  logger.debug('Logs visibles solo en dev\n')
  printRoutes();
  console.log(`\n\nListening: http://localhost:${port}`);
  console.log(`WebSocket: ws://localhost:${port}/ws`);
});

// Configuración del servidor WebSocket
attachWebSocket(server);

// Manejo de errores del servidor
server.on("error", (err) => {
  if ("code" in err && err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Please choose another port or stop the process using it.`);
  }
  else {
    console.error("Failed to start server:", err);
  }
  process.exit(1);
});
