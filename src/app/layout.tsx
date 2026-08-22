import { Providers } from "@/lib/providers";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OmniRoute HRMS",
    template: "%s | OmniRoute HRMS",
  },
  description: "Enterprise human resources management for modern teams.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}><body className="min-h-full"><Providers>{children}</Providers></body></html>;
}
