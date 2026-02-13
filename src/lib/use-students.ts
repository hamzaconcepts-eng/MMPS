"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface StudentRow {
  id: string;
  name_en: string;
  name_ar: string;
  gender: string;
  date_of_birth: string;
  status: string;
  enrollment_date: string;
  classroom_id: string;
  classroom_name_en: string;
  classroom_name_ar: string;
  classroom_section: string;
  grade_id: string;
  grade_name_en: string;
  grade_name_ar: string;
  parent_id: string;
  parent_name_en: string;
  parent_name_ar: string;
  parent_phone: string | null;
  parent_email: string | null;
  parent_relationship: string;
  transport_zone_id: string | null;
  transport_zone_en: string | null;
  transport_zone_ar: string | null;
}

interface GradeOption {
  id: string;
  name_en: string;
  name_ar: string;
}

export interface ClassroomOption {
  id: string;
  section: string;
  name_en: string;
  name_ar: string;
  grade_id: string;
}

export interface TransportZoneOption {
  id: string;
  name_en: string;
  name_ar: string;
}

export type SortField = "name" | "class" | "gender" | "status";
export type SortDir = "asc" | "desc";

const PAGE_SIZE = 50;

export function useStudents(lang: "en" | "ar" = "en") {
  const [allStudents, setAllStudents] = useState<StudentRow[]>([]);
  const [grades, setGrades] = useState<GradeOption[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomOption[]>([]);
  const [transportZones, setTransportZones] = useState<TransportZoneOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      const { data: studentsData, error: studentsErr } = await supabase
        .from("students")
        .select(
          "id, name_en, name_ar, gender, date_of_birth, status, enrollment_date, classroom_id, parent_id, transport_zone_id, classrooms(section, name_en, name_ar, grade_id, grades(id, name_en, name_ar)), parents(name_en, name_ar, phone, email, relationship), transport_zones(name_en, name_ar)"
        )
        .order("name_en");

      if (studentsErr) {
        console.error("Error fetching students:", studentsErr.message);
        setLoading(false);
        return;
      }

      const { data: gradesData } = await supabase
        .from("grades")
        .select("id, name_en, name_ar")
        .order("level");

      const { data: classroomsData } = await supabase
        .from("classrooms")
        .select("id, section, name_en, name_ar, grade_id")
        .order("name_en");

      const { data: zonesData } = await supabase
        .from("transport_zones")
        .select("id, name_en, name_ar")
        .order("name_en");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows: StudentRow[] = (studentsData || []).map((s: any) => ({
        id: s.id,
        name_en: s.name_en,
        name_ar: s.name_ar,
        gender: s.gender,
        date_of_birth: s.date_of_birth,
        status: s.status,
        enrollment_date: s.enrollment_date,
        classroom_id: s.classroom_id || "",
        classroom_name_en: s.classrooms?.name_en || "",
        classroom_name_ar: s.classrooms?.name_ar || "",
        classroom_section: s.classrooms?.section || "",
        grade_id: s.classrooms?.grade_id || "",
        grade_name_en: s.classrooms?.grades?.name_en || "",
        grade_name_ar: s.classrooms?.grades?.name_ar || "",
        parent_id: s.parent_id || "",
        parent_name_en: s.parents?.name_en || "",
        parent_name_ar: s.parents?.name_ar || "",
        parent_phone: s.parents?.phone || null,
        parent_email: s.parents?.email || null,
        parent_relationship: s.parents?.relationship || "father",
        transport_zone_id: s.transport_zone_id || null,
        transport_zone_en: s.transport_zones?.name_en || null,
        transport_zone_ar: s.transport_zones?.name_ar || null,
      }));

      setAllStudents(rows);
      setGrades(gradesData || []);
      setClassrooms(classroomsData || []);
      setTransportZones(zonesData || []);
      setLoading(false);
    }

    fetchData();
  }, []);

  // Reset page when filters/search/sort change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, gradeFilter, statusFilter, sortField, sortDir]);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let list = allStudents;

    if (debouncedSearch) {
      const words = debouncedSearch.toLowerCase().split(/\s+/).filter(Boolean);
      list = list.filter((s) => {
        const enName = s.name_en.toLowerCase();
        const arName = s.name_ar;
        // Every search word must appear in either the EN or AR name
        return words.every(
          (w) => enName.includes(w) || arName.includes(w)
        );
      });
    }

    if (gradeFilter) {
      list = list.filter((s) => s.grade_id === gradeFilter);
    }

    if (statusFilter) {
      list = list.filter(
        (s) => s.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sort — use the active language for locale-aware comparison
    const locale = lang === "ar" ? "ar" : "en";
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") {
        const aName = lang === "ar" ? a.name_ar : a.name_en;
        const bName = lang === "ar" ? b.name_ar : b.name_en;
        cmp = aName.localeCompare(bName, locale);
      } else if (sortField === "class") {
        const aClass = lang === "ar" ? a.classroom_name_ar : a.classroom_name_en;
        const bClass = lang === "ar" ? b.classroom_name_ar : b.classroom_name_en;
        cmp = aClass.localeCompare(bClass, locale);
      } else if (sortField === "gender") {
        cmp = a.gender.localeCompare(b.gender, locale);
      } else if (sortField === "status") {
        cmp = a.status.localeCompare(b.status, locale);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [allStudents, debouncedSearch, gradeFilter, statusFilter, sortField, sortDir, lang]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const students = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Selection helpers
  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelected((prev) => {
      const pageIds = students.map((s) => s.id);
      const allSelected = pageIds.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [students]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const deleteSelected = useCallback(async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;

    const supabase = createClient();
    const { error } = await supabase.from("students").delete().in("id", ids);
    if (error) {
      console.error("Delete error:", error.message);
      return;
    }

    setAllStudents((prev) => prev.filter((s) => !selected.has(s.id)));
    setSelected(new Set());
  }, [selected]);

  // Update a student — saves to Supabase then refreshes local state
  const updateStudent = useCallback(
    async (
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
    ): Promise<boolean> => {
      const supabase = createClient();

      // Find the student to get parent_id
      const student = allStudents.find((s) => s.id === id);
      if (!student) return false;

      // Update student record
      const { error: studentErr } = await supabase
        .from("students")
        .update({
          name_en: updates.name_en,
          name_ar: updates.name_ar,
          gender: updates.gender,
          date_of_birth: updates.date_of_birth,
          status: updates.status,
          enrollment_date: updates.enrollment_date,
          classroom_id: updates.classroom_id,
          transport_zone_id: updates.transport_zone_id || null,
        })
        .eq("id", id);

      if (studentErr) {
        console.error("Student update error:", studentErr.message);
        return false;
      }

      // Update parent record
      const { error: parentErr } = await supabase
        .from("parents")
        .update({
          name_en: updates.parent_name_en,
          name_ar: updates.parent_name_ar,
          phone: updates.parent_phone || null,
          email: updates.parent_email || null,
          relationship: updates.parent_relationship,
        })
        .eq("id", student.parent_id);

      if (parentErr) {
        console.error("Parent update error:", parentErr.message);
        return false;
      }

      // Re-fetch single student to get joined data
      const { data: fresh } = await supabase
        .from("students")
        .select(
          "id, name_en, name_ar, gender, date_of_birth, status, enrollment_date, classroom_id, parent_id, transport_zone_id, classrooms(section, name_en, name_ar, grade_id, grades(id, name_en, name_ar)), parents(name_en, name_ar, phone, email, relationship), transport_zones(name_en, name_ar)"
        )
        .eq("id", id)
        .single();

      if (fresh) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const s = fresh as any;
        const updated: StudentRow = {
          id: s.id,
          name_en: s.name_en,
          name_ar: s.name_ar,
          gender: s.gender,
          date_of_birth: s.date_of_birth,
          status: s.status,
          enrollment_date: s.enrollment_date,
          classroom_id: s.classroom_id || "",
          classroom_name_en: s.classrooms?.name_en || "",
          classroom_name_ar: s.classrooms?.name_ar || "",
          classroom_section: s.classrooms?.section || "",
          grade_id: s.classrooms?.grade_id || "",
          grade_name_en: s.classrooms?.grades?.name_en || "",
          grade_name_ar: s.classrooms?.grades?.name_ar || "",
          parent_id: s.parent_id || "",
          parent_name_en: s.parents?.name_en || "",
          parent_name_ar: s.parents?.name_ar || "",
          parent_phone: s.parents?.phone || null,
          parent_email: s.parents?.email || null,
          parent_relationship: s.parents?.relationship || "father",
          transport_zone_id: s.transport_zone_id || null,
          transport_zone_en: s.transport_zones?.name_en || null,
          transport_zone_ar: s.transport_zones?.name_ar || null,
        };
        setAllStudents((prev) => prev.map((row) => (row.id === id ? updated : row)));
        return true;
      }

      return true;
    },
    [allStudents]
  );

  // Sort toggler
  const toggleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("asc");
      }
    },
    [sortField]
  );

  return {
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
    pageSize: PAGE_SIZE,
    selected,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    deleteSelected,
    updateStudent,
  };
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebounced(value), delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debounced;
}
