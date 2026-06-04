import './OrderStatusBadge.css'

const STATUS_CONFIG = {
  PENDING:    { label: 'Pendiente',   color: '#b45309', bg: '#fffbeb', icon: '⏳' },
  CONFIRMED:  { label: 'Confirmado',  color: '#1d4ed8', bg: '#eff6ff', icon: '✅' },
  PREPARING:  { label: 'Preparando', color: '#c2410c', bg: '#fff7ed', icon: '👨‍🍳' },
  READY:      { label: 'Listo',       color: '#15803d', bg: '#f0fdf4', icon: '🎉' },
  ON_THE_WAY: { label: 'En camino',   color: '#7c3aed', bg: '#f5f3ff', icon: '🛵' },
  DELIVERED:  { label: 'Entregado',   color: '#16a34a', bg: '#f0fdf4', icon: '📦' },
  CANCELLED:  { label: 'Cancelado',   color: '#dc2626', bg: '#fef2f2', icon: '❌' },
}

// Pasos del progreso según tipo de pedido
const DELIVERY_STEPS    = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'ON_THE_WAY', 'DELIVERED']
const RESERVATION_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED']

export default function OrderStatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: '#6b7280', bg: '#f3f4f6', icon: '•' }
  return (
    <span
      className={`osb osb--${size}`}
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.icon} {cfg.label}
    </span>
  )
}

export function OrderProgressBar({ status, type }) {
  const steps  = type === 'DELIVERY' ? DELIVERY_STEPS : RESERVATION_STEPS
  const current = steps.indexOf(status)
  const cancelled = status === 'CANCELLED'

  if (cancelled) return (
    <div className="oprogress oprogress--cancelled">
      ❌ Pedido cancelado
    </div>
  )

  return (
    <div className="oprogress">
      {steps.map((step, i) => {
        const cfg   = STATUS_CONFIG[step]
        const done  = i < current
        const active = i === current
        return (
          <div key={step} className="oprogress-step">
            <div className={`oprogress-dot ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
              {done ? '✓' : cfg.icon}
            </div>
            <span className={`oprogress-label ${active ? 'active' : ''}`}>{cfg.label}</span>
            {i < steps.length - 1 && (
              <div className={`oprogress-line ${done ? 'done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}