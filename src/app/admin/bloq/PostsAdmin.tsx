"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/admin/ImageUpload";

type Post = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  image_url: string | null;
};

type PostInput = {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  image_url: string | null;
};

const emptyForm: PostInput = {
  title: "",
  content: "",
  excerpt: "",
  author: "Redaksiya",
  category: "Umumi",
  image_url: null,
};

export default function PostsAdmin({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PostInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (initialPosts.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosts(initialPosts);
    }
  }, [initialPosts]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
  }

  function openEdit(post: Post) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      category: post.category,
      image_url: post.image_url,
    });
    setError(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.content.trim() || !form.excerpt.trim()) {
      setError("Title, content ve excerpt bos ola bilmez.");
      return;
    }

    setLoading(true);

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      excerpt: form.excerpt.trim(),
      author: form.author.trim() || "Redaksiya",
      category: form.category.trim() || "Umumi",
      image_url: form.image_url?.trim() || null,
    };

    if (editingId) {
      const { error: updateError } = await supabase.from("posts").update(payload).eq("id", editingId);
      if (updateError) { setError(updateError.message); setLoading(false); return; }
    } else {
      const newId = form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const { error: insertError } = await supabase.from("posts").insert({ ...payload, id: newId || `post-${Date.now()}` });
      if (insertError) { setError(insertError.message); setLoading(false); return; }
    }

    setShowForm(false);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    const { error: deleteError } = await supabase.from("posts").delete().eq("id", deleteId);
    if (deleteError) { setError(deleteError.message); setLoading(false); setDeleteId(null); return; }
    setDeleteId(null);
    setLoading(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bloq</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{posts.length} meqale movcuddur</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25">
          <Plus size={16} />
          Yeni Yazi
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
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Emeliyyat</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-[var(--muted)]">{'Hele meqale yoxdur. "Yeni Yazi" duymesini basin.'}</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-[var(--card-border)] last:border-0">
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3">{post.author}</td>
                  <td className="px-4 py-3">{post.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(post)} className="rounded-lg border border-[var(--card-border)] p-2 text-[var(--muted)] transition-colors hover:text-[var(--accent)]" title="Redakte et"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteId(post.id)} className="rounded-lg border border-[var(--card-border)] p-2 text-[var(--muted)] transition-colors hover:text-red-500" title="Sil"><Trash2 size={14} /></button>
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
              <h2 className="text-lg font-bold">{editingId ? "Yazini Redakte Et" : "Yeni Yazi Elave Et"}</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-[var(--muted)] hover:text-[var(--foreground)]"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required rows={2} className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium">Content</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={6} className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Author</label>
                  <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500" />
                </div>
              </div>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                label="Şəkil (opsiyonel)"
              />
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
            <h2 className="text-lg font-bold">Yazini sil?</h2>
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