import type { Language } from "@/lib/i18n/translations";

/**
 * Workshop məşqləri.
 *
 * Mətnlər `translations.ts`-də deyil, burada saxlanılır: hər tapşırığın
 * başlığı, izahı, ipucu və başlanğıc kodu bir yerdə dursun deyə. Dil
 * seçimi saytın qalan hissəsindəki qayda ilə eynidir — `ru` boş olsa
 * Azərbaycan mətni göstərilir.
 */
export type Localized = { az: string; ru: string };

export type WorkshopTask = {
  id: string;
  title: Localized;
  /** Ziyarətçinin nə etməli olduğu — qısa, bir-iki cümlə. */
  brief: Localized;
  /** "İpucu" düyməsinin altındakı mətn. */
  hint: Localized;
  /** Redaktora ilk yüklənən kod. */
  starter: Localized;
  /**
   * Yazılan kodun tapşırığa uyğun olub-olmadığını yoxlayır.
   *
   * Yoxlama mənbə mətni üzərində aparılır, render olunmuş sənəd üzərində
   * yox: preview iframe-i `allow-same-origin` olmadan işlədiyi üçün
   * valideyn səhifə onun DOM-una çata bilmir (bu, qəsdən belədir).
   *
   * Ona görə yoxlama bağışlayandır — məqsəd imtahan yox, istiqamətdir.
   */
  check: (code: string) => boolean;
};

export const WORKSHOP_TASKS: WorkshopTask[] = [
  {
    id: "basliq",
    title: { az: "1. İlk başlığın", ru: "1. Твой первый заголовок" },
    brief: {
      az: "HTML-də başlıq `<h1>` teqi ilə yazılır. Aşağıdakı kodda başlığın mətnini dəyiş — öz adını yaz — və «İşə sal» düyməsinə bas.",
      ru: "В HTML заголовок пишется тегом `<h1>`. Измени текст заголовка в коде ниже — напиши своё имя — и нажми «Запустить».",
    },
    hint: {
      az: "Teq həmişə cütdür: `<h1>` açır, `</h1>` bağlayır. Mətn ikisinin arasına yazılır.",
      ru: "Тег всегда парный: `<h1>` открывает, `</h1>` закрывает. Текст пишется между ними.",
    },
    starter: {
      az: `<h1>Salam, dünya!</h1>
<p>Bu mənim ilk səhifəmdir.</p>`,
      ru: `<h1>Привет, мир!</h1>
<p>Это моя первая страница.</p>`,
    },
    check: (code) => /<h1[\s>][\s\S]*?<\/h1>/i.test(code),
  },
  {
    id: "reng",
    title: { az: "2. Rəng ver", ru: "2. Добавь цвет" },
    brief: {
      az: "İndi səhifəni bəzəyək. `<style>` blokunun içində başlığın rəngini dəyiş — məsələn `crimson`, `teal` və ya `#8b5cf6` yaz.",
      ru: "Теперь оформим страницу. Внутри блока `<style>` измени цвет заголовка — например, `crimson`, `teal` или `#8b5cf6`.",
    },
    hint: {
      az: "CSS qaydası belədir: hansı elementi seçirsən, sonra fiqurlu mötərizədə `xüsusiyyət: dəyər;` yazırsan.",
      ru: "Правило CSS выглядит так: сначала селектор, затем в фигурных скобках `свойство: значение;`.",
    },
    starter: {
      az: `<style>
  h1 {
    color: teal;
    font-family: system-ui, sans-serif;
  }
</style>

<h1>Rəngli başlıq</h1>`,
      ru: `<style>
  h1 {
    color: teal;
    font-family: system-ui, sans-serif;
  }
</style>

<h1>Цветной заголовок</h1>`,
    },
    check: (code) =>
      /<style[\s>][\s\S]*?<\/style>/i.test(code) && /color\s*:/i.test(code),
  },
  {
    id: "duyme",
    title: { az: "3. Düyməni canlandır", ru: "3. Оживи кнопку" },
    brief: {
      az: "Bu artıq proqramlaşdırmadır. JavaScript düyməyə basıldığını «eşidir» və mətni dəyişir. Sayğacın addımını dəyişməyə çalış — məsələn `1` əvəzinə `5`.",
      ru: "Это уже программирование. JavaScript «слышит» нажатие на кнопку и меняет текст. Попробуй изменить шаг счётчика — например, вместо `1` поставь `5`.",
    },
    hint: {
      az: "`addEventListener('click', ...)` funksiyanı hər klikdə çağırır. `sayGac` isə dəyəri yadda saxlayan dəyişəndir.",
      ru: "`addEventListener('click', ...)` вызывает функцию при каждом клике. А `schetchik` — переменная, хранящая значение.",
    },
    starter: {
      az: `<button id="duyme">Mənə bas</button>
<p id="netice">Hələ heç nə olmayıb.</p>

<script>
  let sayGac = 0;

  document.getElementById("duyme").addEventListener("click", function () {
    sayGac = sayGac + 1;
    document.getElementById("netice").textContent =
      "Sən " + sayGac + " dəfə basdın!";
  });
</script>`,
      ru: `<button id="knopka">Нажми меня</button>
<p id="rezultat">Пока ничего не произошло.</p>

<script>
  let schetchik = 0;

  document.getElementById("knopka").addEventListener("click", function () {
    schetchik = schetchik + 1;
    document.getElementById("rezultat").textContent =
      "Ты нажал " + schetchik + " раз!";
  });
</script>`,
    },
    check: (code) =>
      /<button[\s>]/i.test(code) &&
      /addEventListener|onclick/i.test(code) &&
      /<script[\s>][\s\S]*?<\/script>/i.test(code),
  },
];

/** `_ru` sütunları ilə eyni qayda: rus mətni boşdursa, azərbaycancaya qayıt. */
export function pick(value: Localized, lang: Language): string {
  if (lang === "ru" && value.ru.trim()) {
    return value.ru;
  }
  return value.az;
}
