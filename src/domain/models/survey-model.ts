export type SurveyModel = {
  question: string
  answers: SurveyAnswersModel[]
  date: Date
  id: string
}
type SurveyAnswersModel = {
  image?: string
  answer: string
}
