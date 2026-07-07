"use client";

import { usePathname } from "next/navigation";
import AppIcon from "@/components/app-icon";

const ROUTE_DATA: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "لوحة التحكم", subtitle: "نظرة عامة على رحلة الحفظ" },
  hadith: { title: "مسار الأحاديث", subtitle: "حفظ ومراجعة الأحاديث النبوية" },
  quran: { title: "مسار القرآن", subtitle: "حفظ ومراجعة سور القرآن الكريم" },
  english: { title: "مسار الإنجليزية", subtitle: "تعلم وحفظ مفردات اللغة الإنجليزية" },
  reference: { title: "المناهج التعليمية", subtitle: "إدارة الأحاديث والسور والوحدات" },
  stages: { title: "لوحة الإدارة", subtitle: "إدارة الطلاب ومتابعة التقدم" },
};

export default function Header({ onAddStudent }: { onAddStudent: () => void }) {
  const pathname = usePathname();
  const route = ROUTE_DATA[pathname.split("/")[1] || "dashboard"] || ROUTE_DATA.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-surface-elevated border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary font-tajawal">{route.title}</h1>
          <p className="text-sm text-text-secondary">{route.subtitle}</p>
        </div>
        <button className="btn btn-primary btn-md" onClick={onAddStudent}>
          <AppIcon name="person_add" size={18} />
          إضافة طالب
        </button>
      </div>
    </header>
  );
}
