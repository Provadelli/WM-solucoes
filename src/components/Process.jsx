import { useRef } from 'react'
import Icon from './Icon.jsx'
import useReveal from '../hooks/useReveal.js'
import useScrollProgress from '../hooks/useScrollProgress.js'
import { steps } from '../data/content.js'
import './Process.css'

export default function Process() {
  const ref = useReveal()
  const trackRef = useRef(null)
  useScrollProgress(trackRef, '--progress')

  return (
    <section id="processo" className="process" aria-labelledby="process-title" ref={ref}>
      <div className="tech-grid" aria-hidden="true" />
      <div className="container">
        <header className="section-head section-head--split">
          <h2 id="process-title" className="reveal">
            Como um projeto chega à <span className="hl">sua linha</span>
          </h2>
          <p className="reveal" style={{ '--i': 1 }}>
            Quando chegamos à fábrica, a lógica já foi testada. Role a página e acompanhe a energia passando por cada
            etapa.
          </p>
        </header>

        <div className="process__track" ref={trackRef}>
          <span className="process__spark" aria-hidden="true" />
          <ol className="process__steps">
            {steps.map((step, i) => (
              <li key={step.title} className="pstep reveal" style={{ '--i': i, '--n': i }}>
                <span className="pstep__node" aria-hidden="true">
                  <Icon name={step.icon} size={24} className="pstep__icon" />
                </span>
                <div className="pstep__body">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
