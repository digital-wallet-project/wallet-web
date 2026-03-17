import api from './api'

export const walletService = {
  async get() {
    const response = await api.get('/wallet')
    return response.data
  },
}