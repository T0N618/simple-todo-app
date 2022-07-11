import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization
  if (!authHeaders || !authHeaders.startsWith('Bearer ')) return next()
  const token = authHeaders.split(' ')[1]

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err) return next()
      req.userId = decoded.sub
      next()
    }
  )
}

export { verifyJwt }
