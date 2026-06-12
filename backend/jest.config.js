/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: {
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
      },
    }],
  },
  setupFiles: ['<rootDir>/../test/setup.ts'],
  testEnvironment: 'node',
  forceExit: true,
  openHandlesTimeout: 3000,
  verbose: true,
  testTimeout: 60000,
};
