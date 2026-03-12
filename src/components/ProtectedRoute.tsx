import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { token, isAdmin } = useAuth()

  if (!token) return <Navigate to="/login" />
  if (adminOnly && !isAdmin) return <Navigate to="/wallet" />

  return <>{children}</>
}