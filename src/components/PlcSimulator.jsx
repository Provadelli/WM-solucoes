import { useCallback, useEffect, useRef, useState } from 'react'
import Button from './Button.jsx'
import './PlcSimulator.css'

/* ---------- Símbolos ladder ---------- */

function Wire({ x1, y1, x2, y2, on }) {
  return (
    <g className={`wire ${on ? 'is-on' : ''}`}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="wire__base" />
      {on && <line x1={x1} y1={y1} x2={x2} y2={y2} className="wire__flow" />}
    </g>
  )
}

function Contact({ x, y, addr, name, nc = false, closed, powered }) {
  const state = closed && powered ? 'is-on' : closed ? 'is-closed' : ''
  return (
    <g className={`contact ${state}`}>
      <text x={x} y={y - 24} className="sym__addr">{addr}</text>
      <line x1={x - 8} y1={y - 14} x2={x - 8} y2={y + 14} />
      <line x1={x + 8} y1={y - 14} x2={x + 8} y2={y + 14} />
      {nc && <line x1={x - 13} y1={y + 14} x2={x + 13} y2={y - 14} />}
      <text x={x} y={y + 34} className="sym__name">{name}</text>
    </g>
  )
}

function Coil({ x, y, addr, name, on }) {
  return (
    <g className={`coil ${on ? 'is-on' : ''}`}>
      <text x={x} y={y - 24} className="sym__addr">{addr}</text>
      <circle cx={x} cy={y} r="13" className="coil__core" />
      {on && <circle cx={x} cy={y} r="13" className="coil__pulse" />}
      <path d={`M ${x - 5} ${y - 14} A 15 15 0 0 0 ${x - 5} ${y + 14}`} />
      <path d={`M ${x + 5} ${y - 14} A 15 15 0 0 1 ${x + 5} ${y + 14}`} />
      <text x={x} y={y + 34} className="sym__name">{name}</text>
    </g>
  )
}

/* ---------- Simulador ---------- */

const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function PlcSimulator() {
  const [start, setStart] = useState(false) // I0.0 botão NA, pulso
  const [stop, setStop] = useState(false) // I0.1 botão NF, pulso
  const [estop, setEstop] = useState(false) // I0.2 emergência, retenção
  const [motor, setMotor] = useState(false) // Q0.0
  const [starts, setStarts] = useState(0)
  const [runtime, setRuntime] = useState(0)
  const [rpm, setRpm] = useState(0)
  const timers = useRef([])

  // Varredura do CLP: partida com selo, intertravada por parar e emergência
  useEffect(() => {
    const next = (start || motor) && !stop && !estop
    if (next !== motor) {
      setMotor(next)
      if (next) setStarts((n) => n + 1)
    }
  }, [start, stop, estop, motor])

  // Rampa de velocidade e horímetro
  useEffect(() => {
    const id = setInterval(() => {
      setRpm((r) => {
        const target = motor ? 1750 : 0
        const next = r + (target - r) * 0.18
        return Math.abs(target - next) < 4 ? target : next
      })
    }, 100)
    return () => clearInterval(id)
  }, [motor])

  useEffect(() => {
    if (!motor) return
    const id = setInterval(() => setRuntime((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [motor])

  const pulse = useCallback((setter) => {
    setter(true)
    timers.current.push(setTimeout(() => setter(false), 450))
  }, [])

  // Demonstração automática: dá a partida uma vez quando o simulador aparece na tela
  const rootRef = useRef(null)
  useEffect(() => {
    const el = rootRef.current
    const list = timers.current
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        list.push(setTimeout(() => pulse(setStart), 900))
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      list.forEach(clearTimeout)
    }
  }, [pulse])

  // Fluxo de energia por trecho
  const a = start || motor
  const b = a && !stop
  const c = b && !estop

  const status = estop ? 'Emergência ativa' : motor ? 'Em operação' : 'Parado'
  const statusKey = estop ? 'alarm' : motor ? 'run' : 'idle'

  return (
    <div className="plc" role="group" aria-label="Simulador de CLP" ref={rootRef}>
      <svg className="plc__ladder" viewBox="0 0 560 290" role="img" aria-label={`Diagrama ladder. Motor: ${status}.`}>
        <defs>
          <pattern id="plc-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" className="plc__gridline" />
          </pattern>
          <linearGradient id="plc-scan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#19b3c4" stopOpacity="0" />
            <stop offset="1" stopColor="#19b3c4" stopOpacity="0.22" />
          </linearGradient>
        </defs>
        <rect width="560" height="290" fill="url(#plc-grid)" />
        {/* Varredura do CLP percorrendo as linhas */}
        <rect x="24" y="0" width="512" height="36" fill="url(#plc-scan)" className="plc__scanline" />

        {/* Barramentos */}
        <line x1="24" y1="28" x2="24" y2="268" className="rail rail--on" />
        <line x1="536" y1="28" x2="536" y2="268" className="rail" />

        {/* Linha 1: partida com selo */}
        <Wire x1={24} y1={70} x2={80} y2={70} on />
        <Contact x={88} y={70} addr="I0.0" name="Partida" closed={start} powered />
        <Wire x1={96} y1={70} x2={160} y2={70} on={start} />

        <Wire x1={48} y1={70} x2={48} y2={140} on />
        <Wire x1={48} y1={140} x2={80} y2={140} on />
        <Contact x={88} y={140} addr="Q0.0" name="Selo" closed={motor} powered />
        <Wire x1={96} y1={140} x2={160} y2={140} on={motor} />
        <Wire x1={160} y1={140} x2={160} y2={70} on={motor} />

        <Wire x1={160} y1={70} x2={240} y2={70} on={a} />
        <Contact x={248} y={70} addr="I0.1" name="Parar" nc closed={!stop} powered={a} />
        <Wire x1={256} y1={70} x2={328} y2={70} on={b} />
        <Contact x={336} y={70} addr="I0.2" name="Emergência" nc closed={!estop} powered={b} />
        <Wire x1={344} y1={70} x2={445} y2={70} on={c} />
        <Coil x={460} y={70} addr="Q0.0" name="Motor" on={motor} />
        <Wire x1={475} y1={70} x2={536} y2={70} on={c} />

        {/* Linha 2: sinalização de alarme */}
        <Wire x1={24} y1={228} x2={80} y2={228} on />
        <Contact x={88} y={228} addr="I0.2" name="Emergência" closed={estop} powered />
        <Wire x1={96} y1={228} x2={445} y2={228} on={estop} />
        <Coil x={460} y={228} addr="Q0.1" name="Alarme" on={estop} />
        <Wire x1={475} y1={228} x2={536} y2={228} on={estop} />
      </svg>

      <div className="plc__bottom">
        <div className="plc__controls" role="group" aria-label="Entradas do CLP">
          <Button variant="petrol" size="sm" onClick={() => pulse(setStart)} aria-pressed={start}>
            Partida
          </Button>
          <Button variant="light" size="sm" onClick={() => pulse(setStop)} aria-pressed={stop}>
            Parar
          </Button>
          <Button variant="orange" size="sm" onClick={() => setEstop((v) => !v)} aria-pressed={estop}>
            Emergência
          </Button>
        </div>

        <dl className={`hmi hmi--${statusKey}`} aria-live="polite">
          <div className="hmi__status">
            <dt className="sr-only">Status</dt>
            <dd>
              <span className="hmi__lamp" />
              {status}
            </dd>
          </div>
          <div>
            <dt>Rotação</dt>
            <dd>
              {Math.round(rpm).toLocaleString('pt-BR')} rpm
              <span className="hmi__bar" style={{ '--v': rpm / 1750 }} aria-hidden="true" />
            </dd>
          </div>
          <div>
            <dt>Partidas</dt>
            <dd>{starts}</dd>
          </div>
          <div>
            <dt>Operação</dt>
            <dd>{fmtTime(runtime)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
