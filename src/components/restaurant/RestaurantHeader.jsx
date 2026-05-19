import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './RestaurantHeader.css'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80'

const CATEGORY_LABELS = {
  cevicheria: 'Cevichería', chifa: 'Chifa', fast_food: 'Fast Food',
  pizzeria: 'Pizzería', parrilla: 'Parrilla', heladeria: 'Heladería',
  cafe: 'Café', buffet: 'Buffet', otro: 'Otro',
}

export default function RestaurantHeader({ restaurant }) {
  const navigate = useNavigate()
  const { name, bannerUrl, logoUrl, category, district } = restaurant

  return (
    <div className="rheader">
      {/* Imagen hero */}
      <div className="rheader-hero">
        <img
          src={bannerUrl || PLACEHOLDER}
          alt={name}
          onError={e => { e.target.src = PLACEHOLDER }}
        />
        <div className="rheader-overlay" />

        {/* Botón volver */}
        <button className="rheader-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Volver
        </button>

        {/* Info sobre imagen */}
        <div className="rheader-hero-info">
          {logoUrl && (
            <img src={logoUrl} alt={`Logo ${name}`} className="rheader-logo" />
          )}
          <div>
            <span className="rheader-category">
              {CATEGORY_LABELS[category] || category}
            </span>
            <h1 className="rheader-name">{name}</h1>
            <p className="rheader-district">📍 {district}</p>
          </div>
        </div>
      </div>
    </div>
  )
}