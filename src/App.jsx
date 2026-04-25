import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import LockScreen from "./components/LockScreen";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [view, setView] = useState("login");
  const [isLocked, setIsLocked] = useState(sessionStorage.getItem("isLocked") === "true");

  useEffect(() => {
    sessionStorage.setItem("isLocked", isLocked);
  }, [isLocked]);

  useEffect(() => {
    if (!token) return;
    let timeout;
    const INACTIVITY_LIMIT = 60 * 1000; // 1 minute
    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => setIsLocked(true), INACTIVITY_LIMIT);
    };
    const events = ["mousedown", "mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (timeout) clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [token]);

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "PASTE_YOUR_GOOGLE_CLIENT_ID_HERE"}>
      <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
        <ToastContainer theme="dark" position="bottom-right" />
        
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center p-4 relative">
          <AnimatePresence mode="wait">
            {!token ? (
              <motion.div 
                key="auth"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[420px]"
              >
                {view === "login" && <Login setShowView={setView} />}
                {view === "signup" && <Signup setShowView={setView} />}
                {view === "forgot-password" && <ForgotPassword setShowView={setView} />}
                {view === "reset-password" && <ResetPassword setShowView={setView} />}
              </motion.div>
            ) : (
              <div className="w-full h-full relative">
                <AnimatePresence>
                  {isLocked ? (
                    <motion.div
                      key="locked"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 z-[100]"
                    >
                      <LockScreen onUnlock={() => setIsLocked(false)} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="vault"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      <Manager />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
