-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. PROFILES (Syncs with Auth)
-- ==========================================
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- ==========================================
-- 2. BOOKMARKS
-- ==========================================
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('verse', 'hadith', 'dua', 'resource')),
  title text not null,
  description text,
  link text not null, -- Internal route link
  metadata jsonb default '{}'::jsonb, -- Store specific IDs like { surah: 1, ayah: 5 }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.bookmarks enable row level security;
create policy "Users can view own bookmarks" on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users can insert own bookmarks" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users can update own bookmarks" on public.bookmarks for update using (auth.uid() = user_id);
create policy "Users can delete own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id);

-- ==========================================
-- 3. PERSONAL NOTES
-- ==========================================
create table public.notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  content text,
  reference_link text, -- If attached to a specific verse/page
  color text default 'default',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.notes enable row level security;
create policy "Users can crud own notes" on public.notes for all using (auth.uid() = user_id);

-- ==========================================
-- 4. KHATAM TRACKING
-- ==========================================
create table public.khatam_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  session_name text default 'My Khatam',
  completed_juz integer[] default '{}', -- Array of completed Juz numbers (1-30)
  current_juz integer default 1,
  start_date timestamp with time zone,
  target_date timestamp with time zone,
  is_completed boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.khatam_progress enable row level security;
create policy "Users can crud own khatam" on public.khatam_progress for all using (auth.uid() = user_id);

-- ==========================================
-- 5. PRAYER LOGS
-- ==========================================
create table public.prayer_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  fajr_status text default 'none', -- none, prayed, late, qaza
  dhuhr_status text default 'none',
  asr_status text default 'none',
  maghrib_status text default 'none',
  isha_status text default 'none',
  sunnah_stats jsonb default '{}'::jsonb, -- Store sunnahs prayer counts
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date) -- One log per day per user
);

-- RLS
alter table public.prayer_logs enable row level security;
create policy "Users can crud own prayer logs" on public.prayer_logs for all using (auth.uid() = user_id);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Handle new user signup -> create profile
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
