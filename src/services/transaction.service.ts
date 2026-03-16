import api from './api'
import { IDeposit, ITransfer, TransactionTypeEnum } from '../types/transaction.types'

export const transactionService = {
  async deposit(data: IDeposit) {
    const response = await api.post('/transaction/deposit', data)
    return response.data
  },

  async transfer(data: ITransfer) {
    const response = await api.post('/transaction/transfer', data)
    return response.data
  },

  async reversal(transactionId: string) {
    const response = await api.put(`/transaction/${transactionId}/reversal`)
    return response.data
  },

  async getAll(type?: TransactionTypeEnum) {
    const response = await api.get('/transaction', { params: { type } })
    return response.data
  },
}