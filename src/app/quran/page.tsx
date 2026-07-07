"use client";

import { useState, useMemo } from "react";
import { useTracker } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import StudentCarousel from "@/components/containers/student-carousel";
import StudentStageCard from "@/components/containers/student-stage-card";
import { QURAN_SURAHS } from "@/lib/constants";
import type { Student } from "@/lib/types";

export default function QuranTrailPage() {
  const { state, toggleSurahStatus, toggleSurahPageStatus, markAllSurahPages, clearAllSurahPages } = useTracker();
  const student = state.students.find((s) => s.id === state.selectedStudentId) || null;
  const [expandedSurah, setExpandedSurah] = useState<number | null>(null);

  const quranProgress = useMemo(() => {
    if (!student) return { totalMemorized: 0, percentage: 0 };
    const count = student.memorizedSurahNumbers.length;
    return { totalMemorized: count, percentage: Math.round((count / 114) * 100) };
  }, [student]);

  const getSurahStatus = (s: Student, surahNum: number): "memorized" | "review" | "none" => {
    const pages = QURAN_SURAHS.find((su) => su.number === surahNum)?.pagesCount;
    if (pages) {
      const done = s.memorizedSurahPages?.filter((id) => id.startsWith(`${surahNum}-`)).length || 0;
      if (done >= pages) return "memorized";
      if (done > 0) return "review";
      return "none";
    }
    if (s.memorizedSurahNumbers.includes(surahNum)) return "memorized";
    if (s.reviewSurahNumbers.includes(surahNum)) return "review";
    return "none";
  };

  const countMemorizedPages = (surahNum: number) => {
    if (!student) return 0;
    return student.memorizedSurahPages?.filter((id) => id.startsWith(`${surahNum}-`)).length || 0;
  };

  const toggleSurah = (num: number) => setExpandedSurah((prev) => (prev === num ? null : num));

  return (
    <div className="space-y-6">
      <StudentCarousel />
      {student && (
        <>
          {/* Quran progress ring */}
          <div className="panel overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border-light)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-primary)" strokeWidth="8" strokeLinecap="round" strokeDasharray={326.73} strokeDashoffset={326.73 * (1 - quranProgress.percentage / 100)} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{quranProgress.percentage}%</span>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-start">
                <h3 className="font-tajawal text-lg font-bold text-text-primary mb-2">حفظ <span className="text-primary">{quranProgress.totalMemorized}</span> من 114 سورة</h3>
                <div className="w-full h-3 bg-canvas overflow-hidden"><div className="progress-fill-green" style={{ width: `${quranProgress.percentage}%` }} /></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StudentStageCard student={student} />
            <div className="space-y-4 lg:col-span-2">
              <div className="panel p-4 sm:p-6">
                <div className="panel-header">
                  <h3 className="panel-title"><span className="panel-title-icon">📖</span> سور القرآن الكريم</h3>
                </div>
                <div className="space-y-1 max-h-[60vh] sm:max-h-[600px] overflow-y-auto">
                  {QURAN_SURAHS.map((surah) => {
                    const isExpanded = expandedSurah === surah.number;
                    const surahStatus = getSurahStatus(student, surah.number);
                    const pagesCount = surah.pagesCount || 1;
                    return (
                      <div key={surah.number} className={`border transition-all ${isExpanded ? "border-primary" : "border-border-light"}`}>
                        <button onClick={() => toggleSurah(surah.number)} className={`w-full flex items-center gap-3 px-4 py-3 text-start cursor-pointer transition-colors ${isExpanded ? "bg-primary-light" : "hover:bg-canvas"}`}>
                          <span className={`badge-number ${surahStatus === "memorized" ? "badge-number-memorized" : surahStatus === "review" ? "badge-number-review" : "badge-number-none"}`}>{surah.number}</span>
                          <span className="font-bold text-sm flex-1 text-text-primary">{surah.name}</span>
                          {surah.pagesCount && <span className="text-2xs text-text-tertiary">{countMemorizedPages(surah.number)}/{surah.pagesCount} صفحة</span>}
                          <AppIcon name="expand_more" size={16} className={`text-text-tertiary transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                        {isExpanded && (
                          <div className="border-t border-border-light p-4 bg-surface">
                            {surah.pagesCount ? (
                              <>
                                <p className="text-xs text-text-secondary mb-3 font-semibold">اختر الصفحات المحفوظة ({countMemorizedPages(surah.number)}/{surah.pagesCount}):</p>
                                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 mb-4">
                                  {Array.from({ length: surah.pagesCount }, (_, i) => {
                                    const pageDone = student.memorizedSurahPages?.includes(`${surah.number}-${i + 1}`);
                                    return (
                                      <button
                                        key={i}
                                        className={`w-full aspect-square text-2xs font-bold flex items-center justify-center transition-colors ${pageDone ? "bg-primary text-white" : "bg-canvas border border-border text-text-tertiary hover:border-primary"}`}
                                        onClick={() => toggleSurahPageStatus(student.id, surah.number, i + 1, pageDone ? "none" : "memorized")}
                                      >
                                        {pageDone && <AppIcon name="check" size={12} />}
                                        {i + 1}
                                      </button>
                                    );
                                  })}
                                </div>
                                <div className="flex gap-2">
                                  <button className="btn btn-outline btn-sm flex-1" onClick={() => markAllSurahPages(student.id, surah.number, pagesCount)}>
                                    <AppIcon name="check_circle_outline" size={16} /> حفظ الكل
                                  </button>
                                  <button className="btn btn-outline btn-sm flex-1" onClick={() => clearAllSurahPages(student.id, surah.number, pagesCount)}>
                                    <AppIcon name="restart_alt" size={16} /> مسح
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2">
                                {(["memorized", "review", "none"] as const).map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => toggleSurahStatus(student.id, surah.number, s)}
                                    className={`btn btn-sm ${surahStatus === s ? (s === "memorized" ? "btn-primary" : s === "review" ? "bg-amber text-text-primary border-none" : "bg-border text-text-secondary border-none") : "btn-outline"}`}
                                  >
                                    {s === "memorized" ? "تم الحفظ" : s === "review" ? "قيد المراجعة" : "إعادة ضبط"}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
