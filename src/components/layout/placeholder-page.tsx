import { Construction } from "lucide-react";

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return <section className="mx-auto flex min-h-[calc(100vh-150px)] max-w-5xl flex-col items-center justify-center text-center"><div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e2f3f1] text-[var(--teal)]"><Construction size={25} /></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--teal)]">Phase 1 foundation</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--navy)]">{title}</h1><p className="mt-3 max-w-md text-sm leading-6 text-slate-500">{description}</p></section>;
}