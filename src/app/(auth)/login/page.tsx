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
          className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500 transition-colors hover:border-teal-500 hover:text-teal-600"
        >
          {lang === "en" ? "عربي" : "EN"}
        </button>
      </div>

      <div className="rounded-xl bg-white p-8 shadow-card">
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
          <h1 className="font-arabic text-xl font-bold text-dark-800" dir="rtl">
            مدرسة مشاعل مسقط الخاصة
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Mashaail Muscat Private School
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={`space-y-4 ${isRtl ? "font-arabic" : ""}`}>
          {/* Error Message */}
          {error && (
            <div className="rounded-sm bg-danger-bg px-4 py-2.5 text-xs font-medium text-danger-text">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              {labels.username}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={labels.usernamePlaceholder}
              required
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm text-dark-800 outline-none transition-colors placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              {labels.password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={labels.passwordPlaceholder}
                required
                className={`w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm text-dark-800 outline-none transition-colors placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 ${isRtl ? "pl-11" : "pr-11"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isRtl ? "left-3" : "right-3"}`}
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
            className="w-full rounded-sm bg-teal-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? labels.signingIn : labels.signIn}
          </button>
        </form>
      </div>
    </div>
  );
}
