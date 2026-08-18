"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  User,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

export default function ElaqePage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(t("contact.fillAllFields"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? t("contact.sendError"));
        return;
      }

      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError(t("contact.sendError"));
    } finally {
      setLoading(false);
    }
  }

  const contactInfo: {
    icon: typeof MapPin;
    titleKey: TranslationKey;
    value: string;
    href?: string;
  }[] = [
    {
      icon: MapPin,
      titleKey: "contact.addressTitle",
      value: t("contact.addressFull"),
    },
    {
      icon: Mail,
      titleKey: "contact.emailTitle",
      value: t("contact.emailValue"),
      href: "mailto:info@helloworld.az",
    },
    {
      icon: Phone,
      titleKey: "contact.phoneTitle",
      value: t("contact.phone"),
      href: "tel:+994501234567",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Başlıq */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold sm:text-5xl">
          <span className="gradient-text">{t("contact.title")}</span>
        </h1>
        <p className="mt-4 text-[var(--muted)]">{t("contact.subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Əlaqə məlumatları */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-2xl font-bold">{t("contact.infoTitle")}</h2>
            <p className="mt-3 text-[var(--muted)]">{t("contact.infoDesc")}</p>
          </div>

          <div className="space-y-4">
            {contactInfo.map((info, i) => {
              const Icon = info.icon;
              const content = (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="card-glow flex items-start gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-[var(--accent)]"
                  >
                    <Icon size={20} />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold">{t(info.titleKey)}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {info.value}
                    </p>
                  </div>
                </motion.div>
              );

              return info.href ? (
                <a key={info.titleKey} href={info.href} className="block">
                  {content}
                </a>
              ) : (
                <div key={info.titleKey}>{content}</div>
              );
            })}
          </div>
        </motion.div>

        {/* Əlaqə forması */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 sm:p-8"
        >
          <h2 className="text-2xl font-bold">{t("contact.sendMessage")}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t("contact.formDesc")}
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-blue-500/10 p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20 text-[var(--accent)]"
              >
                <CheckCircle2 size={24} />
              </motion.div>
              <h3 className="mt-3 text-lg font-semibold text-[var(--accent)]">
                {t("contact.success")}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {t("contact.successDesc")}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-blue)]"
              >
                {t("contact.newMessage")}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  {t("contact.fullName")}
                </label>
                <div className="relative mt-2">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t("contact.namePlaceholderFull")}
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted)] outline-none transition-colors focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  {t("contact.email")}
                </label>
                <div className="relative mt-2">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t("contact.emailPlaceholder")}
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted)] outline-none transition-colors focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  {t("contact.message")}
                </label>
                <div className="relative mt-2">
                  <MessageSquare
                    size={16}
                    className="absolute left-3 top-4 text-[var(--muted)]"
                  />
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t("contact.messagePlaceholderFull")}
                    className="w-full resize-none rounded-lg border border-[var(--card-border)] bg-[var(--background)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted)] outline-none transition-colors focus:border-violet-500/50"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t("contact.sending")}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {t("contact.send")}
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}