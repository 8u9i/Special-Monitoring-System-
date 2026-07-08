"use client";

import { useState, useMemo } from "react";
import { useData } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import StudentCarousel from "@/components/containers/student-carousel";
import StudentStageCard from "@/components/containers/student-stage-card";
import type { Hadith, Student } from "@/lib/types";

export default function HadithTrailPage() {
  const { state, toggleHadithStatus } = useData();
  const student = state.students.find((s) => s.id === state.selectedStudentId) || null;
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedHadithNumber, setExpandedHadithNumber] = useState<number | null>(null);

  const groupedHadiths = useMemo(() => {
    const map = new Map<string, Hadith[]>();
    for (const h of state.hadiths) {
      const arr = map.get(h.category) || [];
      arr.push(h);
      map.set(h.category, arr);
    }
    return Array.from(map.entries()).map(([category, hadiths]) => ({ category, hadiths }));
  }, [state.hadiths]);

  const getHadithStatus = (s: Student | null, num: number): "memorized" | "review" | "none" => {
    if (!s) return "none";
    if (s.memorizedHadithNumbers.includes(num)) return "memorized";
    if (s.reviewHadithNumbers.includes(num)) return "review";
    return "none";
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategory((prev) => (prev === cat ? null : cat));
    setExpandedHadithNumber(null);
  };
  const toggleHadith = (num: number) => setExpandedHadithNumber((prev) => (prev === num ? null : num));

  const handleStatus = async (studentId: string, hadithNum: number, status: "memorized" | "review" | "none") => {
    if (!student) return;
    await toggleHadithStatus(studentId, hadithNum, status);
  };

  return (
    <div className="space-y-6">
      <StudentCarousel />
      {student && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StudentStageCard student={student} />
          <div className="space-y-4 lg:col-span-2">
            <div className="panel p-4 sm:p-6">
              <div className="panel-header">
                <h3 className="panel-title">
                  <span className="panel-title-icon">📚</span> مسار الأحاديث
                </h3>
                <p className="text-xs text-text-secondary">اضغط على الباب لعرض الأحاديث</p>
              </div>
              <div className="space-y-1 max-h-[60vh] sm:max-h-[600px] overflow-y-auto">
                {groupedHadiths.map((group) => {
                  const isCategoryExpanded = expandedCategory === group.category;
                  return (
                    <div key={group.category} className={`border transition-all ${isCategoryExpanded ? "border-primary" : "border-border-light"}`}>
                      <button
                        onClick={() => toggleCategory(group.category)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-start cursor-pointer transition-colors ${isCategoryExpanded ? "bg-primary-light" : "hover:bg-canvas"}`}
                        aria-expanded={isCategoryExpanded}
                      >
                        <AppIcon name="folder" size={18} />
                        <span className="font-bold text-sm flex-1 text-start text-text-primary">{group.category}</span>
                        <span className="tag tag-primary">{group.hadiths.length}</span>
                        <AppIcon name="expand_more" size={16} className={`text-text-tertiary transition-transform ${isCategoryExpanded ? "rotate-180" : ""}`} />
                      </button>
                      {isCategoryExpanded && (
                        <div className="border-t border-border-light bg-canvas">
                          {group.hadiths.map((hadith, idx) => {
                            const isExpanded = expandedHadithNumber === hadith.number;
                            const status = getHadithStatus(student, hadith.number);
                            return (
                              <div key={hadith.number} className="border-b border-border-light last:border-b-0">
                                <button
                                  onClick={() => toggleHadith(hadith.number)}
                                  className={`w-full flex items-center gap-3 px-4 py-3 text-start cursor-pointer transition-colors ${isExpanded ? "bg-surface" : "hover:bg-surface"}`}
                                  aria-expanded={isExpanded}
                                >
                                  <span className={`badge-number ${status === "memorized" ? "badge-number-memorized" : status === "review" ? "badge-number-review" : "badge-number-none"}`}>{idx + 1}</span>
                                  <span className={`font-bold text-sm flex-1 truncate text-start ${status !== "none" ? "text-text-primary" : "text-text-secondary"}`}>الحديث {idx + 1}</span>
                                  <AppIcon name="expand_more" size={16} className={`text-text-tertiary transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                </button>
                                {isExpanded && (
                                  <div className="border-t border-border-light p-4 bg-surface">
                                    <div className="p-4 bg-amber-light border text-center mb-4" style={{ borderColor: `color-mix(in srgb, var(--color-amber) 20%, transparent)` }}>
                                      <p className="font-amiri text-base font-bold text-text-primary leading-relaxed select-all">&ldquo;{hadith.text}&rdquo;</p>
                                    </div>
                                    <p className="text-xs text-text-secondary mb-3"><span className="font-semibold">الراوي:</span> {hadith.reference}</p>
                                    <div className="p-3 bg-canvas border border-border-light mb-4">
                                      <span className="text-xs text-primary font-bold flex items-center gap-1 mb-1"><AppIcon name="spa" size={18} /> المعنى المبسط:</span>
                                      <p className="text-xs text-text-secondary leading-relaxed">{hadith.explanation}</p>
                                    </div>
                                    <div className="pt-3 border-t border-border-light">
                                      <p className="text-xs text-text-secondary font-semibold text-center mb-2">تحديث حالة الحديث لـ {student.name}:</p>
                                      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2">
                                        {(["memorized", "review", "none"] as const).map((s) => {
                                          const labels = { memorized: "تم الحفظ", review: "قيد المراجعة", none: "إعادة ضبط" };
                                          const icons = { memorized: "check_circle", review: "menu_book", none: "restart_alt" };
                                          const isActive = status === s;
                                          return (
                                            <button
                                              key={s}
                                              onClick={() => handleStatus(student.id, hadith.number, s)}
                                              className={`btn btn-sm flex items-center justify-center gap-1.5 ${isActive ? (s === "memorized" ? "btn-primary" : s === "review" ? "btn-review" : "btn-none") : "btn-outline"}`}
                                            >
                                              <AppIcon name={icons[s]} size={18} />
                                              {labels[s]}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {groupedHadiths.length === 0 && (
                  <div className="empty-state">
                    <p className="empty-state-text">لا توجد أحاديث مضافة بعد</p>
                    <p className="text-xs text-text-tertiary mt-1">أضف أحاديث من صفحة المناهج التعليمية</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
