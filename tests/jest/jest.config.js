module.exports = {
  verbose: true,
  testMatch: ['<rootDir>/**/*.tests.ts?(x)'],
  rootDir: '../../src',
  transform: {
    '^.+\\.[j|t]sx?$': '@swc/jest',
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/(?!uuid)'],
  setupFiles: ['../tests/jest/setup.js'],
  setupFilesAfterEnv: ['../tests/jest/startup.ts'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/../coverage',
  collectCoverageFrom: [
    './**/*.ts?(x)',
    '!./**/*.tests.ts?(x)',
    '!./**/index.ts?(x)',
  ],
  reporters: ['default', ['jest-junit', { outputDirectory: './coverage' }]],
  coverageReporters: ['text-summary', 'lcov', 'json-summary'],
};