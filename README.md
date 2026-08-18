# HelloWorld

Azərbaycan dilində kurs saytı üçün AI agent layihəsi. Next.js 16, React 19, Tailwind CSS 4 və Supabase istifadə olunur.

## Xüsusiyyətlər

- 🎨 Dark/light tema dəstəyi
- 🌍 İkidilli interfeys (AZ / RU)
- 📚 Kurslar və bloq idarəetməsi (admin panel)
- 💬 Əlaqə forması (mesajlar Supabase-də saxlanılır)
- 📧 Email abunəlik forması və kampaniya göndərmə (Resend)
- 🤖 AI köməkçi widget (Gemini)
- 📊 Səhifə baxışları analitikası
- 👥 Tələbə qrupları və ödəniş qeydiyyatı
- 📱 WhatsApp üzən düyməsi

## Başlama

```bash
npm install
```

Sonra environment dəyişənlərini qurun:

```bash
cp .env.example .env.local
```

`.env.local` faylını doldurduqdan sonra:

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) ünvanını açın.

## Environment Variables

Bütün dəyişənlərin izahı `.env.example` faylındadır.

| Dəyişən | Məcburi | Təyinat |
| ------- | ------- | ------- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase layihə URL-i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key (RLS ilə qorunur) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server açarı — RLS-i bypass edir |
| `GEMINI_API_KEY` | ➖ | AI chat widget üçün |
| `GEMINI_MODEL` | ➖ | Model adı (default: `gemini-2.0-flash`) |
| `RESEND_API_KEY` | ➖ | Email kampaniyalarının göndərilməsi üçün |
| `EMAIL_FROM` | ➖ | Göndərən ünvan (Resend-də təsdiqlənmiş domen) |

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` heç vaxt `NEXT_PUBLIC_` prefiksi ilə yazılmamalıdır — bu açar RLS-i tamamilə bypass edir və brauzerə düşməməlidir.

## Supabase quraşdırılması

`src/lib/sql/` qovluğundakı faylları [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**-də **nömrə sırası ilə** işlədin:

| # | Fayl | Nə yaradır |
| - | ---- | ---------- |
| 01 | `01_courses.sql` | `courses` cədvəli |
| 02 | `02_posts.sql` | `posts` cədvəli |
| 03 | `03_rls_policies.sql` | courses/posts üçün RLS siyasətləri |
| 04 | `04_messages.sql` | `messages` (əlaqə forması) |
| 05 | `05_subscribers.sql` | `subscribers` (email abunələri) |
| 06 | `06_add_ru_columns.sql` | Rus dili sütunları |
| 07 | `07_team_members.sql` | `team_members` (komanda) |
| 08 | `08_storage_setup.sql` | `media` storage bucket + siyasətlər |
| 09 | `09_faq_items.sql` | `faq_items` (FAQ) + başlanğıc suallar |
| 10 | `10_analytics.sql` | `page_views` (analitika) |
| 11 | `11_email_campaigns.sql` | `email_campaigns` |
| 12 | `12_students_payments.sql` | `groups`, `students`, `student_payments` |
| 13 | `13_tighten_public_writes.sql` | Public yazma icazələrini bağlayır |

> **13 nömrəli fayl vacibdir.** O, anon rolunun `messages`, `subscribers` və `page_views` cədvəllərinə birbaşa INSERT icazəsini silir. Bu yazmalar artıq server route-larından keçir (aşağıya bax). Fayl icra edilməzsə sayt işləyəcək, amma anon key-i olan hər kəs həmin cədvəlləri spam-la doldura bilər.

### Admin istifadəçisi yaratmaq

Admin panelə giriş Supabase Auth ilə işləyir. İstifadəçini Dashboard → **Authentication** → **Users** → **Add user** bölməsindən yaradın. Qeydiyyat səhifəsi yoxdur — bu qəsdəndir.

## Backend arxitekturası

### Məlumatın oxunması

Public və admin səhifələri server komponentlərində `createServerSupabaseClient()` (service role) ilə oxuyur — `src/lib/supabase.ts`.

### Məlumatın yazılması

| Yol | Route | Rate limit | Qeyd |
| --- | ----- | ---------- | ---- |
| Əlaqə forması | `POST /api/contact` | 5 / 10 dəq | Validation + service role |
| Abunəlik | `POST /api/subscribe` | 5 / saat | Təkrar email üçün 409 |
| Analitika | `POST /api/track` | 60 / dəq | Xəta olsa da 204 qaytarır |
| AI chat | `POST /api/chat` | 10 / dəq | Gemini sorğuları pulludur |
| Kampaniya göndərmə | `POST /api/campaigns/send` | — | Admin auth tələb olunur |

Admin panelindəki CRUD əməliyyatları (kurslar, bloq, FAQ, komanda, tələbələr) brauzerdən anon key ilə gedir və `authenticated` RLS siyasətləri ilə qorunur.

> **Rate limiting qeydi:** sayğaclar proses yaddaşındadır (`src/lib/rate-limit.ts`). Serverless mühitdə hər instansiyanın öz sayğacı olur, ona görə real limit instansiya sayına görə çoxala bilər. Yüksək trafikdə Upstash Redis kimi paylaşılan store-a keçmək lazımdır.

### Autentifikasiya

`src/proxy.ts` (Next.js 16-da middleware bu adla gəlir) `/admin/*` yollarını qoruyur və giriş etməmiş istifadəçini `/admin/login`-ə yönləndirir. **`/api/*` yolları proxy ilə qorunmur** — admin tələb edən route-lar icazəni özləri yoxlayır (`/api/campaigns/send` nümunəsinə bax).

## Admin Panel

| Yol | Səhifə |
| --- | ------ |
| `/admin` | Dashboard (statistika) |
| `/admin/kurslar` | Kursların idarəedilməsi |
| `/admin/bloq` | Bloq yazıları |
| `/admin/mesajlar` | Əlaqə formasından gələn mesajlar |
| `/admin/abuneler` | Email abunələri (CSV ixrac) |
| `/admin/hesablar` | Komanda üzvləri |
| `/admin/suallar` | FAQ idarəetməsi |
| `/admin/analitika` | Səhifə baxışları |
| `/admin/email-kampaniyalari` | Email kampaniyaları |
| `/admin/telebeler` | Tələbə qrupları və ödənişlər |
| `/admin/login` | Giriş səhifəsi |

## Build

```bash
npm run build
```
