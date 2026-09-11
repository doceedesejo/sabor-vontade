-- ============================================================================
-- FIX: "permission denied for table bolos" (Postgres 42501)
-- ============================================================================
-- Causa: os GRANTs padrao do PostgREST foram removidos das tabelas `bolos` e
-- `bolos_fotos`. Sem GRANT no nivel do Postgres, nenhuma policy de RLS e sequer
-- avaliada -- o role `anon` (e ate o `service_role`) recebe 42501.
--
-- Rode este script inteiro no Supabase Dashboard > SQL Editor.
-- E idempotente: pode rodar quantas vezes precisar.
-- ============================================================================

-- 1. Acesso ao schema
grant usage on schema public to anon, authenticated, service_role;

-- 2. GRANTs de tabela (o que faltava)
grant select, insert, update, delete on public.bolos        to anon, authenticated, service_role;
grant select, insert, update, delete on public.bolos_fotos  to anon, authenticated, service_role;

-- 3. Sequences (necessario p/ colunas identity/serial, ex. bolos_fotos.id)
grant usage, select on all sequences in schema public to anon, authenticated, service_role;

-- 4. Default privileges: tabelas/sequences futuras ja nascem acessiveis
alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated, service_role;

-- 5. RLS + policies permissivas
--    O painel /admin e protegido por senha no client e opera com a anon key,
--    entao o acesso total do anon e intencional.
alter table public.bolos       enable row level security;
alter table public.bolos_fotos enable row level security;

drop policy if exists "acesso total bolos"       on public.bolos;
drop policy if exists "acesso total bolos_fotos" on public.bolos_fotos;

create policy "acesso total bolos"
  on public.bolos for all
  to anon, authenticated
  using (true) with check (true);

create policy "acesso total bolos_fotos"
  on public.bolos_fotos for all
  to anon, authenticated
  using (true) with check (true);

-- 6. Storage: bucket publico + policies para upload/remocao das fotos
insert into storage.buckets (id, name, public)
values ('bolos-fotos', 'bolos-fotos', true)
on conflict (id) do update set public = true;

drop policy if exists "bolos-fotos leitura"  on storage.objects;
drop policy if exists "bolos-fotos escrita"  on storage.objects;
drop policy if exists "bolos-fotos remocao"  on storage.objects;

create policy "bolos-fotos leitura"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'bolos-fotos');

create policy "bolos-fotos escrita"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'bolos-fotos');

create policy "bolos-fotos remocao"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'bolos-fotos');

-- 7. Recarrega o schema cache do PostgREST
notify pgrst, 'reload schema';
