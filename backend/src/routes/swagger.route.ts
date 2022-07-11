import path from 'path'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

const swaggerDocument = YAML.load(
  path.join(__dirname, '..', '..', 'swagger.yml')
)

const swaggerRoute = express.Router()

swaggerRoute.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export { swaggerRoute }
