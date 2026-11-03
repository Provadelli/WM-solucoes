import { useEffect, useRef, useState } from 'react'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { photo } from '../data/content.js'
import './ServicePreview.css'

/** Mini-animação: ilhas de automação ligadas em uma rede única (N1 → N3) */
function NetworkAnim() {
  const field = [40, 100, 160, 220, 280]
  return (
    <svg className="pv-anim" viewBox="0 0 320 200" role="presentation">
      <rect x="110" y="18" width="100" height="34" rx="4" className="pv-anim__box pv-anim__box--hot" />
      <text x="160" y="40" className="pv-anim__txt">SCADA</text>
      <path d="M160 52v34M60 86h200" className="pv-anim__bus" />
      {[60, 160, 260].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 86v22`} className="pv-anim__bus" />
          <rect x={x - 34} y="108" width="68" height="28" rx="4" className="pv-anim__box" />
          <text x={x} y="127" className="pv-anim__txt">CLP {i + 1}</text>
          <path d={`M${x} 136v20`} className="pv-anim__bus" />
        </g>
      ))}
      <path d="M20 156h280" className="pv-anim__bus" />
      {field.map((x, i) => (
        <circle key={x} cx={x} cy="174" r="7" className="pv-anim__node" style={{ '--n': i }} />
      ))}
      <path d="M160 52v34M60 86h200M60 86v22M160 86v22M260 86v22" className="pv-anim__flow" />
    </svg>
  )
}

/** Imagem ou mini-animação do serviço (usada na prévia e no card expandido do toque) */
export function PreviewMedia({ card, sizes = '320px' }) {
  if (card.anim === 'network') {
    return (
      <div className="pv-media pv-media--anim">
        <NetworkAnim />
      </div>
    )
  }
  const p = photo(card.image)
  return (
    <div className="pv-media">
      <img src={p.src} srcSet={p.srcSet} sizes={sizes} width={p.width} height={p.height} alt="" decoding="async" />
    </div>
  )
}

const W = 280
const H = 230

/**
 * Subjanela que segue o cursor com leve atraso (lerp) e mostra como o serviço funciona.
 * Decorativa: o mesmo conteúdo existe no card para leitores de tela.
 */
export default function ServicePreview({ card, pointer }) {
  const reduced = useReducedMotion()
  const elRef = useRef(null)
  const pos = useRef(null)
  const [shown, setShown] = useState(card) // mantém o último card durante o fade-out

  useEffect(() => {
    if (card) setShown(card)
  }, [card])

  const visible = Boolean(card)

  useEffect(() => {
    if (!visible) return
    const el = elRef.current
    let raf = 0
    const target = () => {
      const { x, y } = pointer.current
      const vw = window.innerWidth
      const vh = window.innerHeight
      // abre à direita/abaixo do cursor; inverte perto das bordas
      const tx = x + 28 + W > vw - 12 ? x - W - 28 : x + 28
      const ty = Math.min(Math.max(12, y - H * 0.35), vh - H - 12)
      return { x: tx, y: ty }
    }
    if (!pos.current) pos.current = target()
    const tick = () => {
      const t = target()
      const k = reduced ? 1 : 0.16
      pos.current.x += (t.x - pos.current.x) * k
      pos.current.y += (t.y - pos.current.y) * k
      // inclinação leve conforme a velocidade horizontal
      const tilt = reduced ? 0 : Math.max(-6, Math.min(6, (t.x - pos.current.x) * 0.04))
      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) rotate(${tilt}deg)`
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [visible, pointer, reduced])

  // Ao esconder, a próxima abertura começa já na posição do cursor
  useEffect(() => {
    if (!visible) {
      const id = setTimeout(() => (pos.current = null), 300)
      return () => clearTimeout(id)
    }
  }, [visible])

  return (
    <div className={`pv ${visible ? 'is-visible' : ''}`} ref={elRef} aria-hidden="true">
      <div className="pv__card">
      {shown && (
        <div className="pv__inner" key={shown.name}>
          <div className="pv__body">
            <p className="pv__title">{shown.name}</p>
            <p className="pv__text">{shown.text}</p>
            <ol className="pv__steps">
              {shown.steps.map((s, i) => (
                <li key={s} style={{ '--s': i }}>
                  <span className="pv__step-n">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
