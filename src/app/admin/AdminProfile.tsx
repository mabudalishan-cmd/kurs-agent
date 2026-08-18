"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminProfile({ email }: { email: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const displayName = email ? email.split("@")[0] : "Admin";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--section)] hover:text-[var(--foreground)]"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-xs font-bold text-white">
          {initials}
        </div>
        <div className="flex-1 truncate text-left">
          <p className="truncate text-xs font-semibold text-[var(--foreground)]">
            {displayName}
          </p>
          <p className="truncate text-[10px] text-[var(--muted)]">
            {email ?? "—"}
          </p>
        </div>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--card)] shadow-lg">
          <div className="border-b border-[var(--card-border)] px-3 py-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)]">
              <User size={12} />
              Profil
            </p>
            <p className="mt-0.5 truncate text-[10px] text-[var(--muted)]">
              {email ?? "—"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-60"
          >
            <LogOut size={12} />
            {loading ? "Çıxılır..." : "Çıxış"}
          </button>
        </div>
      )}
    </div>
  );
}