import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Mail,
  Users,
  UserCog,
  BarChart3,
  MailOpen,
  HelpCircle,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminProfile from "./AdminProfile";

export const dynamic = "force-dynamic";

// Admin paneli axtarış nəticələrində görünməməlidir
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/kurslar", label: "Kurslar", icon: GraduationCap },
  { href: "/admin/bloq", label: "Bloq", icon: BookOpen },
  { href: "/admin/mesajlar", label: "Mesajlar", icon: Mail },
  { href: "/admin/abuneler", label: "Abunələr", icon: Users },
  { href: "/admin/hesablar", label: "Komanda", icon: UserCog },
  { href: "/admin/suallar", label: "FAQ", icon: HelpCircle },
  { href: "/admin/analitika", label: "Analitika", icon: BarChart3 },
  { href: "/admin/email-kampaniyalari", label: "Email Kampaniyaları", icon: MailOpen },
  { href: "/admin/telebeler", label: "Tələbələr", icon: GraduationCap },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email ?? null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--card-border)] bg-[var(--card)] p-4 md:flex">
          <div className="mb-8 px-2">
            <h1 className="text-lg font-bold">
              <span className="gradient-text">HelloWorld</span>
            </h1>
            <p className="text-xs text-[var(--muted)]">Admin Panel</p>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--section)] hover:text-[var(--foreground)]"
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[var(--card-border)] pt-4">
            <AdminProfile email={email} />
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[var(--card-border)] bg-[var(--card)] px-4 py-3 md:hidden">
            <span className="text-sm font-bold">
              <span className="gradient-text">Admin</span>
            </span>
            <div className="w-auto">
              <AdminProfile email={email} />
            </div>
          </header>

          {/* Mobile nav */}
          <nav className="flex gap-1 overflow-x-auto border-b border-[var(--card-border)] bg-[var(--card)] px-2 py-2 md:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-[var(--section)] hover:text-[var(--foreground)]"
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}