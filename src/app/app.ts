import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  effect,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  TrackerState,
  Student,
  Stage,
  STAGES,
  QURAN_SURAHS,
  ENGLISH_UNITS,
  ENGLISH_BOOKS,
  VocabList,
} from "./state";
import { Hadith } from "./hadith-data";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-root",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  public state = inject(TrackerState);

  // Expose data to template dynamically
  get allHadiths(): Hadith[] {
    return this.state.hadiths();
  }
  get allSurahs() {
    return QURAN_SURAHS;
  }
  get allEnglishUnits() {
    return ENGLISH_UNITS;
  }
  get allEnglishBooks() {
    return ENGLISH_BOOKS;
  }
  public allStages = STAGES;

  get sortedStudents() {
    return [...this.state.students()].sort((a, b) => b.xp - a.xp);
  }

  // Active Subject Tab
  activeSubject = computed(
    () => this.state.activeTab() as "hadith" | "quran" | "english",
  );
  activeReferenceSubject = signal<"hadith" | "quran" | "english">("hadith");

  // Selected Item for detail view
  selectedHadithForDetail = signal<Hadith | null>(null);
  selectedSurahForDetail = signal<{
    number: number;
    name: string;
    pagesCount?: number;
  } | null>(null);
  selectedVocabListForDetail = signal<VocabList | null>(null);

  // Modal toggle signals
  showAddStudentModal = signal<boolean>(false);
  showEditStudentModal = signal<boolean>(false);
  showAddHadithModal = signal<boolean>(false);
  showEditHadithModal = signal<boolean>(false);
  showAddVocabListModal = signal<boolean>(false);
  isTracksMenuOpen = signal<boolean>(false);
  selectedHadithForEdit = signal<Hadith | null>(null);

  // Confirmation Modal
  confirmModalState = signal<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Gamification celebration signals
  showLevelUpCelebration = signal<boolean>(false);
  celebratedStudent = signal<Student | null>(null);
  celebratedStage = signal<Stage | null>(null);

  // Toast Notification
  toastMessage = signal<string | null>(null);
  private toastTimeout: ReturnType<typeof setTimeout> | undefined;

  // Reactive Forms (strictly avoiding ngModel)
  addVocabListForm = new FormGroup({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rawText: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  addStudentForm = new FormGroup({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    age: new FormControl<number | null>(null),
    avatar: new FormControl("avatar-leaf", { nonNullable: true }),
    notes: new FormControl(""),
  });

  editStudentForm = new FormGroup({
    id: new FormControl("", { nonNullable: true }),
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    age: new FormControl<number | null>(null),
    avatar: new FormControl("avatar-leaf", { nonNullable: true }),
    notes: new FormControl(""),
  });

  quickLogForm = new FormGroup({
    studentId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    hadithNumber: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<"memorized" | "review" | "none">("memorized", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  addHadithForm = new FormGroup({
    text: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    reference: new FormControl("رواه البخاري ومسلم", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    explanation: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category: new FormControl("عام", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    badgeName: new FormControl("", { nonNullable: true }),
    badgeIcon: new FormControl("stars", { nonNullable: true }),
  });

  editHadithForm = new FormGroup({
    number: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    text: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    reference: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    explanation: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    badgeName: new FormControl("", { nonNullable: true }),
    badgeIcon: new FormControl("", { nonNullable: true }),
  });

  constructor() {
    // Sync quickLogForm student selection whenever selectedStudent changes
    effect(() => {
      const activeId = this.state.selectedStudentId();
      if (activeId) {
        this.quickLogForm.patchValue({ studentId: activeId });
      }
    });
  }

  // Helper lists for the form template
  avatarOptions = [
    {
      key: "avatar-leaf",
      emoji: "🌿",
      label: "غصن أخضر",
      colorClass: "bg-emerald-50 text-emerald-800",
    },
    {
      key: "avatar-mountain",
      emoji: "🏔️",
      label: "جبل الحكمة",
      colorClass: "bg-stone-100 text-stone-800",
    },
    {
      key: "avatar-sun",
      emoji: "☀️",
      label: "شمس الهداية",
      colorClass: "bg-amber-50 text-amber-800",
    },
    {
      key: "avatar-flower",
      emoji: "🌸",
      label: "زهرة الأخلاق",
      colorClass: "bg-rose-50 text-rose-800",
    },
    {
      key: "avatar-water",
      emoji: "💧",
      label: "غيث المعرفة",
      colorClass: "bg-sky-50 text-sky-800",
    },
    {
      key: "avatar-shield",
      emoji: "🛡️",
      label: "درع العقيدة",
      colorClass: "bg-indigo-50 text-indigo-800",
    },
  ];

  // Map category filtering
  filteredHadiths = computed(() => {
    const query = this.state.searchQuery().trim().toLowerCase();
    const cat = this.state.categoryFilter();

    return this.state.hadiths().filter((h) => {
      const matchesQuery =
        h.title.toLowerCase().includes(query) ||
        h.category.toLowerCase().includes(query) ||
        h.text.toLowerCase().includes(query) ||
        h.number.toString() === query ||
        h.explanation.toLowerCase().includes(query);
      const matchesCategory = cat === "all" || h.category === cat;
      return matchesQuery && matchesCategory;
    });
  });

  // Unique categories helper
  uniqueCategories = computed(() => {
    const cats = new Set<string>();
    this.state.hadiths().forEach((h) => cats.add(h.category));
    return Array.from(cats);
  });

  // Get current status of a Hadith for a student
  getHadithStatus(
    student: Student | null,
    hadithNum: number,
  ): "memorized" | "review" | "none" {
    if (!student) return "none";
    if (student.memorizedHadithNumbers.includes(hadithNum)) return "memorized";
    if (student.reviewHadithNumbers.includes(hadithNum)) return "review";
    return "none";
  }

  // Get stage info for template
  getStudentStage(student: Student): Stage {
    return this.state.getStudentStage(student);
  }

  getStudentNextStageInfo(student: Student) {
    return this.state.getStudentNextStageInfo(student);
  }

  getAvatarDetails(avatarKey: string) {
    return (
      this.avatarOptions.find((o) => o.key === avatarKey) ||
      this.avatarOptions[0]
    );
  }

  onAddVocabListSubmit() {
    if (this.addVocabListForm.invalid) return;

    const val = this.addVocabListForm.value;
    this.state.addVocabList(val.name || "", val.rawText || "");

    this.showAddVocabListModal.set(false);
    this.addVocabListForm.reset();
    this.triggerToast("تم إضافة قائمة المفردات بنجاح!");
  }

  onDeleteVocabList(id: string) {
    this.confirmModalState.set({
      isOpen: true,
      message: "هل أنت متأكد من حذف قائمة المفردات هذه؟",
      onConfirm: () => {
        this.state.deleteVocabList(id);
        this.triggerToast("تم الحذف.");
        this.confirmModalState.set(null);
      },
    });
  }

  // Core Actions
  onAddStudentSubmit() {
    if (this.addStudentForm.invalid) return;

    const val = this.addStudentForm.value;
    this.state.addStudent(
      val.name || "",
      val.age || undefined,
      val.avatar || "avatar-leaf",
      val.notes || "",
    );

    this.showAddStudentModal.set(false);
    this.addStudentForm.reset({ avatar: "avatar-leaf" });
    this.triggerToast("تم إضافة الطالب الجديد بنجاح! 🌿");
  }

  openEditStudent(student: Student) {
    this.editStudentForm.setValue({
      id: student.id,
      name: student.name,
      age: student.age || null,
      avatar: student.avatar,
      notes: student.notes || "",
    });
    this.showEditStudentModal.set(true);
  }

  onEditStudentSubmit() {
    if (this.editStudentForm.invalid) return;

    const val = this.editStudentForm.value;
    this.state.updateStudent(
      val.id || "",
      val.name || "",
      val.age || undefined,
      val.avatar || "avatar-leaf",
      val.notes || "",
    );

    this.showEditStudentModal.set(false);
    this.triggerToast("تم تحديث معلومات الطالب بنجاح! 📝");
  }

  onDeleteStudent(id: string, name: string) {
    this.confirmModalState.set({
      isOpen: true,
      message: `هل أنت متأكد من حذف الطالب (${name})؟ سيتم مسح سجل الحفظ الخاص به بالكامل.`,
      onConfirm: () => {
        this.state.deleteStudent(id);
        this.triggerToast("تم حذف الطالب من السجل.");
        this.confirmModalState.set(null);
      },
    });
  }

  // Toggle hadith status and check for gamified level-up celebration!
  setHadithStatus(
    studentId: string,
    hadithNum: number,
    status: "memorized" | "review" | "none",
  ) {
    const student = this.state.students().find((s) => s.id === studentId);
    if (!student) return;

    // Record previous stage
    const prevStage = this.state.getStudentStage(student);

    // Update state
    this.state.toggleHadithStatus(studentId, hadithNum, status);

    // Get updated student and check if they leveled up
    const updatedStudent = this.state
      .students()
      .find((s) => s.id === studentId);
    if (updatedStudent) {
      const newStage = this.state.getStudentStage(updatedStudent);

      if (newStage.level > prevStage.level) {
        // Trigger Level Up Celebration!
        this.celebratedStudent.set(updatedStudent);
        this.celebratedStage.set(newStage);
        this.showLevelUpCelebration.set(true);
      } else {
        // Show normal success toast
        const statusMsg =
          status === "memorized"
            ? "تم حفظ الحديث بنجاح! 🎉"
            : status === "review"
              ? "تم نقل الحديث للمراجعة 📖"
              : "تم إعادة تعيين حالة الحديث 🔄";
        this.triggerToast(`${updatedStudent.name}: ${statusMsg}`);
      }
    }

    // Refresh active selected Hadith in detail panel if it's currently selected
    const selected = this.selectedHadithForDetail();
    if (selected && selected.number === hadithNum) {
      // Just re-assign to trigger template refresh
      this.selectedHadithForDetail.set({ ...selected });
    }
  }

  // Quick toggle (from path or grid)
  onHadithNodeClick(hadith: Hadith) {
    this.selectedHadithForDetail.set(hadith);
  }

  onSurahNodeClick(surah: {
    number: number;
    name: string;
    pagesCount?: number;
  }) {
    this.selectedSurahForDetail.set(surah);
  }

  onVocabListNodeClick(list: VocabList) {
    this.selectedVocabListForDetail.set(list);
  }

  closeDetailPanel() {
    this.selectedHadithForDetail.set(null);
    this.selectedSurahForDetail.set(null);
    this.selectedVocabListForDetail.set(null);
  }

  onQuickLogSubmit() {
    if (this.quickLogForm.invalid) return;

    const val = this.quickLogForm.value;
    const studentId = val.studentId || "";
    const hadithNum = val.hadithNumber || 1;
    const status = val.status || "memorized";

    this.setHadithStatus(studentId, hadithNum, status);
  }

  // Search input handlers
  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.state.searchQuery.set(target.value);
  }

  onCategorySelect(cat: string) {
    this.state.categoryFilter.set(cat);
  }

  // Notification Toast Helper
  triggerToast(message: string) {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastMessage.set(message);
    this.toastTimeout = setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }

  // Quick helper to fill all Hadiths (for teacher's testing or rewarding student)
  cheatUnlockAll(studentId: string) {
    const student = this.state.students().find((s) => s.id === studentId);
    if (!student) return;

    this.confirmModalState.set({
      isOpen: true,
      message: `هل تريد وسم جميع الأحاديث الـ 40 كـ "محفوظة" للطالب (${student.name}) دفعة واحدة لأغراض العرض أو المراجعة الكاملة؟`,
      onConfirm: () => {
        const updated = this.state.students().map((s) => {
          if (s.id === studentId) {
            const allNums = Array.from({ length: 40 }, (_, i) => i + 1);
            return {
              ...s,
              memorizedHadithNumbers: allNums,
              reviewHadithNumbers: [],
              xp: 4000,
            };
          }
          return s;
        });
        this.state.students.set(updated);
        this.state.saveToStorage(updated);

        // Trigger final stage celebration!
        const updatedStudent = updated.find((s) => s.id === studentId)!;
        this.celebratedStudent.set(updatedStudent);
        this.celebratedStage.set(STAGES[4]); // Max Stage
        this.showLevelUpCelebration.set(true);

        this.triggerToast(
          `هنيئاً! تم إتمام حفظ الأربعين بنجاح لـ ${student.name}! 🎉`,
        );
        this.confirmModalState.set(null);
      },
    });
  }

  // Quick helper to reset student's progress
  resetStudentProgress(studentId: string) {
    const student = this.state.students().find((s) => s.id === studentId);
    if (!student) return;

    this.confirmModalState.set({
      isOpen: true,
      message: `هل تريد تصفير سجل حفظ الطالب (${student.name}) والبدء من جديد؟`,
      onConfirm: () => {
        const updated = this.state.students().map((s) => {
          if (s.id === studentId) {
            return {
              ...s,
              memorizedHadithNumbers: [],
              reviewHadithNumbers: [],
              xp: 0,
            };
          }
          return s;
        });
        this.state.students.set(updated);
        this.state.saveToStorage(updated);
        this.triggerToast("تم تصفير سجل الحفظ بنجاح.");
        this.confirmModalState.set(null);
      },
    });
  }

  // Calculate student badge inventory
  getUnlockedBadges(student: Student) {
    const badges: {
      name: string;
      desc: string;
      icon: string;
      unleased: boolean;
    }[] = [];

    // 1. Hadith-specific badges (dynamic)
    const memorizedSet = new Set(student.memorizedHadithNumbers);

    // Add some interesting specific milestone badges
    badges.push({
      name: "البذرة الأولى",
      desc: "حفظ أول حديث نبوي شريف والانطلاق في الرحلة المباركة.",
      icon: "energy_savings_leaf",
      unleased: student.memorizedHadithNumbers.length >= 1,
    });

    badges.push({
      name: "الخمسة الندية",
      desc: "إتمام حفظ 5 أحاديث نبوية عن الحبيب ﷺ.",
      icon: "spa",
      unleased: student.memorizedHadithNumbers.length >= 5,
    });

    badges.push({
      name: "العشرة المباركة",
      desc: "إتمام حفظ 10 أحاديث نبوية والارتقاء لدرجة التمكين.",
      icon: "grade",
      unleased: student.memorizedHadithNumbers.length >= 10,
    });

    badges.push({
      name: "نصف الطريق",
      desc: "إتمام حفظ 20 حديثاً شريفاً بنجاح وتميز.",
      icon: "explore",
      unleased: student.memorizedHadithNumbers.length >= 20,
    });

    badges.push({
      name: "حافظ الأربعين النبوية",
      desc: `الإنجاز الأعظم! إتمام حفظ ${this.state.hadiths().length} حديثاً نبوياً كاملاً والتتويج بالتاج الحافظ.`,
      icon: "military_tech",
      unleased:
        student.memorizedHadithNumbers.length >= this.state.hadiths().length,
    });

    // Quran Badges
    badges.push({
      name: "سورة النور",
      desc: "حفظ أول سورة من القرآن الكريم.",
      icon: "auto_stories",
      unleased: student.memorizedSurahNumbers.length >= 1,
    });

    badges.push({
      name: "حامل الجزء",
      desc: "حفظ أكثر من 15 سورة من كتاب الله.",
      icon: "import_contacts",
      unleased: student.memorizedSurahNumbers.length >= 15,
    });

    // English Badges
    badges.push({
      name: "الكلمة الأولى",
      desc: "حفظ الوحدة الأولى من مفردات اللغة الإنجليزية.",
      icon: "translate",
      unleased: student.memorizedEnglishUnits.length >= 1,
    });

    badges.push({
      name: "السفير الماهر",
      desc: "إتمام حفظ أكثر من 20 وحدة باللغة الإنجليزية.",
      icon: "public",
      unleased: student.memorizedEnglishUnits.length >= 20,
    });

    // 2. Add Hadith specific category badges
    const specificHadiths = [1, 6, 15, 22, 29];
    specificHadiths.forEach((num) => {
      const hadith = this.state.hadiths().find((h) => h.number === num);
      if (hadith) {
        badges.push({
          name: `وسام ${hadith.badgeName}`,
          desc: `يُمنح لحفظ الحديث رقم ${num} بتميز في موضوع (${hadith.category}).`,
          icon: hadith.badgeIcon,
          unleased: memorizedSet.has(num),
        });
      }
    });

    return badges;
  }

  // Hadith actions
  onAddHadithSubmit() {
    if (this.addHadithForm.invalid) return;

    const val = this.addHadithForm.value;
    const cat = val.category || "عام";
    this.state.addHadith(
      cat, // use category as the title
      val.text || "",
      val.reference || "",
      val.explanation || "",
      cat,
      val.badgeName || undefined,
      val.badgeIcon || undefined,
    );

    this.showAddHadithModal.set(false);
    this.addHadithForm.reset({
      reference: "رواه البخاري ومسلم",
      category: "عام",
      badgeIcon: "stars",
    });
    this.triggerToast("تم إضافة الحديث الشريف الجديد بنجاح! 📖");
  }

  openEditHadith(hadith: Hadith) {
    this.selectedHadithForEdit.set(hadith);
    this.editHadithForm.setValue({
      number: hadith.number,
      text: hadith.text,
      reference: hadith.reference,
      explanation: hadith.explanation,
      category: hadith.category,
      badgeName: hadith.badgeName || "",
      badgeIcon: hadith.badgeIcon || "stars",
    });
    this.showEditHadithModal.set(true);
  }

  onEditHadithSubmit() {
    if (this.editHadithForm.invalid) return;

    const origHadith = this.selectedHadithForEdit();
    if (!origHadith) return;
    const oldNum = origHadith.number;

    const val = this.editHadithForm.value;
    const newNum = val.number || 0;
    const cat = val.category || "عام";

    const success = this.state.updateHadith(
      oldNum,
      newNum,
      cat, // use category as the title
      val.text || "",
      val.reference || "",
      val.explanation || "",
      cat,
      val.badgeName || undefined,
      val.badgeIcon || undefined,
    );

    if (!success) {
      this.triggerToast("عذراً، هذا الرقم مستخدم بالفعل لحديث آخر! ❌");
      return;
    }

    // Refresh active selected Hadith in detail panel if it's currently selected
    const updated = this.state.hadiths().find((h) => h.number === newNum);
    if (updated && this.selectedHadithForDetail()?.number === oldNum) {
      this.selectedHadithForDetail.set(updated);
    }

    this.showEditHadithModal.set(false);
    this.triggerToast("تم تحديث الحديث الشريف بنجاح! 📝");
  }

  onDeleteHadith(number: number, category: string) {
    this.confirmModalState.set({
      isOpen: true,
      message: `هل أنت متأكد من حذف الحديث الشريف ضمن باب (${category})؟ سيتم مسحه من سجلات جميع الطلاب الذين حفظوه أو يراجعونه.`,
      onConfirm: () => {
        this.state.deleteHadith(number);

        // Clear detail panel if it was showing the deleted Hadith
        if (this.selectedHadithForDetail()?.number === number) {
          this.selectedHadithForDetail.set(null);
        }
        this.triggerToast("تم حذف الحديث الشريف وسجلاته.");
        this.confirmModalState.set(null);
      },
    });
  }
}
