"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Eye, Users, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

type RangeOption = "7d" | "30d" | "90d" | "custom";

type DailyStat = {
  date: string;
  views: number;
  visitors: number;
};

type TopPage = {
  page_path: string;
  views: number;
  visitors: number;
};

export default function AnalyticsAdmin() {
  const [range, setRange] = useState<RangeOption>("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);

  const getDateRange = useCallback(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    let start = new Date();
    start.setHours(0, 0, 0, 0);

    if (range === "7d") start.setDate(start.getDate() - 6);
    else if (range === "30d") start.setDate(start.getDate() - 29);
    else if (range === "90d") start.setDate(start.getDate() - 89);
    else if (range === "custom") {
      if (customStart) start = new Date(customStart);
      if (customEnd) end.setTime(new Date(customEnd).getTime());
    }

    return { start: start.toISOString(), end: end.toISOString() };
  }, [range, customStart, customEnd]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { start, end } = getDateRange();

    try {
      const { data, error } = await supabase
        .from("page_views")
        .select("page_path, visitor_id, created_at")
        .gte("created_at", start)
        .lte("created_at", end)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const dailyMap: Record<string, { views: number; visitors: Set<string> }> = {};
      const pageMap: Record<string, { views: number; visitors: Set<string> }> = {};

      (data || []).forEach((row) => {
        const date = row.created_at.split("T")[0];
        if (!dailyMap[date]) dailyMap[date] = { views: 0, visitors: new Set() };
        dailyMap[date].views++;
        dailyMap[date].visitors.add(row.visitor_id);

        if (!pageMap[row.page_path]) pageMap[row.page_path] = { views: 0, visitors: new Set() };
        pageMap[row.page_path].views++;
        pageMap[row.page_path].visitors.add(row.visitor_id);
      });

      const stats: DailyStat[] = [];
      const startDate = new Date(start);
      const endDate = new Date(end);
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        stats.push({
          date: dateStr,
          views: dailyMap[dateStr]?.views || 0,
          visitors: dailyMap[dateStr]?.visitors.size || 0,
        });
      }
      setDailyStats(stats);
      setTotalViews(stats.reduce((sum, s) => sum + s.views, 0));
      setTotalVisitors(new Set((data || []).map((r) => r.visitor_id)).size);

      const pages: TopPage[] = Object.entries(pageMap)
        .map(([path, val]) => ({
          page_path: path,
          views: val.views,
          visitors: val.visitors.size,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);
      setTopPages(pages);
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [getDateRange]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const rangeOptions: { value: RangeOption; label: string }[] = [
    { value: "7d", label: "Son 7 gün" },
    { value: "30d", label: "Son 30 gün" },
    { value: "90d", label: "Son 90 gün" },
    { value: "custom", label: "Tarix seç" },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analitika</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Səhifə baxışları və ziyarətçi statistikası
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Calendar size={16} className="text-[var(--muted)]" />
          {rangeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                range === opt.value
                  ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                  : "border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {range === "custom" && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] outline-none focus:border-violet-500"
            />
            <span className="text-[var(--muted)]">—</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] outline-none focus:border-violet-500"
            />
            <button
              onClick={fetchData}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              Tətbiq et
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Ümumi Baxışlar</p>
              <p className="text-2xl font-bold">
                {loading ? "..." : totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Unikal Ziyarətçilər</p>
              <p className="text-2xl font-bold">
                {loading ? "..." : totalVisitors.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-[var(--accent)]" />
          <h2 className="text-lg font-semibold">Günlük Statistika</h2>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center text-[var(--muted)]">
            Yüklənir...
          </div>
        ) : dailyStats.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-[var(--muted)]">
            Bu dövr üçün məlumat yoxdur
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis
                dataKey="date"
                stroke="var(--muted)"
                fontSize={12}
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
              />
              <YAxis stroke="var(--muted)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                labelFormatter={(val) => {
                  const d = new Date(String(val));
                  return d.toLocaleDateString("az-AZ");
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="views" name="Baxışlar" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="visitors" name="Ziyarətçilər" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
        <h2 className="mb-4 text-lg font-semibold">Top Səhifələr</h2>

        {loading ? (
          <div className="py-8 text-center text-[var(--muted)]">Yüklənir...</div>
        ) : topPages.length === 0 ? (
          <div className="py-8 text-center text-[var(--muted)]">
            Bu dövr üçün məlumat yoxdur
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)] text-left text-[var(--muted)]">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Səhifə</th>
                  <th className="px-4 py-3 text-right font-medium">Baxışlar</th>
                  <th className="px-4 py-3 text-right font-medium">Ziyarətçilər</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, i) => (
                  <tr key={page.page_path} className="border-b border-[var(--card-border)] last:border-0">
                    <td className="px-4 py-3 text-[var(--muted)]">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{page.page_path}</td>
                    <td className="px-4 py-3 text-right">{page.views}</td>
                    <td className="px-4 py-3 text-right">{page.visitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
