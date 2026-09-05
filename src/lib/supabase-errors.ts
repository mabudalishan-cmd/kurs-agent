/**
 * Supabase xətalarının təsnifatı.
 */

/**
 * Cədvəlin hələ yaradılmadığını göstərən xətanı aşkarlayır.
 *
 * Bu, gözlənilməz xəta deyil — SQL migrasiyası hələ Supabase-də
 * icra edilməyib. Belə halda `console.error` çağırmaq lazım deyil:
 * Next.js dev rejimi onu böyük xəta overlay-i kimi göstərir və admin
 * paneli işləməz görünür. Əvəzində istifadəçiyə nə etməli olduğunu
 * izah edən mesaj göstərilir.
 *
 * PostgREST bu halda `PGRST205` kodu və "schema cache" mətni qaytarır,
 * birbaşa SQL isə "relation ... does not exist" verir.
 */
export function isMissingTableError(
  error: { message?: string; code?: string } | null | undefined
): boolean {
  if (!error) return false;
  if (error.code === "PGRST205") return true;

  const message = error.message ?? "";
  if (message.includes("schema cache")) return true;
  if (message.includes("relation") && message.includes("does not exist")) {
    return true;
  }
  return false;
}

/**
 * Sütunun hələ əlavə edilmədiyini göstərən xətanı aşkarlayır.
 *
 * Cədvəl mövcuddur, amma migrasiya işlədilmədiyi üçün sütun yoxdur.
 * PostgREST `PGRST204` kodu, Postgres isə `42703` qaytarır.
 */
export function isMissingColumnError(
  error: { message?: string; code?: string } | null | undefined
): boolean {
  if (!error) return false;
  if (error.code === "PGRST204" || error.code === "42703") return true;

  const message = error.message ?? "";
  return message.includes("column") && message.includes("does not exist");
}
