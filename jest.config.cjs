module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { customExportConditions: ['node', 'node-addons'] },
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  setupFiles: ['<rootDir>/tests/polyfills.cjs'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  transform: { '^.+\\.(?:[jt]sx?|mjs)$': 'babel-jest' },
  transformIgnorePatterns: ['/node_modules/(?!(?:estree.*|@open-draft|rettime|msw|@mswjs|@bundled-es-modules|until-async|react-markdown|remark.*|rehype.*|unified|vfile.*|unist.*|mdast.*|micromark.*|decode-named-character-reference|character-entities.*|bail|trough|is-plain-obj|devlop|property-information|hast.*|comma-separated-tokens|space-separated-tokens|zwitch|ccount|escape-string-regexp|markdown-table|longest-streak|trim-lines|html-url-attributes)/)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css)$': '<rootDir>/tests/styleMock.cjs',
    '\\.(jpg|png|svg|webp)$': '<rootDir>/tests/fileMock.cjs',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx,js}', '!src/**/*.d.ts'],
  coverageThreshold: { global: { lines: 50 } },
  coverageReporters: ['text', 'html', 'lcov', 'json-summary'],
  maxWorkers: 2,
  testTimeout: 15000,
};
