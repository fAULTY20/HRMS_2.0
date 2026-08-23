"use client";

import { isSupabaseConfigured } from "@/lib/auth/config";
import { getAuthErrorMessage } from "@/lib/auth/messages";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResolving, setIsResolving] = useState(isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/");
    }).catch(() => undefined).finally(() => setIsResolving(false));
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) { setError("Enter your email and password to continue."); return; }
    setIsLoading(true);
    try {
      const { error: signInError } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) { setError(getAuthErrorMessage(signInError)); setIsLoading(false); return; }
    } catch (signInError) { setError(getAuthErrorMessage(signInError)); setIsLoading(false); return; }
    router.replace("/");
    router.refresh();
  }

  if (isResolving) return <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] text-sm font-semibold text-[var(--navy)]">Checking your session...</main>;
  return <main className="flex min-h-screen bg-[#f6f8fb]"><section className="hidden w-[42%] flex-col justify-between bg-[var(--navy)] p-12 text-white lg:flex"><div><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#76d1c9] text-sm font-extrabold text-[var(--navy)]">O</div><span className="text-lg font-bold">OmniRoute</span></div><div className="mt-28 max-w-sm"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#76d1c9]">People operations</p><h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">A clearer way to care for your people.</h1><p className="mt-5 text-sm leading-7 text-white/60">One secure workspace for the teams and decisions that move your organization forward.</p></div></div><div className="flex items-center gap-2 text-xs text-white/45"><ShieldCheck size={16} /> Enterprise workspace access</div></section><section className="flex flex-1 items-center justify-center px-5 py-10"><div className="w-full max-w-[420px]"><div className="mb-10 lg:hidden"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--navy)] text-sm font-extrabold text-white">O</div><span className="text-lg font-bold text-[var(--navy)]">OmniRoute</span></div></div><p className="text-sm font-semibold text-[var(--teal)]">Welcome back</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--navy)]">Sign in to your workspace</h2><p className="mt-3 text-sm leading-6 text-slate-500">Use your company credentials to continue.</p><form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Work email</span><div className="relative"><Mail size={17} className="absolute left-3 top-3.5 text-slate-400" /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="h-11 w-full rounded-md border bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[var(--teal)] focus:ring-2 focus:ring-[#bfe8e6]" /></div></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Password</span><div className="relative"><LockKeyhole size={17} className="absolute left-3 top-3.5 text-slate-400" /><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="h-11 w-full rounded-md border bg-white pl-10 pr-11 text-sm outline-none transition focus:border-[var(--teal)] focus:ring-2 focus:ring-[#bfe8e6]" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-2 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>{error && <p role="alert" className="rounded-md border border-[#f0c9c0] bg-[#fff4f1] px-3 py-2.5 text-sm text-[#a34836]">{error}</p>}<button type="submit" disabled={isLoading} className="flex h-11 w-full items-center justify-center rounded-md bg-[var(--navy)] text-sm font-bold text-white transition hover:bg-[#1b4566] disabled:cursor-wait disabled:opacity-60">{isLoading ? "Signing in..." : "Sign in"}</button></form><p className="mt-8 text-center text-xs text-slate-400">Contact your HR administrator if you need access.</p></div></section></main>;
}