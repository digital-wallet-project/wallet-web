import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { walletService } from '../services/wallet.service'
import { IWallet } from '../types/wallet.types'
import { Navbar } from '../components/Navbar'
import { Button } from '../components/Button'

export function Wallet() {
  const [wallet, setWallet] = useState<IWallet | null>(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchWallet() {
      try {
        const data = await walletService.get()
        setWallet(data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao buscar carteira')
      }
    }
    fetchWallet()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Minha Carteira</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {wallet && (
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
            <div>
              <p className="text-sm text-gray-500">Saldo disponível</p>
              <p className="text-3xl font-bold text-blue-600">
                R$ {Number(wallet.balance).toFixed(2).replace('.', ',')}
              </p>
            </div>
             <div className="flex gap-3">
              <Button label="Depositar" onClick={() => navigate('/transactions/new?type=deposit')} />
              <Button label="Transferir" onClick={() => navigate('/transactions/new?type=transfer')} variant="success" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}