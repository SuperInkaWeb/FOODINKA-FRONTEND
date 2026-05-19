import { useState } from 'react'
import AdminTable, { AdminTableFilter, AdminTablePagination, StatusBadge } from './AdminTable.jsx'
import { useAdminOrders } from '../../hooks/useAdmin.js'
import './AdminSection.css'

const STATUS_MAP = {
  PENDING:    { label: 'Pendiente',   bg: '#fffbeb', color: '#b45309' },
  CONFIRMED:  { label: 'Confirmado',  bg: '#eff6ff', color: '#1d4ed8' },
  PREPARING:  { label: 'Preparando', bg: '#fff7ed', color: '#c2410c' },
  READY:      { label: 'Listo',       bg: '#f0fdf4', color: '#15803d' },
  ON_THE_WAY: { label: 'En camino',   bg: '#f5f3ff', color: '#7c3aed' },
  DELIVERED:  { label: 'Entregado',   bg: '#f0fdf4', color: '#16a34a' },
  CANCELLED:  { label: 'Cancelado',   bg: '#fef2f2', color: '#dc2626' },
}

const STATUS_OPTIONS = Object.entries(STATUS_MAP).map(([v, { label }]) => ({ value: v, label }))
const TYPE_OPTIONS   = [{ value: 'DELIVERY', label: 'Delivery' }, { value: 'RESERVATION', label: 'Reserva' }]

export default function AdminOrders() {
  const [status, setStatus] = useState('')
  const [type,   setType]   = useState('')
  const [page,   setPage]   = useState(1)
  const { data, isLoading } = useAdminOrders({ status, type, page, limit: 15 })

  const columns = [
    { key: 'orderNumber', label: '#Pedido', width: 130, render: o => (
      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#6366f1', fontWeight: 700 }}>
        {o.orderNumber?.slice(-8)}
      </span>
    )},
    { key: 'user',       label: 'Cliente',     render: o => o.user?.name || '—' },
    { key: 'restaurant', label: 'Restaurante', render: o => o.restaurant?.name || '—' },
    { key: 'type',   label: 'Tipo',   width: 90,  render: o => o.type === 'DELIVERY' ? '🛵 Delivery' : '📅 Reserva' },
    { key: 'total',  label: 'Total',  width: 90,  render: o => `S/ ${o.total?.toFixed(2)}` },
    { key: 'payment',label: 'Pago',   width: 90,  render: o => o.payment?.status === 'PAID' ? '✅ Pagado' : '⏳ Pendiente' },
    { key: 'status', label: 'Estado', width: 120, render: o => <StatusBadge status={o.status} map={STATUS_MAP} /> },
    { key: 'date',   label: 'Fecha',  width: 100, render: o => new Date(o.createdAt).toLocaleDateString('es-PE') },
  ]

  return (
    <div className="admin-section">
      <div className="admin-section-toolbar">
        <AdminTableFilter value={status} onChange={v => { setStatus(v); setPage(1) }} options={STATUS_OPTIONS} placeholder="Todos los estados" />
        <AdminTableFilter value={type}   onChange={v => { setType(v);   setPage(1) }} options={TYPE_OPTIONS}   placeholder="Todos los tipos" />
      </div>
      <AdminTable columns={columns} data={data?.data} isLoading={isLoading} emptyMsg="No hay pedidos" />
      <AdminTablePagination page={page} totalPages={data?.pagination?.totalPages} onChange={setPage} />
    </div>
  )
}