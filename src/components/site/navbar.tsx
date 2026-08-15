import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Sparkles, Moon, Sun, Menu, X, LayoutDashboard, LogIn, Settings, Mail, LogOut, User, Scale } from "lucide-react";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiLogout } from "@/lib/api";
import { SettingsDialog } from "./SettingsDialog";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/features" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Extension", to: "/extension" },
] as const;

export function Navbar() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 30));

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-6 inset-x-0 z-50 transition-all duration-300 flex justify-center pointer-events-none px-4",
      )}
    >
      <div className={cn(
        "pointer-events-auto flex items-center justify-between h-14 px-6 rounded-full border transition-all duration-300 w-full max-w-4xl",
        solid ? "glass-strong border-glass-border shadow-soft" : "bg-white/40 backdrop-blur-xl border-white/40 shadow-sm"
      )}>
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative h-9 w-9 rounded-xl gradient-brand grid place-items-center shadow-glow">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold tracking-tight text-base sm:text-lg">
            LUMINA<span className="gradient-text">.AI</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "px-3 py-2 text-sm rounded-lg transition-colors",
                pathname === n.to
                  ? "text-foreground bg-white/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/compare"
                className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-lg glass text-sm font-medium hover:shadow-glow hover:bg-white/5 transition-all"
              >
                <Scale className="h-4 w-4" /> Compare
              </Link>
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-lg gradient-brand text-white text-sm font-medium shadow-glow hover:brightness-110 transition-all"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-9 w-9 rounded-full overflow-hidden border border-white/10 hover:border-white/20 transition-all outline-none">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={user.avatar_url || ""} />
                      <AvatarFallback className="bg-white/5 text-sm">{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-strong border-glass-border">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/5" onSelect={() => setIsSettingsOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 hover:bg-red-400/10 hover:text-red-300 focus:bg-red-400/10 focus:text-red-300"
                    onClick={() => { apiLogout(); window.location.href = '/'; }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth"
                className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-lg gradient-brand text-white text-sm font-medium shadow-glow hover:brightness-110 transition-all"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
            </div>
          )}
          <button
            className="lg:hidden h-9 w-9 rounded-lg glass grid place-items-center"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass-strong border-t border-glass-border px-4 py-3 flex flex-col">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/compare"
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Compare
            </Link>
          )}
          <Link
            to={user ? "/dashboard" : "/auth"}
            onClick={() => setOpen(false)}
            className="mt-2 py-2 text-sm font-medium text-primary"
          >
            {user ? "Dashboard →" : "Sign in →"}
          </Link>
        </div>
      )}
      <SettingsDialog isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </motion.header>
  );
}
