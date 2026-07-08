"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useData } from "@/lib/tracker-context";
import AppShell from "@/components/app-shell";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();
  const { loadAll } = useData();
  const router = useRouter();

  useEffect(() => {
    if (!auth.checked) return;
    if (!auth.authenticated) router.replace("/login");
    else loadAll(true);
  }, [auth.checked, auth.authenticated, loadAll, router]);

  if (!auth.checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!auth.authenticated) return null;

  return <AppShell>{children}</AppShell>;
}
