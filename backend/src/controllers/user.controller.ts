import { Request, Response } from 'express'
import { UserModel } from '../models'

const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find()
  return res.status(200).json({ status: 'success', data: users })
}

const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id

  const user = await UserModel.findById(id)

  return res.status(200).json({ data: user })
}

const deleteAllUsers = async (req: Request, res: Response) => {
  await UserModel.deleteMany({})
  return res.status(204).json({ status: 'success' })
}

export { getAllUsers, getUserById, deleteAllUsers }
