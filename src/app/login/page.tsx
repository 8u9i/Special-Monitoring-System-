"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/tracker-context";
import AppIcon from "@/components/app-icon";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
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
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="login-scene">
      <div className="login-card">
        {/* Brand */}
        <div className="mb-8">
          <div className="login-brand">
            <AppIcon name="eco" size={34} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary font-tajawal">My Brothers</h1>
          <p className="text-sm text-text-secondary mt-1">Memorization &amp; Revision Tracking System</p>
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
            <label className="block text-sm font-semibold text-text-secondary mb-1">Username</label>
            <div className="relative">
              <span className="login-input-icon login-input-icon--start">
                <AppIcon name="person" size={18} />
              </span>
              <input
                className="input-field login-input login-input--start-icon"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1">Password</label>
            <div className="relative">
              <span className="login-input-icon login-input-icon--start">
                <AppIcon name="lock" size={18} />
              </span>
              <input
                className="input-field login-input login-input--start-icon login-input--end-icon"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="login-input-icon login-input-icon--end text-text-tertiary hover:text-text-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AppIcon name="visibility_off" size={16} /> : <AppIcon name="visibility" size={16} />}
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
              Sign In
            </>
          )}
        </button>

        <p className="text-center text-2xs text-text-tertiary mt-6">In the name of Allah, the Most Gracious, the Most Merciful</p>
      </div>
    </div>
  );
}
