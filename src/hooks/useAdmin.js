import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { api, setAuthToken } from '../config/api.js'
import toast from 'react-hot-toast'

// ── Helper: obtiene token fresco y lo inyecta en axios ────────
function useAuthenticatedQuery(queryKey, endpoint, params = {}, options = {}) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      // 1. Obtener token antes de cada request
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      })
      setAuthToken(token)

      // 2. Hacer la request
      const { data } = await api.get(endpoint, { params })
      return data
    },
    enabled: isAuthenticated,  // no ejecutar hasta tener sesión
    placeholderData: (prev) => prev,
    ...options,
  })
}

// ── Métricas ──────────────────────────────────────────────────
export function useMetrics() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  return useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      })
      setAuthToken(token)
      const { data } = await api.get('/api/v1/admin/metrics')
      return data.data
    },
    enabled: isAuthenticated,
    refetchInterval: 60000,
  })
}

export function useRevenueChart() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  return useQuery({
    queryKey: ['admin', 'revenue-chart'],
    queryFn: async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      })
      setAuthToken(token)
      const { data } = await api.get('/api/v1/admin/metrics/revenue')
      return data.data
    },
    enabled: isAuthenticated,
  })
}

// ── Tablas ────────────────────────────────────────────────────
export function useAdminUsers(params = {}) {
  return useAuthenticatedQuery('admin-users', '/api/v1/admin/users', params)
}

export function useAdminRestaurants(params = {}) {
  return useAuthenticatedQuery('admin-restaurants', '/api/v1/admin/restaurants', params)
}

export function useAdminOrders(params = {}) {
  return useAuthenticatedQuery('admin-orders', '/api/v1/admin/orders', params)
}

export function useAdminPayments(params = {}) {
  return useAuthenticatedQuery('admin-payments', '/api/v1/admin/payments', params)
}

export function useAdminDrivers(params = {}) {
  return useAuthenticatedQuery('admin-drivers', '/api/v1/admin/drivers', params)
}

// ── Mutaciones ────────────────────────────────────────────────
export function useAdminMutations() {
  const { getAccessTokenSilently } = useAuth0()
  const qc = useQueryClient()

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin'] })

  const withToken = async (fn) => {
    const token = await getAccessTokenSilently({
      authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
    })
    setAuthToken(token)
    return fn()
  }

  const verifyRestaurant = useMutation({
    mutationFn: (id) => withToken(() => api.patch(`/api/v1/admin/restaurants/${id}/verify`)),
    onSuccess: () => { toast.success('Restaurante verificado'); invalidate() },
    onError:   () => toast.error('Error al verificar restaurante'),
  })

  const suspendRestaurant = useMutation({
    mutationFn: (id) => withToken(() => api.patch(`/api/v1/admin/restaurants/${id}/suspend`)),
    onSuccess: () => { toast.success('Restaurante suspendido'); invalidate() },
    onError:   () => toast.error('Error al suspender restaurante'),
  })

  const toggleUser = useMutation({
    mutationFn: (id) => withToken(() => api.patch(`/api/v1/admin/users/${id}/toggle`)),
    onSuccess: () => { toast.success('Usuario actualizado'); invalidate() },
    onError:   () => toast.error('Error al actualizar usuario'),
  })

  const changeRole = useMutation({
    mutationFn: ({ id, role }) => withToken(() => api.patch(`/api/v1/admin/users/${id}/role`, { role })),
    onSuccess: () => { toast.success('Rol actualizado'); invalidate() },
    onError:   () => toast.error('Error al cambiar rol'),
  })

  const verifyDriver = useMutation({
    mutationFn: (id) => withToken(() => api.patch(`/api/v1/admin/drivers/${id}/verify`)),
    onSuccess: () => { toast.success('Repartidor verificado'); invalidate() },
    onError:   () => toast.error('Error al verificar repartidor'),
  })

  const suspendDriver = useMutation({
    mutationFn: (id) => withToken(() => api.patch(`/api/v1/admin/drivers/${id}/suspend`)),
    onSuccess: () => { toast.success('Repartidor suspendido'); invalidate() },
    onError:   () => toast.error('Error al suspender repartidor'),
  })

  return { verifyRestaurant, suspendRestaurant, toggleUser, changeRole, verifyDriver, suspendDriver }
}