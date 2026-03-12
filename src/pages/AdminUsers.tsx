import { useEffect, useState } from 'react'
import { userService } from '../services/user.service'
import { IUserSummary } from '../types/user.types'
import { Navbar } from '../components/Navbar'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export function AdminUsers() {
  const [users, setUsers] = useState<IUserSummary[]>([])
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [successMap, setSuccessMap] = useState<Record<string, string>>({})
  const [errorMap, setErrorMap] = useState<Record<string, string>>({})

  async function fetchUsers(emailFilter?: string) {
    try {
      setError('')
      const data = await userService.getAll(emailFilter)
      setUsers(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar usuários')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  async function handleInactivate(id: string) {
    if (!confirm('Tem certeza que deseja inativar este usuário?')) return
    try {
      setErrorMap((prev) => ({ ...prev, [id]: '' }))
      await userService.inactivate(id)
      setSuccessMap((prev) => ({ ...prev, [id]: 'Inativado com sucesso!' }))
      fetchUsers(email)
    } catch (err: any) {
      setErrorMap((prev) => ({ ...prev, [id]: err.response?.data?.message || 'Erro ao inativar' }))
    }
  }

  async function handleReactivate(id: string) {
    if (!confirm('Tem certeza que deseja reativar este usuário?')) return
    try {
      setErrorMap((prev) => ({ ...prev, [id]: '' }))
      await userService.reactivate(id)
      setSuccessMap((prev) => ({ ...prev, [id]: 'Reativado com sucesso!' }))
      fetchUsers(email)
    } catch (err: any) {
      setErrorMap((prev) => ({ ...prev, [id]: err.response?.data?.message || 'Erro ao reativar' }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Gerenciar Usuários</h2>
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <Input label="" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Filtrar por email" />
          </div>
          <div className="mt-1">
            <Button label="Buscar" onClick={() => fetchUsers(email)} />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex flex-col gap-3">
          {users.length === 0 && <p className="text-gray-500 text-sm">Nenhum usuário encontrado.</p>}
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
                <p className={`text-xs mt-1 ${u.isActive ? 'text-green-500' : 'text-red-500'}`}>
                  {u.isActive ? 'Ativo' : 'Inativo'}
                </p>
                {successMap[u.id] && <p className="text-green-500 text-xs">{successMap[u.id]}</p>}
                {errorMap[u.id] && <p className="text-red-500 text-xs">{errorMap[u.id]}</p>}
              </div>
              <div className="flex gap-2">
                {u.isActive
                  ? <Button label="Inativar" onClick={() => handleInactivate(u.id)} variant="danger" />
                  : <Button label="Reativar" onClick={() => handleReactivate(u.id)} variant="success" />
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}