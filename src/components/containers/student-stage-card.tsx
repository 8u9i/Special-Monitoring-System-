"use client";

import type { Student } from "@/lib/types";
import { useData } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import ProgressBar from "@/components/progress-bar";
import { getAvatarEmoji, getCompletion } from "@/lib/constants";

export default function StudentStageCard({ student }: { student: Student }) {
  const { state, getStudentStage } = useData();
  const stage = getStudentStage(student);
  const completion = getCompletion(student, state.hadiths.length, state.englishUnits.length);
  const isMaxed = completion.overall >= 100;

  return (
    <div className="panel p-5">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{getAvatarEmoji(student.avatar)}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-text-primary font-tajawal">{student.name}</h3>
          <p className="text-sm text-text-secondary mt-0.5">{stage.name}</p>
          <p className="text-xs text-text-tertiary mt-2 leading-relaxed">{stage.description}</p>

          {isMaxed ? (
            <div className="mt-4 flex items-center gap-2 text-primary">
              <AppIcon name="emoji_events" size={20} />
              <span className="text-sm font-semibold">ما شاء الله! وصل لأعلى المراحل</span>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-text-tertiary mb-1.5">
                <span>الإنجاز الكلي</span>
                <span>{completion.overall}%</span>
              </div>
              <ProgressBar value={completion.overall} variant="amber" />
            </div>
          )}
        </div>
        <div className="flex-shrink-0 w-14 h-14 bg-primary-light flex items-center justify-center">
          <AppIcon name={stage.badgeIcon} size={28} className="text-primary-dark" />
        </div>
      </div>
    </div>
  );
}

