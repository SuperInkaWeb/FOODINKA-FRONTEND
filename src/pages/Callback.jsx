// src/pages/Callback.jsx
import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

export default function Callback() {
  const { isAuthenticated, isLoading, error } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, isLoading])

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Error al iniciar sesión: {error.message}</p>
        <a href="/">Volver al inicio</a>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Procesando login...</p>
    </div>
  )
}