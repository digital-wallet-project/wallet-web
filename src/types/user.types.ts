export enum RoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUser {
  id: string
  name: string
  email: string
  role: RoleEnum
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ICreateUser {
  name: string
  email: string
  password: string
}