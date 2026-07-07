"use client";

import { useState, useEffect, useCallback } from "react";
import { useTracker } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";

export default function AddHadithModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, addHadith } = useTracker();
  const [text, setText] = useState("");
  const [reference, setReference] = useState("رواية صحيحة");
  const [explanation, setExplanation] = useState("");
  const [category, setCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  const categories = [...new Set(state.hadiths.map((h) => h.category).filter(Boolean))].sort();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const submit = useCallback(async () => {
    if (!text.trim()) return;
    await addHadith(text.trim(), reference.trim(), explanation.trim(), category.trim());
    setText(""); setReference("رواية صحيحة"); setExplanation(""); setCategory("");
    onClose();
  }, [text, reference, explanation, category, addHadith, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-overlay" onClick={onClose} />
      <div className="relative modal-panel max-w-lg animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="panel-title">
            <AppIcon name="add_box" size={20} className="text-primary" />
            إضافة حديث شريف جديد
          </h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><AppIcon name="close" size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">نص الحديث *</label>
            <textarea
              className="input-field font-amiri text-base leading-relaxed"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="اكتب نص الحديث الشريف..."
            />
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
            <textarea className="input-field" rows={2} value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="شرح مبسط للحديث..." />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn btn-outline btn-md flex-1" onClick={onClose}>إلغاء</button>
          <button className="btn btn-primary btn-md flex-1" onClick={submit} disabled={!text.trim()}>
            <AppIcon name="check" size={18} />
            إضافة الحديث
          </button>
        </div>
      </div>
    </div>
  );
}
