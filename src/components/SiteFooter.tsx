"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

/**
 * Saytın alt hissəsini (Footer) idarə edir.
 * Admin bölməsində (/admin/*) Footer göstərilmir.
 * layout.tsx-də main-dən SONRA render olunur ki, Footer həmişə
 * səhifənin ən aşağısında olsun.
 */
export default function SiteFooter() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  return <Footer />;
}