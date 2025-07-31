"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  email: string | null;
  login: (token: string, email: string, permissions: string[]) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    setToken(cookieToken ?? null);
  }, [pathname]);

  const login = useCallback(
    (newToken: string, email: string, permissions: string[]) => {
      setToken(newToken);
      setEmail(email);
      Cookies.set("token", newToken, { expires: 1 });
      Cookies.set("userEmail", email, { expires: 1 });
      Cookies.set("permissions", JSON.stringify(permissions), { expires: 1 });
    },
    []
  );

  const logout = useCallback(() => {
    Cookies.remove("token");
    Cookies.remove("permissions");
    router.push("/login");
  }, []);

  const isLoggedIn = useMemo<boolean>(() => !!token, [token, pathname]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext<AuthContextType>(AuthContext);

  if (!context) {
    throw new Error("Component is not wrapped in AuthProvider");
  }

  return context;
}
