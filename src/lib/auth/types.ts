import type { User } from "@supabase/supabase-js";

export const ROLES = ["HR_ADMIN", "MANAGER", "EMPLOYEE"] as const;
export type Role = (typeof ROLES)[number];

export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  role: Role;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type AuthUser = User & { profile?: Profile | null };