import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "La Cà Truyện — Khám phá thế giới truyện",
    template: "%s | La Cà Truyện",
  },
  description: "Khám phá truyện hư cấu trong catalog thử nghiệm La Cà Truyện.",
  icons: { icon: "/mark.svg" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-[#f7f5ef] font-sans text-stone-950">
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-stone-950 focus:shadow-lg"
          href="#main-content"
        >
          Bỏ qua đến nội dung chính
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
