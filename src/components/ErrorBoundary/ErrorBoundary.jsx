import { Component } from 'react'

// Sem isso, qualquer exceção não tratada durante o render (ex.: um dado
// inesperado vindo do Supabase) derruba a árvore React inteira e deixa a
// tela em branco/preta, sem nenhuma mensagem — foi o que aconteceu em
// /bolos. Com o boundary, o usuário vê um aviso e consegue recarregar.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { comErro: false }
  }

  static getDerivedStateFromError() {
    return { comErro: true }
  }

  componentDidCatch(error, info) {
    console.error('Erro não tratado na interface:', error, info)
  }

  render() {
    if (this.state.comErro) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            padding: '32px 20px',
            background: '#0b060b',
            color: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
          }}
        >
          <div>
            <p style={{ fontSize: 40, margin: '0 0 12px' }}>😕</p>
            <h1 style={{ fontSize: 18, margin: '0 0 8px' }}>Algo deu errado</h1>
            <p style={{ fontSize: 13, color: '#9a7a80', margin: '0 0 20px' }}>
              Não conseguimos carregar esta página agora. Tente novamente.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                border: 0,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #d62f5b, #f14b71)',
                color: 'white',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Recarregar página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
