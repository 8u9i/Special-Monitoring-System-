"use client";

import { useState, useEffect, useCallback } from "react";
import { useTracker } from "@/lib/tracker-context";
import { AVATAR_OPTIONS } from "@/lib/constants";
import AppIcon from "@/components/app-icon";
import type { Student } from "@/lib/types";

interface Props {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}

export default function EditStudentModal({ student, open, onClose }: Props) {
  const { updateStudent } = useTracker();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState("avatar-leaf");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (student) { setName(student.name); setAge(student.age?.toString() || ""); setAvatar(student.avatar); setNotes(student.notes || ""); }
  }, [student]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const submit = useCallback(async () => {
    if (!student || !name.trim() || name.trim().length < 2) return;
    await updateStudent(student.id, name.trim(), age ? Number(age) : undefined, avatar, notes);
    onClose();
  }, [student, name, age, avatar, notes, updateStudent, onClose]);

  if (!open || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-overlay" onClick={onClose} />
      <div className="relative modal-panel max-w-md animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="panel-title">
            <AppIcon name="edit" size={20} className="text-primary" />
            تعديل بيانات الطالب
          </h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><AppIcon name="close" size={18} /></button>
        </div>

        <div className="space-y-4">
          <input type="hidden" value={student.id} />
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">اسم الطالب *</label>
            <input className="input-field" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">العمر</label>
            <input className="input-field" type="number" min={1} max={99} value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">الصورة الرمزية</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVATAR_OPTIONS.map((opt) => (
                <button key={opt.value} className={`avatar-option ${avatar === opt.value ? "selected" : ""}`} onClick={() => setAvatar(opt.value)} type="button">
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-2xs text-text-tertiary mt-1">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">ملاحظات</label>
            <textarea className="input-field" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn btn-outline btn-md flex-1" onClick={onClose}>إلغاء</button>
          <button className="btn btn-primary btn-md flex-1" onClick={submit} disabled={!name.trim() || name.trim().length < 2}>
            <AppIcon name="check" size={18} />
            حفظ التعديلات
          </button>
        </div>
      </div>
    </div>
  );
}
