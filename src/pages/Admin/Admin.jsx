import { useEffect, useRef, useState } from 'react'
import {
  deletarBolo,
  deletarFoto,
  listarTodosBolosAdmin,
  salvarBolo,
  toggleDisponivel,
  uploadFoto,
} from '../../services/bolosService'
import './Admin.css'

const SENHA_ADMIN = 'docedesejo2025'

const CATEGORIAS_OPCOES = [
  { id: 'bolo-inteiro', nome: 'Bolo Inteiro' },
  { id: 'encomenda', nome: 'Encomenda' },
  { id: 'especial-do-dia', nome: 'Especial do Dia' },
]

const BOLO_VAZIO = {
  id: '',
  nome: '',
  descricao: '',
  preco: '',
  tamanho: 'M',
  categorias: ['bolo-inteiro'],
  disponivel: true,
  destaque: false,
  infoExtra: '',
  video: '',
  ordem: 0,
  fotos: [],
}

function fmt(v) {
  return v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'A combinar'
}

function slugify(nome) {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false)
  const [senha, setSenha] = useState('')
  const [erroSenha, setErroSenha] = useState(false)

  const [bolos, setBolos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [editando, setEditando] = useState(null) // bolo em edição
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const inputFotoRef = useRef(null)

  // ── Autenticação simples ─────────────────────────────────────────
  const handleLogin = () => {
    if (senha === SENHA_ADMIN) {
      setAutenticado(true)
      carregar()
    } else {
      setErroSenha(true)
    }
  }

  // ── Carregar bolos ───────────────────────────────────────────────
  const carregar = async () => {
    setCarregando(true)
    try {
      const data = await listarTodosBolosAdmin()
      setBolos(data)
    } catch (e) {
      setMsg('Erro ao carregar: ' + e.message)
    } finally {
      setCarregando(false)
    }
  }

  // ── Salvar bolo ──────────────────────────────────────────────────
  const handleSalvar = async () => {
    if (!editando.nome) { setMsg('Nome obrigatório'); return }

    setSalvando(true)
    try {
      const bolo = {
        ...editando,
        id: editando.id || slugify(editando.nome),
        preco: editando.preco ? Number(editando.preco) : null,
      }
      await salvarBolo(bolo)
      setMsg('✅ Salvo com sucesso!')
      setEditando(null)
      await carregar()
    } catch (e) {
      setMsg('Erro ao salvar: ' + e.message)
    } finally {
      setSalvando(false)
    }
  }

  // ── Upload de foto ───────────────────────────────────────────────
  const handleUploadFoto = async (e) => {
    const arquivos = Array.from(e.target.files)
    if (!arquivos.length || !editando?.id) return

    setUploading(true)
    try {
      for (const arquivo of arquivos) {
        const url = await uploadFoto(editando.id, arquivo)
        setEditando((prev) => ({
          ...prev,
          fotos: [...(prev.fotos ?? []), url],
        }))
      }
      setMsg(`✅ ${arquivos.length} foto(s) enviada(s)`)
    } catch (e) {
      setMsg('Erro no upload: ' + e.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  // ── Remover foto ─────────────────────────────────────────────────
  const handleDeletarFoto = async (foto) => {
    if (!confirm('Remover esta foto?')) return
    try {
      // foto pode ser string (URL) ou objeto {id, url}
      const id = foto.id
      const url = foto.url ?? foto
      if (id) await deletarFoto(id, url)
      setEditando((prev) => ({
        ...prev,
        fotos: prev.fotos.filter((f) => (f.url ?? f) !== (url)),
      }))
      setMsg('✅ Foto removida')
      await carregar()
    } catch (e) {
      setMsg('Erro ao remover foto: ' + e.message)
    }
  }

  // ── Toggle disponível ─────────────────────────────────────────────
  const handleToggle = async (bolo) => {
    try {
      await toggleDisponivel(bolo.id, !bolo.disponivel)
      await carregar()
    } catch (e) {
      setMsg('Erro: ' + e.message)
    }
  }

  // ── Deletar bolo ──────────────────────────────────────────────────
  const handleDeletar = async (bolo) => {
    if (!confirm(`Deletar "${bolo.nome}"? Esta ação não pode ser desfeita.`)) return
    try {
      await deletarBolo(bolo.id)
      setMsg('✅ Bolo removido')
      await carregar()
    } catch (e) {
      setMsg('Erro: ' + e.message)
    }
  }

  // ── Limpar msg após 4s ────────────────────────────────────────────
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(''), 4000)
    return () => clearTimeout(t)
  }, [msg])

  // ── LOGIN ─────────────────────────────────────────────────────────
  if (!autenticado) {
    return (
      <div className="admin-login">
        <div className="admin-login__card">
          <h1>🎂 Painel Admin</h1>
          <p>Doce &amp; Desejo</p>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => { setSenha(e.target.value); setErroSenha(false) }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className={erroSenha ? 'erro' : ''}
          />
          {erroSenha && <span className="admin-login__erro">Senha incorreta</span>}
          <button onClick={handleLogin}>Entrar</button>
        </div>
      </div>
    )
  }

  // ── PAINEL PRINCIPAL ──────────────────────────────────────────────
  return (
    <div className="admin">
      <header className="admin__header">
        <div>
          <h1>🎂 Painel Admin</h1>
          <span>Doce &amp; Desejo</span>
        </div>
        <button className="admin__btn admin__btn--novo" onClick={() => setEditando({ ...BOLO_VAZIO })}>
          + Novo bolo
        </button>
      </header>

      {msg && <div className="admin__msg">{msg}</div>}

      {carregando ? (
        <div className="admin__loading">Carregando...</div>
      ) : (
        <div className="admin__lista">
          {bolos.length === 0 && (
            <div className="admin__vazio">
              Nenhum bolo cadastrado ainda.
              <br />
              Clique em "+ Novo bolo" para começar.
            </div>
          )}
          {bolos.map((bolo) => (
            <div key={bolo.id} className={`admin__item ${!bolo.disponivel ? 'admin__item--inativo' : ''}`}>
              {/* Foto miniatura */}
              <div
                className="admin__item-foto"
                style={{
                  backgroundImage: bolo.fotos?.[0] ? `url(${bolo.fotos[0]})` : 'none',
                }}
              >
                {!bolo.fotos?.[0] && <span>📷</span>}
                {bolo.fotos?.length > 1 && (
                  <span className="admin__item-foto-count">{bolo.fotos.length}</span>
                )}
              </div>

              <div className="admin__item-info">
                <b>{bolo.nome}</b>
                <span>{bolo.preco ? fmt(bolo.preco) : 'A combinar'} · Tam. {bolo.tamanho ?? '-'}</span>
                <span className="admin__item-cats">
                  {bolo.categorias?.join(', ')}
                </span>
              </div>

              <div className="admin__item-acoes">
                <button
                  className={`admin__toggle ${bolo.disponivel ? 'admin__toggle--on' : 'admin__toggle--off'}`}
                  onClick={() => handleToggle(bolo)}
                  title={bolo.disponivel ? 'Clique para ocultar' : 'Clique para exibir'}
                >
                  {bolo.disponivel ? '✅ Visível' : '🚫 Oculto'}
                </button>
                <button className="admin__btn admin__btn--editar" onClick={() => setEditando({ ...bolo })}>
                  ✏️ Editar
                </button>
                <button className="admin__btn admin__btn--deletar" onClick={() => handleDeletar(bolo)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL DE EDIÇÃO ── */}
      {editando && (
        <div className="admin-modal__overlay" onClick={() => setEditando(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{editando.id ? `Editando: ${editando.nome}` : 'Novo bolo'}</h2>
              <button onClick={() => setEditando(null)}>×</button>
            </div>

            <div className="admin-modal__body">
              {/* Nome */}
              <label>Nome *</label>
              <input
                value={editando.nome}
                onChange={(e) => setEditando((p) => ({ ...p, nome: e.target.value }))}
                placeholder="Ex: Bolo de Paçoca"
              />

              {/* Descrição */}
              <label>Descrição</label>
              <textarea
                value={editando.descricao ?? ''}
                onChange={(e) => setEditando((p) => ({ ...p, descricao: e.target.value }))}
                rows={3}
                placeholder="Descreva o bolo..."
              />

              {/* Preço e Tamanho */}
              <div className="admin-modal__row">
                <div>
                  <label>Preço (R$)</label>
                  <input
                    type="number"
                    value={editando.preco ?? ''}
                    onChange={(e) => setEditando((p) => ({ ...p, preco: e.target.value }))}
                    placeholder="35.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label>Tamanho</label>
                  <select
                    value={editando.tamanho ?? 'M'}
                    onChange={(e) => setEditando((p) => ({ ...p, tamanho: e.target.value }))}
                  >
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                  </select>
                </div>
              </div>

              {/* Categorias */}
              <label>Categorias</label>
              <div className="admin-modal__cats">
                {CATEGORIAS_OPCOES.map((cat) => (
                  <label key={cat.id} className="admin-modal__cat-check">
                    <input
                      type="checkbox"
                      checked={editando.categorias?.includes(cat.id) ?? false}
                      onChange={(e) => {
                        const cats = editando.categorias ?? []
                        setEditando((p) => ({
                          ...p,
                          categorias: e.target.checked
                            ? [...cats, cat.id]
                            : cats.filter((c) => c !== cat.id),
                        }))
                      }}
                    />
                    {cat.nome}
                  </label>
                ))}
              </div>

              {/* Switches */}
              <div className="admin-modal__switches">
                <label className="admin-modal__switch">
                  <input
                    type="checkbox"
                    checked={editando.disponivel ?? true}
                    onChange={(e) => setEditando((p) => ({ ...p, disponivel: e.target.checked }))}
                  />
                  Visível no site
                </label>
                <label className="admin-modal__switch">
                  <input
                    type="checkbox"
                    checked={editando.destaque ?? false}
                    onChange={(e) => setEditando((p) => ({ ...p, destaque: e.target.checked }))}
                  />
                  Destaque na Home
                </label>
              </div>

              {/* Info extra */}
              <label>Info extra (para encomenda)</label>
              <input
                value={editando.infoExtra ?? ''}
                onChange={(e) => setEditando((p) => ({ ...p, infoExtra: e.target.value }))}
                placeholder="Ex: Prazo mínimo 1 dia..."
              />

              {/* Ordem */}
              <label>Ordem de exibição</label>
              <input
                type="number"
                value={editando.ordem ?? 0}
                onChange={(e) => setEditando((p) => ({ ...p, ordem: Number(e.target.value) }))}
              />

              {/* ── FOTOS ── */}
              <label>Fotos</label>

              {/* Só mostra upload se o bolo já foi salvo (tem ID) */}
              {editando.id ? (
                <>
                  <div className="admin-modal__fotos">
                    {(editando.fotos ?? []).map((foto, i) => {
                      const url = typeof foto === 'string' ? foto : foto.url
                      const id = foto.id
                      return (
                        <div key={i} className="admin-modal__foto-thumb">
                          <img src={url} alt={`Foto ${i + 1}`} />
                          <button
                            type="button"
                            className="admin-modal__foto-del"
                            onClick={() => handleDeletarFoto(foto)}
                            title="Remover foto"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}

                    <button
                      type="button"
                      className="admin-modal__foto-add"
                      onClick={() => inputFotoRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Enviando...' : '+ Foto'}
                    </button>
                  </div>

                  <input
                    ref={inputFotoRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleUploadFoto}
                  />
                  <p className="admin-modal__hint">
                    Recomendado: fotos quadradas (1:1), mínimo 800×800px
                  </p>
                </>
              ) : (
                <p className="admin-modal__hint">
                  💡 Salve o bolo primeiro para depois adicionar fotos.
                </p>
              )}
            </div>

            <div className="admin-modal__footer">
              <button className="admin__btn" onClick={() => setEditando(null)}>
                Cancelar
              </button>
              <button
                className="admin__btn admin__btn--salvar"
                onClick={handleSalvar}
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : '💾 Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
