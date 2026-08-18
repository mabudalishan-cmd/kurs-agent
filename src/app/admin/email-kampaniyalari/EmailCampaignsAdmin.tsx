"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Mail, Send, Trash2, X, MailOpen, AlertCircle, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/admin/ImageUpload";

type CampaignStatus = "draft" | "sending" | "sent" | "failed";

type Campaign = {
  id: string;
  subject: string;
  content: string;
  status: CampaignStatus;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
  sent_at: string | null;
  image_url: string | null;
};

type CampaignInput = {
  subject: string;
  content: string;
  image_url: string | null;
};

type StatusFilter = "all" | CampaignStatus;

const emptyForm: CampaignInput = {
  subject: "",
  content: "",
  image_url: null,
};

const statusLabels: Record<CampaignStatus, string> = {
  draft: "Qaralama",
  sending: "Göndərilir",
  sent: "Göndərilib",
  failed: "Uğursuz",
};

const statusColors: Record<CampaignStatus, string> = {
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  sending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  sent: "bg-green-500/10 text-green-400 border-green-500/30",
  failed: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function EmailCampaignsAdmin() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CampaignInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sendId, setSendId] = useState<string | null>(null);
  const [sendInfo, setSendInfo] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    recipients: 0,
    failed: 0,
  });

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("email_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        // Check if table doesn't exist
        const errMsg = fetchError.message || '';
        if (errMsg.includes('relation') && errMsg.includes('does not exist')) {
          throw new Error('Cədvəl hələ yaradılmayıb. src/lib/sql/11_email_campaigns.sql faylını Supabase SQL Editor-də icra edin.');
        }
        throw fetchError;
      }

      const list = (data || []) as Campaign[];
      setCampaigns(list);

      // Calculate stats
      setStats({
        total: list.length,
        sent: list.filter((c) => c.status === "sent").length,
        recipients: list
          .filter((c) => c.status === "sent")
          .reduce((sum, c) => sum + c.recipient_count, 0),
        failed: list.filter((c) => c.status === "failed").length,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Xəta baş verdi";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCampaigns();
  }, [fetchCampaigns]);

  function openAdd() {
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.subject.trim() || !form.content.trim()) {
      setError("Mövzu və məzmun boş ola bilməz.");
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("email_campaigns")
        .insert({
          subject: form.subject.trim(),
          content: form.content.trim(),
          image_url: form.image_url,
          status: "draft",
        });

      if (insertError) {
        const errMsg = insertError.message || '';
        if (errMsg.includes('relation') && errMsg.includes('does not exist')) {
          throw new Error('Cədvəl hələ yaradılmayıb. src/lib/sql/11_email_campaigns.sql faylını Supabase SQL Editor-də icra edin.');
        }
        throw insertError;
      }

      setShowForm(false);
      fetchCampaigns();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Xəta baş verdi";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!sendId) return;
    setLoading(true);
    setSendInfo(null);

    try {
      const res = await fetch("/api/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: sendId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error ?? "Göndərmə xətası");
      }

      setSendInfo(
        `Kampaniya göndərildi: ${data.sentCount}/${data.recipientCount} abunəçi.` +
          (data.failedCount > 0 ? ` ${data.failedCount} uğursuz.` : "")
      );
      setSendId(null);
      fetchCampaigns();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Göndərmə xətası";
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
        .from("email_campaigns")
        .delete()
        .eq("id", deleteId);
      if (deleteError) throw deleteError;
      setDeleteId(null);
      fetchCampaigns();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Silmə xətası";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const filteredCampaigns = statusFilter === "all"
    ? campaigns
    : campaigns.filter((c) => c.status === statusFilter);

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Bütün statuslar" },
    { value: "draft", label: "Qaralama" },
    { value: "sending", label: "Göndərilir" },
    { value: "sent", label: "Göndərilib" },
    { value: "failed", label: "Uğursuz" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email Kampaniyaları</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {campaigns.length} kampaniya mövcuddur
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
        >
          <Plus size={16} />
          Yeni Kampaniya
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </div>
      )}

      {sendInfo && (
        <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
          {sendInfo}
        </div>
      )}

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-[var(--accent)]" />
            <div>
              <p className="text-xs text-[var(--muted)]">Ümumi</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-2">
            <MailOpen size={18} className="text-green-400" />
            <div>
              <p className="text-xs text-[var(--muted)]">Göndərilib</p>
              <p className="text-xl font-bold">{stats.sent}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-400" />
            <div>
              <p className="text-xs text-[var(--muted)]">Alıcılar</p>
              <p className="text-xl font-bold">{stats.recipients}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-red-400" />
            <div>
              <p className="text-xs text-[var(--muted)]">Uğursuz</p>
              <p className="text-xl font-bold">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mt-6 flex items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-violet-500"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Campaigns Table */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] text-left text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Mövzu</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Alıcılar</th>
              <th className="px-4 py-3 font-medium">Tarix</th>
              <th className="px-4 py-3 text-right font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)]">
                  Yüklənir...
                </td>
              </tr>
            ) : filteredCampaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)]">{"Kampaniya yoxdur. \"Yeni Kampaniya\" düyməsini basın."}</td>
              </tr>
            ) : (
              filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-[var(--card-border)] last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {campaign.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={campaign.image_url}
                          alt={campaign.subject}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                      ) : null}
                      <span className="font-medium">{campaign.subject}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[campaign.status]}`}
                    >
                      {statusLabels[campaign.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">{campaign.recipient_count}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Date(campaign.created_at).toLocaleDateString("az-AZ")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {campaign.status === "draft" && (
                        <button
                          onClick={() => setSendId(campaign.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700"
                          title="Göndər"
                        >
                          <Send size={12} />
                          Göndər
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteId(campaign.id)}
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

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Yeni Kampaniya</h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Mövzu</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                  placeholder="Email mövzusu"
                />
              </div>
              <div>
                <ImageUpload
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  label="Şəkil"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Məzmun</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                  rows={8}
                  className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                  placeholder="Email mətni..."
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

      {/* Send Confirmation Modal */}
      {sendId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                <Send size={20} />
              </div>
              <h2 className="text-lg font-bold">Kampaniyanı göndər?</h2>
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Bu kampaniya bütün abunəçilərə real e-poçt kimi göndəriləcək. Bu
              əməliyyat geri alına bilməz.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSendId(null)}
                className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                İmtina
              </button>
              <button
                onClick={handleSend}
                disabled={loading}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "Göndərilir..." : "Göndər"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 text-center shadow-2xl">
            <h2 className="text-lg font-bold">Kampaniyanı sil?</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Bu əməliyyat geri alına bilməz.</p>
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
