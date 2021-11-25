import { makeSurveyResultController } from '@main/factories/controllers/save-survey-result'
import { Router } from 'express'
import { adaptRoute } from '../adapters'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeSurveyResultController())
  )
}
