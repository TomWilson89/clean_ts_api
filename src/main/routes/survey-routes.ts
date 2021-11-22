import { Router } from 'express'
import { adaptMiddleware, adaptRoute } from '../adapters'
import {
  makeAddSurveyController,
  makeLoadSurveysController
} from '../factories'
import { makeAuthMiddleware } from '../factories/middlewares'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware('user'))

  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
