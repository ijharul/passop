import React, { useState } from "react";
import { LogIn, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';

const API_URL = import.meta.env.VITE_API_URL || "https://passop-8ewz.onrender.com";

const Login = ({ setShowView }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.warn("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("masterPassword", form.password);
        sessionStorage.setItem("userEmail", form.email);
        sessionStorage.setItem("isLocked", "false");
        toast.success("Welcome back!");
        setTimeout(() => window.location.href = "/", 1000);
      } else {
        toast.error(data.msg || "Login failed");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("masterPassword", data.googleId);
        sessionStorage.setItem("userEmail", data.email);
        sessionStorage.setItem("isLocked", "false");
        toast.success("Logged in with Google!");
        setTimeout(() => window.location.href = "/", 1000);
      }
    } catch (err) {
      toast.error("Google Login failed");
    }
  };

  return (
    <div className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 mb-4">
          <LogIn className="w-6 h-6 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Access VaultX</h1>
        <p className="text-slate-400 text-sm">Secure Entry Protocol</p>
      </div>

      <form onSubmit={login} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full h-11 bg-[#1e293b] border border-white/10 rounded-lg pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="login-password" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Master Password
            </label>
            <button
              type="button"
              onClick={() => setShowView('forgot-password')}
              className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              FORGOT?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              id="login-password"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••••••"
              className="w-full h-11 bg-[#1e293b] border border-white/10 rounded-lg pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-gradient-to-r from-emerald-500 to-blue-600 hover:brightness-110 active:scale-[0.99] transition-all rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Unlock Vault
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            Identity Provider
          </span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Login Failed")}
            theme="filled_black"
            shape="pill"
            size="large"
            useOneTap={false}
            ux_mode="popup"
          />
        </div>
      </form>

      <div className="mt-4 pt-5 border-t border-white/5 text-center">
        <p className="text-slate-400 text-xs">
          New operative?{" "}
          <button
            onClick={() => setShowView("signup")}
            className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors"
          >
            Create Vault
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;