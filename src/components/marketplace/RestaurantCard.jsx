import { useNavigate } from 'react-router-dom'
import { Clock, Star, Bike, CalendarCheck, ChevronRight } from 'lucide-react'
import './RestaurantCard.css'

// Imagen por defecto si el restaurante no tiene banner
const PLACEHOLDER = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'

// Mapeo de categoría a color del badge
const CATEGORY_COLORS = {
  cevicheria: '#0ea5e9',
  chifa:      '#f59e0b',
  fast_food:  '#ef4444',
  pizzeria:   '#8b5cf6',
  parrilla:   '#e85d24',
  heladeria:  '#ec4899',
  cafe:       '#78716c',
  buffet:     '#16a34a',
  otro:       '#6b7280',
}

const CATEGORY_LABELS = {
  cevicheria: 'Cevichería',
  chifa:      'Chifa',
  fast_food:  'Fast Food',
  pizzeria:   'Pizzería',
  parrilla:   'Parrilla',
  heladeria:  'Heladería',
  cafe:       'Café',
  buffet:     'Buffet',
  otro:       'Otro',
}

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate()

  const {
    id,
    name,
    category,
    description,
    bannerUrl,
    logoUrl,
    district,
    deliveryFee,
    estimatedTime,
    isDeliveryEnabled,
    isReservationEnabled,
    minOrderAmount,
    _count,
  } = restaurant

  const categoryColor = CATEGORY_COLORS[category] || '#6b7280'
  const categoryLabel = CATEGORY_LABELS[category]  || category

  return (
    <article
      className="rcard"
      onClick={() => navigate(`/restaurant/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/restaurant/${id}`)}
    >
      {/* Imagen banner */}
      <div className="rcard-image">
        <img
          src={bannerUrl || PLACEHOLDER}
          alt={name}
          loading="lazy"
          onError={e => { e.target.src = PLACEHOLDER }}
        />

        {/* Badge categoría */}
        <span
          className="rcard-badge"
          style={{ background: categoryColor }}
        >
          {categoryLabel}
        </span>

        {/* Íconos de servicio */}
        <div className="rcard-services">
          {isDeliveryEnabled && (
            <span className="rcard-service" title="Delivery disponible">
              🛵
            </span>
          )}
          {isReservationEnabled && (
            <span className="rcard-service" title="Reservas disponibles">
              📅
            </span>
          )}
        </div>
      </div>

      {/* Cuerpo */}
      <div className="rcard-body">

        {/* Header: logo + nombre */}
        <div className="rcard-header">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`Logo ${name}`}
              className="rcard-logo"
            />
          )}
          <div className="rcard-title-wrap">
            <h3 className="rcard-name">{name}</h3>
            <p className="rcard-district">📍 {district}</p>
          </div>
        </div>

        {/* Descripción */}
        {description && (
          <p className="rcard-desc">{description}</p>
        )}

        {/* Info: tiempo + delivery fee */}
        <div className="rcard-meta">
          {estimatedTime && (
            <span className="rcard-meta-item">
              <Clock size={13} />
              {estimatedTime} min
            </span>
          )}

          {isDeliveryEnabled && (
            <span className="rcard-meta-item">
              <Bike size={13} />
              {deliveryFee === 0
                ? 'Delivery gratis'
                : `S/ ${deliveryFee.toFixed(2)} delivery`
              }
            </span>
          )}

          {minOrderAmount && (
            <span className="rcard-meta-item rcard-meta-min">
              Mín. S/ {minOrderAmount.toFixed(2)}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="rcard-footer">
          <span className="rcard-orders">
            {_count?.orders ?? 0} pedidos
          </span>
          <span className="rcard-cta">
            Ver menú <ChevronRight size={14} />
          </span>
        </div>

      </div>
    </article>
  )
}