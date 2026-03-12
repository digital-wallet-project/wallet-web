import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function parseJwt(token: string) {
    const base64 = token.split('.')[1]
    return JSON.parse(atob(base64))
  }
  
  async function handleLogin() {
    try {
      setLoading(true)
      setError('')
      const data = await authService.login(email, password)
      const payload = parseJwt(data.token)
      const user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        name: payload.name,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      }
      login(data.token, user)
      navigate('/wallet')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Wallet</h1>
        <div className="flex flex-col gap-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
          <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button label={loading ? 'Entrando...' : 'Entrar'} onClick={handleLogin} disabled={loading} />
          <p className="text-sm text-center text-gray-500">
            Não tem conta?{' '}
            <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/register')}>
              Criar conta
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}