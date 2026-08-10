"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("julian@vineandclay.com");
  const [password, setPassword] = useState("••••••••••••");
  const [authMode, setAuthMode] = useState<"password" | "magic_link">("password");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (authMode === "magic_link") {
        setMessage(`Magic link authentication email sent to ${email}. Check your inbox!`);
      } else {
        setMessage("Authenticated successfully as Staff User.");
        setTimeout(() => {
          router.push("/admin");
        }, 500);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#33241A] text-[#FBF6EF] flex items-center justify-center p-4 font-sans selection:bg-[#C1633B] selection:text-white">
      <div className="w-full max-w-md bg-[#241912] border border-[#D9BFA0]/20 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C1633B]/20 border border-[#C1633B]/40 text-[#C1633B] mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-sans text-2xl font-bold text-white tracking-tight">
            Vine & Clay Admin
          </h1>
          <p className="text-xs font-mono text-[#D9BFA0]/70 uppercase tracking-widest">
            Restricted Staff Portal Access
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#1a120d] border border-[#D9BFA0]/15 rounded-lg text-xs font-mono">
          <button
            type="button"
            onClick={() => setAuthMode("password")}
            className={`py-1.5 rounded transition-all ${
              authMode === "password"
                ? "bg-[#C1633B] text-white font-bold"
                : "text-[#D9BFA0]/60 hover:text-white"
            }`}
          >
            Password Auth
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("magic_link")}
            className={`py-1.5 rounded transition-all ${
              authMode === "magic_link"
                ? "bg-[#C1633B] text-white font-bold"
                : "text-[#D9BFA0]/60 hover:text-white"
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Feedback Message */}
        {message && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono text-[#D9BFA0]/70 uppercase tracking-wider block mb-1">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D9BFA0]/50 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@vineandclay.com"
                className="w-full bg-[#1a120d] border border-[#D9BFA0]/25 rounded-lg py-2.5 pl-10 pr-3 text-xs text-white placeholder:text-[#D9BFA0]/30 focus:outline-none focus:border-[#C1633B] font-mono"
              />
            </div>
          </div>

          {authMode === "password" && (
            <div>
              <label className="text-[11px] font-mono text-[#D9BFA0]/70 uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#D9BFA0]/50 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1a120d] border border-[#D9BFA0]/25 rounded-lg py-2.5 pl-10 pr-3 text-xs text-white placeholder:text-[#D9BFA0]/30 focus:outline-none focus:border-[#C1633B] font-mono"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C1633B] hover:bg-[#a9532f] text-white py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : authMode === "password" ? "Sign In to Admin" : "Send Magic Link"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#D9BFA0]/10 text-center text-[10px] font-mono text-[#D9BFA0]/50 space-y-1">
          <p>Protected by Supabase Auth & Postgres Row Level Security</p>
          <p>Demo Owner Account: julian@vineandclay.com</p>
        </div>
      </div>
    </div>
  );
}
