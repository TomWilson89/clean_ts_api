import { AuthMiddleware } from '../../../presentation/middlewares'
import { Middleware } from '../../../presentation/protocols'
import { makeDbLoadAccountByToken } from '../usecase'

export const makeAuthMiddleware = (role?: string): Middleware => {
  const authMiddleware = new AuthMiddleware(makeDbLoadAccountByToken(), role)
  return authMiddleware
}
