"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type FAQItem = {
  question: string;
  answer: string;
  question_ru?: string | null;
  answer_ru?: string | null;
};

/**
 * Baza əlçatan olmadıqda və ya faq_items cədvəli hələ yaradılmadıqda
 * istifadə olunan ehtiyat siyahı — səhifə heç vaxt boş qalmır.
 */
const fallbackItems: FAQItem[] = [
  {
    question: "Kurslar necə keçirilir?",
    answer:
      "Bütün kurslarımız onlayn formatda, canlı dərslər və qeydə alınmış videolar şəklində keçirilir.",
  },
  {
    question: "Sertifikat alıram mı?",
    answer:
      "Bəli, hər kursu uğurla bitirdikdə beynəlxalq tanınan sertifikat əldə edirsiniz.",
  },
  {
    question: "Ödəniş necə edilir?",
    answer:
      "Kart vasitəsilə tam ödəniş və ya aylıq hissələrlə ödəniş edə bilərsiniz.",
  },
  {
    question: "Əvvəlcədən təcrübəm olmalıdır?",
    answer:
      "Xeyr, kurslarımızın çoxu sıfırdan başlayanlar üçün nəzərdə tutulub.",
  },
  {
    question: "Kursu bitirdikdən sonra iş tapmaqda kömək olunur?",
    answer:
      "Bəli, məzunlarımıza CV hazırlığı və iş yerləşdirmə dəstəyi göstəririk.",
  },
];

export default function FAQSection() {
  const { lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqItems, setFaqItems] = useState<FAQItem[]>(fallbackItems);

  useEffect(() => {
    async function fetchFaq() {
      const { data, error } = await supabase
        .from("faq_items")
        .select("question, answer, question_ru, answer_ru")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      // Xəta olarsa (cədvəl yoxdur və s.) ehtiyat siyahı qalır.
      if (!error && data && data.length > 0) {
        setFaqItems(data as FAQItem[]);
      }
    }
    fetchFaq();
  }, []);

  const localizedQuestion = (item: FAQItem) => {
    if (lang === "ru" && item.question_ru?.trim()) return item.question_ru;
    return item.question;
  };

  const localizedAnswer = (item: FAQItem) => {
    if (lang === "ru" && item.answer_ru?.trim()) return item.answer_ru;
    return item.answer;
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold sm:text-4xl">
          Tez-tez <span className="gradient-text">verilən suallar</span>
        </h2>
        <p className="mt-4 text-[var(--muted)]">
          Sualınız var? Cavablarımız var.
        </p>
      </motion.div>

      <div className="divide-y divide-[var(--card-border)]">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span
                  className={`text-base font-semibold transition-colors sm:text-lg ${
                    isOpen
                      ? "text-[var(--accent)]"
                      : "text-[var(--foreground)] group-hover:text-[var(--accent)]"
                  }`}
                >
                  {localizedQuestion(item)}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`shrink-0 transition-colors ${
                    isOpen
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)] group-hover:text-[var(--accent)]"
                  }`}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 pr-8 text-sm text-[var(--muted)] sm:text-base">
                      {localizedAnswer(item)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}