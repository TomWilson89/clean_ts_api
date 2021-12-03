import { makeExecutableSchema } from '@graphql-tools/schema'
import resolvers from '@main/graphql/resolvers'
import typeDefs from '@main/graphql/type-defs'
import { ApolloServer } from 'apollo-server-express'
import { GraphQLError } from 'graphql'
import { authDirectiveTransformer } from '../directives'

let schema = makeExecutableSchema({ resolvers, typeDefs })
schema = authDirectiveTransformer(schema)

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(
    (name) => name === errorName
  )
}

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors.forEach((error) => {
    response.data = undefined
    if (checkError(error, 'UserInputError')) {
      response.http.status = 400
    } else if (checkError(error, 'AuthenticationError')) {
      response.http.status = 401
    } else if (checkError(error, 'ForbiddenError')) {
      response.http.status = 403
    } else {
      response.http.status = 500
    }
  })
}

export const setupApolloServer = (): ApolloServer =>
  new ApolloServer({
    schema,
    plugins: [
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response, errors }) =>
            handleErrors(response, errors)
        })
      }
    ]
  })
