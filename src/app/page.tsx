"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTracker } from "@/lib/tracker-context";

export default function Home() {
  const { auth } = useTracker();
  const router = useRouter();

  useEffect(() => {
    if (!auth.checked) return;
    router.replace(auth.authenticated ? "/dashboard" : "/login");
  }, [auth.checked, auth.authenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
