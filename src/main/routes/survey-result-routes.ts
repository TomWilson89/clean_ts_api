import {
  makeLoadSurveyResultController,
  makeSaveSurveyResultController
} from '@main/factories'
import { Router } from 'express'
import { adaptRoute } from '../adapters'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeSaveSurveyResultController())
  )

  router.get(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeLoadSurveyResultController())
  )
}
