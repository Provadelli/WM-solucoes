import meta from './images.json'

/** Monta src/srcset de uma foto otimizada em public/img */
export function photo(name) {
  const m = meta[name]
  const widths = m.widths
  return {
    src: `/img/${name}-${widths[widths.length - 1]}.webp`,
    srcSet: widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', '),
    width: m.w,
    height: m.h,
  }
}

export const logo = { src: '/img/logo.webp', fallback: '/img/logo.png', width: meta.logo.w, height: meta.logo.h }

export const contact = {
  phoneDisplay: '(47) 99905-9574',
  phoneHref: 'tel:+5547999059574',
  email: 'williamanton51@gmail.com',
  whatsapp:
    'https://wa.me/5547999059574?text=' +
    encodeURIComponent('Olá! Gostaria de solicitar uma proposta comercial para um projeto de automação.'),
}

export const nav = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Simulação', href: '#simulacao' },
  { label: 'Processo', href: '#processo' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' },
]

export const metrics = [
  { value: 0, suffix: '%', label: 'paradas imprevistas na integração' },
  { value: 35, suffix: '%', label: 'menos tempo de setup de máquina' },
  { value: 100, suffix: '%', label: 'dos CLPs e IHMs testados em simulação' },
]

/* Serviços em 3 painéis, como telas de um supervisório */
export const servicePanels = [
  {
    id: 'projeto',
    title: 'Projeto',
    icon: 'diagram',
    items: [
      { name: 'Projetos elétricos 3D', detail: 'EPLAN e SEE Electrical' },
      { name: 'Diagramas elétricos', detail: 'Entrega em 72 h, NBR 5410' },
      { name: 'ART elétrica e mecânica', detail: 'Laudo e análise de risco' },
    ],
  },
  {
    id: 'software',
    title: 'Software',
    icon: 'plc',
    items: [
      { name: 'CLP, IHM e SCADA', detail: 'Ladder e structured text' },
      { name: 'Integração de sistemas', detail: 'Do sensor ao supervisório' },
      { name: 'Automatização de máquinas', detail: 'Alimentício, farma, têxtil' },
    ],
  },
  {
    id: 'campo',
    title: 'Campo',
    icon: 'panel',
    items: [
      { name: 'Montagem de painéis', detail: 'Acabamento NR-10' },
      { name: 'Movimentação de carga', detail: 'Pontes rolantes e guindastes' },
      { name: 'Adequação NR-10 e NR-12', detail: 'Proteções e intertravamento' },
      { name: 'Montagens industriais', detail: 'Entrega pronta para operar' },
    ],
  },
]

export const steps = [
  { title: 'Projeto', text: 'Diagramas e modelo 3D do painel.' },
  { title: 'Simulação', text: 'CLP e IHM testados no gêmeo digital.' },
  { title: 'Montagem', text: 'Painel montado e testado na bancada.' },
  { title: 'Comissionamento', text: 'Partida assistida no local.' },
]

export const gallery = [
  { name: 'projeto-3d', title: 'Painel modelado em 3D' },
  { name: 'foto-2', title: 'Montagem de painel de comando' },
  { name: 'projeto-tela', title: 'Diagrama elétrico' },
  { name: 'ponte-rolante', title: 'Ponte rolante adequada à NR-12' },
  { name: 'foto-5', title: 'Enclausuramento NR-12' },
  { name: 'foto-6', title: 'Automação de máquina' },
  { name: 'foto-7', title: 'Transportador automatizado' },
]
