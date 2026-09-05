"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isMissingColumnError } from "@/lib/supabase-errors";

type Course = {
  id: string;
  title: string;
  description: string;
  price: number | string;
  duration: string;
  level: string;
  category: string;
  image_url: string | null;
  syllabus?: string | null;
  syllabus_ru?: string | null;
};

type CourseInput = {
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  category: string;
  image_url: string | null;
  syllabus: string;
  syllabus_ru: string;
};

const MISSING_SYLLABUS_HINT =
  "Sillabus sütunu hələ əlavə edilməyib. src/lib/sql/14_course_syllabus.sql faylını Supabase SQL Editor-də icra edin.";

/** Migrasiya işlədilməyibsə xam Postgres mesajı əvəzinə izah göstərir. */
function describeWriteError(err: { message?: string; code?: string }): string {
  if (isMissingColumnError(err)) return MISSING_SYLLABUS_HINT;
  return err.message ?? "Xəta baş verdi";
}

const emptyForm: CourseInput = {
  title: "",
  description: "",
  price: 0,
  duration: "",
  level: "Baslangic",
  category: "Frontend",
  image_url: null,
  syllabus: "",
  syllabus_ru: "",
};

export default function CoursesAdmin({ initialCourses }: { initialCourses: Course[] }) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (initialCourses.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCourses(initialCourses);
    }
  }, [initialCourses]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
  }

  function openEdit(course: Course) {
    setEditingId(course.id);
    setForm({
      title: course.title,
      description: course.description,
      syllabus: course.syllabus ?? "",
      syllabus_ru: course.syllabus_ru ?? "",
      price: Number(course.price),
      duration: course.duration,
      level: course.level,
      category: course.category,
      image_url: course.image_url,
    });
    setError(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.description.trim() || !form.duration.trim()) {
      setError("Title, description ve duration bos ola bilmez.");
      return;
    }

    if (form.price < 0) {
      setError("Qiymet menfi ola bilmez.");
      return;
    }

    setLoading(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: form.price,
      duration: form.duration.trim(),
      level: form.level,
      category: form.category,
      image_url: form.image_url?.trim() || null,
      // Boş qalarsa NULL yazılır ki, dil ehtiyat məntiqi işləsin
      syllabus: form.syllabus.trim() || null,
      syllabus_ru: form.syllabus_ru.trim() || null,
    };

    if (editingId) {
      const { error: updateError } = await supabase.from("courses").update(payload).eq("id", editingId);
      if (updateError) { setError(describeWriteError(updateError)); setLoading(false); return; }
    } else {
      const newId = form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const { error: insertError } = await supabase.from("courses").insert({ ...payload, id: newId || `course-${Date.now()}` });
      if (insertError) { setError(describeWriteError(insertError)); setLoading(false); return; }
    }

    setShowForm(false);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    const { error: deleteError } = await supabase.from("courses").delete().eq("id", deleteId);
    if (deleteError) { setError(deleteError.message); setLoading(false); setDeleteId(null); return; }
    setDeleteId(null);
    setLoading(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kurslar</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{courses.length} kurs movcuddur</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25">
          <Plus size={16} />
          Yeni Kurs
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] text-left text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 text-right font-medium">Emeliyyat</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)]">{'Hele kurs yoxdur. "Yeni Kurs" duymesini basin.'}</td></tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id} className="border-b border-[var(--card-border)] last:border-0">
                  <td className="px-4 py-3 font-medium">{course.title}</td>
                  <td className="px-4 py-3">{course.price} AZN</td>
                  <td className="px-4 py-3">{course.category}</td>
                  <td className="px-4 py-3">{course.level}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(course)} className="rounded-lg border border-[var(--card-border)] p-2 text-[var(--muted)] transition-colors hover:text-[var(--accent)]" title="Redakte et"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteId(course.id)} className="rounded-lg border border-[var(--card-border)] p-2 text-[var(--muted)] transition-colors hover:text-red-500" title="Sil"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingId ? "Kursu Redakte Et" : "Yeni Kurs Elave Et"}</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-[var(--muted)] hover:text-[var(--foreground)]"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Sillabus (hər sətir ayrı bənd)
                </label>
                <textarea
                  value={form.syllabus}
                  onChange={(e) => setForm({ ...form, syllabus: e.target.value })}
                  rows={6}
                  placeholder={"Hər sətir ayrı bənddir. Məsələn: Giriş və mühitin qurulması"}
                  className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                />
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Kursun detal səhifəsində siyahı kimi göstərilir.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Sillabus — Rus dili (istəyə bağlı)
                </label>
                <textarea
                  value={form.syllabus_ru}
                  onChange={(e) => setForm({ ...form, syllabus_ru: e.target.value })}
                  rows={6}
                  className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                />
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Boş qalarsa Azərbaycan mətni göstərilir.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Price (AZN)</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Duration</label>
                  <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required placeholder="mes: 8 hefte" className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Level</label>
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500">
                    <option>Baslangic</option>
                    <option>Orta</option>
                    <option>Qabaqcil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Image URL (opsiyonel)</label>
                <input type="url" value={form.image_url ?? ""} onChange={(e) => setForm({ ...form, image_url: e.target.value || null })} className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">Imtina</button>
                <button type="submit" disabled={loading} className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-60">{loading ? "Saxlanilir..." : editingId ? "Yenile" : "Elave et"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 text-center shadow-2xl">
            <h2 className="text-lg font-bold">Kursu sil?</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Bu emeliyyat geri alina bilmez.</p>
            <div className="mt-6 flex justify-center gap-2">
              <button onClick={() => setDeleteId(null)} className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">Imtina</button>
              <button onClick={handleDelete} disabled={loading} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60">{loading ? "Silinir..." : "Sil"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}