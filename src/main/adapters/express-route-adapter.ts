import { Controller, HttpRequest } from '@/presentation/protocols'
import { NextFunction, Request, RequestHandler, Response } from 'express'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const hhtpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(hhtpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
