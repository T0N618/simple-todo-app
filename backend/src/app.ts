import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { connectDB, corsOptions } from './config'
import { credentials, logger, verifyJwt } from './middlewares'
import { authRoute, swaggerRoute, taskRoute, userRoute } from './routes'

const app = express()

app.use(credentials)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use(verifyJwt)

app.use(swaggerRoute)
app.use('/api/v1/', authRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/tasks', taskRoute)

console.log('###########################', process.env.EMAIL_FROM)
console.log('###########################3', process.env.PORT)
console.log('###########################3', process.env.DATABASE_URI)

app.all('*', (req, res) => {
  res.status(404).json({ message: '404 Not Found' })
})

const port = process.env.PORT || 5000
connectDB().then(() => {
  app.listen(port, () =>
    logger.info(`App is running at http://localhost:${port}`)
  )
})
