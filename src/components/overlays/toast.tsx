"use client";

import { useUI } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";

export default function Toast() {
  const { toast } = useUI();
  if (!toast.message) return null;

  return (
    <div className="fixed bottom-6 start-6 z-[60] max-w-[calc(100vw-3rem)]">
      <div role="status" aria-live="polite" aria-atomic="true" className="animate-fade-in">
        <button
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold shadow-lg border ${toast.type === "success" ? "bg-green-light border-green text-tag-green-text" : "bg-rose-light border-rose text-rose"}`}
          onClick={() => toast.show("")}
        >
          <AppIcon name={toast.type === "success" ? "check_circle" : "error"} size={18} />
          {toast.message}
        </button>
      </div>
    </div>
  );
}
