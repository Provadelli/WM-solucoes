import Icon from './Icon.jsx'
import useReveal from '../hooks/useReveal.js'
import { servicePanels } from '../data/content.js'
import './Services.css'

export default function Services() {
  const ref = useReveal()
  return (
    <section id="servicos" className="services on-light" aria-labelledby="services-title" ref={ref}>
      <div className="container">
        <header className="section-head">
          <h2 id="services-title" className="reveal">
            Do diagrama ao comissionamento
          </h2>
          <p className="reveal" style={{ '--i': 1 }}>
            Projeto, software e campo com a mesma equipe.
          </p>
        </header>

        <div className="services__panels">
          {servicePanels.map((panel, p) => (
            <article key={panel.id} className="spanel reveal" style={{ '--i': p }} aria-labelledby={`sp-${panel.id}`}>
              <header className="spanel__bar">
                <Icon name={panel.icon} size={20} />
                <h3 id={`sp-${panel.id}`}>{panel.title}</h3>
                <span className="spanel__led" aria-hidden="true" />
              </header>
              <ul className="spanel__list">
                {panel.items.map((item, i) => (
                  <li key={item.name} style={{ '--d': i }}>
                    <span className="spanel__name">{item.name}</span>
                    <span className="spanel__detail">{item.detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
