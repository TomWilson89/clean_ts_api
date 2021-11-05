import { Express } from 'express'
import { bodyParser } from '../middlewares'
import { cors } from '../middlewares/cors'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
}
