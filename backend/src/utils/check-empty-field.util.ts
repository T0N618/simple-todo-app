import { Request, Response } from 'express'

const checkFields = (req: Request, res: Response, fields: string[]) => {
  const emptyFields: string[] = []
  fields.forEach((field) => {
    if (!req.body[field]) {
      emptyFields.push(field)
    }
  })

  if (emptyFields.length !== 0) {
    return res
      .status(400)
      .json({ error: `${emptyFields.join(',')} are required` })
  }
}

export { checkFields }
