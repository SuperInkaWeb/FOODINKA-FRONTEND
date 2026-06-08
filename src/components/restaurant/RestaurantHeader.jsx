import { ArrowLeft, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './RestaurantHeader.css'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80'

const CATEGORY_COLORS = {
  cevicheria: '#0ea5e9', chifa: '#f59e0b', fast_food: '#ef4444',
  pizzeria: '#8b5cf6', parrilla: '#e85d24', heladeria: '#ec4899',
  cafe: '#78716c', buffet: '#16a34a', otro: '#6b7280',
}
const CATEGORY_LABELS = {
  cevicheria: 'Cevichería', chifa: 'Chifa', fast_food: 'Fast Food',
  pizzeria: 'Pizzería', parrilla: 'Parrilla', heladeria: 'Heladería',
  cafe: 'Café', buffet: 'Buffet', otro: 'Otro',
}

// Iniciales para cuando no hay logo
function LogoFallback({ name, color }) {
  const initials = name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'
  return (
    <div className="rheader-logo-fallback" style={{ background: color + '33', color }}>
      {initials}
    </div>
  )
}

export default function RestaurantHeader({ restaurant }) {
  const navigate = useNavigate()
  const { name, bannerUrl, logoUrl, category, district } = restaurant
  const catColor = CATEGORY_COLORS[category] || '#6b7280'
  const catLabel = CATEGORY_LABELS[category]  || category

  return (
    <div className="rheader">
      <div className="rheader-hero">
        {/* Banner */}
        <img
          className="rheader-banner"
          src={bannerUrl || PLACEHOLDER}
          alt={name}
          onError={e => { e.target.src = PLACEHOLDER }}
        />
        <div className="rheader-overlay" />

        {/* Botón volver */}
        <button className="rheader-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Volver
        </button>

        {/* Info — siempre abajo a la izquierda */}
        <div className="rheader-info">
          {/* Logo o iniciales */}
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`Logo ${name}`}
              className="rheader-logo"
              onError={e => { e.target.style.display = 'none' }}
            />
          ) : (
            <LogoFallback name={name} color={catColor} />
          )}

          <div className="rheader-text">
            <span className="rheader-badge" style={{ background: catColor }}>
              {catLabel}
            </span>
            <h1 className="rheader-name">{name}</h1>
            <p className="rheader-district">
              <MapPin size={13} /> {district}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}