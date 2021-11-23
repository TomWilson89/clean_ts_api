export type SurveyModel = {
  question: string
  answers: SurveyAnswersModel[]
  date: Date
  id: string
}

export type SurveyAnswersModel = {
  image?: string
  answer: string
}
