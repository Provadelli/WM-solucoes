import Button from '../components/Button.jsx'
import { useConsent } from './PrivacyProvider.jsx'
import './lgpd.css'

export default function NoticeBar() {
  const { acceptAll, rejectAll, openPreferences } = useConsent()
  return (
    <section className="lgpd-bar" role="region" aria-labelledby="lgpd-bar-title">
      <div className="lgpd-bar__text">
        <h2 id="lgpd-bar-title">Sua privacidade</h2>
        <p>
          Usamos cookies necessários para o site funcionar e, com a sua permissão, cookies de estatística para entender
          como ele é usado. Você pode mudar a escolha a qualquer momento no rodapé. Detalhes na{' '}
          <a href="/politica-de-privacidade.html">Política de Privacidade</a>.
        </p>
      </div>
      {/* Mesmo peso visual para aceitar e rejeitar (sem padrão manipulador) */}
      <div className="lgpd-bar__actions">
        <Button variant="light" size="sm" onClick={rejectAll}>
          Rejeitar não essenciais
        </Button>
        <Button variant="light" size="sm" onClick={openPreferences}>
          Personalizar
        </Button>
        <Button variant="light" size="sm" onClick={acceptAll}>
          Aceitar todos
        </Button>
      </div>
    </section>
  )
}
