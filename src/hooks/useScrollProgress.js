import { useEffect } from 'react'

/**
 * Escreve o progresso de rolagem (0 a 1) numa variável CSS do elemento.
 * - target 'page': progresso da página inteira
 * - target ref: progresso do elemento atravessando a tela
 * Usa requestAnimationFrame e não provoca re-render do React.
 */
export default function useScrollProgress(ref, varName = '--progress', mode = 'element') {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0

    const update = () => {
      frame = 0
      let p
      if (mode === 'page') {
        const max = document.documentElement.scrollHeight - window.innerHeight
        p = max > 0 ? window.scrollY / max : 0
      } else {
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        // 0 quando o topo entra pela base da tela, 1 quando o fim passa do meio da tela
        p = (vh - r.top) / (r.height + vh * 0.5)
      }
      el.style.setProperty(varName, Math.min(1, Math.max(0, p)).toFixed(4))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, varName, mode])
}
