"use client";

import { useUI } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";

export default function ConfirmModal() {
  const { confirm } = useUI();
  if (!confirm.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-overlay" onClick={confirm.close} />
      <div className="relative modal-panel max-w-sm animate-fade-in">
        <div className="text-center">
          <AppIcon name="warning" size={36} className="text-amber mx-auto mb-3" />
          <h2 className="text-lg font-bold text-text-primary font-tajawal mb-2">تأكيد الإجراء</h2>
          <p className="text-sm text-text-secondary mb-6">{confirm.message}</p>
          <div className="flex gap-3">
            <button className="btn btn-outline btn-md flex-1" onClick={confirm.close}>إلغاء</button>
            <button
              className="btn btn-primary btn-md flex-1 bg-rose hover:bg-rose-hover"
              onClick={() => { confirm.onConfirm?.(); confirm.close(); }}
            >
              تأكيد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
