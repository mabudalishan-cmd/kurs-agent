import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  Mail,
  Users,
} from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createServerSupabaseClient();

  const [coursesResult, postsResult, messagesResult, subscribersResult] =
    await Promise.all([
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase.from("messages").select("id", { count: "exact", head: true }),
      supabase
        .from("subscribers")
        .select("id", { count: "exact", head: true }),
    ]);

  const courseCount = coursesResult.count ?? 0;
  const postCount = postsResult.count ?? 0;
  const messageCount = messagesResult.count ?? 0;
  const subscriberCount = subscribersResult.count ?? 0;

  const stats = [
    {
      label: "Kurslar",
      value: courseCount,
      href: "/admin/kurslar",
      icon: GraduationCap,
    },
    {
      label: "Bloq Yazıları",
      value: postCount,
      href: "/admin/bloq",
      icon: BookOpen,
    },
    {
      label: "Mesajlar",
      value: messageCount,
      href: "/admin/mesajlar",
      icon: Mail,
    },
    {
      label: "Abunələr",
      value: subscriberCount,
      href: "/admin/abuneler",
      icon: Users,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Ümumi statistika və idarəetmə
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 transition-all hover:border-violet-500/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-[var(--accent)]">
                  <Icon size={24} />
                </div>
                <ArrowRight
                  size={18}
                  className="text-[var(--muted)] transition-transform group-hover:translate-x-1"
                />
              </div>
              <p className="mt-4 text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-[var(--muted)]">{stat.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}