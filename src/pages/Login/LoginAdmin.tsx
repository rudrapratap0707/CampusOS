import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import { Logo } from "../../components/common/Logo";

export const LoginAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://campusos-7p9m.onrender.com/api/admin/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      // 🔥 TESTING PHASE: DIRECT LOGIN
      if (data.skipOtp && data.token) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 text-white font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="flex justify-center mb-2">
          <Logo size="lg" variant="light" />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Admin Command Portal</h2>
          <p className="text-xs text-slate-400">
            Enter master password to access dashboard
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Master Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-lg shadow-red-900/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><span>Login to Dashboard</span><ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => navigate("/")}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors bg-transparent border-none cursor-pointer"
          >
            ← Back to CampusOS Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
