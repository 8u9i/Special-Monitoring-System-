"use client";

import { TrackerProvider } from "@/lib/tracker-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <TrackerProvider>{children}</TrackerProvider>;
}
