"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTracker } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import { getAvatarEmoji } from "@/lib/constants";

export default function DashboardPage() {
  const router = useRouter();
  const { state, selectStudent, getStudentStage, confirm } = useTracker();

  const stats = useMemo(() => {
    const list = state.students;
    if (list.length === 0) return { totalStudents: 0, totalXP: 0, averageXP: 0, topStudent: null as typeof list[0] | null };
    const totalXP = list.reduce((sum, s) => sum + s.xp, 0);
    const topStudent = list.reduce((a, b) => (a.xp > b.xp ? a : b));
    return { totalStudents: list.length, totalXP, averageXP: Math.round((totalXP / list.length) * 10) / 10, topStudent: topStudent.xp > 0 ? topStudent : null };
  }, [state.students]);

  const quranProgress = useMemo(() => {
    const student = state.students.find((s) => s.id === state.selectedStudentId);
    if (!student) return { totalMemorized: 0, percentage: 0 };
    const count = student.memorizedSurahNumbers.length;
    return { totalMemorized: count, percentage: Math.round((count / 114) * 100) };
  }, [state.students, state.selectedStudentId]);

  const sortedStudents = useMemo(
    () => [...state.students].sort((a, b) => b.xp - a.xp),
    [state.students]
  );

  const hadithOfTheDay = useMemo(() => {
    if (state.hadiths.length === 0) return null;
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return state.hadiths[seed % state.hadiths.length];
  }, [state.hadiths]);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="panel p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-light flex items-center justify-center">
              <AppIcon name="groups" size={18} />
            </div>
            <span className="text-xs text-text-secondary font-semibold">الحفاظ الصغار</span>
          </div>
          <p className="text-3xl font-bold text-text-primary">{stats.totalStudents}</p>
          <p className="text-xs text-green mt-2 font-medium flex items-center gap-1">
            <AppIcon name="check_circle" size={18} />
            طلاب نشطون
          </p>
        </div>

        <div className="panel p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-light flex items-center justify-center">
              <AppIcon name="emoji_events" size={18} />
            </div>
            <span className="text-xs text-text-secondary font-semibold">مجموع النقاط</span>
          </div>
          <p className="text-3xl font-bold text-primary-dark">{stats.totalXP}</p>
          <p className="text-xs text-text-secondary mt-2 font-medium flex items-center gap-1">
            <AppIcon name="done_all" size={18} /> حصيلة الحفظ
          </p>
        </div>

        <div className="panel p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-light flex items-center justify-center">
              <AppIcon name="query_stats" size={18} />
            </div>
            <span className="text-xs text-text-secondary font-semibold">متوسط الطالب</span>
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {stats.averageXP} <span className="text-sm font-medium text-text-secondary">XP</span>
          </p>
          <p className="text-xs text-text-secondary mt-2 font-medium flex items-center gap-1">
            <AppIcon name="trending_up" size={18} /> معدل مستمر
          </p>
        </div>

        <div className="panel p-5 border-primary">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-light flex items-center justify-center">
              <AppIcon name="stars" size={18} />
            </div>
            <span className="text-xs text-primary-dark font-semibold">صاحب الصدارة</span>
          </div>
          {stats.topStudent ? (
            <>
              <p className="text-lg font-bold text-text-primary truncate">{stats.topStudent.name}</p>
              <p className="text-xs text-primary-dark mt-2 font-bold bg-primary-light px-3 py-1 inline-block">
                {stats.topStudent.xp} نقطة
              </p>
            </>
          ) : (
            <p className="text-sm text-text-tertiary">لا يوجد طلاب</p>
          )}
        </div>
      </div>

      {/* Quran Progress */}
      <div className="panel overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border-light)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-primary)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={326.73}
                strokeDashoffset={326.73 * (1 - quranProgress.percentage / 100)}
                className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-primary">{quranProgress.percentage}%</span>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-right">
            <div className="flex items-center gap-2 mb-2">
              <AppIcon name="auto_stories" size={18} />
              <h3 className="font-tajawal text-lg font-bold text-text-primary">تقدم حفظ القرآن الكريم</h3>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              حفظ <span className="font-bold text-primary">{quranProgress.totalMemorized}</span> من 114 سورة
            </p>
            <div className="w-full h-3 bg-canvas overflow-hidden flex">
              <div className="progress-fill-green" style={{ width: `${quranProgress.percentage}%` }} />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-text-tertiary">0</span>
              <span className="text-text-secondary font-semibold">{quranProgress.totalMemorized} / 114 سورة</span>
              <span className="text-text-tertiary">114</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard + Hadith of Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="panel p-6 lg:col-span-2">
          <div className="panel-header">
            <h3 className="panel-title">
              <span className="panel-title-icon">🏆</span>
              قائمة الصدارة
            </h3>
            <span className="text-xs text-text-tertiary font-medium">محدث لحظياً</span>
          </div>

          <div className="space-y-2">
            {sortedStudents.map((student, idx) => {
              const isTop = idx === 0 && student.xp > 0;
              const stage = getStudentStage(student);
              return (
                <div key={student.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 transition-all duration-300 ${isTop ? "bg-primary-light border" : "bg-canvas border border-border-light"}`}
                  style={isTop ? { borderColor: `color-mix(in srgb, var(--color-primary) 20%, transparent)` } : undefined}
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className={`w-12 h-12 flex items-center justify-center font-bold text-sm shrink-0 ${isTop ? "bg-primary text-white" : "bg-border text-text-secondary"}`}>
                      {idx + 1}
                    </div>
                    <div className="w-10 h-10 bg-surface border border-border flex items-center justify-center text-lg shrink-0">
                      {getAvatarEmoji(student.avatar)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-text-primary flex items-center gap-1.5">
                        {student.name}
                        {isTop && <AppIcon name="military_tech" size={18} />}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                        <span className="font-semibold text-primary-dark">{stage.name}</span>
                        <span className="text-text-tertiary">·</span>
                        <span>{student.xp} نقطة</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex gap-1.5 text-xs font-semibold flex-wrap">
                      <span className="tag tag-primary">
                        <AppIcon name="menu_book" size={18} />
                        {student.memorizedHadithNumbers.length}
                      </span>
                      <span className="tag tag-blue">
                        <AppIcon name="auto_stories" size={18} />
                        {student.memorizedSurahNumbers.length}
                      </span>
                      <span className="tag tag-green">
                        <AppIcon name="translate" size={18} />
                        {student.memorizedEnglishUnits.length}
                      </span>
                    </div>
                    <button className="btn btn-ghost btn-icon" title="انتقل لمسار الحفظ" onClick={() => { selectStudent(student.id); router.push("/hadith"); }}>
                      <AppIcon name="arrow_back" size={18} />
                    </button>
                  </div>
                </div>
              );
            })}

            {sortedStudents.length === 0 && (
              <div className="empty-state">
                <p className="empty-state-text">لا يوجد طلاب مسجلون</p>
              </div>
            )}
          </div>

          {state.students.length > 0 && (
            <div className="mt-4 p-4 bg-green-light border text-text-primary text-xs leading-relaxed flex items-start gap-2" style={{ borderColor: `color-mix(in srgb, var(--color-green) 20%, transparent)` }}>
              <span className="shrink-0 mt-0.5"><AppIcon name="lightbulb" size={18} /></span>
              <p><strong>فكرة تربوية:</strong> لتشجيع الحفاظ الصغار، يمكن إعطاء جائزة عينية لمرتقي كل مرحلة!</p>
            </div>
          )}
        </div>

        <div className="panel p-6 flex flex-col">
          <div className="panel-header">
            <h3 className="panel-title">
              <span className="panel-title-icon">☀️</span>
              الحديث لليوم
            </h3>
          </div>

          {hadithOfTheDay ? (
            <>
              <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
                <span className="tag tag-primary mb-4">الحديث رقم {hadithOfTheDay.number}</span>
                <h4 className="font-bold text-base text-text-primary mb-3">{hadithOfTheDay.category}</h4>
                <p className="font-amiri text-xl font-bold text-primary-dark leading-relaxed mb-4">
                  &ldquo;{hadithOfTheDay.text}&rdquo;
                </p>
                <p className="text-xs text-text-secondary mb-4">الراوي: {hadithOfTheDay.reference}</p>
                <div className="w-full p-4 bg-canvas border border-border-light text-right">
                  <span className="text-xs text-primary font-bold block mb-1.5 flex items-center gap-1">
                    <AppIcon name="spa" size={18} /> الدرس والعمل:
                  </span>
                  <p className="text-xs text-text-secondary leading-relaxed">{hadithOfTheDay.explanation}</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border-light text-center">
                <p className="text-2xs text-text-tertiary">الأحاديث مأخوذة من كتاب إتحاف الأخيار للشيخ سعيد بن مبروك القنوبي</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-text-tertiary">لا توجد أحاديث مضافة بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
