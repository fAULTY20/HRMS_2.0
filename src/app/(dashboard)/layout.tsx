import { AppShell } from "@/components/layout/app-shell";
import type { Profile } from "@/lib/auth/types";
import { createClient, getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = await getUser();
  if (!user) redirect("/login");
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("id, full_name, email, role, avatar_url, created_at, updated_at").eq("id", user.id).maybeSingle<Profile>();
  if (!profile) redirect("/unauthorized");
  return <AppShell profile={profile}>{children}</AppShell>;
}