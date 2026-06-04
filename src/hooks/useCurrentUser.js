import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { api, setAuthToken } from '../config/api.js'

export function useCurrentUser() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  return useQuery({
    queryKey: ['current-user'],
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
}