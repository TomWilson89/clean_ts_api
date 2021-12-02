export type SurveyModel = {
  question: string
  answers: SurveyAnswersModel[]
  date: Date
  id: string
  didAnswer?: boolean
}
type SurveyAnswersModel = {
  image?: string
  answer: string
}
