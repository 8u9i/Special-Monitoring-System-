"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { Student, Hadith, EnglishUnitWithWords, Stage } from "./types";
import { STAGES } from "./constants";

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

const API_BASE = "/api";

async function api<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${method} ${path} failed (${res.status})`);
  }
  return res.json();
}

interface TrackerContextType {
  state: AppState;
  auth: { checked: boolean; authenticated: boolean; user: string | null };
  toast: { message: string; type: "success" | "error"; show: (msg: string, type?: "success" | "error") => void };
  confirm: { open: boolean; message: string; onConfirm: (() => void) | null; ask: (msg: string, fn: () => void) => void; close: () => void };
  celebration: { show: boolean; student: Student | null; stage: Stage | null; trigger: (s: Student, stg: Stage) => void; dismiss: () => void };
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loadAll: (force?: boolean) => Promise<void>;
  selectStudent: (id: string) => void;
  addStudent: (name: string, age?: number, avatar?: string, notes?: string) => Promise<void>;
  updateStudent: (id: string, name: string, age?: number, avatar?: string, notes?: string) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addHadith: (text: string, reference: string, explanation: string, category: string) => Promise<void>;
  updateHadith: (oldNumber: number, newNumber: number, text: string, reference: string, explanation: string, category: string) => Promise<boolean>;
  deleteHadith: (number: number) => Promise<void>;
  toggleHadithStatus: (studentId: string, hadithNumber: number, newStatus: "memorized" | "review" | "none") => Promise<void>;
  toggleSurahStatus: (studentId: string, surahNumber: number, newStatus: "memorized" | "review" | "none") => Promise<void>;
  toggleSurahPageStatus: (studentId: string, surahNumber: number, pageIndex: number, newStatus: "memorized" | "none") => Promise<void>;
  markAllSurahPages: (studentId: string, surahNumber: number, pageCount: number) => Promise<void>;
  clearAllSurahPages: (studentId: string, surahNumber: number, pageCount: number) => Promise<void>;
  toggleEnglishStatus: (studentId: string, unitNumber: number, newStatus: "memorized" | "review" | "none") => Promise<void>;
  cheatUnlockAll: (studentId: string) => Promise<void>;
  resetStudentProgress: (studentId: string) => Promise<void>;
  getStudentStage: (student: Student) => Stage;
  getStudentNextStageInfo: (student: Student) => { nextStage: Stage; remaining: number } | null;
}

const TrackerContext = createContext<TrackerContextType | null>(null);

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    students: [], hadiths: [], englishUnits: [], selectedStudentId: null,
    searchQuery: "", categoryFilter: "all", loading: false, loaded: false,
  });
  const [auth, setAuth] = useState({ checked: false, authenticated: false, user: null as string | null });
  const [toastMsg, setToastMsg] = useState({ message: "", type: "success" as "success" | "error" });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [confirmState, setConfirmState] = useState({ open: false, message: "", onConfirm: null as (() => void) | null });
  const [celebrationState, setCelebrationState] = useState({ show: false, student: null as Student | null, stage: null as Stage | null });

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToastMsg({ message: msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg({ message: "", type: "success" }), 4000);
  }, []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  useEffect(() => {
    api<{ authenticated: boolean }>("GET", "/auth/check")
      .then((d) => setAuth({ checked: true, authenticated: d.authenticated, user: null }))
      .catch(() => setAuth({ checked: true, authenticated: false, user: null }));
  }, []);

  const doLogin = async (username: string, password: string) => {
    try {
      await api("POST", "/login", { username, password });
      setAuth({ checked: true, authenticated: true, user: username });
      return { success: true };
    } catch {
      return { success: false, error: "بيانات الدخول غير صحيحة" };
    }
  };

  const doLogout = async () => {
    await api("POST", "/logout").catch(() => {});
    setAuth({ checked: true, authenticated: false, user: null });
    setState((s) => ({ ...s, loaded: false, students: [], hadiths: [], englishUnits: [] }));
  };

  const doLoadAll = async (force = false) => {
    if (!force && state.loaded) return;
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
    } catch {
      setState((s) => ({ ...s, loading: false }));
      showToast("فشل تحميل البيانات من قاعدة البيانات", "error");
    }
  };

  const doSelectStudent = (id: string) => setState((s) => ({ ...s, selectedStudentId: id }));

  const updateXP = (studentId: string, xp: number) => {
    setState((s) => ({ ...s, students: s.students.map((st) => st.id === studentId ? { ...st, xp } : st) }));
  };

  const doAddStudent = async (name: string, age?: number, avatar = "avatar-leaf", notes?: string) => {
    if (!name.trim()) return;
    const newStudent: Student = {
      id: "student-" + Date.now(), name: name.trim(), age, avatar, notes: notes?.trim(),
      joinedAt: new Date().toISOString().split("T")[0], memorizedHadithNumbers: [], reviewHadithNumbers: [],
      memorizedSurahNumbers: [], reviewSurahNumbers: [], memorizedSurahPages: [], memorizedEnglishUnits: [], reviewEnglishUnits: [], xp: 0,
    };
    setState((s) => ({ ...s, students: [...s.students, newStudent], selectedStudentId: newStudent.id }));
    api("POST", "/students", newStudent).catch(() => showToast("فشل حفظ بيانات الطالب", "error"));
  };

  const doUpdateStudent = async (id: string, name: string, age?: number, avatar?: string, notes?: string) => {
    setState((s) => ({ ...s, students: s.students.map((st) => st.id === id ? { ...st, name: name.trim(), age, avatar: avatar || st.avatar, notes: notes?.trim() } : st) }));
    const found = state.students.find((st) => st.id === id);
    if (!found) return;
    const student = { ...found, name: name.trim(), age, avatar: avatar || found.avatar, notes: notes?.trim() } as Student;
    try {
      await api("POST", "/students", student);
      // Recalculate by re-fetching
      const fresh = await api<Student[]>("GET", "/students");
      const updated = fresh.find((s) => s.id === id);
      if (updated) updateXP(id, updated.xp);
    } catch { showToast("فشل تحديث بيانات الطالب", "error"); }
  };

  const doDeleteStudent = async (id: string) => {
    setState((s) => ({
      ...s,
      students: s.students.filter((st) => st.id !== id),
      selectedStudentId: s.selectedStudentId === id ? (s.students.length > 1 ? s.students.find((st) => st.id !== id)!.id : null) : s.selectedStudentId,
    }));
    api("DELETE", `/students/${id}`).catch(() => showToast("فشل حذف الطالب", "error"));
  };

  const doAddHadith = async (text: string, reference: string, explanation: string, category: string) => {
    if (!text.trim()) return;
    const payload = { text: text.trim(), reference: reference.trim() || "رواية صحيحة", explanation: explanation.trim() || "شرح مبسط", category: category.trim() || "عام", points: 100 };
    try {
      const saved = await api<Hadith>("POST", "/hadiths", payload);
      setState((s) => ({ ...s, hadiths: [...s.hadiths, saved] }));
    } catch (e) { showToast(`فشل حفظ الحديث: ${(e as Error).message}`, "error"); }
  };

  const doUpdateHadith = async (oldNumber: number, newNumber: number, text: string, reference: string, explanation: string, category: string): Promise<boolean> => {
    if (!text.trim() || !newNumber) return false;
    if (oldNumber !== newNumber && state.hadiths.some((h) => h.number === newNumber)) return false;
    setState((s) => ({ ...s, hadiths: s.hadiths.map((h) => h.number === oldNumber ? { ...h, number: newNumber, text: text.trim(), reference: reference.trim(), explanation: explanation.trim(), category: category.trim() } : h) }));
    if (oldNumber !== newNumber) {
      setState((s) => ({ ...s, students: s.students.map((st) => ({ ...st, memorizedHadithNumbers: st.memorizedHadithNumbers.map((n) => n === oldNumber ? newNumber : n), reviewHadithNumbers: st.reviewHadithNumbers.map((n) => n === oldNumber ? newNumber : n) })) }));
    }
    const hadith = state.hadiths.find((h) => h.number === newNumber);
    if (hadith) api("POST", "/hadiths", hadith).catch(() => showToast("فشل تحديث الحديث", "error"));
    return true;
  };

  const doDeleteHadith = async (number: number) => {
    setState((s) => ({ ...s, hadiths: s.hadiths.filter((h) => h.number !== number) }));
    api("DELETE", `/hadiths/${number}`).catch(() => showToast("فشل حذف الحديث", "error"));
  };

  const doToggleHadithStatus = async (studentId: string, hadithNumber: number, newStatus: "memorized" | "review" | "none") => {
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
      const student = state.students.find((s) => s.id === studentId);
      if (student) {
        const oldStage = getStudentStage(student);
        const newSt = { ...student, memorizedHadithNumbers: newStatus === "memorized" ? [...student.memorizedHadithNumbers, hadithNumber] : student.memorizedHadithNumbers.filter((n) => n !== hadithNumber) };
        const newStage = STAGES.find((s) => computeXP(newSt) >= s.minXP && computeXP(newSt) <= s.maxXP) || STAGES[0];
        if (newStage.level > oldStage.level) setCelebrationState({ show: true, student, stage: newStage });
      }
    } catch { showToast("فشل تحديث حالة الحديث", "error"); }
  };

  const doToggleSurahStatus = async (studentId: string, surahNumber: number, newStatus: "memorized" | "review" | "none") => {
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
    } catch { showToast("فشل تحديث حالة السورة", "error"); }
  };

  const doToggleSurahPageStatus = async (studentId: string, surahNumber: number, pageIndex: number, newStatus: "memorized" | "none") => {
    const pageId = `${surahNumber}-${pageIndex}`;
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
    } catch { showToast("فشل تحديث صفحة السورة", "error"); }
  };

  const doMarkAllSurahPages = async (studentId: string, surahNumber: number, pageCount: number) => {
    const student = state.students.find((s) => s.id === studentId);
    if (!student) return;
    const memorized = [...(student.memorizedSurahPages || [])];
    let changed = false;
    for (let i = 1; i <= pageCount; i++) {
      const id = `${surahNumber}-${i}`;
      if (!memorized.includes(id)) { memorized.push(id); changed = true; }
    }
    if (!changed) return;
    setState((s) => ({ ...s, students: s.students.map((st) => st.id === studentId ? { ...st, memorizedSurahPages: memorized } : st) }));
    let last: Promise<{ xp: number }> = Promise.resolve({ xp: 0 });
    for (let i = 1; i <= pageCount; i++) last = api<{ xp: number }>("POST", "/student-surah-pages", { studentId, pageId: `${surahNumber}-${i}` }).catch(() => ({ xp: 0 }));
    const r = await last;
    updateXP(studentId, r.xp);
  };

  const doClearAllSurahPages = async (studentId: string, surahNumber: number, pageCount: number) => {
    const student = state.students.find((s) => s.id === studentId);
    if (!student) return;
    const memorized = (student.memorizedSurahPages || []).filter((id) => !id.startsWith(surahNumber + "-"));
    if (memorized.length === (student.memorizedSurahPages || []).length) return;
    setState((s) => ({ ...s, students: s.students.map((st) => st.id === studentId ? { ...st, memorizedSurahPages: memorized } : st) }));
    let last: Promise<{ xp: number }> = Promise.resolve({ xp: 0 });
    for (let i = 1; i <= pageCount; i++) last = api<{ xp: number }>("DELETE", `/student-surah-pages/${studentId}/${surahNumber}-${i}`).catch(() => ({ xp: 0 }));
    const r = await last;
    updateXP(studentId, r.xp);
  };

  const doToggleEnglishStatus = async (studentId: string, unitNumber: number, newStatus: "memorized" | "review" | "none") => {
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
    } catch { showToast("فشل تحديث حالة الوحدة الإنجليزية", "error"); }
  };

  const doCheatUnlockAll = async (studentId: string) => {
    const hadiths = state.hadiths;
    setState((s) => ({ ...s, students: s.students.map((st) => {
      if (st.id !== studentId) return st;
      return { ...st, memorizedHadithNumbers: hadiths.map((h) => h.number) };
    }) }));
    for (const h of hadiths) {
      await api("POST", "/student-hadiths", { studentId, hadithNumber: h.number, status: "memorized" }).catch(() => {});
    }
    try {
      const r = await api<{ xp: number }>("POST", "/student-hadiths", { studentId, hadithNumber: hadiths[hadiths.length - 1]?.number || 0, status: "memorized" });
      updateXP(studentId, r.xp);
    } catch {}
    showToast("تم فتح كل الأحاديث!", "success");
  };

  const doResetStudentProgress = async (studentId: string) => {
    setState((s) => ({ ...s, students: s.students.map((st) => {
      if (st.id !== studentId) return st;
      return { ...st, memorizedHadithNumbers: [], reviewHadithNumbers: [], memorizedSurahNumbers: [], reviewSurahNumbers: [], memorizedSurahPages: [], memorizedEnglishUnits: [], reviewEnglishUnits: [], xp: 0 };
    }) }));
    // We'd need to DELETE all junction rows for this student — batch them
    for (const h of state.hadiths) {
      api("DELETE", `/student-hadiths/${studentId}/${h.number}`).catch(() => {});
    }
    showToast("تم تصفير تقدم الطالب", "success");
  };

  const getStudentStage = (student: Student): Stage => STAGES.find((s) => student.xp >= s.minXP && student.xp <= s.maxXP) || STAGES[0];
  const getStudentNextStageInfo = (student: Student) => {
    const current = getStudentStage(student);
    const next = STAGES.find((s) => s.level === current.level + 1);
    return next ? { nextStage: next, remaining: next.minXP - student.xp } : null;
  };

  const confirmAsk = useCallback((msg: string, fn: () => void) => {
    setConfirmState({ open: true, message: msg, onConfirm: fn });
  }, []);

  const confirmClose = useCallback(() => setConfirmState({ open: false, message: "", onConfirm: null }), []);

  const ctx: TrackerContextType = {
    state, auth,
    toast: { ...toastMsg, show: showToast },
    confirm: { ...confirmState, ask: confirmAsk, close: confirmClose },
    celebration: { ...celebrationState, trigger: (s, stg) => setCelebrationState({ show: true, student: s, stage: stg }), dismiss: () => setCelebrationState({ show: false, student: null, stage: null }) },
    login: doLogin, logout: doLogout, loadAll: doLoadAll, selectStudent: doSelectStudent,
    addStudent: doAddStudent, updateStudent: doUpdateStudent, deleteStudent: doDeleteStudent,
    addHadith: doAddHadith, updateHadith: doUpdateHadith, deleteHadith: doDeleteHadith,
    toggleHadithStatus: doToggleHadithStatus, toggleSurahStatus: doToggleSurahStatus,
    toggleSurahPageStatus: doToggleSurahPageStatus, markAllSurahPages: doMarkAllSurahPages,
    clearAllSurahPages: doClearAllSurahPages, toggleEnglishStatus: doToggleEnglishStatus,
    cheatUnlockAll: doCheatUnlockAll, resetStudentProgress: doResetStudentProgress,
    getStudentStage, getStudentNextStageInfo,
  };

  return React.createElement(TrackerContext.Provider, { value: ctx }, children);
}

function computeXP(s: Student): number {
  return (
    s.memorizedHadithNumbers.length * 100 +
    s.memorizedSurahNumbers.length * 150 +
    (s.memorizedSurahPages?.length || 0) * 20 +
    s.memorizedEnglishUnits.length * 100
  );
}

export function useTracker(): TrackerContextType {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error("useTracker must be used within TrackerProvider");
  return ctx;
}
