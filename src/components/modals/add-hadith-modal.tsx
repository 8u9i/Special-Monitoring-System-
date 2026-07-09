"use client";

import { useState, useEffect, useCallback } from "react";
import { useData } from "@/lib/tracker-context";
import { useDialog } from "@/lib/use-dialog";
import AppIcon from "@/components/app-icon";

function splitBlocks(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
}

export default function AddHadithModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, addBulkHadiths } = useData();
  const [text, setText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [category, setCategory] = useState("");
  const [bulk, setBulk] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useDialog(open);

  const categories = [...new Set(state.hadiths.map((h) => h.category).filter(Boolean))].sort();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        setText(""); setExplanation(""); setCategory("");
        setBulk(false); setShowNewCategory(false); setError("");
      });
    }
  }, [open]);

  const submit = useCallback(async () => {
    if (bulk) {
      const texts = splitBlocks(text);
      const explanations = splitBlocks(explanation);
      if (texts.length === 0) {
        setError("أدخل حديثاً واحداً على الأقل (افصل بين الأحاديث بسطر فارغ).");
        return;
      }
      await addBulkHadiths(texts, explanations, category.trim());
      onClose();
      return;
    }
    if (!text.trim()) {
      setError("نص الحديث مطلوب.");
      return;
    }
    await addBulkHadiths([text.trim()], explanation.trim() ? [explanation.trim()] : [], category.trim());
    onClose();
  }, [bulk, text, explanation, category, addBulkHadiths, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-overlay" onClick={onClose} />
      <div className="relative modal-panel max-w-lg animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="add-hadith-title" ref={dialogRef} tabIndex={-1}>
        <div className="flex items-center justify-between mb-6">
          <h2 id="add-hadith-title" className="panel-title">
            <AppIcon name="add_box" size={20} className="text-primary" />
            إضافة حديث شريف جديد
          </h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><AppIcon name="close" size={18} /></button>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-semibold text-text-secondary">
            <input
              type="checkbox"
              className="w-4 h-4 accent-[var(--color-primary)]"
              checked={bulk}
              onChange={(e) => setBulk(e.target.checked)}
            />
            إضافة متعددة (افصل بين كل حديث وشرحه بسطر فارغ)
          </label>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">
              {bulk ? "نصوص الأحاديث *" : "نص الحديث *"}
            </label>
            <textarea
              className="input-field font-hadith text-base leading-relaxed"
              rows={bulk ? 8 : 4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={bulk ? "الحديث الأول\n\nالحديث الثاني\n\nالحديث الثالث" : "اكتب نص الحديث الشريف..."}
            />
            {bulk && (
              <p className="text-2xs text-text-tertiary mt-1">
                كل فراغ بين السطور يبدأ حديثاً جديداً. رقم {splitBlocks(text).length} حديث.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">
              {bulk ? "الشروح (تطابق ترتيب الأحاديث)" : "الشرح"}
            </label>
            <textarea
              className="input-field"
              rows={bulk ? 6 : 2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={bulk ? "شرح الحديث الأول\n\nشرح الحديث الثاني" : "شرح مبسط للحديث..."}
            />
            {bulk && (
              <p className="text-2xs text-text-tertiary mt-1">
                اختياري — افصل كل شرح بسطر فارغ. رقم {splitBlocks(explanation).length} شرح.
              </p>
            )}
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

          {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn btn-outline btn-md flex-1" onClick={onClose}>إلغاء</button>
          <button className="btn btn-primary btn-md flex-1" onClick={submit} disabled={!text.trim() && !bulk}>
            <AppIcon name="check" size={18} />
            {bulk ? `إضافة ${splitBlocks(text).length || 0} حديث` : "إضافة الحديث"}
          </button>
        </div>
      </div>
    </div>
  );
}
