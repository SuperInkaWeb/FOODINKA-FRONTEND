import { useState } from 'react'
import AdminTable, { AdminTableSearch, AdminTableFilter, AdminTablePagination, StatusBadge } from './AdminTable.jsx'
import { useAdminRestaurants, useAdminMutations } from '../../hooks/useAdmin.js'
import './AdminSection.css'

const STATUS_MAP = {
  ACTIVE:               { label: 'Activo',    bg: '#f0fdf4', color: '#16a34a' },
  PENDING_VERIFICATION: { label: 'Pendiente', bg: '#fffbeb', color: '#b45309' },
  SUSPENDED:            { label: 'Suspendido',bg: '#fef2f2', color: '#dc2626' },
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE',               label: 'Activos' },
  { value: 'PENDING_VERIFICATION', label: 'Pendientes' },
  { value: 'SUSPENDED',            label: 'Suspendidos' },
]

export default function AdminRestaurants() {
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState('')
  const [page,     setPage]     = useState(1)
  const { data, isLoading } = useAdminRestaurants({ search, status, page, limit: 15 })
  const { verifyRestaurant, suspendRestaurant } = useAdminMutations()

  const columns = [
    { key: 'name',     label: 'Restaurante', render: r => (
      <div>
        <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>{r.name}</p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>{r.ruc} · {r.district}</p>
      </div>
    )},
    { key: 'category', label: 'Categoría', width: 110 },
    { key: 'owner',    label: 'Dueño', render: r => (
      <div>
        <p style={{ margin: 0, fontSize: '0.82rem' }}>{r.owner?.name}</p>
        <p style={{ margin: 0, fontSize: '0.72rem', color: '#9ca3af' }}>{r.owner?.email}</p>
      </div>
    )},
    { key: 'orders', label: 'Pedidos', width: 80, render: r => r._count?.orders ?? 0 },
    { key: 'status', label: 'Estado', width: 110, render: r => <StatusBadge status={r.status} map={STATUS_MAP} /> },
    { key: 'actions', label: 'Acciones', width: 160, render: r => (
      <div style={{ display: 'flex', gap: 6 }}>
        {r.status === 'PENDING_VERIFICATION' && (
          <button
            className="atable-action atable-action--green"
            onClick={() => verifyRestaurant.mutate(r.id)}
            disabled={verifyRestaurant.isPending}
          >Aprobar</button>
        )}
        {r.status === 'ACTIVE' && (
          <button
            className="atable-action atable-action--red"
            onClick={() => suspendRestaurant.mutate(r.id)}
            disabled={suspendRestaurant.isPending}
          >Suspender</button>
        )}
        {r.status === 'SUSPENDED' && (
          <button
            className="atable-action atable-action--green"
            onClick={() => verifyRestaurant.mutate(r.id)}
            disabled={verifyRestaurant.isPending}
          >Reactivar</button>
        )}
      </div>
    )},
  ]

  return (
    <div className="admin-section">
      <div className="admin-section-toolbar">
        <AdminTableSearch value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Buscar por nombre o RUC..." />
        <AdminTableFilter value={status} onChange={v => { setStatus(v); setPage(1) }} options={STATUS_OPTIONS} placeholder="Todos los estados" />
      </div>
      <AdminTable columns={columns} data={data?.data} isLoading={isLoading} emptyMsg="No hay restaurantes" />
      <AdminTablePagination page={page} totalPages={data?.pagination?.totalPages} onChange={setPage} />
    </div>
  )
}