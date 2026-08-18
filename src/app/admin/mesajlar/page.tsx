import { createServerSupabaseClient } from "@/lib/supabase";
import { Mail, Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default async function AdminMesajlarPage() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("messages")
    .select("id, name, email, message, is_read, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin messages fetch error:", error.message);
  }

  const messages: Message[] = data ?? [];

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-[var(--accent)]">
          <Mail size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Mesajlar</h1>
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            {messages.length} mesaj mövcuddur
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--card)] py-16 text-center">
          <Inbox size={48} className="text-[var(--muted)]" />
          <p className="mt-4 text-sm text-[var(--muted)]">
            Hələ mesaj yoxdur. Əlaqə formasından gələn mesajlar burada görünəcək.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-2xl border bg-[var(--card)] p-5 transition-colors ${
                msg.is_read
                  ? "border-[var(--card-border)]"
                  : "border-violet-500/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{msg.name}</h3>
                    {!msg.is_read && (
                      <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                        YENİ
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="mt-0.5 block text-xs text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {msg.email}
                  </a>
                </div>
                <span className="shrink-0 text-xs text-[var(--muted)]">
                  {new Date(msg.created_at).toLocaleString("az-AZ", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-[var(--foreground)]">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}