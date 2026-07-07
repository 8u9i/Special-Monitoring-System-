"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useCallback } from "react";
import { useTracker } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import { getAvatarEmoji } from "@/lib/constants";

interface NavItem {
  label: string;
  path: string;
  icon: string;
  section: "مسارات التعلم" | "أدوات";
}

const NAV_ITEMS: NavItem[] = [
  { label: "الرئيسية", path: "/dashboard", icon: "home", section: "مسارات التعلم" },
  { label: "مسار الأحاديث", path: "/hadith", icon: "menu_book", section: "مسارات التعلم" },
  { label: "مسار القرآن", path: "/quran", icon: "auto_stories", section: "مسارات التعلم" },
  { label: "مسار الإنجليزية", path: "/english", icon: "translate", section: "مسارات التعلم" },
  { label: "المناهج التعليمية", path: "/reference", icon: "library_books", section: "أدوات" },
  { label: "لوحة الإدارة", path: "/stages", icon: "manage_accounts", section: "أدوات" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { state, logout, getStudentStage } = useTracker();
  const student = state.students.find((s) => s.id === state.selectedStudentId) || null;
  const stage = student ? getStudentStage(student) : null;

  const navTo = useCallback((path: string) => { router.push(path); onClose(); }, [router, onClose]);
  const handleLogout = useCallback(async () => { await logout(); router.push("/login"); onClose(); }, [logout, router, onClose]);

  useEffect(() => { onClose(); }, [pathname, onClose]);

  const contextPath = pathname.split("/")[1] || "dashboard";
  const progressLabel: Record<string, string> = { hadith: "حدث", quran: "سورة", english: "وحدة" };
  const getProgressValue = () => {
    if (!student) return { done: 0, total: 0, label: "" };
    switch (contextPath) {
      case "hadith": return { done: student.memorizedHadithNumbers.length, total: state.hadiths.length, label: progressLabel.hadith };
      case "quran": return { done: student.memorizedSurahNumbers.length, total: 114, label: progressLabel.quran };
      case "english": return { done: student.memorizedEnglishUnits.length, total: state.englishUnits.length, label: progressLabel.english };
      default: return { done: 0, total: 0, label: "" };
    }
  };
  const progress = getProgressValue();

  if (!open) return null;

  return (
    <>
      <div
        role="menu"
        className="lg:hidden absolute top-full inset-x-0 bg-nav text-nav-text border-b border-nav-active max-h-[calc(100vh-80px)] overflow-y-auto animate-fade-in shadow-lg"
      >
        {student && (
          <div className="p-4 border-b border-nav-active">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getAvatarEmoji(student.avatar)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{student.name}</p>
                <p className="text-2xs text-nav-text-muted">{stage?.name}</p>
                {progress.total > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-2xs text-nav-text-muted mb-1">
                      <span>{progress.done} / {progress.total} {progress.label}</span>
                    </div>
                    <div className="progress-bar bg-nav-active">
                      <div className="progress-fill" style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <nav className="p-3 space-y-4">
          {(["مسارات التعلم", "أدوات"] as const).map((section) => (
            <div key={section}>
              <p className="text-2xs font-semibold text-nav-text-subtle uppercase tracking-wider mb-2 px-2">{section}</p>
              <ul className="space-y-1">
                {NAV_ITEMS.filter((item) => item.section === section).map((item) => {
                  const active = pathname.startsWith(item.path);
                  return (
                    <li key={item.path}>
                      <button
                        role="menuitem"
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-none transition-colors ${active ? "bg-nav-active text-primary" : "text-nav-text-muted hover:bg-nav-hover hover:text-nav-text"}`}
                        onClick={() => navTo(item.path)}
                        aria-current={active ? "page" : undefined}
                      >
                        <AppIcon name={item.icon} size={18} />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-nav-active">
          <button
            role="menuitem"
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-nav-text-muted hover:bg-nav-hover hover:text-nav-text transition-colors rounded-none"
            onClick={handleLogout}
          >
            <AppIcon name="logout" size={18} />
            تسجيل الخروج
          </button>
          <div className="mt-3 text-center">
            <span className="text-2xs text-nav-text-subtle flex items-center justify-center gap-1">
              <AppIcon name="verified" size={12} />
              v1.0 — متابع الحفظ
            </span>
          </div>
        </div>
      </div>
      <div
        className="lg:hidden fixed inset-0 z-20 bg-overlay animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
    </>
  );
}
