export interface AddSurvey {
  add: (data: AddSurvey.Params) => Promise<void>
}

export namespace AddSurvey {
  export type Params = {
    question: string
    answers: SurveyAnswersModel[]
    date: Date
    didAnswer?: boolean
  }

  type SurveyAnswersModel = {
    image?: string
    answer: string
  }
}
