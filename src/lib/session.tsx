import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { getToken, clearToken, apiGetProfile, type AuthUser } from "./api";

type Ctx = {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const SessionCtx = createContext<Ctx>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const qc = useQueryClient();

  const refreshUser = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await apiGetProfile();
      setUser(profile);
    } catch {
      // Token expired or invalid
      clearToken();
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <SessionCtx.Provider value={{ user, loading, refreshUser }}>{children}</SessionCtx.Provider>
  );
}

export const useSession = () => useContext(SessionCtx);
