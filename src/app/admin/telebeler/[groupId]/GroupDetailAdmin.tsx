"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, X, GraduationCap, Calendar, Check, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Student = {
  id: string;
  full_name: string;
  phone: string | null;
  group_id: string | null;
  status: string;
  created_at: string;
};

type Payment = {
  id: string;
  student_id: string;
  year: number;
  month: number;
  is_paid: boolean;
  paid_at: string | null;
};

type Group = {
  id: string;
  name: string;
  description: string | null;
};

const monthsAz = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
  "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
];

const emptyForm = { full_name: "", phone: "" };

export default function GroupDetailAdmin({ groupId }: { groupId: string }) {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Payment modal state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchGroup = useCallback(async () => {
    try {
      const { data, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .single();

      if (groupError) throw groupError;
      setGroup(data as Group);
    } catch (err) {
      console.error("Group fetch error:", err);
    }
  }, [groupId]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("students")
        .select("*")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Students fetch error:", fetchError);
        const errMsg = fetchError.message || "";
        if (errMsg.includes("relation") && errMsg.includes("does not exist")) {
          setStudents([]);
          setError("Cədvəl hələ yaradılmayıb. src/lib/sql/12_students_payments.sql faylını Supabase SQL Editor-də icra edin.");
          return;
        }
        throw fetchError;
      }
      setStudents((data || []) as Student[]);
      setError(null);
    } catch (err) {
      console.error("Students fetch error:", err);
      const message = err instanceof Error ? err.message : "Xəta baş verdi";
      setError(message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGroup();
    fetchStudents();
  }, [fetchGroup, fetchStudents]);

  async function fetchPayments(studentId: string, year: number) {
    try {
      const { data, error: payError } = await supabase
        .from("student_payments")
        .select("*")
        .eq("student_id", studentId)
        .eq("year", year);

      if (payError) throw payError;
      setPayments((data || []) as Payment[]);
    } catch (err) {
      console.error("Payment fetch error:", err);
      setPayments([]);
    }
  }

  function openStudent(student: Student) {
    setSelectedStudent(student);
    setSelectedYear(new Date().getFullYear());
    fetchPayments(student.id, new Date().getFullYear());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.full_name.trim()) {
      setError("Tələbə adı boş ola bilməz.");
      return;
    }

    setLoading(true);
    try {
      const { data: newStudent, error: insertError } = await supabase
        .from("students")
        .insert({
          full_name: form.full_name.trim(),
          phone: form.phone.trim() || null,
          group_id: groupId,
          status: "active",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Add the new student to local state immediately
      if (newStudent) {
        setStudents(prev => [newStudent as Student, ...prev]);
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
        .from("students")
        .delete()
        .eq("id", deleteId);
      if (deleteError) throw deleteError;
      setDeleteId(null);
      fetchStudents();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Silmə xətası";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function togglePayment(month: number) {
    if (!selectedStudent) return;

    const existing = payments.find(
      (p) => p.month === month && p.year === selectedYear
    );

    const newIsPaid = !existing?.is_paid;

    try {
      const { data: upsertData, error: upsertError } = await supabase
        .from("student_payments")
        .upsert({
          student_id: selectedStudent.id,
          year: selectedYear,
          month: month,
          is_paid: newIsPaid,
          paid_at: newIsPaid ? new Date().toISOString() : null,
        }, {
          onConflict: "student_id,year,month",
        })
        .select()
        .single();

      if (upsertError) throw upsertError;

      if (upsertData) {
        if (existing) {
          setPayments(payments.map((p) =>
            p.month === month && p.year === selectedYear
              ? upsertData as Payment
              : p
          ));
        } else {
          setPayments([...payments, upsertData as Payment]);
        }
      }
    } catch (err) {
      console.error("Toggle payment error:", err);
    }
  }

  function handleYearChange(year: number) {
    setSelectedYear(year);
    if (selectedStudent) {
      fetchPayments(selectedStudent.id, year);
    }
  }

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div>
      {/* Back Link */}
      <button
        onClick={() => router.push("/admin/telebeler")}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={16} />
        Bütün Qruplar
      </button>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{group?.name || "Qrup"}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {students.length} tələbə mövcuddur
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setError(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
        >
          <Plus size={16} />
          Yeni Şagird Əlavə Et
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

      {/* Students Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] text-left text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Tələbə adı</th>
              <th className="px-4 py-3 font-medium">Əlaqə / Telefon</th>
              <th className="px-4 py-3 font-medium">Qeydiyyat tarixi</th>
              <th className="px-4 py-3 text-right font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--muted)]">
                  Yüklənir...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--muted)]">{"Tələbə yoxdur. \"Yeni Şagird Əlavə Et\" düyməsini basın."}</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="cursor-pointer border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--section)]"
                  onClick={() => openStudent(student)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                        <GraduationCap size={16} />
                      </div>
                      <span className="font-medium">{student.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {student.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Date(student.created_at).toLocaleDateString("az-AZ")}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setDeleteId(student.id)}
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

      {/* Add Student Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Yeni Şagird</h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Ad Soyad</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                  placeholder="Tələbənin tam adı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Telefon</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-violet-500"
                  placeholder="+994 50 123 45 67"
                />
              </div>
              <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--muted)]">
                Qrup: <span className="font-medium text-[var(--foreground)]">{group?.name}</span>
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
            <h2 className="text-lg font-bold">Tələbəni sil?</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Bu əməliyyat geri alına bilməz. Bütün ödəniş məlumatları da silinəcək.</p>
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

      {/* Payment Tracking Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Tələbə Ödənişləri</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{selectedStudent.full_name}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg p-1 text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Calendar size={16} className="text-[var(--muted)]" />
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-violet-500"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {monthsAz.map((monthName, index) => {
                const monthNum = index + 1;
                const payment = payments.find(
                  (p) => p.month === monthNum && p.year === selectedYear
                );
                const isPaid = payment?.is_paid || false;

                return (
                  <button
                    key={monthNum}
                    onClick={() => togglePayment(monthNum)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all ${
                      isPaid
                        ? "border-green-500/30 bg-green-500/10"
                        : "border-[var(--card-border)] bg-[var(--background)] hover:border-violet-500/50"
                    }`}
                  >
                    <span className={isPaid ? "text-green-400" : "text-[var(--muted)]"}>
                      {monthName}
                    </span>
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                      isPaid
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-[var(--card-border)]"
                    }`}>
                      {isPaid && <Check size={12} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3">
              <span className="text-sm text-[var(--muted)]">
                {selectedYear} ili üçün ödəniş statusu
              </span>
              <span className="text-sm font-bold">
                {payments.filter((p) => p.is_paid).length} / 12 ödənilib
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
