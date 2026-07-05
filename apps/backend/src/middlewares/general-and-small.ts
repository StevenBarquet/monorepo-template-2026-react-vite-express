import { TYPED_ENVS } from "../configs/typed-envs";
import type { ErrorResponse } from "../models/responses";
import type { Express, NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

/** Attaches small initial middlewares to the Express app */
export function attachHeaderMiddlewares(app: Express) {
  if (TYPED_ENVS.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
}

/** Handles 404 errors */
export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/** Handles errors that occur during request processing */
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, _next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: TYPED_ENVS.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
