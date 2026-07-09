"use client";

import { useState, useMemo } from "react";
import { useData, useUI } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import ProgressBar from "@/components/progress-bar";
import { getAvatarEmoji, getCompletion } from "@/lib/constants";
import EditStudentModal from "@/components/modals/edit-student-modal";
import AddStudentModal from "@/components/modals/add-student-modal";
import type { Student } from "@/lib/types";

export default function StagesPage() {
  const { state, getStudentStage, deleteStudent, cheatUnlockAll, resetStudentProgress, resetAllProgress } = useData();
  const { confirm } = useUI();
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [addStudentOpen, setAddStudentOpen] = useState(false);

  const students = useMemo(
    () =>
      state.students
        .map((s) => ({ student: s, completion: getCompletion(s, state.hadiths.length, state.englishUnits.length) }))
        .sort((a, b) => b.completion.overall - a.completion.overall),
    [state.students, state.hadiths.length, state.englishUnits.length]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Admin tools sidebar */}
        <div className="space-y-4">
          <div className="panel p-5">
            <h3 className="panel-title mb-4">أدوات الإدارة</h3>
            <div className="text-2xl font-bold text-primary-dark mb-2">{state.students.length}</div>
            <p className="text-xs text-text-secondary mb-1">إجمالي الإنجاز: {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.completion.overall, 0) / students.length) : 0}%</p>
            {students[0] && students[0].completion.overall > 0 && (
              <p className="text-xs text-text-tertiary">الصدارة: {students[0].student.name}</p>
            )}
          </div>
          <button className="btn btn-primary btn-md w-full" onClick={() => setAddStudentOpen(true)}>
            <AppIcon name="person_add" size={16} /> إضافة طالب جديد
          </button>
          <button className="btn btn-outline btn-md w-full text-rose border-rose" onClick={() => confirm.ask("سيؤدي هذا إلى تصفير تقدم جميع الطلاب بالكامل. متأكد؟", () => resetAllProgress())}>
            <AppIcon name="restart_alt" size={16} /> تصفير كل التقدم
          </button>
        </div>

        {/* Student grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <AppIcon name="people" size={18} className="text-text-tertiary" />
            <h3 className="font-bold text-text-primary">الطلاب النشطون</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {students.map(({ student, completion }, idx) => {
              const stage = getStudentStage(student);
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
                  <span className="tag tag-primary text-2xs mb-3">{stage.name}</span>
                  {student.notes && <p className="text-2xs text-text-tertiary mb-2 truncate">{student.notes}</p>}

                  <div className="space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between text-2xs text-text-secondary mb-1">
                        <span className="flex items-center gap-1"><AppIcon name="menu_book" size={14} className="text-primary" /> الأحاديث</span>
                        <span className="font-semibold">{completion.hadith}%</span>
                      </div>
                      <ProgressBar value={completion.hadith} variant="primary" size="sm" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-2xs text-text-secondary mb-1">
                        <span className="flex items-center gap-1"><AppIcon name="auto_stories" size={14} className="text-green" /> القرآن</span>
                        <span className="font-semibold">{completion.quran}%</span>
                      </div>
                      <ProgressBar value={completion.quran} variant="green" size="sm" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-2xs text-text-secondary mb-1">
                        <span className="flex items-center gap-1"><AppIcon name="translate" size={14} className="text-blue" /> الإنجليزية</span>
                        <span className="font-semibold">{completion.english}%</span>
                      </div>
                      <ProgressBar value={completion.english} variant="blue" size="sm" />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border-light">
                    <div className="flex items-center justify-between text-2xs text-text-tertiary mb-1.5">
                      <span>الإنجاز الكلي</span>
                      <span className="font-bold text-primary-dark">{completion.overall}%</span>
                    </div>
                    <ProgressBar value={completion.overall} variant="amber" />
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
            {students.length === 0 && (
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
