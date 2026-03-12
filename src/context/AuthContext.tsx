import { createContext, useContext, useState, ReactNode } from 'react'
import { IUser, RoleEnum } from '../types/user.types'

interface IAuthContext {
  user: IUser | null
  token: string | null
  login: (token: string, user: IUser) => void
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(() => {
    const stored = localStorage.getItem('user')
    try {
      return stored ? JSON.parse(stored) : null
    } catch {
      localStorage.removeItem('user')
      return null
    }
  })

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })

  function login(token: string, user: IUser) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const isAdmin = user?.role === RoleEnum.ADMIN

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}