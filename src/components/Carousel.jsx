import { Children, useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Icon from './Icon.jsx'
import './Carousel.css'

/**
 * Carrossel acessível (sem autoplay):
 * - arrastar, setas, indicadores e teclado (← →)
 * - slides fora da tela ficam inert (não recebem foco)
 * - tone: 'dark' | 'light' muda as cores dos controles
 */
export default function Carousel({ label, children, options, tone = 'dark', className = '' }) {
  const slides = Children.toArray(children)
  const [viewportRef, api] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', ...options })
  const [selected, setSelected] = useState(0)
  const [snaps, setSnaps] = useState([])
  const [inView, setInView] = useState(() => new Set([0, 1, 2]))
  const [edges, setEdges] = useState({ prev: false, next: true })

  const sync = useCallback((a) => {
    setSelected(a.selectedScrollSnap())
    setSnaps(a.scrollSnapList())
    setEdges({ prev: a.canScrollPrev(), next: a.canScrollNext() })
    setInView(new Set(a.slidesInView()))
  }, [])

  useEffect(() => {
    if (!api) return
    sync(api)
    api.on('select', sync).on('reInit', sync).on('slidesInView', sync)
    return () => {
      api.off('select', sync).off('reInit', sync).off('slidesInView', sync)
    }
  }, [api, sync])

  const onKeyDown = (e) => {
    if (!api) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      api.scrollPrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      api.scrollNext()
    }
  }

  return (
    <div
      className={`carousel carousel--${tone} ${className}`}
      role="region"
      aria-roledescription="carrossel"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <div className="carousel__viewport" ref={viewportRef}>
        <div className="carousel__track">
          {slides.map((slide, i) => (
            <div
              key={slide.key ?? i}
              className={`carousel__slide ${inView.has(i) ? 'is-in-view' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${slides.length}`}
              {...(!inView.has(i) && { inert: '' })}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="carousel__controls">
        <div className="carousel__dots">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`carousel__dot ${i === selected ? 'is-active' : ''}`}
              aria-label={`Ir para o grupo ${i + 1} de ${snaps.length}`}
              aria-current={i === selected ? 'true' : undefined}
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>
        <div className="carousel__arrows">
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => api?.scrollPrev()}
            disabled={!edges.prev}
            aria-label="Anterior"
          >
            <Icon name="prev" size={20} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => api?.scrollNext()}
            disabled={!edges.next}
            aria-label="Próximo"
          >
            <Icon name="next" size={20} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  )
}
