# HelloWorld

Azərbaycan dilində kurs saytı üçün AI agent layihəsi. Next.js 16, React 19, Tailwind CSS 4 və Supabase istifadə olunur.

## Xüsusiyyətlər

- 🎨 Dark/light tema dəstəyi
- 📚 Kurslar və bloq idarəetməsi (admin panel)
- 💬 Əlaqə forması (mesajlar Supabase-də saxlanılır)
- 📧 Email abunəlik forması (footer-də)
- 🎯 Kampaniya banneri (ana səhifə)
- 📱 WhatsApp üzən düyməsi
- 🚀 404 səhifəsi
- 👤 Admin profil dropdown (çıxış funksiyası ilə)

## Başlama

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) ünvanını açın.

## Environment Variables

`.env.local` faylı yaradın:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Supabase SQL Faylları

`src/lib/sql/` qovluğundakı SQL fayllarını Supabase SQL Editor-da sıra ilə işlədin:

1. **`01_courses.sql`** — `courses` cədvəli (kurslar)
2. **`02_posts.sql`** — `posts` cədvəli (bloq yazıları)
3. **`03_rls_p`** — RLS siyasətləri (courses və posts üçün)
4. **`04_messages.sql`** — `messages` cədvəli (əlaqə forması mesajları)
5. **`05_subscribers.sql`** — `subscribers` cədvəli (email abunələri)

### Supabase-də işlətmə qaydası:

1. [Supabase Dashboard](https://supabase.com/dashboard)-a daxil olun
2. Sol menyudan **SQL Editor** seçin
3. Hər SQL faylının məzmununu kopyalayıb yapışdırın və **Run** düyməsinə basın
4. Faylları nömrə sırası ilə işlədin (01 → 02 → 03 → 04 → 05)

### Cədvəl strukturları:

**`messages` cədvəli:**

| Sahə       | Tip           | Təsvir                    |
| ---------- | ------------- | ------------------------- |
| id         | uuid (PK)     | Avtomatik generasiya olunur |
| name       | text          | Göndərənin adı            |
| email      | text          | Göndərənin email-i       |
| message    | text          | Mesaj məzmunu             |
| is_read    | boolean       | Oxunmuş/oxunmamış statusu |
| created_at | timestamptz   | Yaradılma tarixi          |

**`subscribers` cədvəli:**

| Sahə       | Tip           | Təsvir                    |
| ---------- | ------------- | ------------------------- |
| id         | uuid (PK)     | Avtomatik generasiya olunur |
| email      | text (UNIQUE) | Abunə email-i (təkrarsız) |
| created_at | timestamptz   | Abunə olma tarixi         |

## Admin Panel

- `/admin` — Dashboard (statistika)
- `/admin/kurslar` — Kursların idarəedilməsi
- `/admin/bloq` — Bloq yazılarının idarəedilməsi
- `/admin/mesajlar` — Əlaqə formasından gələn mesajlar
- `/admin/abuneler` — Email abunələri (CSV ixrac dəstəyi)
- `/admin/login` — Giriş səhifəsi

## Build

```bash
npm run build