module.exports = {
  collectCoverage: true,
  roots: ['<rootDir>/tests'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  testEnvironment: 'node',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@infra/(.*)': '<rootDir>/src/infra/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@data/(.*)': '<rootDir>/src/data/$1',
    '@main/(.*)': '<rootDir>/src/main/$1',
    '@presentation/(.*)': '<rootDir>/src/presentation/$1',
    '@validations/(.*)': '<rootDir>/src/validations/$1'
  }
}
