import { Types } from 'mongoose'

export type User = {
  _id: Types.ObjectId
  email: string
  password: string
  createdAt: string
}

export type UserInput = Pick<User, 'email' | 'password'>
