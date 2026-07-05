import { randomUUID } from 'node:crypto'
import express from 'express'
import { WebSocket } from 'ws'
import { wss } from '../../../app/ws'

const router = express.Router()

router.get('/', logic)

export const wsTriggersRouter = router

export type WsNotification = {
  id: string
  message: string
  timestamp: string
}

function logic(
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) {
  const sent = broadcast()
  res.json({ triggered: true, clients: sent })
}

function broadcast(): number {
  const notification: WsNotification = {
    id: randomUUID(),
    message: 'Hello from the server',
    timestamp: new Date().toISOString(),
  }
  const msg = JSON.stringify(notification)

  const openClients = [...wss.clients].filter(
    (c) => c.readyState === WebSocket.OPEN,
  )
  openClients.forEach((c) => c.send(msg))

  console.log(`[WS] Notificación enviada a ${openClients.length} cliente(s)`)
  return openClients.length
}
