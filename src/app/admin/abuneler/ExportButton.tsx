"use client";

import { Download } from "lucide-react";

type Subscriber = {
  id: string;
  email: string;
  created_at: string;
};

export default function ExportButton({
  subscribers,
}: {
  subscribers: Subscriber[];
}) {
  function exportCSV() {
    const header = "Email,Tarix\n";
    const rows = subscribers
      .map(
        (s) =>
          `${s.email},${new Date(s.created_at).toLocaleString("az-AZ")}`
      )
      .join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "abuneler.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <button
      onClick={exportCSV}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
    >
      <Download size={16} />
      CSV ixrac
    </button>
  );
}