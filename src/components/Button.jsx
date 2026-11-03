import Icon from './Icon.jsx'
import './Button.css'

/**
 * Botão vazado de linha fina; no hover se preenche por completo.
 * variant: 'orange' | 'petrol' | 'light' | 'ink'
 */
export default function Button({ variant = 'orange', size, icon, iconAfter, href, className = '', children, ...rest }) {
  const cls = ['btn', `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(' ')
  const content = (
    <>
      {icon && <Icon name={icon} size={18} className="btn__icon" />}
      <span className="btn__label">{children}</span>
      {iconAfter && <Icon name={iconAfter} size={18} className="btn__icon btn__icon--after" />}
    </>
  )

  if (href) {
    const external = /^https?:/.test(href)
    return (
      <a className={cls} href={href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })} {...rest}>
        {content}
        {external && <span className="sr-only"> (abre em nova aba)</span>}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...rest}>
      {content}
    </button>
  )
}
