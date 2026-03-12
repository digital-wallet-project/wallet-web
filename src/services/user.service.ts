import api from './api'
import { ICreateUser, IUpdateUser } from '../types/user.types'

export const userService = {
  async create(data: ICreateUser) {
    const response = await api.post('/user', data)
    return response.data
  },

  async update(id: string, data: IUpdateUser) {
    const response = await api.put(`/user/${id}`, data)
    console.log('depois do axios')
    return response.data
  },

  async inactivate(id: string) {
    const response = await api.delete(`/user/${id}`)
    return response.data
  },

  async reactivate(id: string) {
    const response = await api.patch(`/user/${id}/reactivate`)
    return response.data
  },

  async getAll(email?: string) {
    const response = await api.get('/user', { params: { email } })
    return response.data
  },
}