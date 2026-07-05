import { randomUUID } from "node:crypto";
import type { WsNotification, TriggerOptions } from "./controller";

export function buildNotification(opts: TriggerOptions): WsNotification {
  const { message = "Hello from the server" } = opts;

  return {
    id: randomUUID(),
    type: "notification",
    message,
    timestamp: new Date().toISOString(),
  };
}
