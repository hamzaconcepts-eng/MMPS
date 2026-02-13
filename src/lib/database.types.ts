export interface Grade {
  id: string;
  name_en: string;
  name_ar: string;
  level: number;
  min_age_months: number;
  total_fee: number;
  books_fee: number;
  school_fee: number;
  services_fee: number;
  registration_fee: number;
  created_at: string;
}

export interface Teacher {
  id: string;
  name_en: string;
  name_ar: string;
  phone: string | null;
  email: string | null;
  subject: string;
  status: string;
  created_at: string;
}

export interface Classroom {
  id: string;
  grade_id: string;
  section: string;
  name_en: string;
  name_ar: string;
  teacher_id: string | null;
  created_at: string;
}

export interface TransportZone {
  id: string;
  name_en: string;
  name_ar: string;
  annual_fee: number;
  created_at: string;
}

export interface Bus {
  id: string;
  bus_number: string;
  plate_number: string;
  driver_name_en: string;
  driver_name_ar: string;
  driver_phone: string | null;
  capacity: number;
  transport_zone_id: string;
  created_at: string;
}

export interface Parent {
  id: string;
  name_en: string;
  name_ar: string;
  phone: string | null;
  email: string | null;
  relationship: string;
  created_at: string;
}

export interface Student {
  id: string;
  name_en: string;
  name_ar: string;
  gender: string;
  date_of_birth: string;
  classroom_id: string;
  parent_id: string;
  transport_zone_id: string | null;
  enrollment_date: string;
  status: string;
  created_at: string;
}

export interface FeePayment {
  id: string;
  student_id: string;
  amount: number;
  payment_type: string;
  payment_date: string | null;
  status: string;
  academic_year: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name_en: string;
  name_ar: string;
  frequency: string;
  created_at: string;
}

export interface GradeSubject {
  id: string;
  grade_id: string;
  subject_id: string;
  created_at: string;
}

export interface Facility {
  id: string;
  name_en: string;
  name_ar: string;
  capacity_classes: number;
  created_at: string;
}
