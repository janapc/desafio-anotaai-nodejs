/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@entities/(.*)$': '<rootDir>/src/entities/$1',
      '^@infra/(.*)$': '<rootDir>/src/infra/$1',
      '^@usecases/(.*)$': '<rootDir>/src/usecases/$1'
    }
  };