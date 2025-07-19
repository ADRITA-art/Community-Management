module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};