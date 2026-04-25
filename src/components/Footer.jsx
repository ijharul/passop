import React from "react";

const Footer = () => {
  return (
    <footer className="h-20 flex-shrink-0 border-t border-white/5 bg-[#020617] flex flex-col items-center justify-center px-6 gap-1">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
        © 2026 VaultX. All rights reserved.
      </div>
      <div className="text-[11px] text-slate-600 font-medium italic">
        Built with <span className="text-rose-500 not-italic">❤️</span> by Ijharul Haque
      </div>
    </footer>
  );
};

export default Footer;