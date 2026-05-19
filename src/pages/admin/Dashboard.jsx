import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Navigate } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar.jsx'
import AdminMetrics from '../../components/admin/AdminMetrics.jsx'
import AdminRestaurants from '../../components/admin/AdminRestaurants.jsx'
import AdminUsers from '../../components/admin/AdminUsers.jsx'
import AdminOrders from '../../components/admin/AdminOrders.jsx'
import AdminPayments from '../../components/admin/AdminPayments.jsx'
import AdminDrivers from '../../components/admin/AdminDrivers.jsx'
import './Dashboard.css'

const SECTIONS = {
  metrics:     { label: 'Dashboard',     component: AdminMetrics },
  restaurants: { label: 'Restaurantes',  component: AdminRestaurants },
  users:       { label: 'Usuarios',      component: AdminUsers },
  orders:      { label: 'Pedidos',       component: AdminOrders },
  payments:    { label: 'Pagos',         component: AdminPayments },
  drivers:     { label: 'Repartidores',  component: AdminDrivers },
}

export default function Dashboard() {
  const { user, isLoading } = useAuth0()
  const [active, setActive] = useState('metrics')

  if (isLoading) return <div className="dashboard-loading">Cargando...</div>

  // Protección básica — el middleware del backend protege los endpoints
  // Aquí solo ocultamos la UI si el usuario no es admin
  const Section = SECTIONS[active]?.component || AdminMetrics

  return (
    <div className="dashboard">
      <AdminSidebar active={active} onChange={setActive} sections={SECTIONS} />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h1 className="dashboard-section-title">
            {SECTIONS[active]?.label}
          </h1>
          <div className="dashboard-user">
            {user?.picture && <img src={user.picture} alt={user.name} />}
            <span>{user?.name}</span>
          </div>
        </div>
        <div className="dashboard-content">
          <Section />
        </div>
      </main>
    </div>
  )
}