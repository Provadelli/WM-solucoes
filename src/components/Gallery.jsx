import { useEffect, useRef, useState } from 'react'
import Carousel from './Carousel.jsx'
import Icon from './Icon.jsx'
import useReveal from '../hooks/useReveal.js'
import { gallery, photo } from '../data/content.js'
import './Gallery.css'

export default function Gallery() {
  const ref = useReveal()
  const dialogRef = useRef(null)
  const lastTrigger = useRef(null)
  const [current, setCurrent] = useState(null)

  const open = (i, e) => {
    lastTrigger.current = e.currentTarget
    setCurrent(i)
  }
  const close = () => dialogRef.current?.close()
  const step = (d) => setCurrent((c) => (c + d + gallery.length) % gallery.length)

  useEffect(() => {
    const dlg = dialogRef.current
    if (current !== null && dlg && !dlg.open) dlg.showModal()
  }, [current])

  const onKey = (e) => {
    if (e.key === 'ArrowRight') step(1)
    if (e.key === 'ArrowLeft') step(-1)
  }

  const item = current !== null ? gallery[current] : null
  const big = item ? photo(item.name) : null

  return (
    <section id="projetos" className="gallery" aria-labelledby="gallery-title" ref={ref}>
      <div className="container">
        <header className="section-head section-head--split">
          <h2 id="gallery-title" className="reveal">
            Painéis e projetos <span className="hl">entregues</span>
          </h2>
          <p className="reveal" style={{ '--i': 1 }}>
            Arraste para o lado e conheça o que já saiu da nossa bancada para o chão de fábrica.
          </p>
        </header>
      </div>

      <div className="gallery__rail reveal" style={{ '--i': 2 }}>
        <Carousel label="Projetos entregues">
          {gallery.map((g, i) => {
            const p = photo(g.name)
            return (
              <article key={g.name} className="pcard">
                <div className="pcard__media">
                  <img
                    src={p.src}
                    srcSet={p.srcSet}
                    sizes="(max-width: 640px) 82vw, 360px"
                    width={p.width}
                    height={p.height}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                  <span className="pcard__cat">{g.category}</span>
                  <span className="pcard__idx" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="pcard__body">
                  <h3 className="pcard__title">{g.title}</h3>
                  <p className="pcard__text">{g.text}</p>
                  <ul className="pcard__specs">
                    {g.specs.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <button type="button" className="pcard__cta" onClick={(e) => open(i, e)}>
                    Ver em detalhe
                    <span className="sr-only">: {g.title}</span>
                    <Icon name="expand" size={16} />
                  </button>
                </div>
              </article>
            )
          })}
        </Carousel>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={item ? `${item.title}, imagem ${current + 1} de ${gallery.length}` : 'Imagem ampliada'}
        onClose={() => {
          setCurrent(null)
          lastTrigger.current?.focus()
        }}
        onClick={(e) => e.target === dialogRef.current && close()}
        onKeyDown={onKey}
      >
        {item && (
          <div className="lightbox__inner" key={current}>
            <img src={big.src} srcSet={big.srcSet} sizes="90vw" width={big.width} height={big.height} alt={item.title} />
            <div className="lightbox__bar">
              <div className="lightbox__info">
                <span className="lightbox__cat">{item.category}</span>
                <p className="lightbox__title">{item.title}</p>
                <p className="lightbox__text">{item.text}</p>
              </div>
              <div className="lightbox__nav">
                <button type="button" onClick={() => step(-1)} aria-label="Projeto anterior">
                  <Icon name="prev" size={20} strokeWidth={2.2} />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Próximo projeto">
                  <Icon name="next" size={20} strokeWidth={2.2} />
                </button>
                <button type="button" onClick={close} aria-label="Fechar" autoFocus>
                  <Icon name="close" size={20} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
