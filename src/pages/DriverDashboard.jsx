import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MapPin, Package, Clock, Phone, ChevronRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useApi } from '../hooks/useApi.js'
import { api, setAuthToken } from '../config/api.js'
import Navbar from '../components/layout/Navbar.jsx'
import './DriverDashboard.css'

const DISTRICTS = [
  'Miraflores','San Isidro','Barranco','Surco','La Molina',
  'San Borja','Cercado de Lima','Lince','Jesús María','Magdalena',
  'San Miguel','Pueblo Libre','Breña','Rímac','Los Olivos',
  'San Martín de Porres','Ate','La Victoria','Chorrillos',
]

function OrderCard({ order, onAccept, accepting }) {
  const total = order.items?.reduce((s, i) => s + i.quantity, 0) || 0
  return (
    <div className="dorder">
      <div className="dorder-header">
        <div>
          <p className="dorder-number">#{order.orderNumber?.slice(-8)}</p>
          <p className="dorder-restaurant">{order.restaurant?.name}</p>
          <p className="dorder-address">
            <MapPin size={12} /> {order.restaurant?.address}, {order.restaurant?.district}
          </p>
        </div>
        <span className="dorder-items">{total} {total === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="dorder-delivery">
        <MapPin size={13} />
        <span>{order.deliveryAddress}, {order.deliveryDistrict}</span>
      </div>

      {order.user?.phone && (
        <div className="dorder-phone">
          <Phone size={13} /> {order.user.phone}
        </div>
      )}

      <div className="dorder-footer">
        <span className="dorder-total">S/ {order.total?.toFixed(2)}</span>
        <button
          className="dorder-accept"
          onClick={() => onAccept(order.id)}
          disabled={accepting}
        >
          {accepting ? <Loader2 size={14} className="dorder-spinner" /> : <ChevronRight size={14} />}
          Tomar pedido
        </button>
      </div>
    </div>
  )
}

export default function DriverDashboard() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  useApi() // inyecta token en axios
  const qc = useQueryClient()
  const [district, setDistrict] = useState('')
  const [accepting, setAccepting] = useState(null)

  const getToken = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
    })
    setAuthToken(token)
  }

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['driver-orders', district],
    queryFn: async () => {
      if (!district) return []
      await getToken()
      const { data } = await api.get('/api/v1/drivers/orders/available', { params: { district } })
      return data.data
    },
    enabled: isAuthenticated && !!district,
  })

  const handleAccept = async (orderId) => {
    setAccepting(orderId)
    try {
      await getToken()
      await api.patch(`/api/v1/orders/${orderId}/assign-driver`)
      toast.success('¡Pedido tomado! Dirígete al restaurante.')
      refetch()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al tomar el pedido')
    } finally {
      setAccepting(null)
    }
  }

  return (
    <div className="ddash">
      <Navbar />
      <div className="ddash-inner">
        <h1 className="ddash-title">Panel de repartidor</h1>

        {/* Selector de zona */}
        <div className="ddash-zone">
          <h2 className="ddash-zone-title">
            <MapPin size={18} /> Buscar pedidos por zona
          </h2>
          <select
            className="ddash-select"
            value={district}
            onChange={e => setDistrict(e.target.value)}
          >
            <option value="">Selecciona un distrito</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Lista de pedidos */}
        {!district && (
          <div className="ddash-empty">
            <Package size={40} strokeWidth={1.5} />
            <p>Selecciona un distrito para ver los pedidos disponibles</p>
          </div>
        )}

        {district && isLoading && (
          <div className="ddash-loading">
            <Loader2 size={24} className="ddash-spinner" />
            <p>Buscando pedidos en {district}...</p>
          </div>
        )}

        {district && !isLoading && orders.length === 0 && (
          <div className="ddash-empty">
            <Package size={40} strokeWidth={1.5} />
            <p>No hay pedidos disponibles en <strong>{district}</strong> ahora mismo</p>
            <button className="ddash-refresh" onClick={() => refetch()}>Actualizar</button>
          </div>
        )}

        {orders.length > 0 && (
          <div className="ddash-orders">
            <div className="ddash-orders-header">
              <span>{orders.length} pedido{orders.length !== 1 ? 's' : ''} disponible{orders.length !== 1 ? 's' : ''} en {district}</span>
              <button className="ddash-refresh" onClick={() => refetch()}>↻ Actualizar</button>
            </div>
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={handleAccept}
                accepting={accepting === order.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}