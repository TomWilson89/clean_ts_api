import { LogErrorRepository } from '@data/protocols'
import { Controller, HttpResponse } from '@presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(request: any): Promise<HttpResponse> {
    const httpRespose = await this.controller.handle(request)
    if (httpRespose.statusCode === 500) {
      await this.logErrorRepository.logError(httpRespose.body.stack)
    }

    return httpRespose
  }
}
