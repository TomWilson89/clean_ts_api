export interface SurveyModel {
  question: string
  answers: SurveyAnswersModel[]
  date: Date
  id: string
}

export interface SurveyAnswersModel {
  image?: string
  answer: string
}
