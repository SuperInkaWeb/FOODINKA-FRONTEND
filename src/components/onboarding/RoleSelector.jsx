import { Loader2 } from 'lucide-react'
import './RoleSelector.css'

export default function RoleSelector({ onSelect, loading }) {
  return (
    <div className="roleselector">
      <h2 className="roleselector-title">¿Cómo quieres usar Foodinka?</h2>
      <p className="roleselector-sub">Elige el tipo de cuenta que mejor se adapte a ti</p>

      <div className="roleselector-options">
        <button
          className="roleselector-option"
          onClick={() => onSelect('CONSUMER')}
          disabled={loading}
        >
          <span className="roleselector-icon">🍔</span>
          <div>
            <p className="roleselector-label">Soy consumidor</p>
            <p className="roleselector-desc">
              Quiero pedir delivery o hacer reservas en restaurantes
            </p>
          </div>
          <span className="roleselector-arrow">→</span>
        </button>

        <button
          className="roleselector-option roleselector-option--restaurant"
          onClick={() => onSelect('RESTAURANT_OWNER')}
          disabled={loading}
        >
          <span className="roleselector-icon">🏪</span>
          <div>
            <p className="roleselector-label">Tengo un restaurante</p>
            <p className="roleselector-desc">
              Quiero publicar mi restaurante y gestionar pedidos
            </p>
          </div>
          <span className="roleselector-arrow">→</span>
        </button>
      </div>

      {loading && (
        <div className="roleselector-loading">
          <Loader2 size={20} className="roleselector-spinner" />
          Configurando tu cuenta...
        </div>
      )}
    </div>
  )
}