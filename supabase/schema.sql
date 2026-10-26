create table if not exists public.user_workspaces (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_workspaces enable row level security;

create policy "Users can read their own workspace"
  on public.user_workspaces for select
  using (auth.uid() = user_id);

create policy "Users can create their own workspace"
  on public.user_workspaces for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workspace"
  on public.user_workspaces for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own workspace"
  on public.user_workspaces for delete
  using (auth.uid() = user_id);