import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import { useConsent } from './PrivacyProvider.jsx'
import './lgpd.css'

const categories = [
  {
    id: 'necessary',
    title: 'Necessários',
    text: 'Guardam a sua escolha de cookies e mantêm o site funcionando. Não podem ser desligados.',
    locked: true,
  },
  {
    id: 'analytics',
    title: 'Estatística',
    text: 'Google Analytics 4, com IP anonimizado. Mostra quais páginas são mais visitadas para melhorarmos o site.',
  },
  {
    id: 'marketing',
    title: 'Marketing',
    text: 'Medição de campanhas de anúncios. Hoje não usamos nenhum, mas a opção fica registrada.',
  },
]

function Switch({ checked, onChange, disabled, labelledBy, describedBy }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-disabled={disabled || undefined}
      className="switch"
      onClick={() => !disabled && onChange(!checked)}
    >
      <span className="switch__thumb" />
    </button>
  )
}

export default function PrefsPanel() {
  const { consent, save, acceptAll, rejectAll, closePreferences } = useConsent()
  const ref = useRef(null)
  const [state, setState] = useState({
    analytics: !!consent?.analytics,
    marketing: !!consent?.marketing,
  })

  useEffect(() => {
    const dlg = ref.current
    if (dlg && !dlg.open) dlg.showModal()
  }, [])

  return (
    <dialog ref={ref} className="lgpd-panel" aria-labelledby="prefs-title" onClose={closePreferences}>
      <div className="lgpd-panel__head">
        <h2 id="prefs-title">Preferências de cookies</h2>
        <button type="button" className="lgpd-panel__close" onClick={() => ref.current.close()} aria-label="Fechar">
          <Icon name="close" size={20} strokeWidth={2.2} />
        </button>
      </div>
      <p className="lgpd-panel__intro">
        Escolha quais categorias autoriza. Conforme a LGPD, cookies não essenciais só são ativados com o seu
        consentimento.
      </p>

      <ul className="lgpd-panel__list">
        {categories.map((c) => (
          <li key={c.id}>
            <div>
              <h3 id={`cat-${c.id}`}>{c.title}</h3>
              <p id={`cat-${c.id}-d`}>{c.text}</p>
            </div>
            <Switch
              checked={c.locked ? true : state[c.id]}
              disabled={c.locked}
              labelledBy={`cat-${c.id}`}
              describedBy={`cat-${c.id}-d`}
              onChange={(v) => setState((s) => ({ ...s, [c.id]: v }))}
            />
          </li>
        ))}
      </ul>

      <div className="lgpd-panel__actions">
        <Button variant="light" size="sm" onClick={rejectAll}>
          Rejeitar não essenciais
        </Button>
        <Button variant="light" size="sm" onClick={acceptAll}>
          Aceitar todos
        </Button>
        <Button variant="orange" size="sm" onClick={() => save(state)}>
          Salvar escolha
        </Button>
      </div>
    </dialog>
  )
}
