import './OrderTypeSelector.css'

export default function OrderTypeSelector({ value, onChange }) {
  return (
    <div className="ots">
      <button
        className={`ots-option ${value === 'DELIVERY' ? 'ots-option--active' : ''}`}
        onClick={() => onChange('DELIVERY')}
      >
        <span className="ots-icon">🛵</span>
        <div>
          <p className="ots-label">Delivery</p>
          <p className="ots-desc">Recibe tu pedido en casa</p>
        </div>
        <span className="ots-check">{value === 'DELIVERY' ? '✓' : ''}</span>
      </button>

      <button
        className={`ots-option ${value === 'RESERVATION' ? 'ots-option--active' : ''}`}
        onClick={() => onChange('RESERVATION')}
      >
        <span className="ots-icon">📅</span>
        <div>
          <p className="ots-label">Reserva en local</p>
          <p className="ots-desc">Come en el restaurante</p>
        </div>
        <span className="ots-check">{value === 'RESERVATION' ? '✓' : ''}</span>
      </button>
    </div>
  )
}