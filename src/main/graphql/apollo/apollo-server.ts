import { makeExecutableSchema } from '@graphql-tools/schema'
import resolvers from '@main/graphql/resolvers'
import typeDefs from '@main/graphql/type-defs'
import { ApolloServer } from 'apollo-server-express'
import { authDirectiveTransformer } from '../directives'

let schema = makeExecutableSchema({ resolvers, typeDefs })
schema = authDirectiveTransformer(schema)

export const setupApolloServer = (): ApolloServer =>
  new ApolloServer({
    schema
  })
