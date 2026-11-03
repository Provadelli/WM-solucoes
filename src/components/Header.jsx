import { useEffect, useRef, useState } from 'react'
import Button from './Button.jsx'
import useScrollProgress from '../hooks/useScrollProgress.js'
import { contact, logo, nav } from '../data/content.js'
import './Header.css'

/** base: '' na home, '/' nas outras páginas (para os links de âncora) */
export default function Header({ base = '' }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef(null)
  const toggleRef = useRef(null)
  useScrollProgress(headerRef, '--page', 'page')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menu mobile: trava a rolagem, isola o resto da página e fecha com Esc
  useEffect(() => {
    const main = document.getElementById('conteudo')
    const footer = document.querySelector('footer')
    document.body.style.overflow = open ? 'hidden' : ''
    ;[main, footer].forEach((el) => el && (el.inert = open))
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header ref={headerRef} className={`header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container header__bar">
        <a href={`${base}#topo`} className="header__brand">
          <picture>
            <source srcSet={logo.src} type="image/webp" />
            <img src={logo.fallback} alt="WM Soluções em Automação, página inicial" width="114" height="48" />
          </picture>
        </a>

        <nav id="menu" className="header__nav" aria-label="Principal">
          <ul>
            {nav.map((item, i) => (
              <li key={item.href} style={{ '--i': i }}>
                <a href={`${base}${item.href}`} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button variant="orange" size="sm" href={contact.whatsapp} icon="whatsapp">
            Falar com engenheiro
          </Button>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="header__toggle-bars" aria-hidden="true" />
        </button>
      </div>
      <div className="header__progress" aria-hidden="true" />
    </header>
  )
}
