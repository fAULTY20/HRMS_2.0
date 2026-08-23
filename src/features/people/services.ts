import { createClient } from "@/lib/supabase/server";
import type { EmployeeFilters } from "./types";

export async function listOrganizations() { const supabase = await createClient(); const result = await supabase.from("organizations").select("*").order("name"); return { ...result, data: result.data ?? [] }; }
export async function listDepartments() { const supabase = await createClient(); const result = await supabase.from("departments").select("*, organization:organizations(name)").order("name"); return { ...result, data: result.data ?? [] }; }
export async function listDesignations() { const supabase = await createClient(); const result = await supabase.from("designations").select("*, organization:organizations(name)").order("name"); return { ...result, data: result.data ?? [] }; }
export async function listManagers() { const supabase = await createClient(); const result = await supabase.from("employees").select("id, first_name, last_name, employee_code, status").eq("status", "ACTIVE").order("first_name"); return { ...result, data: result.data ?? [] }; }
export async function getEmployee(id: string) {
  const supabase = await createClient();
  // First fetch the employee with manager_id
  const result = await supabase
    .from("employees")
    .select("*, department:departments(name), designation:designations(name), manager_id")
    .eq("id", id)
    .maybeSingle();
  
  if (!result.data) return result;
  
  // Then fetch the manager details if manager_id exists
  let manager = null;
  if (result.data.manager_id) {
    const { data: managerData } = await supabase
      .from("employees")
      .select("first_name, last_name")
      .eq("id", result.data.manager_id)
      .maybeSingle();
    manager = managerData;
  }
  
  return { ...result, data: { ...result.data, manager } };
}
export async function listEmployees(filters: EmployeeFilters = {}) {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 10;
  const from = (page - 1) * pageSize;

  // First, fetch employees with their manager_id (but not the incorrect self-join)
  let query = supabase
    .from("employees")
    .select(
      "id, employee_code, first_name, last_name, email, date_of_joining, employment_type, status, department:departments(name), designation:designations(name), manager_id",
      { count: "exact" }
    )
    .order("first_name")
    .range(from, from + pageSize - 1);

  if (filters.search) query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,employee_code.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  if (filters.departmentId) query = query.eq("department_id", filters.departmentId);
  if (filters.designationId) query = query.eq("designation_id", filters.designationId);
  if (filters.employmentType) query = query.eq("employment_type", filters.employmentType);
  if (filters.status) query = query.eq("status", filters.status);

  const result = await query;
  const employees = result.data ?? [];

  // Fetch manager details for all manager_ids in the current page
  const managerIds = [...new Set(employees.map((e) => e.manager_id).filter(Boolean))];
  let managerMap = new Map<string, { first_name: string; last_name: string }>();

  if (managerIds.length > 0) {
    const { data: managers } = await supabase
      .from("employees")
      .select("id, first_name, last_name")
      .in("id", managerIds);
    
    if (managers) {
      for (const m of managers) {
        managerMap.set(m.id, { first_name: m.first_name, last_name: m.last_name });
      }
    }
  }

  // Merge manager data into employees
  const data = employees.map((employee) => ({
    ...employee,
    manager: employee.manager_id ? managerMap.get(employee.manager_id) ?? null : null,
  }));

  return { ...result, data };
}
