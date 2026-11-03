import Icon from './Icon.jsx'
import useReveal from '../hooks/useReveal.js'
import { useConsent } from '../lgpd/PrivacyProvider.jsx'
import { contact, logo, nav } from '../data/content.js'
import './Footer.css'

export default function Footer({ base = '' }) {
  const { openPreferences } = useConsent()
  const ref = useReveal()

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    document.querySelector('.header__brand')?.focus({ preventScroll: true })
  }

  return (
    <footer className="footer" ref={ref}>
      <span className="footer__line-wrap reveal" aria-hidden="true">
        <span className="footer__line" />
      </span>

      <div className="container footer__grid">
        <div className="footer__brand reveal">
          <picture>
            <source srcSet={logo.src} type="image/webp" />
            <img src={logo.fallback} alt="WM Soluções em Automação" className="footer__logo" width="114" height="48" loading="lazy" />
          </picture>
          <p className="footer__tagline">
            Comissionamento técnico e integração de sistemas sem paradas no chão de fábrica.
          </p>
          <a className="footer__wa" href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={18} />
            Falar com engenheiro
            <Icon name="arrowUpRight" size={16} />
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>

        <nav aria-label="Rodapé" className="reveal" style={{ '--i': 1 }}>
          <h2 className="footer__title">Navegação</h2>
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={`${base}${n.href}`}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="reveal" style={{ '--i': 2 }}>
          <h2 className="footer__title">Contato</h2>
          <ul>
            <li>
              <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li className="footer__plain">Jaraguá do Sul, SC</li>
          </ul>
        </div>

        <div className="reveal" style={{ '--i': 3 }}>
          <h2 className="footer__title">Privacidade</h2>
          <ul>
            <li>
              <a href="/politica-de-privacidade.html">Política de Privacidade</a>
            </li>
            <li>
              <button type="button" className="footer__linkbtn" onClick={openPreferences}>
                Preferências de cookies
              </button>
            </li>
          </ul>
        </div>
      </div>


      <div className="container footer__legal">
        <p>© {new Date().getFullYear()} WM Soluções em Automação Industrial. Todos os direitos reservados.</p>
        <button type="button" className="footer__top" onClick={toTop}>
          Voltar ao topo
          <span className="footer__top-icon">
            <Icon name="arrowUp" size={16} strokeWidth={2} />
          </span>
        </button>
      </div>
    </footer>
  )
}
