import mongoose, { Schema } from 'mongoose'

export interface IUser {
  email: string
  nickname: string
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
})

const UserModel = mongoose.model('User', userSchema)

export default UserModel
