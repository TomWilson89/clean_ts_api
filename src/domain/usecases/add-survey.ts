export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}

export interface AddSurveyModel {
  question: string
  answers: SurveyAnswers[]
}

export interface SurveyAnswers {
  image?: string
  answer: string
}
