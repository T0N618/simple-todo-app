import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

interface UserDocument extends mongoose.Document {
  email: string
  password: string
  username: string
  role: string
  refreshToken: string
  resetToken: { token: string; expires: Date }
  createdAt: Date
  updatedAt: Date
  comparePassword(data: string): Promise<boolean>
}

const ResetSchema = new mongoose.Schema({
  token: String,
  expires: Date,
})

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    username: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshToken: String,
    resetToken: ResetSchema,
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  const user = this as UserDocument
  if (!user.isModified('password')) return next()

  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(user.password, salt)
  user.password = hashed

  next()
})

userSchema.methods.comparePassword = async function (
  data: string
): Promise<boolean> {
  const user = this as UserDocument

  return bcrypt.compare(data, user.password).catch((e) => false)
}

const UserModel = mongoose.model<UserDocument>('User', userSchema)

export { UserDocument, UserModel }
