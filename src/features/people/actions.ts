"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { EmployeeFormData } from "./schemas";
import { departmentSchema, employeeSchema, organizationSchema } from "./schemas";

type Result = { success: true } | { success: false; error: string };

async function requireHrAdmin(): Promise<{ supabase: Awaited<ReturnType<typeof createClient>> } | Result> {
  const { user } = await getUser();
  if (!user) return { success: false, error: "Your session has expired. Please sign in again." };
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "HR_ADMIN") return { success: false, error: "You do not have permission to manage People records." };
  return { supabase };
}

function databaseMessage(error: { code?: string; message?: string }) {
  if (error.code === "23505") return "A record with that code or email already exists.";
  if (error.code === "23503") return "This record is linked to another People record and cannot be changed.";
  return "We could not save this record. Please check the details and try again.";
}

export async function saveOrganization(input: unknown, id?: string): Promise<Result> {
  const parsed = organizationSchema.safeParse(input); if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Check the form details." };
  const auth = await requireHrAdmin(); if ("success" in auth) return auth; const { supabase } = auth;
  const payload = { ...parsed.data, description: parsed.data.description || null };
  const result = id ? await supabase.from("organizations").update(payload).eq("id", id) : await supabase.from("organizations").insert(payload);
  if (result.error) return { success: false, error: databaseMessage(result.error) }; revalidatePath("/people/organizations"); return { success: true };
}

export async function saveDepartment(input: unknown, id?: string): Promise<Result> {
  const parsed = departmentSchema.safeParse(input); if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Check the form details." };
  const auth = await requireHrAdmin(); if ("success" in auth) return auth; const { supabase } = auth;
  const payload = { ...parsed.data, description: parsed.data.description || null }; const result = id ? await supabase.from("departments").update(payload).eq("id", id) : await supabase.from("departments").insert(payload);
  if (result.error) return { success: false, error: databaseMessage(result.error) }; revalidatePath("/people/departments"); return { success: true };
}

export async function saveDesignation(input: unknown, id?: string): Promise<Result> {
  const parsed = departmentSchema.safeParse(input); if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Check the form details." };
  const auth = await requireHrAdmin(); if ("success" in auth) return auth; const { supabase } = auth;
  const payload = { ...parsed.data, description: parsed.data.description || null }; const result = id ? await supabase.from("designations").update(payload).eq("id", id) : await supabase.from("designations").insert(payload);
  if (result.error) return { success: false, error: databaseMessage(result.error) }; revalidatePath("/people/designations"); return { success: true };
}

export async function saveEmployee(input: EmployeeFormData, id?: string): Promise<Result> {
  const parsed = employeeSchema.safeParse(input); if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Check the form details." };
  const auth = await requireHrAdmin(); if ("success" in auth) return auth; const { supabase } = auth;
  if (parsed.data.manager_id === id) return { success: false, error: "An employee cannot be their own manager." };
  const payload = { ...parsed.data, phone: parsed.data.phone || null, date_of_birth: parsed.data.date_of_birth || null, gender: parsed.data.gender || null, manager_id: parsed.data.manager_id || null };
  const result = id ? await supabase.from("employees").update(payload).eq("id", id) : await supabase.from("employees").insert(payload);
  if (result.error) return { success: false, error: databaseMessage(result.error) }; revalidatePath("/people/employees"); if (id) revalidatePath(`/people/employees/${id}`); return { success: true };
}