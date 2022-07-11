import express from 'express'
import { deleteAllUsers, getAllUsers, getUserById } from '../controllers'

const userRoute = express.Router()

userRoute.get('/', getAllUsers)
userRoute.get('/:id', getUserById)
userRoute.delete('/', deleteAllUsers)

export { userRoute }
