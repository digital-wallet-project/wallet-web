export enum TransactionTypeEnum {
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
  REVERSAL = 'REVERSAL',
}

export enum TransactionStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REVERSED = 'REVERSED',
}

export interface ITransaction {
  id: string
  walletFromId: string | null
  walletToId: string | null
  reversedTransactionId: string | null
  type: TransactionTypeEnum
  status: TransactionStatusEnum
  amount: number
  description: string | null
  createdAt: string
}

export interface IDeposit {
  amount: number
  description?: string
}

export interface ITransfer {
  emailTo: string
  amount: number
  description?: string
}