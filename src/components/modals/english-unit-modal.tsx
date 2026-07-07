"use client";

import { useState, useEffect, useCallback } from "react";
import { useTracker } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import type { EnglishUnitWithWords } from "@/lib/types";

interface WordRow { word: string; definition: string; }

interface Props {
  unit: EnglishUnitWithWords | null;
  open: boolean;
  onClose: () => void;
}

export default function EnglishUnitModal({ unit, open, onClose }: Props) {
  const isEdit = !!unit;
  const { addEnglishUnit, updateEnglishUnit } = useTracker();
  const [unitNumber, setUnitNumber] = useState<number>(0);
  const [rows, setRows] = useState<WordRow[]>([{ word: "", definition: "" }]);

  useEffect(() => {
    if (open) {
      if (unit) {
        setUnitNumber(unit.unitNumber);
        setRows(unit.words.length > 0 ? [...unit.words] : [{ word: "", definition: "" }]);
      } else {
        setUnitNumber(0);
        setRows([{ word: "", definition: "" }]);
      }
    }
  }, [open, unit]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const updateRow = (i: number, field: keyof WordRow, value: string) => {
    setRows((r) => r.map((row, idx) => idx === i ? { ...row, [field]: value } : row));
  };

  const addRow = () => setRows((r) => [...r, { word: "", definition: "" }]);

  const removeRow = (i: number) => {
    if (rows.length === 1) return;
    setRows((r) => r.filter((_, idx) => idx !== i));
  };

  const moveRow = (i: number, dir: -1 | 1) => {
    setRows((r) => {
      const next = [...r];
      const j = i + dir;
      if (j < 0 || j >= next.length) return r;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const submit = useCallback(async () => {
    const valid = rows.filter((r) => r.word.trim() && r.definition.trim());
    if (valid.length === 0) return;
    if (isEdit && unit) {
      await updateEnglishUnit(unitNumber || unit.unitNumber, valid);
    } else {
      await addEnglishUnit(valid);
    }
    onClose();
  }, [rows, isEdit, unit, unitNumber, addEnglishUnit, updateEnglishUnit, onClose]);

  if (!open) return null;

  const canSubmit = rows.some((r) => r.word.trim() && r.definition.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-overlay" onClick={onClose} />
      <div className="relative modal-panel max-w-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="panel-title">
            <AppIcon name={isEdit ? "edit_note" : "add_box"} size={20} className="text-primary" />
            {isEdit ? "تعديل وحدة الإنجليزية" : "إضافة وحدة إنجليزية جديدة"}
          </h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><AppIcon name="close" size={18} /></button>
        </div>

        <div className="space-y-4">
          {isEdit && (
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1">رقم الوحدة</label>
              <input
                className="input-field"
                type="number"
                min={1}
                value={unitNumber || ""}
                onChange={(e) => setUnitNumber(Number(e.target.value))}
                placeholder="اتركه فارغًا ليُحفظ بنفس الرقم"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-text-secondary">الكلمات</label>
              <button className="btn btn-outline btn-sm" onClick={addRow}>
                <AppIcon name="add" size={14} /> كلمة
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {rows.map((row, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-canvas border border-border-light">
                  <div className="flex flex-col gap-1 pt-2">
                    <button
                      className="btn btn-icon btn-ghost"
                      style={{ width: 24, height: 24, minHeight: 24 }}
                      onClick={() => moveRow(i, -1)}
                      disabled={i === 0}
                      title="رفع"
                    >
                      <AppIcon name="arrow_upward" size={12} />
                    </button>
                    <button
                      className="btn btn-icon btn-ghost"
                      style={{ width: 24, height: 24, minHeight: 24 }}
                      onClick={() => moveRow(i, 1)}
                      disabled={i === rows.length - 1}
                      title="إنزال"
                    >
                      <AppIcon name="arrow_downward" size={12} />
                    </button>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      className="input-field"
                      type="text"
                      value={row.word}
                      onChange={(e) => updateRow(i, "word", e.target.value)}
                      placeholder="الكلمة بالإنجليزية"
                    />
                    <input
                      className="input-field"
                      type="text"
                      value={row.definition}
                      onChange={(e) => updateRow(i, "definition", e.target.value)}
                      placeholder="التعريف / المعنى"
                    />
                  </div>
                  <button
                    className="btn btn-icon btn-ghost"
                    style={{ width: 32, height: 32, minHeight: 32 }}
                    onClick={() => removeRow(i)}
                    disabled={rows.length === 1}
                    title="حذف"
                  >
                    <AppIcon name="delete" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn btn-outline btn-md flex-1" onClick={onClose}>إلغاء</button>
          <button className="btn btn-primary btn-md flex-1" onClick={submit} disabled={!canSubmit}>
            <AppIcon name="check" size={18} />
            {isEdit ? "حفظ التعديلات" : "إضافة الوحدة"}
          </button>
        </div>
      </div>
    </div>
  );
}
