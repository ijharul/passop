import React from "react";
import { Shield, LogOut, Plus, User } from "lucide-react";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const userEmail = sessionStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    window.location.href = "/";
  };

  const scrollToAdd = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="h-[72px] flex-shrink-0 border-b border-white/10 bg-[#020617] px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = "/"}>
          <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Shield className="text-[#020617] w-5.5 h-5.5" fill="currentColor" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Vault<span className="text-emerald-500">X</span>
          </span>
        </div>

        {token && (
          <div className="flex items-center gap-6">
            <button 
              onClick={scrollToAdd}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#020617] text-sm font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Password</span>
            </button>

            <div className="h-8 w-px bg-white/10 hidden md:block"></div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-200 font-medium">{userEmail?.split('@')[0]}</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-400 hover:bg-rose-400/10 rounded-xl border border-rose-400/20 transition-all"
                title="Exit Vault"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
