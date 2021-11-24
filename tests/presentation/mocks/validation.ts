import { Validation } from '@presentation/protocols'

export class ValidationStub implements Validation {
  validate(input: any): Error {
    return null
  }
}
