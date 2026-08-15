import type { Response } from "express";
import type { ApiSuccessResponse, ApiErrorResponse, PaginationMeta } from "../types/api.types.js";

/**
 * Send a standardized success response.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  meta?: Record<string, unknown>,
): void {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
  res.status(statusCode).json(body);
}

/**
 * Send a standardized paginated response.
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message = "Success",
): void {
  res.status(200).json({
    success: true,
    message,
    data,
    meta: pagination,
  });
}

/**
 * Send a standardized error response.
 */
export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: Array<{ field?: string; message: string }>,
): void {
  const body: ApiErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  res.status(statusCode).json(body);
}
