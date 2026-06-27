import {
  Injectable,
  signal,
  computed,
  inject,
} from "@angular/core";
import { Hadith } from "./hadith-data";

import { ApiService } from "./api.service";
import { ToastService } from "./shared/services/toast.service";

export interface VocabWord {
  word: string;
  definition: string;
}

export interface VocabList {
  id: string;
  name: string;
  words: VocabWord[];
}

export interface BadgeDefinition {
  id: number;
  name: string;
  description: string;
  icon: string;
  trail: string;
  threshold: number;
  points: number;
}

export interface StudentBadge {
  student_id: string;
  badge_id: number;
  earned_at: string;
  name: string;
  description: string;
  icon: string;
  trail: string;
  threshold: number;
  points: number;
}

export interface Student {
  id: string;
  name: string;
  age?: number;
  avatar: string;
  notes?: string;
  joinedAt: string;
  memorizedHadithNumbers: number[];
  reviewHadithNumbers: number[];
  memorizedSurahNumbers: number[];
  reviewSurahNumbers: number[];
  memorizedSurahPages: string[];
  memorizedVocabWords: string[];
  reviewVocabWords: string[];
  memorizedEnglishUnits: string[];
  reviewEnglishUnits: string[];
  xp: number;
}

export const QURAN_SURAHS: {
  number: number;
  name: string;
  pagesCount?: number;
}[] = [
  { number: 1, name: "الفاتحة" },
  { number: 2, name: "البقرة", pagesCount: 48 },
  { number: 3, name: "آل عمران", pagesCount: 27 },
  { number: 4, name: "النساء", pagesCount: 29 },
  { number: 5, name: "المائدة", pagesCount: 22 },
  { number: 6, name: "الأنعام", pagesCount: 23 },
  { number: 7, name: "الأعراف", pagesCount: 26 },
  { number: 8, name: "الأنفال", pagesCount: 10 },
  { number: 9, name: "التوبة", pagesCount: 21 },
  { number: 10, name: "يونس", pagesCount: 13 },
  { number: 11, name: "هود", pagesCount: 13 },
  { number: 12, name: "يوسف", pagesCount: 13 },
  { number: 13, name: "الرعد", pagesCount: 6 },
  { number: 14, name: "إبراهيم", pagesCount: 7 },
  { number: 15, name: "الحجر", pagesCount: 5 },
  { number: 16, name: "النحل", pagesCount: 14 },
  { number: 17, name: "الإسراء", pagesCount: 11 },
  { number: 18, name: "الكهف", pagesCount: 11 },
  { number: 19, name: "مريم", pagesCount: 7 },
  { number: 20, name: "طه", pagesCount: 9 },
  { number: 21, name: "الأنبياء", pagesCount: 10 },
  { number: 22, name: "الحج", pagesCount: 10 },
  { number: 23, name: "المؤمنون", pagesCount: 8 },
  { number: 24, name: "النور", pagesCount: 9 },
  { number: 25, name: "الفرقان", pagesCount: 7 },
  { number: 26, name: "الشعراء", pagesCount: 10 },
  { number: 27, name: "النمل", pagesCount: 9 },
  { number: 28, name: "القصص", pagesCount: 11 },
  { number: 29, name: "العنكبوت", pagesCount: 8 },
  { number: 30, name: "الروم", pagesCount: 6 },
  { number: 31, name: "لقمان", pagesCount: 4 },
  { number: 32, name: "السجدة", pagesCount: 3 },
  { number: 33, name: "الأحزاب", pagesCount: 10 },
  { number: 34, name: "سبأ", pagesCount: 6 },
  { number: 35, name: "فاطر", pagesCount: 6 },
  { number: 36, name: "يس", pagesCount: 6 },
  { number: 37, name: "الصافات", pagesCount: 7 },
  { number: 38, name: "ص", pagesCount: 5 },
  { number: 39, name: "الزمر", pagesCount: 9 },
  { number: 40, name: "غافر", pagesCount: 9 },
  { number: 41, name: "فصلت", pagesCount: 6 },
  { number: 42, name: "الشورى", pagesCount: 6 },
  { number: 43, name: "الزخرف", pagesCount: 7 },
  { number: 44, name: "الدخان", pagesCount: 3 },
  { number: 45, name: "الجاثية", pagesCount: 4 },
  { number: 46, name: "الأحقاف", pagesCount: 5 },
  { number: 47, name: "محمد", pagesCount: 4 },
  { number: 48, name: "الفتح", pagesCount: 5 },
  { number: 49, name: "الحجرات", pagesCount: 3 },
  { number: 50, name: "ق", pagesCount: 3 },
  { number: 51, name: "الذاريات", pagesCount: 3 },
  { number: 52, name: "الطور", pagesCount: 3 },
  { number: 53, name: "النجم", pagesCount: 3 },
  { number: 54, name: "القمر", pagesCount: 3 },
  { number: 55, name: "الرحمن", pagesCount: 3 },
  { number: 56, name: "الواقعة", pagesCount: 3 },
  { number: 57, name: "الحديد", pagesCount: 4 },
  { number: 58, name: "المجادلة", pagesCount: 3 },
  { number: 59, name: "الحشر", pagesCount: 4 },
  { number: 60, name: "الممتحنة", pagesCount: 3 },
  { number: 61, name: "الصف", pagesCount: 2 },
  { number: 62, name: "الجمعة", pagesCount: 2 },
  { number: 63, name: "المنافقون", pagesCount: 2 },
  { number: 64, name: "التغابن", pagesCount: 2 },
  { number: 65, name: "الطلاق", pagesCount: 2 },
  { number: 66, name: "التحريم", pagesCount: 2 },
  { number: 67, name: "الملك", pagesCount: 3 },
  { number: 68, name: "القلم", pagesCount: 2 },
  { number: 69, name: "الحاقة", pagesCount: 2 },
  { number: 70, name: "المعارج", pagesCount: 2 },
  { number: 71, name: "نوح", pagesCount: 2 },
  { number: 72, name: "الجن", pagesCount: 2 },
  { number: 73, name: "المزمل", pagesCount: 2 },
  { number: 74, name: "المدثر", pagesCount: 2 },
  { number: 75, name: "القيامة", pagesCount: 2 },
  { number: 76, name: "الإنسان", pagesCount: 2 },
  { number: 77, name: "المرسلات", pagesCount: 2 },
  { number: 78, name: "النبأ", pagesCount: 2 },
  { number: 79, name: "النازعات", pagesCount: 2 },
  { number: 80, name: "عبس" },
  { number: 81, name: "التكوير" },
  { number: 82, name: "الانفطار" },
  { number: 83, name: "المطففين" },
  { number: 84, name: "الانشقاق" },
  { number: 85, name: "البروج" },
  { number: 86, name: "الطارق" },
  { number: 87, name: "الأعلى" },
  { number: 88, name: "الغاشية" },
  { number: 89, name: "الفجر" },
  { number: 90, name: "البلد" },
  { number: 91, name: "الشمس" },
  { number: 92, name: "الليل" },
  { number: 93, name: "الضحى" },
  { number: 94, name: "الشرح" },
  { number: 95, name: "التين" },
  { number: 96, name: "العلق" },
  { number: 97, name: "القدر" },
  { number: 98, name: "البينة" },
  { number: 99, name: "الزلزلة" },
  { number: 100, name: "العاديات" },
  { number: 101, name: "القارعة" },
  { number: 102, name: "التكاثر" },
  { number: 103, name: "العصر" },
  { number: 104, name: "الهمزة" },
  { number: 105, name: "الفيل" },
  { number: 106, name: "قريش" },
  { number: 107, name: "الماعون" },
  { number: 108, name: "الكوثر" },
  { number: 109, name: "الكافرون" },
  { number: 110, name: "النصر" },
  { number: 111, name: "المسد" },
  { number: 112, name: "الإخلاص" },
  { number: 113, name: "الفلق" },
  { number: 114, name: "الناس" },
];

export interface EnglishUnit {
  id: string;
  book: number;
  unit: number;
}

export const ENGLISH_BOOKS = [1, 2, 3, 4, 5, 6];
export const ENGLISH_UNITS_PER_BOOK = 30;
export const ENGLISH_UNITS: EnglishUnit[] = [];
for (const b of ENGLISH_BOOKS) {
  for (let u = 1; u <= ENGLISH_UNITS_PER_BOOK; u++) {
    ENGLISH_UNITS.push({ id: `b${b}-u${u}`, book: b, unit: u });
  }
}

export interface Stage {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  description: string;
  colorClass: string;
  badgeIcon: string;
  bgHex: string;
}

export const STAGES: Stage[] = [
  { level: 1, name: "مرحلة البذرة", minXP: 0, maxXP: 1000, description: "بداية مباركة ونبتة صالحة في رياض المعرفة.", colorClass: "text-amber-700 bg-amber-50 border-amber-300", badgeIcon: "eco", bgHex: "#FAF7F2" },
  { level: 2, name: "مرحلة الشتلة", minXP: 1001, maxXP: 3000, description: "تنمو المعرفة وتترسخ خطى الحفظ في القلوب.", colorClass: "text-[#6B8F6B] bg-emerald-50/50 border-[#A3B18A]", badgeIcon: "yard", bgHex: "#F5F8F5" },
  { level: 3, name: "مرحلة الغصن", minXP: 3001, maxXP: 6000, description: "غصن يافع يرتوي بالقرآن والسنة واللغة النافعة.", colorClass: "text-[#41644A] bg-green-50 border-green-300", badgeIcon: "nature", bgHex: "#EFF5EF" },
  { level: 4, name: "مرحلة الشجرة المثمرة", minXP: 6001, maxXP: 10000, description: "أثمر السعي والجد، وبدأت الحكمة تظهر.", colorClass: "text-emerald-800 bg-emerald-100/50 border-emerald-400", badgeIcon: "local_florist", bgHex: "#EBF5EB" },
  { level: 5, name: "مرحلة الظل الممتد", minXP: 10001, maxXP: 999999, description: "تاج الحافظين، يظلل من حوله بنور وسكينة وعلم واسع.", colorClass: "text-indigo-900 bg-indigo-50 border-indigo-300", badgeIcon: "park", bgHex: "#F2F4FA" },
];

@Injectable({ providedIn: "root" })
export class TrackerState {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  // Reactive Signals
  students = signal<Student[]>([]);
  hadiths = signal<Hadith[]>([]);
  vocabLists = signal<VocabList[]>([]);
  selectedStudentId = signal<string | null>(null);
  searchQuery = signal<string>("");
  categoryFilter = signal<string>("all");
  loading = signal(false);
  loaded = signal(false);
  badgeDefinitions = signal<BadgeDefinition[]>([]);
  studentBadges = signal<StudentBadge[]>([]);

  /**
   * Call after authentication to load data from the API.
   * Does nothing if already loaded.
   */
  async loadAll() {
    if (this.loaded()) return;
    this.loading.set(true);
    try {
      const [apiStudents, apiHadiths, apiVocab, apiBadges, apiStudentBadges] = await Promise.all([
        this.api.getStudents(),
        this.api.getHadiths(),
        this.api.getVocabLists(),
        this.api.getBadges(),
        this.api.getAllStudentBadges(),
      ]);

      // Use real database data only — no auto-seeding of sample data
      this.students.set(apiStudents);
      this.hadiths.set(apiHadiths);
      this.vocabLists.set(apiVocab);
      this.badgeDefinitions.set(apiBadges);
      this.studentBadges.set(apiStudentBadges);

      if (this.students().length > 0 && !this.selectedStudentId()) {
        this.selectedStudentId.set(this.students()[0].id);
      }
      this.loaded.set(true);
    } catch (e) {
      console.error("Failed to load from API", e);
      this.toast.show("فشل تحميل البيانات من قاعدة البيانات", "error");
    } finally {
      this.loading.set(false);
    }
  }

  public calculateXP(s: Partial<Student>): number {
    return (s.memorizedHadithNumbers?.length || 0) * 100 +
      (s.memorizedSurahNumbers?.length || 0) * 150 +
      (s.memorizedSurahPages?.length || 0) * 20 +
      (s.memorizedVocabWords?.length || 0) * 5 +
      (s.memorizedEnglishUnits?.length || 0) * 100;
  }

  selectedStudent = computed(() => {
    const id = this.selectedStudentId();
    if (!id) return null;
    return this.students().find((s) => s.id === id) || null;
  });

  getStudentStage(student: Student): Stage {
    return STAGES.find((s) => student.xp >= s.minXP && student.xp <= s.maxXP) || STAGES[0];
  }

  getStudentNextStageInfo(student: Student) {
    const currentStage = this.getStudentStage(student);
    const nextStage = STAGES.find((s) => s.level === currentStage.level + 1);
    if (!nextStage) return null;
    return { nextStage, remaining: nextStage.minXP - student.xp };
  }

  getStudentBadges(studentId: string): StudentBadge[] {
    return this.studentBadges().filter((b) => b.student_id === studentId);
  }

  getStudentBadgesByTrail(studentId: string, trail: string): StudentBadge[] {
    return this.studentBadges().filter((b) => b.student_id === studentId && b.trail === trail);
  }

  async refreshBadges() {
    try {
      const [badges, studentBadges] = await Promise.all([
        this.api.getBadges(),
        this.api.getAllStudentBadges(),
      ]);
      this.badgeDefinitions.set(badges);
      this.studentBadges.set(studentBadges);
    } catch (e) {
      console.error('refreshBadges', e);
    }
  }

  stats = computed(() => {
    const list = this.students();
    if (list.length === 0) return { totalStudents: 0, totalXP: 0, averageXP: 0, topStudent: null };
    const totalXP = list.reduce((sum, s) => sum + s.xp, 0);
    const topStudent = list.reduce((a, b) => (a.xp > b.xp ? a : b));
    return { totalStudents: list.length, totalXP, averageXP: Math.round((totalXP / list.length) * 10) / 10, topStudent: topStudent.xp > 0 ? topStudent : null };
  });

  categories = computed(() => {
    const cats = new Set<string>();
    this.hadiths().forEach((h) => cats.add(h.category));
    return Array.from(cats);
  });

  // ──────────────────────────────
  // Student actions
  // ──────────────────────────────
  addStudent(name: string, age?: number, avatar = "avatar-leaf", notes?: string) {
    if (!name.trim()) return;
    const newStudent: Student = {
      id: "student-" + Date.now(), name: name.trim(), age: age ? Number(age) : undefined, avatar, notes: notes?.trim() || undefined,
      joinedAt: new Date().toISOString().split("T")[0], memorizedHadithNumbers: [], reviewHadithNumbers: [],
      memorizedSurahNumbers: [], reviewSurahNumbers: [], memorizedSurahPages: [], memorizedVocabWords: [],
      reviewVocabWords: [], memorizedEnglishUnits: [], reviewEnglishUnits: [], xp: 0,
    };
    this.students.update((list) => [...list, newStudent]);
    this.selectedStudentId.set(newStudent.id);
    this.api.saveStudent(newStudent).catch((e) => { console.error('saveStudent', e); this.toast.show("فشل حفظ بيانات الطالب", "error"); });
  }

  updateStudent(id: string, name: string, age?: number, avatar?: string, notes?: string) {
    this.students.update((list) => list.map((s) =>
      s.id === id ? { ...s, name: name.trim(), age: age ? Number(age) : undefined, avatar: avatar || s.avatar, notes: notes?.trim() || undefined } : s
    ));
    const student = this.students().find((s) => s.id === id);
    if (student) this.api.saveStudent(student).catch((e) => { console.error('updateStudent', e); this.toast.show("فشل تحديث بيانات الطالب", "error"); });
  }

  deleteStudent(id: string) {
    this.students.update((list) => list.filter((s) => s.id !== id));
    if (this.selectedStudentId() === id) {
      this.selectedStudentId.set(this.students().length > 0 ? this.students()[0].id : null);
    }
    this.api.deleteStudent(id).catch((e) => { console.error('deleteStudent', e); this.toast.show("فشل حذف الطالب", "error"); });
  }

  // ──────────────────────────────
  // Hadith actions
  // ──────────────────────────────
  addHadith(title: string, text: string, reference: string, explanation: string, category: string, badgeName?: string, badgeIcon?: string) {
    if (!title.trim() || !text.trim()) return;
    const list = this.hadiths();
    const nextNum = list.length > 0 ? Math.max(...list.map((h) => h.number)) + 1 : 1;
    const newHadith: Hadith = { number: nextNum, title: title.trim(), text: text.trim(), reference: reference.trim() || "رواية صحيحة", explanation: explanation.trim() || "شرح مبسط", category: category.trim() || "عام", points: 100, badgeName: badgeName?.trim() || `وسام ${title.trim()}`, badgeIcon: badgeIcon?.trim() || "stars" };
    this.hadiths.update((prev) => [...prev, newHadith]);
    this.api.saveHadith(newHadith).catch((e) => { console.error('saveHadith', e); this.toast.show("فشل حفظ الحديث", "error"); });
  }

  updateHadith(oldNumber: number, newNumber: number, title: string, text: string, reference: string, explanation: string, category: string, badgeName?: string, badgeIcon?: string): boolean {
    if (!title.trim() || !text.trim() || !newNumber) return false;
    if (oldNumber !== newNumber && this.hadiths().some((h) => h.number === newNumber)) return false;
    this.hadiths.update((list) => list.map((h) =>
      h.number === oldNumber ? { ...h, number: newNumber, title: title.trim(), text: text.trim(), reference: reference.trim(), explanation: explanation.trim(), category: category.trim(), badgeName: badgeName?.trim() || h.badgeName, badgeIcon: badgeIcon?.trim() || h.badgeIcon } : h
    ));
    if (oldNumber !== newNumber) {
      this.students.update((list) => list.map((s) => ({
        ...s, memorizedHadithNumbers: s.memorizedHadithNumbers.map((n) => n === oldNumber ? newNumber : n), reviewHadithNumbers: s.reviewHadithNumbers.map((n) => n === oldNumber ? newNumber : n),
      })));
    }
    const hadith = this.hadiths().find((h) => h.number === newNumber);
    if (hadith) this.api.saveHadith(hadith).catch((e) => { console.error('updateHadith', e); this.toast.show("فشل تحديث الحديث", "error"); });
    return true;
  }

  deleteHadith(number: number) {
    this.hadiths.update((list) => list.filter((h) => h.number !== number));
    this.students.update((list) => list.map((s) => ({
      ...s, memorizedHadithNumbers: s.memorizedHadithNumbers.filter((n) => n !== number), reviewHadithNumbers: s.reviewHadithNumbers.filter((n) => n !== number), xp: this.calculateXP({ ...s, memorizedHadithNumbers: s.memorizedHadithNumbers.filter((n) => n !== number), reviewHadithNumbers: s.reviewHadithNumbers.filter((n) => n !== number) }),
    })));
    this.api.deleteHadith(number).catch((e) => { console.error('deleteHadith', e); this.toast.show("فشل حذف الحديث", "error"); });
  }

  // ──────────────────────────────
  // Status toggles
  // ──────────────────────────────
  toggleHadithStatus(studentId: string, hadithNumber: number, newStatus: "memorized" | "review" | "none") {
    this.students.update((list) => list.map((s) => {
      if (s.id !== studentId) return s;
      let memorized = s.memorizedHadithNumbers.filter((n) => n !== hadithNumber);
      let review = s.reviewHadithNumbers.filter((n) => n !== hadithNumber);
      if (newStatus === "memorized") { memorized.push(hadithNumber); memorized.sort((a, b) => a - b); }
      else if (newStatus === "review") { review.push(hadithNumber); review.sort((a, b) => a - b); }
      return { ...s, memorizedHadithNumbers: memorized, reviewHadithNumbers: review, xp: this.calculateXP({ ...s, memorizedHadithNumbers: memorized, reviewHadithNumbers: review }) };
    }));
    this.api.setHadithStatus(studentId, hadithNumber, newStatus).catch((e) => { console.error('setHadithStatus', e); this.toast.show("فشل تحديث حالة الحديث", "error"); });
  }

  toggleHadithQuick(studentId: string, hadithNumber: number) {
    const student = this.students().find((s) => s.id === studentId);
    if (!student) return;
    this.toggleHadithStatus(studentId, hadithNumber, student.memorizedHadithNumbers.includes(hadithNumber) ? "none" : "memorized");
  }

  toggleSurahStatus(studentId: string, surahNumber: number, newStatus: "memorized" | "review" | "none") {
    this.students.update((list) => list.map((s) => {
      if (s.id !== studentId) return s;
      let memorized = s.memorizedSurahNumbers.filter((n) => n !== surahNumber);
      let review = s.reviewSurahNumbers.filter((n) => n !== surahNumber);
      if (newStatus === "memorized") { memorized.push(surahNumber); memorized.sort((a, b) => a - b); }
      else if (newStatus === "review") { review.push(surahNumber); review.sort((a, b) => a - b); }
      return { ...s, memorizedSurahNumbers: memorized, reviewSurahNumbers: review, xp: this.calculateXP({ ...s, memorizedSurahNumbers: memorized, reviewSurahNumbers: review }) };
    }));
    this.api.setSurahStatus(studentId, surahNumber, newStatus).catch((e) => { console.error('setSurahStatus', e); this.toast.show("فشل تحديث حالة السورة", "error"); });
  }

  toggleSurahQuick(studentId: string, surahNumber: number) {
    const student = this.students().find((s) => s.id === studentId);
    if (!student) return;
    this.toggleSurahStatus(studentId, surahNumber, student.memorizedSurahNumbers.includes(surahNumber) ? "none" : "memorized");
  }

  toggleSurahPageStatus(studentId: string, surahNumber: number, pageIndex: number, newStatus: "memorized" | "none") {
    const pageId = `${surahNumber}-${pageIndex}`;
    this.students.update((list) => list.map((s) => {
      if (s.id !== studentId) return s;
      let memorized = [...(s.memorizedSurahPages || [])].filter((id) => id !== pageId);
      if (newStatus === "memorized") memorized.push(pageId);
      return { ...s, memorizedSurahPages: memorized, xp: this.calculateXP({ ...s, memorizedSurahPages: memorized }) };
    }));
    if (newStatus === 'memorized') this.api.markSurahPage(studentId, pageId).catch(() => this.toast.show("فشل تحديث صفحة السورة", "error"));
    else this.api.unmarkSurahPage(studentId, pageId).catch(() => this.toast.show("فشل تحديث صفحة السورة", "error"));
  }

  markAllSurahPages(studentId: string, surahNumber: number, pageCount: number) {
    const student = this.students().find((s) => s.id === studentId);
    if (!student) return;
    const memorized = [...(student.memorizedSurahPages || [])];
    let changed = false;
    for (let i = 1; i <= pageCount; i++) { const id = `${surahNumber}-${i}`; if (!memorized.includes(id)) { memorized.push(id); changed = true; } }
    if (!changed) return;
    this.students.update((list) => list.map((s) => s.id === studentId ? { ...s, memorizedSurahPages: memorized, xp: this.calculateXP({ ...s, memorizedSurahPages: memorized }) } : s));
    for (let i = 1; i <= pageCount; i++) this.api.markSurahPage(studentId, `${surahNumber}-${i}`).catch(() => this.toast.show("فشل تحديث صفحات السورة", "error"));
  }

  clearAllSurahPages(studentId: string, surahNumber: number, pageCount: number) {
    this.students.update((list) => list.map((s) => {
      if (s.id !== studentId) return s;
      const memorized = (s.memorizedSurahPages || []).filter((id) => !id.startsWith(surahNumber + '-'));
      return { ...s, memorizedSurahPages: memorized, xp: this.calculateXP({ ...s, memorizedSurahPages: memorized }) };
    }));
  }

  toggleEnglishStatus(studentId: string, unitId: string, newStatus: "memorized" | "review" | "none") {
    this.students.update((list) => list.map((s) => {
      if (s.id !== studentId) return s;
      let memorized = s.memorizedEnglishUnits.filter((id) => id !== unitId);
      let review = s.reviewEnglishUnits.filter((id) => id !== unitId);
      if (newStatus === "memorized") memorized.push(unitId);
      else if (newStatus === "review") review.push(unitId);
      return { ...s, memorizedEnglishUnits: memorized, reviewEnglishUnits: review, xp: this.calculateXP({ ...s, memorizedEnglishUnits: memorized, reviewEnglishUnits: review }) };
    }));
    this.api.setEnglishUnitStatus(studentId, unitId, newStatus).catch((e) => { console.error('setEnglish', e); this.toast.show("فشل تحديث حالة الوحدة الإنجليزية", "error"); });
  }

  toggleEnglishQuick(studentId: string, unitId: string) {
    const student = this.students().find((s) => s.id === studentId);
    if (!student) return;
    this.toggleEnglishStatus(studentId, unitId, student.memorizedEnglishUnits.includes(unitId) ? "none" : "memorized");
  }

  toggleVocabStatus(studentId: string, listId: string, wordIndex: number, newStatus: "memorized" | "review" | "none") {
    const vocabId = `${listId}-${wordIndex}`;
    this.students.update((list) => list.map((s) => {
      if (s.id !== studentId) return s;
      let memorized = [...(s.memorizedVocabWords || [])].filter((id) => id !== vocabId);
      let review = [...(s.reviewVocabWords || [])].filter((id) => id !== vocabId);
      if (newStatus === "memorized") memorized.push(vocabId);
      else if (newStatus === "review") review.push(vocabId);
      return { ...s, memorizedVocabWords: memorized, reviewVocabWords: review, xp: this.calculateXP({ ...s, memorizedVocabWords: memorized, reviewVocabWords: review }) };
    }));
    this.api.setVocabStatus(studentId, vocabId, newStatus).catch((e) => { console.error('setVocab', e); this.toast.show("فشل تحديث حالة المفردات", "error"); });
  }

  toggleVocabQuick(studentId: string, listId: string, wordIndex: number) {
    const student = this.students().find((s) => s.id === studentId);
    if (!student) return;
    const vocabId = `${listId}-${wordIndex}`;
    this.toggleVocabStatus(studentId, listId, wordIndex, (student.memorizedVocabWords || []).includes(vocabId) ? "none" : "memorized");
  }

  markAllVocab(studentId: string, listId: string, wordCount: number) {
    const student = this.students().find((s) => s.id === studentId);
    if (!student) return;
    const memorized = [...(student.memorizedVocabWords || [])];
    let changed = false;
    for (let i = 0; i < wordCount; i++) { const id = `${listId}-${i}`; if (!memorized.includes(id)) { memorized.push(id); changed = true; } }
    if (!changed) return;
    this.students.update((list) => list.map((s) => s.id === studentId ? { ...s, memorizedVocabWords: memorized, xp: this.calculateXP({ ...s, memorizedVocabWords: memorized }) } : s));
    for (let i = 0; i < wordCount; i++) this.api.setVocabStatus(studentId, `${listId}-${i}`, 'memorized').catch(() => this.toast.show("فشل تحديث المفردات", "error"));
  }

  clearAllVocab(studentId: string, listId: string, wordCount: number) {
    this.students.update((list) => list.map((s) => {
      if (s.id !== studentId) return s;
      const memorized = (s.memorizedVocabWords || []).filter((id) => !id.startsWith(listId + '-'));
      return { ...s, memorizedVocabWords: memorized, xp: this.calculateXP({ ...s, memorizedVocabWords: memorized }) };
    }));
  }

  // ──────────────────────────────
  // Vocab list management
  // ──────────────────────────────
  addVocabList(name: string, rawText: string) {
    const words = rawText.split("\n").filter((l) => l.trim()).map((line) => {
      const parts = line.split(":");
      return { word: parts[0]?.trim() || "", definition: parts.slice(1).join(":").trim() || "" };
    }).filter((w) => w.word);
    const newList: VocabList = { id: `vlist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, name: name || "قائمة مفردات", words };
    this.vocabLists.update((prev) => [...prev, newList]);
    this.api.saveVocabList(newList).catch((e) => { console.error('saveVocabList', e); this.toast.show("فشل حفظ قائمة المفردات", "error"); });
  }

  deleteVocabList(id: string) {
    this.vocabLists.update((prev) => prev.filter((l) => l.id !== id));
    this.api.deleteVocabList(id).catch((e) => { console.error('deleteVocabList', e); this.toast.show("فشل حذف قائمة المفردات", "error"); });
  }

  saveVocabToStorage(_lists: VocabList[]) {} // kept for compat
}
