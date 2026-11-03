import Icon from './Icon.jsx'
import './Button.css'

/** Onda que sai do ponto do clique */
function ripple(e) {
  const btn = e.currentTarget
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2.2
  const span = document.createElement('span')
  span.className = 'btn__ripple'
  span.style.width = span.style.height = `${size}px`
  // Teclado (sem coordenadas) → onda a partir do centro
  const x = e.clientX ? e.clientX - rect.left : rect.width / 2
  const y = e.clientY ? e.clientY - rect.top : rect.height / 2
  span.style.left = `${x - size / 2}px`
  span.style.top = `${y - size / 2}px`
  btn.appendChild(span)
  span.addEventListener('animationend', () => span.remove())
}

/**
 * Botão arredondado e vazado. No hover/foco o preenchimento entra da esquerda;
 * no clique, uma onda sai do ponto tocado.
 * variant: 'orange' | 'petrol' | 'light' | 'ink'
 */
export default function Button({ variant = 'orange', size, icon, iconAfter, href, className = '', children, onClick, ...rest }) {
  const cls = ['btn', `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(' ')
  const content = (
    <>
      {icon && <Icon name={icon} size={18} className="btn__icon" />}
      <span className="btn__label">{children}</span>
      {iconAfter && <Icon name={iconAfter} size={18} className="btn__icon btn__icon--after" />}
    </>
  )
  const handleClick = (e) => {
    ripple(e)
    onClick?.(e)
  }

  if (href) {
    const external = /^https?:/.test(href)
    return (
      <a
        className={cls}
        href={href}
        onClick={handleClick}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        {...rest}
      >
        {content}
        {external && <span className="sr-only"> (abre em nova aba)</span>}
      </a>
    )
  }
  return (
    <button type="button" className={cls} onClick={handleClick} {...rest}>
      {content}
    </button>
  )
}
