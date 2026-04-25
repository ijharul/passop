import React, { useState } from "react";
import { Lock, Loader2, ArrowRight, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "https://passop-8ewz.onrender.com";

const ResetPassword = ({ setShowView }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    if (!token || !email) {
      toast.error("Invalid or missing reset token/email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword: password })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Master Key updated! Please log in.");
        setTimeout(() => window.location.href = "/", 1500);
      } else {
        toast.error(data.msg || "Reset failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 mb-4">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Update Master Key</h1>
          <p className="text-slate-400 text-sm">Security override in progress</p>
        </div>

        <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">Security Warning</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Changing your Master Key will invalidate your existing vault if you haven't backed up your recovery phrases. Proceed with caution.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label htmlFor="reset-password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-0.5">New Master Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                id="reset-password"
                name="newPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-12 bg-slate-900/50 border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-600 hover:brightness-110 active:scale-[0.98] transition-all rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Confirm Override
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
