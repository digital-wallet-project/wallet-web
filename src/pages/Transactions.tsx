import { useEffect, useState } from 'react'
import { transactionService } from '../services/transaction.service'
import { walletService } from '../services/wallet.service'
import { ITransaction, TransactionStatusEnum, TransactionTypeEnum } from '../types/transaction.types'
import { Navbar } from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'

export function Transactions() {
  const [transactions, setTransactions] = useState<ITransaction[]>([])
  const [filter, setFilter] = useState<TransactionTypeEnum | undefined>(undefined)
  const [walletId, setWalletId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const { isAdmin } = useAuth()

  useEffect(() => {
    async function fetchWalletId() {
      try {
        const wallet = await walletService.get()
        setWalletId(wallet.id)
      } catch {}
    }
    fetchWalletId()
  }, [])

  async function fetchTransactions(type?: TransactionTypeEnum) {
    try {
      setError('')
      const data = await transactionService.getAll(type)
      setTransactions(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar transações')
    }
  }

  useEffect(() => {
    fetchTransactions(filter)
  }, [filter])

  async function handleReversal(transactionId: string) {
    if (!confirm('Tem certeza que deseja estornar esta transação?')) return
    try {
      await transactionService.reversal(transactionId)
      fetchTransactions(filter)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao estornar transação')
    }
  }

  function getDirection(tx: any) {
    if(isAdmin) return null
    if (tx.type !== TransactionTypeEnum.TRANSFER) return null
    if (tx.walletFromId === walletId) {
      return { signal: '-', color: 'text-red-500', label: 'Para', email: tx.WalletTo?.User?.email }
    }
    return { signal: '+', color: 'text-green-500', label: 'De', email: tx.WalletFrom?.User?.email }
  }

  const typeLabel: Record<string, string> = {
    DEPOSIT: 'Depósito',
    TRANSFER: 'Transferência',
    REVERSAL: 'Estorno',
  }

  const statusLabel: Record<string, string> = {
    PENDING: 'Pendente',
    COMPLETED: 'Concluído',
    REVERSED: 'Estornado',
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Transações</h2>
        <div className="flex gap-2 mb-6">
          <button onClick={() => setFilter(undefined)} className={`px-3 py-1 rounded text-sm ${!filter ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}>Todas</button>
          <button onClick={() => setFilter(TransactionTypeEnum.DEPOSIT)} className={`px-3 py-1 rounded text-sm ${filter === TransactionTypeEnum.DEPOSIT ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}>Depósitos</button>
          <button onClick={() => setFilter(TransactionTypeEnum.TRANSFER)} className={`px-3 py-1 rounded text-sm ${filter === TransactionTypeEnum.TRANSFER ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}>Transferências</button>
          <button onClick={() => setFilter(TransactionTypeEnum.REVERSAL)} className={`px-3 py-1 rounded text-sm ${filter === TransactionTypeEnum.REVERSAL ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}>Estornos</button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex flex-col gap-3">
          {transactions.length === 0 && (
            <p className="text-gray-500 text-sm">Nenhuma transação encontrada.</p>
          )}
          {transactions.map((tx) => {
            const direction = getDirection(tx)
            return (
              <div key={tx.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{typeLabel[tx.type]}</p>
                    <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString('pt-BR')}</p>
                    <p className="text-xs text-gray-400">{statusLabel[tx.status]}</p>
                    {tx.description && <p className="text-xs text-gray-400">{tx.description}</p>}

                    {/* USER */}
                    {!isAdmin && direction && (
                      <p className="text-xs text-gray-400 mt-1">
                        {direction.label}: {direction.email}
                      </p>
                    )}

                    {/* ADMIN - transfer*/}
                    {isAdmin && tx.type === TransactionTypeEnum.TRANSFER && (
                      <div className="mt-1">
                        <p className="text-xs text-gray-400">De: {(tx as any).WalletFrom?.User?.email}</p>
                        <p className="text-xs text-gray-400">Para: {(tx as any).WalletTo?.User?.email}</p>
                      </div>
                    )}

                    {/* ADMIN - deposit */}
                    {isAdmin && tx.type === TransactionTypeEnum.DEPOSIT && (
                      <div className="mt-1">
                        <p className="text-xs text-gray-400">{(tx as any).WalletTo?.User?.email}</p>
                      </div>
                    )}

                    {/* ADMIN - reversal */}
                    {isAdmin && tx.type === TransactionTypeEnum.REVERSAL && (
                      <div className="mt-1">
                        <p className="text-xs text-gray-400">De: {(tx as any).WalletFrom?.User?.email}</p>
                        <p className="text-xs text-gray-400">Para: {(tx as any).WalletTo?.User?.email}</p>
                      </div>
                    )}
                  </div>                  
                  <div className="flex items-center gap-4">
                    <p className={`font-bold ${direction ? direction.color : 'text-blue-600'}`}>
                      {direction?.signal} R$ {Number(tx.amount).toFixed(2).replace('.', ',')}
                    </p>
                    {isAdmin && tx.type === TransactionTypeEnum.TRANSFER && tx.status === TransactionStatusEnum.COMPLETED && (
                      <Button label="Estornar" onClick={() => handleReversal(tx.id)} variant="danger" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}