import React, { useEffect, useState, useRef } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { 
  Eye, EyeOff, Copy, Trash2, Edit3, Plus, 
  Search, RefreshCw, Shield, Globe, User, 
  Lock, Save, LogOut, ShieldCheck, ShieldAlert, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { deriveKey, encryptData, decryptData } from "../utils/crypto";

const API_URL = import.meta.env.VITE_API_URL || "https://passop-8ewz.onrender.com";

const Manager = () => {
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setpasswordArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [breachResults, setBreachResults] = useState({});
  const [checkingBreach, setCheckingBreach] = useState(null);

  useEffect(() => {
    const masterPassword = sessionStorage.getItem("masterPassword");
    const userEmail = sessionStorage.getItem("userEmail");
    if (!masterPassword || !userEmail) {
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }
    const key = deriveKey(masterPassword, userEmail);
    setEncryptionKey(key);
  }, []);

  const getPasswords = async (key) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let req = await fetch(`${API_URL}/getpasswords`, { headers: { Authorization: token } });
      let passwords = await req.json();
      if (Array.isArray(passwords)) {
        const decryptedData = passwords.map(item => ({
          ...item,
          password: decryptData(item.password, key || encryptionKey, item.iv)
        }));
        setpasswordArray(decryptedData);
      } else {
        setpasswordArray([]);
      }
    } catch (err) {
      toast.error("Failed to fetch passwords");
      setpasswordArray([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (encryptionKey) getPasswords(encryptionKey);
  }, [encryptionKey]);

  const savePassword = async (e) => {
    e.preventDefault();
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
      setLoading(true);
      try {
        if (form.id) {
          await fetch(`${API_URL}/deletepassword`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") },
            body: JSON.stringify({ id: form.id })
          });
        }
        const { ciphertext, iv } = encryptData(form.password, encryptionKey);
        const newId = form.id || uuidv4();
        const newPassword = { ...form, id: newId, password: ciphertext, iv: iv };

        const res = await fetch(`${API_URL}/savepassword`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") },
          body: JSON.stringify(newPassword)
        });

        if (res.ok) {
          const decryptedVersion = { ...newPassword, password: form.password };
          if (form.id) {
            setpasswordArray(passwordArray.map(item => item.id === form.id ? decryptedVersion : item));
          } else {
            setpasswordArray([...passwordArray, decryptedVersion]);
          }
          setform({ site: "", username: "", password: "" });
          toast.success(form.id ? "Updated successfully!" : "Saved successfully!");
        }
      } catch (err) {
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    } else {
      toast.warn("Fields must be at least 4 characters long");
    }
  };

  const deletePassword = async (id) => {
    if (confirm("Are you sure you want to delete this?")) {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/deletepassword`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") },
          body: JSON.stringify({ id })
        });
        if (res.ok) {
          setpasswordArray(passwordArray.filter((item) => item.id !== id));
          toast.success("Deleted!");
        }
      } catch (err) {
        toast.error("Failed to delete");
      } finally {
        setLoading(false);
      }
    }
  };

  const checkBreach = async (password, id) => {
    try {
      setCheckingBreach(id);
      const res = await fetch(`${API_URL}/check-breach`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      setBreachResults(prev => ({ ...prev, [id]: data }));
    } catch (err) {
      console.error("Breach check failed");
    } finally {
      setCheckingBreach(null);
    }
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0, n = charset.length; i < 16; ++i) retVal += charset.charAt(Math.floor(Math.random() * n));
    setform({ ...form, password: retVal });
    toast.info("Strong password generated!", { theme: "dark" });
  };

  const filteredPasswords = passwordArray.filter(item => {
    const site = item.site ? item.site.toLowerCase() : "";
    const username = item.username ? item.username.toLowerCase() : "";
    const term = searchTerm.toLowerCase();
    return site.includes(term) || username.includes(term);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <ToastContainer position="top-right" autoClose={3000} transition={Bounce} />

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">Vault<span className="text-emerald-500">X</span></h1>
        <p className="text-slate-400 text-lg font-medium leading-relaxed">
          Securely store and manage your passwords with zero-knowledge encryption.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 shadow-2xl mb-16">
        <form onSubmit={savePassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Website URL</label>
            <div className="relative group">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <input
                name="site"
                value={form.site}
                onChange={(e) => setform({ ...form, site: e.target.value })}
                placeholder="e.g. google.com"
                className="w-full h-12 bg-[#1e293b] border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username / Email</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  name="username"
                  value={form.username}
                  onChange={(e) => setform({ ...form, username: e.target.value })}
                  placeholder="commander@vaultx.io"
                  className="w-full h-12 bg-[#1e293b] border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Access Secret</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  name="password"
                  type="text"
                  value={form.password}
                  onChange={(e) => setform({ ...form, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full h-12 bg-[#1e293b] border border-white/10 rounded-xl pl-12 pr-12 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-mono"
                  required
                />
                <button 
                  type="button" 
                  onClick={generatePassword} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors"
                  title="Generate Strong Password"
                >
                  <RefreshCw className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-600 hover:brightness-110 active:scale-[0.98] transition-all rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10">
            <Save className="w-5 h-5" />
            Save Password
          </button>
        </form>
      </div>

      {/* Vault Table Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-3">
            Your Password Vault
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase">
              {passwordArray.length} items
            </span>
          </h2>
            
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vault..."
              className="w-full h-10 bg-[#1e293b] border border-white/10 rounded-xl pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
        </div>

        <div className="bg-[#0f172a] rounded-2xl overflow-hidden border border-white/10 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="bg-white/[0.02] border-b border-white/10">
                <tr>
                  <th className="w-[35%] p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Website</th>
                  <th className="w-[25%] p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Username</th>
                  <th className="w-[25%] p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</th>
                  <th className="w-[15%] p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {filteredPasswords.map((item) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="p-4 overflow-hidden">
                        <div className="flex items-center gap-3 truncate">
                          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                            <Globe className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-sm font-medium text-slate-200 truncate">{item.site}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-400 truncate">{item.username}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-500">
                            {showPasswordMap[item.id] ? item.password : "••••••••••••"}
                          </span>
                          <button onClick={() => setShowPasswordMap({...showPasswordMap, [item.id]: !showPasswordMap[item.id]})} className="p-1.5 text-slate-600 hover:text-slate-300 transition-colors">
                            {showPasswordMap[item.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { navigator.clipboard.writeText(item.password); toast.success("Password copied!"); }} className="p-1.5 text-slate-600 hover:text-slate-300 transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Breach Status */}
                          {!breachResults[item.id] ? (
                            <button onClick={() => checkBreach(item.password, item.id)} className="p-1.5 text-blue-400/50 hover:text-blue-400">
                              <Shield className="w-4 h-4" />
                            </button>
                          ) : breachResults[item.id].breached ? (
                            <div className="flex items-center gap-1 text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded text-[10px] font-bold border border-rose-500/20">
                              <AlertTriangle className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20">
                              <ShieldCheck className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setform(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deletePassword(item.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredPasswords.length === 0 && !loading && (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto border border-white/5">
                  <Shield className="w-8 h-8 text-slate-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 font-medium">No passwords saved yet.</p>
                  <p className="text-slate-600 text-xs">Add your first password to get started.</p>
                </div>
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-emerald-500 text-sm font-bold hover:underline">
                  Add Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manager;
