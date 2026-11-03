import { Fragment, useEffect, useRef } from 'react'
import Button from './Button.jsx'
import VideoBackground from './VideoBackground.jsx'
import Metrics from './Metrics.jsx'
import { contact } from '../data/content.js'
import './Hero.css'

// Cada palavra sobe de dentro de uma máscara; "hl" marca o destaque
const title = [
  [['Automação'], ['industrial']],
  [['testada', 'hl'], ['antes'], ['de'], ['chegar']],
  [['à'], ['sua'], ['fábrica']],
]

export default function Hero() {
  const ref = useRef(null)

  // Parallax: --hero vai de 0 a 1 enquanto o hero sai da tela
  useEffect(() => {
    const el = ref.current
    let frame = 0
    const update = () => {
      frame = 0
      const p = Math.min(1, Math.max(0, window.scrollY / el.offsetHeight))
      el.style.setProperty('--hero', p.toFixed(4))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  let w = 0
  return (
    <section id="topo" className="hero" ref={ref} aria-labelledby="hero-title">
      <VideoBackground
        poster="/media/hero-poster.webp"
        sources={[
          { src: '/media/hero.webm', type: 'video/webm' },
          { src: '/media/hero.mp4', type: 'video/mp4' },
        ]}
      />

      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            {title.map((line, l) => (
              <span className="hero__line" key={l}>
                {line.map(([word, cls]) => (
                  <Fragment key={word}>
                    <span className="hero__word">
                      <span className={cls} style={{ '--w': w++ }}>
                        {word}
                      </span>
                    </span>{' '}
                  </Fragment>
                ))}
              </span>
            ))}
          </h1>
          <p className="hero__lead">
            CLP e IHM simulados em gêmeo digital, painéis sob medida e comissionamento sem parar a sua produção.
          </p>
          <div className="hero__actions">
            <Button variant="orange" href={contact.whatsapp} icon="whatsapp">
              Pedir orçamento
            </Button>
            <Button variant="light" href="#servicos" iconAfter="arrow">
              Conhecer os serviços
            </Button>
          </div>
        </div>

        <Metrics />
      </div>
    </section>
  )
}
