import { supabase } from './supabase'

// Usa apenas a anon key. Os GRANTs de tabela e as políticas RLS que liberam
// o acesso total estão em supabase/fix-permissions.sql (rodar no SQL Editor).

export async function listarBolosDB() {
  const { data, error } = await supabase
    .from('bolos')
    .select('*, bolos_fotos(id, url, ordem)')
    .eq('disponivel', true)
    .order('ordem', { ascending: true })
  if (error) throw error
  return data.map(normalizar)
}

export async function listarTodosBolosAdmin() {
  const { data, error } = await supabase
    .from('bolos')
    .select('*, bolos_fotos(id, url, ordem)')
    .order('ordem', { ascending: true })
  if (error) throw error
  return data.map(normalizar)
}

export async function salvarBolo(bolo) {
  const payload = {
    id: bolo.id,
    nome: bolo.nome,
    descricao: bolo.descricao,
    preco: bolo.preco,
    tamanho: bolo.tamanho,
    categorias: bolo.categorias ?? [],
    disponivel: bolo.disponivel ?? true,
    destaque: bolo.destaque ?? false,
    info_extra: bolo.infoExtra ?? null,
    video: bolo.video ?? null,
    ordem: bolo.ordem ?? 0,
    atualizado_em: new Date().toISOString(),
  }
  const { error } = await supabase
    .from('bolos')
    .upsert(payload, { onConflict: 'id' })
  if (error) throw error
}

export async function deletarBolo(id) {
  const { error } = await supabase.from('bolos').delete().eq('id', id)
  if (error) throw error
}

export async function toggleDisponivel(id, disponivel) {
  const { error } = await supabase
    .from('bolos')
    .update({ disponivel, atualizado_em: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function uploadFoto(boloId, arquivo) {
  const ext = arquivo.name.split('.').pop()
  const nome = `${boloId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('bolos-fotos')
    .upload(nome, arquivo, { upsert: true })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('bolos-fotos').getPublicUrl(nome)

  const { count } = await supabase
    .from('bolos_fotos')
    .select('*', { count: 'exact', head: true })
    .eq('bolo_id', boloId)

  const { error } = await supabase.from('bolos_fotos').insert({
    bolo_id: boloId,
    url: data.publicUrl,
    ordem: count ?? 0,
  })
  if (error) throw error
  return data.publicUrl
}

export async function deletarFoto(fotoId, url) {
  const path = url.split('/bolos-fotos/')[1]
  if (path) await supabase.storage.from('bolos-fotos').remove([path])
  const { error } = await supabase.from('bolos_fotos').delete().eq('id', fotoId)
  if (error) throw error
}

function normalizar(row) {
  const fotos = (row.bolos_fotos ?? [])
    .sort((a, b) => a.ordem - b.ordem)
    .map((f) => f.url)
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    preco: row.preco ? Number(row.preco) : null,
    tamanho: row.tamanho,
    categorias: row.categorias ?? [],
    disponivel: row.disponivel,
    destaque: row.destaque,
    infoExtra: row.info_extra,
    video: row.video,
    ordem: row.ordem,
    fotos: fotos.length > 0 ? fotos : [],
    fotoUrl: fotos[0] ?? null,
  }
}
