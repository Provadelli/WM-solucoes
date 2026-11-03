import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import Button from './Button.jsx'
import { PreviewMedia } from './ServicePreview.jsx'
import useReducedMotion from '../hooks/useReducedMotion.js'
import './Panel3D.css'

/* Medidas em metros: gabinete de 600 × 800 × 250 mm */
const W = 0.6
const H = 0.8
const D = 0.25
const T = 0.012 // espessura da chapa
const PLATE_Z = -D / 2 + T + 0.03 // face da placa de montagem
const DOOR_OPEN = 1.95 // ~110°

const COLORS = {
  enclosure: '#56616c',
  plate: '#cfd3d7',
  duct: '#2b6763',
  ductCover: '#4a8a85',
  rail: '#e07a2a',
  steel: '#a7afb6',
  inverter: '#dfe2e5',
  inverterFace: '#3a4048',
  contactor: '#eceeef',
  module: '#5b626b',
  moduleTop: '#ff6b00',
  terminal: '#a3a9ae',
  terminalBlue: '#3c6fd1',
  terminalPe: '#3fae5a',
  black: '#1d2126',
  copper: '#b0652c',
  glass: '#bcd6e8',
  label: '#2b3fd1',
}

/** Etiqueta azul tipo EPLAN ("-U2"), desenhada em canvas */
function makeLabel(text, track) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 96
  const ctx = c.getContext('2d')
  ctx.fillStyle = COLORS.label
  ctx.font = '700 64px "JetBrains Mono", Consolas, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 128, 50)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  track(tex)
  return tex
}

/** Monta o painel com caixas simples; devolve o grupo e a porta */
function buildPanel(track) {
  const unit = track(new THREE.BoxGeometry(1, 1, 1))
  const edges = track(new THREE.EdgesGeometry(unit))
  const edgeMat = track(new THREE.LineBasicMaterial({ color: '#0e141c', transparent: true, opacity: 0.28 }))
  const mats = {}
  const mat = (color, opts = {}) => {
    const key = color + JSON.stringify(opts)
    if (!mats[key]) mats[key] = track(new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.15, ...opts }))
    return mats[key]
  }

  const root = new THREE.Group()

  // caixa com centro em (x, y, z) dentro de "parent"
  const box = (parent, w, h, d, x, y, z, color, opts, withEdges = true) => {
    const m = new THREE.Mesh(unit, typeof color === 'string' ? mat(color, opts) : color)
    m.scale.set(w, h, d)
    m.position.set(x, y, z)
    if (withEdges) m.add(new THREE.LineSegments(edges, edgeMat))
    parent.add(m)
    return m
  }
  // peça apoiada na placa de montagem: x/y são o centro na face da placa
  const onPlate = (w, h, d, x, y, color, opts) => box(root, w, h, d, x, y, PLATE_Z + d / 2, color, opts)

  const labelGeo = track(new THREE.PlaneGeometry(1, 1))
  const label = (text, x, y, z, vertical = false) => {
    const m = new THREE.Mesh(
      labelGeo,
      track(new THREE.MeshBasicMaterial({ map: makeLabel(text, track), transparent: true, depthWrite: false })),
    )
    m.scale.set(0.075, 0.028, 1)
    m.position.set(x, y, z + 0.001)
    if (vertical) m.rotation.z = Math.PI / 2
    root.add(m)
  }

  /* ---- Gabinete ---- */
  const metal = { metalness: 0.45, roughness: 0.4 }
  box(root, W, H, T, 0, H / 2, -D / 2 + T / 2, COLORS.enclosure, metal) // fundo
  box(root, T, H, D, -W / 2 + T / 2, H / 2, 0, COLORS.enclosure, metal) // laterais
  box(root, T, H, D, W / 2 - T / 2, H / 2, 0, COLORS.enclosure, metal)
  box(root, W, T, D, 0, H - T / 2, 0, COLORS.enclosure, metal) // teto
  box(root, W, T, D, 0, T / 2, 0, COLORS.enclosure, metal) // base
  // flange frontal
  const f = 0.02
  box(root, W, f, 0.01, 0, H - f / 2, D / 2 - 0.005, COLORS.enclosure, metal)
  box(root, W, f, 0.01, 0, f / 2, D / 2 - 0.005, COLORS.enclosure, metal)
  box(root, f, H, 0.01, -W / 2 + f / 2, H / 2, D / 2 - 0.005, COLORS.enclosure, metal)
  box(root, f, H, 0.01, W / 2 - f / 2, H / 2, D / 2 - 0.005, COLORS.enclosure, metal)

  /* ---- Placa de montagem ---- */
  box(root, W - 0.06, H - 0.06, 0.004, 0, H / 2, PLATE_Z - 0.002, COLORS.plate, { metalness: 0.3, roughness: 0.5 })

  /* ---- Canaletas ---- */
  const ductD = 0.06
  const duct = (w, h, x, y, name, vertical) => {
    onPlate(w, h, ductD, x, y, COLORS.duct, { roughness: 0.7 })
    if (name) label(name, x, y, PLATE_Z + ductD, vertical)
  }
  const L = -0.255 // borda esquerda útil
  const R = 0.255 // borda direita útil
  duct(R - L, 0.055, 0, 0.715, '-U2') // topo
  duct(0.055, 0.66, 0.2275, 0.355, '-U5', true) // vertical direita
  duct(0.035, 0.21, -0.005, 0.585, '-U16', true) // vertical central
  duct(0.19, 0.035, 0.105, 0.585, '-U17') // sob os bornes
  duct(0.455, 0.045, -0.0275, 0.455, '-U7') // meio
  duct(0.05, 0.405, -0.23, 0.2275, '-U3', true) // vertical esquerda
  duct(0.405, 0.04, -0.0025, 0.235, '-U12')
  duct(0.405, 0.045, -0.0025, 0.07, '-U4')

  /* ---- Trilhos DIN ---- */
  const rail = (x0, x1, y, name) => {
    onPlate(x1 - x0, 0.035, 0.0075, (x0 + x1) / 2, y, COLORS.rail, { metalness: 0.35, roughness: 0.45 })
    if (name) label(name, x1 - 0.04, y, PLATE_Z + 0.0075)
  }
  rail(0.02, 0.2, 0.655)
  rail(0.02, 0.2, 0.52)
  rail(-0.2, 0.2, 0.36)
  rail(-0.2, 0.2, 0.3, '-U13')
  rail(-0.2, 0.2, 0.155, '-U10')

  /* ---- Inversores (-U1) ---- */
  ;[-0.2, -0.105].forEach((x) => {
    const d = 0.165
    onPlate(0.085, 0.22, d, x, 0.6, COLORS.inverter)
    // frente escura com teclado
    box(root, 0.06, 0.07, 0.004, x, 0.64, PLATE_Z + d + 0.002, COLORS.inverterFace)
    box(root, 0.03, 0.014, 0.003, x, 0.655, PLATE_Z + d + 0.005, '#7fe0a8', { emissive: '#2bbf6a', emissiveIntensity: 0.6 }, false)
    // aletas laterais
    for (let i = 0; i < 6; i++) {
      box(root, 0.004, 0.018, 0.09, x + 0.044, 0.53 + i * 0.024, PLATE_Z + 0.06, COLORS.inverterFace, {}, false)
    }
    // bornes de potência
    box(root, 0.07, 0.025, 0.03, x, 0.505, PLATE_Z + 0.12, COLORS.black)
  })

  /* ---- Bornes no topo direito ---- */
  for (let i = 0; i < 26; i++) {
    const x = 0.03 + i * 0.0064
    const color = i === 24 || i === 25 ? COLORS.terminalPe : i % 6 === 5 ? COLORS.terminalBlue : COLORS.terminal
    onPlate(0.0058, 0.05, 0.045, x, 0.655, color)
  }

  /* ---- Contatores, relés e fonte (-U11) ---- */
  ;[0.04, 0.085].forEach((x) => {
    onPlate(0.044, 0.075, 0.085, x, 0.52, COLORS.contactor)
    box(root, 0.03, 0.02, 0.006, x, 0.53, PLATE_Z + 0.088, COLORS.black)
  })
  onPlate(0.016, 0.075, 0.07, 0.122, 0.52, COLORS.contactor)
  onPlate(0.016, 0.075, 0.07, 0.14, 0.52, COLORS.contactor)
  onPlate(0.045, 0.09, 0.11, 0.18, 0.52, '#c4c9cd', { metalness: 0.4 }) // fonte
  label('-U11', 0.18, 0.55, PLATE_Z + 0.11)

  /* ---- CLP (-U8) e módulos de E/S (-U19) ---- */
  onPlate(0.075, 0.11, 0.095, -0.155, 0.345, COLORS.module)
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      box(root, 0.012, 0.01, 0.004, -0.175 + c * 0.02, 0.385 - r * 0.02, PLATE_Z + 0.097, '#9aa3ab', {}, false)
    }
  }
  label('-U8', -0.155, 0.295, PLATE_Z + 0.095)
  for (let i = 0; i < 9; i++) {
    const x = -0.09 + i * 0.022
    onPlate(0.02, 0.09, 0.075, x, 0.345, COLORS.module)
    box(root, 0.016, 0.022, 0.004, x, 0.375, PLATE_Z + 0.077, COLORS.moduleTop, { roughness: 0.4 }, false)
    box(root, 0.005, 0.005, 0.003, x, 0.355, PLATE_Z + 0.077, '#7fffb0', { emissive: '#39d98a', emissiveIntensity: 1.4 }, false)
  }
  label('-U19', 0.04, 0.4, PLATE_Z + 0.075)

  /* ---- Transformador na parede esquerda ---- */
  const tx = -W / 2 + T + 0.05
  box(root, 0.09, 0.075, 0.1, tx, 0.15, 0.03, '#8a9097', { metalness: 0.5 })
  box(root, 0.06, 0.05, 0.11, tx, 0.15, 0.03, COLORS.copper, { metalness: 0.6, roughness: 0.35 })

  /* ---- Porta: dobradiça à direita, puxador à esquerda ---- */
  const door = new THREE.Group()
  door.position.set(W / 2, 0, D / 2 + 0.006)
  const glass = track(
    new THREE.MeshPhysicalMaterial({
      color: COLORS.glass,
      transparent: true,
      opacity: 0.16,
      roughness: 0.05,
      metalness: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  )
  box(door, W - 0.02, H - 0.02, 0.004, -W / 2, H / 2, 0, glass)
  const fw = 0.025
  box(door, W, fw, 0.012, -W / 2, H - fw / 2, 0, COLORS.enclosure, metal)
  box(door, W, fw, 0.012, -W / 2, fw / 2, 0, COLORS.enclosure, metal)
  box(door, fw, H, 0.012, -fw / 2, H / 2, 0, COLORS.enclosure, metal)
  box(door, fw, H, 0.012, -W + fw / 2, H / 2, 0, COLORS.enclosure, metal)
  box(door, 0.018, 0.12, 0.022, -W + 0.03, H * 0.55, 0.012, COLORS.black, { roughness: 0.3 }) // puxador
  ;[0.12, H - 0.12].forEach((y) => box(door, 0.012, 0.05, 0.016, -0.002, y, 0.004, COLORS.black)) // dobradiças
  root.add(door)

  return { root, door }
}

/** Sombra suave no piso, feita com gradiente radial */
function makeShadow(track) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64)
  g.addColorStop(0, 'rgba(0,0,0,0.55)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  const tex = track(new THREE.CanvasTexture(c))
  const m = new THREE.Mesh(
    track(new THREE.PlaneGeometry(1, 1)),
    track(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })),
  )
  m.rotation.x = -Math.PI / 2
  m.scale.set(1.1, 0.7, 1)
  m.position.y = 0.001
  return m
}

export default function Panel3D({ fallbackCard }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const doorTarget = useRef(0)
  const reducedRef = useRef(false)
  const reduced = useReducedMotion()
  const [doorOpen, setDoorOpen] = useState(false)
  const [failed, setFailed] = useState(false)

  reducedRef.current = reduced
  doorTarget.current = doorOpen ? DOOR_OPEN : 0

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.toneMappingExposure = 1.05

    const disposables = []
    const track = (o) => (disposables.push(o), o)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04)
    pmrem.dispose()
    scene.environment = envRT.texture
    scene.environmentIntensity = 0.55

    const key = new THREE.DirectionalLight('#ffffff', 2.2)
    key.position.set(1.4, 2.4, 2)
    const back = new THREE.DirectionalLight('#cfe6ff', 1.3)
    back.position.set(-1.2, 1.6, -2.2)
    scene.add(key, back, new THREE.HemisphereLight('#ffffff', '#3a4250', 0.6))

    const { root, door } = buildPanel(track)
    scene.add(root, makeShadow(track))

    const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 20)
    camera.position.set(-0.8, 0.85, 1.3)

    const controls = new OrbitControls(camera, canvas)
    controls.target.set(0, H / 2, 0)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.minDistance = 0.9
    controls.maxDistance = 3
    controls.maxPolarAngle = Math.PI * 0.53
    controls.autoRotateSpeed = 1.1
    controls.autoRotate = !reducedRef.current
    controls.update()
    // deixa a página rolar na vertical no toque; arrasto horizontal gira
    canvas.style.touchAction = 'pan-y'

    let resumeTimer = 0
    const onStart = () => {
      controls.autoRotate = false
      clearTimeout(resumeTimer)
      wrap.classList.add('is-grabbing')
    }
    const onEnd = () => {
      wrap.classList.remove('is-grabbing')
      clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => (controls.autoRotate = !reducedRef.current), 4000)
    }
    controls.addEventListener('start', onStart)
    controls.addEventListener('end', onEnd)

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      // em telas estreitas afasta a câmera para caber o painel inteiro
      camera.zoom = Math.min(1, camera.aspect / 1.05)
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()

    // só renderiza quando visível
    let visible = false
    let raf = 0
    const loop = () => {
      raf = 0
      if (!visible || document.hidden) return
      const target = doorTarget.current
      const k = reducedRef.current ? 1 : 0.075
      door.rotation.y += (target - door.rotation.y) * k
      if (Math.abs(target - door.rotation.y) < 0.0005) door.rotation.y = target
      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
    })
    io.observe(wrap)
    const onVis = () => !document.hidden && start()
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resumeTimer)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      controls.removeEventListener('start', onStart)
      controls.removeEventListener('end', onEnd)
      controls.dispose()
      disposables.forEach((o) => o.dispose())
      envRT.dispose()
      renderer.dispose()
    }
  }, [])

  if (failed) return <PreviewMedia card={fallbackCard} sizes="90vw" />

  return (
    <div className="p3d">
      <div className="p3d__stage" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          className="p3d__canvas"
          role="img"
          aria-label="Modelo 3D de um painel elétrico de comando: gabinete com porta de vidro, canaletas, dois inversores, bornes, contatores, CLP e módulos de entrada e saída"
        />
        <span className="p3d__tag" aria-hidden="true">
          3D
        </span>
      </div>
      <div className="p3d__bar">
        <p className="p3d__hint">Arraste para girar · role ou pince para aproximar</p>
        <Button variant="light" size="sm" aria-pressed={doorOpen} onClick={() => setDoorOpen((v) => !v)}>
          {doorOpen ? 'Fechar porta' : 'Abrir porta'}
        </Button>
      </div>
    </div>
  )
}
