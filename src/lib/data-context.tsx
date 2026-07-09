"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { Student, Hadith, EnglishUnitWithWords, Stage } from "./types";
import { STAGES } from "./constants";
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
  getStudentNextStageInfo: (student: Student) => { nextStage: Stage; remaining: number } | null;
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

  const updateXP = useCallback((studentId: string, xp: number) => {
    setState((s) => ({ ...s, students: s.students.map((st) => st.id === studentId ? { ...st, xp } : st) }));
  }, []);

  const doAddStudent = useCallback(async (name: string, age?: number, avatar = "avatar-leaf", notes?: string) => {
    if (!name.trim()) return;
    const newStudent: Student = {
      id: "student-" + Date.now(), name: name.trim(), age, avatar, notes: notes?.trim(),
      joinedAt: new Date().toISOString().split("T")[0], memorizedHadithNumbers: [], reviewHadithNumbers: [],
      memorizedSurahNumbers: [], reviewSurahNumbers: [], memorizedSurahPages: [], memorizedEnglishUnits: [], reviewEnglishUnits: [], xp: 0,
    };
    const prevStudents = stateRef.current.students;
    setState((s) => ({ ...s, students: [...s.students, newStudent], selectedStudentId: newStudent.id }));
    try {
      await api("POST", "/students", newStudent);
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doAddStudent error:", err);
      showToastExternal("فشل حفظ بيانات الطالب", "error");
    }
  }, [showToastExternal]);

  const doUpdateStudent = useCallback(async (id: string, name: string, age?: number, avatar?: string, notes?: string) => {
    const payload = {
      id, name: name.trim(), age, avatar: avatar || "avatar-leaf",
      notes: notes?.trim(), joinedAt: new Date().toISOString().split("T")[0],
    };
    const prevStudents = stateRef.current.students;
    setState((s) => ({ ...s, students: s.students.map((st) => st.id === id ? { ...st, name: name.trim(), age, avatar: avatar || st.avatar, notes: notes?.trim() } : st) }));
    try {
      await api("PUT", `/students/${id}`, payload);
      const fresh = await api<Student[]>("GET", "/students");
      const updated = fresh.find((s) => s.id === id);
      if (updated) updateXP(id, updated.xp);
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doUpdateStudent error:", err);
      showToastExternal("فشل تحديث بيانات الطالب", "error");
    }
  }, [showToastExternal, updateXP]);

  const doDeleteStudent = useCallback(async (id: string) => {
    const prevStudents = stateRef.current.students;
    setState((s) => ({
      ...s, students: s.students.filter((st) => st.id !== id),
      selectedStudentId: s.selectedStudentId === id ? (s.students.length > 1 ? s.students.find((st) => st.id !== id)!.id : null) : s.selectedStudentId,
    }));
    try {
      await api("DELETE", `/students/${id}`);
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
  }, [showToastExternal, updateXP, doAddEnglishUnit]);

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
      const r = await api<{ xp: number }>("POST", "/student-hadiths", { studentId, hadithNumber, status: newStatus });
      updateXP(studentId, r.xp);
      const student = prevStudents.find((s) => s.id === studentId);
      if (student && newStatus === "memorized") {
        const oldStage = STAGES.find((s) => student.xp >= s.minXP && student.xp <= s.maxXP) || STAGES[0];
        const newSt = { ...student, memorizedHadithNumbers: [...student.memorizedHadithNumbers, hadithNumber] };
        const newStage = STAGES.find((s) => computeXP(newSt) >= s.minXP && computeXP(newSt) <= s.maxXP) || STAGES[0];
        if (newStage.level > oldStage.level && onCelebration) onCelebration(student, newStage);
      }
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doToggleHadithStatus error:", err);
      showToastExternal("فشل تحديث حالة الحديث", "error");
    }
  }, [showToastExternal, updateXP, onCelebration]);

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
      const r = await api<{ xp: number }>("POST", "/student-surahs", { studentId, surahNumber, status: newStatus });
      updateXP(studentId, r.xp);
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doToggleSurahStatus error:", err);
      showToastExternal("فشل تحديث حالة السورة", "error");
    }
  }, [showToastExternal, updateXP]);

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
        ? await api<{ xp: number }>("POST", "/student-surah-pages", { studentId, pageId })
        : await api<{ xp: number }>("DELETE", `/student-surah-pages/${studentId}/${encodeURIComponent(pageId)}`);
      updateXP(studentId, r.xp);
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doToggleSurahPageStatus error:", err);
      showToastExternal("فشل تحديث صفحة السورة", "error");
    }
  }, [showToastExternal, updateXP]);

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
      const r = await api<{ xp: number }>("POST", "/student-surah-pages/batch", { studentId, pageIds });
      updateXP(studentId, r.xp);
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doMarkAllSurahPages error:", err);
      showToastExternal("فشل حفظ جميع الصفحات", "error");
    }
  }, [showToastExternal, updateXP]);

  const doClearAllSurahPages = useCallback(async (studentId: string, surahNumber: number, pageCount: number) => {
    const prevStudents = stateRef.current.students;
    const student = stateRef.current.students.find((s) => s.id === studentId);
    if (!student) return;
    const memorized = (student.memorizedSurahPages || []).filter((id) => !id.startsWith(surahNumber + "-"));
    if (memorized.length === (student.memorizedSurahPages || []).length) return;
    setState((s) => ({ ...s, students: s.students.map((st) => st.id === studentId ? { ...st, memorizedSurahPages: memorized } : st) }));
    try {
      const pageIds = Array.from({ length: pageCount }, (_, i) => `${surahNumber}-${i + 1}`);
      const r = await api<{ xp: number }>("DELETE", `/student-surah-pages/batch/${studentId}`, { pageIds });
      updateXP(studentId, r.xp);
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doClearAllSurahPages error:", err);
      showToastExternal("فشل مسح الصفحات", "error");
    }
  }, [showToastExternal, updateXP]);

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
      const r = await api<{ xp: number }>("POST", "/student-english-progress", { studentId, unitNumber, status: newStatus });
      updateXP(studentId, r.xp);
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doToggleEnglishStatus error:", err);
      showToastExternal("فشل تحديث حالة الوحدة الإنجليزية", "error");
    }
  }, [showToastExternal, updateXP]);

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
    try {
      const fresh = await api<Student[]>("GET", "/students");
      const updated = fresh.find((s) => s.id === studentId);
      if (updated) updateXP(studentId, updated.xp);
    } catch (err) {
      console.error("doCheatUnlockAll XP refetch error:", err);
    }
  }, [showToastExternal, updateXP]);

  const doResetStudentProgress = useCallback(async (studentId: string) => {
    const prevStudents = stateRef.current.students;
    setState((s) => ({ ...s, students: s.students.map((st) => {
      if (st.id !== studentId) return st;
      return { ...st, memorizedHadithNumbers: [], reviewHadithNumbers: [], memorizedSurahNumbers: [], reviewSurahNumbers: [], memorizedSurahPages: [], memorizedEnglishUnits: [], reviewEnglishUnits: [], xp: 0 };
    }) }));
    try {
      await Promise.allSettled(
        stateRef.current.hadiths.map((h) =>
          api("DELETE", `/student-hadiths/${studentId}/${h.number}`)
        )
      );
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doResetStudentProgress error:", err);
    }
    showToastExternal("تم تصفير تقدم الطالب", "success");
  }, [showToastExternal]);

  const doResetAllProgress = useCallback(async () => {
    const prevStudents = stateRef.current.students;
    const allHadiths = stateRef.current.hadiths;
    setState((s) => ({ ...s, students: s.students.map((st) => ({
      ...st, memorizedHadithNumbers: [], reviewHadithNumbers: [], memorizedSurahNumbers: [], reviewSurahNumbers: [], memorizedSurahPages: [], memorizedEnglishUnits: [], reviewEnglishUnits: [], xp: 0,
    })) }));
    try {
      await Promise.allSettled(
        prevStudents.flatMap((st) => allHadiths.map((h) =>
          api("DELETE", `/student-hadiths/${st.id}/${h.number}`)
        ))
      );
      showToastExternal("تم تصفير تقدم جميع الطلاب", "success");
    } catch (err) {
      setState((s) => ({ ...s, students: prevStudents }));
      console.error("doResetAllProgress error:", err);
      showToastExternal("فشل تصفير تقدم الطلاب", "error");
    }
  }, [showToastExternal]);

  const getStudentStage = useCallback((student: Student): Stage => {
    return STAGES.find((s) => student.xp >= s.minXP && student.xp <= s.maxXP) || STAGES[0];
  }, []);

  const getStudentNextStageInfo = useCallback((student: Student) => {
    const current = getStudentStage(student);
    const next = STAGES.find((s) => s.level === current.level + 1);
    return next ? { nextStage: next, remaining: next.minXP - student.xp } : null;
  }, [getStudentStage]);

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
    getStudentStage, getStudentNextStageInfo,
  };

  return (
    <DataContext.Provider value={ctx}>
      {children}
    </DataContext.Provider>
  );
}

function computeXP(s: Student): number {
  return (
    s.memorizedHadithNumbers.length * 100 +
    s.memorizedSurahNumbers.length * 150 +
    (s.memorizedSurahPages?.length || 0) * 20 +
    s.memorizedEnglishUnits.length * 100
  );
}

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
