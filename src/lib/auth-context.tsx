"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { api } from "./api";

interface AuthState {
  checked: boolean;
  authenticated: boolean;
  user: string | null;
}

interface AuthContextType {
  auth: AuthState;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ checked: false, authenticated: false, user: null });

  const doLogin = useCallback(async (username: string, password: string) => {
    try {
      await api("POST", "/login", { username, password });
      setAuth({ checked: true, authenticated: true, user: username });
      return { success: true };
    } catch (err) {
      console.error("doLogin error:", err);
      return { success: false, error: "بيانات الدخول غير صحيحة" };
    }
  }, []);

  const doLogout = useCallback(async () => {
    await api("POST", "/logout").catch((err) => console.error("doLogout error:", err));
    setAuth({ checked: true, authenticated: false, user: null });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login: doLogin, logout: doLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
