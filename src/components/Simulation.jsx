import { lazy, Suspense } from 'react'
import useReveal from '../hooks/useReveal.js'
import './Simulation.css'

// Carregado sob demanda para aliviar o carregamento inicial
const PlcSimulator = lazy(() => import('./PlcSimulator.jsx'))

export default function Simulation() {
  const ref = useReveal()
  return (
    <section id="simulacao" className="simulation" aria-labelledby="sim-title" ref={ref}>
      <div className="container simulation__grid">
        <div className="simulation__copy">
          <h2 id="sim-title" className="reveal">
            Testamos a lógica antes de ligar a máquina
          </h2>
          <p className="reveal" style={{ '--i': 1 }}>
            Experimente: aperte Partida, depois Parar ou Emergência.
          </p>
        </div>

        <div className="simulation__panel reveal reveal--scale" style={{ '--i': 1 }}>
          <Suspense fallback={<div className="simulation__placeholder" aria-hidden="true" />}>
            <PlcSimulator />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
