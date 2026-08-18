"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Mail,
  Globe,
  Upload,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export type TeamMember = {
  id: string;
  photo_url: string | null;
  role: string;
  first_name: string;
  last_name: string;
  first_name_en: string | null;
  last_name_en: string | null;
  bio_en: string | null;
  first_name_ru: string | null;
  last_name_ru: string | null;
  bio_ru: string | null;
  bio: string | null;
  email: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  display_order: number;
};

type TeamMemberInput = {
  photo_url: string | null;
  role: string;
  first_name: string;
  last_name: string;
  first_name_en: string;
  last_name_en: string;
  bio_en: string;
  first_name_ru: string;
  last_name_ru: string;
  bio_ru: string;
  bio: string;
  email: string;
  linkedin_url: string;
  facebook_url: string;
  instagram_url: string;
  display_order: number;
};

const emptyForm: TeamMemberInput = {
  photo_url: null,
  role: "",
  first_name: "",
  last_name: "",
  first_name_en: "",
  last_name_en: "",
  bio_en: "",
  first_name_ru: "",
  last_name_ru: "",
  bio_ru: "",
  bio: "",
  email: "",
  linkedin_url: "",
  facebook_url: "",
  instagram_url: "",
  display_order: 0,
};

export default function TeamAdmin({
  initialMembers,
}: {
  initialMembers: TeamMember[];
}) {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TeamMemberInput>(emptyForm);
  const [formTab, setFormTab] = useState<"az" | "en" | "ru">("az");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (initialMembers.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMembers(initialMembers);
    }
  }, [initialMembers]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setFormTab("az");
    setError(null);
    setShowForm(true);
  }

  function openEdit(member: TeamMember) {
    setEditingId(member.id);
    setForm({
      photo_url: member.photo_url,
      role: member.role,
      first_name: member.first_name,
      last_name: member.last_name,
      first_name_en: member.first_name_en || "",
      last_name_en: member.last_name_en || "",
      bio_en: member.bio_en || "",
      first_name_ru: member.first_name_ru || "",
      last_name_ru: member.last_name_ru || "",
      bio_ru: member.bio_ru || "",
      bio: member.bio || "",
      email: member.email || "",
      linkedin_url: member.linkedin_url || "",
      facebook_url: member.facebook_url || "",
      instagram_url: member.instagram_url || "",
      display_order: member.display_order,
    });
    setFormTab("az");
    setError(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.first_name.trim() || !form.last_name.trim() || !form.role.trim()) {
      setError("Ad, Soyad ve Veziyyet bos ola bilmez.");
      return;
    }

    setLoading(true);

    const payload = {
      photo_url: form.photo_url?.trim() || null,
      role: form.role.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      first_name_en: form.first_name_en.trim() || null,
      last_name_en: form.last_name_en.trim() || null,
      bio_en: form.bio_en.trim() || null,
      first_name_ru: form.first_name_ru.trim() || null,
      last_name_ru: form.last_name_ru.trim() || null,
      bio_ru: form.bio_ru.trim() || null,
      bio: form.bio.trim() || null,
      email: form.email.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
      facebook_url: form.facebook_url.trim() || null,
      instagram_url: form.instagram_url.trim() || null,
      display_order: form.display_order,
    };

    if (editingId) {
      const { error: updateError } = await supabase
        .from("team_members")
        .update(payload)
        .eq("id", editingId);
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("team_members")
        .insert(payload);
      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    setShowForm(false);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    const { error: deleteError } = await supabase
      .from("team_members")
      .delete()
      .eq("id", deleteId);
    if (deleteError) {
      setError(deleteError.message);
      setLoading(false);
      setDeleteId(null);
      return;
    }
    setDeleteId(null);
    setLoading(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Komanda</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {members.length} komanda uzvu movcuddur
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
        >
          <Plus size={16} />
          Yeni Uzv
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* List view */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-12 text-center text-[var(--muted)]">
            {'Hele komanda uzvu yoxdur. "Yeni Uzv" duymesini basin.'}
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4"
            >
              {/* Photo thumbnail */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--card-border)] bg-[var(--background)]">
                {member.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo_url}
                    alt={member.first_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-[var(--muted)]">
                    {member.first_name.charAt(0)}
                    {member.last_name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="truncate font-semibold">
                  {member.first_name} {member.last_name}
                </h3>
                <p className="truncate text-sm text-[var(--muted)]">
                  {member.role}
                </p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => openEdit(member)}
                  className="rounded-lg border border-[var(--card-border)] p-2 text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                  title="Redakte et"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(member.id)}
                  className="rounded-lg border border-[var(--card-border)] p-2 text-[var(--muted)] transition-colors hover:text-red-500"
                  title="Sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editingId ? "Uzvu Redakte Et" : "Yeni Uzv Elave Et"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Multilingual tabs */}
            <div className="mt-4 flex gap-2 border-b border-[var(--card-border)] pb-3">
              <button
                type="button"
                onClick={() => setFormTab("az")}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                  formTab === "az"
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Azərbaycanca
              </button>
              <button
                type="button"
                onClick={() => setFormTab("en")}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                  formTab === "en"
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setFormTab("ru")}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                  formTab === "ru"
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Русский
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Photo URL (styled as upload box) */}
              <div>
                <label className="block text-sm font-medium">
                  Şəkil URL (opsiyonel)
                </label>
                <div className="mt-1 flex items-center gap-3 rounded-lg border border-dashed border-[var(--card-border)] bg-[var(--background)] p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-[var(--accent)]">
                    <Upload size={20} />
                  </div>
                  <input
                    type="url"
                    value={form.photo_url ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, photo_url: e.target.value || null })
                    }
                    placeholder="Şəkil linkini buraya yapışdırın..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium">
                  Vəzifə <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                  placeholder="CEO & Founder"
                  className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                />
              </div>

              {/* Display order */}
              <div>
                <label className="block text-sm font-medium">
                  Sıra nömrəsi
                </label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({ ...form, display_order: parseInt(e.target.value) || 0 })
                  }
                  className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                />
              </div>

              {/* Multilingual content */}
              {formTab === "az" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Ad <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.first_name}
                        onChange={(e) =>
                          setForm({ ...form, first_name: e.target.value })
                        }
                        required
                        className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Soyad <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.last_name}
                        onChange={(e) =>
                          setForm({ ...form, last_name: e.target.value })
                        }
                        required
                        className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) =>
                        setForm({ ...form, bio: e.target.value })
                      }
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                </>
              ) : formTab === "en" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">
                        First Name (EN)
                      </label>
                      <input
                        type="text"
                        value={form.first_name_en}
                        onChange={(e) =>
                          setForm({ ...form, first_name_en: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Last Name (EN)
                      </label>
                      <input
                        type="text"
                        value={form.last_name_en}
                        onChange={(e) =>
                          setForm({ ...form, last_name_en: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Bio (EN)</label>
                    <textarea
                      value={form.bio_en}
                      onChange={(e) =>
                        setForm({ ...form, bio_en: e.target.value })
                      }
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Имя (RU)
                      </label>
                      <input
                        type="text"
                        value={form.first_name_ru}
                        onChange={(e) =>
                          setForm({ ...form, first_name_ru: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Фамилия (RU)
                      </label>
                      <input
                        type="text"
                        value={form.last_name_ru}
                        onChange={(e) =>
                          setForm({ ...form, last_name_ru: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Bio (RU)</label>
                    <textarea
                      value={form.bio_ru}
                      onChange={(e) =>
                        setForm({ ...form, bio_ru: e.target.value })
                      }
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                </>
              )}

              {/* Social links */}
              <div className="border-t border-[var(--card-border)] pt-4">
                <h3 className="mb-3 text-sm font-semibold">Sosial linklər</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="shrink-0 text-[var(--muted)]" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="email@example.com"
                      className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe
                      size={16}
                      className="shrink-0 text-[var(--muted)]"
                    />
                    <input
                      type="url"
                      value={form.linkedin_url}
                      onChange={(e) =>
                        setForm({ ...form, linkedin_url: e.target.value })
                      }
                      placeholder="https://linkedin.com/in/..."
                      className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe
                      size={16}
                      className="shrink-0 text-[var(--muted)]"
                    />
                    <input
                      type="url"
                      value={form.facebook_url}
                      onChange={(e) =>
                        setForm({ ...form, facebook_url: e.target.value })
                      }
                      placeholder="https://facebook.com/..."
                      className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe
                      size={16}
                      className="shrink-0 text-[var(--muted)]"
                    />
                    <input
                      type="url"
                      value={form.instagram_url}
                      onChange={(e) =>
                        setForm({ ...form, instagram_url: e.target.value })
                      }
                      placeholder="https://instagram.com/..."
                      className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-60"
                >
                  {loading ? "Saxlanılır..." : "Saxla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 text-center shadow-2xl">
            <h2 className="text-lg font-bold">Uzvu sil?</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Bu emeliyyat geri alina bilmez.
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