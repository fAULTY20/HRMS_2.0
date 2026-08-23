import type { AuthUser, Role } from "@/lib/auth/types";

export type Permission = "dashboard:view" | "team:view" | "own:view" | "announcements:view" | "admin:manage";

const rolePermissions: Record<Role, readonly Permission[]> = {
  HR_ADMIN: ["dashboard:view", "team:view", "own:view", "announcements:view", "admin:manage"],
  MANAGER: ["dashboard:view", "team:view", "own:view", "announcements:view"],
  EMPLOYEE: ["dashboard:view", "own:view", "announcements:view"],
};

export function hasRole(user: AuthUser | null | undefined, role: Role) {
  return user?.profile?.role === role;
}

export function hasAnyRole(user: AuthUser | null | undefined, roles: readonly Role[]) {
  return Boolean(user?.profile?.role && roles.includes(user.profile.role));
}

export function canAccess(user: AuthUser | null | undefined, permission: Permission) {
  return Boolean(user?.profile?.role && rolePermissions[user.profile.role].includes(permission));
}

export function canAccessPath(user: AuthUser, pathname: string) {
  if (hasRole(user, "HR_ADMIN")) return true;
  if (pathname === "/people/employees/new") return false;
  if (pathname.startsWith("/people/employees")) return canAccess(user, "own:view") || canAccess(user, "team:view");
  if (pathname.startsWith("/people/organizations") || pathname.startsWith("/people/departments") || pathname.startsWith("/people/designations")) return false;
  if (pathname === "/dashboard") return canAccess(user, "dashboard:view");
  if (pathname === "/announcements") return canAccess(user, "announcements:view");
  if (["/employees", "/attendance", "/leave", "/documents"].includes(pathname)) return canAccess(user, "own:view") || canAccess(user, "team:view");
  return canAccess(user, "team:view") && ["/departments", "/holidays", "/assets", "/analytics", "/reports"].includes(pathname);
}

export function canAccessPathForRole(role: Role, pathname: string) {
  return canAccessPath({ profile: { role } } as AuthUser, pathname);
}