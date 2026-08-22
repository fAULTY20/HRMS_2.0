import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--navy)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1b4566] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)] disabled:pointer-events-none disabled:opacity-50", className)} {...props} />;
}