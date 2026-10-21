-- Soundtrack Credit · Supabase 스키마
-- Supabase 대시보드 → SQL Editor → New query 에 전체를 붙여 넣고 Run.
-- 여러 번 실행해도 안전하도록 작성했습니다.

-- ─────────────────────────────────────────────
-- 1) 프로필 (회원 1명당 1행, 가입 시 자동 생성)
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  nickname    text check (char_length(nickname) <= 30),
  theme       text not null default 'dark' check (theme in ('dark', 'light')),
  plan        text not null default 'beta' check (plan in ('beta', 'free', 'member')),
  plan_until  timestamptz,
  marketing_opt_in boolean not null default false,
  taste       jsonb not null default '{}'::jsonb check (pg_column_size(taste) <= 2000),  -- 고른 장르·무드
  created_at  timestamptz not null default now()
);
alter table public.profiles add column if not exists taste jsonb not null default '{}'::jsonb check (pg_column_size(taste) <= 2000);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- 2) 티켓 (관람 기록)
-- ─────────────────────────────────────────────
create table if not exists public.tickets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  barcode       text check (char_length(barcode) <= 64),
  movie_id      integer,                       -- TMDB 영화 ID (없으면 직접 입력한 영화)
  title         text not null check (char_length(title) between 1 and 120),
  original_title text check (char_length(original_title) <= 200),
  poster_url    text check (char_length(poster_url) <= 500),
  release_year  smallint,
  genres        text[] not null default '{}' check (cardinality(genres) <= 10),
  watched_at    timestamptz not null default now(),
  theater       text check (char_length(theater) <= 60),
  seat          text check (char_length(seat) <= 20),
  city          text check (char_length(city) <= 30),
  lat           double precision,
  lon           double precision,
  weather_code  smallint,
  weather_text  text check (char_length(weather_text) <= 30),
  temp_c        real,
  moods         text[] not null default '{}' check (cardinality(moods) <= 10),
  review        text check (char_length(review) <= 300),
  location_name text check (char_length(location_name) <= 80),
  ost           jsonb check (pg_column_size(ost) <= 20000),  -- OST 앨범 정보
  voice_path    text check (char_length(voice_path) <= 200),  -- storage: voice/<user_id>/<ticket_id>.webm
  voice_seconds smallint check (voice_seconds between 0 and 30),
  transcript    text check (char_length(transcript) <= 1000),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists tickets_user_watched_idx on public.tickets (user_id, watched_at desc);
create unique index if not exists tickets_user_barcode_uidx on public.tickets (user_id, barcode) where barcode is not null and barcode <> '';

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tickets_touch on public.tickets;
create trigger tickets_touch before update on public.tickets
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────
-- 3) NFC 링·태그
-- ─────────────────────────────────────────────
create table if not exists public.nfc_tags (
  id          text primary key check (id ~ '^[a-zA-Z0-9_-]{8,40}$'),  -- 태그에 기록되는 랜덤 코드
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  label       text not null default '내 링' check (char_length(label) <= 30),
  kind        text not null default 'ring' check (kind in ('ring', 'tag')),
  last_tap_at timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists nfc_tags_user_idx on public.nfc_tags (user_id);

-- ─────────────────────────────────────────────
-- 4) 사전 알림 신청 (랜딩 페이지 폼)
-- ─────────────────────────────────────────────
create table if not exists public.waitlist (
  id         bigint generated always as identity primary key,
  email      text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  choice     text check (char_length(choice) <= 120),
  agreed     boolean not null check (agreed),
  created_at timestamptz not null default now()
);
create unique index if not exists waitlist_email_uidx on public.waitlist (lower(email));

-- ─────────────────────────────────────────────
-- 4-1) 공장 출고 링 재고 (링 코드 + 포장 카드의 연결 코드)
--      회원은 이 표를 볼 수 없고, claim_ring(링코드, 연결코드)로만 자기 계정에 연결합니다.
-- ─────────────────────────────────────────────
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.ring_inventory (
  id              text primary key check (id ~ '^[a-zA-Z0-9_-]{8,40}$'),
  code_hash       text not null,
  kind            text not null default 'ring' check (kind in ('ring', 'tag')),
  failed_attempts smallint not null default 0,
  claimed_by      uuid references auth.users (id) on delete set null,
  claimed_at      timestamptz,
  created_at      timestamptz not null default now()
);
alter table public.ring_inventory enable row level security;
revoke all on public.ring_inventory from anon, authenticated;

create or replace function public.is_inventory_ring(p_id text)
returns boolean
language sql stable
security definer set search_path = public
as $$ select exists (select 1 from public.ring_inventory where id = p_id) $$;
revoke execute on function public.is_inventory_ring(text) from public;
grant  execute on function public.is_inventory_ring(text) to authenticated;

-- 결과: ok | wrong_code | taken | locked | not_found | login
create or replace function public.claim_ring(p_id text, p_code text)
returns text
language plpgsql
security definer set search_path = public, extensions
as $$
declare
  r   public.ring_inventory;
  uid uuid := auth.uid();
begin
  if uid is null then return 'login'; end if;
  select * into r from public.ring_inventory where id = p_id for update;
  if not found then return 'not_found'; end if;
  if r.claimed_by is not null and r.claimed_by <> uid then return 'taken'; end if;
  if r.claimed_by is null then
    if r.failed_attempts >= 10 then return 'locked'; end if;
    if r.code_hash <> crypt(upper(trim(coalesce(p_code, ''))), r.code_hash) then
      update public.ring_inventory set failed_attempts = failed_attempts + 1 where id = p_id;
      return 'wrong_code';
    end if;
    update public.ring_inventory set claimed_by = uid, claimed_at = now(), failed_attempts = 0 where id = p_id;
  end if;
  insert into public.nfc_tags (id, user_id, label, kind)
  values (p_id, uid, case when r.kind = 'ring' then '내 시네마 링' else '내 티켓 태그' end, r.kind)
  on conflict (id) do nothing;
  return 'ok';
end;
$$;
revoke execute on function public.claim_ring(text, text) from public, anon;
grant  execute on function public.claim_ring(text, text) to authenticated;

-- 링 연결을 해제(또는 탈퇴)하면 재고에서도 풀어 줘서, 연결 코드를 가진 다음 사람이 연결할 수 있게 합니다.
create or replace function public.release_ring()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.ring_inventory set claimed_by = null, claimed_at = null, failed_attempts = 0 where id = old.id;
  return old;
end;
$$;
drop trigger if exists nfc_tags_release on public.nfc_tags;
create trigger nfc_tags_release after delete on public.nfc_tags
  for each row execute function public.release_ring();

-- 관리자 전용: 출고할 링 n개 만들기 (SQL Editor 에서 실행 → 결과를 CSV 로 내려받아 공장에 전달)
--   select ring_id, claim_code, 'https://내도메인/app/#/tap/' || ring_id as nfc_url from public.generate_rings(100);
create or replace function public.generate_rings(n integer, p_kind text default 'ring')
returns table (ring_id text, claim_code text)
language plpgsql
security definer set search_path = public, extensions
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  i integer;
  j integer;
  v_id text;
  v_code text;
begin
  for i in 1..n loop
    v_id := translate(encode(gen_random_bytes(12), 'base64'), '+/', '-_');
    v_code := '';
    for j in 1..8 loop
      v_code := v_code || substr(alphabet, 1 + (get_byte(gen_random_bytes(1), 0) % 32), 1);
    end loop;
    insert into public.ring_inventory (id, code_hash, kind) values (v_id, crypt(v_code, gen_salt('bf')), p_kind);
    ring_id := v_id;
    claim_code := v_code;
    return next;
  end loop;
end;
$$;
revoke execute on function public.generate_rings(integer, text) from public, anon, authenticated;

-- ─────────────────────────────────────────────
-- 5) 행 단위 보안 (본인 데이터만 읽고 쓰기)
-- ─────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.tickets  enable row level security;
alter table public.nfc_tags enable row level security;
alter table public.waitlist enable row level security;

drop policy if exists "profiles: own row" on public.profiles;
create policy "profiles: own row" on public.profiles
  for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "tickets: own rows" on public.tickets;
create policy "tickets: own rows" on public.tickets
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "nfc: own rows" on public.nfc_tags;
drop policy if exists "nfc: read own" on public.nfc_tags;
drop policy if exists "nfc: add own" on public.nfc_tags;
drop policy if exists "nfc: update own" on public.nfc_tags;
drop policy if exists "nfc: delete own" on public.nfc_tags;
create policy "nfc: read own" on public.nfc_tags for select to authenticated using (user_id = auth.uid());
-- 앱에서 직접 만든 태그만 바로 추가 가능. 공장 출고 링(ring_inventory)은 claim_ring 으로만 연결
create policy "nfc: add own" on public.nfc_tags for insert to authenticated
  with check (user_id = auth.uid() and not public.is_inventory_ring(id));
create policy "nfc: update own" on public.nfc_tags for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "nfc: delete own" on public.nfc_tags for delete to authenticated using (user_id = auth.uid());
revoke update on public.nfc_tags from anon, authenticated;
grant  update (label, last_tap_at) on public.nfc_tags to authenticated;

-- 사전 알림: 표에는 직접 접근할 수 없고 join_waitlist 함수로만 추가 (대시보드에서만 조회)
-- 이미 신청한 이메일이어도 똑같이 "완료"를 돌려줘서, 다른 사람의 신청 여부를 알아낼 수 없게 합니다.
drop policy if exists "waitlist: anyone can join" on public.waitlist;
revoke all on public.waitlist from anon, authenticated;

create or replace function public.join_waitlist(p_email text, p_choice text default null)
returns boolean
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.waitlist (email, choice, agreed)
  values (trim(p_email), left(p_choice, 120), true)
  on conflict do nothing;
  return true;
end;
$$;
revoke execute on function public.join_waitlist(text, text) from public;
grant  execute on function public.join_waitlist(text, text) to anon, authenticated;

-- 회원이 직접 바꾸면 안 되는 칸(요금제)은 수정 권한에서 제외
revoke insert, update, delete on public.profiles from anon, authenticated;
grant  update (nickname, theme, marketing_opt_in, taste) on public.profiles to authenticated;

-- ─────────────────────────────────────────────
-- 6) 보이스 메모 저장소 (비공개 버킷, 본인 폴더만)
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('voice', 'voice', false, 2097152,
        array['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/aac', 'audio/wav'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "voice: read own"   on storage.objects;
drop policy if exists "voice: insert own" on storage.objects;
drop policy if exists "voice: update own" on storage.objects;
drop policy if exists "voice: delete own" on storage.objects;

create policy "voice: read own" on storage.objects for select to authenticated
  using (bucket_id = 'voice' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "voice: insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'voice' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "voice: update own" on storage.objects for update to authenticated
  using (bucket_id = 'voice' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "voice: delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'voice' and (storage.foldername(name))[1] = auth.uid()::text);

-- ─────────────────────────────────────────────
-- 7) 촬영지 (운영자 추천 + 회원 제안)
--    운영자: Table Editor 에서 직접 추가(source='curated', status='approved')
--    회원 제안: 앱에서 status='pending' 으로 들어옴 → 확인 후 status 를 'approved' 로 바꾸면 모두에게 표시
-- ─────────────────────────────────────────────
create table if not exists public.filming_locations (
  id           bigint generated always as identity primary key,
  movie_id     integer not null,
  name         text not null check (char_length(name) between 1 and 80),
  note         text check (char_length(note) <= 200),
  lat          double precision check (lat between -90 and 90),
  lon          double precision check (lon between -180 and 180),
  source       text not null default 'user' check (source in ('curated', 'user')),
  status       text not null default 'pending' check (status in ('approved', 'pending', 'rejected')),
  submitted_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists filming_locations_movie_idx on public.filming_locations (movie_id, status);
alter table public.filming_locations enable row level security;

drop policy if exists "locations: read approved" on public.filming_locations;
drop policy if exists "locations: read own suggestions" on public.filming_locations;
drop policy if exists "locations: suggest" on public.filming_locations;
create policy "locations: read approved" on public.filming_locations for select to anon, authenticated
  using (status = 'approved');
create policy "locations: read own suggestions" on public.filming_locations for select to authenticated
  using (submitted_by = (select auth.uid()));
create policy "locations: suggest" on public.filming_locations for insert to authenticated
  with check (submitted_by = (select auth.uid()) and source = 'user' and status = 'pending');
revoke update, delete on public.filming_locations from anon, authenticated;
revoke insert on public.filming_locations from anon;


-- ─────────────────────────────────────────────
-- 8) 보고 싶은 영화 (워치리스트)
-- ─────────────────────────────────────────────
create table if not exists public.watchlist (
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  movie_id       integer not null,
  title          text not null check (char_length(title) between 1 and 120),
  original_title text check (char_length(original_title) <= 200),
  poster_url     text check (char_length(poster_url) <= 500),
  release_year   smallint,
  genres         text[] not null default '{}' check (cardinality(genres) <= 10),
  rating         real,
  created_at     timestamptz not null default now(),
  primary key (user_id, movie_id)
);
alter table public.watchlist enable row level security;
drop policy if exists "watchlist: own rows" on public.watchlist;
create policy "watchlist: own rows" on public.watchlist
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
revoke all on public.watchlist from anon;

-- ─────────────────────────────────────────────
-- 9) 영화관이 아닌 곳(OTT·TV 등)에서 본 영화, 날짜를 정확히 기억 못 하는 기록
-- ─────────────────────────────────────────────
alter table public.tickets add column if not exists watch_type text not null default 'cinema';
alter table public.tickets add column if not exists platform text;
alter table public.tickets add column if not exists date_precision text not null default 'exact';
alter table public.tickets drop constraint if exists tickets_watch_type_check;
alter table public.tickets add constraint tickets_watch_type_check check (watch_type in ('cinema', 'ott', 'other'));
alter table public.tickets drop constraint if exists tickets_platform_check;
alter table public.tickets add constraint tickets_platform_check check (char_length(platform) <= 30);
alter table public.tickets drop constraint if exists tickets_date_precision_check;
alter table public.tickets add constraint tickets_date_precision_check check (date_precision in ('exact', 'day', 'month', 'year', 'unknown'));
