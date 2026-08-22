"use client";

import { cn } from "@/lib/utils";
import {
    BarChart3, Bell, BriefcaseBusiness, CalendarDays, ChevronDown, ClipboardCheck,
    FileBarChart, FileText, LayoutDashboard,
    Megaphone,
    Menu,
    Package,
    Settings, ShieldCheck, Users, X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/employees", icon: Users },
  { label: "Departments", href: "/departments", icon: BriefcaseBusiness },
  { label: "Attendance", href: "/attendance", icon: ClipboardCheck },
  { label: "Leave", href: "/leave", icon: CalendarDays },
  { label: "Holidays", href: "/holidays", icon: CalendarDays },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Assets", href: "/assets", icon: Package },
  { label: "Announcements", href: "/announcements", icon: Megaphone },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Reports", href: "/reports", icon: FileBarChart },
];

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[264px] shrink-0 flex-col bg-[var(--navy)] text-white">
      <div className="flex h-[76px] items-center border-b border-white/10 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#76d1c9] text-sm font-extrabold text-[var(--navy)]">O</div>
        <div className="ml-3"><p className="text-[15px] font-bold tracking-tight">OmniRoute</p><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">People operations</p></div>
        <button onClick={onNavigate} className="ml-auto rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close navigation"><X size={19} /></button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Workspace</p>
        {navigation.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return <Link key={href} href={href} onClick={onNavigate} className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white", active && "bg-[#1b5365] text-white shadow-sm")}><Icon size={18} strokeWidth={active ? 2.3 : 1.8} /><span>{label}</span></Link>;
        })}
        <p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Administration</p>
        <Link href="/settings" onClick={onNavigate} className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white", pathname === "/settings" && "bg-[#1b5365] text-white")}><Settings size={18} /><span>Settings</span></Link>
        <Link href="/audit" onClick={onNavigate} className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white", pathname === "/audit" && "bg-[#1b5365] text-white")}><ShieldCheck size={18} /><span>Audit logs</span></Link>
      </nav>
      <div className="border-t border-white/10 p-4"><div className="rounded-md border border-white/10 bg-white/5 p-3"><div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-[#76d1c9]" /><span className="text-xs font-semibold">Workspace status</span></div><p className="mt-1 text-[11px] text-white/50">Foundation mode</p></div></div>
    </aside>
  );
}

function Header({ onMenu }: { onMenu: () => void }) {
  return <header className="flex h-[76px] items-center justify-between border-b bg-white px-4 sm:px-8"><div className="flex items-center gap-3"><button onClick={onMenu} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu size={21} /></button><div><p className="text-xs font-medium text-slate-400">Monday, August 24, 2026</p><h1 className="text-base font-bold text-[var(--navy)] sm:text-lg">Good morning, HR team</h1></div></div><div className="flex items-center gap-2 sm:gap-4"><button className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Bell size={19} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#d66b54]" /></button><div className="hidden h-7 w-px bg-slate-200 sm:block" /><button className="flex items-center gap-2 rounded-md p-1.5 hover:bg-slate-50"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d8ece9] text-xs font-bold text-[#087f8c]">HR</span><span className="hidden text-left sm:block"><span className="block text-xs font-bold text-slate-700">HR Admin</span><span className="block text-[10px] text-slate-400">Administrator</span></span><ChevronDown size={15} className="hidden text-slate-400 sm:block" /></button></div></header>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="flex min-h-screen bg-[var(--background)]"><div className="hidden lg:block"><Sidebar onNavigate={() => setMobileOpen(false)} /></div>{mobileOpen && <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setMobileOpen(false)}><div className="h-full" onClick={(event) => event.stopPropagation()}><Sidebar onNavigate={() => setMobileOpen(false)} /></div></div>}<div className="flex min-w-0 flex-1 flex-col"><Header onMenu={() => setMobileOpen(true)} /><main className="flex-1 p-4 sm:p-7 lg:p-9">{children}</main></div></div>;
}