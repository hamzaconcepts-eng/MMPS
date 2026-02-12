"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const t = {
  en: {
    username: "Username",
    usernamePlaceholder: "Enter your username",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    errorInvalid: "Invalid username or password",
    errorGeneric: "Something went wrong. Please try again.",
  },
  ar: {
    username: "اسم المستخدم",
    usernamePlaceholder: "أدخل اسم المستخدم",
    password: "كلمة المرور",
    passwordPlaceholder: "أدخل كلمة المرور",
    signIn: "تسجيل الدخول",
    signingIn: "جاري تسجيل الدخول...",
    errorInvalid: "اسم المستخدم أو كلمة المرور غير صحيحة",
    errorGeneric: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  },
};

export default function LoginPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRtl = lang === "ar";
  const labels = t[lang];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: `${username}@mashaail.local`,
        password,
      });

      if (error) {
        setError(labels.errorInvalid);
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError(labels.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* Language Toggle */}
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-warm-500 transition-all hover:bg-white/80 hover:text-orange-500"
        >
          {lang === "en" ? "عربي" : "EN"}
        </button>
      </div>

      <div className="glass rounded-3xl p-8 shadow-glass">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo.svg"
            alt="Mashaail Muscat Private School"
            width={80}
            height={80}
            priority
          />
        </div>

        {/* School Name */}
        <div className="mb-8 text-center">
          <h1 className="font-arabic text-xl font-bold text-warm-800" dir="rtl">
            مدرسة مشاعل مسقط الخاصة
          </h1>
          <p className="mt-1 text-sm font-medium text-warm-500/70">
            Mashaail Muscat Private School
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={`space-y-4 ${isRtl ? "font-arabic" : ""}`}>
          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-danger-bg/60 px-4 py-2.5 text-xs font-medium text-danger-text">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-warm-600">
              {labels.username}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={labels.usernamePlaceholder}
              required
              className="w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-warm-800 outline-none transition-all placeholder:text-warm-500/40 focus:border-orange-300 focus:bg-white/70 focus:ring-2 focus:ring-orange-200/40"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-warm-600">
              {labels.password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={labels.passwordPlaceholder}
                required
                className={`w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-warm-800 outline-none transition-all placeholder:text-warm-500/40 focus:border-orange-300 focus:bg-white/70 focus:ring-2 focus:ring-orange-200/40 ${isRtl ? "pl-11" : "pr-11"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 text-warm-500/60 hover:text-warm-700 ${isRtl ? "left-3" : "right-3"}`}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-400 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? labels.signingIn : labels.signIn}
          </button>
        </form>
      </div>
    </div>
  );
}
