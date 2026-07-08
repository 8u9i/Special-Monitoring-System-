"use client";

import React from "react";
import { AuthProvider, useAuth } from "./auth-context";
import { UIProvider, useUI } from "./ui-context";
import { DataProvider, useData } from "./data-context";

function DataProviderWithToast({ children }: { children: React.ReactNode }) {
  const { toast, celebration } = useUI();
  return (
    <DataProvider showToast={toast.show} onCelebration={celebration.trigger}>
      {children}
    </DataProvider>
  );
}

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UIProvider>
        <DataProviderWithToast>
          {children}
        </DataProviderWithToast>
      </UIProvider>
    </AuthProvider>
  );
}

export { useAuth } from "./auth-context";
export { useUI } from "./ui-context";
export { useData } from "./data-context";

export function useTracker() {
  const auth = useAuth();
  const ui = useUI();
  const data = useData();
  return { ...data, ...auth, ...ui };
}
