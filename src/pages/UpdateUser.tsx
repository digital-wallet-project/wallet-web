import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/user.service'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Navbar } from '../components/Navbar'

export function UpdateUser() {
  const { user, logout } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleUpdate() {
    console.log('clicou no botão atualizar')
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      console.log('chamando userService.update')

      const payload: any = {}

      if (name) payload.name = name
      if (email) payload.email = email
      if (password) payload.password = password

      await userService.update(user!.id, payload)
      console.log('requisição enviada')

      setSuccess('Dados atualizados com sucesso!')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar dados')
    } finally {
      setLoading(false)
    }
  }

  async function handleInactivate() {
    if (!confirm('Tem certeza que deseja inativar sua conta?')) return
    try {
      await userService.inactivate(user!.id)
      logout()
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao inativar conta')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-sm mx-auto mt-10 px-4 flex flex-col gap-6">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Minha Conta</h2>
          <div className="flex flex-col gap-4">
            <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Nova senha (opcional)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button label={loading ? 'Salvando...' : 'Salvar alterações'} onClick={handleUpdate} disabled={loading} />
            <Button label="Inativar minha conta" onClick={handleInactivate} variant="danger" />
          </div>
        </div>
      </div>
    </div>
  )
}