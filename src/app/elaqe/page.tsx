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
} from "lucide-react";

export default function ElaqePage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Ünvan",
      value: "Bakı şəhəri, Nizami küçəsi 100, Azərbaycan",
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@kursagent.az",
      href: "mailto:info@kursagent.az",
    },
    {
      icon: Phone,
      title: "Telefon",
      value: "+994 50 123 45 67",
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
          <span className="gradient-text">Əlaqə</span>
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Hər hansı sualınız var? Bizimlə əlaqə saxlayın
        </p>
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
            <h2 className="text-2xl font-bold">Əlaqə Məlumatları</h2>
            <p className="mt-3 text-[var(--muted)]">
              Aşağıdakı üsullardan hər hansı biri ilə bizə yazmaqdan çəkinməyin.
              Sualınızı cavablandırmaqdan məmnun olarıq.
            </p>
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
                    <h3 className="font-semibold">{info.title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {info.value}
                    </p>
                  </div>
                </motion.div>
              );

              return info.href ? (
                <a key={info.title} href={info.href} className="block">
                  {content}
                </a>
              ) : (
                <div key={info.title}>{content}</div>
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
          <h2 className="text-2xl font-bold">Mesaj Göndər</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Formu doldurun, sizinlə ən qısa zamanda əlaqə saxlayacağıq.
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
                Mesajınız göndərildi!
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Tezliklə sizinlə əlaqə saxlayacağıq.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-blue)]"
              >
                Yeni mesaj göndər
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  Ad Soyad
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
                    placeholder="Adınızı daxil edin"
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted)] outline-none transition-colors focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  Email
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
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted)] outline-none transition-colors focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  Mesaj
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
                    placeholder="Mesajınızı buraya yazın..."
                    className="w-full resize-none rounded-lg border border-[var(--card-border)] bg-[var(--background)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted)] outline-none transition-colors focus:border-violet-500/50"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
              >
                <Send size={16} />
                Göndər
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}