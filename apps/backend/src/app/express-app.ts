import express from "express";
import api from "../api/v1";
import * as middlewares from "../middlewares/general-and-small";
import type { MessageResponse } from "../models/responses";
import { attachHeaderMiddlewares } from "../middlewares/general-and-small";

/** Generates the main Express app with all middleware and routes configured */
function generateMainApp() {
  const app = express();

  attachHeaderMiddlewares(app);

  app.get<object, MessageResponse>("/", (req, res) => {
    res.json({
      message: "✨ Hello 👋",
    });
  });

  // -- API Routes
  app.use("/api/v1", api);

  app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);
  return { app };
}

export const { app } = generateMainApp();
