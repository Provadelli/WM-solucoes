import { useConsent } from '../lgpd/PrivacyProvider.jsx'
import { contact, logo, nav } from '../data/content.js'
import './Footer.css'

export default function Footer({ base = '' }) {
  const { openPreferences } = useConsent()
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <picture>
            <source srcSet={logo.src} type="image/webp" />
            <img src={logo.fallback} alt="WM Soluções em Automação" className="footer__logo" width="114" height="48" loading="lazy" />
          </picture>
          <p className="footer__tagline">
            Comissionamento técnico e integração de sistemas sem paradas no chão de fábrica.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="footer__title">Navegação</h2>
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={`${base}${n.href}`}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="footer__title">Contato</h2>
          <ul>
            <li>
              <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>Jaraguá do Sul, SC</li>
          </ul>
        </div>

        <div>
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
      </div>
    </footer>
  )
}
