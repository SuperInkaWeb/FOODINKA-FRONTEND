import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { api, setAuthToken } from '../config/api.js'

export function useApi() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  useEffect(() => {
    if (!isAuthenticated) return
    getAccessTokenSilently({
      authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
    }).then(setAuthToken).catch(console.error)
  }, [isAuthenticated, getAccessTokenSilently])

  return api
}