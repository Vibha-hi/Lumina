/**
 * Centralized API client for communicating with the Express backend.
 * All requests go through this module so JWT tokens are attached automatically.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "lumina_token";

// ─── Token helpers ─────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Generic fetch wrapper ─────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const json = await res.json().catch(() => ({
    success: false,
    message: "Failed to parse server response",
    data: null,
  }));

  if (!res.ok) {
    const msg = json?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return json as ApiResponse<T>;
}

// ─── Auth ──────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  provider: string;
  role: "user" | "admin";
  isVerified: boolean;
  createdAt: string;
}

export interface AuthData {
  token: string;
  user: AuthUser;
}

export async function apiSignup(name: string, email: string, password: string, dob?: string) {
  const res = await request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password, dob }),
  });
  // Signup now triggers OTP, it does NOT log you in.
  return res;
}

export async function apiLogin(email: string, password: string) {
  const res = await request<AuthData>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(res.data.token);
  return res.data;
}

export function apiLogout() {
  clearToken();
}

export async function apiVerifyEmail(email: string, code: string) {
  const res = await request<{ token?: string }>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
  if (res.data && res.data.token) {
    setToken(res.data.token);
  }
  return res.data;
}

export async function apiResendVerification(email: string) {
  const res = await request("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return res.data;
}

// ─── Forgot / Reset Password ──────────────────────────────────

export async function apiForgotPassword(email: string) {
  const res = await request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return res;
}

export async function apiVerifyResetCode(email: string, code: string) {
  const res = await request<{ resetToken: string }>("/auth/verify-reset-code", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
  return res.data;
}

export async function apiResetPassword(token: string, password: string, confirmPassword: string) {
  const res = await request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password, confirmPassword }),
  });
  return res;
}

// ─── Analysis ──────────────────────────────────────────────────

export interface RewriteVariant {
  tone: string;
  label: string;
  text: string;
}

export interface LuminaAnalysis {
  overall_risk: number;
  privacy_risk: number;
  professional_risk: number;
  misunderstanding_risk: number;
  legal_risk: number;
  reach_potential: number;
  emotions: { emotion: string; value: number }[];
  personas: {
    name: string;
    risk: number;
    tone: "success" | "warning" | "danger";
    comment: string;
    avatar: string;
  }[];
  risky_phrases: { phrase: string; reason: string; suggestion: string }[];
  rewrite: string;
  rewrite_variants?: RewriteVariant[];
  summary: string;
  misunderstanding_breakdown?: string;
  grammar_fixes?: { original: string; corrected: string; explanation: string }[];
}

export interface AnalyzeResult {
  id: string;
  analysis: LuminaAnalysis;
}

export async function apiAnalyze(text: string, platform: string) {
  const res = await request<AnalyzeResult>("/analyze", {
    method: "POST",
    body: JSON.stringify({ text, platform }),
  });
  return res.data;
}

export interface CompareResult {
  id?: string;
  winner: "A" | "B";
  winner_reasoning: string;
  draft_a: LuminaAnalysis;
  draft_b: LuminaAnalysis;
}

export async function apiCompare(draftA: string, draftB: string, platform: string) {
  const res = await request<CompareResult>("/analyze/compare", {
    method: "POST",
    body: JSON.stringify({ draftA, draftB, platform }),
  });
  return res.data;
}

export async function apiAnalyzeGuest(text: string, platform: string) {
  const res = await request<{ analysis: LuminaAnalysis }>("/analyze/guest", {
    method: "POST",
    body: JSON.stringify({ text, platform }),
  });
  return res.data;
}

// ─── History ───────────────────────────────────────────────────

export interface HistoryItem {
  _id: string;
  id: string;
  platform: string;
  inputText: string;
  overallRisk: number;
  privacyRisk: number;
  professionalRisk: number;
  misunderstandingRisk: number;
  legalRisk: number;
  reachPotential: number;
  emotions: { emotion: string; value: number }[];
  personas: {
    name: string;
    risk: number;
    tone: "success" | "warning" | "danger";
    comment: string;
    avatar: string;
  }[];
  riskyPhrases: { phrase: string; reason: string; suggestion: string }[];
  rewrite: string | null;
  rewriteVariants: RewriteVariant[] | Record<string, string>;
  summary: string | null;
  misunderstanding_breakdown?: string | null;
  grammarIssues?: { type: string; original: string; suggestion: string; explanation: string }[];
  createdAt: string;
  contentType?: string;
}

export async function apiListHistory() {
  const res = await request<HistoryItem[]>("/history");
  return res.data;
}

export async function apiDeleteHistory(id: string) {
  await request(`/history/${id}`, { method: "DELETE" });
}

export interface SavedComparison {
  _id: string;
  id: string;
  platform: string;
  draftA: string;
  draftB: string;
  winner: "A" | "B";
  winnerReasoning: string;
  analysisA: LuminaAnalysis;
  analysisB: LuminaAnalysis;
  createdAt: string;
}

export async function apiListComparisons() {
  const res = await request<SavedComparison[]>("/analyze/compare");
  return res.data;
}

export async function apiDeleteComparison(id: string) {
  await request(`/analyze/compare/${id}`, { method: "DELETE" });
}

// ─── Profile ───────────────────────────────────────────────────

export async function apiGetProfile() {
  const res = await request<AuthUser>("/profile");
  return res.data;
}

export async function apiUpdateProfile(name?: string, email?: string) {
  const res = await request<AuthUser>("/profile", {
    method: "PUT",
    body: JSON.stringify({ name, email }),
  });
  return res.data;
}

export async function apiDeleteAccount() {
  await request("/profile", { method: "DELETE" });
}

// ─── Feedback ──────────────────────────────────────────────────

export async function apiFeedback(name: string, email: string, message: string) {
  const res = await request<{ id: string }>("/feedback", {
    method: "POST",
    body: JSON.stringify({ name, email, message }),
  });
  return res.data;
}

// ─── Admin ─────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalAnalyses: number;
  totalFeedback: number;
  analysesLast7Days: number;
  guestUsersCount: number;
  platformBreakdown: { platform: string; count: number }[];
  tokenUsage: {
    total: number;
    byProvider: { providerKey: string; tokens: number }[];
  };
}

export interface AdminHistoryResponse {
  analyses: {
    _id: string;
    id: string;
    platform: string;
    inputText: string;
    source?: string;
    overallRisk: number;
    privacyRisk?: number;
    professionalRisk?: number;
    legalRisk?: number;
    misunderstandingRisk?: number;
    summary?: string;
    rewrite?: string;
    riskyPhrases?: { phrase: string; reason: string; suggestion: string }[];
    createdAt: string;
    tokensUsed: number;
    providerKey: string;
    userId: { name: string; email: string };
  }[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function apiGetAdminStats() {
  const res = await request<AdminStats>("/admin/stats");
  return res.data;
}

export async function apiGetAdminHistory(page: number = 1, limit: number = 50) {
  const res = await request<AdminHistoryResponse>(`/admin/history?page=${page}&limit=${limit}`);
  return res.data;
}

export async function apiDeleteAdminAnalysis(id: string) {
  await request(`/admin/analysis/${id}`, { method: "DELETE" });
}

export interface AdminUsersResponse {
  users: {
    _id: string;
    name: string;
    email: string;
    provider: string;
    isVerified: boolean;
    createdAt: string;
  }[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function apiGetAdminUsers(page: number = 1, limit: number = 50) {
  const res = await request<AdminUsersResponse>(`/admin/users?page=${page}&limit=${limit}`);
  return res.data;
}

export async function apiGetAdminUserHistory(userId: string, page: number = 1, limit: number = 50) {
  const res = await request<AdminHistoryResponse>(`/admin/users/${userId}/history?page=${page}&limit=${limit}`);
  return res.data;
}
