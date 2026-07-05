import type { Router } from "express";
import { routes } from "../api/v1";
import { TYPED_ENVS } from "@/configs/typed-envs";
import { logger } from "@/configs/logger";

function extractMethods(router: Router): string[] {
  const stack = (router as any).stack;
  if (!stack) return ["?"];
  const methods: string[] = [];
  for (const layer of stack) {
    if (layer.route) {
      methods.push(...Object.keys(layer.route.methods).map(m => m.toUpperCase()));
    }
  }
  return methods.length ? methods : ["USE"];
}

/** Prints all registered endpoints at boot from the route registry */
export function printRoutes() {
  const baseUrl = `http://localhost:${TYPED_ENVS.PORT}`;

  logger.debug("\n--- Registered routes ---\n");
  routes.forEach((r, i) => {
    const methods = extractMethods(r.router);
    const fullPath = `/api/v1${r.path}`;
    logger.debug(`  [${i}] ${methods.join(", ")} ${fullPath}`);
    logger.debug(`      ${baseUrl}${fullPath}`);
    logger.debug(`      ${r.file}\n`);
  });
}
