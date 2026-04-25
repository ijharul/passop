import React, { useState } from "react";
import { Mail, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "https://passop-8ewz.onrender.com";

const ForgotPassword = ({ setShowView }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Security link sent to your email!");
      } else {
        toast.error(data.msg || "Request failed");
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 mb-4">
            <Mail className="w-6 h-6 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Reset Master Key</h1>
          <p className="text-slate-400 text-sm">Enter your email to receive a secure link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-0.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
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
                Send Security Link
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button
            onClick={() => setShowView("login")}
            className="text-slate-500 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
