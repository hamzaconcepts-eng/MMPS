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
    attendanceTrend: "Attendance Trend (This Week)",
    feeCollection: "Fee Collection Status",
    paid: "Paid",
    partiallyPaid: "Partially Paid",
    unpaid: "Unpaid",
    recentActivity: "Recent Activity",
    quickStats: "Quick Stats",
    classrooms: "Classrooms",
    totalParents: "Total Parents",
    absentToday: "Absent Today",
    overdueFees: "Overdue Fees",
    currency: "OMR",
    sun: "Sun",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
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
    attendanceTrend: "اتجاه الحضور (هذا الأسبوع)",
    feeCollection: "حالة تحصيل الرسوم",
    paid: "مدفوع",
    partiallyPaid: "مدفوع جزئياً",
    unpaid: "غير مدفوع",
    recentActivity: "النشاط الأخير",
    quickStats: "إحصائيات سريعة",
    classrooms: "الفصول",
    totalParents: "أولياء الأمور",
    absentToday: "الغياب اليوم",
    overdueFees: "رسوم متأخرة",
    currency: "ر.ع",
    sun: "أحد",
    mon: "إثن",
    tue: "ثلا",
    wed: "أربع",
    thu: "خمي",
  },
};

const attendanceData = [
  { day: "sun", value: 93 },
  { day: "mon", value: 95 },
  { day: "tue", value: 89 },
  { day: "wed", value: 94 },
  { day: "thu", value: 92 },
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
    color: "bg-teal-400",
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

  // Line graph calculations
  const graphW = 280;
  const graphH = 80;
  const padX = 10;
  const padY = 10;
  const minVal = Math.min(...attendanceData.map((d) => d.value)) - 3;
  const maxVal = Math.max(...attendanceData.map((d) => d.value)) + 3;
  const points = attendanceData.map((d, i) => ({
    x: padX + (i / (attendanceData.length - 1)) * (graphW - padX * 2),
    y: padY + (1 - (d.value - minVal) / (maxVal - minVal)) * (graphH - padY * 2),
    value: d.value,
    day: d.day,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${graphH} L ${points[0].x} ${graphH} Z`;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-3">
        <h1 className="text-base font-bold text-warm-800">{labels.dashboard}</h1>
        <p className="text-xs text-warm-500">{labels.overview}</p>
      </div>

      {/* Stat Cards */}
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: labels.totalStudents,
            value: "1,240",
            sub: `+8 ${labels.vsLastMonth}`,
            subColor: "text-success",
            accent: "bg-teal-50 border-teal-100",
          },
          {
            label: labels.totalTeachers,
            value: "86",
            sub: `82 ${labels.presentToday}`,
            subColor: "text-teal-600",
            accent: "bg-orange-50 border-orange-100",
          },
          {
            label: labels.todayAttendance,
            value: "94.2%",
            sub: `+1.1% ${labels.vsLastMonth}`,
            subColor: "text-success",
            accent: "bg-white border-gray-200",
          },
          {
            label: labels.outstandingFees,
            value: "12,400",
            sub: `78% ${labels.collected}`,
            subColor: "text-orange-500",
            prefix: `${labels.currency} `,
            accent: "bg-white border-gray-200",
          },
          {
            label: labels.monthlyRevenue,
            value: "45,200",
            sub: `+5% ${labels.vsLastMonth}`,
            subColor: "text-teal-600",
            prefix: `${labels.currency} `,
            accent: "bg-white border-gray-200",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-lg border p-3 shadow-card ${stat.accent}`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-warm-500">
              {stat.label}
            </p>
            <p className="mt-0.5 text-xl font-extrabold tracking-tight text-warm-800">
              {stat.prefix || ""}{stat.value}
            </p>
            {stat.sub && (
              <p className={`mt-0.5 text-[10px] font-semibold ${stat.subColor}`}>
                {stat.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Middle Section: Attendance Trend + Fee Collection */}
      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Attendance Trend — Line Graph */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-card">
          <h3 className="mb-2 text-xs font-bold text-warm-800">
            {labels.attendanceTrend}
          </h3>
          <svg viewBox={`0 0 ${graphW} ${graphH + 18}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            {/* Area fill */}
            <path d={areaPath} fill="rgba(20,184,166,0.08)" />
            {/* Line */}
            <path d={linePath} fill="none" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dots + labels */}
            {points.map((p, i) => {
              const dayKey = p.day as keyof typeof labels;
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill="#14B8A6" />
                  <circle cx={p.x} cy={p.y} r="2.5" fill="white" />
                  <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize="9" fontWeight="700" fill="#3B3532">
                    {p.value}%
                  </text>
                  <text x={p.x} y={graphH + 12} textAnchor="middle" fontSize="8" fontWeight="500" fill="#B5ADA5">
                    {labels[dayKey]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Fee Collection Status */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-card">
          <h3 className="mb-2 text-xs font-bold text-warm-800">
            {labels.feeCollection}
          </h3>
          <div className="space-y-2">
            {[
              { label: labels.paid, value: "68%", amount: `${labels.currency} 84,200`, color: "bg-success", width: "68%" },
              { label: labels.partiallyPaid, value: "14%", amount: `${labels.currency} 17,400`, color: "bg-orange-400", width: "14%" },
              { label: labels.unpaid, value: "18%", amount: `${labels.currency} 22,400`, color: "bg-danger", width: "18%" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-warm-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-warm-500">{item.amount}</span>
                    <span className="font-bold text-warm-800">{item.value}</span>
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
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-200 pt-2">
            <div className="text-center">
              <p className="text-sm font-extrabold text-success">842</p>
              <p className="text-[10px] text-warm-500">{labels.paid}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-extrabold text-orange-500">174</p>
              <p className="text-[10px] text-warm-500">{labels.partiallyPaid}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-extrabold text-danger">224</p>
              <p className="text-[10px] text-warm-500">{labels.unpaid}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activity + Quick Stats */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-card">
          <h3 className="mb-2 text-xs font-bold text-warm-800">
            {labels.recentActivity}
          </h3>
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${a.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-warm-800 leading-tight">
                    {a.text[lang]}
                  </p>
                  <p className="text-[10px] text-warm-500">{a.time[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-card">
          <h3 className="mb-2 text-xs font-bold text-warm-800">
            {labels.quickStats}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: labels.classrooms, value: "42", icon: "home", color: "bg-teal-50 text-teal-600" },
              { label: labels.totalParents, value: "986", icon: "heart", color: "bg-orange-100 text-orange-600" },
              { label: labels.absentToday, value: "72", icon: "alert", color: "bg-orange-100 text-orange-500" },
              { label: labels.overdueFees, value: "134", icon: "clock", color: "bg-danger-bg text-danger" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 rounded-lg bg-gray-100 px-3 py-2.5"
              >
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                  <QuickStatIcon name={item.icon} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-warm-800">{item.value}</p>
                  <p className="text-[10px] text-warm-500">{item.label}</p>
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
    heart: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
    ),
    alert: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
    ),
    clock: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    ),
  };
  return <>{icons[name] || null}</>;
}
