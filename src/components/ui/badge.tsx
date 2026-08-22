import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full bg-[#e2f3f1] px-2.5 py-1 text-xs font-semibold text-[#07656d]", className)} {...props} />;
}