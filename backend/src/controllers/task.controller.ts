import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { logger } from '../middlewares'
import { TaskModel } from '../models'
import { checkFields } from '../utils'

const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.find({})
    return res.status(200).json({ status: 'success', data: tasks })
  } catch (err: any) {
    logger.error(err)
    return res.status(400).json({ error: 'Something went wrong' })
  }
}

const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: 'Task not found' })

    const task = await TaskModel.findById(id)

    if (!task) return res.status(400).json({ error: 'Task not found' })

    return res.status(200).json({ data: task })
  } catch (err: any) {
    logger.error(err)
    return res.status(400).json({ error: 'Something went wrong' })
  }
}

const createTask = async (req: Request, res: Response) => {
  checkFields(req, res, ['title', 'description', 'status'])
  if (res.headersSent) return

  try {
    const { title, description, status } = req.body
    const userId = req.userId

    if (!userId)
      return res
        .status(400)
        .json({ error: 'You must login first before create task' })

    const newTaskInput = { title, description, status, userId }

    const newTask = await TaskModel.create({ ...newTaskInput })

    return res.status(201).json({ data: newTask })
  } catch (err: any) {
    logger.error(err)
    return res.status(400).json({ error: 'Something went wrong' })
  }
}

const updateTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id

    delete req.body['userId']

    const task = await TaskModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    )

    return res.status(200).json({ data: task })
  } catch (err: any) {
    logger.error(err)
    return res.status(400).json({ error: 'Something went wrong' })
  }
}

const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id

    await TaskModel.findByIdAndDelete(id)

    return res.sendStatus(204)
  } catch (err: any) {
    logger.error(err)
    return res.status(400).json({ error: 'Something went wrong' })
  }
}

export { getAllTasks, getTaskById, createTask, updateTask, deleteTask }
