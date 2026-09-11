import { useEffect, useState } from 'react'
import { getLinkEncomenda } from '../../services/whatsappBolos'
import './ModalProduto.css'

function urlDaFoto(foto) {
  return typeof foto === 'string' ? foto : foto?.url
}

function ModalProduto({ bolo, onFechar, onAdicionar }) {
  const [fotoAtual, setFotoAtual] = useState(0)
  const [obs, setObs] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => { setFotoAtual(0) }, [bolo])

  if (!bolo) return null

  const fotos = (Array.isArray(bolo.fotos) && bolo.fotos.length > 0
    ? bolo.fotos.map(urlDaFoto)
    : [bolo.fotoUrl]
  ).filter(Boolean)
  const isEncomenda = bolo.categorias.includes('encomenda')

  const irFoto = (idx) => {
    setFotoAtual((idx + fotos.length) % fotos.length)
  }

  const handleAdicionar = () => {
    onAdicionar(bolo, obs)
    onFechar()
  }

  return (
    <div className="modal-produto__overlay" onClick={onFechar}>
      <div
        className="modal-produto__card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={bolo.nome}
      >
        <button className="modal-produto__fechar" type="button" onClick={onFechar} aria-label="Fechar">×</button>

        {/* Galeria de fotos */}
        <div className="modal-produto__galeria">
          <div
            className="modal-produto__foto"
            style={{ backgroundImage: `url(${fotos[fotoAtual]})` }}
            role="img"
            aria-label={`${bolo.nome} — foto ${fotoAtual + 1} de ${fotos.length}`}
          />

          {fotos.length > 1 && (
            <>
              <button
                type="button"
                className="modal-produto__nav modal-produto__nav--prev"
                onClick={() => irFoto(fotoAtual - 1)}
                aria-label="Foto anterior"
              >‹</button>
              <button
                type="button"
                className="modal-produto__nav modal-produto__nav--next"
                onClick={() => irFoto(fotoAtual + 1)}
                aria-label="Próxima foto"
              >›</button>

              {/* Dots */}
              <div className="modal-produto__dots">
                {fotos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`modal-produto__dot ${i === fotoAtual ? 'modal-produto__dot--ativo' : ''}`}
                    onClick={() => setFotoAtual(i)}
                    aria-label={`Foto ${i + 1}`}
                  />
                ))}
              </div>

              {/* Miniaturas */}
              <div className="modal-produto__thumbs">
                {fotos.map((foto, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`modal-produto__thumb ${i === fotoAtual ? 'modal-produto__thumb--ativo' : ''}`}
                    style={{ backgroundImage: `url(${foto})` }}
                    onClick={() => setFotoAtual(i)}
                    aria-label={`Foto ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Link vídeo Instagram */}
        {bolo.video && (
          <div className="modal-produto__video-wrap">
            <a href={bolo.video} target="_blank" rel="noreferrer" className="modal-produto__video-link">
              ▶ Ver vídeo no Instagram
            </a>
          </div>
        )}

        <div className="modal-produto__body">
          {bolo.destaque && <span className="modal-produto__badge">⭐ Destaque</span>}

          <h2 className="modal-produto__nome">{bolo.nome}</h2>
          <p className="modal-produto__desc">{bolo.descricao}</p>

          {bolo.infoExtra && (
            <p className="modal-produto__info-extra">ℹ️ {bolo.infoExtra}</p>
          )}

          <div className="modal-produto__detalhes">
            {bolo.tamanho && (
              <span className="modal-produto__detalhe">Tamanho {bolo.tamanho}</span>
            )}
            <span className="modal-produto__preco">
              {bolo.preco
                ? bolo.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'A combinar'}
            </span>
          </div>

          {!isEncomenda && (
            <div className="modal-produto__obs">
              <label htmlFor="obs-bolo" className="modal-produto__obs-label">
                Observação (opcional)
              </label>
              <input
                id="obs-bolo"
                type="text"
                className="modal-produto__obs-input"
                placeholder="Ex: sem cobertura, retirada própria..."
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                maxLength={100}
              />
            </div>
          )}

          {isEncomenda ? (
            <a
              className="modal-produto__btn modal-produto__btn--whats"
              href={getLinkEncomenda(bolo.nome)}
              target="_blank"
              rel="noreferrer"
            >
              💬 Fazer encomenda pelo WhatsApp
            </a>
          ) : (
            <button className="modal-produto__btn" type="button" onClick={handleAdicionar}>
              + Adicionar ao pedido
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalProduto
