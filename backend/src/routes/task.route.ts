import express from 'express'
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from '../controllers'
import { requireUser } from '../middlewares'

const taskRoute = express.Router()

taskRoute.use(requireUser)
taskRoute.get('/', getAllTasks)
taskRoute.get('/:id', getTaskById)
taskRoute.post('/', createTask)
taskRoute.patch('/:id', updateTask)
taskRoute.delete('/:id', deleteTask)

export { taskRoute }
