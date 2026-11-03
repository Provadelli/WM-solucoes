import { useEffect, useState } from 'react'
import { metrics } from '../data/content.js'
import './Metrics.css'

function Counter({ to, delay }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || to === 0) {
      setN(to)
      return
    }
    let raf
    const timer = setTimeout(() => {
      const t0 = performance.now()
      const dur = 1600
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur)
        setN(Math.round(to * (1 - Math.pow(1 - p, 4))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [to, delay])
  return n
}

/** Métricas soltas sobre o vídeo, ligadas por um condutor vertical que se energiza */
export default function Metrics() {
  return (
    <div className="metrics">
      <h2 className="sr-only">Resultados validados em campo</h2>
      <ul className="metrics__list">
        {metrics.map((m, i) => (
          <li key={m.label} className="metric" style={{ '--i': i }}>
            {/* O leitor de tela lê o valor final; a contagem é só visual */}
            <span className="sr-only">
              {m.value}
              {m.suffix} {m.label}
            </span>
            <span className="metric__value" aria-hidden="true">
              <Counter to={m.value} delay={900 + i * 150} />
              <span className="metric__suffix">{m.suffix}</span>
            </span>
            <span className="metric__label" aria-hidden="true">
              {m.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
