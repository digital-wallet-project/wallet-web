import api from './api'

export const walletService = {
  async getOwn() {
    const response = await api.get('/wallet')
    return response.data
  },

  async getById(id: string) {
    const response = await api.get(`/wallet/${id}`)
    return response.data
  },
}