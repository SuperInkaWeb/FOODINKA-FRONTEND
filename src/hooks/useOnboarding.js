import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApi } from './useApi.js'

export function useOnboarding() {
  const { isAuthenticated, isLoading } = useAuth0()
  const [synced, setSynced] = useState(false)
  const api      = useApi()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isLoading || !isAuthenticated || synced) return
    if (['/onboarding', '/callback'].includes(location.pathname)) return

    const sync = async () => {
      try {
        const { data } = await api.post('/api/v1/auth/sync')
        // Solo redirigir al onboarding si es usuario NUEVO
        if (data.message === 'Usuario creado') {
          navigate('/onboarding')
        }
      } catch (err) {
        // 409 = usuario ya existe → no es error, continuar normalmente
        if (err.response?.status !== 409) {
          console.error('Error al sincronizar usuario:', err.message)
        }
      } finally {
        setSynced(true)
      }
    }

    sync()
  }, [isAuthenticated, isLoading, synced, location.pathname])

  return { synced }
}