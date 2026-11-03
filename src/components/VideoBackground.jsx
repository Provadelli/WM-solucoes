import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import useReducedMotion from '../hooks/useReducedMotion.js'
import './VideoBackground.css'

function shouldAutoload() {
  const c = navigator.connection
  if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return false
  return true
}

/**
 * Vídeo decorativo de fundo. O poster é a imagem principal (LCP);
 * o vídeo só carrega depois do evento load, pausa fora da tela e
 * respeita movimento reduzido e economia de dados.
 */
export default function VideoBackground({ poster, sources }) {
  const reduced = useReducedMotion()
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const [load, setLoad] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const userPaused = useRef(false)

  // Carrega o vídeo só depois que a página terminou de carregar
  useEffect(() => {
    if (reduced || !shouldAutoload()) return
    const start = () => setLoad(true)
    if (document.readyState === 'complete') {
      const id = setTimeout(start, 300)
      return () => clearTimeout(id)
    }
    window.addEventListener('load', start, { once: true })
    return () => window.removeEventListener('load', start)
  }, [reduced])

  // Pausa quando o hero sai da tela
  useEffect(() => {
    const v = videoRef.current
    const wrap = wrapRef.current
    if (!v || !wrap) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused.current) v.play().catch(() => {})
      else if (!e.isIntersecting) v.pause()
    })
    io.observe(wrap)
    return () => io.disconnect()
  }, [load])

  const toggle = () => {
    const v = videoRef.current
    if (!load) {
      userPaused.current = false
      setLoad(true)
      return
    }
    if (!v) return
    if (v.paused) {
      userPaused.current = false
      v.play().catch(() => {})
    } else {
      userPaused.current = true
      v.pause()
    }
  }

  return (
    <div className="vbg" ref={wrapRef}>
      <img className="vbg__poster" src={poster} srcSet={`${poster.replace(".webp", "-640.webp")} 640w, ${poster} 1280w`} sizes="100vw" alt="" fetchPriority="high" decoding="async" width="1280" height="720" />
      {load && (
        <video
          ref={videoRef}
          className={`vbg__video ${ready ? 'is-ready' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => {
            setReady(true)
            setPlaying(true)
          }}
          onPause={() => setPlaying(false)}
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}
      <div className="vbg__shade" />
      <button type="button" className="vbg__toggle" onClick={toggle}>
        <Icon name={playing ? 'pause' : 'play'} size={16} strokeWidth={2.4} />
        <span>{playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}</span>
      </button>
    </div>
  )
}
