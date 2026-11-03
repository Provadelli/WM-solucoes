// Google Analytics 4 com Consent Mode v2.
// Nada é carregado do Google antes do consentimento de "estatística".

const GA_ID = import.meta.env.VITE_GA_ID || ''
const hasValidId = /^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX'
let loaded = false

function gtag() {
  window.dataLayer.push(arguments)
}

/** Define tudo como negado por padrão (roda antes de qualquer coisa). */
export function initConsentDefaults() {
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || gtag
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  })
}

function loadGa() {
  if (loaded || !hasValidId) return
  loaded = true
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { anonymize_ip: true })
}

/** Apaga cookies do GA no domínio atual e nos domínios pais. */
function deleteGaCookies() {
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => n.startsWith('_ga') || n === '_gid' || n.startsWith('_gat'))
  const parts = location.hostname.split('.')
  const domains = ['']
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; domain=.${parts.slice(i).join('.')}`)
  names.forEach((n) =>
    domains.forEach((d) => {
      document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`
    }),
  )
}

/** Aplica a escolha do usuário. */
export function applyConsent({ analytics, marketing }) {
  window.gtag('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: marketing ? 'granted' : 'denied',
    ad_user_data: marketing ? 'granted' : 'denied',
    ad_personalization: marketing ? 'granted' : 'denied',
  })
  if (analytics) loadGa()
  else deleteGaCookies()
}
