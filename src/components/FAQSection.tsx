"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import FaqMonochrome, { type FaqEntry } from "@/components/ui/faq-monochrome";

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
    question_ru: "Как проходят курсы?",
    answer_ru:
      "Все наши курсы проходят онлайн — в формате живых занятий и записанных видео.",
  },
  {
    question: "Sertifikat alıram mı?",
    answer:
      "Bəli, hər kursu uğurla bitirdikdə beynəlxalq tanınan sertifikat əldə edirsiniz.",
    question_ru: "Получу ли я сертификат?",
    answer_ru:
      "Да, после успешного окончания каждого курса вы получаете сертификат международного признания.",
  },
  {
    question: "Ödəniş necə edilir?",
    answer:
      "Kart vasitəsilə tam ödəniş və ya aylıq hissələrlə ödəniş edə bilərsiniz.",
    question_ru: "Как производится оплата?",
    answer_ru:
      "Вы можете оплатить картой полностью или частями — ежемесячными платежами.",
  },
  {
    question: "Əvvəlcədən təcrübəm olmalıdır?",
    answer:
      "Xeyr, kurslarımızın çoxu sıfırdan başlayanlar üçün nəzərdə tutulub.",
    question_ru: "Нужен ли предварительный опыт?",
    answer_ru:
      "Нет, большинство наших курсов рассчитаны на тех, кто начинает с нуля.",
  },
  {
    question: "Kursu bitirdikdən sonra iş tapmaqda kömək olunur?",
    answer:
      "Bəli, məzunlarımıza CV hazırlığı və iş yerləşdirmə dəstəyi göstəririk.",
    question_ru: "Помогаете ли вы с трудоустройством после курса?",
    answer_ru:
      "Да, мы помогаем выпускникам с подготовкой резюме и трудоустройством.",
  },
];

export default function FAQSection() {
  const { lang, t } = useLanguage();
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

  // Seçilmiş dilə uyğun mətn — tərcümə boşdursa Azərbaycan dilinə qayıdır.
  const entries: FaqEntry[] = faqItems.map((item) => ({
    question:
      lang === "ru" && item.question_ru?.trim()
        ? item.question_ru
        : item.question,
    answer:
      lang === "ru" && item.answer_ru?.trim() ? item.answer_ru : item.answer,
  }));

  return (
    <FaqMonochrome
      items={entries}
      eyebrow={t("faq.eyebrow")}
      title={t("faq.title")}
      titleAccent={t("faq.titleAccent")}
      subtitle={t("faq.subtitle")}
    />
  );
}
