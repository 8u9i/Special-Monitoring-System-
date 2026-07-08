"use client";

import { useState, useMemo } from "react";
import { useData, useUI } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import { getAvatarEmoji } from "@/lib/constants";
import EditStudentModal from "@/components/modals/edit-student-modal";
import AddStudentModal from "@/components/modals/add-student-modal";
import type { Student } from "@/lib/types";

export default function StagesPage() {
  const { state, getStudentStage, deleteStudent, cheatUnlockAll, resetStudentProgress } = useData();
  const { confirm } = useUI();
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [addStudentOpen, setAddStudentOpen] = useState(false);

  const stats = useMemo(() => {
    const list = state.students;
    if (list.length === 0) return { totalXP: 0, topStudentName: "" };
    const totalXP = list.reduce((sum, s) => sum + s.xp, 0);
    const top = list.reduce((a, b) => (a.xp > b.xp ? a : b));
    return { totalXP, topStudentName: top.xp > 0 ? top.name : "" };
  }, [state.students]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Admin tools sidebar */}
        <div className="space-y-4">
          <div className="panel p-5">
            <h3 className="panel-title mb-4">أدوات الإدارة</h3>
            <div className="text-2xl font-bold text-primary-dark mb-2">{state.students.length}</div>
            <p className="text-xs text-text-secondary mb-1">إجمالي XP: {stats.totalXP}</p>
            {stats.topStudentName && <p className="text-xs text-text-tertiary">الصدارة: {stats.topStudentName}</p>}
          </div>
          <button className="btn btn-primary btn-md w-full" onClick={() => setAddStudentOpen(true)}>
            <AppIcon name="person_add" size={16} /> إضافة طالب جديد
          </button>
        </div>

        {/* Student grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <AppIcon name="people" size={18} className="text-text-tertiary" />
            <h3 className="font-bold text-text-primary">الطلاب النشطون</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {state.students.map((student) => {
              const stage = getStudentStage(student);
              const progress = Math.min(Math.round((student.xp / (stage.maxXP > 10000 ? stage.minXP : stage.maxXP)) * 100), 100);
              return (
                <div key={student.id} className="panel bg-canvas p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getAvatarEmoji(student.avatar)}</span>
                      <div>
                        <p className="font-bold text-sm text-text-primary">{student.name}</p>
                        <p className="text-2xs text-text-tertiary">{student.age ? `${student.age} سنة` : ""}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="btn btn-icon btn-ghost" title="تعديل" onClick={() => setEditStudent(student)}><AppIcon name="edit" size={14} /></button>
                      <button className="btn btn-icon btn-ghost" title="حذف" onClick={() => confirm.ask("هل أنت متأكد من حذف الطالب؟", () => deleteStudent(student.id))}>
                        <AppIcon name="delete" size={14} />
                      </button>
                    </div>
                  </div>
                  <span className="tag tag-primary text-2xs mb-2">{stage.name}</span>
                  {student.notes && <p className="text-2xs text-text-tertiary mb-2 truncate">{student.notes}</p>}
                  <div className="mt-3">
                    <div className="flex justify-between text-2xs text-text-tertiary mb-1">
                      <span>{student.memorizedHadithNumbers.length}/{state.hadiths.length} حديث</span>
                      <span>{student.xp} XP</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                  </div>
                  {/* Admin actions */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border-light">
                    <button
                      className="btn btn-outline btn-sm flex-1 text-green border-green"
                      onClick={() => confirm.ask("سيؤدي هذا إلى تعليم جميع الأحاديث كمحفوظة للطالب. متأكد؟", () => cheatUnlockAll(student.id))}
                    >
                      <AppIcon name="emoji_events" size={12} /> ختم 40
                    </button>
                    <button
                      className="btn btn-outline btn-sm flex-1 text-rose border-rose"
                      onClick={() => confirm.ask("سيؤدي هذا إلى تصفير تقدم الطالب بالكامل. متأكد؟", () => resetStudentProgress(student.id))}
                    >
                      <AppIcon name="restart_alt" size={12} /> تصفير
                    </button>
                  </div>
                </div>
              );
            })}
            {state.students.length === 0 && (
              <div className="col-span-full empty-state"><p className="empty-state-text">لا يوجد طلاب مسجلون</p></div>
            )}
          </div>
        </div>
      </div>

      <EditStudentModal student={editStudent} open={!!editStudent} onClose={() => setEditStudent(null)} />
      <AddStudentModal open={addStudentOpen} onClose={() => setAddStudentOpen(false)} />
    </div>
  );
}
