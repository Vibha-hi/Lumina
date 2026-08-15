// ─── Auth Request/Response Types ───────────────────────────────

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dob?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    provider: "email";
    isVerified: boolean;
    createdAt: string;
  };
}

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  dob: string | null;
  avatar_url: string | null;
  provider: "email" | "google";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  dob?: string;
  avatar_url?: string;
}
