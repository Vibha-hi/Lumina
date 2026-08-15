import type { Request, Response, NextFunction } from "express";
import type { ZodSchema, ZodError } from "zod";
import { sendError } from "../utils/apiResponse.js";

/**
 * Generic Zod validation middleware factory.
 * Validates `req.body` against the provided schema.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      sendError(res, "Validation failed", 400, errors);
      return;
    }

    // Replace body with parsed (and transformed) data
    req.body = result.data;
    next();
  };
}

/**
 * Validate query parameters against a Zod schema.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      sendError(res, "Invalid query parameters", 400, errors);
      return;
    }

    req.query = result.data;
    next();
  };
}

/**
 * Format Zod validation errors into a clean array.
 */
function formatZodErrors(error: ZodError): Array<{ field?: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || undefined,
    message: issue.message,
  }));
}
