import React, { useState } from "react";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const masterPassword = sessionStorage.getItem("masterPassword");

  const handleUnlock = (e) => {
    e.preventDefault();
    if (password === masterPassword) {
      onUnlock();
      toast.success("Access Granted");
    } else {
      toast.error("Incorrect Master Password");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/95 backdrop-blur-md">
      <div className="w-full max-w-[380px] bg-[#0f172a] border border-white/10 rounded-2xl p-7 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 mb-4 border border-emerald-500/20">
            <Lock className="w-7 h-7 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Vault Locked</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Session locked due to inactivity. Enter your master password to continue.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">
              Master Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-12 bg-[#1e293b] border border-white/10 rounded-xl pl-4 pr-12 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-600 hover:brightness-110 active:scale-[0.98] transition-all rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
          >
            Unlock Vault
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LockScreen;
