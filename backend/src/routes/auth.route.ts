import express from 'express'
import {
  forgotPassword,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
} from '../controllers'

const authRoute = express.Router()

authRoute.post('/register', register)
authRoute.post('/login', login)
authRoute.post('/refresh', refreshToken)
authRoute.post('/logout', logout)
authRoute.post('/reset-password', resetPassword)
authRoute.post('/forgot-password', forgotPassword)

export { authRoute }
