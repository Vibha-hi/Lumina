import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthTokenPayload } from "../types/auth.types.js";

/**
 * Sign a JWT with userId and email.
 */
export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
}

/**
 * Verify and decode a JWT. Throws on invalid/expired tokens.
 */
export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}

/**
 * Generate a short-lived token for password reset (1 hour).
 */
export function signResetToken(userId: string): string {
  return jwt.sign({ userId, purpose: "password-reset" }, env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

/**
 * Verify a password reset token.
 */
export function verifyResetToken(token: string): { userId: string } {
  const decoded = jwt.verify(token, env.JWT_SECRET) as {
    userId: string;
    purpose: string;
  };
  if (decoded.purpose !== "password-reset") {
    throw new Error("Invalid token purpose");
  }
  return { userId: decoded.userId };
}
