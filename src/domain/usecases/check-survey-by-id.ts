export interface CheckSurveysById {
  checkById: (id: string) => Promise<CheckSurveysById.Result>
}

export namespace CheckSurveysById {
  export type Result = boolean
}
