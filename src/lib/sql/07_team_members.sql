-- ============================================
-- 07_team_members.sql
-- Komanda üzvləri cədvəli (team_members)
-- ============================================

-- Cədvəl yaradılır
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  photo_url text,
  role text not null,
  first_name text not null,
  last_name text not null,
  first_name_en text,
  last_name_en text,
  bio_en text,
  first_name_ru text,
  last_name_ru text,
  bio_ru text,
  bio text,
  email text,
  linkedin_url text,
  facebook_url text,
  instagram_url text,
  display_order integer default 0,
  created_at timestamptz default now()
);

-- RLS aktivləşdirilir
alter table public.team_members enable row level security;

-- İstifadəçilər üçün: yalnız SELECT (oxumaq)
create policy "Public can read team_members"
  on public.team_members
  for select
  using (true);

-- Authenticated istifadəçilər üçün: INSERT, UPDATE, DELETE
create policy "Authenticated can insert team_members"
  on public.team_members
  for insert
  to authenticated
  with check (true);

create policy "Authenticated can update team_members"
  on public.team_members
  for update
  to authenticated
  using (true);

create policy "Authenticated can delete team_members"
  on public.team_members
  for delete
  to authenticated
  using (true);

-- Nümunə məlumat (sample data)
insert into public.team_members (
  first_name, last_name, role, bio, email, linkedin_url, display_order
) values (
  'Mabud', 'Alishanov', 'CEO & Founder',
  'KursAgent platformasının qurucusu və baş direktoru. 10 ildən artıq proqramlaşdırma təcrübəsi var.',
  'mabud@kursagent.az', 'https://linkedin.com/in/mabudalishanov', 0
) on conflict do nothing;