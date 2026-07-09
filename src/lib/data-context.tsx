"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { Student, Hadith, EnglishUnitWithWords, Stage } from "./types";
import { STAGES, getCompletion } from "./constants";
import { api } from "./api";

interface AppState {
  students: Student[];
  hadiths: Hadith[];
  englishUnits: EnglishUnitWithWords[];
  selectedStudentId: string | null;
  searchQuery: string;
  categoryFilter: string;
  loading: boolean;
  loaded: boolean;
}

interface DataContextType {
  state: AppState;
  loadAll: (force?: boolean) => Promise<void>;
  selectStudent: (id: string) => void;
  addStudent: (name: string, age?: number, avatar?: string, notes?: string) => Promise<void>;
  updateStudent: (id: string, name: string, age?: number, avatar?: string, notes?: string) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addHadith: (text: string, explanation: string, category: string) => Promise<void>;
  addBulkHadiths: (texts: string[], explanations: string[], category: string) => Promise<void>;
  updateHadith: (oldNumber: number, newNumber: number, text: string, explanation: string, category: string) => Promise<boolean>;
  deleteHadith: (number: number) => Promise<void>;
  addEnglishUnit: (words: { word: string; definition: string }[]) => Promise<void>;
  updateEnglishUnit: (unitNumber: number, words: { word: string; definition: string }[]) => Promise<void>;
  deleteEnglishUnit: (unitNumber: number) => Promise<void>;
  toggleHadithStatus: (studentId: string, hadithNumber: number, newStatus: "memorized" | "review" | "none") => Promise<void>;
  toggleSurahStatus: (studentId: string, surahNumber: number, newStatus: "memorized" | "review" | "none") => Promise<void>;
  toggleSurahPageStatus: (studentId: string, surahNumber: number, pageIndex: number, newStatus: "memorized" | "none") => Promise<void>;
  markAllSurahPages: (studentId: string, surahNumber: number, pageCount: number) => Promise<void>;
  clearAllSurahPages: (studentId: string, surahNumber: number, pageCount: number) => Promise<void>;
  toggleEnglishStatus: (studentId: string, unitNumber: number, newStatus: "memorized" | "review" | "none") => Promise<void>;
  cheatUnlockAll: (studentId: string) => Promise<void>;
  resetStudentProgress: (studentId: string) => Promise<void>;
  resetAllProgress: () => Promise<void>;
  getStudentStage: (student: Student) => Stage;
}

const DataContext = createContext<DataContextType | null>(null);

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface DataProviderProps {
  children: React.ReactNode;
  showToast: (msg: string, type?: "success" | "error", action?: ToastAction) => void;
  onCelebration?: (student: Student, stage: Stage) => void;
}

export function DataProvider({ children, showToast: showToastExternal, onCelebration }: DataProviderProps) {
  const [state, setState] = useState<AppState>({
    students: [], hadiths: [], englishUnits: [], selectedStudentId: null,
    searchQuery: "", categoryFilter: "all", loading: false, loaded: false,
  });

  const loadedRef = useRef(false);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const doLoadAll = useCallback(async (force = false) => {
    if (!force && loadedRef.current) return;
    setState((s) => ({ ...s, loading: true }));
    try {
      const [apiStudents, apiHadiths, apiEnglishUnits] = await Promise.all([
        api<Student[]>("GET", "/students"),
        api<Hadith[]>("GET", "/hadiths"),
        api<EnglishUnitWithWords[]>("GET", "/english-units"),
      ]);
      setState((s) => ({
        ...s, loading: false, loaded: true,
        students: apiStudents, hadiths: apiHadiths, englishUnits: apiEnglishUnits,
        selectedStudentId: s.selectedStudentId || (apiStudents.length > 0 ? apiStudents[0].id : null),
      }));
      loadedRef.current = true;
    } catch (err) {
      setState((s) => ({ ...s, loading: false }));
      console.error("doLoadAll error:", err);
      showToastExternal("فشل تحميل البيانات من قاعدة البيانات", "error");
    }
  }, [showToastExternal]);

  const doSelectStudent = useCallback((id: string) => {
    setState((s) => ({ ...s, selectedStudentId: id }));
  }, []);

  const doAddStudent = useCallback(async (name: string, age?: number, avatar = "avatar-leaf", notes?: string) => {
    if (!name.trim()) return;
    const newStudent: Student = {
      id: "student-" + Date.now(), name: name.trim(), age, avatar, notes: notes?.trim(),
      joinedAt: new Date().toISOString().split("T")[0], memorizedHadithNumbers: [], reviewHadithNumbers: [],
      memorizedSurahNumbers: [], reviewSurahNumbers: [], memorizedSurahPages: [], memorizedEnglishUnits: [], reviewEnglishUnits: [],
    };
    const prevStudents = stateRef.current.students;
    // Insert optimistically with a temporary id so the UI is responsive...
    setState((s) => ({ ...s, students: [...s.students, newStudent], selectedStudentId: newStudent.id }));
    try {
      // ...then replace with the server-generated record (real id, real joinedAt).
      const saved = await api<Student>("POST", "/students", newStudent);
      setState((s) => ({ ...s, students: s.students.map((st) => st.id === newStudent.id ? saved : st), selectedStudentId: saved.id }));
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doAddStudent error:", err);
      showToastExternal("فشل حفظ بيانات الطالب", "error");
    }
  }, [showToastExternal]);

  const doUpdateStudent = useCallback(async (id: string, name: string, age?: number, avatar?: string, notes?: string) => {
    const payload = {
      id, name: name.trim(), age, avatar: avatar || "avatar-leaf",
      notes: notes?.trim(),
    };
    const prevStudents = stateRef.current.students;
    setState((s) => ({ ...s, students: s.students.map((st) => st.id === id ? { ...st, name: name.trim(), age, avatar: avatar || st.avatar, notes: notes?.trim() } : st) }));
    try {
      await api("PUT", `/students/${id}`, payload);
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doUpdateStudent error:", err);
      showToastExternal("فشل تحديث بيانات الطالب", "error");
    }
  }, [showToastExternal]);

  const doDeleteStudent = useCallback(async (id: string) => {
    const prevStudents = stateRef.current.students;
    setState((s) => ({
      ...s, students: s.students.filter((st) => st.id !== id),
      selectedStudentId: s.selectedStudentId === id ? (s.students.length > 1 ? s.students.find((st) => st.id !== id)!.id : null) : s.selectedStudentId,
    }));
    try {
      // Cascade: delete the student and all of their progress in one round trip.
      await api("DELETE", `/students/${id}?cascade=1`);
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doDeleteStudent error:", err);
      showToastExternal("فشل حذف الطالب", "error");
    }
  }, [showToastExternal]);

  const doAddBulkHadiths = useCallback(async (texts: string[], explanations: string[], category: string) => {
    if (texts.length === 0) return;
    const cat = category.trim() || "عام";
    const startNumber = stateRef.current.hadiths.reduce((max, h) => Math.max(max, h.number), 0) + 1;
    const results = await Promise.allSettled(
      texts.map((t, i) =>
        api<Hadith>("POST", "/hadiths", {
          number: startNumber + i,
          text: t,
          explanation: explanations[i] || "شرح مبسط", category: cat, points: 100,
        })
      )
    );
    const saved = results
      .filter((r): r is PromiseFulfilledResult<Hadith> => r.status === "fulfilled")
      .map((r) => r.value);
    const failures = results.length - saved.length;
    if (saved.length > 0) setState((s) => ({ ...s, hadiths: [...s.hadiths, ...saved] }));
    if (failures > 0) showToastExternal(`فشل حفظ ${failures} من أصل ${results.length} حديث`, "error");
    else showToastExternal(`تمت إضافة ${saved.length} حديث`, "success");
  }, [showToastExternal]);

  const doAddHadith = useCallback(async (text: string, explanation: string, category: string) => {
    if (!text.trim()) return;
    const payload = { text: text.trim(), explanation: explanation.trim() || "شرح مبسط", category: category.trim() || "عام", points: 100 };
    try {
      const saved = await api<Hadith>("POST", "/hadiths", payload);
      setState((s) => ({ ...s, hadiths: [...s.hadiths, saved] }));
    } catch (e) { showToastExternal(`فشل حفظ الحديث: ${(e as Error).message}`, "error"); }
  }, [showToastExternal]);

  const doUpdateHadith = useCallback(async (oldNumber: number, newNumber: number, text: string, explanation: string, category: string): Promise<boolean> => {
    if (!text.trim() || !newNumber) return false;
    if (oldNumber !== newNumber && stateRef.current.hadiths.some((h) => h.number === newNumber)) return false;
    const prevState = stateRef.current;
    setState((s) => ({ ...s, hadiths: s.hadiths.map((h) => h.number === oldNumber ? { ...h, number: newNumber, text: text.trim(), explanation: explanation.trim(), category: category.trim() } : h) }));
    if (oldNumber !== newNumber) {
      setState((s) => ({ ...s, students: s.students.map((st) => ({ ...st, memorizedHadithNumbers: st.memorizedHadithNumbers.map((n) => n === oldNumber ? newNumber : n), reviewHadithNumbers: st.reviewHadithNumbers.map((n) => n === oldNumber ? newNumber : n) })) }));
    }
    try {
      const existing = stateRef.current.hadiths.find((h) => h.number === oldNumber);
      await api("POST", "/hadiths", {
        number: newNumber,
        text: text.trim(),
        explanation: explanation.trim() || "شرح مبسط",
        category: category.trim() || "عام",
        points: existing?.points ?? 100,
      });
    } catch (err) {
      setState((s) => ({ ...s, hadiths: prevState.hadiths }));
      console.error("doUpdateHadith error:", err);
      showToastExternal("فشل تحديث الحديث", "error");
      return false;
    }
    return true;
  }, [showToastExternal]);

  const doDeleteHadith = useCallback(async (number: number) => {
    const prevHadiths = stateRef.current.hadiths;
    const removed = prevHadiths.find((h) => h.number === number);
    setState((s) => ({ ...s, hadiths: s.hadiths.filter((h) => h.number !== number) }));
    try {
      await api("DELETE", `/hadiths/${number}`);
      if (removed) {
        showToastExternal("تم حذف الحديث", "success", {
          label: "تراجع",
          onClick: () => { void doAddHadith(removed.text, removed.explanation, removed.category); },
        });
      }
    } catch (err) {
      setState((s) => ({ ...s, hadiths: prevHadiths }));
      console.error("doDeleteHadith error:", err);
      showToastExternal("فشل حذف الحديث", "error");
    }
  }, [showToastExternal, doAddHadith]);

  const doAddEnglishUnit = useCallback(async (words: { word: string; definition: string }[]) => {
    const cleanWords = words.filter((w) => w.word.trim() && w.definition.trim());
    if (cleanWords.length === 0) return;
    try {
      const saved = await api<EnglishUnitWithWords>("POST", "/english-units", { words: cleanWords });
      setState((s) => ({ ...s, englishUnits: [...s.englishUnits, saved] }));
    } catch (e) { showToastExternal(`فشل حفظ الوحدة: ${(e as Error).message}`, "error"); }
  }, [showToastExternal]);

  const doUpdateEnglishUnit = useCallback(async (unitNumber: number, words: { word: string; definition: string }[]) => {
    const cleanWords = words.filter((w) => w.word.trim() && w.definition.trim());
    if (cleanWords.length === 0) return;
    const prevUnits = stateRef.current.englishUnits;
    setState((s) => ({ ...s, englishUnits: s.englishUnits.map((u) => u.unitNumber === unitNumber ? { ...u, words: cleanWords } : u) }));
    try {
      await api("PUT", `/english-units/${unitNumber}`, { words: cleanWords });
    } catch (err) {
      setState((s) => ({ ...s, englishUnits: prevUnits }));
      console.error("doUpdateEnglishUnit error:", err);
      showToastExternal("فشل تحديث الوحدة", "error");
    }
  }, [showToastExternal]);

  const doDeleteEnglishUnit = useCallback(async (unitNumber: number) => {
    const prevState = stateRef.current;
    const removed = prevState.englishUnits.find((u) => u.unitNumber === unitNumber);
    setState((s) => ({
      ...s, englishUnits: s.englishUnits.filter((u) => u.unitNumber !== unitNumber),
      students: s.students.map((st) => ({
        ...st, memorizedEnglishUnits: st.memorizedEnglishUnits.filter((n) => n !== unitNumber),
        reviewEnglishUnits: st.reviewEnglishUnits.filter((n) => n !== unitNumber),
      })),
    }));
    try {
      await api("DELETE", `/english-units/${unitNumber}`);
      if (removed) {
        showToastExternal("تم حذف الوحدة", "success", {
          label: "تراجع",
          onClick: () => { void doAddEnglishUnit(removed.words.map((w) => ({ word: w.word, definition: w.definition }))); },
        });
      }
    } catch (err) {
      setState(() => prevState);
      console.error("doDeleteEnglishUnit error:", err);
      showToastExternal("فشل حذف الوحدة", "error");
    }
  }, [showToastExternal, doAddEnglishUnit]);

  const doToggleHadithStatus = useCallback(async (studentId: string, hadithNumber: number, newStatus: "memorized" | "review" | "none") => {
    const prevStudents = stateRef.current.students;
    setState((s) => ({ ...s, students: s.students.map((st) => {
      if (st.id !== studentId) return st;
      const memorized = st.memorizedHadithNumbers.filter((n) => n !== hadithNumber);
      const review = st.reviewHadithNumbers.filter((n) => n !== hadithNumber);
      if (newStatus === "memorized") memorized.push(hadithNumber);
      else if (newStatus === "review") review.push(hadithNumber);
      return { ...st, memorizedHadithNumbers: memorized, reviewHadithNumbers: review };
    }) }));
    try {
      await api("POST", "/student-hadiths", { studentId, hadithNumber, status: newStatus });
      const student = prevStudents.find((s) => s.id === studentId);
      if (student && newStatus === "memorized") {
        const oldStage = getStudentStage(student);
        const newSt = { ...student, memorizedHadithNumbers: [...student.memorizedHadithNumbers, hadithNumber] };
        const newStage = getStudentStage(newSt);
        if (newStage.level > oldStage.level && onCelebration) onCelebration(student, newStage);
      }
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doToggleHadithStatus error:", err);
      showToastExternal("فشل تحديث حالة الحديث", "error");
    }
  }, [showToastExternal, onCelebration]);

  const doToggleSurahStatus = useCallback(async (studentId: string, surahNumber: number, newStatus: "memorized" | "review" | "none") => {
    const prevStudents = stateRef.current.students;
    setState((s) => ({ ...s, students: s.students.map((st) => {
      if (st.id !== studentId) return st;
      const memorized = st.memorizedSurahNumbers.filter((n) => n !== surahNumber);
      const review = st.reviewSurahNumbers.filter((n) => n !== surahNumber);
      if (newStatus === "memorized") memorized.push(surahNumber);
      else if (newStatus === "review") review.push(surahNumber);
      return { ...st, memorizedSurahNumbers: memorized, reviewSurahNumbers: review };
    }) }));
    try {
      await api("POST", "/student-surahs", { studentId, surahNumber, status: newStatus });
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doToggleSurahStatus error:", err);
      showToastExternal("فشل تحديث حالة السورة", "error");
    }
  }, [showToastExternal]);

  const doToggleSurahPageStatus = useCallback(async (studentId: string, surahNumber: number, pageIndex: number, newStatus: "memorized" | "none") => {
    const pageId = `${surahNumber}-${pageIndex}`;
    const prevStudents = stateRef.current.students;
    setState((s) => ({ ...s, students: s.students.map((st) => {
      if (st.id !== studentId) return st;
      const memorized = (st.memorizedSurahPages || []).filter((id) => id !== pageId);
      if (newStatus === "memorized") memorized.push(pageId);
      return { ...st, memorizedSurahPages: memorized };
    }) }));
    try {
      const r = newStatus === "memorized"
        ? await api("POST", "/student-surah-pages", { studentId, pageId })
        : await api("DELETE", `/student-surah-pages/${studentId}/${encodeURIComponent(pageId)}`);
      void r;
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doToggleSurahPageStatus error:", err);
      showToastExternal("فشل تحديث صفحة السورة", "error");
    }
  }, [showToastExternal]);

  const doMarkAllSurahPages = useCallback(async (studentId: string, surahNumber: number, pageCount: number) => {
    const prevStudents = stateRef.current.students;
    const student = stateRef.current.students.find((s) => s.id === studentId);
    if (!student) return;
    const memorized = [...(student.memorizedSurahPages || [])];
    let changed = false;
    for (let i = 1; i <= pageCount; i++) {
      const id = `${surahNumber}-${i}`;
      if (!memorized.includes(id)) { memorized.push(id); changed = true; }
    }
    if (!changed) return;
    setState((s) => ({ ...s, students: s.students.map((st) => st.id === studentId ? { ...st, memorizedSurahPages: memorized } : st) }));
    try {
      const pageIds = Array.from({ length: pageCount }, (_, i) => `${surahNumber}-${i + 1}`);
      await api("POST", "/student-surah-pages/batch", { studentId, pageIds });
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doMarkAllSurahPages error:", err);
      showToastExternal("فشل حفظ جميع الصفحات", "error");
    }
  }, [showToastExternal]);

  const doClearAllSurahPages = useCallback(async (studentId: string, surahNumber: number, pageCount: number) => {
    const prevStudents = stateRef.current.students;
    const student = stateRef.current.students.find((s) => s.id === studentId);
    if (!student) return;
    const memorized = (student.memorizedSurahPages || []).filter((id) => !id.startsWith(surahNumber + "-"));
    if (memorized.length === (student.memorizedSurahPages || []).length) return;
    setState((s) => ({ ...s, students: s.students.map((st) => st.id === studentId ? { ...st, memorizedSurahPages: memorized } : st) }));
    try {
      const pageIds = Array.from({ length: pageCount }, (_, i) => `${surahNumber}-${i + 1}`);
      await api("DELETE", `/student-surah-pages/batch/${studentId}`, { pageIds });
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doClearAllSurahPages error:", err);
      showToastExternal("فشل مسح الصفحات", "error");
    }
  }, [showToastExternal]);

  const doToggleEnglishStatus = useCallback(async (studentId: string, unitNumber: number, newStatus: "memorized" | "review" | "none") => {
    const prevStudents = stateRef.current.students;
    setState((s) => ({ ...s, students: s.students.map((st) => {
      if (st.id !== studentId) return st;
      const memorized = st.memorizedEnglishUnits.filter((n) => n !== unitNumber);
      const review = st.reviewEnglishUnits.filter((n) => n !== unitNumber);
      if (newStatus === "memorized") memorized.push(unitNumber);
      else if (newStatus === "review") review.push(unitNumber);
      return { ...st, memorizedEnglishUnits: memorized, reviewEnglishUnits: review };
    }) }));
    try {
      await api("POST", "/student-english-progress", { studentId, unitNumber, status: newStatus });
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doToggleEnglishStatus error:", err);
      showToastExternal("فشل تحديث حالة الوحدة الإنجليزية", "error");
    }
  }, [showToastExternal]);

  const doCheatUnlockAll = useCallback(async (studentId: string) => {
    const hadiths = stateRef.current.hadiths;
    setState((s) => ({ ...s, students: s.students.map((st) => {
      if (st.id !== studentId) return st;
      return { ...st, memorizedHadithNumbers: hadiths.map((h) => h.number) };
    }) }));
    const results = await Promise.allSettled(
      hadiths.map((h) =>
        api("POST", "/student-hadiths", { studentId, hadithNumber: h.number, status: "memorized" })
      )
    );
    const failures = results.filter((r) => r.status === "rejected").length;
    if (failures > 0) {
      console.error(`doCheatUnlockAll: ${failures}/${hadiths.length} requests failed`);
      showToastExternal(`تم فتح ${hadiths.length - failures} من أصل ${hadiths.length} حديث`, "success");
    } else {
      showToastExternal("تم فتح كل الأحاديث!", "success");
    }
  }, [showToastExternal]);

  const doResetStudentProgress = useCallback(async (studentId: string) => {
    const prevStudents = stateRef.current.students;
    const cleared = {
      memorizedHadithNumbers: [], reviewHadithNumbers: [],
      memorizedSurahNumbers: [], reviewSurahNumbers: [],
      memorizedSurahPages: [], memorizedEnglishUnits: [], reviewEnglishUnits: [],
    };
    setState((s) => ({ ...s, students: s.students.map((st) => st.id === studentId ? { ...st, ...cleared } : st) }));
    try {
      await api("DELETE", `/students/${studentId}/progress`);
      showToastExternal("تم تصفير تقدم الطالب", "success");
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doResetStudentProgress error:", err);
      showToastExternal("فشل تصفير تقدم الطالب", "error");
    }
  }, [showToastExternal]);

  const doResetAllProgress = useCallback(async () => {
    const prevStudents = stateRef.current.students;
    const cleared = {
      memorizedHadithNumbers: [], reviewHadithNumbers: [],
      memorizedSurahNumbers: [], reviewSurahNumbers: [],
      memorizedSurahPages: [], memorizedEnglishUnits: [], reviewEnglishUnits: [],
    };
    setState((s) => ({ ...s, students: s.students.map((st) => ({ ...st, ...cleared })) }));
    try {
      await Promise.allSettled(
        prevStudents.map((st) => api("DELETE", `/students/${st.id}/progress`))
      );
      showToastExternal("تم تصفير تقدم جميع الطلاب", "success");
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doResetAllProgress error:", err);
      showToastExternal("فشل تصفير تقدم الطلاب", "error");
    }
  }, [showToastExternal]);

  function getStudentStage(student: Student): Stage {
    const { hadiths, englishUnits } = stateRef.current;
    const overall = getCompletion(student, hadiths.length, englishUnits.length).overall;
    return STAGES.find((s) => overall >= s.minPct && overall <= s.maxPct) || STAGES[0];
  }

  const ctx = {
    state,
    loadAll: doLoadAll, selectStudent: doSelectStudent,
    addStudent: doAddStudent, updateStudent: doUpdateStudent, deleteStudent: doDeleteStudent,
    addHadith: doAddHadith, addBulkHadiths: doAddBulkHadiths, updateHadith: doUpdateHadith, deleteHadith: doDeleteHadith,
    addEnglishUnit: doAddEnglishUnit, updateEnglishUnit: doUpdateEnglishUnit, deleteEnglishUnit: doDeleteEnglishUnit,
    toggleHadithStatus: doToggleHadithStatus, toggleSurahStatus: doToggleSurahStatus,
    toggleSurahPageStatus: doToggleSurahPageStatus, markAllSurahPages: doMarkAllSurahPages,
    clearAllSurahPages: doClearAllSurahPages, toggleEnglishStatus: doToggleEnglishStatus,
    cheatUnlockAll: doCheatUnlockAll, resetStudentProgress: doResetStudentProgress, resetAllProgress: doResetAllProgress,
    getStudentStage,
  };

  return (
    <DataContext.Provider value={ctx}>
      {children}
    </DataContext.Provider>
  );
}


export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
