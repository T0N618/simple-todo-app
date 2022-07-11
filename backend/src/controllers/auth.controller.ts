import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { UserModel, UserDocument } from '../models'
import { logger } from '../middlewares'
import { checkFields } from '../utils'
import { sendEmail } from '../utils/send-email.util'

const _createToken = async (
  res: Response,
  statusCode: number,
  user: UserDocument
): Promise<void> => {
  const accessToken = jwt.sign(
    { sub: user._id },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '1h' }
  )
  const refreshToken = jwt.sign(
    { sub: user._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '1d' }
  )

  user.refreshToken = refreshToken
  await user.save()

  res.cookie('jwt', refreshToken, { httpOnly: true, secure: true })
  res.status(statusCode).json({ accessToken })
}

const register = async (req: Request, res: Response) => {
  checkFields(req, res, ['email', 'password', 'username'])
  if (res.headersSent) return

  try {
    const { email, password, username } = req.body
    const newUser = await UserModel.create({ email, password, username })

    _createToken(res, 201, newUser)
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email is duplicated' })
    }
    return res.status(400).json({ error: 'Something went wrong' })
  }
}

const login = async (req: Request, res: Response) => {
  checkFields(req, res, ['email', 'password'])
  if (res.headersSent) return

  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email }).select('+password')
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const isMatchPwd = await user.comparePassword(password)
    if (!isMatchPwd)
      return res.status(401).json({ error: 'Invalid credentials' })

    _createToken(res, 200, user)
  } catch (err: any) {
    logger.error(err)
    return res.status(400).json({ error: 'Something went wrong' })
  }
}

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.jwt
  console.log(refreshToken)
  if (!refreshToken) return res.status(401).json({ error: 'Unauthorized' })
  // res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' })
  res.clearCookie('jwt')

  const foundUser = await UserModel.findOne({ refreshToken })

  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: any, decoded: any) => {
        if (err) res.status(403).json({ error: 'refreshToken reused' })
        const hackedUser = await UserModel.findOne({ _id: decoded.sub })
        if (hackedUser) {
          hackedUser.refreshToken = ''
          await hackedUser.save()
        }
      }
    )
    return res.status(403).json({ error: 'refreshToken reused' })
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    async (err: any, decoded: any) => {
      if (err) {
        logger.error('expired refresh token')
        foundUser.refreshToken = ''
        await foundUser.save()
      }
      if (err || foundUser._id.toString() !== decoded.sub) {
        return res.status(403).json({ error: 'refreshToken reused' })
      }

      _createToken(res, 200, foundUser)
    }
  )
}

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.jwt
  if (!refreshToken) {
    logger.error('no refreshToken')
    return res.sendStatus(204)
  }

  const foundUser = await UserModel.findOne({ refreshToken })
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, secure: true })
    return res.sendStatus(204)
  }

  foundUser.refreshToken = ''
  await foundUser.save()

  res.clearCookie('jwt', { httpOnly: true, secure: true })
  return res.sendStatus(204)
}

const forgotPassword = async (req: Request, res: Response) => {
  checkFields(req, res, ['email'])
  if (res.headersSent) return

  try {
    const { email } = req.body
    const origin = req.originalUrl

    const user = await UserModel.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Invalid email' })

    const token = crypto.randomBytes(40).toString('hex')
    user.resetToken = {
      token,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    }

    await user.save()

    await sendPasswordResetEmail(user, origin)
    console.log('done sendEmail')

    res
      .status(200)
      .json({ message: 'Reset password already sent to your email' })
  } catch (err) {}
}

const sendPasswordResetEmail = async (user: UserDocument, origin: string) => {
  let message
  if (origin) {
    const resetUrl = `${origin}/reset-password?token=${user.resetToken.token}`
    message = `
      <p>Please click the link below to reset your password, the link will be expire in 15 minutes.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
    `
  } else {
    message = `
      <p>Please use the token below to reset your password with the <code>/reset-password</code> api route:</p>
      <p><code>${user.resetToken.token}</code></p>
    `
  }
  const html = `
    <h4>Reset Password Email</h4>
    ${message}
  `

  console.log('sending passwrodRestEmail')

  await sendEmail(user.email, 'Sign Up: Reset Password', html)
}

const resetPassword = async (req: Request, res: Response) => {
  const token = req.query.token
  const { password } = req.body

  const user = await UserModel.findOne({
    // resetToken: { token: token },
    'resetToken.token': token,
    'resetToken.expires': { $gt: Date.now() },
  })

  console.log(user)

  if (!user) return res.status(400).json({ error: 'Something went wrong' })
  user.resetToken.expires = new Date()
  user.resetToken.token = ''

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  user.password = hash

  await user.save()

  return res
    .status(200)
    .json({ message: 'Password reset successful, you can now login' })
}

export { register, login, refreshToken, logout, forgotPassword, resetPassword }
