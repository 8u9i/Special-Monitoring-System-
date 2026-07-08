"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useData } from "@/lib/tracker-context";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MobileMenu from "@/components/layout/mobile-menu";
import Toast from "@/components/overlays/toast";
import ConfirmModal from "@/components/overlays/confirm-modal";
import CelebrationModal from "@/components/overlays/celebration-modal";
import AddStudentModal from "@/components/modals/add-student-modal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();
  const { loadAll } = useData();
  const router = useRouter();
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!auth.checked) return;
    if (!auth.authenticated) {
      router.replace("/login");
      return;
    }
    loadAll(true);
  }, [auth.checked, auth.authenticated, loadAll, router]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileMenuOpen(false); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (!auth.checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!auth.authenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onAddStudent={() => setAddStudentOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen((o) => !o)}
          mobileMenuOpen={mobileMenuOpen}
          mobileMenu={<MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
      <Toast />
      <ConfirmModal />
      <CelebrationModal />
      <AddStudentModal open={addStudentOpen} onClose={() => setAddStudentOpen(false)} />
    </div>
  );
}
