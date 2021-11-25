export const surveyResultPath = {
  put: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Survey'],
    summary: 'API to create survey response',
    description: 'this API can only by executed by authenticated users',
    parameters: [
      {
        in: 'path',
        name: 'surveyId',
        description: 'Id of survey to be respond',
        required: true,
        schema: {
          type: 'string'
        }
      }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Survey response created successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
