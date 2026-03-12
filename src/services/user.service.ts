import api from './api'
import { ICreateUser } from '../types/user.types'

export const userService = {
  async create(data: ICreateUser) {
    const response = await api.post('/user', data)
    return response.data
  },
}