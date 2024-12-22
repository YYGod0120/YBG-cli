
export default {
  testEnvironment: "node",
  preset:'ts-jest',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts?$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.test.json' // 使用测试专用的 tsconfig
    }]
  },
};