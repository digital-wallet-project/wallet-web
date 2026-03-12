import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/user.service'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export function CreateUser() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleCreate() {
    try {
      setLoading(true)
      setError('')
      await userService.create({ name, email, password })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Criar Conta</h1>
        <div className="flex flex-col gap-4">
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
          <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button label={loading ? 'Criando...' : 'Criar conta'} onClick={handleCreate} disabled={loading} />
          <p className="text-sm text-center text-gray-500">
            Já tem conta?{' '}
            <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/login')}>
              Entrar
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}