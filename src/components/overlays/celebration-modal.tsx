"use client";

import { useUI } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";
import { getAvatarEmoji } from "@/lib/constants";

export default function CelebrationModal() {
  const { celebration } = useUI();
  if (!celebration.show || !celebration.student || !celebration.stage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-overlay" />
      <div className="relative modal-panel max-w-sm text-center animate-fade-in">
        <div className="text-5xl animate-bounce mb-4">👑</div>
        <AppIcon name={celebration.stage.badgeIcon} size={40} className="text-primary mx-auto mb-2" />
        <h2 className="text-xl font-bold text-primary font-tajawal mb-1">مبارك!</h2>
        <p className="text-lg font-semibold text-text-primary">
          {getAvatarEmoji(celebration.student.avatar)} {celebration.student.name}
        </p>
        <p className="text-sm text-text-secondary mt-3">{celebration.stage.description}</p>
        <p className="text-base font-bold text-primary mt-2">{celebration.stage.name}</p>
        <button className="btn btn-primary btn-md mt-6 w-full" onClick={celebration.dismiss}>
          <AppIcon name="spa" size={18} />
          مواصلة رحلة الحفظ
        </button>
      </div>
    </div>
  );
}
