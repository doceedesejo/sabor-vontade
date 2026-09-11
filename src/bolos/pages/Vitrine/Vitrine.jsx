import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProdutoCard from '../../components/ProdutoCard/ProdutoCard'
import ModalProduto from '../../components/ModalProduto/ModalProduto'
import { useBolosCart } from '../../hooks/useBolosCart'
import { categorias } from '../../data/filtros'
import { listarBolosDB } from '../../../services/bolosService'
import './Vitrine.css'

function filtrarPorCategoria(bolos, categoriaId) {
  if (!categoriaId || categoriaId === 'todos') return bolos
  return bolos.filter((b) => b.categorias?.includes(categoriaId))
}

function Vitrine() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos')
  const [boloModal, setBoloModal] = useState(null)
  const [toast, setToast] = useState('')
  const [bolos, setBolos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const { adicionarItem, totalItens, totalValor } = useBolosCart()
  const navigate = useNavigate()

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro(null)
    listarBolosDB()
      .then((data) => { if (ativo) setBolos(data) })
      .catch((e) => { if (ativo) setErro(e.message) })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [])

  const bolosExibidos = filtrarPorCategoria(bolos, categoriaAtiva)

  const handleAdicionar = (bolo, obs = '') => {
    adicionarItem(bolo, obs)
    setToast(`${bolo.nome} adicionado! 🎂`)
    setTimeout(() => setToast(''), 2500)
  }

  const handleVerDetalhes = (bolo) => setBoloModal(bolo)

  const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="vitrine">
      {/* Header da vitrine */}
      <header className="vitrine__header">
        <button
          type="button"
          className="vitrine__voltar"
          onClick={() => navigate('/')}
          aria-label="Voltar para home"
        >
          ←
        </button>
        <div className="vitrine__header-center">
          <p className="vitrine__marca">Doce &amp; Desejo</p>
          <h1 className="vitrine__titulo">Nossos Bolos</h1>
        </div>
        <a
          href="https://www.instagram.com/rosilenepereiramaciel1"
          target="_blank"
          rel="noreferrer"
          className="vitrine__insta"
          aria-label="Instagram"
        >
          📸
        </a>
      </header>

      {/* Filtro de categorias */}
      <nav className="vitrine__categorias" aria-label="Filtrar por categoria">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`vitrine__cat-btn ${categoriaAtiva === cat.id ? 'vitrine__cat-btn--ativo' : ''}`}
            onClick={() => setCategoriaAtiva(cat.id)}
          >
            {cat.nome}
          </button>
        ))}
      </nav>

      {/* Grid de produtos */}
      <main className="vitrine__grid">
        {carregando && (
          <p className="vitrine__vazio">Carregando bolos...</p>
        )}

        {!carregando && erro && (
          <p className="vitrine__vazio">Não foi possível carregar os bolos agora. Tente novamente em instantes.</p>
        )}

        {!carregando && !erro && bolos.length === 0 && (
          <p className="vitrine__vazio">Nenhum bolo disponível.</p>
        )}

        {!carregando && !erro && bolos.length > 0 && bolosExibidos.map((bolo) => (
          <ProdutoCard
            key={bolo.id}
            bolo={bolo}
            onVerDetalhes={handleVerDetalhes}
            onAdicionar={handleAdicionar}
          />
        ))}

        {!carregando && !erro && bolos.length > 0 && bolosExibidos.length === 0 && (
          <p className="vitrine__vazio">Nenhum bolo nesta categoria.</p>
        )}
      </main>

      {/* Aviso de encomenda */}
      <aside className="vitrine__info-encomenda">
        <p>🎂 Quer um bolo personalizado? <strong>Fazemos por encomenda</strong> com prazo mínimo de 1 dia. Entrega a combinar.</p>
      </aside>

      {/* Toast */}
      {toast && (
        <div className="vitrine__toast" role="status">
          {toast}
        </div>
      )}

      {/* Carrinho flutuante */}
      {totalItens > 0 && (
        <button
          type="button"
          className="vitrine__carrinho-float"
          onClick={() => navigate('/bolos/carrinho')}
        >
          <span className="vitrine__carrinho-count">{totalItens}</span>
          🛍️ Ver pedido
          <span className="vitrine__carrinho-valor">{fmt(totalValor)}</span>
        </button>
      )}

      {/* Modal de produto */}
      {boloModal && (
        <ModalProduto
          bolo={boloModal}
          onFechar={() => setBoloModal(null)}
          onAdicionar={handleAdicionar}
        />
      )}
    </div>
  )
}

export default Vitrine
