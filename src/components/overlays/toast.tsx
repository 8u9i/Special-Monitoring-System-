"use client";

import { useTracker } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";

export default function Toast() {
  const { toast } = useTracker();
  if (!toast.message) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[60] animate-fade-in">
      <button
        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold shadow-lg border ${toast.type === "success" ? "bg-green-light border-green text-tag-green-text" : "bg-rose-light border-rose text-rose"}`}
        onClick={() => toast.show("")}
      >
        <AppIcon name={toast.type === "success" ? "check_circle" : "error"} size={18} />
        {toast.message}
      </button>
    </div>
  );
}
