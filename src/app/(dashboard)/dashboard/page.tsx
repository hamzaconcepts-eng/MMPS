"use client";

import { useLang } from "@/lib/lang-context";

const t = {
  en: {
    dashboard: "Dashboard",
    overview: "School Overview",
    totalStudents: "Total Students",
    totalTeachers: "Total Teachers",
    todayAttendance: "Today's Attendance",
    feeCollection: "Fee Collection",
    totalRevenue: "Monthly Revenue",
    recentEnrollments: "Recent Enrollments",
    feeOverview: "Fee Overview",
    staffOnLeave: "Staff on Leave Today",
    upcomingHolidays: "Upcoming Holidays",
    name: "Name",
    grade: "Grade",
    date: "Date",
    role: "Role",
    paid: "Paid",
    unpaid: "Unpaid",
    partial: "Partial",
    noData: "No data yet",
    thisWeek: "this week",
    onLeave: "On leave",
    today: "Today",
    thisSemester: "This semester",
    thisMonth: "This month",
    currency: "OMR",
  },
  ar: {
    dashboard: "لوحة التحكم",
    overview: "نظرة عامة على المدرسة",
    totalStudents: "إجمالي الطلاب",
    totalTeachers: "إجمالي المعلمين",
    todayAttendance: "حضور اليوم",
    feeCollection: "تحصيل الرسوم",
    totalRevenue: "الإيرادات الشهرية",
    recentEnrollments: "التسجيلات الأخيرة",
    feeOverview: "نظرة عامة على الرسوم",
    staffOnLeave: "الموظفون في إجازة اليوم",
    upcomingHolidays: "الإجازات القادمة",
    name: "الاسم",
    grade: "الصف",
    date: "التاريخ",
    role: "الوظيفة",
    paid: "مدفوع",
    unpaid: "غير مدفوع",
    partial: "جزئي",
    noData: "لا توجد بيانات بعد",
    thisWeek: "هذا الأسبوع",
    onLeave: "في إجازة",
    today: "اليوم",
    thisSemester: "هذا الفصل",
    thisMonth: "هذا الشهر",
    currency: "ر.ع",
  },
};

const recentStudents = [
  { name: { en: "Ahmed Al-Balushi", ar: "أحمد البلوشي" }, grade: { en: "Grade 5A", ar: "الصف 5أ" }, date: "2026-02-12" },
  { name: { en: "Fatima Al-Harthi", ar: "فاطمة الحارثية" }, grade: { en: "Grade 3B", ar: "الصف 3ب" }, date: "2026-02-11" },
  { name: { en: "Omar Al-Rawahi", ar: "عمر الرواحي" }, grade: { en: "Grade 7A", ar: "الصف 7أ" }, date: "2026-02-10" },
  { name: { en: "Maryam Al-Habsi", ar: "مريم الحبسية" }, grade: { en: "Grade 1A", ar: "الصف 1أ" }, date: "2026-02-09" },
  { name: { en: "Khalid Al-Siyabi", ar: "خالد السيابي" }, grade: { en: "Grade 9B", ar: "الصف 9ب" }, date: "2026-02-08" },
];

const staffOnLeave = [
  { name: { en: "Salim Al-Busaidi", ar: "سالم البوسعيدي" }, role: { en: "Math Teacher", ar: "معلم رياضيات" } },
  { name: { en: "Aisha Al-Kindi", ar: "عائشة الكندية" }, role: { en: "Arabic Teacher", ar: "معلمة لغة عربية" } },
];

const upcomingHolidays = [
  { name: { en: "Isra & Mi'raj", ar: "الإسراء والمعراج" }, date: "2026-02-27" },
  { name: { en: "Ramadan Begins", ar: "بداية رمضان" }, date: "2026-03-17" },
  { name: { en: "Eid Al-Fitr", ar: "عيد الفطر" }, date: "2026-04-16" },
];

export default function DashboardPage() {
  const { lang } = useLang();
  const labels = t[lang];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-dark-800">{labels.dashboard}</h1>
        <p className="text-sm text-gray-500">{labels.overview}</p>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: labels.totalStudents,
            value: "1,240",
            sub: `+12 ${labels.thisWeek}`,
            subColor: "text-success",
          },
          {
            label: labels.totalTeachers,
            value: "86",
            sub: `4 ${labels.onLeave}`,
            subColor: "text-orange-400",
            dark: true,
          },
          {
            label: labels.todayAttendance,
            value: "94.2%",
            sub: labels.today,
            subColor: "text-success",
          },
          {
            label: labels.feeCollection,
            value: "72%",
            sub: labels.thisSemester,
            subColor: "text-orange-500",
          },
          {
            label: labels.totalRevenue,
            value: "45,200",
            sub: labels.thisMonth,
            subColor: "text-teal-600",
            prefix: `${labels.currency} `,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-md border p-4 shadow-card ${
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
              className={`mt-1 text-2xl font-extrabold tracking-tight ${
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

      {/* Middle Section: Recent Enrollments + Fee Overview */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Enrollments */}
        <div className="rounded-md border border-gray-100 bg-white p-5 shadow-card">
          <h3 className="mb-4 text-sm font-bold text-dark-800">
            {labels.recentEnrollments}
          </h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="pb-2 text-start font-semibold">{labels.name}</th>
                <th className="pb-2 text-start font-semibold">{labels.grade}</th>
                <th className="pb-2 text-start font-semibold">{labels.date}</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((s, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 font-medium text-dark-800">
                    {s.name[lang]}
                  </td>
                  <td className="py-2.5 text-gray-500">{s.grade[lang]}</td>
                  <td className="py-2.5 text-gray-500">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fee Overview */}
        <div className="rounded-md border border-gray-100 bg-white p-5 shadow-card">
          <h3 className="mb-4 text-sm font-bold text-dark-800">
            {labels.feeOverview}
          </h3>
          <div className="space-y-3">
            {[
              { label: labels.paid, value: "68%", color: "bg-success", width: "68%" },
              { label: labels.partial, value: "14%", color: "bg-orange-400", width: "14%" },
              { label: labels.unpaid, value: "18%", color: "bg-danger", width: "18%" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-600">{item.label}</span>
                  <span className="font-bold text-dark-800">{item.value}</span>
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
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
            <div className="text-center">
              <p className="text-lg font-extrabold text-success">842</p>
              <p className="text-[10px] text-gray-400">{labels.paid}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-extrabold text-orange-500">174</p>
              <p className="text-[10px] text-gray-400">{labels.partial}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-extrabold text-danger">224</p>
              <p className="text-[10px] text-gray-400">{labels.unpaid}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Staff on Leave + Upcoming Holidays */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Staff on Leave */}
        <div className="rounded-md border border-gray-100 bg-white p-5 shadow-card">
          <h3 className="mb-4 text-sm font-bold text-dark-800">
            {labels.staffOnLeave}
          </h3>
          {staffOnLeave.length > 0 ? (
            <div className="space-y-3">
              {staffOnLeave.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-sm bg-gray-50 px-3 py-2.5"
                >
                  <div>
                    <p className="text-xs font-semibold text-dark-800">
                      {s.name[lang]}
                    </p>
                    <p className="text-[10px] text-gray-400">{s.role[lang]}</p>
                  </div>
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-600">
                    {labels.onLeave}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">{labels.noData}</p>
          )}
        </div>

        {/* Upcoming Holidays */}
        <div className="rounded-md border border-gray-100 bg-white p-5 shadow-card">
          <h3 className="mb-4 text-sm font-bold text-dark-800">
            {labels.upcomingHolidays}
          </h3>
          <div className="space-y-3">
            {upcomingHolidays.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-sm bg-gray-50 px-3 py-2.5"
              >
                <p className="text-xs font-semibold text-dark-800">
                  {h.name[lang]}
                </p>
                <span className="text-[10px] font-medium text-gray-400">
                  {h.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
