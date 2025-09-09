import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://yxggnszmbwehhtxadbkp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z2duc3ptYndlaGh0eGFkYmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI3ODkyMzcsImV4cCI6MjAzODM2NTIzN30.pnmd4Iu214MvCn07a5VsowPl5mLoy0qqqSCNW8F4Qyo";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

/// db secret life5202%%XeLaMi...
