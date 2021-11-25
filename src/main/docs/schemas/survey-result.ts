export const surveyResultSchema = {
  type: 'object',
  properties: {
    surveyId: {
      type: 'string'
    },
    accountId: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyResultAnswers'
      }
    },
    date: {
      type: 'string'
    }
  },
  required: ['surveyId', 'question', 'answers', 'date']
}
