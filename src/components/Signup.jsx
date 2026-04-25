import React, { useState } from "react";
import { UserPlus, Mail, Lock, Loader2, ArrowRight, User } from "lucide-react";
import { toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';

const API_URL = import.meta.env.VITE_API_URL || "https://passop-8ewz.onrender.com";

const Signup = ({ setShowView }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("masterPassword", credentialResponse.credential.slice(-10));
        sessionStorage.setItem("userEmail", data.email);
        sessionStorage.setItem("isLocked", "false");
        toast.success("Account created via Google!");
        setTimeout(() => window.location.href = "/", 1000);
      }
    } catch (err) {
      toast.error("Google Initialization Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.warn("All protocols require input");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Vault Initialized!");
        setTimeout(() => setShowView("login"), 1500);
      } else {
        toast.error(data.msg || "Initialization failed");
      }
    } catch (err) {
      toast.error("Connection failed. Please check your internet or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 mb-4">
            <UserPlus className="w-6 h-6 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Create Vault</h1>
          <p className="text-slate-400 text-sm">Secure identity initialization</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label htmlFor="signup-name" className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-0.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                id="signup-name"
                name="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="w-full h-12 bg-slate-900/50 border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="signup-email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-0.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                id="signup-email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@company.com"
                className="w-full h-12 bg-slate-900/50 border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="signup-password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-0.5">Set Master Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                id="signup-password"
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full h-12 bg-slate-900/50 border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-600 hover:brightness-110 active:scale-[0.98] transition-all rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Initialize Vault
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Social Identity</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Sign-In Failed")}
              theme="filled_black"
              shape="pill"
              size="large"
              useOneTap={false}
              ux_mode="popup"
            />
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-slate-400 text-xs">
            Already registered?{" "}
            <button
              onClick={() => setShowView("login")}
              className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors"
            >
              Sign In Instead
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;