-- School of Financial Fitness — lesson progress table.
--
-- RUN THIS ONCE in the Supabase dashboard: SQL Editor → New query →
-- paste → Run. It creates the table AND its Row Level Security
-- policies, so students can only ever read or write their own rows.
-- (The anon key in supabase-config.js is safe precisely because of
-- these policies — without them, do not ship the key.)
--
-- Requires: Supabase Auth enabled (default in every project).
-- Safe to run twice: IF NOT EXISTS / DROP POLICY IF EXISTS guards it.

create table if not exists public.lesson_progress (
    user_id      uuid        not null references auth.users (id) on delete cascade,
    course_slug  text        not null,
    course_title text        not null default '',
    lesson_id    text        not null,
    lesson_title text        not null default '',
    status       text        not null check (status in ('started', 'completed')),
    updated_at   timestamptz not null default now(),
    primary key (user_id, course_slug, lesson_id)
);

alter table public.lesson_progress enable row level security;

-- A student can see only their own progress rows.
drop policy if exists "Students read own progress" on public.lesson_progress;
create policy "Students read own progress"
    on public.lesson_progress for select
    using (auth.uid() = user_id);

-- A student can save progress only against their own id.
drop policy if exists "Students write own progress" on public.lesson_progress;
create policy "Students write own progress"
    on public.lesson_progress for insert
    with check (auth.uid() = user_id);

-- Same rule for updates (the upsert in progress.js hits this path).
drop policy if exists "Students update own progress" on public.lesson_progress;
create policy "Students update own progress"
    on public.lesson_progress for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Optional cleanup: a student may delete their own rows.
drop policy if exists "Students delete own progress" on public.lesson_progress;
create policy "Students delete own progress"
    on public.lesson_progress for delete
    using (auth.uid() = user_id);

-- Fast "most recent lesson in this course" lookup for the Continue card.
create index if not exists lesson_progress_recent_idx
    on public.lesson_progress (user_id, course_slug, updated_at desc);
