import jwt from 'jsonwebtoken'
import { Decrypter, Encrypter } from '../../../src/data/protocols'
import { JwtAdapter } from '../../../src/infra'

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => {
    return 'any_token'
  },
  verify: async (): Promise<string> => {
    return 'any_value'
  }
}))

interface SutTYpes {
  sut: Encrypter & Decrypter
}

const makeSut = (secret = 'secret'): SutTYpes => {
  const sut = new JwtAdapter(secret)

  return {
    sut
  }
}

describe('JwtAdapter', () => {
  describe('sign()', () => {
    test('should call sign with correct values', async () => {
      const { sut } = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      const id = 'any_id'
      await sut.encrypt(id)
      expect(signSpy).toHaveBeenCalledWith({ id }, 'secret')
    })

    test('should return encrypted token on success', async () => {
      const { sut } = makeSut()
      const id = 'any_id'
      const accessToken = await sut.encrypt(id)
      expect(accessToken).toBe('any_token')
    })

    test('should throws if sign throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const id = 'any_id'
      const promise = sut.encrypt(id)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('should call verify with correct values', async () => {
      const { sut } = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      const token = 'any_token'
      await sut.decrypt(token)
      expect(verifySpy).toHaveBeenCalledWith(token, 'secret')
    })
  })
})
