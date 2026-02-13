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
    absentToday: "Absent Today",
    student: "Student",
    teacher: "Teacher",
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
    absentToday: "الغياب اليوم",
    student: "طالب",
    teacher: "معلم",
    currency: "ر.ع",
    sun: "الأحد",
    mon: "الإثنين",
    tue: "الثلاثاء",
    wed: "الأربعاء",
    thu: "الخميس",
  },
};

const attendanceData = [
  { day: "sun", value: 93 },
  { day: "mon", value: 95 },
  { day: "tue", value: 89 },
  { day: "wed", value: 94 },
  { day: "thu", value: 92 },
];

const absentToday = [
  { name: { en: "Khalid bin Ahmed bin Salim Al-Rawahi", ar: "خالد بن أحمد بن سالم الرواحي" }, detail: { en: "Grade 5A", ar: "الصف 5أ" }, type: "student" },
  { name: { en: "Salim bin Nasser bin Ali Al-Busaidi", ar: "سالم بن ناصر بن علي البوسعيدي" }, detail: { en: "Math Teacher", ar: "معلم رياضيات" }, type: "teacher" },
  { name: { en: "Maryam bint Hamad bin Said Al-Habsi", ar: "مريم بنت حمد بن سعيد الحبسية" }, detail: { en: "Grade 3B", ar: "الصف 3ب" }, type: "student" },
  { name: { en: "Yusuf bin Mohammed bin Rashid Al-Kindi", ar: "يوسف بن محمد بن راشد الكندي" }, detail: { en: "Grade 7A", ar: "الصف 7أ" }, type: "student" },
  { name: { en: "Aisha bint Khalfan bin Hamood Al-Harthi", ar: "عائشة بنت خلفان بن حمود الحارثية" }, detail: { en: "Grade 2A", ar: "الصف 2أ" }, type: "student" },
];

const recentActivity = [
  {
    type: "enrollment",
    text: { en: "New student Ahmed Al-Balushi enrolled in Grade 5A", ar: "تسجيل الطالب الجديد أحمد البلوشي في الصف 5أ" },
    time: { en: "2 hours ago", ar: "قبل ساعتين" },
  },
  {
    type: "payment",
    text: { en: "Fee payment received from Fatima Al-Harthi — OMR 450", ar: "استلام رسوم من فاطمة الحارثية — 450 ر.ع" },
    time: { en: "3 hours ago", ar: "قبل 3 ساعات" },
  },
  {
    type: "absence",
    text: { en: "Teacher Salim Al-Busaidi marked absent today", ar: "تسجيل غياب المعلم سالم البوسعيدي اليوم" },
    time: { en: "5 hours ago", ar: "قبل 5 ساعات" },
  },
  {
    type: "exam",
    text: { en: "Math exam scheduled for Grade 7 on Feb 20", ar: "جدولة امتحان الرياضيات للصف 7 في 20 فبراير" },
    time: { en: "Yesterday", ar: "أمس" },
  },
];

export default function DashboardPage() {
  const { lang } = useLang();
  const labels = t[lang];

  // Line graph calculations
  const isRtl = lang === "ar";
  const graphW = 280;
  const graphH = 80;
  const padX = isRtl ? 30 : 16;
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
      <div className="mb-1.5">
        <h1 className="text-base font-bold text-warm-800">{labels.dashboard}</h1>
        <p className="text-xs text-warm-500/70">{labels.overview}</p>
      </div>

      {/* Stat Cards */}
      <div className="mb-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: labels.totalStudents,
            value: "1,240",
            sub: `+8 ${labels.vsLastMonth}`,
            subColor: "text-orange-500",
          },
          {
            label: labels.totalTeachers,
            value: "86",
            sub: `82 ${labels.presentToday}`,
            subColor: "text-warm-500",
          },
          {
            label: labels.todayAttendance,
            value: "94.2%",
            sub: `+1.1% ${labels.vsLastMonth}`,
            subColor: "text-orange-500",
          },
          {
            label: labels.outstandingFees,
            value: "12,400",
            sub: `78% ${labels.collected}`,
            subColor: "text-warm-500",
            prefix: `${labels.currency} `,
          },
          {
            label: labels.monthlyRevenue,
            value: "45,200",
            sub: `+5% ${labels.vsLastMonth}`,
            subColor: "text-orange-500",
            prefix: `${labels.currency} `,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass rounded-2xl p-2.5 shadow-glass"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-warm-500/70">
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
      <div className="mb-1.5 grid grid-cols-1 gap-1.5 lg:grid-cols-2">
        {/* Attendance Trend — Line Graph */}
        <div className="glass rounded-2xl p-2 shadow-glass">
          <h3 className="mb-1 text-xs font-bold text-warm-800">
            {labels.attendanceTrend}
          </h3>
          <svg viewBox={`0 0 ${graphW} ${graphH + 22}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            {/* Area fill */}
            <path d={areaPath} fill="rgba(240,146,46,0.06)" />
            {/* Line */}
            <path d={linePath} fill="none" stroke="#F0922E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dots + labels */}
            {points.map((p, i) => {
              const dayKey = p.day as keyof typeof labels;
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill="#F0922E" />
                  <circle cx={p.x} cy={p.y} r="2.5" fill="white" />
                  <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize="9" fontWeight="700" fill="#3B3532">
                    {p.value}%
                  </text>
                  <text x={p.x} y={graphH + 13} textAnchor="middle" fontSize={isRtl ? "9" : "8"} fontWeight="500" fill="#B5ADA5" direction={isRtl ? "rtl" : undefined}>
                    {labels[dayKey]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Fee Collection Status */}
        <div className="glass rounded-2xl p-2 shadow-glass">
          <h3 className="mb-1 text-xs font-bold text-warm-800">
            {labels.feeCollection}
          </h3>
          <div className="space-y-1.5">
            {[
              { label: labels.paid, value: "68%", amount: `${labels.currency} 84,200`, color: "bg-orange-400", width: "68%" },
              { label: labels.partiallyPaid, value: "14%", amount: `${labels.currency} 17,400`, color: "bg-orange-300", width: "14%" },
              { label: labels.unpaid, value: "18%", amount: `${labels.currency} 22,400`, color: "bg-warm-500/30", width: "18%" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-warm-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-warm-500/70">{item.amount}</span>
                    <span className="font-bold text-warm-800">{item.value}</span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/50">
                  <div
                    className={`h-1.5 rounded-full ${item.color}`}
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activity + Absent Today */}
      <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="glass rounded-2xl p-2 shadow-glass">
          <h3 className="mb-1 text-xs font-bold text-warm-800">
            {labels.recentActivity}
          </h3>
          <div className="space-y-1">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white/40 px-3 py-1.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-warm-700 leading-tight">
                    {a.text[lang]}
                  </p>
                  <p className="text-[10px] text-warm-500/60">{a.time[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Absent Today */}
        <div className="glass rounded-2xl p-2 shadow-glass">
          <h3 className="mb-1 text-xs font-bold text-warm-800">
            {labels.absentToday}
          </h3>
          <div className="space-y-1">
            {absentToday.map((person, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white/40 px-3 py-1.5">
                <div>
                  <p className="text-[11px] font-medium text-warm-700">
                    {person.name[lang]}
                  </p>
                  <p className="text-[10px] text-warm-500/60">
                    {person.detail[lang]}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                  person.type === "teacher"
                    ? "bg-orange-400/15 text-orange-600"
                    : "bg-warm-500/10 text-warm-500"
                }`}>
                  {labels[person.type as keyof typeof labels]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

