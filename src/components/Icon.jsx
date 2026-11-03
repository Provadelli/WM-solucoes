/* Ícones de traço inspirados em simbologia elétrica. pathLength=1 permite animar o "desenho". */
const paths = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  whatsapp: (
    <>
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
      <path d="M9 9.5c.3 2.4 2.1 4.3 4.5 4.8l1-1.3 2 .8c-.3 1.3-1.4 2-2.7 1.8A7 7 0 0 1 8 10c-.1-1.3.6-2.4 1.8-2.6l.8 2z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6l8.5 7 8.5-7" />
    </>
  ),
  phone: <path d="M6 3h3l1.5 5-2 1.5a12 12 0 0 0 6 6l1.5-2 5 1.5v3a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2z" />,
  play: <path d="M8 5v14l11-7z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  prev: <path d="M15 5l-7 7 7 7" />,
  next: <path d="M9 5l7 7-7 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  cube: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  diagram: (
    <>
      <path d="M3 4v16M21 4v16M3 8h4M11 8h10M3 16h6M13 16h8" />
      <path d="M7 5v6M11 5v6M9 13v6M13 13v6" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4M9 12h7M9 16h5" />
    </>
  ),
  plc: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h2M7 12h2M7 16h2M13 8h4M13 12h4M13 16h4" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 7v5M12 12l-6 5M12 12l6 5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    </>
  ),
  panel: (
    <>
      <rect x="4" y="2.5" width="16" height="19" rx="1.5" />
      <path d="M8 7h8M8 11h8M8 15h3M15 15h1M12 2.5v19" />
    </>
  ),
  crane: (
    <>
      <path d="M2 6h20M5 6v15M19 6v15M10 6v5M10 11h4v3h-4zM12 14v3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z" />
      <path d="M13 7l-3 5h4l-3 5" />
    </>
  ),
  wrench: <path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5a4 4 0 0 0-2-2zM14.5 6.5l3-3a4 4 0 0 0-3 3z" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
}

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.8 }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  )
}
