import { Controller } from '@presentation/protocols'

export const adaptResolver = async (
  controller: Controller,
  args: any
): Promise<any> => {
  const request: any = {
    ...(args || {})
  }
  const httpResponse = await controller.handle(request)
  return httpResponse.body
}
