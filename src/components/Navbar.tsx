import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from './Button'

export function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg cursor-pointer" onClick={() => navigate('/wallet')}>
          Wallet
        </span>
        <span className="cursor-pointer text-sm hover:underline" onClick={() => navigate('/account')}>
          Minha Conta
        </span>
        {isAdmin && (
          <span className="cursor-pointer text-sm hover:underline" onClick={() => navigate('/admin/users')}>
            Usuários
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">{user?.name}</span>
        <Button label="Sair" onClick={handleLogout} variant="danger" />
      </div>
    </nav>
  )
}