import mongoose from 'mongoose'
import { logger } from '../middlewares/logger.middleware'

const connectDB = async () => {
  const dbUri = process.env.DATABASE_URI as string
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    logger.info('DB connected')
  } catch (err: any) {
    logger.error(err)
  }
}

export { connectDB }
