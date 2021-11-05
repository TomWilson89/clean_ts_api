import { BcryptAdapter } from '@/infra'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => {
    return await Promise.resolve('hash')
  }
}))
interface SutTypes {
  sut: BcryptAdapter
}

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return {
    sut
  }
}
describe('BcryptAdapter', () => {
  test('should call bcrypt with corect values', async () => {
    const { sut } = makeSut()
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(encryptSpy).toHaveBeenCalledWith('any_value', 12)
  })
})
