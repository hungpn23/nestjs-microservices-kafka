export default {
  moduleFileExtensions: ['js', 'json', 'ts'],

  roots: ['<rootDir>/apps', '<rootDir>/libs'],

  testRegex: '.*\\.spec\\.ts$',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  moduleNameMapper: {
    '^@gateway/(.*)$': '<rootDir>/apps/gateway/$1',
    '^@user/(.*)$': '<rootDir>/apps/user/$1',
    '^@product/(.*)$': '<rootDir>/apps/product/$1',
    '^@libs/(.*)$': '<rootDir>/libs/$1',
  },

  coverageDirectory: '<rootDir>/coverage',

  collectCoverageFrom: [
    'apps/**/*.ts',
    'libs/**/*.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],

  testEnvironment: 'node',

  clearMocks: true,
};
