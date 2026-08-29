import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "./hooks/useAuth";

export default function EditLogin() {
  const { error, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12" style={{ background: "#F8F1E7" }}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="relative bg-[#FAF7F0] rounded-2xl shadow-[0_24px_50px_rgba(62,39,35,0.12)] border border-[#E5DFCF] p-8 sm:p-10">
          {/* Double border accent */}
          <div className="absolute inset-2 border border-[#C6A15B]/30 rounded-xl pointer-events-none" />

          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#C6A15B]/40 pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#C6A15B]/40 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#C6A15B]/40 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#C6A15B]/40 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Brand mark */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center mb-6"
            >
              <div className="w-12 h-12 rounded-full bg-[#5C3A2E] flex items-center justify-center mb-4 shadow-md">
                <Lock className="w-5 h-5 text-[#C6A15B]" strokeWidth={1.8} />
              </div>
              <div className="font-heading font-bold text-[10px] tracking-[0.3em] text-[#C6A15B]">
                POONGOTHAI
              </div>
              <div className="font-body text-[9px] tracking-[0.3em] text-[#7A6152] uppercase mt-1">
                EDIT PANEL
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#3E2723] tracking-tight">
                Welcome Back
              </h1>
              <div className="flex items-center justify-center gap-3 my-2.5">
                <div className="w-10 h-px bg-[#C6A15B]/50" />
                <span className="text-[#C6A15B] text-[10px]">✦</span>
                <div className="w-10 h-px bg-[#C6A15B]/50" />
              </div>
              <p className="font-body text-xs text-[#7A6152]">
                Sign in to manage your salon data
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <label className="block font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A6B52] mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A6B52] pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-[#E5DFCF] rounded-lg text-[#2B2118] placeholder-[#9CA3AF] focus:outline-none focus:border-[#5C3A2E] focus:ring-2 focus:ring-[#5C3A2E]/10 transition-all"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <label className="block font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A6B52] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A6B52] pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-[#E5DFCF] rounded-lg text-[#2B2118] placeholder-[#9CA3AF] focus:outline-none focus:border-[#5C3A2E] focus:ring-2 focus:ring-[#5C3A2E]/10 transition-all"
                  />
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="text-xs text-red-700 font-body">{error}</span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#5C3A2E] text-white font-body text-xs font-semibold tracking-[0.15em] uppercase py-3.5 px-6 rounded-lg hover:bg-[#3E2723] transition-all shadow-md hover:shadow-lg"
              >
                Sign In
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </form>

            <p className="font-body text-[10px] text-[#9CA3AF] mt-6 tracking-wide">
              Authorized personnel only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}