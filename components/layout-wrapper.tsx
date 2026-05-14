"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <SiteHeader />}
      <main>{children}</main>
      {!isAdmin && <SiteFooter />}
    </>
  );
}
