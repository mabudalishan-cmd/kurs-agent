import Link from "next/link";
import { LayoutDashboard, BookOpen, GraduationCap, LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/kurslar", label: "Kurslar", icon: GraduationCap },
  { href: "/admin/bloq", label: "Bloq", icon: BookOpen },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--card-border)] bg-[var(--card)] p-4 md:flex">
          <div className="mb-8 px-2">
            <h1 className="text-lg font-bold">
              <span className="gradient-text">Kurs Agent</span>
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
            <LogoutButton />
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[var(--card-border)] bg-[var(--card)] px-4 py-3 md:hidden">
            <span className="text-sm font-bold">
              <span className="gradient-text">Admin</span>
            </span>
            <LogoutButton />
          </header>

          {/* Mobile nav */}
          <nav className="flex gap-1 border-b border-[var(--card-border)] bg-[var(--card)] px-2 py-2 md:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-[var(--section)] hover:text-[var(--foreground)]"
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