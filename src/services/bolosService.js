import { supabase } from './supabase'
import { supabaseAdmin } from './supabaseAdmin'

// ── LEITURA (site público) ──────────────────────────────────────────────────

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
  const { data, error } = await supabaseAdmin
    .from('bolos')
    .select('*, bolos_fotos(id, url, ordem)')
    .order('ordem', { ascending: true })

  if (error) throw error
  return data.map(normalizar)
}

// ── ESCRITA (painel admin) ──────────────────────────────────────────────────

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

  const { error } = await supabaseAdmin
    .from('bolos')
    .upsert(payload, { onConflict: 'id' })

  if (error) throw error
}

export async function deletarBolo(id) {
  const { error } = await supabaseAdmin.from('bolos').delete().eq('id', id)
  if (error) throw error
}

export async function toggleDisponivel(id, disponivel) {
  const { error } = await supabaseAdmin
    .from('bolos')
    .update({ disponivel, atualizado_em: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

// ── FOTOS ───────────────────────────────────────────────────────────────────

export async function uploadFoto(boloId, arquivo) {
  const ext = arquivo.name.split('.').pop()
  const nome = `${boloId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('bolos-fotos')
    .upload(nome, arquivo, { upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabaseAdmin.storage.from('bolos-fotos').getPublicUrl(nome)

  const ordem = await contarFotos(boloId)

  const { error } = await supabaseAdmin.from('bolos_fotos').insert({
    bolo_id: boloId,
    url: data.publicUrl,
    ordem,
  })

  if (error) throw error
  return data.publicUrl
}

export async function deletarFoto(fotoId, url) {
  // Remover do storage
  const path = url.split('/bolos-fotos/')[1]
  if (path) {
    await supabaseAdmin.storage.from('bolos-fotos').remove([path])
  }
  // Remover do banco
  const { error } = await supabaseAdmin.from('bolos_fotos').delete().eq('id', fotoId)
  if (error) throw error
}

async function contarFotos(boloId) {
  const { count } = await supabaseAdmin
    .from('bolos_fotos')
    .select('*', { count: 'exact', head: true })
    .eq('bolo_id', boloId)
  return count ?? 0
}

// ── SEED (popular banco com dados atuais) ───────────────────────────────────

export async function popularBancoDeDados(bolos) {
  for (const bolo of bolos) {
    await salvarBolo({ ...bolo, infoExtra: bolo.infoExtra })
    for (let i = 0; i < (bolo.fotos?.length ?? 0); i++) {
      const url = bolo.fotos[i]
      if (typeof url === 'string' && url.startsWith('http')) {
        await supabaseAdmin.from('bolos_fotos').insert({
          bolo_id: bolo.id,
          url,
          ordem: i,
        })
      }
    }
  }
}

// ── NORMALIZAÇÃO ─────────────────────────────────────────────────────────────

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
    fotos: fotos.length > 0 ? fotos : null,
    // manter compatibilidade com fotoUrl usado em alguns lugares
    fotoUrl: fotos[0] ?? null,
  }
}
