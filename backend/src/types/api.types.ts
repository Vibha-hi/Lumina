// ─── Standard API Response Envelope ────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: any;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
  stack?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Pagination ────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  meta: PaginationMeta;
}

// ─── Request Extensions ────────────────────────────────────────

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface User extends AuthenticatedUser {}
  }
}
