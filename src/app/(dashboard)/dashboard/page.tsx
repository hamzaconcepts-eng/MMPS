"use client";

import { useLang } from "@/lib/lang-context";

const t = {
  en: {
    dashboard: "Dashboard",
    overview: "School Overview",
    totalStudents: "Total Students",
    totalTeachers: "Total Teachers",
    todayAttendance: "Today's Attendance",
    outstandingFees: "Outstanding Fees",
    monthlyRevenue: "Monthly Revenue",
    vsLastMonth: "vs last month",
    presentToday: "present today",
    collected: "collected this year",
    attendanceTrend: "Attendance Trend (Last 7 Days)",
    feeCollection: "Fee Collection Status",
    paid: "Paid",
    partial: "Partial",
    unpaid: "Unpaid",
    recentActivity: "Recent Activity",
    quickStats: "Quick Stats",
    classrooms: "Classrooms",
    grades: "Grades Offered",
    studentTeacherRatio: "Student : Teacher",
    busRoutes: "Bus Routes",
    currency: "OMR",
    sun: "Sun",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    sat: "Sat",
    today: "Today",
  },
  ar: {
    dashboard: "لوحة التحكم",
    overview: "نظرة عامة على المدرسة",
    totalStudents: "إجمالي الطلاب",
    totalTeachers: "إجمالي المعلمين",
    todayAttendance: "حضور اليوم",
    outstandingFees: "الرسوم المستحقة",
    monthlyRevenue: "الإيرادات الشهرية",
    vsLastMonth: "مقارنة بالشهر الماضي",
    presentToday: "حاضرون اليوم",
    collected: "محصّل هذا العام",
    attendanceTrend: "اتجاه الحضور (آخر 7 أيام)",
    feeCollection: "حالة تحصيل الرسوم",
    paid: "مدفوع",
    partial: "جزئي",
    unpaid: "غير مدفوع",
    recentActivity: "النشاط الأخير",
    quickStats: "إحصائيات سريعة",
    classrooms: "الفصول",
    grades: "المراحل الدراسية",
    studentTeacherRatio: "طالب : معلم",
    busRoutes: "خطوط النقل",
    currency: "ر.ع",
    sun: "أحد",
    mon: "إثن",
    tue: "ثلا",
    wed: "أربع",
    thu: "خمي",
    sat: "سبت",
    today: "اليوم",
  },
};

const attendanceData = [
  { day: "sat", value: 91 },
  { day: "sun", value: 93 },
  { day: "mon", value: 95 },
  { day: "tue", value: 89 },
  { day: "wed", value: 94 },
  { day: "thu", value: 92 },
  { day: "today", value: 94 },
];

const recentActivity = [
  {
    type: "enrollment",
    text: { en: "New student Ahmed Al-Balushi enrolled in Grade 5A", ar: "تسجيل الطالب الجديد أحمد البلوشي في الصف 5أ" },
    time: { en: "2 hours ago", ar: "قبل ساعتين" },
    color: "bg-teal-500",
  },
  {
    type: "payment",
    text: { en: "Fee payment received from Fatima Al-Harthi — OMR 450", ar: "استلام رسوم من فاطمة الحارثية — 450 ر.ع" },
    time: { en: "3 hours ago", ar: "قبل 3 ساعات" },
    color: "bg-success",
  },
  {
    type: "absence",
    text: { en: "Teacher Salim Al-Busaidi marked absent today", ar: "تسجيل غياب المعلم سالم البوسعيدي اليوم" },
    time: { en: "5 hours ago", ar: "قبل 5 ساعات" },
    color: "bg-orange-400",
  },
  {
    type: "exam",
    text: { en: "Math exam scheduled for Grade 7 on Feb 20", ar: "جدولة امتحان الرياضيات للصف 7 في 20 فبراير" },
    time: { en: "Yesterday", ar: "أمس" },
    color: "bg-blue-400",
  },
  {
    type: "payment",
    text: { en: "Fee payment received from Omar Al-Rawahi — OMR 380", ar: "استلام رسوم من عمر الرواحي — 380 ر.ع" },
    time: { en: "Yesterday", ar: "أمس" },
    color: "bg-success",
  },
];

export default function DashboardPage() {
  const { lang } = useLang();
  const labels = t[lang];

  const maxAttendance = 100;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-3">
        <h1 className="text-base font-bold text-dark-800">{labels.dashboard}</h1>
        <p className="text-xs text-gray-500">{labels.overview}</p>
      </div>

      {/* Stat Cards */}
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: labels.totalStudents,
            value: "1,240",
            sub: `+8 ${labels.vsLastMonth}`,
            subColor: "text-success",
          },
          {
            label: labels.totalTeachers,
            value: "86",
            sub: `82 ${labels.presentToday}`,
            subColor: "text-teal-600",
            dark: true,
          },
          {
            label: labels.todayAttendance,
            value: "94.2%",
            sub: `+1.1% ${labels.vsLastMonth}`,
            subColor: "text-success",
          },
          {
            label: labels.outstandingFees,
            value: "12,400",
            sub: `78% ${labels.collected}`,
            subColor: "text-orange-500",
            prefix: `${labels.currency} `,
          },
          {
            label: labels.monthlyRevenue,
            value: "45,200",
            sub: `+5% ${labels.vsLastMonth}`,
            subColor: "text-teal-600",
            prefix: `${labels.currency} `,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-md border p-3 shadow-card ${
              stat.dark
                ? "border-dark-700 bg-dark-800"
                : "border-gray-100 bg-white"
            }`}
          >
            <p
              className={`text-[10px] font-semibold uppercase tracking-wide ${
                stat.dark ? "text-white/50" : "text-gray-400"
              }`}
            >
              {stat.label}
            </p>
            <p
              className={`mt-0.5 text-xl font-extrabold tracking-tight ${
                stat.dark ? "text-white" : "text-dark-800"
              }`}
            >
              {stat.prefix || ""}{stat.value}
            </p>
            <p className={`mt-0.5 text-[10px] font-semibold ${stat.subColor}`}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Middle Section: Attendance Trend + Fee Collection */}
      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Attendance Trend */}
        <div className="rounded-md border border-gray-100 bg-white p-3 shadow-card">
          <h3 className="mb-2 text-xs font-bold text-dark-800">
            {labels.attendanceTrend}
          </h3>
          <div className="flex items-end gap-2">
            {attendanceData.map((d, i) => {
              const dayKey = d.day as keyof typeof labels;
              const height = (d.value / maxAttendance) * 100;
              const isToday = d.day === "today";
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-dark-800">{d.value}%</span>
                  <div
                    className={`w-full rounded-sm ${isToday ? "bg-teal-500" : "bg-teal-200"}`}
                    style={{ height: `${height * 0.7}px` }}
                  />
                  <span className={`text-[9px] font-medium ${isToday ? "text-teal-600 font-bold" : "text-gray-400"}`}>
                    {labels[dayKey] || d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fee Collection Status */}
        <div className="rounded-md border border-gray-100 bg-white p-3 shadow-card">
          <h3 className="mb-2 text-xs font-bold text-dark-800">
            {labels.feeCollection}
          </h3>
          <div className="space-y-2">
            {[
              { label: labels.paid, value: "68%", amount: `${labels.currency} 84,200`, color: "bg-success", width: "68%" },
              { label: labels.partial, value: "14%", amount: `${labels.currency} 17,400`, color: "bg-orange-400", width: "14%" },
              { label: labels.unpaid, value: "18%", amount: `${labels.currency} 22,400`, color: "bg-danger", width: "18%" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-gray-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">{item.amount}</span>
                    <span className="font-bold text-dark-800">{item.value}</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary numbers */}
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-2">
            <div className="text-center">
              <p className="text-sm font-extrabold text-success">842</p>
              <p className="text-[10px] text-gray-400">{labels.paid}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-extrabold text-orange-500">174</p>
              <p className="text-[10px] text-gray-400">{labels.partial}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-extrabold text-danger">224</p>
              <p className="text-[10px] text-gray-400">{labels.unpaid}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activity + Quick Stats */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-md border border-gray-100 bg-white p-3 shadow-card">
          <h3 className="mb-2 text-xs font-bold text-dark-800">
            {labels.recentActivity}
          </h3>
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${a.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-dark-800 leading-tight">
                    {a.text[lang]}
                  </p>
                  <p className="text-[10px] text-gray-400">{a.time[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-md border border-gray-100 bg-white p-3 shadow-card">
          <h3 className="mb-2 text-xs font-bold text-dark-800">
            {labels.quickStats}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: labels.classrooms, value: "42", icon: "home" },
              { label: labels.grades, value: "K–12", icon: "book" },
              { label: labels.studentTeacherRatio, value: "14:1", icon: "users" },
              { label: labels.busRoutes, value: "8", icon: "truck" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 rounded-sm bg-gray-50 px-3 py-2.5"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-600">
                  <QuickStatIcon name={item.icon} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-dark-800">{item.value}</p>
                  <p className="text-[10px] text-gray-400">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStatIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    ),
    book: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
    ),
    users: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    truck: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
    ),
  };
  return <>{icons[name] || null}</>;
}
