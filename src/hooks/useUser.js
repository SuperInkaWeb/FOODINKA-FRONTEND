// Hook para obtener el usuario autenticado desde el backend
// Incluye el rol real (no el de Auth0)
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { api, setAuthToken } from '../config/api.js'

export function useUser() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  const query = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      })
      setAuthToken(token)
      const { data } = await api.get('/api/v1/auth/me')
      return data.data
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  return {
    user:        query.data,
    isLoading:   query.isLoading,
    isAdmin:     query.data?.role === 'ADMIN',
    isOwner:     query.data?.role === 'RESTAURANT_OWNER',
    isDriver:    query.data?.role === 'DELIVERY',
    isConsumer:  query.data?.role === 'CONSUMER',
    role:        query.data?.role,
  }
}