import { useRef } from 'react'
import useReveal from '../hooks/useReveal.js'
import useScrollProgress from '../hooks/useScrollProgress.js'
import { steps } from '../data/content.js'
import './Process.css'

export default function Process() {
  const ref = useReveal()
  const stepsRef = useRef(null)
  useScrollProgress(stepsRef, '--progress')

  return (
    <section id="processo" className="process" aria-labelledby="process-title" ref={ref}>
      <div className="container">
        <header className="section-head">
          <h2 id="process-title" className="reveal">
            Como um projeto chega à sua linha
          </h2>
          <p className="reveal" style={{ '--i': 1 }}>
            Quando chegamos à fábrica, a lógica já foi testada.
          </p>
        </header>

        <ol className="process__steps" ref={stepsRef}>
          {steps.map((step, i) => (
            <li key={step.title} className="pstep reveal" style={{ '--i': i, '--n': i }}>
              <span className="pstep__node" aria-hidden="true">
                <span>{i + 1}</span>
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
