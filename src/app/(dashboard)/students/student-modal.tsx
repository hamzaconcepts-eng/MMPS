"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  StudentRow,
  ClassroomOption,
  TransportZoneOption,
} from "@/lib/use-students";

/* ── Translations ─────────────────────────────────────────────── */

const t = {
  en: {
    studentDetails: "Student Details",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    fullNameEn: "Full Name (English)",
    fullNameAr: "Full Name (Arabic)",
    gender: "Gender",
    dateOfBirth: "Date of Birth",
    age: "Age",
    status: "Status",
    enrollmentDate: "Enrollment Date",
    academicInfo: "Academic Information",
    grade: "Grade",
    classroom: "Classroom",
    section: "Section",
    parentInfo: "Parent / Guardian",
    parentName: "Name",
    parentNameEn: "Name (English)",
    parentNameAr: "Name (Arabic)",
    relationship: "Relationship",
    phone: "Phone",
    email: "Email",
    transportInfo: "Transport",
    transportZone: "Bus Zone",
    noTransport: "No bus zone",
    homeLocation: "Home Location",
    male: "Male",
    female: "Female",
    active: "Active",
    inactive: "Inactive",
    father: "Father",
    mother: "Mother",
    guardian: "Guardian",
    years: "years",
    close: "Close",
    edit: "Edit",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    viewOnMap: "View on Map",
    shareLocation: "Share",
    locationCopied: "Location link copied!",
    none: "None",
    selectGrade: "Select grade",
    selectClassroom: "Select classroom",
    selectZone: "Select zone",
    changePhoto: "Change Photo",
    removePhoto: "Remove",
    photo: "Photo",
  },
  ar: {
    studentDetails: "تفاصيل الطالب",
    personalInfo: "المعلومات الشخصية",
    fullName: "الاسم الكامل",
    fullNameEn: "الاسم الكامل (إنجليزي)",
    fullNameAr: "الاسم الكامل (عربي)",
    gender: "الجنس",
    dateOfBirth: "تاريخ الميلاد",
    age: "العمر",
    status: "الحالة",
    enrollmentDate: "تاريخ التسجيل",
    academicInfo: "المعلومات الأكاديمية",
    grade: "الصف",
    classroom: "الفصل",
    section: "الشعبة",
    parentInfo: "ولي الأمر",
    parentName: "الاسم",
    parentNameEn: "الاسم (إنجليزي)",
    parentNameAr: "الاسم (عربي)",
    relationship: "صلة القرابة",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    transportInfo: "النقل",
    transportZone: "منطقة الحافلة",
    noTransport: "بدون منطقة حافلة",
    homeLocation: "موقع المنزل",
    male: "ذكر",
    female: "أنثى",
    active: "نشط",
    inactive: "غير نشط",
    father: "أب",
    mother: "أم",
    guardian: "ولي أمر",
    years: "سنة",
    close: "إغلاق",
    edit: "تعديل",
    save: "حفظ",
    saving: "جارٍ الحفظ...",
    cancel: "إلغاء",
    viewOnMap: "عرض على الخريطة",
    shareLocation: "مشاركة",
    locationCopied: "تم نسخ رابط الموقع!",
    none: "بدون",
    selectGrade: "اختر الصف",
    selectClassroom: "اختر الفصل",
    selectZone: "اختر المنطقة",
    changePhoto: "تغيير الصورة",
    removePhoto: "إزالة",
    photo: "الصورة",
  },
};

/* ── Transport zone coordinates (real Muscat locations) ──────── */

/* Real residential home locations in Seeb / Al Seeb, Muscat, Oman */
const ZONE_COORDS: Record<string, { lat: number; lng: number }> = {
  "Sur Al Hadid":       { lat: 23.6012, lng: 58.1763 },
  "سور الحديد":         { lat: 23.6012, lng: 58.1763 },
  "Sharadi":            { lat: 23.5943, lng: 58.1682 },
  "الشرادي":            { lat: 23.5943, lng: 58.1682 },
  "Mabellah North":     { lat: 23.6351, lng: 58.1147 },
  "المعبيلة الشمالية":  { lat: 23.6351, lng: 58.1147 },
  "Mabellah South":     { lat: 23.6189, lng: 58.1274 },
  "المعبيلة الجنوبية":  { lat: 23.6189, lng: 58.1274 },
  "Mabellah 6/7/8":     { lat: 23.6278, lng: 58.1215 },
  "المعبيلة 6/7/8":     { lat: 23.6278, lng: 58.1215 },
  "Al Nasar":           { lat: 23.6134, lng: 58.1521 },
  "النصر":              { lat: 23.6134, lng: 58.1521 },
  "Wadi Al Awami":      { lat: 23.5745, lng: 58.1638 },
  "وادي العوامي":       { lat: 23.5745, lng: 58.1638 },
  "Wadi Bahais":        { lat: 23.5623, lng: 58.1712 },
  "وادي بحائص":         { lat: 23.5623, lng: 58.1712 },
  "Seeb Suq/Qalah":    { lat: 23.6682, lng: 58.1873 },
  "سوق السيب/القلعة":   { lat: 23.6682, lng: 58.1873 },
};

/**
 * Generate a deterministic "home" lat/lng in the Seeb residential area
 * from a student UUID. The same ID always produces the same location.
 * Bounding box covers residential Seeb:
 *   lat 23.560 – 23.670,  lng 58.110 – 58.195
 */
function homeCoords(id: string): { lat: number; lng: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  // Use two different slices of the hash for lat and lng
  const latSeed = ((hash >>> 0) % 10000) / 10000;          // 0..1
  const lngSeed = (((hash >>> 0) * 127 + 9973) % 10000) / 10000; // 0..1
  return {
    lat: 23.56 + latSeed * 0.11,   // 23.560 – 23.670
    lng: 58.11 + lngSeed * 0.085,  // 58.110 – 58.195
  };
}

/* ── Helpers ──────────────────────────────────────────────────── */

function calcAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function formatDate(dateStr: string, lang: "en" | "ar"): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === "ar" ? "ar-OM" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ── Props ────────────────────────────────────────────────────── */

interface GradeOption {
  id: string;
  name_en: string;
  name_ar: string;
}

interface Props {
  student: StudentRow;
  lang: "en" | "ar";
  grades: GradeOption[];
  classrooms: ClassroomOption[];
  transportZones: TransportZoneOption[];
  onClose: () => void;
  onUpdate: (
    id: string,
    updates: {
      name_en: string;
      name_ar: string;
      gender: string;
      date_of_birth: string;
      status: string;
      enrollment_date: string;
      classroom_id: string;
      transport_zone_id: string | null;
      parent_name_en: string;
      parent_name_ar: string;
      parent_phone: string;
      parent_email: string;
      parent_relationship: string;
    }
  ) => Promise<boolean>;
  initialEdit?: boolean;
}

/* ── Component ────────────────────────────────────────────────── */

export default function StudentModal({
  student,
  lang,
  grades,
  classrooms,
  transportZones,
  onClose,
  onUpdate,
  initialEdit = false,
}: Props) {
  const labels = t[lang];
  const s = student;
  const isAr = lang === "ar";
  const isMale = s.gender.toLowerCase() === "male";

  // Edit mode state
  const [editing, setEditing] = useState(initialEdit);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Photo state
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [pendingPhotoPreview, setPendingPhotoPreview] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load photo from Supabase Storage on mount
  useEffect(() => {
    const supabase = createClient();
    const { data } = supabase.storage
      .from("student-photos")
      .getPublicUrl(`${s.id}.jpg`);
    // Check if the image actually exists by loading it
    const img = new Image();
    img.onload = () => setPhotoUrl(data.publicUrl);
    img.onerror = () => setPhotoUrl(null);
    img.src = data.publicUrl + "?t=" + Date.now();
  }, [s.id]);

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingPhoto(file);
    setRemovePhoto(false);
    const url = URL.createObjectURL(file);
    setPendingPhotoPreview(url);
  }

  function handleRemovePhoto() {
    setPendingPhoto(null);
    setPendingPhotoPreview(null);
    setRemovePhoto(true);
  }

  // Form state
  const [form, setForm] = useState({
    name_en: s.name_en,
    name_ar: s.name_ar,
    gender: s.gender.toLowerCase(),
    date_of_birth: s.date_of_birth,
    status: s.status.toLowerCase(),
    enrollment_date: s.enrollment_date,
    grade_id: s.grade_id,
    classroom_id: s.classroom_id,
    transport_zone_id: s.transport_zone_id || "",
    parent_name_en: s.parent_name_en,
    parent_name_ar: s.parent_name_ar,
    parent_phone: s.parent_phone || "",
    parent_email: s.parent_email || "",
    parent_relationship: s.parent_relationship.toLowerCase(),
  });

  // Derived display values (from student prop, not form)
  const name = isAr ? s.name_ar : s.name_en;
  const grade = isAr ? s.grade_name_ar : s.grade_name_en;
  const classroom = isAr ? s.classroom_name_ar : s.classroom_name_en;
  const parentName = isAr ? s.parent_name_ar : s.parent_name_en;
  const zone = isAr ? s.transport_zone_ar : s.transport_zone_en;

  const relationshipMap: Record<string, string> = {
    father: labels.father,
    mother: labels.mother,
    guardian: labels.guardian,
  };

  // Avatar initials
  const nameParts = (isAr ? s.name_ar : s.name_en).split(" ");
  const initials =
    nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : nameParts[0].slice(0, 2).toUpperCase();

  // Home location — every student gets one, deterministic from their ID
  const home = homeCoords(s.id);
  const homeMapsUrl = `https://www.google.com/maps/search/?api=1&query=${home.lat},${home.lng}`;

  // Filtered classrooms for selected grade in edit mode
  const filteredClassrooms = classrooms.filter(
    (c) => c.grade_id === form.grade_id
  );

  function handleFormChange(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // If grade changed, reset classroom
      if (field === "grade_id") {
        next.classroom_id = "";
      }
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);

    // Handle photo upload / removal
    const supabase = createClient();
    const photoPath = `${s.id}.jpg`;

    if (removePhoto) {
      await supabase.storage.from("student-photos").remove([photoPath]);
      setPhotoUrl(null);
    } else if (pendingPhoto) {
      await supabase.storage
        .from("student-photos")
        .upload(photoPath, pendingPhoto, { upsert: true });
      const { data } = supabase.storage
        .from("student-photos")
        .getPublicUrl(photoPath);
      setPhotoUrl(data.publicUrl + "?t=" + Date.now());
    }

    const ok = await onUpdate(s.id, {
      name_en: form.name_en,
      name_ar: form.name_ar,
      gender: form.gender,
      date_of_birth: form.date_of_birth,
      status: form.status,
      enrollment_date: form.enrollment_date,
      classroom_id: form.classroom_id,
      transport_zone_id: form.transport_zone_id || null,
      parent_name_en: form.parent_name_en,
      parent_name_ar: form.parent_name_ar,
      parent_phone: form.parent_phone,
      parent_email: form.parent_email,
      parent_relationship: form.parent_relationship,
    });
    setSaving(false);
    if (ok) {
      setPendingPhoto(null);
      setPendingPhotoPreview(null);
      setRemovePhoto(false);
      setEditing(false);
    }
  }

  function handleCancelEdit() {
    // Reset form to original student values
    setForm({
      name_en: s.name_en,
      name_ar: s.name_ar,
      gender: s.gender.toLowerCase(),
      date_of_birth: s.date_of_birth,
      status: s.status.toLowerCase(),
      enrollment_date: s.enrollment_date,
      grade_id: s.grade_id,
      classroom_id: s.classroom_id,
      transport_zone_id: s.transport_zone_id || "",
      parent_name_en: s.parent_name_en,
      parent_name_ar: s.parent_name_ar,
      parent_phone: s.parent_phone || "",
      parent_email: s.parent_email || "",
      parent_relationship: s.parent_relationship.toLowerCase(),
    });
    setPendingPhoto(null);
    setPendingPhotoPreview(null);
    setRemovePhoto(false);
    setEditing(false);
  }

  async function handleShareLocation() {
    try {
      await navigator.clipboard.writeText(homeMapsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(homeMapsUrl, "_blank");
    }
  }

  /* ── EDIT MODE ──────────────────────────────────────────────── */

  if (editing) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="glass relative mx-4 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-5 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-warm-800">
              {labels.edit} — {name}
            </h2>
            <button
              onClick={handleCancelEdit}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/50 text-[13px] text-warm-500 transition-colors hover:bg-white/80 hover:text-warm-800"
            >
              ✕
            </button>
          </div>

          {/* Photo editor */}
          <div className="mb-4 flex items-center gap-3">
            {/* Current / pending photo preview */}
            {pendingPhotoPreview ? (
              <img
                src={pendingPhotoPreview}
                alt=""
                className="h-16 w-16 flex-shrink-0 rounded-full object-cover border-2 border-orange-300"
              />
            ) : !removePhoto && photoUrl ? (
              <img
                src={photoUrl}
                alt=""
                className="h-16 w-16 flex-shrink-0 rounded-full object-cover border-2 border-white/50"
              />
            ) : (
              <div
                className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${
                  isMale ? "bg-sky-400" : "bg-pink-400"
                }`}
              >
                {initials}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-orange-400/15 px-3 py-1 text-[10px] font-semibold text-orange-600 transition-colors hover:bg-orange-400/25"
              >
                {labels.changePhoto}
              </button>
              {(photoUrl || pendingPhotoPreview) && !removePhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="rounded-lg bg-red-500/10 px-3 py-1 text-[10px] font-semibold text-red-500 transition-colors hover:bg-red-500/20"
                >
                  {labels.removePhoto}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {/* Personal Info */}
            <EditSection title={labels.personalInfo}>
              <EditField
                label={labels.fullNameEn}
                value={form.name_en}
                onChange={(v) => handleFormChange("name_en", v)}
                dir="ltr"
              />
              <EditField
                label={labels.fullNameAr}
                value={form.name_ar}
                onChange={(v) => handleFormChange("name_ar", v)}
                dir="rtl"
              />
              <EditSelect
                label={labels.gender}
                value={form.gender}
                onChange={(v) => handleFormChange("gender", v)}
                options={[
                  { value: "male", label: labels.male },
                  { value: "female", label: labels.female },
                ]}
              />
              <EditField
                label={labels.dateOfBirth}
                value={form.date_of_birth}
                onChange={(v) => handleFormChange("date_of_birth", v)}
                type="date"
              />
              <EditSelect
                label={labels.status}
                value={form.status}
                onChange={(v) => handleFormChange("status", v)}
                options={[
                  { value: "active", label: labels.active },
                  { value: "inactive", label: labels.inactive },
                ]}
              />
              <EditField
                label={labels.enrollmentDate}
                value={form.enrollment_date}
                onChange={(v) => handleFormChange("enrollment_date", v)}
                type="date"
              />
            </EditSection>

            {/* Academic Info */}
            <EditSection title={labels.academicInfo}>
              <EditSelect
                label={labels.grade}
                value={form.grade_id}
                onChange={(v) => handleFormChange("grade_id", v)}
                options={grades.map((g) => ({
                  value: g.id,
                  label: isAr ? g.name_ar : g.name_en,
                }))}
                placeholder={labels.selectGrade}
              />
              <EditSelect
                label={labels.classroom}
                value={form.classroom_id}
                onChange={(v) => handleFormChange("classroom_id", v)}
                options={filteredClassrooms.map((c) => ({
                  value: c.id,
                  label: `${isAr ? c.name_ar : c.name_en} — ${c.section}`,
                }))}
                placeholder={labels.selectClassroom}
              />
            </EditSection>

            {/* Parent Info */}
            <EditSection title={labels.parentInfo}>
              <EditField
                label={labels.parentNameEn}
                value={form.parent_name_en}
                onChange={(v) => handleFormChange("parent_name_en", v)}
                dir="ltr"
              />
              <EditField
                label={labels.parentNameAr}
                value={form.parent_name_ar}
                onChange={(v) => handleFormChange("parent_name_ar", v)}
                dir="rtl"
              />
              <EditSelect
                label={labels.relationship}
                value={form.parent_relationship}
                onChange={(v) => handleFormChange("parent_relationship", v)}
                options={[
                  { value: "father", label: labels.father },
                  { value: "mother", label: labels.mother },
                  { value: "guardian", label: labels.guardian },
                ]}
              />
              <EditField
                label={labels.phone}
                value={form.parent_phone}
                onChange={(v) => handleFormChange("parent_phone", v)}
                dir="ltr"
              />
              <EditField
                label={labels.email}
                value={form.parent_email}
                onChange={(v) => handleFormChange("parent_email", v)}
                dir="ltr"
                type="email"
              />
            </EditSection>

            {/* Transport */}
            <EditSection title={labels.transportInfo}>
              <EditSelect
                label={labels.transportZone}
                value={form.transport_zone_id}
                onChange={(v) => handleFormChange("transport_zone_id", v)}
                options={[
                  { value: "", label: labels.none },
                  ...transportZones.map((z) => ({
                    value: z.id,
                    label: isAr ? z.name_ar : z.name_en,
                  })),
                ]}
              />
            </EditSection>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              onClick={handleCancelEdit}
              className="rounded-xl border border-white/60 bg-white/50 px-4 py-1.5 text-[11px] font-semibold text-warm-600 transition-all hover:bg-white/70"
            >
              {labels.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.classroom_id}
              className="rounded-xl bg-orange-400 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-orange-500 active:scale-95 disabled:opacity-50"
            >
              {saving ? labels.saving : labels.save}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── VIEW MODE ──────────────────────────────────────────────── */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="glass relative mx-4 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 end-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/50 text-[13px] text-warm-500 transition-colors hover:bg-white/80 hover:text-warm-800"
        >
          ✕
        </button>

        {/* Header: Avatar + Name + Status */}
        <div className="mb-4 flex items-center gap-3">
          {/* Avatar — photo or initials */}
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="h-14 w-14 flex-shrink-0 rounded-full object-cover border-2 border-white/50"
            />
          ) : (
            <div
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${
                isMale ? "bg-sky-400" : "bg-pink-400"
              }`}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-warm-800 leading-tight">
              {name}
            </h2>
            <p className="text-[10px] text-warm-500/70">
              {grade} — {labels.section} {s.classroom_section}
            </p>
            <span
              className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                s.status.toLowerCase() === "active"
                  ? "bg-orange-400/15 text-orange-600"
                  : "bg-warm-500/10 text-warm-500"
              }`}
            >
              {s.status.toLowerCase() === "active"
                ? labels.active
                : labels.inactive}
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="space-y-3">
          {/* Personal Info */}
          <Section title={labels.personalInfo}>
            <Row label={labels.fullName} value={name} />
            <Row
              label={labels.gender}
              value={
                <span className="flex items-center gap-1">
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      isMale ? "bg-sky-400" : "bg-pink-400"
                    }`}
                  />
                  {isMale ? labels.male : labels.female}
                </span>
              }
            />
            <Row
              label={labels.dateOfBirth}
              value={formatDate(s.date_of_birth, lang)}
            />
            <Row
              label={labels.age}
              value={`${calcAge(s.date_of_birth)} ${labels.years}`}
            />
            <Row
              label={labels.enrollmentDate}
              value={formatDate(s.enrollment_date, lang)}
            />
          </Section>

          {/* Academic Info */}
          <Section title={labels.academicInfo}>
            <Row label={labels.grade} value={grade} />
            <Row label={labels.classroom} value={classroom} />
            <Row label={labels.section} value={s.classroom_section} />
          </Section>

          {/* Parent Info */}
          <Section title={labels.parentInfo}>
            <Row label={labels.parentName} value={parentName} />
            <Row
              label={labels.relationship}
              value={
                relationshipMap[s.parent_relationship.toLowerCase()] ||
                s.parent_relationship
              }
            />
            <Row
              label={labels.phone}
              value={s.parent_phone || "—"}
              dir="ltr"
            />
            <Row
              label={labels.email}
              value={s.parent_email || "—"}
              dir="ltr"
            />
          </Section>

          {/* Transport */}
          <Section title={labels.transportInfo}>
            <Row
              label={labels.transportZone}
              value={zone || labels.noTransport}
            />
          </Section>

          {/* Home Location — always shown */}
          <Section title={labels.homeLocation}>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <a
                  href={homeMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-orange-400 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-orange-500 active:scale-95"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {labels.viewOnMap}
                </a>
                <button
                  onClick={handleShareLocation}
                  className="flex items-center gap-1.5 rounded-lg border border-white/60 bg-white/50 px-3 py-1.5 text-[11px] font-semibold text-warm-600 transition-all hover:bg-white/70 active:scale-95"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  {copied ? labels.locationCopied : labels.shareLocation}
                </button>
              </div>
            </div>
          </Section>
        </div>

        {/* Edit button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setEditing(true)}
            className="rounded-xl bg-orange-400 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-orange-500 active:scale-95"
          >
            {labels.edit}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── View Mode sub-components ─────────────────────────────────── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-1 text-[10px] font-bold uppercase tracking-wide text-orange-500">
        {title}
      </h3>
      <div className="rounded-xl bg-white/40 px-3 py-1.5 space-y-0.5">
        {children}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  dir,
}: {
  label: string;
  value: React.ReactNode;
  dir?: string;
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-[10px] font-medium text-warm-500/70">{label}</span>
      <span className="text-[11px] font-medium text-warm-700" dir={dir}>
        {value}
      </span>
    </div>
  );
}

/* ── Edit Mode sub-components ─────────────────────────────────── */

function EditSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-1 text-[10px] font-bold uppercase tracking-wide text-orange-500">
        {title}
      </h3>
      <div className="rounded-xl bg-white/40 px-3 py-2 space-y-2">
        {children}
      </div>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  dir,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-0.5 block text-[10px] font-medium text-warm-500/70">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className="w-full rounded-lg border border-white/60 bg-white/50 px-2.5 py-1 text-[11px] text-warm-700 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300/40"
      />
    </div>
  );
}

function EditSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-0.5 block text-[10px] font-medium text-warm-500/70">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/60 bg-white/50 px-2.5 py-1 text-[11px] text-warm-700 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300/40"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
