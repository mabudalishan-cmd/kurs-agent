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
    title: { az: "İlk başlığın", ru: "Твой первый заголовок" },
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
    title: { az: "Rəng ver", ru: "Добавь цвет" },
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
    id: "kart",
    title: { az: "Gradient kart", ru: "Градиентная карточка" },
    brief: {
      az: "İndi göz oxşayan nəsə düzəldək. Kartın iki rəngini dəyiş — `#8b5cf6` və `#06b6d4`. `border-radius` rəqəmini də artırıb-azaltmağa çalış. Sonra kartın üstünə maus gətir.",
      ru: "А теперь сделаем что-нибудь красивое. Измени два цвета карточки — `#8b5cf6` и `#06b6d4`. Попробуй также увеличить или уменьшить число в `border-radius`. Потом наведи мышь на карточку.",
    },
    hint: {
      az: "`linear-gradient(135deg, rəng1, rəng2)` iki rəngi bir-birinə axıdır. `135deg` axının istiqamətidir — `90deg` yazsan yuxarıdan aşağı olacaq. `border-radius` isə künclərin yumruluğudur: `0` kvadrat, `999px` tam dairə.",
      ru: "`linear-gradient(135deg, цвет1, цвет2)` перетекает один цвет в другой. `135deg` — направление перехода: при `90deg` он пойдёт сверху вниз. А `border-radius` — скругление углов: `0` — квадрат, `999px` — круг.",
    },
    starter: {
      az: `<style>
  .kart {
    /* Bu iki rəngi dəyiş */
    background: linear-gradient(135deg, #8b5cf6, #06b6d4);

    border-radius: 20px;
    padding: 40px;
    color: white;
    text-align: center;
    font-family: system-ui, sans-serif;
    box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s;
  }

  /* Maus üstünə gələndə kart bir az qalxır */
  .kart:hover {
    transform: translateY(-8px);
  }

  .kart h2 {
    margin: 0 0 8px;
    font-size: 28px;
  }
</style>

<div class="kart">
  <h2>HelloWorld Academy</h2>
  <p>Mənim ilk kartım</p>
</div>`,
      ru: `<style>
  .karta {
    /* Измени эти два цвета */
    background: linear-gradient(135deg, #8b5cf6, #06b6d4);

    border-radius: 20px;
    padding: 40px;
    color: white;
    text-align: center;
    font-family: system-ui, sans-serif;
    box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s;
  }

  /* При наведении мыши карточка приподнимается */
  .karta:hover {
    transform: translateY(-8px);
  }

  .karta h2 {
    margin: 0 0 8px;
    font-size: 28px;
  }
</style>

<div class="karta">
  <h2>HelloWorld Academy</h2>
  <p>Моя первая карточка</p>
</div>`,
    },
    check: (code) =>
      /linear-gradient\s*\(/i.test(code) && /border-radius\s*:/i.test(code),
  },
  {
    id: "duyme",
    title: { az: "Düyməni canlandır", ru: "Оживи кнопку" },
    brief: {
      az: "Bu artıq proqramlaşdırmadır. JavaScript düyməyə basıldığını «eşidir» və mətni dəyişir. Sayğacın addımını dəyişməyə çalış — məsələn `1` əvəzinə `5`.",
      ru: "Это уже программирование. JavaScript «слышит» нажатие на кнопку и меняет текст. Попробуй изменить шаг счётчика — например, вместо `1` поставь `5`.",
    },
    hint: {
      az: "`addEventListener('click', ...)` funksiyanı hər klikdə çağırır. `sayGac` isə dəyəri yadda saxlayan dəyişəndir.",
      ru: "`addEventListener('click', ...)` вызывает функцию при каждом клике. А `schetchik` — переменная, хранящая значение.",
    },
    starter: {
      az: `<button id="duyme">Click et</button>
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
