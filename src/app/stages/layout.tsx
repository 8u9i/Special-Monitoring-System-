"use client";
import AuthenticatedLayout from "@/components/authenticated-layout";
export default function StagesLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
