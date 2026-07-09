"use client";

import { useData } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import { getAvatarEmoji, getProgressValue } from "@/lib/constants";
import { usePathname } from "next/navigation";

export default function StudentCarousel() {
  const { state, selectStudent } = useData();
  const pathname = usePathname();
  const currentPath = pathname.split("/")[1] || "dashboard";

  return (
    <div className="bg-surface-elevated border-b border-border p-3">
      <div className="flex items-center gap-2 mb-2">
        <AppIcon name="psychology" size={16} className="text-text-tertiary" />
        <span className="text-xs font-semibold text-text-tertiary">اختر الطالب</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scroll-ps-3">
        {state.students.map((s) => {
          const active = s.id === state.selectedStudentId;
          const progress = getProgressValue(currentPath, s, state.hadiths.length, state.englishUnits.length);
          return (
            <button
              key={s.id}
              className={`snap-start flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm rounded-none border transition-colors ${active ? "border-primary bg-primary-light text-primary-dark font-semibold" : "border-border bg-surface text-text-secondary hover:border-primary"}`}
              onClick={() => selectStudent(s.id)}
            >
              <span>{getAvatarEmoji(s.avatar)}</span>
              <span className="truncate max-w-[100px]">{s.name}</span>
              {progress.total > 0 && (
                <span className="text-2xs text-text-tertiary">
                  {progress.done} / {progress.total}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
