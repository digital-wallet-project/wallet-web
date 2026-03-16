import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { transactionService } from '../services/transaction.service'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Navbar } from '../components/Navbar'

export function NewTransaction() {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'deposit'
  const [amount, setAmount] = useState('')
  const [emailTo, setEmailTo] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit() {
    try {
      setLoading(true)
      setError('')
      if (type === 'deposit') {
        await transactionService.deposit({ amount: Number(amount), description })
      } else {
        await transactionService.transfer({ emailTo, amount: Number(amount), description })
      }
      navigate('/wallet')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar transação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-sm mx-auto mt-10 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {type === 'deposit' ? 'Depositar' : 'Transferir'}
          </h2>
          <div className="flex flex-col gap-4">
            {type === 'transfer' && (
              <Input
                label="Email do destinatário"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="Email"
              />
            )}
            <Input
              label="Valor (R$)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
            />
            <Input
              label="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3">
              <Button label="Cancelar" onClick={() => navigate('/wallet')} variant="danger" />
              <Button label={loading ? 'Processando...' : 'Confirmar'} onClick={handleSubmit} disabled={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}