import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { api, setAuthToken } from '../config/api.js'
import toast from 'react-hot-toast'

async function withAuth(getAccessTokenSilently) {
  const token = await getAccessTokenSilently({
    authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
  })
  setAuthToken(token)
}

// ── Actualizar nombre/teléfono ─────────────────────────────────
export function useUpdateProfile() {
  const { getAccessTokenSilently } = useAuth0()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      await withAuth(getAccessTokenSilently)
      const res = await api.patch('/api/v1/auth/me', data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Perfil actualizado')
      qc.invalidateQueries({ queryKey: ['current-user'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Error al actualizar perfil'),
  })
}

// ── Actualizar restaurante ─────────────────────────────────────
export function useUpdateRestaurant(restaurantId) {
  const { getAccessTokenSilently } = useAuth0()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      await withAuth(getAccessTokenSilently)
      const res = await api.put(`/api/v1/restaurants/${restaurantId}`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Restaurante actualizado')
      qc.invalidateQueries({ queryKey: ['current-user'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Error al actualizar restaurante'),
  })
}

// ── Productos del restaurante ──────────────────────────────────
export function useRestaurantProducts(restaurantId) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  return useQuery({
    queryKey: ['restaurant-products', restaurantId],
    queryFn: async () => {
      await withAuth(getAccessTokenSilently)
      const res = await api.get(`/api/v1/products/restaurant/${restaurantId}`)
      return res.data.data || []
    },
    enabled: isAuthenticated && !!restaurantId,
  })
}

// ── Crear producto ─────────────────────────────────────────────
export function useCreateProduct(restaurantId) {
  const { getAccessTokenSilently } = useAuth0()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      await withAuth(getAccessTokenSilently)
      const res = await api.post(`/api/v1/products/restaurant/${restaurantId}`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Producto añadido al menú')
      qc.invalidateQueries({ queryKey: ['restaurant-products', restaurantId] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Error al crear producto'),
  })
}

// ── Editar producto ────────────────────────────────────────────
export function useUpdateProduct(restaurantId) {
  const { getAccessTokenSilently } = useAuth0()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      await withAuth(getAccessTokenSilently)
      const res = await api.put(`/api/v1/products/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Producto actualizado')
      qc.invalidateQueries({ queryKey: ['restaurant-products', restaurantId] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Error al actualizar producto'),
  })
}

// ── Eliminar producto ──────────────────────────────────────────
export function useDeleteProduct(restaurantId) {
  const { getAccessTokenSilently } = useAuth0()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await withAuth(getAccessTokenSilently)
      await api.delete(`/api/v1/products/${id}`)
    },
    onSuccess: () => {
      toast.success('Producto eliminado')
      qc.invalidateQueries({ queryKey: ['restaurant-products', restaurantId] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Error al eliminar producto'),
  })
}

// ── Toggle disponibilidad ──────────────────────────────────────
export function useToggleProduct(restaurantId) {
  const { getAccessTokenSilently } = useAuth0()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await withAuth(getAccessTokenSilently)
      const res = await api.patch(`/api/v1/products/${id}/availability`)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['restaurant-products', restaurantId] }),
    onError: (err) => toast.error(err?.response?.data?.message || 'Error'),
  })
}

// ── Actualizar vehículo del repartidor ─────────────────────────
export function useUpdateDriverVehicle() {
  const { getAccessTokenSilently } = useAuth0()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ vehicleType, licensePlate }) => {
      await withAuth(getAccessTokenSilently)
      const res = await api.patch('/api/v1/drivers/vehicle', { vehicleType, licensePlate })
      return res.data
    },
    onSuccess: () => {
      toast.success('Vehículo actualizado ✅')
      qc.invalidateQueries({ queryKey: ['current-user'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Error al actualizar vehículo'),
  })
}

// ── Conectar la cuenta de Mercado Pago del restaurante ──────────
// Pide al backend la URL de autorización y redirige (sale del sitio).
export function useConnectMercadoPago() {
  const { getAccessTokenSilently } = useAuth0()
  return useMutation({
    mutationFn: async () => {
      await withAuth(getAccessTokenSilently)
      const res = await api.get('/api/v1/restaurants/mercadopago/connect')
      return res.data
    },
    onSuccess: (data) => {
      window.location.href = data.data.authUrl
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Error al conectar con Mercado Pago'),
  })
}

// ── Desconectar la cuenta de Mercado Pago ───────────────────────
export function useDisconnectMercadoPago() {
  const { getAccessTokenSilently } = useAuth0()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await withAuth(getAccessTokenSilently)
      const res = await api.delete('/api/v1/restaurants/mercadopago/disconnect')
      return res.data
    },
    onSuccess: () => {
      toast.success('Cuenta de Mercado Pago desconectada')
      qc.invalidateQueries({ queryKey: ['current-user'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Error al desconectar'),
  })
}