import { NextFunction, Request, Response } from 'express'
import { allowedOrigin } from '../config'

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin

  if (origin && allowedOrigin.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true')
  }

  next()
}

export { credentials }
