/**
 * Public API route-ları üçün giriş məlumatlarının yoxlanması.
 * Bütün xəta mesajları istifadəçiyə göstərilmək üçün Azərbaycan dilindədir.
 */

export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_MESSAGE_LENGTH = 5000;
export const MAX_PATH_LENGTH = 512;
export const MAX_VISITOR_ID_LENGTH = 64;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Naməlum tipli dəyəri təhlükəsiz şəkildə kəsilmiş sətrə çevirir.
 */
export function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isValidEmail(value: string): boolean {
  return value.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(value);
}

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export function validateContact(body: unknown): ValidationResult<ContactInput> {
  const raw = (body ?? {}) as Record<string, unknown>;

  const name = cleanText(raw.name);
  const email = cleanText(raw.email).toLowerCase();
  const message = cleanText(raw.message);

  if (!name || !email || !message) {
    return { ok: false, error: "Bütün sahələri doldurun." };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { ok: false, error: "Ad çox uzundur." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "E-poçt ünvanı düzgün deyil." };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: "Mesaj çox uzundur." };
  }

  return { ok: true, data: { name, email, message } };
}

export function validateSubscribe(
  body: unknown
): ValidationResult<{ email: string }> {
  const raw = (body ?? {}) as Record<string, unknown>;
  const email = cleanText(raw.email).toLowerCase();

  if (!email) {
    return { ok: false, error: "E-poçt ünvanı tələb olunur." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "E-poçt ünvanı düzgün deyil." };
  }

  return { ok: true, data: { email } };
}

export type TrackInput = {
  page_path: string;
  visitor_id: string;
};

export function validateTrack(body: unknown): ValidationResult<TrackInput> {
  const raw = (body ?? {}) as Record<string, unknown>;

  const pagePath = cleanText(raw.page_path);
  const visitorId = cleanText(raw.visitor_id);

  if (!pagePath || !visitorId) {
    return { ok: false, error: "page_path və visitor_id tələb olunur." };
  }
  // Yalnız sayt daxili yollar qeydə alınır — xarici URL yeridilməsinin qarşısını alır.
  if (!pagePath.startsWith("/") || pagePath.length > MAX_PATH_LENGTH) {
    return { ok: false, error: "page_path düzgün deyil." };
  }
  if (visitorId.length > MAX_VISITOR_ID_LENGTH) {
    return { ok: false, error: "visitor_id düzgün deyil." };
  }

  return { ok: true, data: { page_path: pagePath, visitor_id: visitorId } };
}

/**
 * Sorğu gövdəsini təhlükəsiz JSON kimi oxuyur (yanlış JSON-da null qaytarır).
 */
export async function readJsonBody(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
