import { LogErrorRepository } from '@/data/protocols'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpRespose = await this.controller.handle(httpRequest)
    if (httpRespose.statusCode === 500) {
      await this.logErrorRepository.log(httpRespose.body.stack)
    }

    return httpRespose
  }
}
