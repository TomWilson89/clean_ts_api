import { HashComparer } from '@data/protocols'

export class HashCompareSpy implements HashComparer {
  plainPassword: string
  hash: string
  result: boolean = true

  async compare(plainPassword: string, hash: string): Promise<boolean> {
    this.plainPassword = plainPassword
    this.hash = hash
    return this.result
  }
}
