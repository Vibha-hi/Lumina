import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  User,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import {
  apiLogin,
  apiSignup,
  apiVerifyEmail,
  apiResendVerification,
  apiForgotPassword,
  apiVerifyResetCode,
  apiResetPassword,
} from "@/lib/api";
import { useSession } from "@/lib/session";
import { toast, Toaster } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — LUMINA.AI" },
      {
        name: "description",
        content: "Sign in or create an account to analyze and save your posts with LUMINA.AI.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { refreshUser } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");
  const [isResending, setIsResending] = useState(false);

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<"idle" | "email" | "otp" | "newpass">("idle");
  const [resetCode, setResetCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Allow deep-linking to signup via ?mode=signup
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    if (modeParam === "signup") {
      setMode("signup");
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format before sending to backend
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await apiSignup(displayName || email.split("@")[0], email.trim(), password);
        toast.success("OTP sent to your email!");
        setOtpSent(true);
      } else {
        await apiLogin(email.trim(), password);
        toast.success("Signed in");
        await refreshUser();
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    try {
      await apiVerifyEmail(email.trim(), code);
      toast.success("Welcome to LUMINA.AI!");
      await refreshUser();
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Invalid verification code");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await apiResendVerification(email.trim());
      toast.success("Verification code resent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };



  // ── Forgot password handlers ──
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      await apiForgotPassword(email.trim());
      toast.success("Reset code sent to your email!");
      setForgotStep("otp");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetCodeVerify = async () => {
    if (resetCode.length !== 6) return;
    setLoading(true);
    try {
      const data = await apiVerifyResetCode(email.trim(), resetCode);
      setResetToken(data.resetToken);
      toast.success("Code verified!");
      setForgotStep("newpass");
    } catch (err: any) {
      toast.error(err.message || "Invalid reset code");
      setResetCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await apiResetPassword(resetToken, newPassword, confirmPassword);
      toast.success("Password reset successfully! Please sign in.");
      // Reset all forgot password state
      setForgotStep("idle");
      setResetCode("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
      setMode("signin");
      setPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetCode = async () => {
    setIsResending(true);
    try {
      await apiForgotPassword(email.trim());
      toast.success("Reset code resent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen grid place-items-center px-4 py-16 overflow-hidden">
      <Toaster theme="dark" position="top-center" />
      <div className="absolute inset-0 mesh-bg animate-gradient" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md glass-strong rounded-3xl p-8 shadow-glow"
      >
        <Link to="/" className="flex items-center gap-2.5 mb-8">
          <img src="/transparent.png.png" alt="Lumina.AI" className="h-10 w-10 object-contain" />
          <span className="font-display font-semibold text-lg">
            LUMINA<span className="gradient-text">.AI</span>
          </span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Analyze posts and access your history."
            : "Save analyses and track your digital footprint."}
        </p>



        {forgotStep === "email" ? (
          /* ── Forgot Password: Enter Email ── */
          <div className="flex flex-col items-center space-y-6 mt-4">
            <div className="h-16 w-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-2 ring-1 ring-amber-500/20 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]">
              <KeyRound className="h-8 w-8 text-amber-400" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Forgot Password</h2>
              <p className="text-zinc-400 text-sm mt-1">
                Enter your email and we'll send a reset code
              </p>
            </div>
            <form onSubmit={handleForgotSubmit} className="w-full space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-background/40 border border-glass-border outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl gradient-brand text-white font-medium shadow-glow hover:brightness-110 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send Reset Code <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
            <button
              onClick={() => {
                setForgotStep("idle");
                setEmail("");
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
            </button>
          </div>
        ) : forgotStep === "otp" ? (
          /* ── Forgot Password: Enter OTP ── */
          <div className="flex flex-col items-center space-y-6 mt-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 ring-1 ring-primary/20 shadow-[0_0_30px_-5px_rgba(216,180,226,0.3)]">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Enter Reset Code</h2>
              <p className="text-zinc-400 text-sm mt-1">
                We've sent a 6-digit code to <br />{" "}
                <span className="text-zinc-200 font-medium">{email}</span>
              </p>
            </div>

            <InputOTP
              maxLength={6}
              value={resetCode}
              onChange={setResetCode}
              disabled={loading}
              onComplete={handleResetCodeVerify}
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot
                  index={0}
                  className="w-10 h-12 text-lg border-zinc-800 bg-zinc-900/50 focus:border-primary focus:ring-primary/20 rounded-md"
                />
                <InputOTPSlot
                  index={1}
                  className="w-10 h-12 text-lg border-zinc-800 bg-zinc-900/50 focus:border-primary focus:ring-primary/20 rounded-md"
                />
                <InputOTPSlot
                  index={2}
                  className="w-10 h-12 text-lg border-zinc-800 bg-zinc-900/50 focus:border-primary focus:ring-primary/20 rounded-md"
                />
                <InputOTPSlot
                  index={3}
                  className="w-10 h-12 text-lg border-zinc-800 bg-zinc-900/50 focus:border-primary focus:ring-primary/20 rounded-md"
                />
                <InputOTPSlot
                  index={4}
                  className="w-10 h-12 text-lg border-zinc-800 bg-zinc-900/50 focus:border-primary focus:ring-primary/20 rounded-md"
                />
                <InputOTPSlot
                  index={5}
                  className="w-10 h-12 text-lg border-zinc-800 bg-zinc-900/50 focus:border-primary focus:ring-primary/20 rounded-md"
                />
              </InputOTPGroup>
            </InputOTP>

            <button
              onClick={handleResetCodeVerify}
              disabled={resetCode.length !== 6 || loading}
              className="w-full h-11 rounded-xl bg-primary text-white font-medium shadow-glow hover:bg-primary/80 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Verify Code <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 text-sm text-zinc-500 mt-4">
              <span>Didn't receive a code?</span>
              <button
                onClick={handleResendResetCode}
                disabled={isResending || loading}
                className="text-primary hover:text-primary/80 font-medium disabled:opacity-50 transition-colors flex items-center"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Sending...
                  </>
                ) : (
                  "Resend"
                )}
              </button>
            </div>

            <button
              onClick={() => {
                setForgotStep("email");
                setResetCode("");
              }}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Change email address
            </button>
          </div>
        ) : forgotStep === "newpass" ? (
          /* ── Forgot Password: Set New Password ── */
          <div className="flex flex-col items-center space-y-6 mt-4">
            <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2 ring-1 ring-emerald-500/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
              <Lock className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Set New Password</h2>
              <p className="text-zinc-400 text-sm mt-1">Enter your new password below</p>
            </div>
            <form onSubmit={handleResetPassword} className="w-full space-y-3">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (6+ characters)"
                  autoComplete="new-password"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-background/40 border border-glass-border outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className={`w-full h-11 pl-10 pr-4 rounded-xl bg-background/40 border outline-none focus:ring-4 transition-all text-sm ${confirmPassword && newPassword !== confirmPassword ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/10" : "border-glass-border focus:border-primary/60 focus:ring-primary/10"}`}
                />
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-400 pl-1">Passwords do not match</p>
              )}
              <button
                type="submit"
                disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                className="w-full h-11 rounded-xl gradient-brand text-white font-medium shadow-glow hover:brightness-110 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Reset Password <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : otpSent && mode === "signup" ? (
          <div className="flex flex-col items-center space-y-6 mt-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 ring-1 ring-primary/20 shadow-[0_0_30px_-5px_rgba(216,180,226,0.3)]">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Verify Your Email</h2>
              <p className="text-zinc-400 text-sm mt-1">
                We've sent a 6-digit code to <br />{" "}
                <span className="text-zinc-200 font-medium">{email}</span>
              </p>
            </div>

            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              disabled={loading}
              onComplete={handleVerify}
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot
                  index={0}
                  className="w-10 h-12 text-lg border-zinc-800 bg-zinc-900/50 focus:border-primary focus:ring-primary/20 rounded-md"
                />
                <InputOTPSlot
                  index={1}
                  className="w-10 h-12 text-lg border-zinc-800 bg-zinc-900/50 focus:border-primary focus:ring-primary/20 rounded-md"
                />
                <InputOTPSlot
                  index={2}
                  className="w-10 h-12 text-lg border-zinc-800 bg-zinc-900/50 focus:border-primary focus:ring-primary/20 rounded-md"
                />
                <InputOTPSlot
                  index={3}
                  className="w-10 h-12 text-lg border-zinc-800 bg-zinc-900/50 focus:border-primary focus:ring-primary/20 rounded-md"
                />
                <InputOTPSlot
                  index={4}
                  className="w-10 h-12 text-lg border-zinc-800 bg-zinc-900/50 focus:border-primary focus:ring-primary/20 rounded-md"
                />
                <InputOTPSlot
                  index={5}
                  className="w-10 h-12 text-lg border-zinc-800 bg-zinc-900/50 focus:border-primary focus:ring-primary/20 rounded-md"
                />
              </InputOTPGroup>
            </InputOTP>

            <button
              onClick={handleVerify}
              disabled={code.length !== 6 || loading}
              className="w-full h-11 rounded-xl bg-primary text-white font-medium shadow-glow hover:bg-primary/80 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Verify Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 text-sm text-zinc-500 mt-4">
              <span>Didn't receive a code?</span>
              <button
                onClick={handleResend}
                disabled={isResending || loading}
                className="text-primary hover:text-primary/80 font-medium disabled:opacity-50 transition-colors flex items-center"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Sending...
                  </>
                ) : (
                  "Resend"
                )}
              </button>
            </div>

            <button
              onClick={() => {
                setOtpSent(false);
                setCode("");
              }}
              className="text-sm text-muted-foreground hover:text-foreground mt-4"
            >
              Change email address
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={submit} className="space-y-4 mt-6">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground ml-1">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Display name"
                      autoComplete="name"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-background/40 border border-glass-border outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-background/40 border border-glass-border outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (6+ characters)"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-background/40 border border-glass-border outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl gradient-brand text-white font-medium shadow-glow hover:brightness-110 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "signin" ? "Sign in" : "Create account"}{" "}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {mode === "signin" && (
              <button
                onClick={() => {
                  setForgotStep("email");
                  setPassword("");
                }}
                className="mt-3 w-full text-sm text-muted-foreground hover:text-primary transition-colors text-center"
              >
                Forgot your password?
              </button>
            )}

            <button
              onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
              className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {mode === "signin"
                ? "New to LUMINA.AI? Create an account"
                : "Already have an account? Sign in"}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
