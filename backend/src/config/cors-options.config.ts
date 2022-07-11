import { CorsOptions } from 'cors'
import { allowedOrigin } from './allowed-origin.config'

const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (!requestOrigin || allowedOrigin.indexOf(requestOrigin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200,
}

export { corsOptions }
