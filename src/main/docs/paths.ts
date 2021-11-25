import { loginPath, signUpPath, surveyPaths, surveyResultPath } from './paths/'

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': surveyPaths,
  '/surveys/{surveyId}/results': surveyResultPath
}
