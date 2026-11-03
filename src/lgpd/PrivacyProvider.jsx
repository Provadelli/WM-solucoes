import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import NoticeBar from './NoticeBar.jsx'
import { applyConsent, initConsentDefaults } from './medicao.js'

const PrefsPanel = lazy(() => import('./PrefsPanel.jsx'))

const KEY = 'wm-consent'
const VERSION = 1
const MAX_AGE_DAYS = 365

const Ctx = createContext(null)

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const c = JSON.parse(raw)
    const age = (Date.now() - new Date(c.date).getTime()) / 86400000
    if (c.v !== VERSION || !(age < MAX_AGE_DAYS)) return null
    return c
  } catch {
    return null
  }
}

export function PrivacyProvider({ children }) {
  const [consent, setConsent] = useState(undefined) // undefined = lendo, null = sem escolha
  const [prefsOpen, setPrefsOpen] = useState(false)

  useEffect(() => {
    initConsentDefaults()
    const c = read()
    setConsent(c)
    if (c) applyConsent(c)
  }, [])

  const save = useCallback((choice) => {
    const c = { v: VERSION, date: new Date().toISOString(), necessary: true, ...choice }
    try {
      localStorage.setItem(KEY, JSON.stringify(c))
    } catch {
      /* navegação privada: a escolha vale só para esta visita */
    }
    setConsent(c)
    applyConsent(c)
    setPrefsOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      consent,
      acceptAll: () => save({ analytics: true, marketing: true }),
      rejectAll: () => save({ analytics: false, marketing: false }),
      save,
      openPreferences: () => setPrefsOpen(true),
      closePreferences: () => setPrefsOpen(false),
    }),
    [consent, save],
  )

  return (
    <Ctx.Provider value={value}>
      {children}
      {consent === null && !prefsOpen && <NoticeBar />}
      {prefsOpen && (
        <Suspense fallback={null}>
          <PrefsPanel />
        </Suspense>
      )}
    </Ctx.Provider>
  )
}

export function useConsent() {
  return useContext(Ctx)
}
