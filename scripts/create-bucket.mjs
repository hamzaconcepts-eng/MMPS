import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://caqayyrfobyaljovdwrg.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcWF5eXJmb2J5YWxqb3Zkd3JnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkyMTgxMiwiZXhwIjoyMDg2NDk3ODEyfQ.oJkReQ9S7y4Mb3GGYC-J98VdDDuf1QOzkKR_R-uAQQU";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Create the student-photos bucket (public so images can be displayed)
const { data, error } = await supabase.storage.createBucket("student-photos", {
  public: true,
  fileSizeLimit: 5 * 1024 * 1024, // 5MB max
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
});

if (error) {
  if (error.message.includes("already exists")) {
    console.log("Bucket 'student-photos' already exists — OK");
  } else {
    console.error("Error creating bucket:", error.message);
  }
} else {
  console.log("Created bucket:", data);
}
