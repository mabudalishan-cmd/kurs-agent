"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Database } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isMissingTableError } from "@/lib/supabase-errors";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  question_ru: string | null;
  answer_ru: string | null;
  display_order: number;
  is_active: boolean;
};

type FaqInput = {
  question: string;
  answer: string;
  question_ru: string;
  answer_ru: string;
  display_order: number;
  is_active: boolean;
};

const emptyForm: FaqInput = {
  question: "",
  answer: "",
  question_ru: "",
  answer_ru: "",
  display_order: 0,
  is_active: true,
};

const MISSING_TABLE_HINT =
  "faq_items cədvəli hələ yaradılmayıb. src/lib/sql/09_faq_items.sql faylını Supabase SQL Editor-də icra edin.";

function describeError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err ?? "");
  if (isMissingTableError({ message })) {
    return MISSING_TABLE_HINT;
  }
  return message || "Xəta baş verdi";
}

export default function FaqAdmin({
  initialItems,
  setupRequired = false,
}: {
  initialItems: FaqItem[];
  setupRequired?: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState<FaqItem[]>(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FaqInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(initialItems);
  }, [initialItems]);

  function openAdd() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      display_order:
        items.length > 0
          ? Math.max(...items.map((i) => i.display_order)) + 1
          : 1,
    });
    setError(null);
    setShowForm(true);
  }

  function openEdit(item: FaqItem) {
    setEditingId(item.id);
    setForm({
      question: item.question,
      answer: item.answer,
      question_ru: item.question_ru ?? "",
      answer_ru: item.answer_ru ?? "",
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setError(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.question.trim() || !form.answer.trim()) {
      setError("Sual və cavab boş ola bilməz.");
      return;
    }

    setLoading(true);

    // Boş tərcümə sahələri NULL kimi yazılır ki, ehtiyat dil məntiqi işləsin.
    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      question_ru: form.question_ru.trim() || null,
      answer_ru: form.answer_ru.trim() || null,
      display_order: form.display_order,
      is_active: form.is_active,
    };

    try {
      const { error: writeError } = editingId
        ? await supabase.from("faq_items").update(payload).eq("id", editingId)
        : await supabase.from("faq_items").insert(payload);

      if (writeError) throw writeError;

      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(item: FaqItem) {
    try {
      const { error: updateError } = await supabase
        .from("faq_items")
        .update({ is_active: !item.is_active })
        .eq("id", item.id);
      if (updateError) throw updateError;
      router.refresh();
    } catch (err) {
      setError(describeError(err));
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from("faq_items")
        .delete()
        .eq("id", deleteId);
      if (deleteError) throw deleteError;
      setDeleteId(null);
      router.refresh();
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tez-tez verilən suallar</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {items.length} sual mövcuddur
          </p>
        </div>
        <button
          onClick={openAdd}
          disabled={setupRequired}
          title={setupRequired ? MISSING_TABLE_HINT : undefined}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          <Plus size={16} />
          Yeni Sual
        </button>
      </div>

      {/* Cədvəl hələ yaradılmayıb — nə etmək lazım olduğunu izah edirik */}
      {setupRequired && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0 text-amber-500">
              <Database size={18} />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-amber-500">
                Baza cədvəli hələ yaradılmayıb
              </p>
              <p className="mt-1 text-[var(--muted)]">
                FAQ-ı buradan idarə etmək üçün{" "}
                <code className="rounded bg-[var(--section)] px-1.5 py-0.5 text-xs">
                  src/lib/sql/09_faq_items.sql
                </code>{" "}
                faylını Supabase Dashboard → SQL Editor-də icra edin. Fayl
                cədvəli, RLS siyasətlərini və başlanğıc sualları yaradır.
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                O vaxta qədər sayt FAQ bölməsində koddaki ehtiyat siyahını
                göstərir — ziyarətçilər üçün heç nə sınmır.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] text-left text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Sıra</th>
              <th className="px-4 py-3 font-medium">Sual</th>
              <th className="px-4 py-3 font-medium">Tərcümə</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-[var(--muted)]"
                >
                  {setupRequired
                    ? "Cədvəl yaradıldıqdan sonra suallar burada görünəcək."
                    : "Sual yoxdur. \"Yeni Sual\" düyməsini basın."}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--card-border)] last:border-0"
                >
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {item.display_order}
                  </td>
                  <td className="max-w-md px-4 py-3">
                    <p className="font-medium">{item.question}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-[var(--muted)]">
                      {item.answer}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs ${
                          item.question_ru
                            ? "bg-green-500/10 text-green-400"
                            : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        RU
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(item)}
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${
                        item.is_active
                          ? "border-green-500/30 bg-green-500/10 text-green-400"
                          : "border-gray-500/30 bg-gray-500/10 text-gray-400"
                      }`}
                      title={item.is_active ? "Gizlət" : "Göstər"}
                    >
                      {item.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                      {item.is_active ? "Aktiv" : "Gizli"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded-lg border border-[var(--card-border)] p-2 text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                        title="Redaktə et"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="rounded-lg border border-[var(--card-border)] p-2 text-[var(--muted)] transition-colors hover:text-red-500"
                        title="Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editingId ? "Sualı redaktə et" : "Yeni Sual"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Sual (Azərbaycan)
                </label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) =>
                    setForm({ ...form, question: e.target.value })
                  }
                  required
                  className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                  placeholder="Kurslar necə keçirilir?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Cavab (Azərbaycan)
                </label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  required
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                  placeholder="Cavab mətni..."
                />
              </div>

              <div className="rounded-lg border border-[var(--card-border)] p-3">
                <p className="text-xs font-medium text-[var(--muted)]">
                  Rus dili tərcüməsi (istəyə bağlı — boş qalarsa Azərbaycan
                  mətni göstərilir)
                </p>

                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-xs font-medium">
                      Sual (Русский)
                    </label>
                    <input
                      type="text"
                      value={form.question_ru}
                      onChange={(e) =>
                        setForm({ ...form, question_ru: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">
                      Cavab (Русский)
                    </label>
                    <textarea
                      value={form.answer_ru}
                      onChange={(e) =>
                        setForm({ ...form, answer_ru: e.target.value })
                      }
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium">Sıra</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        display_order: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                  />
                </div>
                <label className="flex flex-1 items-end gap-2 pb-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-[var(--card-border)]"
                  />
                  Saytda göstər
                </label>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 text-center shadow-2xl">
            <h2 className="text-lg font-bold">Sualı sil?</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Bu əməliyyat geri alına bilməz.
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
