import { Clock, Bike, CalendarCheck, Phone, MapPin, DollarSign } from 'lucide-react'
import './RestaurantInfo.css'

const DAYS = { lun:'Lun', mar:'Mar', mie:'Mié', jue:'Jue', vie:'Vie', sab:'Sáb', dom:'Dom' }

export default function RestaurantInfo({ restaurant }) {
  const {
    description, phone, address, district,
    deliveryFee, minOrderAmount, estimatedTime,
    isDeliveryEnabled, isReservationEnabled,
    openingHours,
  } = restaurant

  return (
    <div className="rinfo">

      {/* Descripción */}
      {description && (
        <div className="rinfo-card">
          <p className="rinfo-desc">{description}</p>
        </div>
      )}

      {/* Servicios + costos */}
      <div className="rinfo-card">
        <h2 className="rinfo-title">Información y costos</h2>
        <div className="rinfo-grid">

          {/* Dirección */}
          <div className="rinfo-item">
            <MapPin size={16} className="rinfo-icon" />
            <div>
              <span className="rinfo-label">Dirección</span>
              <span className="rinfo-value">{address}, {district}</span>
            </div>
          </div>

          {/* Teléfono */}
          {phone && (
            <div className="rinfo-item">
              <Phone size={16} className="rinfo-icon" />
              <div>
                <span className="rinfo-label">Teléfono</span>
                <span className="rinfo-value">{phone}</span>
              </div>
            </div>
          )}

          {/* Tiempo estimado */}
          {estimatedTime && (
            <div className="rinfo-item">
              <Clock size={16} className="rinfo-icon" />
              <div>
                <span className="rinfo-label">Tiempo estimado</span>
                <span className="rinfo-value">{estimatedTime} minutos</span>
              </div>
            </div>
          )}

          {/* Costo de delivery */}
          {isDeliveryEnabled && (
            <div className="rinfo-item">
              <Bike size={16} className="rinfo-icon" />
              <div>
                <span className="rinfo-label">Costo de delivery</span>
                <span className="rinfo-value">
                  {deliveryFee === 0
                    ? <span className="rinfo-free">Gratis 🎉</span>
                    : `S/ ${deliveryFee.toFixed(2)}`
                  }
                </span>
              </div>
            </div>
          )}

          {/* Pedido mínimo */}
          {minOrderAmount && (
            <div className="rinfo-item">
              <DollarSign size={16} className="rinfo-icon" />
              <div>
                <span className="rinfo-label">Pedido mínimo</span>
                <span className="rinfo-value">S/ {minOrderAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

        </div>

        {/* Badges de servicio */}
        <div className="rinfo-badges">
          {isDeliveryEnabled && (
            <span className="rinfo-badge rinfo-badge--delivery">🛵 Delivery disponible</span>
          )}
          {isReservationEnabled && (
            <span className="rinfo-badge rinfo-badge--reservation">📅 Reservas disponibles</span>
          )}
        </div>
      </div>

      {/* Horarios */}
      {openingHours && (
        <div className="rinfo-card">
          <h2 className="rinfo-title">Horarios</h2>
          <div className="rinfo-hours">
            {Object.entries(DAYS).map(([key, label]) => (
              openingHours[key] && (
                <div key={key} className="rinfo-hour-row">
                  <span className="rinfo-hour-day">{label}</span>
                  <span className="rinfo-hour-time">{openingHours[key]}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}

    </div>
  )
}