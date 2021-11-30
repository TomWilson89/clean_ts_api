import express, { Express } from 'express'
import { join } from 'path'

export default (app: Express): void => {
  app.use('/static', express.static(join(__dirname, '../../static')))
}
