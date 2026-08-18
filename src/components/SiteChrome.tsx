"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import WhatsAppButton from "./WhatsAppButton";

/**
 * Saytın üst hissəsini (Header + WhatsApp) idarə edir.
 * Admin bölməsində (/admin/*) bu komponentlər göstərilmir.
 * Footer ayrıca SiteFooter komponentində main-dən sonra render olunur.
 */
export default function SiteChrome() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  return (
    <>
      <Header />
      <WhatsAppButton />
    </>
  );
}