"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LangProvider, useLang } from "@/lib/lang-context";

const nav = {
  main: [
    { href: "/dashboard", en: "Dashboard", ar: "لوحة التحكم", icon: "grid" },
    { href: "/students", en: "Students", ar: "الطلاب", icon: "users" },
    { href: "/teachers", en: "Teachers", ar: "المعلمون", icon: "briefcase" },
  ],
  academic: [
    { href: "/classrooms", en: "Classrooms", ar: "الفصول", icon: "home" },
    { href: "/attendance", en: "Attendance", ar: "الحضور", icon: "check" },
    { href: "/performance", en: "Performance", ar: "الأداء", icon: "award" },
  ],
  admin: [
    { href: "/fees", en: "Fees", ar: "الرسوم", icon: "dollar" },
    { href: "/transport", en: "Transport", ar: "النقل", icon: "truck" },
    { href: "/holidays", en: "Holidays", ar: "الإجازات", icon: "calendar" },
    { href: "/settings", en: "Settings", ar: "الإعدادات", icon: "settings" },
  ],
};

const sectionLabels = {
  main: { en: "Main", ar: "الرئيسية" },
  academic: { en: "Academic", ar: "أكاديمي" },
  admin: { en: "Administration", ar: "الإدارة" },
};

function NavIcon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
    ),
    users: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    briefcase: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
    ),
    home: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    ),
    clock: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    ),
    check: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    ),
    award: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
    ),
    dollar: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
    ),
    truck: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
    ),
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
    ),
    settings: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    ),
    bell: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
    ),
  };
  return <>{icons[name] || null}</>;
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { lang, setLang, isRtl } = useLang();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const userName = {
    en: "Mahmood Khalfan Al Hadidi",
    ar: "محمود بن خلفان الحديدي",
  };

  function NavSection({ sectionKey, items }: { sectionKey: "main" | "academic" | "admin"; items: typeof nav.main }) {
    return (
      <div className="mb-3">
        <p className="mb-1 px-3 text-[8px] font-bold uppercase tracking-widest text-warm-500/50">
          {sectionLabels[sectionKey][lang]}
        </p>
        <div>
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-all ${
                  active
                    ? "bg-orange-400/15 text-orange-600 shadow-sm"
                    : "text-warm-500 hover:bg-white/50 hover:text-warm-700"
                }`}
              >
                <NavIcon name={item.icon} />
                <span>{item[lang]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className={`flex min-h-dvh ${isRtl ? "font-arabic" : ""}`} style={{ background: "var(--gradient-warm)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — frosted glass */}
      <aside
        className={`glass-subtle fixed z-50 flex h-dvh w-[220px] flex-shrink-0 flex-col transition-transform md:static md:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : isRtl
              ? "translate-x-full md:translate-x-0"
              : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b border-white/30 px-4 py-3">
          <Image src="/logo.svg" alt="Mashaail Muscat" width={28} height={28} />
          <div className="leading-tight">
            <p className="text-[11px] font-bold text-warm-800">
              {lang === "en" ? "Mashaail Muscat" : "مشاعل مسقط"}
            </p>
            <p className="text-[8px] text-warm-500">
              {lang === "en" ? "Private School" : "المدرسة الخاصة"}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <NavSection sectionKey="main" items={nav.main} />
          <NavSection sectionKey="academic" items={nav.academic} />
          <NavSection sectionKey="admin" items={nav.admin} />
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar — frosted glass */}
        <header className="glass flex items-center justify-between px-5 py-2">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-warm-500 md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>

          {/* Welcome */}
          <div className="hidden md:block">
            <h2 className="text-sm font-bold text-warm-800">
              {lang === "en"
                ? `Welcome back, ${userName.en}`
                : `مرحباً بك، ${userName.ar}`}
            </h2>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="rounded-full bg-white/50 px-3 py-1 text-[10px] font-semibold text-warm-500 transition-all hover:bg-white/80 hover:text-orange-500"
            >
              {lang === "en" ? "عربي" : "EN"}
            </button>

            {/* Notifications */}
            <button type="button" className="relative text-warm-400 hover:text-warm-600">
              <NavIcon name="bell" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-400 text-[8px] font-bold text-white">
                3
              </span>
            </button>

            {/* Role Badge */}
            <span className="rounded-full bg-white/50 px-3 py-1 text-[10px] font-bold text-warm-600">
              {lang === "en" ? "Super Admin" : "المسؤول الأعلى"}
            </span>

            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400/20 text-xs font-bold text-orange-600">
              {lang === "en" ? "MH" : "م"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden p-2">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LangProvider>
      <DashboardShell>{children}</DashboardShell>
    </LangProvider>
  );
}
