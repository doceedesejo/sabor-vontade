import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__brand">
        Doce &amp;
        <span>Desejo</span>
        <small>Bolos Artesanais</small>
      </Link>
      <button className="header__menu" aria-label="Abrir menu" type="button">
        <span aria-hidden="true">☰</span>
      </button>
    </header>
  )
}

export default Header
