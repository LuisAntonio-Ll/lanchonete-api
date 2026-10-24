module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coverageThreshold: {
    global: {
      lines: 40,
      statements: 40,
    },
  },
  coverageDirectory: 'coverage',
};