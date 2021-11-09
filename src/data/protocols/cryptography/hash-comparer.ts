export interface HashedComparer {
  compare: (password: string, hash: string) => Promise<boolean>
}
