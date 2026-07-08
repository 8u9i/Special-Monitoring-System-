"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import type { Student, Stage } from "./types";

interface ToastState {
  message: string;
  type: "success" | "error";
}

interface ConfirmState {
  open: boolean;
  message: string;
  onConfirm: (() => void) | null;
}

interface CelebrationState {
  show: boolean;
  student: Student | null;
  stage: Stage | null;
}

interface UIContextType {
  toast: { message: string; type: "success" | "error"; show: (msg: string, type?: "success" | "error") => void };
  confirm: { open: boolean; message: string; onConfirm: (() => void) | null; ask: (msg: string, fn: () => void) => void; close: () => void };
  celebration: { show: boolean; student: Student | null; stage: Stage | null; trigger: (s: Student, stg: Stage) => void; dismiss: () => void };
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [toastMsg, setToastMsg] = useState<ToastState>({ message: "", type: "success" });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [confirmState, setConfirmState] = useState<ConfirmState>({ open: false, message: "", onConfirm: null });
  const [celebrationState, setCelebrationState] = useState<CelebrationState>({ show: false, student: null, stage: null });

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToastMsg({ message: msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg({ message: "", type: "success" }), 4000);
  }, []);

  const confirmAsk = useCallback((msg: string, fn: () => void) => {
    setConfirmState({ open: true, message: msg, onConfirm: fn });
  }, []);

  const confirmClose = useCallback(() => setConfirmState({ open: false, message: "", onConfirm: null }), []);

  const celebrationTrigger = useCallback((s: Student, stg: Stage) => {
    setCelebrationState({ show: true, student: s, stage: stg });
  }, []);

  const celebrationDismiss = useCallback(() => {
    setCelebrationState({ show: false, student: null, stage: null });
  }, []);

  return (
    <UIContext.Provider
      value={{
        toast: { ...toastMsg, show: showToast },
        confirm: { ...confirmState, ask: confirmAsk, close: confirmClose },
        celebration: { ...celebrationState, trigger: celebrationTrigger, dismiss: celebrationDismiss },
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI(): UIContextType {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
