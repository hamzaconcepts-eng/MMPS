"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { useStudents, type SortField, type StudentRow } from "@/lib/use-students";
import StudentModal from "./student-modal";

const t = {
  en: {
    title: "Students",
    subtitle: "Student directory and management",
    total: "Total",
    active: "Active",
    male: "Male",
    female: "Female",
    searchPlaceholder: "Search by name...",
    allGrades: "All Grades",
    allStatus: "All Status",
    statusActive: "Active",
    statusInactive: "Inactive",
    hash: "#",
    name: "Name",
    gradeClass: "Grade / Class",
    gender: "Gender",
    parent: "Parent",
    phone: "Phone",
    status: "Status",
    actions: "Actions",
    loading: "Loading students...",
    noResults: "No students found",
    section: "Section",
    addStudent: "+ Add Student",
    deleteSelected: "Delete Selected",
    edit: "Edit",
    page: "Page",
    of: "of",
    showing: "Showing",
    to: "to",
    prev: "Prev",
    next: "Next",
    confirmDelete: "Are you sure you want to delete the selected students? This cannot be undone.",
    enterPassword: "Enter password to confirm deletion:",
    wrongPassword: "Incorrect password. Deletion cancelled.",
    print: "Print PDF",
    printTitle: "Student List — Mashaail Muscat Private School",
    printDate: "Printed on",
    printTotal: "Total students",
  },
  ar: {
    title: "الطلاب",
    subtitle: "دليل الطلاب والإدارة",
    total: "الإجمالي",
    active: "نشط",
    male: "ذكور",
    female: "إناث",
    searchPlaceholder: "ابحث بالاسم...",
    allGrades: "جميع الصفوف",
    allStatus: "جميع الحالات",
    statusActive: "نشط",
    statusInactive: "غير نشط",
    hash: "#",
    name: "الاسم",
    gradeClass: "الصف / الشعبة",
    gender: "الجنس",
    parent: "ولي الأمر",
    phone: "الهاتف",
    status: "الحالة",
    actions: "إجراءات",
    loading: "جارٍ تحميل الطلاب...",
    noResults: "لم يتم العثور على طلاب",
    section: "شعبة",
    addStudent: "+ إضافة طالب",
    deleteSelected: "حذف المحدد",
    edit: "تعديل",
    page: "صفحة",
    of: "من",
    showing: "عرض",
    to: "إلى",
    prev: "السابق",
    next: "التالي",
    confirmDelete: "هل أنت متأكد من حذف الطلاب المحددين؟ لا يمكن التراجع عن هذا الإجراء.",
    enterPassword: "أدخل كلمة المرور لتأكيد الحذف:",
    wrongPassword: "كلمة المرور غير صحيحة. تم إلغاء الحذف.",
    print: "طباعة PDF",
    printTitle: "قائمة الطلاب — مدرسة مشاعل مسقط الخاصة",
    printDate: "تاريخ الطباعة",
    printTotal: "إجمالي الطلاب",
  },
};

/* Build visible page numbers: e.g. [1, 2, 3, "...", 7] */
function pageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];
  pages.push(1);

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

/* Sort arrow indicator */
function SortIcon({ field, current, dir }: { field: SortField; current: SortField; dir: string }) {
  if (field !== current) return <span className="ml-0.5 text-warm-400/40">↕</span>;
  return <span className="ml-0.5 text-orange-500">{dir === "asc" ? "↑" : "↓"}</span>;
}

export default function StudentsPage() {
  const { lang } = useLang();
  const labels = t[lang];
  const [deleting, setDeleting] = useState(false);
  const [modalStudent, setModalStudent] = useState<StudentRow | null>(null);
  const [modalEditMode, setModalEditMode] = useState(false);

  const {
    students,
    filtered,
    allStudents,
    grades,
    classrooms,
    transportZones,
    loading,
    search,
    setSearch,
    gradeFilter,
    setGradeFilter,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDir,
    toggleSort,
    page,
    setPage,
    totalPages,
    pageSize,
    selected,
    toggleSelect,
    toggleSelectAll,
    deleteSelected,
    updateStudent,
  } = useStudents(lang);

  const totalCount = allStudents.length;
  const activeCount = allStudents.filter((s) => s.status.toLowerCase() === "active").length;
  const maleCount = allStudents.filter((s) => s.gender.toLowerCase() === "male").length;
  const femaleCount = allStudents.filter((s) => s.gender.toLowerCase() === "female").length;

  const stats = [
    { label: labels.total, value: totalCount, color: "text-warm-800" },
    { label: labels.active, value: activeCount, color: "text-orange-500" },
    { label: labels.male, value: maleCount, color: "text-sky-600" },
    { label: labels.female, value: femaleCount, color: "text-pink-500" },
  ];

  const pageStart = (page - 1) * pageSize + 1;
  const pageEnd = Math.min(page * pageSize, filtered.length);
  const allPageSelected = students.length > 0 && students.every((s) => selected.has(s.id));
  const hasSelection = selected.size > 0;

  // Keep modalStudent in sync with allStudents after an edit
  useEffect(() => {
    if (modalStudent) {
      const fresh = allStudents.find((s) => s.id === modalStudent.id);
      if (fresh && fresh !== modalStudent) setModalStudent(fresh);
    }
  }, [allStudents, modalStudent]);

  async function handleDelete() {
    const password = window.prompt(labels.enterPassword);
    if (password === null) return; // cancelled
    if (password !== "9999") {
      window.alert(labels.wrongPassword);
      return;
    }
    setDeleting(true);
    await deleteSelected();
    setDeleting(false);
  }

  function handlePrint() {
    const isAr = lang === "ar";
    const dir = isAr ? "rtl" : "ltr";
    const fontFamily = isAr
      ? "'Segoe UI', 'Arial', sans-serif"
      : "'Segoe UI', sans-serif";
    const now = new Date().toLocaleDateString(isAr ? "ar-OM" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const rows = filtered
      .map((s, i) => {
        const name = isAr ? s.name_ar : s.name_en;
        const grade = isAr ? s.grade_name_ar : s.grade_name_en;
        const cls = `${grade} — ${labels.section} ${s.classroom_section}`;
        const gender = s.gender.toLowerCase() === "male" ? labels.male : labels.female;
        const parent = isAr ? s.parent_name_ar : s.parent_name_en;
        const phone = s.parent_phone || "—";
        const status = s.status.toLowerCase() === "active" ? labels.statusActive : labels.statusInactive;
        return `<tr>
          <td>${i + 1}</td>
          <td>${name}</td>
          <td>${cls}</td>
          <td>${gender}</td>
          <td>${parent}</td>
          <td dir="ltr" style="text-align:${isAr ? "right" : "left"}">${phone}</td>
          <td>${status}</td>
        </tr>`;
      })
      .join("");

    const html = `<!DOCTYPE html>
<html dir="${dir}" lang="${lang}">
<head>
<meta charset="utf-8"/>
<title>${labels.printTitle}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: ${fontFamily}; font-size: 11px; color: #333; padding: 20px; direction: ${dir}; }
  h1 { font-size: 16px; font-weight: 700; margin-bottom: 4px; color: #3B3532; }
  .meta { font-size: 10px; color: #888; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #F0922E; color: white; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 8px; text-align: ${isAr ? "right" : "left"}; }
  td { padding: 4px 8px; border-bottom: 1px solid #eee; font-size: 10px; }
  tr:nth-child(even) { background: #fafafa; }
  .footer { margin-top: 12px; font-size: 9px; color: #aaa; text-align: center; }
  @media print { body { padding: 10px; } }
</style>
</head>
<body>
  <h1>${labels.printTitle}</h1>
  <div class="meta">${labels.printDate}: ${now} &nbsp;|&nbsp; ${labels.printTotal}: ${filtered.length}</div>
  <table>
    <thead>
      <tr>
        <th>${labels.hash}</th>
        <th>${labels.name}</th>
        <th>${labels.gradeClass}</th>
        <th>${labels.gender}</th>
        <th>${labels.parent}</th>
        <th>${labels.phone}</th>
        <th>${labels.status}</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Mashaail Muscat Private School — MMPS</div>
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }

  return (
    <div className="flex h-full flex-col gap-1.5">
      {/* Header + Stats + Add button */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-sm font-bold text-warm-800">{labels.title}</h1>
          <p className="text-[10px] text-warm-500/70">{labels.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1">
                <span className={`text-sm font-extrabold ${s.color}`}>{s.value}</span>
                <span className="text-[9px] font-medium text-warm-500/70">{s.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handlePrint}
            disabled={filtered.length === 0}
            className="rounded-xl border border-white/60 bg-white/50 px-3 py-1.5 text-[11px] font-semibold text-warm-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white/70 active:scale-95 disabled:opacity-40"
          >
            {labels.print}
          </button>
          <button className="rounded-xl bg-orange-400 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-orange-500 active:scale-95">
            {labels.addStudent}
          </button>
        </div>
      </div>

      {/* Search + Filters + Delete Selected */}
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="flex-1 rounded-xl border border-white/60 bg-white/50 px-3 py-1.5 text-[11px] text-warm-700 placeholder:text-warm-400/60 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300/40 backdrop-blur-sm"
        />
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="rounded-xl border border-white/60 bg-white/50 px-2.5 py-1.5 text-[11px] text-warm-700 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300/40 backdrop-blur-sm"
        >
          <option value="">{labels.allGrades}</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {lang === "en" ? g.name_en : g.name_ar}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/60 bg-white/50 px-2.5 py-1.5 text-[11px] text-warm-700 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300/40 backdrop-blur-sm"
        >
          <option value="">{labels.allStatus}</option>
          <option value="active">{labels.statusActive}</option>
          <option value="inactive">{labels.statusInactive}</option>
        </select>

        {/* Delete Selected — only shows when items are checked */}
        {hasSelection && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl bg-red-500 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-red-600 active:scale-95 disabled:opacity-50"
          >
            {labels.deleteSelected} ({selected.size})
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="glass flex min-h-0 flex-1 flex-col rounded-2xl shadow-glass">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[11px] text-warm-500/70">{labels.loading}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[11px] text-warm-500/70">{labels.noResults}</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="flex items-center gap-2 border-b border-white/40 px-3 py-1.5">
              {/* Checkbox header */}
              <span className="w-6 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleSelectAll}
                  className="h-3 w-3 cursor-pointer rounded accent-orange-400"
                />
              </span>
              <span className="w-7 text-[9px] font-semibold uppercase tracking-wide text-warm-500/70">
                {labels.hash}
              </span>
              {/* Sortable: Name */}
              <button
                onClick={() => toggleSort("name")}
                className="flex flex-[2] items-center text-[9px] font-semibold uppercase tracking-wide text-warm-500/70 hover:text-warm-700"
              >
                {labels.name}
                <SortIcon field="name" current={sortField} dir={sortDir} />
              </button>
              {/* Sortable: Grade/Class */}
              <button
                onClick={() => toggleSort("class")}
                className="flex flex-[1.5] items-center text-[9px] font-semibold uppercase tracking-wide text-warm-500/70 hover:text-warm-700"
              >
                {labels.gradeClass}
                <SortIcon field="class" current={sortField} dir={sortDir} />
              </button>
              {/* Sortable: Gender */}
              <button
                onClick={() => toggleSort("gender")}
                className="flex w-16 items-center text-[9px] font-semibold uppercase tracking-wide text-warm-500/70 hover:text-warm-700"
              >
                {labels.gender}
                <SortIcon field="gender" current={sortField} dir={sortDir} />
              </button>
              <span className="flex-[1.5] text-[9px] font-semibold uppercase tracking-wide text-warm-500/70">
                {labels.parent}
              </span>
              <span className="w-24 text-[9px] font-semibold uppercase tracking-wide text-warm-500/70">
                {labels.phone}
              </span>
              {/* Sortable: Status */}
              <button
                onClick={() => toggleSort("status")}
                className="flex w-16 items-center text-[9px] font-semibold uppercase tracking-wide text-warm-500/70 hover:text-warm-700"
              >
                {labels.status}
                <SortIcon field="status" current={sortField} dir={sortDir} />
              </button>
              <span className="w-10 text-[9px] font-semibold uppercase tracking-wide text-warm-500/70">
                {labels.actions}
              </span>
            </div>

            {/* Table Body — scrollable */}
            <div className="flex-1 overflow-y-auto">
              {students.map((s, i) => {
                const globalIdx = (page - 1) * pageSize + i + 1;
                const isChecked = selected.has(s.id);

                return (
                  <div
                    key={s.id}
                    onClick={() => { setModalEditMode(false); setModalStudent(s); }}
                    className={`flex cursor-pointer items-center gap-2 px-3 py-1 transition-colors hover:bg-orange-400/10 ${
                      isChecked ? "bg-orange-400/5" : i % 2 === 0 ? "bg-white/10" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <span className="w-6 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(s.id)}
                        className="h-3 w-3 cursor-pointer rounded accent-orange-400"
                      />
                    </span>
                    <span className="w-7 text-[10px] font-medium text-warm-500/60">
                      {globalIdx}
                    </span>
                    <span className="flex-[2] truncate text-[11px] font-medium text-warm-700">
                      {lang === "en" ? s.name_en : s.name_ar}
                    </span>
                    <span className="flex-[1.5] text-[10px] text-warm-600">
                      {lang === "en" ? s.grade_name_en : s.grade_name_ar}
                      <span className="text-warm-500/50"> — </span>
                      {labels.section} {s.classroom_section}
                    </span>
                    <span className="flex w-16 items-center gap-1 text-[10px] text-warm-600">
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          s.gender.toLowerCase() === "male" ? "bg-sky-400" : "bg-pink-400"
                        }`}
                      />
                      {s.gender.toLowerCase() === "male" ? labels.male : labels.female}
                    </span>
                    <span className="flex-[1.5] truncate text-[10px] text-warm-600">
                      {lang === "en" ? s.parent_name_en : s.parent_name_ar}
                    </span>
                    <span className="w-24 text-[10px] text-warm-500/70" dir="ltr">
                      {s.parent_phone || "—"}
                    </span>
                    <span className="w-16">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                          s.status.toLowerCase() === "active"
                            ? "bg-orange-400/15 text-orange-600"
                            : "bg-warm-500/10 text-warm-500"
                        }`}
                      >
                        {s.status.toLowerCase() === "active"
                          ? labels.statusActive
                          : labels.statusInactive}
                      </span>
                    </span>
                    {/* Edit button */}
                    <span className="w-10 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalEditMode(true);
                          setModalStudent(s);
                        }}
                        className="rounded-lg bg-white/50 px-1.5 py-0.5 text-[9px] font-medium text-warm-600 transition-colors hover:bg-orange-400/15 hover:text-orange-600"
                      >
                        {labels.edit}
                      </button>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between border-t border-white/40 px-3 py-1.5">
              <span className="text-[10px] text-warm-500/70">
                {labels.showing} {pageStart}–{pageEnd} {labels.of} {filtered.length}
              </span>
              <div className="flex items-center gap-0.5">
                {/* First */}
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="rounded-lg bg-white/50 px-1.5 py-0.5 text-[10px] font-medium text-warm-600 transition-colors hover:bg-white/70 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  «
                </button>
                {/* Prev */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg bg-white/50 px-1.5 py-0.5 text-[10px] font-medium text-warm-600 transition-colors hover:bg-white/70 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                {/* Page number buttons */}
                {pageNumbers(page, totalPages).map((n, idx) =>
                  n === "..." ? (
                    <span key={`dot-${idx}`} className="px-1 text-[10px] text-warm-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n as number)}
                      className={`min-w-[22px] rounded-lg px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
                        page === n
                          ? "bg-orange-400 text-white shadow-sm"
                          : "bg-white/50 text-warm-600 hover:bg-white/70"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
                {/* Next */}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg bg-white/50 px-1.5 py-0.5 text-[10px] font-medium text-warm-600 transition-colors hover:bg-white/70 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ›
                </button>
                {/* Last */}
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="rounded-lg bg-white/50 px-1.5 py-0.5 text-[10px] font-medium text-warm-600 transition-colors hover:bg-white/70 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  »
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Student Detail Modal */}
      {modalStudent && (
        <StudentModal
          key={`${modalStudent.id}-${modalEditMode}`}
          student={modalStudent}
          lang={lang}
          grades={grades}
          classrooms={classrooms}
          transportZones={transportZones}
          onClose={() => {
            setModalStudent(null);
            setModalEditMode(false);
          }}
          onUpdate={updateStudent}
          initialEdit={modalEditMode}
        />
      )}
    </div>
  );
}
