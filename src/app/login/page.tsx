"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTracker } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useTracker();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) return;
    setLoading(true);
    setError("");
    const result = await login(username, password);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "فشل تسجيل الدخول");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-sm bg-surface border border-border p-8">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light mb-4">
            <AppIcon name="eco" size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary font-tajawal">يا إخوتي</h1>
          <p className="text-sm text-text-secondary mt-1">نظام المتابعة الخاص بالحفظ والمراجعة</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-rose-light border border-rose text-rose text-sm">
            <AppIcon name="error_outline" size={18} />
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">اسم المستخدم</label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                <AppIcon name="person" size={18} />
              </span>
              <input
                className="input-field pr-10"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                dir="auto"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">كلمة المرور</label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                <AppIcon name="lock" size={18} />
              </span>
              <input
                className="input-field pr-10 pl-10"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AppIcon name="lock" size={16} /> : <AppIcon name="lock" size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          className="btn btn-primary btn-lg w-full mt-6"
          onClick={handleLogin}
          disabled={loading || !username || !password}
        >
          {loading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <AppIcon name="login" size={18} />
              تسجيل الدخول
            </>
          )}
        </button>

        <p className="text-center text-2xs text-text-tertiary mt-6">بسم الله الرحمن الرحيم</p>
      </div>
    </div>
  );
}
