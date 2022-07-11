import { NextFunction, Request, Response } from 'express'

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.userId) return res.status(401).json({ error: 'Unauthorized route' })
  return next()
}

export { requireUser }
