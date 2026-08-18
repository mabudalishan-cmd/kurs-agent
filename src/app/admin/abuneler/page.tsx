import { createServerSupabaseClient } from "@/lib/supabase";
import { Users, Inbox } from "lucide-react";
import ExportButton from "./ExportButton";

export const dynamic = "force-dynamic";

type Subscriber = {
  id: string;
  email: string;
  created_at: string;
};

export default async function AdminAbunelerPage() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin subscribers fetch error:", error.message);
  }

  const subscribers: Subscriber[] = data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-[var(--accent)]">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Abunələr</h1>
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              {subscribers.length} abunə mövcuddur
            </p>
          </div>
        </div>
        {subscribers.length > 0 && <ExportButton subscribers={subscribers} />}
      </div>

      {subscribers.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--card)] py-16 text-center">
          <Inbox size={48} className="text-[var(--muted)]" />
          <p className="mt-4 text-sm text-[var(--muted)]">
            Hələ abunə yoxdur. Footer-dəki formdan abunə olan email-lər burada
            görünəcək.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)] text-left text-[var(--muted)]">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Tarix</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-[var(--card-border)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{sub.email}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Date(sub.created_at).toLocaleString("az-AZ", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}