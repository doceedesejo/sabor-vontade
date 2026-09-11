import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import { CartProvider } from './context/CartProvider'
import { EscolhaProvider } from './context/EscolhaProvider'
import { BolosCartProvider } from './bolos/context/BolosCartProvider'
import './styles/global.css'

// BolosCartProvider fica no topo para que tanto a Home (destaques)
// quanto a Vitrine (/bolos) compartilhem o mesmo carrinho de bolos.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <CartProvider>
          <BolosCartProvider>
            <EscolhaProvider>
              <App />
            </EscolhaProvider>
          </BolosCartProvider>
        </CartProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
