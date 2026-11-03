import { Children, useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import Icon from './Icon.jsx'
import useReducedMotion from '../hooks/useReducedMotion.js'
import './Carousel.css'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Carrossel infinito e arrastável:
 * - rola sozinho devagar; para no hover, no foco e ao arrastar (com botão de pausa)
 * - arrastar com mouse/toque, setas e teclado (← →)
 * - cards inclinam levemente conforme a velocidade do arraste
 * - slides fora da tela ficam inert (não recebem foco)
 */
export default function Carousel({ label, children, tone = 'dark', className = '' }) {
  const slides = Children.toArray(children)
  const reduced = useReducedMotion()
  const plugins = useRef(
    reduced ? [] : [AutoScroll({ speed: 0.6, startDelay: 600, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true })],
  )
  const [viewportRef, api] = useEmblaCarousel({ loop: true, dragFree: true, align: 'start' }, plugins.current)
  const [selected, setSelected] = useState(0)
  const [inView, setInView] = useState(() => new Set([0, 1, 2, 3]))
  const [paused, setPaused] = useState(reduced)
  const pausedRef = useRef(paused)
  pausedRef.current = paused
  const rootRef = useRef(null)

  const sync = useCallback((a) => {
    setSelected(a.selectedScrollSnap())
    setInView(new Set(a.slidesInView()))
  }, [])

  useEffect(() => {
    if (!api) return
    sync(api)
    api.on('select', sync).on('reInit', sync).on('slidesInView', sync)

    // Inclinação proporcional à velocidade
    const root = rootRef.current
    let last = api.scrollProgress()
    let skew = 0
    let raf = 0
    const onScroll = () => {
      const p = api.scrollProgress()
      let d = p - last
      if (d > 0.5) d -= 1
      if (d < -0.5) d += 1
      last = p
      skew = Math.max(-1, Math.min(1, d * 60))
    }
    const decay = () => {
      skew *= 0.88
      root.style.setProperty('--skew', skew.toFixed(3))
      raf = requestAnimationFrame(decay)
    }
    api.on('scroll', onScroll)
    if (!reduced) decay()

    // O plugin retoma sozinho ao sair o mouse/foco; se o usuário pausou, mantém parado
    const onPlay = () => {
      if (pausedRef.current) queueMicrotask(() => api.plugins().autoScroll?.stop())
    }
    api.on('autoScroll:play', onPlay)

    return () => {
      cancelAnimationFrame(raf)
      api.off('select', sync).off('reInit', sync).off('slidesInView', sync).off('scroll', onScroll).off('autoScroll:play', onPlay)
    }
  }, [api, sync, reduced])

  const togglePlay = () => {
    const auto = api?.plugins().autoScroll
    if (!auto) return
    if (paused) {
      pausedRef.current = false
      setPaused(false)
      auto.play()
    } else {
      pausedRef.current = true
      setPaused(true)
      auto.stop()
    }
  }

  const go = (dir) => {
    if (!api) return
    api.plugins().autoScroll?.stop()
    dir > 0 ? api.scrollNext() : api.scrollPrev()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    }
  }


  return (
    <div
      ref={rootRef}
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
        <p className="carousel__count" aria-live="off">
          <span className="carousel__count-now">{pad(selected + 1)}</span>
          <span className="carousel__count-sep" aria-hidden="true" />
          <span>{pad(slides.length)}</span>
        </p>
        <div className="carousel__progress" aria-hidden="true">
          <span style={{ '--p': (selected + 1) / slides.length }} />
        </div>
        <div className="carousel__arrows">
          {!reduced && (
            <button
              type="button"
              className="carousel__arrow"
              onClick={togglePlay}
              aria-label={paused ? 'Retomar rolagem automática' : 'Pausar rolagem automática'}
            >
              <Icon name={paused ? 'play' : 'pause'} size={18} strokeWidth={2.2} />
            </button>
          )}
          <button type="button" className="carousel__arrow" onClick={() => go(-1)} aria-label="Anterior">
            <Icon name="prev" size={20} strokeWidth={2.2} />
          </button>
          <button type="button" className="carousel__arrow" onClick={() => go(1)} aria-label="Próximo">
            <Icon name="next" size={20} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  )
}
