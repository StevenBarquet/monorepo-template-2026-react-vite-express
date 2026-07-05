import express from "express";
import { WebSocket } from "ws";
import { wss } from "../../../app/ws";
import { buildNotification } from "./constants";

const router = express.Router();

router.get("/", logic);

export const wsTriggersRouter = router;

export type WsNotification = {
  id: string;
  type: "notification";
  message: string;
  timestamp: string;
};

export type TriggerOptions = {
  /** Milliseconds between each message. 0 = all sent immediately. */
  delay?: number;
  /** Number of messages to send. Default: 1. */
  count?: number;
  /** Message content. Default: "Hello from the server". */
  message?: string;
};

function logic(req: express.Request, res: express.Response, _next: express.NextFunction) {
  const opts: TriggerOptions = {
    delay: Number(req.query.delay) || 0,
    count: Number(req.query.count) || 1,
    message: (req.query.message as string) || "Hello from the server",
  };

  const result = broadcastMessages(opts);
  res.json({ triggered: true, ...result });
}

function broadcastMessages(opts: TriggerOptions) {
  const { delay = 0, count = 1 } = opts;

  const clients = [...wss.clients].filter(c => c.readyState === WebSocket.OPEN);

  if (clients.length === 0) {
    console.log(`[WS] /trigger called but no clients connected`);
    return { sent: 0, clients: 0 };
  }

  let sent = 0;
  for (let i = 0; i < count; i++) {
    const sendOne = () => {
      const payload = buildNotification(opts);
      const msg = JSON.stringify(payload);
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(msg);
        }
      }
      sent++;
      console.log(`[WS] Sent message ${sent}/${count} to ${clients.length} client(s)`);
    };

    if (delay === 0) {
      sendOne();
    } else {
      setTimeout(sendOne, delay * i);
    }
  }

  return { sent: count, clients: clients.length };
}
