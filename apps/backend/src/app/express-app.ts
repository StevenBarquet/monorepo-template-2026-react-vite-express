import express from "express";
import { apiRouter } from "../api/v1";
import * as middlewares from "../middlewares/general-and-small";
import type { MessageResponse } from "../models/responses";
import { attachHeaderMiddlewares } from "../middlewares/general-and-small";

/** Genera la app principal de Express con todos los middlewares y rutas configurados */
function generateMainApp() {
  const app = express();

  attachHeaderMiddlewares(app);

  app.get<object, MessageResponse>("/", (req, res) => {
    res.json({
      message: "✨ Hello 👋",
    });
  });

  // -- Rutas de la API
  app.use("/api/v1", apiRouter);

  app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);
  return { app };
}

export const { app } = generateMainApp();
