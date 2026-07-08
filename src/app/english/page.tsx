"use client";

import { useState, useMemo } from "react";
import { useData } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import StudentCarousel from "@/components/containers/student-carousel";
import StudentStageCard from "@/components/containers/student-stage-card";
import type { Student } from "@/lib/types";

export default function EnglishTrailPage() {
  const { state, toggleEnglishStatus } = useData();
  const student = state.students.find((s) => s.id === state.selectedStudentId) || null;
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);

  const getUnitStatus = (s: Student, unitNum: number): "memorized" | "review" | "none" => {
    if (s.memorizedEnglishUnits.includes(unitNum)) return "memorized";
    if (s.reviewEnglishUnits.includes(unitNum)) return "review";
    return "none";
  };

  const selectedUnitData = useMemo(() => state.englishUnits.find((u) => u.unitNumber === selectedUnit), [state.englishUnits, selectedUnit]);

  return (
    <div className="space-y-6">
      <StudentCarousel />
      {student && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StudentStageCard student={student} />
          <div className="space-y-4 lg:col-span-2">
            <div className="panel p-4 sm:p-6">
              <div className="panel-header">
                <h3 className="panel-title"><span className="panel-title-icon">🔤</span> وحدات اللغة الإنجليزية</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {state.englishUnits.map((unit) => {
                  const status = getUnitStatus(student, unit.unitNumber);
                  const active = selectedUnit === unit.unitNumber;
                  return (
                    <button
                      key={unit.unitNumber}
                      onClick={() => setSelectedUnit(unit.unitNumber)}
                      className={`flex flex-col items-center gap-2 p-4 border transition-colors text-center ${active ? "border-primary bg-primary-light" : status !== "none" ? (status === "memorized" ? "border-primary bg-primary-light" : "border-amber bg-amber-light") : "border-border bg-canvas hover:border-primary"}`}
                    >
                      <span className={`badge-number-sm ${status === "memorized" ? "text-primary-dark" : status === "review" ? "text-tag-amber-text" : "text-text-tertiary"}`}>
                        {status === "memorized" ? "✓" : status === "review" ? "⟳" : unit.unitNumber}
                      </span>
                      <span className="text-xs font-semibold text-text-primary">الوحدة {unit.unitNumber}</span>
                      <span className="text-2xs text-text-tertiary">{unit.words.length} كلمة</span>
                    </button>
                  );
                })}
                {state.englishUnits.length === 0 && (
                  <div className="col-span-full empty-state"><p className="empty-state-text">لا توجد وحدات مضافة</p></div>
                )}
              </div>
            </div>

            {selectedUnitData && (
              <div className="panel p-4 sm:p-6">
                <div className="panel-header flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h3 className="panel-title">
                    <AppIcon name="list_alt" size={18} className="text-primary" />
                    الوحدة {selectedUnitData.unitNumber}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {(["memorized", "review", "none"] as const).map((s) => {
                      const current = getUnitStatus(student, selectedUnitData.unitNumber);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleEnglishStatus(student.id, selectedUnitData.unitNumber, s)}
                          className={`btn btn-sm ${current === s ? (s === "memorized" ? "btn-primary" : s === "review" ? "bg-amber text-text-primary border-none" : "bg-border text-text-secondary border-none") : "btn-outline"}`}
                        >
                          <AppIcon name={s === "memorized" ? "check_circle" : s === "review" ? "sync" : "restart_alt"} size={16} />
                          {s === "memorized" ? "تم الحفظ" : s === "review" ? "مراجعة" : "مسح"}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  {selectedUnitData.words.map((w, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-canvas border border-border-light">
                      <span className="w-8 h-8 flex items-center justify-center bg-primary-light text-primary-dark font-bold text-xs shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary font-cause">{w.word}</p>
                        <p className="text-xs text-text-secondary">{w.definition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
