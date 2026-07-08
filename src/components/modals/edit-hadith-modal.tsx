"use client";

import { useState, useEffect, useCallback } from "react";
import { useData } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import type { Hadith } from "@/lib/types";

interface Props {
  hadith: Hadith | null;
  open: boolean;
  onClose: () => void;
}

export default function EditHadithModal({ hadith, open, onClose }: Props) {
  const { state, updateHadith } = useData();
  const [number, setNumber] = useState<number>(0);
  const [text, setText] = useState("");
  const [reference, setReference] = useState("");
  const [explanation, setExplanation] = useState("");
  const [category, setCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [error, setError] = useState("");

  const categories = [...new Set(state.hadiths.map((h) => h.category).filter(Boolean))].sort();

  useEffect(() => {
    if (hadith) {
      setNumber(hadith.number); setText(hadith.text); setReference(hadith.reference);
      setExplanation(hadith.explanation); setCategory(hadith.category); setError("");
    }
  }, [hadith]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const submit = useCallback(async () => {
    if (!hadith) return;
    const ok = await updateHadith(hadith.number, number, text, reference, explanation, category);
    if (!ok) setError("رقم الحديث موجود مسبقاً");
    else onClose();
  }, [hadith, number, text, reference, explanation, category, updateHadith, onClose]);

  if (!open || !hadith) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-overlay" onClick={onClose} />
      <div className="relative modal-panel max-w-lg animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="panel-title">
            <AppIcon name="edit_note" size={20} className="text-primary" />
            تعديل الحديث
          </h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><AppIcon name="close" size={18} /></button>
        </div>

        {error && <p className="text-sm text-rose bg-rose-light p-2 mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">رقم الحديث</label>
            <input className="input-field" type="number" min={1} value={number || ""} onChange={(e) => setNumber(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">نص الحديث *</label>
            <textarea className="input-field font-amiri text-base leading-relaxed" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">التصنيف</label>
            {!showNewCategory ? (
              <div className="flex gap-2">
                <select className="input-field flex-1" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">اختر التصنيف...</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button className="btn btn-outline btn-sm" onClick={() => { setShowNewCategory(true); setCategory(""); }}>جديد</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input className="input-field flex-1" type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="اسم التصنيف الجديد" />
                <button className="btn btn-ghost btn-sm" onClick={() => setShowNewCategory(false)}>رجوع</button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">المرجع</label>
            <input className="input-field" type="text" value={reference} onChange={(e) => setReference(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">الشرح</label>
            <textarea className="input-field" rows={2} value={explanation} onChange={(e) => setExplanation(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn btn-outline btn-md flex-1" onClick={onClose}>إلغاء</button>
          <button className="btn btn-primary btn-md flex-1" onClick={submit} disabled={!text.trim() || !number}>
            <AppIcon name="check" size={18} />
            حفظ التعديلات
          </button>
        </div>
      </div>
    </div>
  );
}
