import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function RequireAuth({ children }) {
  const { token } = useAuth()
  const location = useLocation()

  // LA SOLUCIÓN: Si la URL trae datos de Microsoft, pausamos al guardia para que MSAL pueda trabajar
  if (window.location.hash.includes("code=") || window.location.hash.includes("state=") || window.location.hash.includes("session_state=")) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
        <h2 className="text-primary font-bold text-2xl">Procesando inicio de sesión con Microsoft...</h2>
      </div>
    );
  }

  const storedToken = token || localStorage.getItem("token")

  if (!storedToken) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export function RequireAdmin({ children }) {
  const { role } = useAuth()
  const currentRole = role || localStorage.getItem("role") || 'administrador'

  if (currentRole !== 'administrador') {
    return <div>No autorizado (solo administrador).</div>
  }
  
  return children
}