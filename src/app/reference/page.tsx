"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useData, useUI } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import { QURAN_SURAHS } from "@/lib/constants";
import EditHadithModal from "@/components/modals/edit-hadith-modal";
import AddHadithModal from "@/components/modals/add-hadith-modal";
import EnglishUnitModal from "@/components/modals/english-unit-modal";
import type { Hadith, EnglishUnitWithWords } from "@/lib/types";

type ReferenceSubject = "hadith" | "quran" | "english";

export default function ReferencePage() {
  const { state, selectStudent, deleteHadith, deleteEnglishUnit } = useData();
  const { confirm } = useUI();
  const router = useRouter();
  const [subject, setSubject] = useState<ReferenceSubject>("hadith");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editHadith, setEditHadith] = useState<Hadith | null>(null);
  const [addHadithOpen, setAddHadithOpen] = useState(false);
  const [editEnglishUnit, setEditEnglishUnit] = useState<EnglishUnitWithWords | null>(null);
  const [addEnglishUnitOpen, setAddEnglishUnitOpen] = useState(false);

  const uniqueCategories = useMemo(
    () => [...new Set(state.hadiths.map((h) => h.category).filter(Boolean))].sort(),
    [state.hadiths]
  );

  const filteredHadiths = useMemo(() => {
    let result = state.hadiths;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((h) => h.text.includes(q) || h.category.includes(q) || h.reference.includes(q));
    }
    if (categoryFilter !== "all") result = result.filter((h) => h.category === categoryFilter);
    return result;
  }, [state.hadiths, searchQuery, categoryFilter]);

  const handleDeleteHadith = (number: number) => {
    confirm.ask("هل أنت متأكد من حذف هذا الحديث؟", () => deleteHadith(number));
  };

  const handleDeleteEnglishUnit = (unitNumber: number) => {
    confirm.ask("هل أنت متأكد من حذف هذه الوحدة؟ سيتم حذف كل الكلمات داخلها.", () => deleteEnglishUnit(unitNumber));
  };

  return (
    <div className="space-y-6">
      {/* Subject selector */}
      <div className="flex gap-2">
        {(["hadith", "quran", "english"] as const).map((s) => (
          <button
            key={s}
            className={`btn btn-md ${subject === s ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSubject(s)}
          >
            {s === "hadith" ? "الأحاديث" : s === "quran" ? "القرآن" : "الإنجليزية"}
          </button>
        ))}
      </div>

      {subject === "hadith" && (
        <div className="panel p-4 sm:p-6">
          <div className="panel-header flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="panel-title"><span className="panel-title-icon">📚</span> الأحاديث النبوية</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial min-w-0">
                <span className="absolute inset-inline-end-3 top-1/2 -translate-y-1/2 text-text-tertiary"><AppIcon name="search" size={14} /></span>
                <input className="input-field pe-8 text-sm w-full" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث في الأحاديث..." />
              </div>
              <select className="input-field text-sm w-full sm:w-44 sm:max-w-[12rem] truncate" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">كل التصنيفات</option>
                {uniqueCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className="btn btn-primary btn-sm" onClick={() => setAddHadithOpen(true)}>
                <AppIcon name="add_box" size={16} />
                إضافة حديث
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHadiths.map((h) => (
              <div key={h.number} className="panel bg-canvas p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="tag tag-primary">رقم {h.number}</span>
                  <div className="flex gap-1">
                    <button className="btn btn-icon btn-ghost" title="تعديل" onClick={() => setEditHadith(h)}><AppIcon name="edit" size={16} /></button>
                    <button className="btn btn-icon btn-ghost" title="حذف" onClick={() => handleDeleteHadith(h.number)}><AppIcon name="delete" size={16} /></button>
                  </div>
                </div>
                <p className="text-xs text-text-secondary mb-1">{h.reference}</p>
                <p className="font-fustat text-xl font-light text-text-primary leading-relaxed mb-2">&ldquo;{h.text}&rdquo;</p>
                <span className="tag tag-amber text-2xs">{h.category}</span>
                <button
                  className="btn btn-ghost btn-sm mt-3 text-primary flex items-center gap-1"
                  onClick={() => { selectStudent(state.students[0]?.id || ""); router.push("/hadith"); }}
                >
                  <span className="icon-arrow-back"><AppIcon name="arrow_back" size={14} /></span>
                  عرض في المسار
                </button>
              </div>
            ))}
            {filteredHadiths.length === 0 && <div className="col-span-2 empty-state"><p className="empty-state-text">لا توجد نتائج</p></div>}
          </div>
        </div>
      )}

      {subject === "quran" && (
        <div className="panel p-4 sm:p-6">
          <div className="panel-header"><h3 className="panel-title"><span className="panel-title-icon">📖</span> سور القرآن الكريم</h3></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {QURAN_SURAHS.map((s) => (
              <div key={s.number} className="panel bg-canvas p-3 text-center">
                <span className="text-xs font-bold text-primary-dark">سورة</span>
                <p className="text-sm font-bold text-text-primary mt-1">{s.name}</p>
                <span className="text-2xs text-text-tertiary mt-1 block">{s.number}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {subject === "english" && (
        <div className="panel p-4 sm:p-6">
          <div className="panel-header flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="panel-title"><span className="panel-title-icon">🔤</span> وحدات الإنجليزية</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setAddEnglishUnitOpen(true)}>
              <AppIcon name="add_box" size={16} />
              إضافة وحدة
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.englishUnits.map((unit) => (
              <div key={unit.unitNumber} className="panel bg-canvas p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-sm text-text-primary flex items-center gap-2">
                    <AppIcon name="list_alt" size={16} className="text-primary" />
                    الوحدة {unit.unitNumber}
                  </h4>
                  <div className="flex gap-1">
                    <button className="btn btn-icon btn-ghost" title="تعديل" onClick={() => setEditEnglishUnit(unit)}>
                      <AppIcon name="edit" size={16} />
                    </button>
                    <button className="btn btn-icon btn-ghost" title="حذف" onClick={() => handleDeleteEnglishUnit(unit.unitNumber)}>
                      <AppIcon name="delete" size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  {unit.words.map((w, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-primary-dark shrink-0 w-6">{i + 1}.</span>
                      <span className="font-semibold text-text-primary font-cause">{w.word}</span>
                      <span className="text-text-tertiary">— {w.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {state.englishUnits.length === 0 && <div className="col-span-2 empty-state"><p className="empty-state-text">لا توجد وحدات مضافة</p></div>}
          </div>
        </div>
      )}

      <EditHadithModal hadith={editHadith} open={!!editHadith} onClose={() => setEditHadith(null)} />
      <AddHadithModal open={addHadithOpen} onClose={() => setAddHadithOpen(false)} />
      <EnglishUnitModal unit={editEnglishUnit} open={!!editEnglishUnit || addEnglishUnitOpen} onClose={() => { setEditEnglishUnit(null); setAddEnglishUnitOpen(false); }} />
    </div>
  );
}
