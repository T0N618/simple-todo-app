import mongoose from 'mongoose'

interface TaskDocument extends mongoose.Document {
  title: string
  description: string
  status: 'todo' | 'inprogress' | 'completed'
  userId: string
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['todo', 'inprogress', 'completed'],
      default: 'todo',
    },
    userId: { type: mongoose.Types.ObjectId, required: true },
  },
  { timestamps: true }
)

const TaskModel = mongoose.model<TaskDocument>('Task', taskSchema)

export { TaskModel }
