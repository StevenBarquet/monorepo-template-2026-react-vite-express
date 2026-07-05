import express from "express";

import type { MessageResponse } from "../../models/responses";
import { itemsRouter } from "./items/controller";
import { wsTriggersRouter } from "./ws-triggers/controller";

const router = express.Router();

router.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

// Route registry — single source of truth for all endpoints
const routes = [
  { path: "/items", router: itemsRouter, file: "src/api/v1/items/controller.ts" },
  { path: "/trigger", router: wsTriggersRouter, file: "src/api/v1/ws-triggers/controller.ts" },
];

for (const r of routes) router.use(r.path, r.router);

export { routes };
export default router;
