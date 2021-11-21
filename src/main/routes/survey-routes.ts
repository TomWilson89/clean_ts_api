import { Router } from 'express'
import { adaptMiddleware, adaptRoute } from '../adapters'
import { makeAddSurveyController } from '../factories'
import { makeAuthMiddleware } from '../factories/middlewares'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
}
