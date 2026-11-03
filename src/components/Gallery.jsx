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
        <header className="section-head">
          <h2 id="gallery-title" className="reveal">
            Painéis e projetos entregues
          </h2>
          <p className="reveal" style={{ '--i': 1 }}>
            Toque em uma imagem para ampliar.
          </p>
        </header>

        <div className="reveal" style={{ '--i': 2 }}>
          <Carousel label="Galeria de projetos" options={{ align: 'start', dragFree: true }}>
            {gallery.map((g, i) => {
              const p = photo(g.name)
              return (
                <figure key={g.name} className="gcard">
                  <button type="button" className="gcard__btn" onClick={(e) => open(i, e)}>
                    <img
                      src={p.src}
                      srcSet={p.srcSet}
                      sizes="(max-width: 640px) 78vw, (max-width: 1000px) 44vw, 360px"
                      width={p.width}
                      height={p.height}
                      alt={g.title}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="gcard__zoom" aria-hidden="true">
                      <Icon name="expand" size={18} />
                    </span>
                    <span className="sr-only">Ampliar imagem</span>
                  </button>
                  <figcaption>
                    {g.title}
                  </figcaption>
                </figure>
              )
            })}
          </Carousel>
        </div>
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
              <p>
                {item.title}
              </p>
              <div className="lightbox__nav">
                <button type="button" onClick={() => step(-1)} aria-label="Imagem anterior">
                  <Icon name="prev" size={20} strokeWidth={2.2} />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Próxima imagem">
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
