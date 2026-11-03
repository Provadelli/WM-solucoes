import Button from './Button.jsx'
import Icon from './Icon.jsx'
import useReveal from '../hooks/useReveal.js'
import { contact } from '../data/content.js'
import './Contact.css'

export default function Contact() {
  const ref = useReveal()
  return (
    <section id="contato" className="contact on-light" aria-labelledby="contact-title" ref={ref}>
      <div className="container contact__grid">
        <div>
          <h2 id="contact-title" className="reveal">
            Previsibilidade na sua produção
          </h2>
          <p className="contact__lead reveal" style={{ '--i': 1 }}>
            Mande o problema ou o diagrama da sua máquina. Um engenheiro responde com prazo e próximos passos.
          </p>
          <div className="contact__actions reveal" style={{ '--i': 2 }}>
            <Button variant="orange" href={contact.whatsapp} icon="whatsapp">
              Falar com engenheiro no WhatsApp
            </Button>
            <Button variant="petrol" href={`mailto:${contact.email}`} icon="mail">
              Enviar e-mail
            </Button>
          </div>
        </div>

        <ul className="contact__list">
          <li className="reveal reveal--left" style={{ '--i': 1 }}>
            <span className="contact__icon">
              <Icon name="phone" size={22} />
            </span>
            <span>
              <span className="contact__label">Telefone e WhatsApp</span>
              <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            </span>
          </li>
          <li className="reveal reveal--left" style={{ '--i': 2 }}>
            <span className="contact__icon">
              <Icon name="mail" size={22} />
            </span>
            <span>
              <span className="contact__label">E-mail</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </span>
          </li>
          <li className="reveal reveal--left" style={{ '--i': 3 }}>
            <span className="contact__icon">
              <Icon name="bolt" size={22} />
            </span>
            <span>
              <span className="contact__label">Atendimento</span>
              <span className="contact__value">Sede em Jaraguá do Sul, SC. Atendemos todo o Brasil.</span>
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}
