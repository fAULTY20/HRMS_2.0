import { createClient } from "@/lib/supabase/server";
import type { EmployeeFilters } from "./types";

export async function listOrganizations() { const supabase = await createClient(); const result = await supabase.from("organizations").select("*").order("name"); return { ...result, data: result.data ?? [] }; }
export async function listDepartments() { const supabase = await createClient(); const result = await supabase.from("departments").select("*, organization:organizations(name)").order("name"); return { ...result, data: result.data ?? [] }; }
export async function listDesignations() { const supabase = await createClient(); const result = await supabase.from("designations").select("*, organization:organizations(name)").order("name"); return { ...result, data: result.data ?? [] }; }
export async function listManagers() { const supabase = await createClient(); const result = await supabase.from("employees").select("id, first_name, last_name, employee_code, status").eq("status", "ACTIVE").order("first_name"); return { ...result, data: result.data ?? [] }; }
export async function getEmployee(id: string) { const supabase = await createClient(); return supabase.from("employees").select("*, department:departments(name), designation:designations(name), manager:employees!manager_id(first_name,last_name)").eq("id", id).maybeSingle(); }
export async function listEmployees(filters: EmployeeFilters = {}) {
  const supabase = await createClient(); const page = Math.max(1, filters.page ?? 1); const pageSize = filters.pageSize ?? 10; const from = (page - 1) * pageSize;
  let query = supabase.from("employees").select("id, employee_code, first_name, last_name, email, date_of_joining, employment_type, status, department:departments(name), designation:designations(name), manager:employees!manager_id(first_name,last_name)", { count: "exact" }).order("first_name").range(from, from + pageSize - 1);
  if (filters.search) query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,employee_code.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  if (filters.departmentId) query = query.eq("department_id", filters.departmentId); if (filters.designationId) query = query.eq("designation_id", filters.designationId); if (filters.employmentType) query = query.eq("employment_type", filters.employmentType); if (filters.status) query = query.eq("status", filters.status);
  const result = await query; return { ...result, data: result.data ?? [] };
}