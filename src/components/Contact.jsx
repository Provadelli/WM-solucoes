import { useRef, useState } from 'react'
import Button from './Button.jsx'
import Icon from './Icon.jsx'
import useReveal from '../hooks/useReveal.js'
import { contact } from '../data/content.js'
import './Contact.css'

const channels = [
  { icon: 'phone', label: 'Telefone e WhatsApp', value: contact.phoneDisplay, href: contact.phoneHref, copy: '+55 47 99905-9574' },
  { icon: 'mail', label: 'E-mail', value: contact.email, href: `mailto:${contact.email}`, copy: contact.email },
  { icon: 'pin', label: 'Atendimento', value: 'Jaraguá do Sul, SC. Atendemos todo o Brasil.' },
]

function CopyButton({ text, label }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 1800)
    } catch {
      /* sem permissão de área de transferência: o link continua disponível */
    }
  }
  return (
    <button type="button" className={`ccard__copy ${done ? 'is-done' : ''}`} onClick={copy}>
      <Icon name={done ? 'check' : 'copy'} size={16} strokeWidth={2} />
      <span className="ccard__copy-label" aria-live="polite">
        {done ? 'Copiado' : 'Copiar'}
      </span>
      <span className="sr-only"> {label}</span>
    </button>
  )
}

export default function Contact() {
  const ref = useReveal()
  const glowRef = useRef(null)

  // Brilho que acompanha o mouse no fundo da seção
  const onPointerMove = (e) => {
    const el = glowRef.current
    if (!el || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    el.style.setProperty('--gx', `${e.clientX - r.left}px`)
    el.style.setProperty('--gy', `${e.clientY - r.top}px`)
  }

  return (
    <section id="contato" className="contact" aria-labelledby="contact-title" ref={ref} onPointerMove={onPointerMove}>
      <div className="tech-grid" aria-hidden="true" />
      <div className="contact__glow" ref={glowRef} aria-hidden="true" />

      <div className="container contact__grid">
        <div className="contact__copy">
          <h2 id="contact-title" className="reveal">
            Previsibilidade na sua <span className="hl">produção</span>
          </h2>
          <p className="contact__lead reveal" style={{ '--i': 1 }}>
            Mande o problema ou o diagrama da sua máquina. Um engenheiro responde com prazo e próximos passos.
          </p>
          <div className="contact__actions reveal" style={{ '--i': 2 }}>
            <Button variant="orange" href={contact.whatsapp} icon="whatsapp">
              Falar com engenheiro no WhatsApp
            </Button>
            <Button variant="light" href={`mailto:${contact.email}`} icon="mail">
              Enviar e-mail
            </Button>
          </div>
        </div>

        <ul className="contact__list">
          {/* Condutor que liga os canais, desenhado ao entrar na tela */}
          <li className="contact__wire reveal" aria-hidden="true">
            <svg viewBox="0 0 2 100" preserveAspectRatio="none">
              <path d="M1 0V100" pathLength="1" />
            </svg>
          </li>
          {channels.map((c, i) => (
            <li key={c.label} className="ccard reveal" style={{ '--i': i + 1 }}>
              <span className="ccard__icon">
                <Icon name={c.icon} size={22} />
              </span>
              <span className="ccard__text">
                <span className="ccard__label">{c.label}</span>
                {c.href ? (
                  <a className="ccard__value" href={c.href}>
                    {c.value}
                  </a>
                ) : (
                  <span className="ccard__value">{c.value}</span>
                )}
              </span>
              {c.copy && <CopyButton text={c.copy} label={c.label} />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
