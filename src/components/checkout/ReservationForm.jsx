import './CheckoutForm.css'

// Horas disponibles cada 30 minutos de 11:00 a 22:00
const HOURS = Array.from({ length: 23 }, (_, i) => {
  const hour = Math.floor(i / 2) + 11
  const min  = i % 2 === 0 ? '00' : '30'
  if (hour > 22) return null
  return `${String(hour).padStart(2, '0')}:${min}`
}).filter(Boolean)

// Fecha mínima: mañana
function getMinDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

// Fecha máxima: 30 días
function getMaxDate() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

export default function ReservationForm({
  date, onDateChange,
  time, onTimeChange,
  partySize, onPartySizeChange,
}) {
  return (
    <div className="chkform">

      <div className="chkform-row">
        <div className="chkform-field">
          <label className="chkform-label">Fecha de la reserva *</label>
          <input
            className="chkform-input"
            type="date"
            min={getMinDate()}
            max={getMaxDate()}
            value={date}
            onChange={e => onDateChange(e.target.value)}
          />
        </div>

        <div className="chkform-field">
          <label className="chkform-label">Hora *</label>
          <select
            className="chkform-input"
            value={time}
            onChange={e => onTimeChange(e.target.value)}
          >
            <option value="">Selecciona una hora</option>
            {HOURS.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="chkform-field">
        <label className="chkform-label">Número de personas *</label>
        <div className="chkform-counter">
          <button
            className="chkform-counter-btn"
            type="button"
            onClick={() => onPartySizeChange(Math.max(1, partySize - 1))}
          >−</button>
          <span className="chkform-counter-value">{partySize}</span>
          <button
            className="chkform-counter-btn"
            type="button"
            onClick={() => onPartySizeChange(Math.min(50, partySize + 1))}
          >+</button>
          <span className="chkform-counter-label">
            {partySize === 1 ? 'persona' : 'personas'}
          </span>
        </div>
      </div>

      <div className="chkform-info">
        📌 La reserva incluye los platos pre-seleccionados del carrito.
        El restaurante confirmará tu reserva.
      </div>

    </div>
  )
}