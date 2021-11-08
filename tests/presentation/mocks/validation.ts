import { Validation } from '../../../src/presentation/protocols'

export class ValidationStub implements Validation {
  validate(input: any): Error {
    return null
  }
}
