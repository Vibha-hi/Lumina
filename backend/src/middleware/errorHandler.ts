import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

/**
 * Custom application error with status code.
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Global error handler middleware.
 * Must be registered after all routes.
 */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Default values
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError") {
    // Mongoose validation error
    statusCode = 400;
    message = err.message;
  } else if (err.name === "CastError") {
    // Invalid MongoDB ObjectId
    statusCode = 400;
    message = "Invalid ID format";
  } else if ((err as any).code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = "Duplicate entry. This resource already exists.";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Log error in development
  if (env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  const response: Record<string, unknown> = {
    success: false,
    message,
  };

  // Include stack trace in development mode only
  if (env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * Catch async errors in route handlers.
 * Wraps an async function and passes errors to next().
 */
export function catchAsync(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
