"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Lightbulb, Check, Info } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { WORKSHOP_TASKS, pick } from "@/lib/workshop/tasks";
import type { Language } from "@/lib/i18n/translations";

/**
 * Ziyarətçinin yazdığı kodu tam HTML sənədinə çevirir.
 *
 * Bazis stillər verilir ki, nəticə boş ağ səhifə kimi yox, oxunaqlı
 * görünsün — ziyarətçinin öz `<style>` bloku sonra gəldiyi üçün onları
 * rahat üstələyə bilir.
 */
function buildDocument(code: string, lang: Language): string {
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>preview</title>
<style>
  body {
    margin: 0;
    padding: 20px;
    background: #ffffff;
    color: #0f172a;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    line-height: 1.6;
  }
  button {
    font: inherit;
    padding: 8px 16px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #f8fafc;
    cursor: pointer;
  }
</style>
</head>
<body>
${code}
</body>
</html>`;
}

/**
 * Təlimat mətnindəki `backtick` hissələrini `<code>` kimi göstərir.
 *
 * Tapşırıq mətnlərində teq və xüsusiyyət adları çəkildiyi üçün onların
 * adi mətndən seçilməsi lazımdır — əks halda backtick-lər ekranda
 * hərfi simvol kimi görünür.
 */
function renderInlineCode(text: string) {
  return text.split("`").map((part, index) =>
    // Tək indeksli hissələr backtick-lərin arasında qalanlardır
    index % 2 === 1 ? (
      <code
        key={index}
        className="rounded bg-[var(--accent)]/10 px-1.5 py-0.5 font-mono text-[0.85em] text-[var(--accent)]"
      >
        {part}
      </code>
    ) : (
      part
    )
  );
}

export default function CodePlayground() {
  const { lang, t } = useLanguage();

  const [taskIndex, setTaskIndex] = useState(0);
  const task = WORKSHOP_TASKS[taskIndex];

  /**
   * Hər tapşırığın kodu ayrıca saxlanılır ki, ziyarətçi tapşırıqlar
   * arasında gedib-gəldikdə yazdığı itməsin.
   */
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      WORKSHOP_TASKS.map((item) => [item.id, pick(item.starter, lang)])
    )
  );
  const code = drafts[task.id] ?? "";

  const [preview, setPreview] = useState(() =>
    buildDocument(pick(WORKSHOP_TASKS[0].starter, lang), lang)
  );
  /** Hər işə salmada iframe tam yenidən qurulsun deyə (köhnə vəziyyət qalmasın). */
  const [runId, setRunId] = useState(0);
  const [solved, setSolved] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  function run(source: string) {
    setPreview(buildDocument(source, lang));
    setRunId((n) => n + 1);
    setSolved(task.check(source));
  }

  function selectTask(index: number) {
    const next = WORKSHOP_TASKS[index];
    const nextCode = drafts[next.id] ?? pick(next.starter, lang);
    setTaskIndex(index);
    setHintOpen(false);
    setSolved(next.check(nextCode));
    setPreview(buildDocument(nextCode, lang));
    setRunId((n) => n + 1);
  }

  function reset() {
    const starter = pick(task.starter, lang);
    setDrafts((prev) => ({ ...prev, [task.id]: starter }));
    setSolved(false);
    setPreview(buildDocument(starter, lang));
    setRunId((n) => n + 1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Ctrl/Cmd + Enter — redaktordan çıxmadan işə salmaq
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      run(code);
      return;
    }

    // Tab redaktordan çıxmasın, iki boşluq əlavə etsin
    if (event.key === "Tab") {
      event.preventDefault();
      const el = event.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = code.slice(0, start) + "  " + code.slice(end);
      setDrafts((prev) => ({ ...prev, [task.id]: next }));
      requestAnimationFrame(() => {
        el.selectionStart = start + 2;
        el.selectionEnd = start + 2;
      });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold sm:text-5xl">
          <span className="gradient-text">{t("workshop.title")}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
          {t("workshop.subtitle")}
        </p>
      </motion.div>

      {/* Tapşırıq seçimi */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {WORKSHOP_TASKS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectTask(index)}
            aria-current={index === taskIndex ? "step" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              index === taskIndex
                ? "border-[var(--accent)]/60 bg-[var(--accent)]/10 text-[var(--foreground)]"
                : "border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {pick(item.title, lang)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sol sütun — təlimat və redaktor */}
        <div className="flex flex-col gap-4">
          <div className="liquid-glass rounded-2xl p-5">
            <p className="text-sm leading-relaxed text-[var(--foreground)]">
              {renderInlineCode(pick(task.brief, lang))}
            </p>

            <button
              type="button"
              onClick={() => setHintOpen((open) => !open)}
              className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-[var(--accent)] transition-opacity hover:opacity-80"
            >
              <Lightbulb size={14} />
              {hintOpen ? t("workshop.hintHide") : t("workshop.hintShow")}
            </button>

            {hintOpen && (
              <p className="mt-3 border-l-2 border-[var(--accent)]/40 pl-3 text-xs leading-relaxed text-[var(--muted)]">
                {renderInlineCode(pick(task.hint, lang))}
              </p>
            )}
          </div>

          <div className="liquid-glass overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-2.5">
              <span className="font-mono text-xs text-[var(--muted)]">
                index.html
              </span>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                <RotateCcw size={12} />
                {t("workshop.reset")}
              </button>
            </div>

            <textarea
              value={code}
              onChange={(event) =>
                setDrafts((prev) => ({
                  ...prev,
                  [task.id]: event.target.value,
                }))
              }
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-label={t("workshop.editor")}
              className="h-72 w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-relaxed text-[var(--foreground)] outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => run(code)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              <Play size={15} />
              {t("workshop.run")}
            </button>

            <span className="hidden text-xs text-[var(--muted)] sm:inline">
              {t("workshop.shortcut")}
            </span>

            {solved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                <Check size={14} />
                {t("workshop.success")}
              </span>
            )}
          </div>
        </div>

        {/* Sağ sütun — nəticə */}
        <div className="flex flex-col gap-3">
          <div className="liquid-glass overflow-hidden rounded-2xl">
            {/* Brauzer pəncərəsi görüntüsü — ağ fonun səbəbi aydın olsun deyə */}
            <div className="flex items-center gap-2 border-b border-[var(--card-border)] px-4 py-2.5">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </span>
              <span className="ml-2 font-mono text-xs text-[var(--muted)]">
                {t("workshop.preview")}
              </span>
            </div>

            {/*
              Təhlükəsizlik: `sandbox` yalnız `allow-scripts` ilə verilir.
              `allow-same-origin` HEÇ VAXT əlavə edilməməlidir — ikisi bir
              yerdə olanda çərçivə öz sandbox-unu silə və saytın cookie,
              localStorage-ına çata bilər. İndiki halda çərçivə ayrıca,
              adsız mənşədədir: nə valideyn səhifəni oxuya bilir, nə forma
              göndərə, nə də yuxarı pəncərəni başqa ünvana yönləndirə.

              Yazılan kod heç yerə göndərilmir — brauzerdən çıxmır.
            */}
            <iframe
              key={runId}
              srcDoc={preview}
              sandbox="allow-scripts"
              referrerPolicy="no-referrer"
              title={t("workshop.preview")}
              className="h-[26rem] w-full bg-white"
            />
          </div>

          <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-[var(--muted)]">
            <Info size={13} className="mt-0.5 shrink-0" />
            {t("workshop.safeNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
