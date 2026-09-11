import { Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import Home from './pages/Home/Home'
import Bolos from './pages/Bolos/Bolos'
import Vitrine from './bolos/pages/Vitrine/Vitrine'
import CarrinhoBolos from './bolos/pages/CarrinhoBolos/CarrinhoBolos'
import Acai from './pages/Acai/Acai'
import AcaiHome from './pages/Acai/AcaiHome'
import Configurador from './acai/pages/Configurador/Configurador'
import CarrinhoAcai from './acai/pages/CarrinhoAcai/CarrinhoAcai'
import Carrinho from './pages/Carrinho/Carrinho'
import Admin from './pages/Admin/Admin'

function App() {
  return (
    <Routes>
      {/* Painel admin — sem Layout do site */}
      <Route path="/admin" element={<Admin />} />

      <Route element={<Layout />}>
        <Route index element={<Home />} />

        {/* Universo Bolos */}
        <Route path="bolos" element={<Bolos />}>
          <Route index element={<Vitrine />} />
          <Route path="carrinho" element={<CarrinhoBolos />} />
        </Route>

        {/* Universo +Ki Açaí */}
        <Route path="acai" element={<Acai />}>
          <Route index element={<AcaiHome />} />
          <Route path="configurador" element={<Configurador />} />
          <Route path="carrinho" element={<CarrinhoAcai />} />
        </Route>

        {/* Carrinho unificado */}
        <Route path="carrinho" element={<Carrinho />} />
      </Route>
    </Routes>
  )
}

export default App
