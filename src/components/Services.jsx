import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import Button from './Button.jsx'
import ServicePreview, { PreviewMedia } from './ServicePreview.jsx'
import useReveal from '../hooks/useReveal.js'
import { photo, servicePillars, whatsappAbout } from '../data/content.js'
import './Services.css'

// Three.js só é baixado quando o modelo 3D é aberto
const Panel3D = lazy(() => import('./Panel3D.jsx'))

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'
const pad = (n) => String(n).padStart(2, '0')

function useCanHover() {
  const [can, setCan] = useState(() => typeof window !== 'undefined' && window.matchMedia(HOVER_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(HOVER_QUERY)
    const on = () => setCan(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return can
}

/** Só monta o conteúdo quando ele chega perto da tela */
function WhenNear({ children }) {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    if (near) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '400px 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [near])
  return near ? children : <div ref={ref} className="p3d-loading" aria-hidden="true" />
}

/** Miniatura do serviço; sem foto, mostra o ícone */
function Thumb({ card }) {
  if (!card.image) {
    return (
      <span className="srow__thumb srow__thumb--icon">
        <Icon name={card.icon} size={22} />
      </span>
    )
  }
  const p = photo(card.image)
  return (
    <span className="srow__thumb">
      <img src={`/img/${card.image}-360.webp`} width={p.width} height={p.height} alt="" loading="lazy" decoding="async" />
    </span>
  )
}

export default function Services() {
  const ref = useReveal()
  const canHover = useCanHover()
  const [active, setActive] = useState(0)
  // serviço expandido (clique/toque); começa com o modelo 3D aberto, se houver
  const [open, setOpen] = useState(() => {
    const i = servicePillars[0].cards.findIndex((c) => c.model3d)
    return i >= 0 ? i : null
  })
  const [hovered, setHovered] = useState(null) // serviço sob o cursor
  const pointer = useRef({ x: 0, y: 0 })
  const tabRefs = useRef([])

  const pillar = servicePillars[active]


  const select = (i, focus) => {
    setActive(i)
    // na área com modelo 3D, já abre o visualizador
    const idx3d = servicePillars[i].cards.findIndex((c) => c.model3d)
    setOpen(idx3d >= 0 ? idx3d : null)
    setHovered(null)
    if (focus) tabRefs.current[i]?.focus()
    // no mobile a lista de áreas rola na horizontal
    tabRefs.current[i]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }

  const onTabKey = (e) => {
    const n = servicePillars.length
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') select((active + 1) % n, true)
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') select((active - 1 + n) % n, true)
    else if (e.key === 'Home') select(0, true)
    else if (e.key === 'End') select(n - 1, true)
    else return
    e.preventDefault()
  }

  const onPointerMove = (e) => {
    pointer.current = { x: e.clientX, y: e.clientY }
  }

  // Foco pelo teclado: ancora a prévia ao lado da linha
  const onRowFocus = (e, i) => {
    if (!canHover || !e.currentTarget.matches(':focus-visible')) return
    const r = e.currentTarget.getBoundingClientRect()
    pointer.current = { x: r.right - 120, y: r.top }
    setHovered(i)
  }

  // o card com modelo 3D não usa a prévia flutuante (o visualizador fica na própria linha)
  const previewCard = hovered !== null && !pillar.cards[hovered].model3d ? pillar.cards[hovered] : null

  return (
    <section id="servicos" className="services on-light" aria-labelledby="services-title" ref={ref}>
      <div className="tech-grid" aria-hidden="true" />
      <div className="container">
        <header className="section-head section-head--split">
          <h2 id="services-title" className="reveal">
            Do diagrama ao <span className="hl">comissionamento</span>
          </h2>
          <p className="reveal" style={{ '--i': 1 }}>
            Projeto, software e campo com a mesma equipe. Escolha uma área para ver os serviços e passe o mouse sobre
            cada um para entender como funciona.
          </p>
        </header>

        <div className="sx reveal" style={{ '--i': 2 }}>
          {/* Áreas de atuação */}
          <div className="sx__nav" role="tablist" aria-label="Áreas de atuação" aria-orientation="vertical" onKeyDown={onTabKey}>
            {servicePillars.map((p, i) => (
              <button
                key={p.id}
                ref={(el) => (tabRefs.current[i] = el)}
                type="button"
                role="tab"
                id={`stab-${p.id}`}
                aria-selected={i === active}
                aria-controls={`spanel-${p.id}`}
                tabIndex={i === active ? 0 : -1}
                className="sx__tab"
                onClick={() => select(i)}
              >
                <span className="sx__tab-icon">
                  <Icon name={p.icon} size={20} />
                </span>
                <span className="sx__tab-text">
                  <span className="sx__tab-name">{p.title}</span>
                  <span className="sx__tab-count">{p.cards.length} serviços</span>
                </span>
                <Icon name="next" size={18} className="sx__tab-arrow" />
              </button>
            ))}
          </div>

          {/* Serviços da área escolhida */}
          <div key={pillar.id} className="sx__panel" role="tabpanel" id={`spanel-${pillar.id}`} aria-labelledby={`stab-${pillar.id}`}>
            <header className="sx__head">
              <h3 className="sx__title">{pillar.title}</h3>
              <p className="sx__summary">{pillar.summary}</p>
            </header>

            <ul className="sx__list" onPointerMove={canHover ? onPointerMove : undefined} onPointerLeave={() => setHovered(null)}>
              {pillar.cards.map((c, i) => {
                const expanded = open === i
                return (
                  <li key={c.name} className="sx__item" style={{ '--d': i }}>
                    <button
                      type="button"
                      className={`srow ${expanded ? 'is-open' : ''}`}
                      aria-expanded={expanded}
                      aria-controls={`srow-${pillar.id}-${i}`}
                      onClick={() => setOpen(expanded ? null : i)}
                      onPointerEnter={canHover ? () => setHovered(i) : undefined}
                      onFocus={(e) => onRowFocus(e, i)}
                      onBlur={() => setHovered(null)}
                    >
                      <span className="srow__num">{pad(i + 1)}</span>
                      <Thumb card={c} />
                      <span className="srow__name">
                        {c.name}
                        {c.model3d && <span className="srow__badge">3D</span>}
                      </span>
                      <span className="srow__detail">{c.detail}</span>
                      <span className="srow__more" aria-hidden="true">
                        <Icon name={expanded ? 'close' : 'arrowUpRight'} size={18} />
                      </span>
                    </button>

                    <div className="srow__body" id={`srow-${pillar.id}-${i}`} hidden={!expanded}>
                      {c.model3d
                        ? expanded && (
                            <WhenNear>
                              <Suspense fallback={<div className="p3d-loading" aria-hidden="true" />}>
                                <Panel3D fallbackCard={c} />
                              </Suspense>
                            </WhenNear>
                          )
                        : !canHover && <PreviewMedia card={c} sizes="90vw" />}
                      <p>{c.text}</p>
                      <ol className="srow__steps">
                        {c.steps.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ol>
                    </div>
                  </li>
                )
              })}
            </ul>

            <footer className="sx__foot">
              <ul className="sx__facts">
                {pillar.facts.map((f) => (
                  <li key={f}>
                    <Icon name="check" size={15} strokeWidth={2.2} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="orange" size="sm" href={whatsappAbout(pillar.title)} iconAfter="arrow">
                Falar com um engenheiro
              </Button>
            </footer>
          </div>
        </div>
      </div>

      {canHover && <ServicePreview card={previewCard} pointer={pointer} />}
    </section>
  )
}
