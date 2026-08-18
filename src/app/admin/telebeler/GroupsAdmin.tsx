"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, X, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Group = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  student_count?: number;
};

const emptyForm = { name: "", description: "" };

export default function GroupsAdmin() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("groups")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Groups fetch error:", fetchError);
        const errMsg = fetchError.message || "";
        // If table doesn't exist, show empty state with helpful info
        if (errMsg.includes("relation") && errMsg.includes("does not exist")) {
          setGroups([]);
          setError("Cədvəl hələ yaradılmayıb. src/lib/sql/12_students_payments.sql faylını Supabase SQL Editor-də icra edin.");
          return;
        }
        throw fetchError;
      }

      const groupList = (data || []) as Group[];

      // Fetch student counts for each group
      const groupsWithCounts = await Promise.all(
        groupList.map(async (g) => {
          const { count, error: countError } = await supabase
            .from("students")
            .select("*", { count: "exact", head: true })
            .eq("group_id", g.id);
          if (countError) console.error("Student count error:", countError);
          return { ...g, student_count: count || 0 };
        })
      );

      setGroups(groupsWithCounts);
      setError(null);
    } catch (err) {
      console.error("Groups fetch error:", err);
      const message = err instanceof Error ? err.message : "Xəta baş verdi";
      setError(message);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGroups();
  }, [fetchGroups]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Qrup adı boş ola bilməz.");
      return;
    }

    setLoading(true);
    try {
      const { data: newGroup, error: insertError } = await supabase
        .from("groups")
        .insert({
          name: form.name.trim(),
          description: form.description.trim() || null,
        })
        .select()
        .single();

      if (insertError) {
        const errMsg = insertError.message || "";
        if (errMsg.includes("relation") && errMsg.includes("does not exist")) {
          throw new Error("Cədvəl hələ yaradılmayıb. src/lib/sql/12_students_payments.sql faylını Supabase SQL Editor-də icra edin.");
        }
        throw insertError;
      }

      // Add the new group to local state immediately
      if (newGroup) {
        setGroups(prev => [{ ...newGroup, student_count: 0 } as Group, ...prev]);
      }

      setShowForm(false);
      setForm(emptyForm);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Xəta baş verdi";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from("groups")
        .delete()
        .eq("id", deleteId);
      if (deleteError) throw deleteError;
      setDeleteId(null);
      fetchGroups();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Silmə xətası";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tələbə Qrupları</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {groups.length} qrup mövcuddur
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setError(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
        >
          <Plus size={16} />
          Yeni Qrup Əlavə Et
        </button>
      </div>

      {error && (
        <div className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
          error.includes("Cədvəl hələ yaradılmayıb")
            ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
            : "border-red-500/30 bg-red-500/10 text-red-500"
        }`}>
          {error}
        </div>
      )}

      {/* Groups Grid */}
      {loading ? (
        <div className="mt-6 flex h-40 items-center justify-center text-[var(--muted)]">
          Yüklənir...
        </div>
      ) : groups.length === 0 ? (
        <div className="mt-6 flex h-40 items-center justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--card)] text-[var(--muted)]">{"Qrup yoxdur. \"Yeni Qrup Əlavə Et\" düyməsini basın."}</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div
              key={group.id}
              className="group cursor-pointer rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 transition-all hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10"
              onClick={() => router.push(`/admin/telebeler/${group.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">{group.name}</h3>
                    <p className="text-xs text-[var(--muted)]">
                      {group.student_count || 0} tələbə
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteId(group.id); }}
                  className="rounded-lg p-1.5 text-[var(--muted)] opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
                  title="Sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {group.description && (
                <p className="mt-3 text-sm text-[var(--muted)] line-clamp-2">
                  {group.description}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-[var(--muted)]">
                  {new Date(group.created_at).toLocaleDateString("az-AZ")}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-violet-400 transition-transform group-hover:translate-x-1">
                  Daxil ol
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Group Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Yeni Qrup</h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Qrup Adı</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                  placeholder="məs: Oktyabr Qrupu 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Təsvir</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                  placeholder="Qrup haqqında qısa məlumat..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                >
                  İmtina
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-60"
                >
                  {loading ? "Saxlanılır..." : "Yadda saxla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 text-center shadow-2xl">
            <h2 className="text-lg font-bold">Qrupu sil?</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Bu əməliyyat geri alına bilməz. Qrupdakı tələbələr silinməyəcək, lakin qrup bağlantısı silinəcək.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                İmtina
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {loading ? "Silinir..." : "Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
