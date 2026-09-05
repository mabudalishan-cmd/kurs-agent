/**
 * Tarix formatlaması.
 *
 * `toLocaleDateString` əvəzinə əl ilə yazılmış ay adları istifadə olunur:
 * serverdə və brauzerdə eyni nəticə alınsın deyə (Node-un ICU məlumatı
 * fərqli ola bilir) və Azərbaycan dili hər mühitdə dəstəklənmir.
 */

const MONTHS_AZ = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "İyun",
  "İyul",
  "Avqust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
];

const MONTHS_RU = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export function formatDate(dateString: string, lang: "az" | "ru"): string {
  const date = new Date(dateString);
  const months = lang === "ru" ? MONTHS_RU : MONTHS_AZ;
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
