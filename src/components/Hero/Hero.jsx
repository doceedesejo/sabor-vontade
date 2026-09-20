import { Link } from 'react-router-dom'
import heroImage from '../../assets/images/hero-premium.png'
import './Hero.css'

const INSTAGRAM = 'https://www.instagram.com/rosilenepereiramaciel1'

function Hero({ onVerOpcoes }) {
  return (
    <section className="hero" id="home">

      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${heroImage})` }}
        role="img"
        aria-label="Bolo de chocolate com morango e açaí"
      />

      <div className="hero__overlay" aria-hidden="true" />

      <header className="hero__header">
        <Link to="/" className="hero__brand">
          Doce &amp;
          <span>Desejo</span>
          <small>Bolos Artesanais</small>
        </Link>
        <button className="hero__menu" aria-label="Abrir menu" type="button">
          <span aria-hidden="true">☰</span>
        </button>
      </header>

      <div className="hero__copy">
        <p className="hero__eyebrow">Bolos artesanais · Açaí premium</p>
        <h1 className="hero__title">
          Seu momento <b>mais gostoso</b> começa aqui.
        </h1>
        <p className="hero__subtitle">
          Bolos artesanais e açaí do jeito que você ama. Feitos para
          transformar sua vontade em momentos inesquecíveis.
        </p>
        <div className="hero__actions">
          <a
            className="btn btn--primary"
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
          >
            📸 Instagram
          </a>
        </div>
      </div>

    </section>
  )
}

export default Hero
