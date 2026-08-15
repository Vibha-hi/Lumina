import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/apiResponse.js";
import User from "../models/User.js";

/**
 * Require a valid JWT Bearer token. Attaches `req.user` with userId and email.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    sendError(res, "Unauthorized: No authorization header provided", 401);
    return;
  }

  if (!authHeader.startsWith("Bearer ")) {
    sendError(res, "Unauthorized: Only Bearer tokens are supported", 401);
    return;
  }

  const token = authHeader.slice(7);
  if (!token) {
    sendError(res, "Unauthorized: No token provided", 401);
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (error) {
    sendError(res, "Unauthorized: Invalid or expired token", 401);
  }
}

/**
 * Optional auth middleware — attaches req.user if a valid token is present,
 * but doesn't block the request if no token is provided.
 * Used for "Try It Now" guest analysis.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const decoded = verifyToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };
    } catch {
      // Token invalid/expired — proceed as guest
    }
  }

  next();
}

/**
 * Require a valid JWT Bearer token AND admin role in database.
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, "Unauthorized: No authorization header provided", 401);
    return;
  }

  const token = authHeader.slice(7);
  if (!token) {
    sendError(res, "Unauthorized: No token provided", 401);
    return;
  }

  try {
    const decoded = verifyToken(token);

    // Check database for role
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      sendError(res, "Forbidden: Admin access required", 403);
      return;
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (error) {
    sendError(res, "Unauthorized: Invalid or expired token", 401);
  }
}
